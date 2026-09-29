using Catalogo.Application.DTOs;

namespace Catalogo.Application.Services;

public interface ILibroService
{
    Task<IReadOnlyList<LibroDto>> ObtenerCatalogoAsync(int pagina, int tamanio, CancellationToken cancellationToken = default);
    Task<LibroDto?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> AjustarStockAsync(int id, AjustarStockRequestDto request, CancellationToken cancellationToken = default);
}
