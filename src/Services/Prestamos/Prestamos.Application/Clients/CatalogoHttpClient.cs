using System.Net.Http.Json;
using Prestamos.Domain.Contracts;

namespace Prestamos.Application.Clients;

public class CatalogoHttpClient : ICatalogoClient
{
    private readonly HttpClient _httpClient;

    public CatalogoHttpClient(HttpClient httpClient)
    {
        _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
    }

    public async Task<bool> VerificarDisponibilidadLibroAsync(int libroId, CancellationToken cancellationToken = default)
    {
        var response = await _httpClient.GetAsync($"api/v1/libros/{libroId}", cancellationToken);
        if (!response.IsSuccessStatusCode) return false;

        var libro = await response.Content.ReadFromJsonAsync<LibroDetalleResponse>(cancellationToken: cancellationToken);
        return libro is not null && libro.StockDisponible > 0 && string.Equals(libro.Estado, "Disponible", StringComparison.OrdinalIgnoreCase);
    }

    public async Task<bool> ReducirStockLibroAsync(int libroId, CancellationToken cancellationToken = default)
    {
        var payload = new { Cantidad = 1, Operacion = "Disminuir" };
        var response = await _httpClient.PostAsJsonAsync($"api/v1/libros/{libroId}/ajustar-stock", payload, cancellationToken);
        return response.IsSuccessStatusCode;
    }

    public async Task<bool> AumentarStockLibroAsync(int libroId, CancellationToken cancellationToken = default)
    {
        var payload = new { Cantidad = 1, Operacion = "Incrementar" };
        var response = await _httpClient.PostAsJsonAsync($"api/v1/libros/{libroId}/ajustar-stock", payload, cancellationToken);
        return response.IsSuccessStatusCode;
    }

    private record LibroDetalleResponse(int Id, int StockDisponible, string Estado);
}

