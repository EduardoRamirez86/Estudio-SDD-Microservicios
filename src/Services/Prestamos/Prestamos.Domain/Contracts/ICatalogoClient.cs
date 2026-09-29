namespace Prestamos.Domain.Contracts;

public interface ICatalogoClient
{
    Task<bool> VerificarDisponibilidadLibroAsync(int libroId, CancellationToken cancellationToken = default);
    Task<bool> ReducirStockLibroAsync(int libroId, CancellationToken cancellationToken = default);
    Task<bool> AumentarStockLibroAsync(int libroId, CancellationToken cancellationToken = default);
}
