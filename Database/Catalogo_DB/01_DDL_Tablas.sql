-- ==============================================================
-- DATABASE: DB_Catalogo (Microservicio de Catalogo de Libros)
-- SCRIPT 01: DDL de Tablas y Restricciones
-- ==============================================================
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Autores')
BEGIN
    CREATE TABLE Autores (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Autores PRIMARY KEY,
        Nombre NVARCHAR(150) NOT NULL,
        Nacionalidad NVARCHAR(100) NOT NULL,
        FechaCreacion DATETIME2 NOT NULL CONSTRAINT DF_Autores_FechaCreacion DEFAULT GETUTCDATE()
    );
END;

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Libros')
BEGIN
    CREATE TABLE Libros (
        Id INT IDENTITY(1,1) CONSTRAINT PK_Libros PRIMARY KEY,
        Isbn NVARCHAR(20) NOT NULL CONSTRAINT UQ_Libros_Isbn UNIQUE,
        Titulo NVARCHAR(200) NOT NULL,
        AutorId INT NOT NULL CONSTRAINT FK_Libros_Autores FOREIGN KEY REFERENCES Autores(Id),
        StockTotal INT NOT NULL CONSTRAINT CK_Libros_StockTotal CHECK (StockTotal >= 0),
        StockDisponible INT NOT NULL CONSTRAINT CK_Libros_StockDisponible CHECK (StockDisponible >= 0),
        Estado NVARCHAR(20) NOT NULL CONSTRAINT DF_Libros_Estado DEFAULT 'Disponible'
    );
END;
