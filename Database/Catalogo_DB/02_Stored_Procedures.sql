-- ==============================================================
-- DATABASE: DB_Catalogo
-- SCRIPT 02: Stored Procedures (SPs)
-- ==============================================================
CREATE OR ALTER PROCEDURE sp_ObtenerCatalogoLibros
    @Pagina INT = 1,
    @Tamanio INT = 10
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        l.Id,
        l.Isbn,
        l.Titulo,
        l.AutorId,
        a.Nombre AS AutorNombre,
        l.StockTotal,
        l.StockDisponible,
        CASE l.Estado 
            WHEN 'Disponible' THEN 1 
            WHEN 'Agotado' THEN 2 
            ELSE 3 
        END AS Estado
    FROM Libros l
    INNER JOIN Autores a ON l.AutorId = a.Id
    ORDER BY l.Id ASC
    OFFSET (@Pagina - 1) * @Tamanio ROWS
    FETCH NEXT @Tamanio ROWS ONLY;
END;
GO

CREATE OR ALTER PROCEDURE sp_ObtenerLibroPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        l.Id,
        l.Isbn,
        l.Titulo,
        l.AutorId,
        a.Nombre AS AutorNombre,
        l.StockTotal,
        l.StockDisponible,
        CASE l.Estado 
            WHEN 'Disponible' THEN 1 
            WHEN 'Agotado' THEN 2 
            ELSE 3 
        END AS Estado
    FROM Libros l
    INNER JOIN Autores a ON l.AutorId = a.Id
    WHERE l.Id = @Id;
END;
GO

CREATE OR ALTER PROCEDURE sp_ActualizarStockLibro
    @Id INT,
    @NuevoStockDisponible INT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;

    BEGIN TRANSACTION;

    DECLARE @StockTotal INT;
    SELECT @StockTotal = StockTotal FROM Libros WHERE Id = @Id;

    IF @StockTotal IS NULL
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('El libro especificado no existe.', 16, 1);
        RETURN;
    END;

    IF @NuevoStockDisponible < 0 OR @NuevoStockDisponible > @StockTotal
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('El nuevo stock disponible no es coherente con el stock total.', 16, 1);
        RETURN;
    END;

    DECLARE @NuevoEstado NVARCHAR(20) = CASE WHEN @NuevoStockDisponible = 0 THEN 'Agotado' ELSE 'Disponible' END;

    UPDATE Libros
    SET StockDisponible = @NuevoStockDisponible,
        Estado = @NuevoEstado
    WHERE Id = @Id;

    COMMIT TRANSACTION;
    SELECT 1 AS Exito;
END;
GO
