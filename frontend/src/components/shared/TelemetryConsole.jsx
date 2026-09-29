import React, { useState } from "react";

const FILTROS = ["TODOS", "CATÁLOGO", "PRÉSTAMOS", "SQL", "ERRORES"];

export function TelemetryConsole({ logs = [], onClear }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filtro, setFiltro] = useState("TODOS");

  const filtered = logs.filter(l => {
    if (filtro === "TODOS")     return true;
    if (filtro === "CATÁLOGO")  return l.tag?.includes("Catalogo");
    if (filtro === "PRÉSTAMOS") return l.tag?.includes("Prestamos");
    if (filtro === "SQL")       return l.tipo === "sql";
    if (filtro === "ERRORES")   return l.tipo === "error";
    return true;
  });

  const lastLog = logs.length > 0 ? logs[0] : null;

  return (
    <footer className={`tele-drawer ${isExpanded ? "tele-drawer--expanded" : "tele-drawer--collapsed"}`} aria-label="Consola de Telemetría Distribuida">
      {/* Barra de Divulgación Progresiva (Siempre visible al pie, 34px) */}
      <div 
        className="tele-drawer__bar" 
        onClick={() => setIsExpanded(prev => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { setIsExpanded(prev => !prev); } }}
        aria-expanded={isExpanded}
      >
        <div className="tele-drawer__info">
          <span className="tele-drawer__dot" aria-hidden="true" />
          <span>Telemetría de Trazas</span>
          <span className="tele-drawer__count">[{logs.length}]</span>
          {lastLog && (
            <span className="tele-drawer__last-trace" title={lastLog.texto}>
              Último evento: [{lastLog.tag}] {lastLog.texto}
            </span>
          )}
        </div>
        <div className="tele-drawer__toggle-btn">
          <span>{isExpanded ? "Minimizar" : "Ver trazas"}</span>
          <svg 
            width="12" 
            height="12" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.15s ease" }}
            aria-hidden="true"
          >
            <polyline points="18 15 12 9 6 15" />
          </svg>
        </div>
      </div>

      {/* Contenido Extendido (Solo visible si isExpanded) */}
      {isExpanded && (
        <div className="tele-drawer__content">
          <div className="tele-drawer__toolbar">
            <div className="tele-filters" role="tablist">
              {FILTROS.map(f => (
                <button
                  key={f}
                  className={`tele-btn${filtro === f ? " tele-btn--active" : ""}`}
                  onClick={(e) => { e.stopPropagation(); setFiltro(f); }}
                  role="tab"
                  aria-selected={filtro === f}
                >
                  {f}
                </button>
              ))}
            </div>
            <button 
              className="tele-btn tele-btn--clear" 
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              title="Limpiar registro de trazas"
            >
              Limpiar trazas
            </button>
          </div>

          <div className="tele-logs" role="log" aria-live="polite">
            {filtered.length === 0 ? (
              <div className="empty-state" style={{ padding: "16px", color: "var(--color-text-muted)" }}>
                <span>Sin trazas registradas para el filtro seleccionado.</span>
              </div>
            ) : (
              filtered.map(l => {
                const isError = l.tipo === "error";
                return (
                  <div key={l.id} className="tele-line">
                    <span className="tele-time">[{l.hora}]</span>
                    <span className="tele-tag" style={{ color: isError ? "var(--color-status-danger)" : "var(--color-text-primary)" }}>
                      [{l.tag}]
                    </span>
                    <span className="tele-msg" style={{ color: isError ? "var(--color-status-danger)" : "var(--color-text-secondary)" }}>
                      {l.texto}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
