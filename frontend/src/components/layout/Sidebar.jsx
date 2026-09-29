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
  grid:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  book:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h8M8 11h6"/></svg>,
  bookmark: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>,
  list:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  layers:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
};

export function Sidebar({ activeView, onNav }) {
  const { usuario, logout } = useAuth();
  const nav = usuario?.rol === "bibliotecario" ? NAV_BIBLIOTECARIO : NAV_LECTOR;

  return (
    <aside className="sidebar" aria-label="Navegación del Sistema">
      <div className="sidebar__brand">
        <div className="sidebar__logo" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/>
          </svg>
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__app-name">LibroSync</span>
          <span className="sidebar__app-ver">ENTERPRISE · V2.0</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__section-label">
          {usuario?.rol === "bibliotecario" ? "Administración" : "Mi Espacio"}
        </span>
        {nav.map(item => (
          <button
            key={item.id}
            className={`sidebar__item${activeView === item.id ? " sidebar__item--active" : ""}`}
            onClick={() => onNav(item.id)}
            id={`nav-${item.id}`}
            aria-current={activeView === item.id ? "page" : undefined}
          >
            {ICONS[item.icon]}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user-block">
          <div className="sidebar__avatar" aria-hidden="true">{usuario?.iniciales}</div>
          <div className="sidebar__user-meta">
            <span className="sidebar__user-name" title={usuario?.nombre}>{usuario?.nombre}</span>
            <span className="sidebar__user-role">
              {usuario?.rol === "bibliotecario" ? "Bibliotecario · Admin" : "Lector Institucional"}
            </span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={logout} title="Cerrar sesión segura" aria-label="Cerrar sesión">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </aside>
  );
}
