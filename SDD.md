# Software Design Document (SDD)
## Sistema Distribuido de Gestión de Biblioteca (Microservicios)

**Documento Técnico de Arquitectura y Diseño**  
**Autor:** Eduardo Alfredo Ramírez Torres & Antigravity  
**Estado:** Aprobado / En Implementación  
**Versión:** 1.0.0  

---

## 1. Introducción y Propósito

El propósito de este documento de diseño de software (SDD) es definir la arquitectura, diseño de componentes, modelo de datos relacional y contratos de comunicación para el **Sistema de Gestión de Biblioteca**. 

El sistema está diseñado bajo el paradigma de **Microservicios**, aplicando el patrón arquitectónico **N-Layer (Multicapa)** en cada servicio, persistencia mediante **Dapper** sobre **Microsoft SQL Server** con **Procedimientos Almacenados (Stored Procedures)**, y un cliente web responsivo desarrollado en **React**.

---

## 2. Visión General de la Arquitectura

### 2.1 Descomposición en Microservicios
El sistema se divide en dos dominios de negocio completamente desacoplados, cumpliendo el principio de **Database-per-Service**:

1. **Microservicio de Catálogo (Catalogo.Api):**
   - **Responsabilidad única:** Administrar autores, categorías y el catálogo de libros, así como el control de inventario y stock físico disponible.
   - **Persistencia:** Base de datos independiente DB_Catalogo.
   - **Exposición:** REST API para consulta pública y operaciones administrativas de stock.

2. **Microservicio de Préstamos (Prestamos.Api):**
   - **Responsabilidad única:** Gestionar el ciclo de vida de los préstamos de libros (solicitud, registro, entrega, devoluciones y penalizaciones).
   - **Persistencia:** Base de datos independiente DB_Prestamos.
   - **Consumo entre servicios:** Cliente HTTP resiliente (ICatalogoClient) hacia Catalogo.Api para verificar stock antes de consolidar el préstamo.

`
+-------------------------------------------------------------+
|                     Frontend (React SPA)                    |
+-------------------------------------------------------------+
               │                               │
               │ HTTP/REST                     │ HTTP/REST
               ▼                               ▼
+-----------------------------+ +-----------------------------+
|   Catalogo.Api (.NET)       | |   Prestamos.Api (.NET)      |
|   (N-Layer Architecture)    | |   (N-Layer Architecture)    |
+-----------------------------+ +-----------------------------+
               │                               │
               │                               │ HTTP (ICatalogoClient)
               │                               ├───────────────►
               │                               │ (Verificar stock)
               ▼                               ▼
+-----------------------------+ +-----------------------------+
|   Dapper + Stored Procs     | |   Dapper + Stored Procs     |
+-----------------------------+ +-----------------------------+
               │                               │
               ▼                               ▼
+-----------------------------+ +-----------------------------+
| SQL Server: DB_Catalogo     | | SQL Server: DB_Prestamos    |
+-----------------------------+ +-----------------------------+
`

---

## 3. Arquitectura Interna N-Layer (Por Microservicio)

Cada microservicio implementa una separación estricta de responsabilidades en 4 capas:

1. **Capa de Dominio (*.Domain):**
   - El núcleo del sistema. Cero dependencias externas o de infraestructura.
   - Contiene: Entidades de negocio, Enums, Value Objects y Contratos de Repositorios (Interfaces / Puertos).
2. **Capa de Aplicación (*.Application):**
   - Orquesta los casos de uso del sistema.
   - Contiene: DTOs (Data Transfer Objects), Servicios de Aplicación, Reglas de validación y Clientes HTTP entre servicios.
3. **Capa de Infraestructura (*.Infrastructure):**
   - Implementa los contratos definidos en el Dominio.
   - Acceso a datos exclusivamente mediante **Dapper** y **Microsoft.Data.SqlClient** llamando a Stored Procedures de SQL Server. No se utiliza Entity Framework.
