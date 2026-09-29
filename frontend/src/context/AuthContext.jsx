import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const PERFILES = {
  bibliotecario: {
    id: 1,
    nombre: 'Eduardo A. Ramirez',
    email: 'eduardo.ramirez@syntepro.com',
    cargo: 'Analista de Soluciones TI',
    institucion: 'Syntepro / ASESUISA',
    dui: '06138859-0',
    rol: 'bibliotecario',
    iniciales: 'ER',
  },
  lector: {
    id: 2,
    nombre: 'Ana Morales Guardado',
    email: 'ana.morales@asesuisa.com',
    cargo: 'Consultora de Negocio',
    institucion: 'ASESUISA',
    dui: '05129944-8',
    rol: 'lector',
    iniciales: 'AM',
  },
};

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  const login = useCallback((email, _password) => {
    const perfil = Object.values(PERFILES).find(p => p.email === email);
    if (perfil) { setUsuario(perfil); return { ok: true }; }
    return { ok: false, mensaje: 'Credenciales no reconocidas.' };
  }, []);

  const loginRapido = useCallback((tipo) => {
    setUsuario(PERFILES[tipo] ?? PERFILES.lector);
  }, []);

  const logout = useCallback(() => setUsuario(null), []);

  return (
    <AuthContext.Provider value={{ usuario, login, loginRapido, logout, PERFILES }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
