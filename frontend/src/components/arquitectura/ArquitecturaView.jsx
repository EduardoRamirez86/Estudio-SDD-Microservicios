import React, { useState } from "react";

function AccordionItem({ icon, label, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc-item skeleton-card">
      <div 
        className="acc-item__header" 
        onClick={() => setOpen(v => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") setOpen(v => !v); }}
        aria-expanded={open}
      >
        <div className="acc-item__left">
          <span className="acc-item__icon" aria-hidden="true">{icon}</span>
          <span className="acc-item__label">{label}</span>
          {badge && <span className="arch-panel__badge">{badge}</span>}
        </div>
        <svg 
          className={`acc-item__chevron${open ? " acc-item__chevron--open" : ""}`}
          width="14" 
          height="14" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>
      {open && <div className="acc-item__body">{children}</div>}
    </div>
  );
}

function ArchDiagram() {
  return (
    <svg viewBox="0 0 520 340" width="100%" style={{ maxWidth: 520, display: "block", margin: "0 auto" }}>
      <defs>
        <marker id="arr-neutral" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--color-border-focus, #94a3b8)"/>
        </marker>
        <marker id="arr-accent" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="var(--color-accent-primary, #059669)"/>
        </marker>
      </defs>

      {/* Capa de Presentación: React SPA */}
      <rect x="180" y="10" width="160" height="48" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1"/>
      <text x="260" y="28" textAnchor="middle" fill="var(--color-text-primary, #0f172a)" fontSize="11" fontFamily="var(--font-family-ui)" fontWeight="600">Frontend SPA (React 19)</text>
      <text x="260" y="44" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="9" fontFamily="var(--font-family-mono)">localhost:3000 · Vite</text>

      {/* Conexiones HTTP desde Frontend hacia APIs */}
      <line x1="220" y1="58" x2="150" y2="108" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <line x1="300" y1="58" x2="370" y2="108" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <text x="165" y="80" fill="var(--color-text-muted, #64748b)" fontSize="8" fontFamily="var(--font-family-mono)">HTTP/REST</text>
      <text x="355" y="80" fill="var(--color-text-muted, #64748b)" fontSize="8" fontFamily="var(--font-family-mono)">HTTP/REST</text>

      {/* Microservicio 1: Catalogo.Api */}
      <rect x="40" y="110" width="190" height="58" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-accent-primary, #059669)" strokeWidth="1.5"/>
      <text x="135" y="130" textAnchor="middle" fill="var(--color-text-primary, #0f172a)" fontSize="11" fontFamily="var(--font-family-ui)" fontWeight="600">Catalogo.Api</text>
      <text x="135" y="146" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="9" fontFamily="var(--font-family-mono)">Puerto :5101 · N-Layer</text>
      <text x="135" y="159" textAnchor="middle" fill="var(--color-accent-primary, #059669)" fontSize="8.5" fontFamily="var(--font-family-mono)" fontWeight="600">Dapper + Stored Procs</text>

      {/* Microservicio 2: Prestamos.Api */}
      <rect x="290" y="110" width="190" height="58" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.5"/>
      <text x="385" y="130" textAnchor="middle" fill="var(--color-text-primary, #0f172a)" fontSize="11" fontFamily="var(--font-family-ui)" fontWeight="600">Prestamos.Api</text>
      <text x="385" y="146" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="9" fontFamily="var(--font-family-mono)">Puerto :5102 · N-Layer</text>
      <text x="385" y="159" textAnchor="middle" fill="var(--color-text-secondary, #475569)" fontSize="8.5" fontFamily="var(--font-family-mono)" fontWeight="600">Dapper + Stored Procs</text>

      {/* Comunicación Inter-Servicios: HttpClient tipado ICatalogoClient */}
      <line x1="290" y1="139" x2="238" y2="139" stroke="var(--color-accent-primary, #059669)" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr-accent)"/>
      <text x="264" y="133" textAnchor="middle" fill="var(--color-accent-primary, #059669)" fontSize="8" fontFamily="var(--font-family-mono)" fontWeight="600">HttpClient</text>

      {/* Enlaces de APIs a Motores de BD */}
      <line x1="110" y1="168" x2="90" y2="232" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <line x1="410" y1="168" x2="430" y2="232" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>

      {/* Motor Relacional Centralizado (Lógico) */}
      <rect x="210" y="196" width="100" height="38" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-border-subtle, #cbd5e1)" strokeWidth="1"/>
      <text x="260" y="213" textAnchor="middle" fill="var(--color-text-secondary, #475569)" fontSize="9" fontFamily="var(--font-family-mono)" fontWeight="600">SQL SERVER</text>
      <text x="260" y="226" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="8" fontFamily="var(--font-family-mono)">2022 Relational Engine</text>
      <line x1="90" y1="232" x2="210" y2="215" stroke="var(--color-border-subtle, #cbd5e1)" strokeWidth="0.8" strokeDasharray="3 3"/>
      <line x1="430" y1="232" x2="310" y2="215" stroke="var(--color-border-subtle, #cbd5e1)" strokeWidth="0.8" strokeDasharray="3 3"/>

      {/* Base de Datos Aislada 1: DB_Catalogo */}
      <rect x="20" y="236" width="160" height="48" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1"/>
      <text x="100" y="256" textAnchor="middle" fill="var(--color-text-primary, #0f172a)" fontSize="10.5" fontFamily="var(--font-family-ui)" fontWeight="600">DB_Catalogo</text>
      <text x="100" y="272" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="8.5" fontFamily="var(--font-family-mono)">Autores · Libros · Stock</text>

      {/* Base de Datos Aislada 2: DB_Prestamos */}
      <rect x="340" y="236" width="160" height="48" rx="6" fill="var(--color-surface-elevated, #f1f5f9)" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1"/>
      <text x="420" y="256" textAnchor="middle" fill="var(--color-text-primary, #0f172a)" fontSize="10.5" fontFamily="var(--font-family-ui)" fontWeight="600">DB_Prestamos</text>
      <text x="420" y="272" textAnchor="middle" fill="var(--color-text-muted, #64748b)" fontSize="8.5" fontFamily="var(--font-family-mono)">Prestamos · Auditoría</text>

      {/* Leyenda Técnica WCAG */}
      <line x1="20" y1="310" x2="48" y2="310" stroke="var(--color-accent-primary, #059669)" strokeWidth="1.2" strokeDasharray="4 3"/>
      <text x="56" y="313" fill="var(--color-text-muted, #64748b)" fontSize="8" fontFamily="var(--font-family-mono)">Contrato inter-servicio (HttpClient / JSON)</text>
      <line x1="20" y1="326" x2="48" y2="326" stroke="var(--color-border-focus, #94a3b8)" strokeWidth="1.2"/>
      <text x="56" y="329" fill="var(--color-text-muted, #64748b)" fontSize="8" fontFamily="var(--font-family-mono)">Invocación SP Dapper precompilado (ADO.NET)</text>
    </svg>
  );
}

const IcoDb = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <ellipse cx="12" cy="5" rx="9" ry="3"/>
    <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5"/>
    <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3"/>
  </svg>
);

