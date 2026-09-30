import React, { useState, useEffect } from "react";
import { ConfirmDialog } from "../shared/ConfirmDialog";

/**
 * GestionView - Gestión de Préstamos y Auditoría Institucional
 * 
 * Sincronizado estrictamente con el sistema de diseño táctil corporativo
 * de LibroSync Enterprise (Consola Táctil, Skeleton Cards y Botones Asentados).
 */
export function GestionView({ prestamos = [], libros = [], onDevolver }) {
  const [listaPrestamos, setListaPrestamos] = useState(prestamos);
  const [filtro, setFiltro] = useState("Activo");
  const [busqueda, setBusqueda] = useState("");
  const [prestamoAConfirmar, setPrestamoAConfirmar] = useState(null);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  // Sincronización reactiva con datos externos
  useEffect(() => {
    setListaPrestamos(prestamos);
  }, [prestamos]);

  const getLibro = (id) => libros.find(l => l.id === id);
  const hoy = new Date();

  // Contadores dinámicos calculados en tiempo real
  const countTodos    = listaPrestamos.length;
  const countActivo   = listaPrestamos.filter(p => p.estado === "Activo" && new Date(p.fechaDevolucionEsperada) >= hoy).length;
  const countDevuelto = listaPrestamos.filter(p => p.estado === "Devuelto").length;
  const countVencidos = listaPrestamos.filter(p => p.estado === "Activo" && new Date(p.fechaDevolucionEsperada) < hoy).length;

  const getCount = (f) => {
    switch (f) {
      case "Todos":    return countTodos;
      case "Activo":   return countActivo;
      case "Devuelto": return countDevuelto;
      case "Vencidos": return countVencidos;
      default: return 0;
    }
  };

  // Filtrado reactivo en memoria (por estado y búsqueda de texto)
  const filtered = listaPrestamos.filter(p => {
    const vence = new Date(p.fechaDevolucionEsperada);
    const esVencido = vence < hoy && p.estado === "Activo";

    let pasaEstado = true;
    if (filtro === "Vencidos") pasaEstado = esVencido;
    else if (filtro === "Activo") pasaEstado = p.estado === "Activo" && !esVencido;
    else if (filtro === "Devuelto") pasaEstado = p.estado === "Devuelto";

    if (!pasaEstado) return false;

    if (busqueda.trim() !== "") {
      const q = busqueda.toLowerCase().trim();
      const libro = getLibro(p.libroId);
      const tituloMatch = libro?.titulo?.toLowerCase().includes(q);
      const usuarioMatch = p.usuarioNombre?.toLowerCase().includes(q);
      const duiMatch = p.usuarioIdentificacion?.toLowerCase().includes(q);
      const folioMatch = String(p.id).includes(q);
      return tituloMatch || usuarioMatch || duiMatch || folioMatch;
    }

    return true;
  });

  // Mutación Optimista: Al confirmar devolución, la fila cambia de estado de inmediato
  const handleConfirmarDevolucion = async () => {
    if (!prestamoAConfirmar) return;
    const targetId = prestamoAConfirmar.id;
    setPrestamoAConfirmar(null);

    // 1. Mutación Optimista Inmediata en el estado local de la tabla
    setListaPrestamos(prev => prev.map(p => 
      p.id === targetId 
        ? { ...p, estado: "Devuelto", fechaDevolucionReal: new Date().toISOString() } 
        : p
    ));

    // 2. Ejecución asíncrona real contra el backend
    if (onDevolver) {
      await onDevolver(targetId);
    }
  };

  const FILTROS = [
    { key: "Todos", label: "Todos los Expedientes", count: countTodos },
    { key: "Activo", label: "Activos en Custodia", count: countActivo },
    { key: "Devuelto", label: "Devueltos / Solventes", count: countDevuelto },
    { key: "Vencidos", label: "Vencidos / Mora", count: countVencidos }
  ];

  return (
    <div className="view-content" style={{ padding: "24px 28px", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header Institucional con Resumen Operativo de Auditoría */}
      <header className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px" }}>
        <div>
          <h1 className="dash-header__user-title">Gestión y Auditoría de Préstamos</h1>
          <p className="dash-header__meta">
            Control Transaccional de Retornos y Material en Custodia Institucional
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          {countVencidos > 0 && (
            <span style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              gap: "6px", 
              fontSize: "0.72rem", 
              fontWeight: 600, 
              padding: "4px 10px", 
              borderRadius: "4px", 
              backgroundColor: "var(--color-status-danger-bg, #fff1f2)", 
              color: "var(--color-status-danger, #e11d48)", 
              border: "1px solid var(--color-status-danger-br, #fecdd3)" 
            }}>
              <span aria-hidden="true">⚠</span> {countVencidos} {countVencidos === 1 ? "préstamo vencido" : "préstamos vencidos"}
            </span>
          )}
          <span className="dash-header__badge">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-accent-primary, #10b981)", display: "inline-block" }} />
            {countTodos} {countTodos === 1 ? "expediente auditado" : "expedientes auditados"}
          </span>
        </div>
      </header>

      {/* Tarjeta Principal de la Tabla de Préstamos */}
      <section className="skeleton-card" aria-label="Expedientes de Préstamo Institucional">
        <div className="skeleton-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", padding: "16px 20px" }}>
          <span className="skeleton-card__title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Expedientes y Auditoría de Retorno
          </span>

          {/* Barra de Búsqueda Rápida */}
          <div className="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input
              type="text"
              className="search-box__input"
              placeholder="Buscar por obra, beneficiario o DUI..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        {/* Pestañas de Filtro (Segmented Navigation) */}
        <div className="tab-group" style={{ padding: "0 20px", backgroundColor: "var(--color-surface-base)" }}>
          {FILTROS.map(f => {
            const isActive = filtro === f.key;
            return (
              <button
                key={f.key}
                type="button"
                className={`tab-btn ${isActive ? "tab-btn--active" : ""}`}
                onClick={() => setFiltro(f.key)}
              >
                <span>{f.label}</span>
                <span className="tab-count">{f.count}</span>
              </button>
            );
          })}
        </div>

        {/* Tabla con Estilo Operativo Completo */}
        {filtered.length === 0 ? (
          <div className="empty-state" style={{ padding: "48px 16px", textAlign: "center" }}>
            <svg className="mx-auto h-10 w-10 text-slate-400 mb-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <p style={{ color: "var(--color-text-muted)" }}>
              No se registran expedientes bajo el filtro <strong>"{filtro}"</strong>{busqueda ? ` con el término "${busqueda}"` : ""}.
            </p>
          </div>
        ) : (
          <div className="tbl-wrap" style={{ border: "none", borderRadius: "0" }}>
            <table className="tbl" style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ padding: "12px 16px" }}>Folio</th>
                  <th style={{ padding: "12px 16px" }}>Obra Bibliográfica</th>
                  <th style={{ padding: "12px 16px" }}>Beneficiario</th>
                  <th style={{ padding: "12px 16px" }}>Identificación (DUI)</th>
                  <th style={{ padding: "12px 16px" }}>Fecha Emisión</th>
                  <th style={{ padding: "12px 16px" }}>Límite Retorno</th>
                  <th style={{ padding: "12px 16px" }}>Estado</th>
                  <th style={{ padding: "12px 16px", textAlign: "right" }}>Operaciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const libro = getLibro(p.libroId);
                  const vence = new Date(p.fechaDevolucionEsperada);
                  const emitido = new Date(p.fechaPrestamo);
                  const esVencido = vence < hoy && p.estado === "Activo";
                  const diasMora = Math.ceil((hoy - vence) / (1000 * 60 * 60 * 24));

                  return (
                    <tr key={p.id} className={esVencido ? "tbl--warn" : ""}>
                      <td className="td-id" style={{ padding: "14px 16px" }}>
                        <span style={{ fontFamily: "var(--font-family-mono)", color: "var(--color-text-secondary)" }}>
                          #{String(p.id).padStart(4, "0")}
                        </span>
                      </td>
                      <td className="td-title" style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                          {libro?.titulo?.replace(/Anios/g, "Años") || `Obra #${p.libroId}`}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: "var(--color-text-muted)", fontWeight: 400, marginTop: "2px" }}>
                          {libro?.autorNombre || libro?.autor || "Autor institucional"} · {libro?.categoriaNombre || "General"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {p.usuarioNombre}
                      </td>
                      <td className="td-mono" style={{ padding: "14px 16px" }}>
                        {p.usuarioIdentificacion}
                      </td>
                      <td style={{ padding: "14px 16px", color: "var(--color-text-secondary)" }}>
                        {emitido.toLocaleDateString("es-SV")}
                      </td>
                      <td style={{ 
                        padding: "14px 16px", 
                        color: esVencido ? "var(--color-status-danger, #ef4444)" : "var(--color-text-primary)", 
                        fontWeight: esVencido ? 600 : 400 
                      }}>
                        <div>{vence.toLocaleDateString("es-SV")}</div>
                        {esVencido && (
                          <span style={{ display: "block", fontSize: "0.64rem", color: "var(--color-status-danger, #ef4444)", fontWeight: 600 }}>
                            {diasMora}d en mora
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <span className={`chip chip--${esVencido ? "vencido" : p.estado === "Activo" ? "activo" : "cerrado"}`}>
                          <span aria-hidden="true">{esVencido ? "⚠" : p.estado === "Devuelto" ? "✓" : "●"}</span>
                          {esVencido ? "VENCIDO" : p.estado.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        {p.estado === "Activo" ? (
                          <button
                            type="button"
                            className="btn-outline btn-outline--sm"
                            onClick={() => setPrestamoAConfirmar(p)}
                            title="Finalizar préstamo e ingresar ejemplar a bodega"
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "6px",
                              backgroundColor: "var(--color-status-success-bg, rgba(16, 185, 129, 0.12))",
                              border: "1px solid var(--color-status-success-br, rgba(16, 185, 129, 0.45))",
                              color: "var(--color-status-success, #059669)",
                              fontWeight: 600,
                              fontSize: "0.74rem",
                              padding: "6px 14px",
                              borderRadius: "6px",
                              boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                              cursor: "pointer",
                              transition: "all 0.15s ease"
                            }}
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                            Asentar Devolución
                          </button>
                        ) : (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.68rem", color: "var(--color-status-success, #059669)", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "3px" }}>
                              ✓ Reintegrado
                            </span>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={() => setTicketSeleccionado(p)}
                              title="Ver comprobante oficial de auditoría"
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                backgroundColor: "var(--color-surface-elevated)",
                                border: "1px solid var(--color-border-subtle)",
                                color: "var(--color-text-secondary)",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                padding: "5px 10px",
                                borderRadius: "5px",
                                cursor: "pointer",
                                transition: "all 0.12s ease"
                              }}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                              Ver Comprobante
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Barra de Auditoría y Resumen de Estado */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "12px 20px", 
          borderTop: "1px solid var(--color-border-muted)", 
          backgroundColor: "var(--color-surface-base)",
          fontSize: "0.72rem",
          color: "var(--color-text-muted)",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <span>
            Mostrando <strong>{filtered.length}</strong> de <strong>{countTodos}</strong> {countTodos === 1 ? "expediente registrado" : "expedientes registrados"}
          </span>
          <span style={{ fontFamily: "var(--font-family-mono)", fontSize: "0.68rem" }}>
            Aislamiento ACID · SQL Server Stored Procedures
          </span>
        </div>
      </section>

      {/* Modal Institucional de Confirmación de Devolución */}
      <ConfirmDialog
        isOpen={!!prestamoAConfirmar}
        title="Confirmación de Devolución de Ejemplar"
        subtitle="Esta operación asentará el retorno formal en el acervo institucional y actualizará el inventario disponible."
        badge="AUDITORÍA Y CUSTODIA INSTITUCIONAL"
        details={[
          { label: "Folio de Préstamo", value: `#${String(prestamoAConfirmar?.id || 0).padStart(4, "0")}` },
          { label: "Obra / Título", value: getLibro(prestamoAConfirmar?.libroId)?.titulo || `Obra #${prestamoAConfirmar?.libroId}` },
          { label: "Beneficiario", value: prestamoAConfirmar?.usuarioNombre || "" },
          { label: "Documento DUI", value: prestamoAConfirmar?.usuarioIdentificacion || "" },
          { label: "Procedimiento Almacenado", value: "sp_FinalizarDevolucion (SQL Server Transaccional)" }
        ]}
        warningMessage="Al asentar esta devolución se liberará la retención del ejemplar y el beneficiario quedará solvente en el sistema."
        confirmText="Asentar Devolución Definitiva"
        cancelText="Descartar y Regresar"
        isDanger={false}
        onConfirm={handleConfirmarDevolucion}
        onCancel={() => setPrestamoAConfirmar(null)}
      />

      {/* Modal Oficial de Comprobante / Ticket de Devolución */}
      {ticketSeleccionado && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div 
            className="skeleton-card" 
            style={{ 
              maxWidth: "460px", 
              width: "100%", 
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--color-border-subtle)"
            }}
          >
            <div className="skeleton-card__header" style={{ padding: "16px 20px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ 
                  padding: "6px", 
                  borderRadius: "6px", 
                  backgroundColor: "var(--color-status-success-bg, #ecfdf5)", 
                  color: "var(--color-status-success, #059669)",
                  display: "inline-flex"
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <div>
                  <h3 style={{ fontSize: "0.88rem", fontWeight: 700, color: "var(--color-text-primary)", margin: 0 }}>
                    Comprobante Oficial de Retorno
                  </h3>
                  <span style={{ fontSize: "0.68rem", fontFamily: "var(--font-family-mono)", color: "var(--color-text-muted)" }}>
                    Folio de Préstamo #{String(ticketSeleccionado.id).padStart(4, "0")}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTicketSeleccionado(null)}
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

            <div className="skeleton-card__body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{
                padding: "14px",
                borderRadius: "8px",
                backgroundColor: "var(--color-surface-elevated)",
                border: "1px solid var(--color-border-muted)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                fontSize: "0.75rem"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Obra Bibliográfica:</span>
                  <strong style={{ color: "var(--color-text-primary)", textAlign: "right" }}>
                    {getLibro(ticketSeleccionado.libroId)?.titulo?.replace(/Anios/g, "Años") || `Obra #${ticketSeleccionado.libroId}`}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Beneficiario:</span>
                  <strong style={{ color: "var(--color-text-primary)" }}>{ticketSeleccionado.usuarioNombre}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Identificación DUI:</span>
                  <span style={{ fontFamily: "var(--font-family-mono)", color: "var(--color-text-primary)" }}>
                    {ticketSeleccionado.usuarioIdentificacion}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Fecha de Emisión:</span>
                  <span style={{ color: "var(--color-text-primary)" }}>
                    {new Date(ticketSeleccionado.fechaPrestamo).toLocaleDateString("es-SV")}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Fecha de Retorno Asentada:</span>
                  <strong style={{ color: "var(--color-status-success, #059669)" }}>
                    {ticketSeleccionado.fechaDevolucionReal ? new Date(ticketSeleccionado.fechaDevolucionReal).toLocaleString("es-SV") : "Reintegrado"}
                  </strong>
                </div>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  borderTop: "1px solid var(--color-border-subtle)", 
                  paddingTop: "10px",
                  alignItems: "center"
                }}>
                  <span style={{ color: "var(--color-text-muted)" }}>Estado de Solvencia:</span>
                  <span style={{ 
                    color: "var(--color-status-success, #059669)", 
                    fontWeight: 700, 
                    display: "inline-flex", 
                    alignItems: "center", 
                    gap: "4px" 
                  }}>
                    ✓ SOLVENTE / REINTEGRADO EN ACERVO
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: "4px" }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ 
                    width: "100%", 
                    justifyContent: "center",
                    backgroundColor: "var(--color-surface-elevated)",
                    border: "1px solid var(--color-border-subtle)",
                    color: "var(--color-text-primary)",
                    fontWeight: 600,
                    padding: "9px 16px",
                    borderRadius: "6px"
                  }}
                  onClick={() => setTicketSeleccionado(null)}
                >
                  Cerrar Comprobante Oficial
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
