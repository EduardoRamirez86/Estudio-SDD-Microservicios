-- ==============================================================
-- DATABASE: DB_Prestamos
-- SCRIPT 03: Semillas de Prueba (Data Seeding)
-- ==============================================================
SET NOCOUNT ON;

IF NOT EXISTS (SELECT 1 FROM Prestamos)
BEGIN
    INSERT INTO Prestamos (LibroId, UsuarioIdentificacion, UsuarioNombre, FechaPrestamo, FechaDevolucionEsperada, Estado)
    VALUES 
    (1, '06138859-0', 'Eduardo Ramirez', DATEADD(DAY, -2, GETUTCDATE()), DATEADD(DAY, 5, GETUTCDATE()), 'Activo'),
    (2, '05123456-7', 'Maria Hernandez', DATEADD(DAY, -10, GETUTCDATE()), DATEADD(DAY, -3, GETUTCDATE()), 'Vencido');
END;