const IcoCode = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const IcoLayers = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polygon points="12 2 2 7 12 12 22 7 12 2"/>
    <polyline points="2 17 12 22 22 17"/>
    <polyline points="2 12 12 17 22 12"/>
  </svg>
);

const IcoNetwork = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="2" y="2" width="6" height="6" rx="1"/>
    <rect x="16" y="2" width="6" height="6" rx="1"/>
    <rect x="9" y="16" width="6" height="6" rx="1"/>
    <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
    <line x1="12" y1="13" x2="12" y2="16"/>
  </svg>
);

export function ArquitecturaView() {
  return (
    <div className="view-content" style={{ padding: "24px 28px", maxWidth: "100%", boxSizing: "border-box" }}>
      {/* Header Institucional Unificado */}
      <header className="dash-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", paddingBottom: "16px" }}>
        <div>
          <h1 className="dash-header__user-title">Arquitectura SDD & Especificación de Integración</h1>
          <p className="dash-header__meta">
            Diseño guiado por especificaciones de aislamiento de esquemas · Microservicios .NET 10 y React 19
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
          <span className="dash-header__badge">
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-accent-primary, #10b981)", display: "inline-block" }} />
            Aislamiento de Esquema Verificado
          </span>
        </div>
      </header>

      {/* Grid de Topología y Patrones Arquitectónicos */}
      <div className="arch-grid-layout">
        {/* Panel Izquierdo: Topología Visual */}
        <section className="skeleton-card arch-panel" aria-label="Topología de Microservicios">
          <div className="skeleton-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
            <span className="skeleton-card__title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="2" y="2" width="6" height="6" rx="1"/>
                <rect x="16" y="2" width="6" height="6" rx="1"/>
                <rect x="9" y="16" width="6" height="6" rx="1"/>
                <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/>
                <line x1="12" y1="13" x2="12" y2="16"/>
              </svg>
              Topología Distribuida de Microservicios
            </span>
            <span className="arch-panel__badge">.NET 10 · C# · Dapper</span>
          </div>
          <div className="skeleton-card__body" style={{ padding: "20px" }}>
            <ArchDiagram />
          </div>
        </section>

        {/* Panel Derecho: Patrones y Acordeones */}
        <aside className="arch-accordion" aria-label="Patrones y Aislamiento">
          {/* Card de Estado Operativo de Nodos (SDD) */}
          <div className="skeleton-card" style={{ padding: "16px 18px", marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "0.72rem", fontFamily: "var(--font-family-mono)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-secondary)" }}>
                Estado Operativo de Nodos
              </span>
              <span className="arch-panel__badge" style={{ backgroundColor: "rgba(16, 185, 129, 0.12)", color: "var(--color-accent-primary)", borderColor: "rgba(16, 185, 129, 0.25)", fontSize: "0.65rem" }}>
                Aislamiento SDD
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontFamily: "var(--font-family-mono)", fontSize: "0.78rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--color-surface-elevated)", border: "1px solid var(--color-border-muted)" }}>
                <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Catalogo.Api</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-status-success)", fontWeight: 600 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-status-success)", display: "inline-block" }} />
                  :5101 · En Línea
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--color-surface-elevated)", border: "1px solid var(--color-border-muted)" }}>
                <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>Prestamos.Api</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--color-status-success)", fontWeight: 600 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "var(--color-status-success)", display: "inline-block" }} />
                  :5102 · En Línea
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: "6px", backgroundColor: "var(--color-surface-elevated)", border: "1px solid var(--color-border-muted)" }}>
                <span style={{ color: "var(--color-text-primary)", fontWeight: 600 }}>SQL Server</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#3b82f6", fontWeight: 600 }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "inline-block" }} />
                  2022 · DB_Catalogo / DB_Prestamos
                </span>
              </div>
            </div>
          </div>

          <AccordionItem 
            icon={IcoDb} 
            label="Database-per-Service" 
            badge="ESTRICTO"
            defaultOpen={true}
          >
            Cada microservicio custodia con exclusividad su base de datos independiente.
            <br/><br/>
            <code>Catalogo.Api</code> consulta únicamente <code>DB_Catalogo</code>.
            <br/>
            <code>Prestamos.Api</code> consulta únicamente <code>DB_Prestamos</code>.
            <br/><br/>
            Los <strong>JOINs cruzados entre bases de datos están prohibidos</strong>. Toda verificación de disponibilidad de stock se efectúa mediante contratos de API vía HTTP.
          </AccordionItem>

          <AccordionItem 
            icon={IcoCode} 
            label="Dapper + Stored Procedures" 
            badge="RENDIMIENTO"
            defaultOpen={true}
          >
            Sin ORM dinámico pesado. Todas las operaciones de lectura y mutación invocan Stored Procedures precompilados mediante ADO.NET y Dapper.
            <br/><br/>
            Ejemplos en producción:
            <br/>
            • <code>sp_RegistrarPrestamo</code> (parámetro de salida <code>OUTPUT @Id</code>).
            <br/>
            • <code>sp_ActualizarStockLibro</code> (transaccional ACID).
            <br/>
            • <code>sp_ListarPrestamosActivos</code> (consulta optimizada sin scans).
          </AccordionItem>

          <AccordionItem 
            icon={IcoLayers} 
            label="Aislamiento N-Layer Puro" 
            badge="ARQUITECTURA"
            defaultOpen={false}
          >
            Regla de dependencias limpias e inversión de control:
            <br/><br/>
            <code>Api</code> → <code>Application</code> → <code>Domain</code>
            <br/>
            <code>Infrastructure</code> → <code>Application</code>
            <br/><br/>
            La capa <code>Domain</code> define interfaces puras: <code>ILibroRepository</code> e <code>IPrestamoRepository</code>, sin dependencias de infraestructura ni frameworks.
          </AccordionItem>

          <AccordionItem 
            icon={IcoNetwork} 
            label="Contrato Inter-Servicio ICatalogoClient" 
            badge="RESILIENCIA"
            defaultOpen={false}
          >
            Al registrar un préstamo, <code>Prestamos.Api</code> requiere validar el stock existente en el catálogo.
            <br/><br/>
            Se implementa un <code>HttpClient</code> tipado que consume el endpoint <code>GET /api/v1/libros/{'{id}'}</code> con timeout estricto y manejo de excepciones estructuradas.
          </AccordionItem>
        </aside>
      </div>

      {/* Matriz de Contratos OpenAPI / Endpoints de Microservicios */}
      <section className="skeleton-card" style={{ marginTop: "24px" }} aria-label="Matriz de Contratos SDD">
        <div className="skeleton-card__header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px" }}>
          <span className="skeleton-card__title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            Matriz de Contratos HTTP & Aislamiento de Persistencia (SDD)
          </span>
          <span className="arch-panel__badge">OpenAPI 3.0 · REST RFC 7807</span>
        </div>
        <div className="table-wrapper" style={{ overflowX: "auto" }}>
          <table className="dash-table" style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "12px 18px" }}>Microservicio</th>
                <th style={{ textAlign: "left", padding: "12px 18px" }}>Método / Ruta</th>
                <th style={{ textAlign: "left", padding: "12px 18px" }}>Base de Datos Aislada</th>
                <th style={{ textAlign: "left", padding: "12px 18px" }}>Persistencia / Procedimiento</th>
                <th style={{ textAlign: "left", padding: "12px 18px" }}>Propósito Arquitectónico</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: "12px 18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  <code>Catalogo.Api</code> <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>:5101</span>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", backgroundColor: "rgba(5, 150, 105, 0.12)", color: "var(--color-accent-primary)", border: "1px solid rgba(5, 150, 105, 0.25)", marginRight: "6px" }}>GET</span>
                  <code>/api/v1/libros</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>DB_Catalogo</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>sp_ListarCatalogo</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                  Consulta de acervo institucional con stock y metadatos Dewey.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px 18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  <code>Catalogo.Api</code> <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>:5101</span>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", backgroundColor: "rgba(5, 150, 105, 0.12)", color: "var(--color-accent-primary)", border: "1px solid rgba(5, 150, 105, 0.25)", marginRight: "6px" }}>GET</span>
                  <code>/api/v1/libros/{'{id}'}</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>DB_Catalogo</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>sp_ObtenerLibroPorId</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                  Contrato consumido por <code>ICatalogoClient</code> para verificar stock previo a préstamo.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px 18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  <code>Prestamos.Api</code> <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>:5102</span>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", backgroundColor: "rgba(59, 130, 246, 0.12)", color: "#3b82f6", border: "1px solid rgba(59, 130, 246, 0.25)", marginRight: "6px" }}>POST</span>
                  <code>/api/v1/prestamos</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>DB_Prestamos</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>sp_RegistrarPrestamo</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                  Emisión formal del préstamo con retorno de ID y actualización en catálogo vía HTTP.
                </td>
              </tr>
              <tr>
                <td style={{ padding: "12px 18px", fontWeight: 600, color: "var(--color-text-primary)" }}>
                  <code>Prestamos.Api</code> <span style={{ fontSize: "0.68rem", color: "var(--color-text-muted)" }}>:5102</span>
                </td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, padding: "2px 6px", borderRadius: "3px", backgroundColor: "rgba(217, 119, 6, 0.12)", color: "var(--color-status-warning)", border: "1px solid rgba(217, 119, 6, 0.25)", marginRight: "6px" }}>PUT</span>
                  <code>/api/v1/prestamos/{'{id}'}/devolver</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>DB_Prestamos</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-secondary)" }}>
                  <code>sp_DevolverPrestamo</code>
                </td>
                <td style={{ padding: "12px 18px", color: "var(--color-text-muted)", fontSize: "0.75rem" }}>
                  Asentamiento del reintegro físico y restitución atómica de la unidad en inventario.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
