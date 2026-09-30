import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApi } from "../../hooks/useApi";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { Toast } from "../shared/Toast";
import { TelemetryConsole } from "../shared/TelemetryConsole";
import { DashboardView } from "../dashboard/DashboardView";
import { CatalogoView } from "../catalogo/CatalogoView";
import { MisPrestamosView } from "../prestamos/MisPrestamosView";
import { GestionView } from "../prestamos/GestionView";
import { ArquitecturaView } from "../arquitectura/ArquitecturaView";

const VIEW_TITLES = {
  dashboard:    { titulo: "Dashboard Operativo", subtitulo: "Mesa de Control y Custodia Institucional" },
  catalogo:     { titulo: "Catálogo Bibliotecario", subtitulo: "Acervo y Disponibilidad de Ejemplares" },
  misprestamos: { titulo: "Mis Préstamos en Custodia", subtitulo: "Control Personal de Devoluciones" },
  gestion:      { titulo: "Gestión de Préstamos", subtitulo: "Auditoría y Retorno de Material Bibliográfico" },
  arquitectura: { titulo: "Arquitectura SDD", subtitulo: "Topología de Microservicios & Database-per-Service" },
};

export function AppShell() {
  const { usuario } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [libros,     setLibros]     = useState([]);
  const [prestamos,  setPrestamos]  = useState([]);
  const [logs,       setLogs]       = useState([]);
  const [toast,      setToast]      = useState(null);

  const addLog = useCallback((tag, texto, tipo = "info") => {
    const hora = new Date().toLocaleTimeString("es-SV", { hour12: false });
    setLogs(prev => [{ id: Date.now() + Math.random(), hora, tag, texto, tipo }, ...prev.slice(0, 49)]);
  }, []);

  const showToast = useCallback((message, type = "success") => setToast({ message, type }), []);

  const { loading: apiLoading, get, post, put } = useApi(addLog);

  const cargarLibros = useCallback(async () => {
    addLog("Catalogo.Api", "GET /libros?pagina=1&tamanio=50 → sp_ObtenerCatalogoLibros", "sql");
    const res = await get("catalogo", "/libros?pagina=1&tamanio=50");
    if (res.ok) setLibros(res.data);
  }, [get, addLog]);

  const cargarPrestamos = useCallback(async () => {
    addLog("Prestamos.Api", "GET /prestamos/activos → sp_ListarPrestamosActivos", "sql");
    const res = await get("prestamos", "/prestamos/activos");
    if (res.ok) setPrestamos(res.data);
  }, [get, addLog]);

  useEffect(() => {
    cargarLibros();
    cargarPrestamos();
  }, [cargarLibros, cargarPrestamos]);

  const handleSolicitarPrestamo = useCallback(async (libro, form) => {
    addLog("Prestamos.Api", `POST /prestamos — Verificando disponibilidad Libro #${libro.id}`, "request");
    const res = await post("prestamos", "/prestamos", {
      libroId: libro.id,
      usuarioIdentificacion: form.usuarioIdentificacion,
      usuarioNombre: form.usuarioNombre,
      diasPrestamo: form.diasPrestamo,
    });
    if (res.ok) {
      addLog("Catalogo.Api", `sp_ActualizarStockLibro — Stock decrementado`, "sql");
      addLog("Prestamos.Api", `sp_RegistrarPrestamo — Folio #${res.data?.id} emitido`, "sql");
      showToast(`Préstamo folio #${res.data?.id} emitido exitosamente.`);
      await cargarLibros();
      await cargarPrestamos();
    } else {
      showToast(res.mensaje || "Error al procesar solicitud.", "error");
    }
  }, [post, addLog, cargarLibros, cargarPrestamos, showToast]);

  const handleDevolucion = useCallback(async (prestamoId) => {
    addLog("Prestamos.Api", `PUT /prestamos/${prestamoId}/devolver → sp_FinalizarDevolucion`, "sql");
    const res = await put("prestamos", `/prestamos/${prestamoId}/devolver`);
    if (res.ok) {
      addLog("Catalogo.Api", `sp_ActualizarStockLibro — Ejemplar reintegrado al inventario`, "sql");
      showToast("Devolución asentada y registrada correctamente.");
      await cargarLibros();
      await cargarPrestamos();
    } else {
      showToast(res.mensaje || "Error al registrar devolución.", "error");
    }
  }, [put, addLog, cargarLibros, cargarPrestamos, showToast]);

  const view = VIEW_TITLES[activeView] || VIEW_TITLES.dashboard;

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return <DashboardView libros={libros} prestamos={prestamos} onNav={setActiveView} onDevolver={handleDevolucion} />;
      case "catalogo":
        return <CatalogoView libros={libros} onSolicitarPrestamo={handleSolicitarPrestamo} loading={apiLoading} />;
      case "misprestamos":
        return <MisPrestamosView prestamos={prestamos} libros={libros} />;
      case "gestion":
        return <GestionView prestamos={prestamos} libros={libros} onDevolver={handleDevolucion} />;
      case "arquitectura":
        return <ArquitecturaView />;
      default:
        return null;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar activeView={activeView} onNav={setActiveView} />
      <div className="app-shell__main">
        <TopBar titulo={view.titulo} subtitulo={view.subtitulo} />
        <main className="app-shell__content">
          {renderView()}
        </main>
        {/* Telemetría y Trazas Técnicas: Solo visibles para perfil Bibliotecario / Admin */}
        {usuario?.rol === "bibliotecario" && (
          <TelemetryConsole logs={logs} onClear={() => setLogs([])} />
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
