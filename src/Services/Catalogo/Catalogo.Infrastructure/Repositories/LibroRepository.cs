using System.Data;
using Catalogo.Domain.Contracts;
using Catalogo.Domain.Entities;
using Catalogo.Domain.Enums;
using Catalogo.Infrastructure.Data;
using Dapper;

namespace Catalogo.Infrastructure.Repositories;

public class LibroRepository : ILibroRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public LibroRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
    }

    public async Task<Libro?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_ObtenerLibroPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var row = await connection.QuerySingleOrDefaultAsync<LibroRow>(command);
        if (row is null) return null;

        return new Libro(
            row.Id,
            row.Isbn,
            row.Titulo,
            row.AutorId,
            row.StockTotal,
            row.StockDisponible,
            (EstadoLibro)row.Estado,
            row.AutorNombre
        );
    }

    public async Task<IReadOnlyList<Libro>> ObtenerPaginadoAsync(int pagina, int tamanio, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_ObtenerCatalogoLibros",
            new { Pagina = pagina, Tamanio = tamanio },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var rows = await connection.QueryAsync<LibroRow>(command);
        return rows.Select(r => new Libro(
            r.Id,
            r.Isbn,
            r.Titulo,
            r.AutorId,
            r.StockTotal,
            r.StockDisponible,
            (EstadoLibro)r.Estado,
            r.AutorNombre
        )).ToList();
    }

    public async Task<bool> ActualizarStockAsync(int id, int nuevoStockDisponible, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_ActualizarStockLibro",
            new { Id = id, NuevoStockDisponible = nuevoStockDisponible },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var result = await connection.ExecuteScalarAsync<int>(command);
        return result == 1;
    }

    private sealed class LibroRow
    {
        public int Id { get; set; }
        public string Isbn { get; set; } = string.Empty;
        public string Titulo { get; set; } = string.Empty;
        public int AutorId { get; set; }
        public string? AutorNombre { get; set; }
        public int StockTotal { get; set; }
        public int StockDisponible { get; set; }
        public int Estado { get; set; }
    }
}
