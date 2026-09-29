namespace Catalogo.Domain.Entities;

public class Autor
{
    public int Id { get; private set; }
    public string Nombre { get; private set; } = string.Empty;
    public string Nacionalidad { get; private set; } = string.Empty;
    public DateTime FechaCreacion { get; private set; }

    private Autor() { }

    public Autor(int id, string nombre, string nacionalidad, DateTime? fechaCreacion = null)
    {
        if (string.IsNullOrWhiteSpace(nombre))
            throw new ArgumentException("El nombre del autor no puede estar vacio.", nameof(nombre));

        if (string.IsNullOrWhiteSpace(nacionalidad))
            throw new ArgumentException("La nacionalidad no puede estar vacia.", nameof(nacionalidad));

        Id = id;
        Nombre = nombre.Trim();
        Nacionalidad = nacionalidad.Trim();
        FechaCreacion = fechaCreacion ?? DateTime.UtcNow;
    }
}
