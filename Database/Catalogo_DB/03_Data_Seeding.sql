-- ==============================================================
-- DATABASE: DB_Catalogo
-- SCRIPT 03: Semillas de Prueba (Data Seeding)
-- ==============================================================
SET NOCOUNT ON;

IF NOT EXISTS (SELECT 1 FROM Autores)
BEGIN
    INSERT INTO Autores (Nombre, Nacionalidad) VALUES 
    ('Gabriel Garcia Marquez', 'Colombiana'),
    ('Jorge Luis Borges', 'Argentina'),
    ('Isabel Allende', 'Chilena');
END;

IF NOT EXISTS (SELECT 1 FROM Libros)
BEGIN
    INSERT INTO Libros (Isbn, Titulo, AutorId, StockTotal, StockDisponible, Estado) VALUES
    ('978-0307474728', 'Cien Anios de Soledad', 1, 5, 5, 'Disponible'),
    ('978-0345806048', 'El Amor en los Tiempos del Colera', 1, 3, 3, 'Disponible'),
    ('978-8420658421', 'Ficciones', 2, 4, 4, 'Disponible'),
    ('978-8497592208', 'La Casa de los Espiritus', 3, 2, 2, 'Disponible');
END;
