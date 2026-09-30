import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { ConfirmDialog } from "../shared/ConfirmDialog";

export function DashboardView({ libros = [], prestamos = [], onNav, onDevolver }) {
  const { usuario } = useAuth();
  const esBibliotecario = usuario?.rol === "bibliotecario";
  const [confirmDevolucion, setConfirmDevolucion] = useState(null);

  // KPIs Operativos de alta prioridad sincronizados
  const totalTitulos   = libros.length;
  const totalStock     = libros.reduce((acc, l) => acc + (l.stockTotal || 0), 0);
  const prestados      = prestamos.filter(p => p.estado === "Activo").length;
  const disponibles    = Math.max(0, totalStock - prestados);
  
  const hoy = new Date();
  const vencidos = prestamos.filter(p => {
    return p.estado === "Activo" && new Date(p.fechaDevolucionEsperada) < hoy;
  }).length;

  const misPrestamos = prestamos.filter(p => p.usuarioIdentificacion === usuario?.dui);
  const miVenceProxima = misPrestamos.filter(p => {
    const d = new Date(p.fechaDevolucionEsperada);
    return p.estado === "Activo" && (d - hoy) / (1000 * 60 * 60 * 24) <= 3;
  }).length;

  const getLibroTitulo = (id) => {
    const l = libros.find(lib => lib.id === id);
    if (!l) return `Obra #${id}`;
    return l.titulo.replace(/Anios/g, "Años");
  };

  const recientes = prestamos
    .filter(p => p.estado === "Activo")
    .slice(0, 5);

  const porcentajeOcupacion = totalStock > 0 ? Math.min(100, Math.round((prestados / totalStock) * 100)) : 0;

  if (!esBibliotecario) {
    // VISTA LECTOR — Foco en sus materiales en custodia
    return (
      <div className="view-content" style={{ padding: "24px 28px", maxWidth: "100%", boxSizing: "border-box" }}>
        <header className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px" }}>
          <div>
            <h1 className="dash-header__user-title">Bienvenido, {usuario?.nombre}</h1>
            <p className="dash-header__meta">{usuario?.cargo} — {usuario?.institucion}</p>
          </div>
          <button 
            type="button"
            className="btn-primary" 
            onClick={() => onNav?.("catalogo")}
            style={{
              backgroundColor: "var(--color-accent-primary, #059669)",
              color: "#ffffff",
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(5, 150, 105, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Solicitar Nuevo Ejemplar
          </button>
        </header>

        {/* Consola Táctil Lector */}
        <section 
          className="kpi-console-chassis" 
          aria-label="Indicadores de Custodia"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "16px",
            width: "100%"
          }}
        >
          <div className="kpi-tactile-module kpi-tactile-module--titanium">
            <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

            <div className="kpi-tactile__icon-cluster" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                <path d="M6 6h10M6 10h10" strokeLinecap="round" />
              </svg>
            </div>
            <div className="kpi-tactile__content">
              <span className="kpi-tactile__label">Préstamos Activos</span>
              <div className="kpi-tactile__val-row">
                <span className="kpi-tactile__val kpi-tactile__val--titanium">
                  {misPrestamos.filter(p => p.estado === "Activo").length}
                </span>
              </div>
              <span className="kpi-tactile__footer">Material en su custodia</span>
            </div>
          </div>

          <div className="kpi-tactile-module kpi-tactile-module--brass">
            <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

            <div className="kpi-tactile__icon-cluster" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" strokeLinecap="round" />
              </svg>
            </div>
            <div className="kpi-tactile__content">
              <span className="kpi-tactile__label">Próximos a Vencer</span>
              <div className="kpi-tactile__val-row">
                <span className={`kpi-tactile__val kpi-tactile__val--brass${miVenceProxima > 0 ? " kpi-tactile__val--danger" : ""}`}>
                  {miVenceProxima}
                </span>
              </div>
              <span className="kpi-tactile__footer">Vencimiento en ≤ 3 días</span>
            </div>
          </div>

          <div className="kpi-tactile-module kpi-tactile-module--sapphire">
            <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

            <div className="kpi-tactile__icon-cluster" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="kpi-tactile__content">
              <span className="kpi-tactile__label">Historial Devueltos</span>
              <div className="kpi-tactile__val-row">
                <span className="kpi-tactile__val kpi-tactile__val--sapphire">
                  {misPrestamos.filter(p => p.estado === "Devuelto").length}
                </span>
              </div>
              <span className="kpi-tactile__footer">Obras reintegradas</span>
            </div>
          </div>

          <div className="kpi-tactile-module kpi-tactile-module--emerald">
            <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
            <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

            <div className="kpi-tactile__icon-cluster" aria-hidden="true">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="kpi-tactile__content">
              <span className="kpi-tactile__label">Estado de Cuenta</span>
              <div className="kpi-tactile__val-row">
                <span className="kpi-tactile__val kpi-tactile__val--emerald">
                  {vencidos > 0 ? "Revisión" : "Solvente"}
                </span>
              </div>
              <span className="kpi-tactile__footer">Sin sanciones vigentes</span>
            </div>
          </div>
        </section>

        {/* Contenido Lector */}
        {misPrestamos.length > 0 ? (
          <div className="skeleton-card">
            <div className="skeleton-card__header">
              <span className="skeleton-card__title">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                Obras Activas en su Custodia
              </span>
              <span className="dash-header__badge">{misPrestamos.filter(p=>p.estado==="Activo").length} pendientes</span>
            </div>
            <div className="skeleton-card__body">
              <div className="loan-list">
                {misPrestamos.map(p => {
                  const vence = new Date(p.fechaDevolucionEsperada);
                  const dias  = Math.ceil((vence - hoy) / (1000 * 60 * 60 * 24));
                  const esVencido = p.estado === "Activo" && dias < 0;
                  return (
                    <div key={p.id} className="loan-card">
                      <span className="loan-card__id">#{String(p.id).padStart(4, "0")}</span>
                      <div className="loan-card__info">
                        <div className="loan-card__title">{getLibroTitulo(p.libroId)}</div>
                        <div className="loan-card__meta">
                          <span>Fecha límite: {vence.toLocaleDateString("es-SV")}</span>
                          <span>Folio emisión: #{String(p.id).padStart(4, "0")}</span>
                        </div>
                      </div>
                      <div className="loan-card__right">
                        <span className={`chip chip--${esVencido ? "vencido" : p.estado === "Activo" ? "activo" : "cerrado"}`}>
                          <span aria-hidden="true">{esVencido ? "⚠" : "✓"}</span>
                          {esVencido ? "VENCIDO" : p.estado.toUpperCase()}
                        </span>
                        {p.estado === "Activo" && !esVencido && (
                          <span className="loan-days">{dias}d restantes</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <p>No registra préstamos activos en su expediente.</p>
            <button 
              type="button"
              className="btn-secondary" 
              onClick={() => onNav?.("catalogo")} 
              style={{ 
                marginTop: "12px", 
                backgroundColor: "var(--color-surface-elevated, #1e293b)",
                borderColor: "var(--color-border-focus, #475569)",
                color: "var(--color-text-primary, #f8fafc)",
                fontWeight: 600,
                padding: "8px 16px",
                borderRadius: "6px"
              }}
            >
              Explorar Catálogo Institucional
            </button>
          </div>
        )}
      </div>
    );
  }

  // VISTA BIBLIOTECARIO — Mesa de Control Institucional
  return (
    <div className="view-content" style={{ padding: "24px 28px", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header Operativo */}
      <header className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px" }}>
        <div>
          <h1 className="dash-header__user-title">Mesa de Control de Préstamos</h1>
          <p className="dash-header__meta">
            Operador: <strong>{usuario?.nombre}</strong> — {usuario?.cargo} · {usuario?.institucion}
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <button 
            type="button"
            className="btn-secondary" 
            onClick={() => onNav?.("gestion")}
            style={{
              backgroundColor: "var(--color-surface-elevated, #1e293b)",
              border: "1px solid var(--color-border-focus, #475569)",
              color: "var(--color-text-primary, #f8fafc)",
              fontWeight: 600,
              padding: "9px 16px",
              borderRadius: "6px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
            Auditoría de Préstamos
          </button>
          <button 
            type="button"
            className="btn-primary" 
            onClick={() => onNav?.("catalogo")}
            style={{
              backgroundColor: "var(--color-accent-primary, #059669)",
              color: "#ffffff",
              fontWeight: 600,
              padding: "9px 18px",
              borderRadius: "6px",
              boxShadow: "0 2px 6px rgba(5, 150, 105, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Préstamo
          </button>
        </div>
      </header>

      {/* Consola Táctil Física de KPIs: Chasis de Titanio Oscuro y Módulos de Metales & Gemas */}
      <section 
        className="kpi-console-chassis" 
        aria-label="Consola de Indicadores Clave de Desempeño"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "16px",
          width: "100%"
        }}
      >
        {/* Módulo 1: Titanio Cepillado / Gris Plata */}
        <div className="kpi-tactile-module kpi-tactile-module--titanium">
          <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

          <div className="kpi-tactile__icon-cluster" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <ellipse cx="12" cy="5" rx="8" ry="2.5" />
              <path d="M4 5v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5V5" />
              <path d="M4 10v5c0 1.38 3.58 2.5 8 2.5s8-1.12 8-2.5v-5" />
              <circle cx="17.5" cy="17.5" r="2.5" strokeWidth="1.6" />
              <path d="M17.5 13.5v1.2M17.5 20.3v1.2M13.5 17.5h1.2M20.3 17.5h1.2" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="kpi-tactile__content">
            <span className="kpi-tactile__label">Títulos Catalogados</span>
            <div className="kpi-tactile__val-row">
              <span className="kpi-tactile__val kpi-tactile__val--titanium">{totalTitulos}</span>
            </div>
            <span className="kpi-tactile__footer">Total en base de datos</span>
          </div>
        </div>

        {/* Módulo 2: Esmeralda Pulido (Verde con Sparkline en Micro-Cuadrícula) */}
        <div className="kpi-tactile-module kpi-tactile-module--emerald">
          <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

          <div className="kpi-tactile__icon-cluster" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 6.5 12 3l8 3.5L12 10z" />
              <path d="M4 10.5 12 14l8-3.5" />
              <path d="M4 14.5 12 18l8-3.5" />
              <path d="M4 18.5 12 22l8-3.5" />
              <path d="M4 6.5v12M20 6.5v12" />
            </svg>
          </div>

          <div className="kpi-tactile__content">
            <span className="kpi-tactile__label">Ejemplares Disponibles</span>
            <div className="kpi-tactile__val-row">
              <span className="kpi-tactile__val kpi-tactile__val--emerald">{disponibles}</span>
              <div className="kpi-tactile__sparkline-container" aria-label="Tendencia de disponibilidad">
                <svg width="68" height="28" viewBox="0 0 68 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="tactileGridDash" width="6" height="6" patternUnits="userSpaceOnUse">
                      <path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(52, 211, 153, 0.16)" strokeWidth="0.5" />
                    </pattern>
                    <linearGradient id="tactileSparkGradDash" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <rect width="68" height="28" fill="url(#tactileGridDash)" rx="3" />
                  <path
                    d="M 2 20 Q 12 22 22 15 T 40 13 T 54 7 L 66 4"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="drop-shadow(0 0 4px rgba(52, 211, 153, 0.9))"
                  />
                  <path
                    d="M 2 20 Q 12 22 22 15 T 40 13 T 54 7 L 66 4 L 66 28 L 2 28 Z"
                    fill="url(#tactileSparkGradDash)"
                  />
                  <circle cx="66" cy="4" r="2.2" fill="#a7f3d0" filter="drop-shadow(0 0 3px #34d399)" />
                </svg>
              </div>
            </div>
            <span className="kpi-tactile__footer">De {totalStock} ejemplares totales</span>
          </div>
        </div>

        {/* Módulo 3: Zafiro Pulido (Azul Institucional) */}
        <div className="kpi-tactile-module kpi-tactile-module--sapphire">
          <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

          <div className="kpi-tactile__icon-cluster" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <circle cx="18.5" cy="14.5" r="2.5" strokeWidth="1.6" />
              <path d="M18.5 10.5v1.2M18.5 17.3v1.2M14.5 14.5h1.2M21.3 14.5h1.2" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>

          <div className="kpi-tactile__content">
            <span className="kpi-tactile__label">Préstamos Activos</span>
            <div className="kpi-tactile__val-row">
              <span className="kpi-tactile__val kpi-tactile__val--sapphire">{prestados}</span>
            </div>
            <span className="kpi-tactile__footer">En custodia de personal</span>
          </div>
        </div>

        {/* Módulo 4: Latón y Ámbar Cálido (Oro Metálico / Alertas) */}
        <div className="kpi-tactile-module kpi-tactile-module--brass">
          <span className="kpi-rivet kpi-rivet--tl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--tr" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--bl" aria-hidden="true" />
          <span className="kpi-rivet kpi-rivet--br" aria-hidden="true" />

          <div className="kpi-tactile__icon-cluster" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="4" width="15" height="17" rx="2" />
              <line x1="12" y1="2" x2="12" y2="5" strokeLinecap="round" />
              <line x1="6" y1="2" x2="6" y2="5" strokeLinecap="round" />
              <line x1="2" y1="9" x2="17" y2="9" />
              <path d="M18 16a2 2 0 0 0 2 0c0-1.2.7-1.8 1-2.4a2.5 2.5 0 0 0-4.8-.8c.2.6.9 1.2.9 2.2" strokeWidth="1.5" />
              <path d="M18 18.5a.8.8 0 0 0 1.6 0" strokeWidth="1.5" />
            </svg>
          </div>

          <div className="kpi-tactile__content">
            <span className="kpi-tactile__label">Alertas de Vencimiento</span>
            <div className="kpi-tactile__val-row">
              <span className={`kpi-tactile__val kpi-tactile__val--brass${vencidos > 0 ? " kpi-tactile__val--danger" : ""}`}>
                {vencidos}
              </span>
            </div>
            <span className="kpi-tactile__footer">
              {vencidos === 0 ? "Sin mora administrativa" : "Préstamos fuera de plazo"}
            </span>
          </div>
        </div>
      </section>

      {/* Rejilla Estructural (7fr / 3fr adaptativa) */}
      <div 
        className="dash-content-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 7fr) minmax(310px, 3fr)",
          gap: "24px",
          alignItems: "start"
        }}
      >
        {/* Columna Principal: Préstamos Activos Recientes */}
        <section className="skeleton-card" aria-label="Préstamos Activos Recientes">
          <div className="skeleton-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <span className="skeleton-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Préstamos Activos Recientes
            </span>
            <button 
              type="button"
              className="btn-outline btn-outline--sm" 
              onClick={() => onNav?.("gestion")}
              style={{
                backgroundColor: "var(--color-surface-elevated, #1e293b)",
                borderColor: "var(--color-border-focus, #475569)",
                color: "var(--color-text-secondary, #cbd5e1)",
                fontWeight: 600,
                padding: "6px 12px",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              Ver Registro Completo ({prestados})
            </button>
          </div>

          <div style={{ padding: "0" }}>
            {recientes.length === 0 ? (
              <div className="empty-state" style={{ padding: "36px 16px", textAlign: "center" }}>
                <p style={{ color: "var(--color-text-muted)" }}>No se registran préstamos activos en este momento.</p>
              </div>
            ) : (
              <div className="tbl-wrap" style={{ border: "none", borderRadius: "0" }}>
                <table className="tbl" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th style={{ padding: "12px 16px" }}>Folio</th>
                      <th style={{ padding: "12px 16px" }}>Título de la Obra</th>
                      <th style={{ padding: "12px 16px" }}>Beneficiario</th>
                      <th style={{ padding: "12px 16px" }}>Límite Retorno</th>
                      <th style={{ padding: "12px 16px" }}>Estado</th>
                      {onDevolver && <th style={{ textAlign: "right", padding: "12px 16px" }}>Operación</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map(p => {
                      const vence = new Date(p.fechaDevolucionEsperada);
                      const esVencido = vence < hoy;
                      return (
                        <tr key={p.id} className={esVencido ? "tbl--warn" : ""}>
                          <td className="td-id" style={{ padding: "14px 16px" }}>
                            <span style={{ fontFamily: "var(--font-family-mono)", color: "var(--color-text-secondary)" }}>
                              #{String(p.id).padStart(4, "0")}
                            </span>
                          </td>
                          <td className="td-title" style={{ padding: "14px 16px", fontWeight: 600 }}>
                            {getLibroTitulo(p.libroId)}
                          </td>
                          <td style={{ padding: "14px 16px" }}>{p.usuarioNombre}</td>
                          <td style={{ 
                            padding: "14px 16px",
                            color: esVencido ? "var(--color-status-danger, #ef4444)" : "var(--color-text-primary)", 
                            fontWeight: esVencido ? 600 : 400 
                          }}>
                            {vence.toLocaleDateString("es-SV")}
                          </td>
                          <td style={{ padding: "14px 16px" }}>
                            <span className={`chip chip--${esVencido ? "vencido" : "activo"}`}>
                              <span aria-hidden="true">{esVencido ? "⚠" : "✓"}</span>
                              {esVencido ? "VENCIDO" : "ACTIVO"}
                            </span>
                          </td>
                          {onDevolver && (
                            <td style={{ textAlign: "right", padding: "14px 16px" }}>
                              <button
                                type="button"
                                className="btn-outline btn-outline--sm"
                                onClick={() => setConfirmDevolucion(p)}
                                title="Finalizar préstamo e ingresar ejemplar a bodega"
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "6px",
                                  backgroundColor: "rgba(16, 185, 129, 0.12)",
                                  border: "1px solid rgba(16, 185, 129, 0.45)",
                                  color: "var(--color-accent-primary, #10b981)",
                                  fontWeight: 600,
                                  fontSize: "0.74rem",
                                  padding: "6px 14px",
                                  borderRadius: "6px",
                                  boxShadow: "0 1px 2px rgba(0,0,0,0.25)",
                                  cursor: "pointer",
                                  transition: "all 0.15s ease"
                                }}
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                                Asentar Devolución
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Columna Lateral: Estado del Acervo y Normativa */}
        <aside className="skeleton-card" aria-label="Resumen de Inventario y Operaciones">
          <div className="skeleton-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <span className="skeleton-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Resumen Operativo
            </span>
            <span className="badge-count" style={{ fontSize: "0.62rem", fontFamily: "var(--font-family-mono)", padding: "3px 7px", borderRadius: "4px", backgroundColor: "var(--color-surface-elevated, #334155)", color: "var(--color-text-secondary, #cbd5e1)" }}>
              AUDITORÍA ACTIVA
            </span>
          </div>

          <div className="skeleton-card__body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "18px" }}>
            {/* Gráfica Circular Hueca (Radial Bar / Donut Chart con Anillos Concéntricos) */}
            <div className="donut-chart-container">
              <div className="donut-chart-wrapper">
                <svg width="130" height="130" viewBox="0 0 130 130" className="donut-svg" aria-label="Gráfica de ocupación">
                  <defs>
                    <linearGradient id="donutGradEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6ee7b7" />
                      <stop offset="50%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <filter id="emeraldGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#10b981" floodOpacity="0.75" />
                    </filter>
                  </defs>

                  {/* Pistas de fondo adaptativas para Light y Dark mode */}
                  <circle cx="65" cy="65" r="50" fill="none" stroke="currentColor" className="text-slate-200 dark:text-white/10" strokeWidth="6.5" />
                  <circle cx="65" cy="65" r="39" fill="none" stroke="currentColor" className="text-slate-200/70 dark:text-white/5" strokeWidth="4.5" />
                  <circle cx="65" cy="65" r="29" fill="none" stroke="currentColor" className="text-slate-200/50 dark:text-white/5" strokeWidth="3.5" />

                  {/* Anillo exterior luminoso: Ocupación de Acervo */}
                  <circle
                    cx="65" cy="65" r="50"
                    fill="none"
                    stroke="url(#donutGradEmerald)"
                    strokeWidth="6.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 50}
                    strokeDashoffset={2 * Math.PI * 50 * (1 - (porcentajeOcupacion || 0) / 100)}
                    transform="rotate(-90 65 65)"
                    filter="url(#emeraldGlow)"
                  />
                  {/* Anillo medio: Disponibilidad proporcional en azul zafiro */}
                  <circle
                    cx="65" cy="65" r="39"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 39}
                    strokeDashoffset={2 * Math.PI * 39 * (1 - (totalStock > 0 ? (disponibles / totalStock) * 0.75 : 0.5))}
                    transform="rotate(-90 65 65)"
                    strokeOpacity="0.8"
                  />
                  {/* Anillo interior: Rotación de acervo en tono ámbar */}
                  <circle
                    cx="65" cy="65" r="29"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 29}
                    strokeDashoffset={2 * Math.PI * 29 * 0.65}
                    transform="rotate(-90 65 65)"
                    strokeOpacity="0.75"
                  />
                </svg>

                {/* Lectura numérica central */}
                <div className="donut-center-readout">
                  <span className="donut-center-val">{porcentajeOcupacion}%</span>
                  <span className="donut-center-sub">OCUPACIÓN</span>
                </div>
              </div>

              {/* Leyenda analítica a la derecha con especificación explícita de Ejemplares */}
              <div className="donut-legend">
                <div className="donut-legend-item">
                  <span className="donut-legend-dot donut-legend-dot--emerald" />
                  <div className="donut-legend-info">
                    <span className="donut-legend-label">Prestados</span>
                    <strong className="donut-legend-val">
                      {prestados} {prestados === 1 ? "ejemplar prestado" : "ejemplares prestados"}
                    </strong>
                  </div>
                </div>
                <div className="donut-legend-item">
                  <span className="donut-legend-dot donut-legend-dot--sapphire" />
                  <div className="donut-legend-info">
                    <span className="donut-legend-label">Disponibles</span>
                    <strong className="donut-legend-val">
                      {disponibles} {disponibles === 1 ? "ejemplar en bodega" : "ejemplares disponibles"}
                    </strong>
                  </div>
                </div>
                <div className="donut-legend-item">
                  <span className="donut-legend-dot donut-legend-dot--amber" />
                  <div className="donut-legend-info">
                    <span className="donut-legend-label">Stock Total</span>
                    <strong className="donut-legend-val">
                      {totalStock} {totalStock === 1 ? "ejemplar catalogado" : "ejemplares en catálogo"}
                    </strong>
                  </div>
                </div>
                <span style={{ fontSize: "0.63rem", color: "var(--color-text-muted)", marginTop: "3px", fontFamily: "var(--font-family-mono)" }}>
                  * Ejemplar = Unidad física de libro
                </span>
              </div>
            </div>

            {/* Parámetros de Custodia con Checkboxes de Validación */}
            <div className="custodia-section">
              <div className="custodia-section__title">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>Parámetros de Custodia</span>
              </div>

              <div className="custodia-checklist">
                <div className="custodia-check-item">
                  <div className="custodia-checkbox" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="custodia-check-text">
                    <span className="custodia-check-title">Plazo estándar:</span>
                    <span className="custodia-check-desc">7 a 15 días hábiles validados.</span>
                  </div>
                </div>

                <div className="custodia-check-item">
                  <div className="custodia-checkbox" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="custodia-check-text">
                    <span className="custodia-check-title">Límite por beneficiario:</span>
                    <span className="custodia-check-desc">Máximo 3 ejemplares por solicitante.</span>
                  </div>
                </div>

                <div className="custodia-check-item">
                  <div className="custodia-checkbox" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="custodia-check-text">
                    <span className="custodia-check-title">Auditoría transaccional:</span>
                    <span className="custodia-check-desc">Stored Procedures en SQL Server.</span>
                  </div>
                </div>

                <div className="custodia-check-item">
                  <div className="custodia-checkbox" aria-hidden="true">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="custodia-check-text">
                    <span className="custodia-check-title">Integridad de Acervo:</span>
                    <span className="custodia-check-desc">Aislamiento ACID en DB_Catalogo.</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border-muted)", paddingTop: "14px" }}>
              <button 
                type="button"
                className="btn-secondary" 
                style={{ 
                  width: "100%", 
                  justifyContent: "center",
                  backgroundColor: "var(--color-surface-elevated, #1e293b)",
                  border: "1px solid var(--color-border-focus, #475569)",
                  color: "var(--color-text-primary, #f8fafc)",
                  fontWeight: 600,
                  padding: "10px 16px",
                  borderRadius: "6px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                }}
                onClick={() => onNav?.("catalogo")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                Consultar Todo el Catálogo
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Institucional de Confirmación con Fricción Intencional */}
      <ConfirmDialog
        isOpen={!!confirmDevolucion}
        title="Confirmación de Devolución de Ejemplar"
        subtitle="Esta operación asentará el retorno formal en el acervo institucional y actualizará el inventario disponible."
        badge="AUDITORÍA Y CUSTODIA INSTITUCIONAL"
        details={[
          { label: "Folio de Préstamo", value: `#${String(confirmDevolucion?.id || 0).padStart(4, "0")}` },
          { label: "Obra / Título", value: getLibroTitulo(confirmDevolucion?.libroId) },
          { label: "Beneficiario", value: confirmDevolucion?.usuarioNombre || "" },
          { label: "Documento de Identificación", value: confirmDevolucion?.usuarioIdentificacion || "" },
          { label: "Procedimiento Almacenado", value: "sp_FinalizarDevolucion (SQL Server Transaccional)" }
        ]}
        warningMessage="Al asentar esta devolución se liberará la retención del ejemplar y el beneficiario quedará solvente en el sistema."
        confirmText="Asentar Devolución Definitiva"
        cancelText="Descartar y Regresar"
        isDanger={false}
        onConfirm={async () => {
          if (confirmDevolucion && onDevolver) {
            await onDevolver(confirmDevolucion.id);
            setConfirmDevolucion(null);
          }
        }}
        onCancel={() => setConfirmDevolucion(null)}
      />
    </div>
  );
}
