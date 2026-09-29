import React, { useState } from "react";

export function GestionView({ prestamos = [], libros = [], onDevolver }) {
  const [filtro, setFiltro] = useState("Activo");
  const FILTROS = ["Todos", "Activo", "Devuelto", "Vencidos"];

  const getLibro = (id) => libros.find(l => l.id === id);
  const hoy = new Date();

  const filtered = prestamos.filter(p => {
    const vence = new Date(p.fechaDevolucionEsperada);
    const esVencido = vence < hoy && p.estado === "Activo";

    if (filtro === "Todos") return true;
    if (filtro === "Vencidos") return esVencido;
    if (filtro === "Activo") return p.estado === "Activo" && !esVencido;
    if (filtro === "Devuelto") return p.estado === "Devuelto";
    return p.estado === filtro;
  });

  const getCount = (f) => {
    if (f === "Todos") return prestamos.length;
    if (f === "Vencidos") return prestamos.filter(p => new Date(p.fechaDevolucionEsperada) < hoy && p.estado === "Activo").length;
    if (f === "Activo") return prestamos.filter(p => p.estado === "Activo" && new Date(p.fechaDevolucionEsperada) >= hoy).length;
    if (f === "Devuelto") return prestamos.filter(p => p.estado === "Devuelto").length;
    return 0;
  };

  return (
    <div className="view-content">
      <div className="view-toolbar">
        <div className="tab-group" role="tablist">
          {FILTROS.map(f => (
            <button
              key={f}
              className={`tab-btn${filtro === f ? " tab-btn--active" : ""}`}
              onClick={() => setFiltro(f)}
              role="tab"
              aria-selected={filtro === f}
            >
              <span>{f}</span>
              <span className="tab-count">{getCount(f)}</span>
            </button>
          ))}
        </div>
        <div className="view-toolbar__meta">
          <span className="badge-count">Mostrando {filtered.length} registros</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <p>No se registran préstamos en el filtro "{filtro}".</p>
        </div>
      ) : (
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>Folio</th>
                <th>Obra / Título</th>
                <th>Beneficiario</th>
                <th>Identificación</th>
                <th>Emisión</th>
                <th>Límite Retorno</th>
                <th>Estado</th>
                <th style={{ textAlign: "right" }}>Acción de Auditoría</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const libro = getLibro(p.libroId);
                const vence = new Date(p.fechaDevolucionEsperada);
                const esVencido = vence < hoy && p.estado === "Activo";
                return (
                  <tr key={p.id} className={esVencido ? "tbl--warn" : ""}>
                    <td className="td-id">#{String(p.id).padStart(4, "0")}</td>
                    <td className="td-title" title={libro?.titulo || `Tomo #${p.libroId}`}>
                      {libro ? libro.titulo : `Tomo #${p.libroId}`}
                    </td>
                    <td>{p.usuarioNombre}</td>
                    <td><code className="td-mono">{p.usuarioIdentificacion}</code></td>
                    <td>{new Date(p.fechaPrestamo).toLocaleDateString("es-SV")}</td>
                    <td style={{ color: esVencido ? "var(--color-status-danger)" : "var(--color-text-primary)", fontWeight: esVencido ? 600 : 400 }}>
                      {vence.toLocaleDateString("es-SV")}
                    </td>
                    <td>
                      <span className={`chip chip--${esVencido ? "vencido" : p.estado === "Activo" ? "activo" : "cerrado"}`}>
                        <span aria-hidden="true">{esVencido ? "⚠" : p.estado === "Activo" ? "✓" : "↩"}</span>
                        {esVencido ? "VENCIDO" : p.estado.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {p.estado === "Activo" ? (
                        <button 
                          className="btn-outline btn-outline--sm" 
                          onClick={() => onDevolver(p.id)} 
                          id={`btn-devolver-${p.id}`}
                          title="Finalizar préstamo e ingresar ejemplar a bodega"
                        >
                          Asentar Devolución
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>
                          Reintegrado
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
