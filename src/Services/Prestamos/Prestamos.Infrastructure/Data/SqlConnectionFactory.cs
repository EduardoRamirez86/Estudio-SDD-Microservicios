using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Prestamos.Infrastructure.Data;

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("PrestamosDb")
            ?? throw new InvalidOperationException("Cadena de conexion 'PrestamosDb' no configurada.");
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}
