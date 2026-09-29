using Moq;
using Prestamos.Application.DTOs;
using Prestamos.Application.Services;
using Prestamos.Domain.Contracts;
using Prestamos.Domain.Entities;
using Xunit;

namespace Prestamos.Application.Tests;

public class PrestamoServiceTests
{
    private readonly Mock<IPrestamoRepository> _prestamoRepoMock;
    private readonly Mock<ICatalogoClient> _catalogoClientMock;
    private readonly PrestamoService _service;

    public PrestamoServiceTests()
    {
        _prestamoRepoMock = new Mock<IPrestamoRepository>();
        _catalogoClientMock = new Mock<ICatalogoClient>();
        _service = new PrestamoService(_prestamoRepoMock.Object, _catalogoClientMock.Object);
    }

    [Fact]
    public async Task RegistrarPrestamoAsync_CuandoCatalogoTieneStock_RegistraYRetornaId()
    {
        // Arrange
        var request = new CrearPrestamoRequestDto(1, "06138859-0", "Eduardo Ramirez", 7);
        _catalogoClientMock.Setup(c => c.VerificarDisponibilidadLibroAsync(request.LibroId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync(true);
        _catalogoClientMock.Setup(c => c.ReducirStockLibroAsync(request.LibroId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync(true);
        _prestamoRepoMock.Setup(r => r.RegistrarAsync(It.IsAny<Prestamo>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(101);

        // Act
        var nuevoId = await _service.RegistrarPrestamoAsync(request);

        // Assert
        Assert.Equal(101, nuevoId);
        _catalogoClientMock.Verify(c => c.ReducirStockLibroAsync(request.LibroId, It.IsAny<CancellationToken>()), Times.Once);
        _prestamoRepoMock.Verify(r => r.RegistrarAsync(It.IsAny<Prestamo>(), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RegistrarPrestamoAsync_CuandoCatalogoSinStock_LanzaInvalidOperationException()
    {
        // Arrange
        var request = new CrearPrestamoRequestDto(1, "06138859-0", "Eduardo Ramirez", 7);
        _catalogoClientMock.Setup(c => c.VerificarDisponibilidadLibroAsync(request.LibroId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync(false);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() => _service.RegistrarPrestamoAsync(request));
        _prestamoRepoMock.Verify(r => r.RegistrarAsync(It.IsAny<Prestamo>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task DevolverLibroAsync_CuandoPrestamoExiste_FinalizaYDevuelveStockACatalogo()
    {
        // Arrange
        var prestamoId = 5;
        var libroId = 1;
        var prestamo = new Prestamo(prestamoId, libroId, "06138859-0", "Eduardo Ramirez", DateTime.UtcNow.AddDays(7));

        _prestamoRepoMock.Setup(r => r.ObtenerPorIdAsync(prestamoId, It.IsAny<CancellationToken>()))
                         .ReturnsAsync(prestamo);
        _prestamoRepoMock.Setup(r => r.FinalizarDevolucionAsync(prestamoId, It.IsAny<DateTime>(), It.IsAny<CancellationToken>()))
                         .ReturnsAsync(true);
        _catalogoClientMock.Setup(c => c.AumentarStockLibroAsync(libroId, It.IsAny<CancellationToken>()))
                           .ReturnsAsync(true);

        // Act
        var resultado = await _service.DevolverLibroAsync(prestamoId);

        // Assert
        Assert.True(resultado);
        _prestamoRepoMock.Verify(r => r.FinalizarDevolucionAsync(prestamoId, It.IsAny<DateTime>(), It.IsAny<CancellationToken>()), Times.Once);
        _catalogoClientMock.Verify(c => c.AumentarStockLibroAsync(libroId, It.IsAny<CancellationToken>()), Times.Once);
    }
}
