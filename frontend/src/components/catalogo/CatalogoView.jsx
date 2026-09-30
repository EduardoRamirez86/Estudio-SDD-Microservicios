import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { CatalogoCard } from "./CatalogoCard";
import { VisorDigitalDocumental } from "./VisorDigitalDocumental";

/**
 * CatalogoView - Catálogo Bibliotecario y Acervo Institucional
 * 
 * Sincronizado estrictamente con el sistema de diseño táctil corporativo
 * de LibroSync Enterprise (Luxury Material Technology).
 */
export function CatalogoView({ libros = [], onSolicitarPrestamo, loading }) {
  const { usuario } = useAuth();
  const esBibliotecario = usuario?.rol === "bibliotecario";
  const [query, setQuery] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("TODOS");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ 
    usuarioNombre: usuario?.nombre || "", 
    usuarioIdentificacion: usuario?.dui || "", 
    diasPrestamo: 7 
  });
  const [confirmacionData, setConfirmacionData] = useState(null);
  const [libroDigital, setLibroDigital] = useState(null);

  // Obtener lista única de categorías disponibles
  const categorias = ["TODOS", ...new Set(libros.map(l => l.categoriaNombre || "General"))];

  const filtrados = libros.filter(l => {
    const q = query.toLowerCase().trim();
    const titulo = l.titulo ? l.titulo.replace(/Anios/g, "Años").toLowerCase() : "";
    const autor = l.autorNombre ? l.autorNombre.toLowerCase() : "";
    const isbn = l.isbn ? l.isbn.toLowerCase() : "";
    const coincideTexto = q === "" || titulo.includes(q) || autor.includes(q) || isbn.includes(q);
    
    const cat = l.categoriaNombre || "General";
    const coincideCat = categoriaFiltro === "TODOS" || cat === categoriaFiltro;

    return coincideTexto && coincideCat;
  });

  const openModal = (libro) => {
    setModal(libro);
    setForm({ 
      usuarioNombre: usuario?.nombre || "", 
      usuarioIdentificacion: usuario?.dui || "", 
      diasPrestamo: 7 
    });
  };

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!form.usuarioNombre || !form.usuarioIdentificacion) return;
    setConfirmacionData({
      libro: modal,
      form: { ...form }
    });
  };

  return (
    <div className="view-content" style={{ padding: "24px 28px", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header Institucional */}
      <header className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px" }}>
        <div>
          <h1 className="dash-header__user-title">Catálogo Bibliotecario y Acervo Institucional</h1>
          <p className="dash-header__meta">
            Consulta de Obras, Ejemplares Físicos en Custodia y Lectura Digital en Línea
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <span className="dash-header__badge">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-accent-primary, #10b981)", display: "inline-block" }} />
            {filtrados.length} {filtrados.length === 1 ? "título en catálogo" : "títulos en catálogo"}
          </span>
          {loading && (
            <span style={{ fontSize: "0.72rem", color: "var(--color-accent-primary)", fontFamily: "var(--font-family-mono)" }}>
              · Sincronizando catálogo...
            </span>
          )}
        </div>
      </header>

      {/* Barra de Filtros y Búsqueda en Tarjeta Contenedora */}
      <div className="skeleton-card" style={{ padding: "16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          {/* Caja de Búsqueda Rápida */}
          <div className="search-box" style={{ maxWidth: "380px" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input
              className="search-box__input"
              type="text"
              placeholder="Buscar por obra, autor o código ISBN..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              id="search-catalogo"
              aria-label="Buscar libros en el catálogo"
            />
          </div>

          {/* Selector de Categorías / Fondos Bibliográficos */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Fondo:
            </span>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {categorias.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategoriaFiltro(cat)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.12s ease",
                    backgroundColor: categoriaFiltro === cat ? "var(--color-accent-primary, #059669)" : "var(--color-surface-elevated)",
                    color: categoriaFiltro === cat ? "#ffffff" : "var(--color-text-secondary)",
                    border: `1px solid ${categoriaFiltro === cat ? "var(--color-accent-primary, #059669)" : "var(--color-border-muted)"}`,
                    boxShadow: categoriaFiltro === cat ? "0 1px 3px rgba(5, 150, 105, 0.25)" : "none"
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Fichas Bibliográficas con Separación Digital y Física */}
      <div className="book-grid">
        {filtrados.map(libro => (
          <CatalogoCard
            key={libro.id}
            libro={libro}
            onLeerDigital={(lib) => setLibroDigital(lib)}
            onSolicitarFisico={(lib) => openModal(lib)}
            esBibliotecario={esBibliotecario}
          />
        ))}

        {filtrados.length === 0 && !loading && (
          <div className="empty-state skeleton-card" style={{ gridColumn: "1 / -1", padding: "48px 16px", textAlign: "center" }}>
            <svg className="mx-auto text-slate-400 mb-3" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p style={{ color: "var(--color-text-muted)" }}>
              No se encontraron obras coincidentes con el criterio <strong>"{query || categoriaFiltro}"</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Modal de Solicitud de Préstamo Físico (Paso 1: Captura de Datos) */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)} role="dialog" aria-modal="true">
          <div 
            className="skeleton-card" 
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: "500px", 
              width: "100%", 
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--color-border-subtle)"
            }}
          >
            <div className="skeleton-card__header" style={{ padding: "16px 20px" }}>
              <div>
                <span style={{ fontSize: "0.65rem", fontFamily: "var(--font-family-mono)", color: "var(--color-accent-primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Trámite Institucional de Préstamo Físico
                </span>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--color-text-primary)", margin: "4px 0 2px 0" }}>
                  {modal.titulo?.replace(/Anios/g, "Años")}
                </h3>
                <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", margin: 0 }}>
                  Autor: {modal.autorNombre || "Autor institucional"} · Disponibles en bodega: <strong style={{ color: "var(--color-status-success)" }}>{modal.stockDisponible} ejemplares</strong>
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setModal(null)} 
                aria-label="Cerrar modal"
                style={{
                  background: "transparent",
                  border: "none",
                  color: "var(--color-text-muted)",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  padding: "4px"
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePreSubmit} className="skeleton-card__body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--color-text-secondary)" }} htmlFor="modal-nombre">
                  Nombre completo del beneficiario
                </label>
                <input
                  style={{
                    backgroundColor: "var(--color-surface-base)",
                    border: "1px solid var(--color-border-focus)",
                    borderRadius: "6px",
                    color: "var(--color-text-primary)",
                    padding: "8px 12px",
                    fontSize: "0.82rem"
                  }}
                  type="text"
                  value={form.usuarioNombre}
                  onChange={e => setForm({...form, usuarioNombre: e.target.value})}
                  required
                  id="modal-nombre"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--color-text-secondary)" }} htmlFor="modal-dui">
                  Documento de Identificación (DUI / Carnet Institucional)
                </label>
                <input
                  style={{
                    backgroundColor: "var(--color-surface-base)",
                    border: "1px solid var(--color-border-focus)",
                    borderRadius: "6px",
                    color: "var(--color-text-primary)",
                    padding: "8px 12px",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-family-mono)"
                  }}
                  type="text"
                  value={form.usuarioIdentificacion}
                  onChange={e => setForm({...form, usuarioIdentificacion: e.target.value})}
                  required
                  id="modal-dui"
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.74rem", fontWeight: 600, color: "var(--color-text-secondary)" }} htmlFor="modal-dias">
                  Plazo de custodia solicitado (días hábiles)
                </label>
                <input
                  style={{
                    backgroundColor: "var(--color-surface-base)",
                    border: "1px solid var(--color-border-focus)",
                    borderRadius: "6px",
                    color: "var(--color-text-primary)",
                    padding: "8px 12px",
                    fontSize: "0.82rem",
                    fontFamily: "var(--font-family-mono)"
                  }}
                  type="number"
                  min="1"
                  max="30"
                  value={form.diasPrestamo}
                  onChange={e => setForm({...form, diasPrestamo: parseInt(e.target.value, 10) || 1})}
                  required
                  id="modal-dias"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", borderTop: "1px solid var(--color-border-muted)", paddingTop: "16px" }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setModal(null)}
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    border: "1px solid var(--color-border-subtle)",
                    color: "var(--color-text-secondary)",
                    fontWeight: 600,
                    padding: "8px 16px",
                    borderRadius: "6px"
                  }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  id="modal-submit-step1"
                  style={{
                    backgroundColor: "var(--color-accent-primary, #059669)",
                    color: "#ffffff",
                    fontWeight: 600,
                    padding: "8px 18px",
                    borderRadius: "6px",
                    boxShadow: "0 2px 6px rgba(5, 150, 105, 0.35)",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer"
                  }}
                >
                  Validar y Continuar →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Validación Transaccional con Fricción Intencional (Paso 2: Confirmación Estricta) */}
      <ConfirmDialog
        isOpen={!!confirmacionData}
        title="Confirmación de Registro de Préstamo"
        subtitle="Se emitirá un compromiso de custodia institucional con reserva de ejemplar físico."
        badge="VALIDACIÓN OPERATIVA OBLIGATORIA"
        details={[
          { label: "Obra Solicitada", value: confirmacionData?.libro?.titulo?.replace(/Anios/g, "Años") || "" },
          { label: "Beneficiario Asignado", value: confirmacionData?.form?.usuarioNombre || "" },
          { label: "Documento de Identificación", value: confirmacionData?.form?.usuarioIdentificacion || "" },
          { label: "Plazo de Custodia", value: `${confirmacionData?.form?.diasPrestamo || 7} días hábiles` },
          { label: "Procedimiento Almacenado", value: "sp_RegistrarPrestamo (SQL Server Transaccional)" }
        ]}
        warningMessage="Esta acción decrementará el inventario disponible de inmediato y generará un folio de auditoría auditable."
        confirmText="Emitir Préstamo Definitivo"
        cancelText="Revisar Formulario"
        isDanger={false}
        onConfirm={async () => {
          if (confirmacionData) {
            await onSolicitarPrestamo(confirmacionData.libro, confirmacionData.form);
            setConfirmacionData(null);
            setModal(null);
          }
        }}
        onCancel={() => setConfirmacionData(null)}
      />

      {/* Visor Digital Documental (Zero-Clutter) */}
      {libroDigital && (
        <VisorDigitalDocumental
          libro={libroDigital}
          onClose={() => setLibroDigital(null)}
        />
      )}
    </div>
  );
}
