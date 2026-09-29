import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export function LoginPage() {
  const { login, loginRapido } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const result = login(email, password);
    if (!result.ok) setError(result.mensaje);
    setLoading(false);
  };

  return (
    <div className="login-root">
      <div className="login-bg-grid" />
      <div className="login-panel">
        <div className="login-brand">
          <div className="login-logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h8M8 11h8M8 15h5"/></svg>
          </div>
          <div>
            <h1 className="login-name">LibroSync</h1>
            <p className="login-subtitle">Sistema Distribuido de Archivo Bibliotecario</p>
          </div>
        </div>

        <div className="login-divider" />

        <form onSubmit={handleSubmit} className="login-form">
          <div className="field-group">
            <label className="field-label">Correo institucional</label>
            <input
              className="field-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="usuario@syntepro.com"
              required
              id="login-email"
              autoComplete="email"
            />
          </div>
          <div className="field-group">
            <label className="field-label">Contraseña</label>
            <input
              className="field-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              id="login-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button className="btn-primary" type="submit" disabled={loading} id="login-submit">
            {loading ? (
              <span className="btn-spinner" />
            ) : "Acceder al sistema"}
          </button>
        </form>

        <div className="login-divider" />

        <div className="quick-access">
          <p className="quick-access__label">Acceso rapido — Evaluacion de portfolio</p>
          <div className="quick-access__cards">
            <button className="qa-card qa-card--admin" onClick={() => loginRapido("bibliotecario")} id="qa-bibliotecario">
              <div className="qa-card__avatar">ER</div>
              <div className="qa-card__info">
                <span className="qa-card__name">Eduardo Ramirez</span>
                <span className="qa-card__role">Bibliotecario · Admin</span>
              </div>
              <span className="qa-card__badge qa-card__badge--admin">ADMIN</span>
            </button>
            <button className="qa-card qa-card--user" onClick={() => loginRapido("lector")} id="qa-lector">
              <div className="qa-card__avatar qa-card__avatar--user">AM</div>
              <div className="qa-card__info">
                <span className="qa-card__name">Ana Morales</span>
                <span className="qa-card__role">Lectora · Consultora</span>
              </div>
              <span className="qa-card__badge qa-card__badge--user">LECTOR</span>
            </button>
          </div>
        </div>

        <p className="login-footer">LibroSync Enterprise v2.0 · Microservicios + SDD + Dapper</p>
      </div>
    </div>
  );
}
