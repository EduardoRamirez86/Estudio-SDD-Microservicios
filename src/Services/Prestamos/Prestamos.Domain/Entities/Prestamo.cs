using Prestamos.Domain.Enums;

namespace Prestamos.Domain.Entities;

public class Prestamo
{
    public int Id { get; private set; }
    public int LibroId { get; private set; }
    public string UsuarioIdentificacion { get; private set; } = string.Empty;
    public string UsuarioNombre { get; private set; } = string.Empty;
    public DateTime FechaPrestamo { get; private set; }
    public DateTime FechaDevolucionEsperada { get; private set; }
    public DateTime? FechaDevolucionReal { get; private set; }
    public EstadoPrestamo Estado { get; private set; }

    private Prestamo() { }

    public Prestamo(int id, int libroId, string usuarioIdentificacion, string usuarioNombre, DateTime fechaDevolucionEsperada, DateTime? fechaPrestamo = null)
    {
        if (libroId <= 0)
            throw new ArgumentException("El LibroId debe ser valido.", nameof(libroId));

        if (string.IsNullOrWhiteSpace(usuarioIdentificacion))
            throw new ArgumentException("La identificacion del usuario es requerida.", nameof(usuarioIdentificacion));

        if (string.IsNullOrWhiteSpace(usuarioNombre))
            throw new ArgumentException("El nombre del usuario es requerido.", nameof(usuarioNombre));

        var fechaInicio = fechaPrestamo ?? DateTime.UtcNow;
        if (fechaDevolucionEsperada <= fechaInicio)
            throw new ArgumentException("La fecha de devolucion esperada debe ser posterior a la fecha de prestamo.", nameof(fechaDevolucionEsperada));

        Id = id;
        LibroId = libroId;
        UsuarioIdentificacion = usuarioIdentificacion.Trim();
        UsuarioNombre = usuarioNombre.Trim();
        FechaPrestamo = fechaInicio;
        FechaDevolucionEsperada = fechaDevolucionEsperada;
        Estado = EstadoPrestamo.Activo;
    }

    public void MarcarComoDevuelto(DateTime? fechaDevolucion = null)
    {
        if (Estado == EstadoPrestamo.Devuelto)
            throw new InvalidOperationException("El prestamo ya ha sido marcado como devuelto.");

        FechaDevolucionReal = fechaDevolucion ?? DateTime.UtcNow;
        Estado = EstadoPrestamo.Devuelto;
    }

    public bool EstaVencido(DateTime? fechaReferencia = null)
    {
        var fecha = fechaReferencia ?? DateTime.UtcNow;
        return Estado == EstadoPrestamo.Activo && fecha > FechaDevolucionEsperada;
    }
}
