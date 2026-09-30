import React, { useState, useEffect } from "react";

/**
 * TopBar - Barra Superior Corporativa
 * Incluye Health Check dinámico en tiempo real y selector de tema Claro/Oscuro.
 */
export function TopBar({ titulo, subtitulo, apiHealth = { catalogo: true, prestamos: true }, theme = "light", onToggleTheme }) {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const tick = () => {
      setHora(new Date().toLocaleTimeString("es-SV", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Evaluación de salud de los microservicios
  const isOnline = apiHealth.catalogo && apiHealth.prestamos;
  const isDegraded = (apiHealth.catalogo && !apiHealth.prestamos) || (!apiHealth.catalogo && apiHealth.prestamos);
  const isError = !apiHealth.catalogo && !apiHealth.prestamos;

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between transition-colors" role="banner">
      <div className="flex items-center gap-2">
        <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{titulo}</span>
        {subtitulo && (
          <>
            <span className="text-slate-300 dark:text-slate-600 text-sm">/</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitulo}</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Health Check Dinámico de APIs */}
        <div 
          className="cursor-default"
          title={`Catalogo.Api: ${apiHealth.catalogo ? 'Online' : 'Offline'} | Prestamos.Api: ${apiHealth.prestamos ? 'Online' : 'Offline'}`}
        >
          {isOnline && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/70 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              APIs en Línea
            </span>
          )}
          {isDegraded && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-400 dark:border-amber-800/70 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              Degradado
            </span>
          )}
          {isError && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/60 dark:text-rose-400 dark:border-rose-800/70 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              Error de Conexión
            </span>
          )}
        </div>

        {/* Selector Dual de Tema (Light / Dark) */}
        <button
          type="button"
          onClick={onToggleTheme}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm"
          title={theme === "dark" ? "Cambiar a Tema Claro" : "Cambiar a Modo Oscuro"}
          id="btn-theme-toggle"
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>

        {hora && <span className="font-mono text-xs text-slate-500 dark:text-slate-400">{hora}</span>}
      </div>
    </header>
  );
}
