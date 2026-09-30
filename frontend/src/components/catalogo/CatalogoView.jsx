import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ConfirmDialog } from "../shared/ConfirmDialog";
import { CatalogoCard } from "./CatalogoCard";
import { VisorDigitalDocumental } from "./VisorDigitalDocumental";

export function CatalogoView({ libros = [], onSolicitarPrestamo, loading }) {
  const { usuario } = useAuth();
  const esBibliotecario = usuario?.rol === "bibliotecario";
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ usuarioNombre: usuario?.nombre || "", usuarioIdentificacion: usuario?.dui || "", diasPrestamo: 7 });
  const [confirmacionData, setConfirmacionData] = useState(null);
  const [libroDigital, setLibroDigital] = useState(null);

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

  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!form.usuarioNombre || !form.usuarioIdentificacion) return;
    setConfirmacionData({
      libro: modal,
      form: { ...form }
    });
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
          <div className="empty-state" style={{ gridColumn: "1 / -1" }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <p>No se encontraron títulos coincidentes con el criterio ingresado.</p>
          </div>
        )}
      </div>

      {/* Modal de Solicitud de Préstamo Físico (Paso 1: Captura de Datos) */}
      {modal && (
        <div className="modal-overlay" onClick={() => setModal(null)} role="dialog" aria-modal="true">
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal__header">
              <div>
                <span className="modal__eyebrow">Trámite Institucional de Préstamo Físico</span>
                <h3 className="modal__title">{modal.titulo}</h3>
                <p className="modal__sub">
                  Autor: {modal.autorNombre} — Disponibles en bodega: <strong>{modal.stockDisponible}</strong>
                </p>
              </div>
              <button className="modal__close" onClick={() => setModal(null)} aria-label="Cerrar modal">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handlePreSubmit} className="modal__body">
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
                <button type="submit" className="btn-primary" id="modal-submit-step1">
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
          { label: "Obra Solicitada", value: confirmacionData?.libro?.titulo || "" },
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