4. **Capa de Presentación / Exposición (*.Api):**
   - ASP.NET Core Web API.
   - Controladores delgados (Thin Controllers), manejo global de excepciones y configuración de Inyección de Dependencias.

---

## 4. Diseño del Modelo de Datos (SQL Server)

### 4.1 Base de Datos: DB_Catalogo
* **Tabla Autores:**
  - Id INT IDENTITY(1,1) PRIMARY KEY
  - Nombre NVARCHAR(150) NOT NULL
  - Nacionalidad NVARCHAR(100) NOT NULL
  - FechaCreacion DATETIME2 NOT NULL DEFAULT GETUTCDATE()
* **Tabla Libros:**
  - Id INT IDENTITY(1,1) PRIMARY KEY
  - Isbn NVARCHAR(20) NOT NULL UNIQUE
  - Titulo NVARCHAR(200) NOT NULL
  - AutorId INT NOT NULL (FK -> Autores.Id)
  - StockTotal INT NOT NULL CHECK (StockTotal >= 0)
  - StockDisponible INT NOT NULL CHECK (StockDisponible >= 0)
  - Estado NVARCHAR(20) NOT NULL DEFAULT 'Disponible'

#### Stored Procedures Clave:
- sp_ObtenerCatalogoLibros: Retorna libros con paginación y datos del autor.
- sp_ObtenerLibroPorId: Retorna el detalle y disponibilidad de un libro por su identificador.
- sp_ActualizarStockLibro: Modifica el stock disponible de forma atómica bajo nivel de aislamiento.

---

### 4.2 Base de Datos: DB_Prestamos
* **Tabla Prestamos:**
  - Id INT IDENTITY(1,1) PRIMARY KEY
  - LibroId INT NOT NULL (Clave lógica foránea hacia el microservicio de Catálogo)
  - UsuarioIdentificacion NVARCHAR(50) NOT NULL
  - UsuarioNombre NVARCHAR(150) NOT NULL
  - FechaPrestamo DATETIME2 NOT NULL DEFAULT GETUTCDATE()
  - FechaDevolucionEsperada DATETIME2 NOT NULL
  - FechaDevolucionReal DATETIME2 NULL
  - Estado NVARCHAR(20) NOT NULL DEFAULT 'Activo'

#### Stored Procedures Clave:
- sp_RegistrarPrestamo: Inserta el registro del préstamo verificando parámetros de usuario.
- sp_FinalizarDevolucion: Actualiza el préstamo a 'Devuelto' y registra la fecha de devolución real.
- sp_ListarPrestamosActivos: Retorna préstamos pendientes de devolución.

---

## 5. Contratos de Comunicación (REST API)

### 5.1 Endpoints de Catálogo (Catalogo.Api)
- GET /api/v1/libros?pagina=1&tamanio=10 -> 200 OK (Lista paginada de libros)
- GET /api/v1/libros/{id} -> 200 OK / 404 Not Found
- POST /api/v1/libros/{id}/ajustar-stock -> 200 OK / 400 Bad Request

### 5.2 Endpoints de Préstamos (Prestamos.Api)
- POST /api/v1/prestamos -> 201 Created / 400 Bad Request / 409 Conflict (Sin stock)
- PUT /api/v1/prestamos/{id}/devolver -> 200 OK / 404 Not Found
- GET /api/v1/prestamos/activos -> 200 OK

---

## 6. Seguridad y Buenas Prácticas Corporativas
1. **Validación Fail-Fast:** Validación de parámetros a la entrada de cada endpoint y dentro de los Stored Procedures.
2. **Cero SQL Dinámico / SQL Injection:** Al usar Dapper mapeando parámetros estrictamente tipados contra Stored Procedures precompilados, se mitigan vulnerabilidades de inyección SQL.
3. **Manejo Centralizado de Errores:** Middleware global que captura excepciones no controladas y devuelve respuestas estandarizadas bajo RFC 7807 (ProblemDetails).
