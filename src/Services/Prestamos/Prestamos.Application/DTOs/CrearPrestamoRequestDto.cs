namespace Prestamos.Application.DTOs;

public record CrearPrestamoRequestDto(
    int LibroId,
    string UsuarioIdentificacion,
    string UsuarioNombre,
    int DiasPrestamo
);
