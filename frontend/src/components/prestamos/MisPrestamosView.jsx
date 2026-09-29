import React from "react";
import { useAuth } from "../../context/AuthContext";

export function MisPrestamosView({ prestamos = [], libros = [] }) {
  const { usuario } = useAuth();
  const misPrestamos = prestamos.filter(p => p.usuarioIdentificacion === usuario?.dui);

  const getLibro = (id) => libros.find(l => l.id === id);
  const hoy = new Date();

  return (
    <div className="view-content">
      <header className="dash-header">
        <div>
          <h1 className="dash-header__user-title">Mis Préstamos en Custodia</h1>
          <p className="dash-header__meta">
            Expediente personal de material bibliográfico — {usuario?.nombre} ({usuario?.dui})
          </p>
        </div>
        <div className="dash-header__badge">
          <span>{misPrestamos.length} {misPrestamos.length === 1 ? "registro activo" : "registros activos"}</span>
        </div>
      </header>

      {misPrestamos.length === 0 ? (
        <div className="empty-state">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          <p>No tienes obras activas en préstamo en este momento.</p>
          <span style={{ fontSize: "0.72rem", color: "var(--color-text-muted)" }}>
            Consulta el catálogo institucional para solicitar nuevos ejemplares.
          </span>
        </div>
      ) : (
        <div className="loan-list">
          {misPrestamos.map(p => {
            const libro = getLibro(p.libroId);
            const vence = new Date(p.fechaDevolucionEsperada);
            const diasRestantes = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24));
            const vencido = diasRestantes < 0 && p.estado === "Activo";

            return (
              <div key={p.id} className="loan-card">
                <div className="loan-card__id">#{String(p.id).padStart(4, "0")}</div>
                <div className="loan-card__info">
                  <h3 className="loan-card__title">{libro ? libro.titulo : `Obra #${p.libroId}`}</h3>
                  <p className="loan-card__meta">
                    <span>Autor: <strong>{libro?.autorNombre || "Desconocido"}</strong></span>
                    <span>ISBN: {libro?.isbn || "N/A"}</span>
                  </p>
                  <div className="loan-card__dates">
                    <span>Emisión: {new Date(p.fechaPrestamo).toLocaleDateString("es-SV")}</span>
                    <span>
                      Límite de retorno:{" "}
                      <strong style={{ color: vencido ? "var(--color-status-danger)" : "var(--color-text-primary)" }}>
                        {vence.toLocaleDateString("es-SV")}
                      </strong>
                    </span>
                  </div>
                </div>
                <div className="loan-card__right">
                  <span className={`chip chip--${vencido ? "vencido" : p.estado === "Activo" ? "activo" : "cerrado"}`}>
                    <span aria-hidden="true">{vencido ? "⚠" : p.estado === "Activo" ? "✓" : "↩"}</span>
                    {vencido ? "VENCIDO" : p.estado.toUpperCase()}
                  </span>
                  {p.estado === "Activo" && !vencido && (
                    <span className="loan-days">
                      {diasRestantes > 0 ? `${diasRestantes} días restantes` : "Vence hoy"}
                    </span>
                  )}
                  {vencido && (
                    <span className="loan-days" style={{ color: "var(--color-status-danger)", fontWeight: 600 }}>
                      Vencido hace {Math.abs(diasRestantes)} días
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
