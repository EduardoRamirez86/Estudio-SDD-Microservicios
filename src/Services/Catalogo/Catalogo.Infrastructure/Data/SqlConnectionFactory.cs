using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace Catalogo.Infrastructure.Data;

public class SqlConnectionFactory : ISqlConnectionFactory
{
    private readonly string _connectionString;

    public SqlConnectionFactory(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("CatalogoDb")
            ?? throw new InvalidOperationException("Cadena de conexion 'CatalogoDb' no configurada.");
    }

    public IDbConnection CreateConnection() => new SqlConnection(_connectionString);
}
