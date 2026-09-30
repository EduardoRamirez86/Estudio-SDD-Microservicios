import React, { useState, useEffect } from "react";

/**
 * VisorDigitalDocumental - Componente de Visualizacion Documental por Streaming
 * 
 * Implementa una consola tactil de aspecto neumorfico oscuro y titanio cepillado,
 * que aloja un frame de lectura alimentado directamente por el microservicio Catalogo.Api
 * a traves de un proxy asincrono puro (zero-RAM y zero-disk retention).
 */
export function VisorDigitalDocumental({ libro, onClose }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [cargandoStream, setCargandoStream] = useState(true);
  const [switchActive, setSwitchActive] = useState(true);

  const endpointUrl = `http://localhost:5101/api/v1/catalogo/digital/${libro.id}`;

  // Captura de tecla Escape para desconexion limpia
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleTriggerSwitch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTriggerSwitch = () => {
    // Animacion fisica del interruptor basculante antes de cerrar
    setSwitchActive(false);
    setTimeout(() => {
      onClose();
    }, 240);
  };

  const handleOpenExternal = () => {
    window.open(endpointUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="visor-backdrop" 
      onClick={handleTriggerSwitch}
      role="dialog" 
      aria-modal="true"
      aria-label={`Visor Digital: ${libro.titulo}`}
    >
      <div 
        className={`visor-chassis ${fullscreen ? "visor-chassis--fullscreen" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Remaches de montaje del chasis de titanio */}
        <div className="visor-chassis__rivet visor-chassis__rivet--tl" aria-hidden="true" />
        <div className="visor-chassis__rivet visor-chassis__rivet--tr" aria-hidden="true" />
        <div className="visor-chassis__rivet visor-chassis__rivet--bl" aria-hidden="true" />
        <div className="visor-chassis__rivet visor-chassis__rivet--br" aria-hidden="true" />

        {/* Panel Superior de Control y Telemetria */}
        <header className="visor-header">
          <div className="visor-header__meta">
            <div className="visor-header__led-strip">
              <span className="visor-led-indicator" aria-hidden="true" />
              <span className="visor-telemetry-tag">STREAMING PROXY // NET10 ZERO-RAM</span>
            </div>
            <h2 className="visor-title">{libro.titulo}</h2>
            <div className="visor-subline">
              <span className="visor-author">{libro.autorNombre || "Autor Institucional"}</span>
              <span className="visor-sep" aria-hidden="true">|</span>
              <span className="visor-badge-dewey">{libro.categoriaId ? `DEWEY-CAT-${libro.categoriaId}` : "FONDO GENERAL"}</span>
              <span className="visor-sep" aria-hidden="true">|</span>
              <code className="visor-isbn">ISBN {libro.isbn || "N/A"}</code>
            </div>
          </div>

          <div className="visor-header__actions">
            {/* Boton de apertura en pestana independiente */}
            <button
              type="button"
              className="visor-aux-btn"
              onClick={handleOpenExternal}
              title="Abrir tunel de streaming en pestana externa nativa"
              id="visor-open-tab"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Popout</span>
            </button>

            {/* Toggle de pantalla completa */}
            <button
              type="button"
              className="visor-aux-btn"
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? "Restaurar tamano de consola" : "Expandir a pantalla completa"}
              id="visor-toggle-fullscreen"
            >
              {fullscreen ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 3h6v6m0 0l-7 7m-9 5H3v-6m0 0l7-7" />
                </svg>
              )}
              <span>{fullscreen ? "Contraer" : "Full"}</span>
            </button>

            {/* Interruptor de Consola Fisica (Tactile Rocker Switch) */}
            <div className="visor-switch-housing" title="Interruptor de desconexion del visor">
              <span className="visor-switch-label">PWR // TERMINAL</span>
              <button
                type="button"
                className={`visor-switch-btn ${switchActive ? "visor-switch-btn--on" : "visor-switch-btn--off"}`}
                onClick={handleTriggerSwitch}
                id="visor-btn-switch-close"
                aria-label="Desconectar y cerrar visor digital"
              >
                <div className="visor-switch-toggle">
                  <div className="visor-switch-rocker">
                    <span className="visor-switch-led" />
                    <span className="visor-switch-text">{switchActive ? "ON" : "OFF"}</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Barra de Estado del Enlace HTTP */}
        <div className="visor-tunnel-bar">
          <div className="visor-tunnel-bar__left">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2.5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="tunnel-endpoint">GET /api/v1/catalogo/digital/{libro.id}</span>
            <span className="tunnel-pipe">ResponseHeadersRead &rarr; FileStreamResult</span>
          </div>
          <div className="visor-tunnel-bar__right">
            <span className="tunnel-stat">Disposicion: <strong>inline</strong></span>
            <span className="tunnel-stat">MIME: <strong>application/pdf</strong></span>
            <span className="tunnel-stat">Buffer Servidor: <strong>0 KB</strong></span>
          </div>
        </div>

        {/* Marco Interior del Documento (Recessed Screen Bezel) */}
        <div className="visor-screen-frame">
          {cargandoStream && (
            <div className="visor-loading-overlay">
              <div className="visor-loading-spinner" />
              <p className="visor-loading-text">Enganchando tunel de bytes asincrono con Catalogo.Api...</p>
              <span className="visor-loading-sub">Protocolo HTTP/1.1 Chunked Transfer | Cero retencion RAM</span>
            </div>
          )}

          <iframe
            src={`${endpointUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="visor-screen-iframe"
            title={`Documento Digital: ${libro.titulo}`}
            onLoad={() => setCargandoStream(false)}
          />
        </div>

        {/* Barra Inferior de Diagnostico & Telemetria */}
        <footer className="visor-footer">
          <div className="visor-footer__left">
            <span className="visor-audit-tag">PROTOCOLO: ASYNC HTTP PROXY</span>
            <span className="visor-audit-tag">SERVIDOR KESTREL :5101</span>
            <span className="visor-audit-tag">CACHE CONTROL: PUBLIC, MAX-AGE 3600</span>
          </div>
          <div className="visor-footer__right">
            <kbd className="visor-kbd">ESC</kbd>
            <span>o interruptor frontal para terminar transmision</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
