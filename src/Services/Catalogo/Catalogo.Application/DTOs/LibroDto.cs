namespace Catalogo.Application.DTOs;

public record LibroDto(
    int Id,
    string Isbn,
    string Titulo,
    int AutorId,
    string? AutorNombre,
    int StockTotal,
    int StockDisponible,
    string Estado
);
