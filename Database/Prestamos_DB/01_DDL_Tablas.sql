-- ==============================================================
-- DATABASE: DB_Prestamos (Microservicio de Prestamos)
-- SCRIPT 01: DDL de Tablas y Restricciones
-- ==============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Prestamos')
BEGIN
    CREATE TABLE Prestamos (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Prestamos PRIMARY KEY,
        LibroId INT NOT NULL, -- Clave logica foranea hacia DB_Catalogo
        UsuarioIdentificacion NVARCHAR(50) NOT NULL,
        UsuarioNombre NVARCHAR(150) NOT NULL,
        FechaPrestamo DATETIME2 NOT NULL CONSTRAINT DF_Prestamos_FechaPrestamo DEFAULT GETUTCDATE(),
        FechaDevolucionEsperada DATETIME2 NOT NULL,
        FechaDevolucionReal DATETIME2 NULL,
        Estado NVARCHAR(20) NOT NULL CONSTRAINT DF_Prestamos_Estado DEFAULT 'Activo'
    );
END;
