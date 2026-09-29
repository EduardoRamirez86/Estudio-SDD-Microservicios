namespace Catalogo.Application.DTOs;

public record AjustarStockRequestDto(
    int Cantidad,
    string Operacion
);
