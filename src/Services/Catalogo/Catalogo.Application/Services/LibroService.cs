using Catalogo.Application.DTOs;
using Catalogo.Domain.Contracts;

namespace Catalogo.Application.Services;

public class LibroService : ILibroService
{
    private readonly ILibroRepository _libroRepository;

    public LibroService(ILibroRepository libroRepository)
    {
        _libroRepository = libroRepository ?? throw new ArgumentNullException(nameof(libroRepository));
    }

    public async Task<IReadOnlyList<LibroDto>> ObtenerCatalogoAsync(int pagina, int tamanio, CancellationToken cancellationToken = default)
    {
        var paginaValida = pagina <= 0 ? 1 : pagina;
        var tamanioValido = tamanio <= 0 ? 10 : tamanio;

        var libros = await _libroRepository.ObtenerPaginadoAsync(paginaValida, tamanioValido, cancellationToken);
        return libros.Select(l => new LibroDto(
            l.Id,
            l.Isbn,
            l.Titulo,
            l.AutorId,
            l.AutorNombre,
            l.StockTotal,
            l.StockDisponible,
            l.Estado.ToString()
        )).ToList();
    }

    public async Task<LibroDto?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var libro = await _libroRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (libro is null) return null;

        return new LibroDto(
            libro.Id,
            libro.Isbn,
            libro.Titulo,
            libro.AutorId,
            libro.AutorNombre,
            libro.StockTotal,
            libro.StockDisponible,
            libro.Estado.ToString()
        );
    }

    public async Task<bool> AjustarStockAsync(int id, AjustarStockRequestDto request, CancellationToken cancellationToken = default)
    {
        var libro = await _libroRepository.ObtenerPorIdAsync(id, cancellationToken);
        if (libro is null) return false;

        if (string.Equals(request.Operacion, "Disminuir", StringComparison.OrdinalIgnoreCase))
        {
            libro.DisminuirStock(request.Cantidad);
        }
        else if (string.Equals(request.Operacion, "Incrementar", StringComparison.OrdinalIgnoreCase))
        {
            libro.IncrementarStock(request.Cantidad);
        }
        else
        {
            throw new ArgumentException("Operacion no valida. Debe ser 'Disminuir' o 'Incrementar'.", nameof(request.Operacion));
        }

        return await _libroRepository.ActualizarStockAsync(libro.Id, libro.StockDisponible, cancellationToken);
    }
}
