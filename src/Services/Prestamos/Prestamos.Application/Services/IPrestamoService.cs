using Prestamos.Application.DTOs;

namespace Prestamos.Application.Services;

public interface IPrestamoService
{
    Task<int> RegistrarPrestamoAsync(CrearPrestamoRequestDto request, CancellationToken cancellationToken = default);
    Task<bool> DevolverLibroAsync(int prestamoId, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<PrestamoDto>> ObtenerActivosAsync(CancellationToken cancellationToken = default);
}
