import React, { useState, useEffect } from "react";

/**
 * VisorDigitalDocumental - Visor Corporativo de Lectura Digital (Zero-Clutter)
 * 
 * Enfocado estrictamente en la experiencia de lectura:
 * - Sin telemetría técnica de backend expuesta (sin URLs, buffers, protocolos ni servidores).
 * - Encabezado limpio con Título, Autor y acciones esenciales de ventana.
 * - Estética mate corporativa sin brillos de neón ni elementos gamer.
 */
export function VisorDigitalDocumental({ libro, onClose }) {
  const [fullscreen, setFullscreen] = useState(false);
  const [cargando, setCargando] = useState(true);

  const endpointUrl = `http://localhost:5101/api/v1/catalogo/digital/${libro.id}`;

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleOpenExternal = () => {
    window.open(endpointUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="visor-overlay" 
      onClick={onClose}
      role="dialog" 
      aria-modal="true"
      aria-label={`Lectura digital: ${libro.titulo}`}
    >
      <div 
        className={`visor-modal ${fullscreen ? "visor-modal--fullscreen" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Encabezado Corporativo Limpio */}
        <header className="visor-header">
          <div className="visor-header__info">
            <h2 className="visor-header__title">{libro.titulo}</h2>
            <p className="visor-header__author">{libro.autorNombre || "Autor Institucional / Sin registrar"}</p>
          </div>

          <div className="visor-header__controls">
            <button
              type="button"
              className="visor-btn-ghost"
              onClick={handleOpenExternal}
              title="Abrir en pestaña independiente"
              id="visor-btn-popout"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              <span>Nueva ventana</span>
            </button>

            <button
              type="button"
              className="visor-btn-ghost"
              onClick={() => setFullscreen(!fullscreen)}
              title={fullscreen ? "Restaurar tamaño normal" : "Pantalla completa"}
              id="visor-btn-fullscreen"
            >
              {fullscreen ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M15 3h6v6m0 0l-7 7m-9 5H3v-6m0 0l7-7" />
                </svg>
              )}
              <span>{fullscreen ? "Ventana" : "Expandir"}</span>
            </button>

            <button
              type="button"
              className="visor-btn-close"
              onClick={onClose}
              title="Cerrar visor de lectura (Esc)"
              id="visor-btn-close"
              aria-label="Cerrar visor de lectura"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Cerrar</span>
            </button>
          </div>
        </header>

        {/* Contenedor del Documento PDF */}
        <div className="visor-body">
          {cargando && (
            <div className="visor-loading">
              <div className="visor-spinner" />
              <p>Cargando edición digital...</p>
            </div>
          )}

          <iframe
            src={`${endpointUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="visor-iframe"
            title={`Edición Digital: ${libro.titulo}`}
            onLoad={() => setCargando(false)}
          />
        </div>
      </div>
    </div>
  );
}
