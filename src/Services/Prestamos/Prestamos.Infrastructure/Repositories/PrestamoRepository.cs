using System.Data;
using Dapper;
using Prestamos.Domain.Contracts;
using Prestamos.Domain.Entities;
using Prestamos.Domain.Enums;
using Prestamos.Infrastructure.Data;

namespace Prestamos.Infrastructure.Repositories;

public class PrestamoRepository : IPrestamoRepository
{
    private readonly ISqlConnectionFactory _connectionFactory;

    public PrestamoRepository(ISqlConnectionFactory connectionFactory)
    {
        _connectionFactory = connectionFactory ?? throw new ArgumentNullException(nameof(connectionFactory));
    }

    public async Task<int> RegistrarAsync(Prestamo prestamo, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var parameters = new DynamicParameters();
        parameters.Add("@LibroId", prestamo.LibroId, DbType.Int32);
        parameters.Add("@UsuarioIdentificacion", prestamo.UsuarioIdentificacion, DbType.String);
        parameters.Add("@UsuarioNombre", prestamo.UsuarioNombre, DbType.String);
        parameters.Add("@FechaDevolucionEsperada", prestamo.FechaDevolucionEsperada, DbType.DateTime2);
        parameters.Add("@NuevoId", dbType: DbType.Int32, direction: ParameterDirection.Output);

        var command = new CommandDefinition(
            "sp_RegistrarPrestamo",
            parameters,
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        await connection.ExecuteAsync(command);
        return parameters.Get<int>("@NuevoId");
    }

    public async Task<Prestamo?> ObtenerPorIdAsync(int id, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_ObtenerPrestamoPorId",
            new { Id = id },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var row = await connection.QuerySingleOrDefaultAsync<PrestamoRow>(command);
        if (row is null) return null;

        var prestamo = new Prestamo(
            row.Id,
            row.LibroId,
            row.UsuarioIdentificacion,
            row.UsuarioNombre,
            row.FechaDevolucionEsperada,
            row.FechaPrestamo
        );

        if (row.FechaDevolucionReal.HasValue)
        {
            prestamo.MarcarComoDevuelto(row.FechaDevolucionReal.Value);
        }

        return prestamo;
    }

    public async Task<bool> FinalizarDevolucionAsync(int id, DateTime fechaDevolucion, CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_FinalizarDevolucion",
            new { Id = id, FechaDevolucion = fechaDevolucion },
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var affected = await connection.ExecuteScalarAsync<int>(command);
        return affected > 0;
    }

    public async Task<IReadOnlyList<Prestamo>> ObtenerActivosAsync(CancellationToken cancellationToken = default)
    {
        using var connection = _connectionFactory.CreateConnection();
        var command = new CommandDefinition(
            "sp_ListarPrestamosActivos",
            commandType: CommandType.StoredProcedure,
            cancellationToken: cancellationToken
        );

        var rows = await connection.QueryAsync<PrestamoRow>(command);
        return rows.Select(r => new Prestamo(
            r.Id,
            r.LibroId,
            r.UsuarioIdentificacion,
            r.UsuarioNombre,
            r.FechaDevolucionEsperada,
            r.FechaPrestamo
        )).ToList();
    }

    private sealed class PrestamoRow
    {
        public int Id { get; set; }
        public int LibroId { get; set; }
        public string UsuarioIdentificacion { get; set; } = string.Empty;
        public string UsuarioNombre { get; set; } = string.Empty;
        public DateTime FechaPrestamo { get; set; }
        public DateTime FechaDevolucionEsperada { get; set; }
        public DateTime? FechaDevolucionReal { get; set; }
        public int Estado { get; set; }
    }
}

