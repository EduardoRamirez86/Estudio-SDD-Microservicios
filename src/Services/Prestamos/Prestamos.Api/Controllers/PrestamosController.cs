using Microsoft.AspNetCore.Mvc;
using Prestamos.Application.DTOs;
using Prestamos.Application.Services;

namespace Prestamos.Api.Controllers;

[ApiController]
[Route("api/v1/prestamos")]
public class PrestamosController : ControllerBase
{
    private readonly IPrestamoService _prestamoService;

    public PrestamosController(IPrestamoService prestamoService)
    {
        _prestamoService = prestamoService ?? throw new ArgumentNullException(nameof(prestamoService));
    }

    [HttpPost]
    [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> RegistrarPrestamo([FromBody] CrearPrestamoRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var nuevoId = await _prestamoService.RegistrarPrestamoAsync(request, cancellationToken);
            return StatusCode(StatusCodes.Status201Created, new { Id = nuevoId, Mensaje = "Prestamo registrado con exito." });
        }
        catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
        {
            return BadRequest(new { Mensaje = ex.Message });
        }
    }

    [HttpPut("{id:int}/devolver")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DevolverLibro(int id, CancellationToken cancellationToken)
    {
        var finalizado = await _prestamoService.DevolverLibroAsync(id, cancellationToken);
        if (!finalizado) return NotFound(new { Mensaje = $"Prestamo con Id {id} no encontrado o ya devuelto." });

        return Ok(new { Mensaje = "Devolucion de libro completada y stock restaurado en catalogo." });
    }

    [HttpGet("activos")]
    [ProducesResponseType(typeof(IReadOnlyList<PrestamoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerActivos(CancellationToken cancellationToken)
    {
        var activos = await _prestamoService.ObtenerActivosAsync(cancellationToken);
        return Ok(activos);
    }
}
