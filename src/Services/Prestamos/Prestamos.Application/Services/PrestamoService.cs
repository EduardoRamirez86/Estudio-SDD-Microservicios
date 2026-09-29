using Prestamos.Application.DTOs;
using Prestamos.Domain.Contracts;
using Prestamos.Domain.Entities;

namespace Prestamos.Application.Services;

public class PrestamoService : IPrestamoService
{
    private readonly IPrestamoRepository _prestamoRepository;
    private readonly ICatalogoClient _catalogoClient;

    public PrestamoService(IPrestamoRepository prestamoRepository, ICatalogoClient catalogoClient)
    {
        _prestamoRepository = prestamoRepository ?? throw new ArgumentNullException(nameof(prestamoRepository));
        _catalogoClient = catalogoClient ?? throw new ArgumentNullException(nameof(catalogoClient));
    }

    public async Task<int> RegistrarPrestamoAsync(CrearPrestamoRequestDto request, CancellationToken cancellationToken = default)
    {
        // 1. Verificacion distribuida con Catalogo.Api
        var disponible = await _catalogoClient.VerificarDisponibilidadLibroAsync(request.LibroId, cancellationToken);
        if (!disponible)
        {
            throw new InvalidOperationException("El libro solicitado no cuenta con stock disponible en catalogo.");
        }

        // 2. Descontar stock en Catalogo.Api
        var stockReducido = await _catalogoClient.ReducirStockLibroAsync(request.LibroId, cancellationToken);
        if (!stockReducido)
        {
            throw new InvalidOperationException("No se pudo reservar el stock del libro en el catalogo.");
        }

        // 3. Crear entidad y persistir con SP
        var dias = request.DiasPrestamo <= 0 ? 7 : request.DiasPrestamo;
        var prestamo = new Prestamo(
            0,
            request.LibroId,
            request.UsuarioIdentificacion,
            request.UsuarioNombre,
            DateTime.UtcNow.AddDays(dias)
        );

        return await _prestamoRepository.RegistrarAsync(prestamo, cancellationToken);
    }

    public async Task<bool> DevolverLibroAsync(int prestamoId, CancellationToken cancellationToken = default)
    {
        var prestamo = await _prestamoRepository.ObtenerPorIdAsync(prestamoId, cancellationToken);
        if (prestamo is null) return false;

        prestamo.MarcarComoDevuelto(DateTime.UtcNow);
        var finalizado = await _prestamoRepository.FinalizarDevolucionAsync(prestamo.Id, prestamo.FechaDevolucionReal!.Value, cancellationToken);

        if (finalizado)
        {
            // Restablecer stock en Catalogo.Api
            await _catalogoClient.AumentarStockLibroAsync(prestamo.LibroId, cancellationToken);
        }

        return finalizado;
    }

    public async Task<IReadOnlyList<PrestamoDto>> ObtenerActivosAsync(CancellationToken cancellationToken = default)
    {
        var prestamos = await _prestamoRepository.ObtenerActivosAsync(cancellationToken);
        return prestamos.Select(p => new PrestamoDto(
            p.Id,
            p.LibroId,
            p.UsuarioIdentificacion,
            p.UsuarioNombre,
            p.FechaPrestamo,
            p.FechaDevolucionEsperada,
            p.FechaDevolucionReal,
            p.Estado.ToString()
        )).ToList();
    }
}

