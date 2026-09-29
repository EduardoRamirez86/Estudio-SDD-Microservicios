import React, { useState } from "react";

function AccordionItem({ icon, label, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="acc-item">
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
          <polygon points="0 0, 8 3, 0 6" fill="#636b7b"/>
        </marker>
        <marker id="arr-accent" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#1e7e5d"/>
        </marker>
      </defs>

      {/* Capa de Presentación: React SPA */}
      <rect x="180" y="10" width="160" height="46" rx="3" fill="#181c24" stroke="#252b36" strokeWidth="1"/>
      <text x="260" y="28" textAnchor="middle" fill="#f0f2f5" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Frontend SPA (React 19)</text>
      <text x="260" y="44" textAnchor="middle" fill="#9aa1b0" fontSize="9" fontFamily="JetBrains Mono, monospace">localhost:3000 · Vite</text>

      {/* Conexiones HTTP desde Frontend hacia APIs */}
      <line x1="220" y1="56" x2="150" y2="108" stroke="#636b7b" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <line x1="300" y1="56" x2="370" y2="108" stroke="#636b7b" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <text x="165" y="78" fill="#636b7b" fontSize="8" fontFamily="JetBrains Mono, monospace">HTTP/REST</text>
      <text x="355" y="78" fill="#636b7b" fontSize="8" fontFamily="JetBrains Mono, monospace">HTTP/REST</text>

      {/* Microservicio 1: Catalogo.Api */}
      <rect x="40" y="110" width="190" height="58" rx="3" fill="#181c24" stroke="#1e7e5d" strokeWidth="1"/>
      <text x="135" y="130" textAnchor="middle" fill="#f0f2f5" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Catalogo.Api</text>
      <text x="135" y="146" textAnchor="middle" fill="#9aa1b0" fontSize="9" fontFamily="JetBrains Mono, monospace">Puerto :5101 · N-Layer</text>
      <text x="135" y="159" textAnchor="middle" fill="#1e7e5d" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">Dapper + Stored Procs</text>

      {/* Microservicio 2: Prestamos.Api */}
      <rect x="290" y="110" width="190" height="58" rx="3" fill="#181c24" stroke="#252b36" strokeWidth="1"/>
      <text x="385" y="130" textAnchor="middle" fill="#f0f2f5" fontSize="11" fontFamily="Inter, sans-serif" fontWeight="600">Prestamos.Api</text>
      <text x="385" y="146" textAnchor="middle" fill="#9aa1b0" fontSize="9" fontFamily="JetBrains Mono, monospace">Puerto :5102 · N-Layer</text>
      <text x="385" y="159" textAnchor="middle" fill="#9aa1b0" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fontWeight="600">Dapper + Stored Procs</text>

      {/* Comunicación Inter-Servicios: HttpClient tipado ICatalogoClient */}
      <line x1="290" y1="139" x2="238" y2="139" stroke="#1e7e5d" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#arr-accent)"/>
      <text x="264" y="133" textAnchor="middle" fill="#1e7e5d" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="600">HttpClient</text>

      {/* Enlaces de APIs a Motores de BD */}
      <line x1="110" y1="168" x2="90" y2="232" stroke="#636b7b" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>
      <line x1="410" y1="168" x2="430" y2="232" stroke="#636b7b" strokeWidth="1.2" markerEnd="url(#arr-neutral)"/>

      {/* Motor Relacional Centralizado (Lógico) */}
      <rect x="210" y="196" width="100" height="38" rx="3" fill="#181c24" stroke="#252b36" strokeWidth="1"/>
      <text x="260" y="213" textAnchor="middle" fill="#9aa1b0" fontSize="9" fontFamily="JetBrains Mono, monospace" fontWeight="600">SQL SERVER</text>
      <text x="260" y="226" textAnchor="middle" fill="#636b7b" fontSize="8" fontFamily="JetBrains Mono, monospace">2022 Relational Engine</text>
      <line x1="90" y1="232" x2="210" y2="215" stroke="#252b36" strokeWidth="0.8" strokeDasharray="3 3"/>
      <line x1="430" y1="232" x2="310" y2="215" stroke="#252b36" strokeWidth="0.8" strokeDasharray="3 3"/>

      {/* Base de Datos Aislada 1: DB_Catalogo */}
      <rect x="20" y="236" width="160" height="48" rx="3" fill="#181c24" stroke="#252b36" strokeWidth="1"/>
      <text x="100" y="256" textAnchor="middle" fill="#f0f2f5" fontSize="10.5" fontFamily="Inter, sans-serif" fontWeight="600">DB_Catalogo</text>
      <text x="100" y="272" textAnchor="middle" fill="#9aa1b0" fontSize="8.5" fontFamily="JetBrains Mono, monospace">Autores · Libros · Stock</text>

      {/* Base de Datos Aislada 2: DB_Prestamos */}
      <rect x="340" y="236" width="160" height="48" rx="3" fill="#181c24" stroke="#252b36" strokeWidth="1"/>
      <text x="420" y="256" textAnchor="middle" fill="#f0f2f5" fontSize="10.5" fontFamily="Inter, sans-serif" fontWeight="600">DB_Prestamos</text>
      <text x="420" y="272" textAnchor="middle" fill="#9aa1b0" fontSize="8.5" fontFamily="JetBrains Mono, monospace">Prestamos · Auditoría</text>

      {/* Leyenda Técnica WCAG */}
      <line x1="20" y1="310" x2="48" y2="310" stroke="#1e7e5d" strokeWidth="1.2" strokeDasharray="4 3"/>
      <text x="56" y="313" fill="#9aa1b0" fontSize="8" fontFamily="JetBrains Mono, monospace">Contrato inter-servicio (HttpClient / JSON)</text>
      <line x1="20" y1="326" x2="48" y2="326" stroke="#636b7b" strokeWidth="1.2"/>
      <text x="56" y="329" fill="#9aa1b0" fontSize="8" fontFamily="JetBrains Mono, monospace">Invocación SP Dapper precompilado (ADO.NET)</text>
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
    <div className="view-content">
      <header className="dash-header">
        <div>
          <h1 className="dash-header__user-title">Arquitectura SDD & Especificación de Integración</h1>
          <p className="dash-header__meta">
            Diseño guiado por especificaciones de aislamiento · Entorno Corporativo Financiero / Asegurador
          </p>
        </div>
        <div className="dash-header__badge">
          <span>● Aislamiento de Esquema Verificado</span>
        </div>
      </header>

      <div className="arch-grid-layout">
        {/* Panel Izquierdo: Topología Visual */}
        <section className="arch-panel" aria-label="Topología de Microservicios">
          <div className="arch-panel__header">
            <span className="arch-panel__title">Topología Distribuida de Microservicios</span>
            <span className="arch-panel__badge">.NET 10 · C# · Dapper</span>
          </div>
          <ArchDiagram />
        </section>

        {/* Panel Derecho: Patrones y Acordeones */}
        <aside className="arch-accordion" aria-label="Patrones y Aislamiento">
          <AccordionItem 
            icon={IcoDb} 
            label="Database-per-Service" 
            badge="ESTRICTO"
            defaultOpen={true}
          >
            Cada microservicio custodia con exclusividad su base de datos.
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
    </div>
  );
}
