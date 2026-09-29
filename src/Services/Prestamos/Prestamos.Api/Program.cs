using Prestamos.Application.Clients;
using Prestamos.Application.Services;
using Prestamos.Domain.Contracts;
using Prestamos.Infrastructure.Data;
using Prestamos.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Servicios de Infraestructura y Aplicacion
builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<IPrestamoRepository, PrestamoRepository>();
builder.Services.AddScoped<IPrestamoService, PrestamoService>();

// Cliente HTTP resiliente hacia Catalogo.Api
var catalogoUrl = builder.Configuration["Services:CatalogoApiUrl"] ?? "http://localhost:5101/";
builder.Services.AddHttpClient<ICatalogoClient, CatalogoHttpClient>(client =>
{
    client.BaseAddress = new Uri(catalogoUrl);
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
