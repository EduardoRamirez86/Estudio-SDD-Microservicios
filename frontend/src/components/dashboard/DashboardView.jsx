import React from "react";
import { useAuth } from "../../context/AuthContext";

export function DashboardView({ libros = [], prestamos = [], onNav }) {
  const { usuario } = useAuth();
  const esBibliotecario = usuario?.rol === "bibliotecario";

  // KPIs Operativos de alta prioridad
  const totalTitulos   = libros.length;
  const disponibles    = libros.reduce((acc, l) => acc + (l.stockDisponible || 0), 0);
  const totalStock     = libros.reduce((acc, l) => acc + (l.stockTotal || 0), 0);
  const prestados      = prestamos.filter(p => p.estado === "Activo").length;
  
  const hoy = new Date();
  const vencidos = prestamos.filter(p => {
    return p.estado === "Activo" && new Date(p.fechaDevolucionEsperada) < hoy;
  }).length;

  const misPrestamos = prestamos.filter(p => p.usuarioIdentificacion === usuario?.dui);
  const miVenceProxima = misPrestamos.filter(p => {
    const d = new Date(p.fechaDevolucionEsperada);
    return p.estado === "Activo" && (d - hoy) / (1000 * 60 * 60 * 24) <= 3;
  }).length;

  const getLibroTitulo = (id) => libros.find(l => l.id === id)?.titulo ?? `Obra #${id}`;

  const recientes = prestamos
    .filter(p => p.estado === "Activo")
    .slice(0, 5);

  const porcentajeOcupacion = totalStock > 0 ? Math.round(((totalStock - disponibles) / totalStock) * 100) : 0;

  if (!esBibliotecario) {
    // VISTA LECTOR — Foco en sus materiales en custodia
    return (
      <div className="view-content">
        <header className="dash-header">
          <div>
            <h1 className="dash-header__user-title">Bienvenido, {usuario?.nombre}</h1>
            <p className="dash-header__meta">{usuario?.cargo} — {usuario?.institucion}</p>
          </div>
          <button className="btn-primary" onClick={() => onNav?.("catalogo")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Solicitar Nuevo Ejemplar
          </button>
        </header>

        {/* Tira de Métricas Lector */}
        <section className="metrics-grid" aria-label="Indicadores de Custodia">
          <div className="metric-cell">
            <div className="metric-cell__header">
              <span className="metric-cell__label">Préstamos Activos</span>
            </div>
            <div className="metric-cell__value">{misPrestamos.filter(p => p.estado === "Activo").length}</div>
            <div className="metric-cell__footer">Material en su custodia</div>
          </div>
          <div className="metric-cell">
            <div className="metric-cell__header">
              <span className="metric-cell__label">Próximos a Vencer</span>
            </div>
            <div className={`metric-cell__value${miVenceProxima > 0 ? " metric-cell__value--danger" : ""}`}>
              {miVenceProxima}
            </div>
            <div className="metric-cell__footer">Vencimiento en ≤ 3 días</div>
          </div>
          <div className="metric-cell">
            <div className="metric-cell__header">
              <span className="metric-cell__label">Historial Devueltos</span>
            </div>
            <div className="metric-cell__value">{misPrestamos.filter(p => p.estado === "Devuelto").length}</div>
            <div className="metric-cell__footer">Obras reintegradas</div>
          </div>
          <div className="metric-cell">
            <div className="metric-cell__header">
              <span className="metric-cell__label">Estado de Cuenta</span>
            </div>
            <div className="metric-cell__value metric-cell__value--accent">
              {vencidos > 0 ? "Revisión" : "Solvente"}
            </div>
            <div className="metric-cell__footer">Sin sanciones vigentes</div>
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
            <button className="btn-secondary" onClick={() => onNav?.("catalogo")} style={{ marginTop: "8px" }}>
              Explorar Catálogo Institucional
            </button>
          </div>
        )}
      </div>
    );
  }

  // VISTA BIBLIOTECARIO — Mesa de Control Institucional
  return (
    <div className="view-content">
      {/* Header Operativo */}
      <header className="dash-header">
        <div>
          <h1 className="dash-header__user-title">Mesa de Control de Préstamos</h1>
          <p className="dash-header__meta">
            Operador: <strong>{usuario?.nombre}</strong> — {usuario?.cargo} · {usuario?.institucion}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <button className="btn-secondary" onClick={() => onNav?.("gestion")}>
            Auditoría de Préstamos
          </button>
          <button className="btn-primary" onClick={() => onNav?.("catalogo")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Registrar Préstamo
          </button>
        </div>
      </header>

      {/* Tira de KPIs de Mínima Carga Cognitiva (Ley de Hick) */}
      <section className="metrics-grid" aria-label="Indicadores Clave de Desempeño">
        <div className="metric-cell">
          <div className="metric-cell__header">
            <span className="metric-cell__label">Títulos Catalogados</span>
          </div>
          <div className="metric-cell__value">{totalTitulos}</div>
          <div className="metric-cell__footer">Total en base de datos</div>
        </div>

        <div className="metric-cell">
          <div className="metric-cell__header">
            <span className="metric-cell__label">Ejemplares Disponibles</span>
          </div>
          <div className="metric-cell__value metric-cell__value--accent">{disponibles}</div>
          <div className="metric-cell__footer">De {totalStock} ejemplares totales</div>
        </div>

        <div className="metric-cell">
          <div className="metric-cell__header">
            <span className="metric-cell__label">Préstamos Activos</span>
          </div>
          <div className="metric-cell__value">{prestados}</div>
          <div className="metric-cell__footer">En custodia de personal</div>
        </div>

        <div className="metric-cell">
          <div className="metric-cell__header">
            <span className="metric-cell__label">Alertas de Vencimiento</span>
          </div>
          <div className={`metric-cell__value${vencidos > 0 ? " metric-cell__value--danger" : ""}`}>
            {vencidos}
          </div>
          <div className="metric-cell__footer">
            {vencidos === 0 ? "Sin mora administrativa" : "Préstamos fuera de plazo"}
          </div>
        </div>
      </section>

      {/* Rejilla Estructural (7fr / 3fr) */}
      <div className="dash-content-grid">
        {/* Columna Principal: Préstamos Activos Recientes */}
        <section className="skeleton-card" aria-label="Préstamos Activos Recientes">
          <div className="skeleton-card__header">
            <span className="skeleton-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Préstamos Activos Recientes
            </span>
            <button className="btn-outline btn-outline--sm" onClick={() => onNav?.("gestion")}>
              Ver Registro Completo ({prestados})
            </button>
          </div>

          <div style={{ padding: "0" }}>
            {recientes.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 16px" }}>
                <p>No se registran préstamos activos en este momento.</p>
              </div>
            ) : (
              <div className="tbl-wrap" style={{ border: "none", borderRadius: "0" }}>
                <table className="tbl">
                  <thead>
                    <tr>
                      <th>Folio</th>
                      <th>Título de la Obra</th>
                      <th>Beneficiario</th>
                      <th>Límite Retorno</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recientes.map(p => {
                      const vence = new Date(p.fechaDevolucionEsperada);
                      const esVencido = vence < hoy;
                      return (
                        <tr key={p.id} className={esVencido ? "tbl--warn" : ""}>
                          <td className="td-id">#{String(p.id).padStart(4, "0")}</td>
                          <td className="td-title">{getLibroTitulo(p.libroId)}</td>
                          <td>{p.usuarioNombre}</td>
                          <td style={{ color: esVencido ? "var(--color-status-danger)" : "var(--color-text-primary)", fontWeight: esVencido ? 600 : 400 }}>
                            {vence.toLocaleDateString("es-SV")}
                          </td>
                          <td>
                            <span className={`chip chip--${esVencido ? "vencido" : "activo"}`}>
                              <span aria-hidden="true">{esVencido ? "⚠" : "✓"}</span>
                              {esVencido ? "VENCIDO" : "ACTIVO"}
                            </span>
                          </td>
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
          <div className="skeleton-card__header">
            <span className="skeleton-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              Resumen Operativo
            </span>
          </div>
          <div className="skeleton-card__body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", fontSize: "0.72rem" }}>
                <span style={{ color: "var(--color-text-secondary)" }}>Ocupación de Acervo</span>
                <strong style={{ color: "var(--color-text-primary)", fontFamily: "var(--font-family-mono)" }}>
                  {porcentajeOcupacion}% prestado
                </strong>
              </div>
              <div className="stock-meter">
                <div 
                  className="stock-meter__fill" 
                  style={{ width: `${porcentajeOcupacion}%` }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4px", fontSize: "0.65rem", color: "var(--color-text-muted)" }}>
                <span>Disponibles: {disponibles}</span>
                <span>Prestados: {totalStock - disponibles}</span>
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border-muted)", paddingTop: "12px" }}>
              <div style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Parámetros de Custodia
              </div>
              <ul style={{ listStyle: "none", fontSize: "0.72rem", color: "var(--color-text-muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                <li style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "var(--color-accent-primary)" }}>▪</span>
                  <span>Plazo estándar: 7 a 15 días hábiles.</span>
                </li>
                <li style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "var(--color-accent-primary)" }}>▪</span>
                  <span>Límite máximo: 3 ejemplares por beneficiario.</span>
                </li>
                <li style={{ display: "flex", gap: "6px" }}>
                  <span style={{ color: "var(--color-accent-primary)" }}>▪</span>
                  <span>Auditoría transaccional: Stored Procedures.</span>
                </li>
              </ul>
            </div>

            <div style={{ borderTop: "1px solid var(--color-border-muted)", paddingTop: "12px" }}>
              <button 
                className="btn-secondary" 
                style={{ width: "100%", justifyContent: "center" }}
                onClick={() => onNav?.("catalogo")}
              >
                Consultar Todo el Catálogo
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
