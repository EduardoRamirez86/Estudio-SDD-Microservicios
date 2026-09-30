using Catalogo.Application.DTOs;
using Catalogo.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Catalogo.Api.Controllers;

[ApiController]
[Route("api/v1/libros")]
public class LibrosController : ControllerBase
{
    private readonly ILibroService _libroService;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<LibrosController> _logger;

    public LibrosController(
        ILibroService libroService,
        IHttpClientFactory httpClientFactory,
        ILogger<LibrosController> logger)
    {
        _libroService = libroService ?? throw new ArgumentNullException(nameof(libroService));
        _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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

    /// <summary>
    /// Proxy de contenido asíncrono puro para lectura digital por streaming (Zero-RAM / Zero-Disk).
    /// Conecta con el repositorio documental externo, libera el hilo en cuanto recibe los encabezados
    /// e inyecta el flujo de bytes directamente en la respuesta HTTP del cliente con Content-Disposition: inline.
    /// </summary>
    [HttpGet("/api/v1/catalogo/digital/{idLibro:int}")]
    [HttpGet("digital/{idLibro:int}")]
    [HttpGet("{idLibro:int}/digital")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> TransmitirLecturaDigital(int idLibro, [FromQuery] string? fuenteUrl = null, CancellationToken cancellationToken = default)
    {
        var libro = await _libroService.ObtenerPorIdAsync(idLibro, cancellationToken);
        if (libro is null)
        {
            return NotFound(new { Mensaje = $"Libro con Id {idLibro} no registrado en el catálogo institucional." });
        }

        string targetUrl = !string.IsNullOrWhiteSpace(fuenteUrl)
            ? fuenteUrl
            : ResolverFuenteDigital(idLibro);

        _logger.LogInformation("Iniciando proxy de streaming digital para libro {Id} ('{Titulo}') desde {Url}",
            idLibro, libro.Titulo, targetUrl);

        try
        {
            var httpClient = _httpClientFactory.CreateClient("DigitalReaderClient");
            var request = new HttpRequestMessage(HttpMethod.Get, targetUrl);

            // HttpCompletionOption.ResponseHeadersRead: Libera el hilo tan pronto como se leen los encabezados,
            // garantizando cero retención de memoria en el servidor y streaming puro a través del socket.
            var response = await httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("El repositorio digital externo retornó estado HTTP {StatusCode} para el libro {Id}", response.StatusCode, idLibro);
                return StatusCode((int)response.StatusCode, new { Mensaje = "El repositorio documental digital no se encuentra disponible en este momento." });
            }

            // Flujo en tiempo real directo del contenido
            var stream = await response.Content.ReadAsStreamAsync(cancellationToken);

            // Content-Disposition: inline fuerza la visualización en el navegador e inhibe la descarga automática obligatoria
            var safeFilename = SanitizeFileName(libro.Titulo);
            Response.Headers.Append("Content-Disposition", $"inline; filename=\"{safeFilename}.pdf\"");
            Response.Headers.Append("X-Content-Type-Options", "nosniff");
            Response.Headers.Append("Cache-Control", "public, max-age=3600");

            // FileStreamResult transmite el flujo de datos directamente al cliente
            return File(stream, "application/pdf");
        }
        catch (Exception ex) when (ex is HttpRequestException or TaskCanceledException)
        {
            _logger.LogError(ex, "Excepción de transporte al conectar con la fuente digital para libro {Id}", idLibro);
            return StatusCode(StatusCodes.Status502BadGateway, new
            {
                Mensaje = "Error de comunicación con la fuente remota de lectura digital.",
                Detalle = ex.Message
            });
        }
    }

    private static string ResolverFuenteDigital(int idLibro)
    {
        return idLibro switch
        {
            1 => "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
            2 => "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            3 => "https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf",
            4 => "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            _ => "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
        };
    }

    private static string SanitizeFileName(string titulo)
    {
        var invalidChars = Path.GetInvalidFileNameChars();
        var clean = string.Concat(titulo.Split(invalidChars, StringSplitOptions.RemoveEmptyEntries));
        return string.IsNullOrWhiteSpace(clean) ? "documento_digital" : clean.Replace(" ", "_");
    }
}
