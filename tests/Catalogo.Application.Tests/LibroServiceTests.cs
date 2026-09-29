using Catalogo.Application.DTOs;
using Catalogo.Application.Services;
using Catalogo.Domain.Contracts;
using Catalogo.Domain.Entities;
using Catalogo.Domain.Enums;
using Moq;
using Xunit;

namespace Catalogo.Application.Tests;

public class LibroServiceTests
{
    private readonly Mock<ILibroRepository> _libroRepoMock;
    private readonly LibroService _service;

    public LibroServiceTests()
    {
        _libroRepoMock = new Mock<ILibroRepository>();
        _service = new LibroService(_libroRepoMock.Object);
    }

    [Fact]
    public async Task ObtenerPorIdAsync_CuandoLibroExiste_RetornaLibroDto()
    {
        // Arrange
        var libroId = 1;
        var libro = new Libro(libroId, "978-0307474728", "Cien Anios de Soledad", 1, 5, 5, EstadoLibro.Disponible, "Gabo");
        _libroRepoMock.Setup(r => r.ObtenerPorIdAsync(libroId, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(libro);

        // Act
        var resultado = await _service.ObtenerPorIdAsync(libroId);

        // Assert
        Assert.NotNull(resultado);
        Assert.Equal(libroId, resultado.Id);
        Assert.Equal("Cien Anios de Soledad", resultado.Titulo);
        Assert.Equal(5, resultado.StockDisponible);
    }

    [Fact]
    public async Task AjustarStockAsync_CuandoDisminuirConStockSuficiente_RetornaTrue()
    {
        // Arrange
        var libroId = 1;
        var libro = new Libro(libroId, "978-0307474728", "Libro Test", 1, 5, 3, EstadoLibro.Disponible);
        _libroRepoMock.Setup(r => r.ObtenerPorIdAsync(libroId, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(libro);
        _libroRepoMock.Setup(r => r.ActualizarStockAsync(libroId, 2, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(true);

        var request = new AjustarStockRequestDto(1, "Disminuir");

        // Act
        var resultado = await _service.AjustarStockAsync(libroId, request);

        // Assert
        Assert.True(resultado);
        Assert.Equal(2, libro.StockDisponible);
        _libroRepoMock.Verify(r => r.ActualizarStockAsync(libroId, 2, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task AjustarStockAsync_CuandoDisminuirSuperaStock_LanzaInvalidOperationException()
    {
        // Arrange
        var libroId = 1;
        var libro = new Libro(libroId, "978-0307474728", "Libro Test", 1, 5, 1, EstadoLibro.Disponible);
        _libroRepoMock.Setup(r => r.ObtenerPorIdAsync(libroId, It.IsAny<CancellationToken>()))
                      .ReturnsAsync(libro);

        var request = new AjustarStockRequestDto(5, "Disminuir");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.AjustarStockAsync(libroId, request));
    }
}
