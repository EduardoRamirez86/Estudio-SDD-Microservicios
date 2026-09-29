using Catalogo.Application.DTOs;
using Catalogo.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/v1/libros")]
public class LibrosController : ControllerBase
{
    private readonly ILibroService _libroService;

    public LibrosController(ILibroService libroService)
    {
        _libroService = libroService ?? throw new ArgumentNullException(nameof(libroService));
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<LibroDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> ObtenerCatalogo([FromQuery] int pagina = 1, [FromQuery] int tamanio = 10, CancellationToken cancellationToken = default)
    {
        var libros = await _libroService.ObtenerCatalogoAsync(pagina, tamanio, cancellationToken);
        return Ok(libros);
    }

    [HttpGet("{id:int}")]
    [ProducesResponseType(typeof(LibroDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ObtenerPorId(int id, CancellationToken cancellationToken)
    {
        var libro = await _libroService.ObtenerPorIdAsync(id, cancellationToken);
        if (libro is null) return NotFound(new { Mensaje = $"Libro con Id {id} no encontrado." });
        return Ok(libro);
    }

    [HttpPost("{id:int}/ajustar-stock")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AjustarStock(int id, [FromBody] AjustarStockRequestDto request, CancellationToken cancellationToken)
    {
        try
        {
            var exito = await _libroService.AjustarStockAsync(id, request, cancellationToken);
            if (!exito) return BadRequest(new { Mensaje = "No se pudo actualizar el stock." });
            return Ok(new { Mensaje = "Stock actualizado correctamente." });
        }
        catch (Exception ex) when (ex is ArgumentException or InvalidOperationException)
        {
            return BadRequest(new { Mensaje = ex.Message });
        }
    }
}
