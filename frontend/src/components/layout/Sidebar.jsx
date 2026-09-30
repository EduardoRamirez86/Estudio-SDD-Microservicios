import React from "react";
import { useAuth } from "../../context/AuthContext";

const NAV_LECTOR = [
  { id: "dashboard",    label: "Dashboard",       icon: "grid" },
  { id: "catalogo",     label: "Catálogo",        icon: "book" },
  { id: "misprestamos", label: "Mis Préstamos",   icon: "bookmark" },
];

const NAV_BIBLIOTECARIO = [
  { id: "dashboard",    label: "Dashboard",       icon: "grid" },
  { id: "catalogo",     label: "Catálogo",        icon: "book" },
  { id: "gestion",      label: "Gestión Préstamos",icon: "list" },
  { id: "arquitectura", label: "Arquitectura SDD", icon: "layers" },
];

const ICONS = {
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="3" width="7" height="7" rx="1.5"/>
      <rect x="14" y="14" width="7" height="7" rx="1.5"/>
      <rect x="3" y="14" width="7" height="7" rx="1.5"/>
    </svg>
  ),
  book: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
      <path d="M8 7h8M8 11h6"/>
    </svg>
  ),
  bookmark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2"/>
      <line x1="8" y1="9" x2="16" y2="9"/>
      <line x1="8" y1="13" x2="16" y2="13"/>
      <line x1="8" y1="17" x2="12" y2="17"/>
    </svg>
  ),
  layers: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="12 2 2 7 12 12 22 7 12 2"/>
      <polyline points="2 17 12 22 22 17"/>
      <polyline points="2 12 12 17 22 12"/>
    </svg>
  ),
};

export function Sidebar({ activeView, onNav, apiHealth = { catalogo: true, prestamos: true } }) {
  const { usuario, logout } = useAuth();
  const nav = usuario?.rol === "bibliotecario" ? NAV_BIBLIOTECARIO : NAV_LECTOR;

  return (
    <aside 
      className="w-[264px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1322] flex flex-col flex-shrink-0 select-none z-10 transition-colors shadow-[1px_0_10px_rgba(0,0,0,0.03)] dark:shadow-[1px_0_15px_rgba(0,0,0,0.2)]" 
      aria-label="Navegación del Sistema"
    >
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-600 dark:bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-emerald-900/20 border border-emerald-500/40" aria-hidden="true">
            LS
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
              LibroSync
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
                ENTERPRISE
              </span>
              <span className="text-[9px] font-mono px-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                v2.0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 flex items-center justify-between">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            {usuario?.rol === "bibliotecario" ? "Administración Operativa" : "Portal del Lector"}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="Sistema Activo" />
        </div>

        {nav.map(item => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              id={`nav-${item.id}`}
              aria-current={isActive ? "page" : undefined}
              className={`w-full group flex items-center justify-between px-3.5 py-3 rounded-lg text-sm transition-all duration-150 text-left ${
                isActive
                  ? "bg-emerald-500/10 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/30 dark:border-emerald-500/30 shadow-sm"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white border border-transparent font-medium"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className={`transition-colors ${
                  isActive 
                    ? "text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-400 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                }`}>
                  {ICONS[item.icon]}
                </span>
                <span className="truncate leading-tight text-[13.5px]">{item.label}</span>
              </div>

              {isActive && (
                <div className="w-1.5 h-4 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              )}
            </button>
          );
        })}

      </nav>

      {/* User Footer Profile */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/70">
        <div className="flex items-center justify-between gap-2.5 p-2 rounded-lg bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/60 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 flex items-center justify-center font-bold text-xs tracking-wider border border-slate-300 dark:border-slate-600">
                {usuario?.iniciales || "OP"}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-800" title="Operador en línea" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[13px] font-bold text-slate-900 dark:text-slate-100 truncate" title={usuario?.nombre}>
                {usuario?.nombre}
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 truncate font-medium">
                {usuario?.rol === "bibliotecario" ? "Bibliotecario · Admin" : "Lector Institucional"}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-transparent hover:border-rose-200 dark:hover:border-rose-900/50 transition-all flex-shrink-0"
            title="Cerrar sesión"
            aria-label="Cerrar sesión"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
