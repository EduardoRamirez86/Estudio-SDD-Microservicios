using Catalogo.Application.Services;
using Catalogo.Domain.Contracts;
using Catalogo.Infrastructure.Data;
using Catalogo.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Servicios de Infraestructura y Aplicacion (Inyeccion de Dependencias)
builder.Services.AddSingleton<ISqlConnectionFactory, SqlConnectionFactory>();
builder.Services.AddScoped<ILibroRepository, LibroRepository>();
builder.Services.AddScoped<ILibroService, LibroService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// CORS para React SPA
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
