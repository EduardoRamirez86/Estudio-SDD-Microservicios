using Prestamos.Domain.Entities;

namespace Prestamos.Domain.Contracts;

public interface IPrestamoRepository
{
    Task<int> RegistrarAsync(Prestamo prestamo, CancellationToken cancellationToken = default);
    Task<Prestamo?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default);
    Task<bool> FinalizarDevolucionAsync(int id, DateTime fechaDevolucion, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Prestamo>> ObtenerActivosAsync(CancellationToken cancellationToken = default);
}
