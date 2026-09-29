using Catalogo.Domain.Entities;

namespace Catalogo.Domain.Contracts;

public interface ILibroRepository
{
    Task<Libro?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Libro>> ObtenerPaginadoAsync(int pagina, int tamanio, CancellationToken cancellationToken = default);
    Task<bool> ActualizarStockAsync(int id, int nuevoStockDisponible, CancellationToken cancellationToken = default);
}
