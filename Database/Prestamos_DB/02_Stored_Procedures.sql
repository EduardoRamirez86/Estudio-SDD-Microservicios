-- ==============================================================
-- DATABASE: DB_Prestamos
-- SCRIPT 02: Stored Procedures (SPs)
-- ==============================================================
CREATE OR ALTER PROCEDURE sp_RegistrarPrestamo
    @LibroId INT,
    @UsuarioIdentificacion NVARCHAR(50),
    @UsuarioNombre NVARCHAR(150),
    @FechaDevolucionEsperada DATETIME2,
    @NuevoId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Prestamos (
        LibroId, 
        UsuarioIdentificacion, 
        UsuarioNombre, 
        FechaPrestamo, 
        FechaDevolucionEsperada, 
        Estado
    )
    VALUES (
        @LibroId, 
        @UsuarioIdentificacion, 
        @UsuarioNombre, 
        GETUTCDATE(), 
        @FechaDevolucionEsperada, 
        'Activo'
    );

    SET @NuevoId = SCOPE_IDENTITY();
END;
GO

CREATE OR ALTER PROCEDURE sp_ObtenerPrestamoPorId
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        LibroId,
        UsuarioIdentificacion,
        UsuarioNombre,
        FechaPrestamo,
        FechaDevolucionEsperada,
        FechaDevolucionReal,
        CASE Estado 
            WHEN 'Activo' THEN 1 
            WHEN 'Devuelto' THEN 2 
            ELSE 3 
        END AS Estado
    FROM Prestamos
    WHERE Id = @Id;
END;
GO

CREATE OR ALTER PROCEDURE sp_FinalizarDevolucion
    @Id INT,
    @FechaDevolucion DATETIME2
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Prestamos
    SET FechaDevolucionReal = @FechaDevolucion,
        Estado = 'Devuelto'
    WHERE Id = @Id AND Estado = 'Activo';

    SELECT @@ROWCOUNT AS FilasAfectadas;
END;
GO

CREATE OR ALTER PROCEDURE sp_ListarPrestamosActivos
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        Id,
        LibroId,
        UsuarioIdentificacion,
        UsuarioNombre,
        FechaPrestamo,
        FechaDevolucionEsperada,
        FechaDevolucionReal,
        CASE Estado 
            WHEN 'Activo' THEN 1 
            WHEN 'Devuelto' THEN 2 
            ELSE 3 
        END AS Estado
    FROM Prestamos
    WHERE Estado = 'Activo'
    ORDER BY FechaDevolucionEsperada ASC;
END;
GO
