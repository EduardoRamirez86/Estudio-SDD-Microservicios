import React, { useState, useEffect } from "react";

export function TopBar({ titulo, subtitulo }) {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const tick = () => {
      setHora(new Date().toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="topbar" role="banner">
      <div className="topbar__left">
        <span className="topbar__title">{titulo}</span>
        {subtitulo && (
          <>
            <span className="topbar__sep" aria-hidden="true">/</span>
            <span className="topbar__sub">{subtitulo}</span>
          </>
        )}
      </div>
      <div className="topbar__right">
        <div className="topbar__status" title="Microservicios Catalogo.Api y Prestamos.Api en ejecución">
          <span className="topbar__status-dot" aria-hidden="true" />
          <span>Servicios Operativos</span>
        </div>
        {hora && <span className="topbar__clock">{hora}</span>}
      </div>
    </header>
  );
}
