import React from "react";

/**
 * CatalogoCard - Ficha Bibliográfica con Separación Arquitectónica (Digital vs. Físico)
 * 
 * Separa claramente dos vías de acceso independientes para el mismo título:
 * - Sección Digital: Lectura en línea ilimitada (botón ghost sobrio sin neón).
 * - Sección Física: Control de inventario en bodega (ejemplares) y emisión/solicitud.
 */
export function CatalogoCard({ libro, onLeerDigital, onSolicitarFisico, esBibliotecario }) {
  const stockTotal = libro.stockTotal || 0;
  const stockDisponible = libro.stockDisponible || 0;
  const agotado = stockDisponible <= 0;
  const pct = stockTotal > 0 ? (stockDisponible / stockTotal) * 100 : 0;

  return (
    <article className="book-card" aria-label={`Ficha: ${libro.titulo}`}>
      {/* Metadatos superiores de catalogación */}
      <div className="book-card__top">
        <span className="book-card__cat">
          {libro.categoriaId ? `DEWEY-CAT-${libro.categoriaId}` : "FONDO GENERAL"}
        </span>
        <code className="book-card__isbn">ISBN {libro.isbn || "N/A"}</code>
      </div>

      {/* Datos Bibliográficos Principales */}
      <div className="book-card__body">
        <h3 className="book-card__title">{libro.titulo}</h3>
        <p className="book-card__author">{libro.autorNombre || "Autor Institucional / Sin registrar"}</p>
      </div>

      {/* Contenedor de Formatos de Acceso Independientes */}
      <div className="book-card__formats">
        {/* SECCIÓN 1: ACCESO DIGITAL */}
        <div className="book-format-row book-format-row--digital">
          <div className="book-format-header">
            <span className="book-format-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
              Edición Digital
            </span>
            <span className="book-format-badge">Acceso Inmediato</span>
          </div>

          <button
            type="button"
            className="btn-read-online"
            onClick={() => onLeerDigital(libro)}
            id={`btn-digital-${libro.id}`}
            title={`Leer ${libro.titulo} en formato digital`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
            <span>Leer en línea</span>
          </button>
        </div>

        {/* Divisor sutil entre formatos de acceso */}
        <div className="book-card__divider" aria-hidden="true" />

        {/* SECCIÓN 2: EJEMPLAR FÍSICO */}
        <div className="book-format-row book-format-row--fisico">
          <div className="book-format-header">
            <span className="book-format-label">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
              Ejemplar Físico
            </span>
            <span 
              className="book-format-stock"
              style={{ color: agotado ? "var(--color-status-danger)" : "var(--color-text-secondary)" }}
            >
              {stockDisponible} de {stockTotal} ejemplares
            </span>
          </div>

          <div className="stock-meter" aria-hidden="true">
            <div 
              className={`stock-meter__fill${agotado ? " stock-meter__fill--empty" : ""}`} 
              style={{ width: `${pct}%` }} 
            />
          </div>

          <button
            className={`book-card__action${agotado ? " book-card__action--disabled" : ""}`}
            disabled={agotado}
            onClick={() => !agotado && onSolicitarFisico(libro)}
            id={`btn-solicitar-${libro.id}`}
          >
            {agotado ? (
              <>
                <span aria-hidden="true">✕</span>
                Sin Ejemplares Físicos
              </>
            ) : (
              <>
                <span aria-hidden="true">✓</span>
                {esBibliotecario ? "Emitir Préstamo" : "Solicitar Físico"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
