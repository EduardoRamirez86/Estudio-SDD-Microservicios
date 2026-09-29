using Catalogo.Domain.Enums;

namespace Catalogo.Domain.Entities;

public class Libro
{
    public int Id { get; private set; }
    public string Isbn { get; private set; } = string.Empty;
    public string Titulo { get; private set; } = string.Empty;
    public int AutorId { get; private set; }
    public string? AutorNombre { get; private set; }
    public int StockTotal { get; private set; }
    public int StockDisponible { get; private set; }
    public EstadoLibro Estado { get; private set; }

    private Libro() { }

    public Libro(int id, string isbn, string titulo, int autorId, int stockTotal, int stockDisponible, EstadoLibro estado, string? autorNombre = null)
    {
        if (string.IsNullOrWhiteSpace(isbn))
            throw new ArgumentException("El ISBN es requerido.", nameof(isbn));

        if (string.IsNullOrWhiteSpace(titulo))
            throw new ArgumentException("El titulo es requerido.", nameof(titulo));

        if (autorId <= 0)
            throw new ArgumentException("El AutorId debe ser un identificador valido.", nameof(autorId));

        if (stockTotal < 0)
            throw new ArgumentException("El stock total no puede ser negativo.", nameof(stockTotal));

        if (stockDisponible < 0 || stockDisponible > stockTotal)
            throw new ArgumentException("El stock disponible debe ser coherente con el stock total.", nameof(stockDisponible));

        Id = id;
        Isbn = isbn.Trim();
        Titulo = titulo.Trim();
        AutorId = autorId;
        StockTotal = stockTotal;
        StockDisponible = stockDisponible;
        Estado = estado;
        AutorNombre = autorNombre;
    }

    public bool TieneStockDisponible() => StockDisponible > 0 && Estado == EstadoLibro.Disponible;

    public void DisminuirStock(int cantidad)
    {
        if (cantidad <= 0)
            throw new ArgumentException("La cantidad debe ser mayor a cero.", nameof(cantidad));

        if (StockDisponible < cantidad)
            throw new InvalidOperationException($"Stock insuficiente. Disponible: {StockDisponible}, Solicitado: {cantidad}");

        StockDisponible -= cantidad;
        if (StockDisponible == 0)
        {
            Estado = EstadoLibro.Agotado;
        }
    }

    public void IncrementarStock(int cantidad)
    {
        if (cantidad <= 0)
            throw new ArgumentException("La cantidad debe ser mayor a cero.", nameof(cantidad));

        if (StockDisponible + cantidad > StockTotal)
            throw new InvalidOperationException("El stock disponible no puede superar el stock total registrado.");

        StockDisponible += cantidad;
        if (StockDisponible > 0 && Estado == EstadoLibro.Agotado)
        {
            Estado = EstadoLibro.Disponible;
        }
    }
}
