import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function CatalogoView({ libros = [], onSolicitarPrestamo, loading }) {
  const { usuario } = useAuth();
  const esBibliotecario = usuario?.rol === "bibliotecario";
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ usuarioNombre: usuario?.nombre || "", usuarioIdentificacion: usuario?.dui || "", diasPrestamo: 7 });
  const [submitting, setSubmitting] = useState(false);

  const filtrados = libros.filter(l => {
    const q = query.toLowerCase();
    return (
      l.titulo?.toLowerCase().includes(q) ||
      (l.autorNombre && l.autorNombre.toLowerCase().includes(q)) ||
      (l.isbn && l.isbn.includes(q))
    );
  });

  const openModal = (libro) => {
    setModal(libro);
    setForm({ 
      usuarioNombre: usuario?.nombre || "", 
      usuarioIdentificacion: usuario?.dui || "", 
      diasPrestamo: 7 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await onSolicitarPrestamo(modal, form);
    setSubmitting(false);
    setModal(null);
  };

  return (
    <div className="view-content">
      {/* Barra de Búsqueda y Filtro */}
      <div className="view-toolbar">
        <div className="search-box">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input
            className="search-box__input"
            type="text"
            placeholder="Buscar por título, autor o código ISBN..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="search-catalogo"
            aria-label="Buscar libros en el catálogo"
          />
        </div>
        <div className="view-toolbar__meta">
          <span className="badge-count">
            {filtrados.length} {filtrados.length === 1 ? "título disponible" : "títulos disponibles"}
          </span>
          {loading && <span className="badge-loading">· Sincronizando catálogo...</span>}
        </div>
      </div>

      {/* Grid de Fichas Bibliográficas */}
      <div className="book-grid">
        {filtrados.map(libro => {
          const pct = libro.stockTotal > 0 ? (libro.stockDisponible / libro.stockTotal) * 100 : 0;
          const agotado = libro.stockDisponible <= 0;

          return (
            <article key={libro.id} className="book-card" aria-label={`Ficha: ${libro.titulo}`}>
              <div className="book-card__top">
                <span className="book-card__cat">
                  {libro.categoriaId ? `DEWEY-CAT-${libro.categoriaId}` : "FONDO GENERAL"}
                </span>
                <span 
                  className={`book-card__status-dot${agotado ? " book-card__status-dot--empty" : ""}`}
                  title={agotado ? "Sin stock disponible" : "Ejemplares en inventario"}
                  aria-hidden="true"
                />
              </div>

              <div className="book-card__body">
                <h3 className="book-card__title">{libro.titulo}</h3>
                <p className="book-card__author">{libro.autorNombre || "Autor Institucional / Sin registrar"}</p>
                <code className="book-card__isbn">ISBN {libro.isbn || "N/A"}</code>

                <div className="book-card__stock-wrap">
                  <div className="stock-meter" aria-hidden="true">
                    <div 
                      className={`stock-meter__fill${agotado ? " stock-meter__fill--empty" : ""}`} 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <div className="book-card__stock-label">
                    <span>Disponibilidad</span>
                    <strong style={{ color: agotado ? "var(--color-status-danger)" : "var(--color-text-primary)" }}>
                      {libro.stockDisponible} de {libro.stockTotal} ejemplares
                    </strong>
                  </div>
                </div>
              </div>

              <button
                className={`book-card__action${agotado ? " book-card__action--disabled" : ""}`}
                disabled={agotado}
                onClick={() => !agotado && openModal(libro)}
                id={`btn-solicitar-${libro.id}`}
              >
                {agotado ? (
                  <>
                    <span aria-hidden="true">✕</span>
                    Sin Ejemplares
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">✓</span>
                    {esBibliotecario ? "Emitir Préstamo" : "Solicitar en Custodia"}
                  </>
                )}
              </button>
            </article>
          );
        })}

        {filtrados.length === 0 && !loading && (
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p>No se encontraron títulos coincidentes con el criterio ingresado.</p>
          </div>
        )}
      </div>

      {/* Modal de Solicitud de Préstamo */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)} role="dialog" aria-modal="true">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <span className="modal__eyebrow">Trámite Institucional de Préstamo</span>
                <h3 className="modal__title">{modal.titulo}</h3>
                <p className="modal__sub">
                  Autor: {modal.autorNombre} — Disponibles en bodega: <strong>{modal.stockDisponible}</strong>
                </p>
              </div>
              <button className="modal__close" onClick={() => setModal(null)} aria-label="Cerrar modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal__body">
              <div className="field-group">
                <label className="field-label" htmlFor="modal-nombre">Nombre completo del beneficiario</label>
                <input
                  className="field-input"
                  type="text"
                  value={form.usuarioNombre}
                  onChange={e => setForm({...form, usuarioNombre: e.target.value})}
                  required
                  id="modal-nombre"
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="modal-dui">Documento de Identificación (DUI / Carnet)</label>
                <input
                  className="field-input"
                  type="text"
                  value={form.usuarioIdentificacion}
                  onChange={e => setForm({...form, usuarioIdentificacion: e.target.value})}
                  required
                  id="modal-dui"
                />
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="modal-dias">Plazo de custodia solicitado (días hábiles)</label>
                <input
                  className="field-input"
                  type="number"
                  min="1"
                  max="30"
                  value={form.diasPrestamo}
                  onChange={e => setForm({...form, diasPrestamo: parseInt(e.target.value, 10) || 1})}
                  required
                  id="modal-dias"
                />
              </div>

              <div className="modal__footer">
                <button type="button" className="btn-secondary" onClick={() => setModal(null)}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary" disabled={submitting} id="modal-confirm">
                  {submitting ? <span className="btn-spinner" /> : "Confirmar Emisión"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
