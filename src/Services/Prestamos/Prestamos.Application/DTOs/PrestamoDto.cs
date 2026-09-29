namespace Prestamos.Application.DTOs;

public record PrestamoDto(
    int Id,
    int LibroId,
    string UsuarioIdentificacion,
    string UsuarioNombre,
    DateTime FechaPrestamo,
    DateTime FechaDevolucionEsperada,
    DateTime? FechaDevolucionReal,
    string Estado
);
