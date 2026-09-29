import { useState, useCallback } from "react";
const CATALOGO_API = "http://localhost:5101/api/v1";
const PRESTAMOS_API = "http://localhost:5102/api/v1";
export function useApi(addLog) {
  const [loading, setLoading] = useState(false);
  const request = useCallback(async (servicio, metodo, path, body = null) => {
    const base = servicio === "catalogo" ? CATALOGO_API : PRESTAMOS_API;
    const tag  = servicio === "catalogo" ? "Catalogo.Api" : "Prestamos.Api";
    const dbTag = servicio === "catalogo" ? "DB_Catalogo" : "DB_Prestamos";
    setLoading(true);
    addLog(tag, `${metodo} ${path}`, "request");
    try {
      const opts = { method: metodo, headers: { "Content-Type": "application/json" } };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(`${base}${path}`, opts);
      const data = res.status !== 204 ? await res.json() : null;
      if (res.ok) {
        addLog(tag, `${res.status} OK -- respuesta desde ${dbTag}`, "success");
        return { ok: true, data };
      }
      const msg = data?.mensaje || data?.message || `Error ${res.status}`;
      addLog(tag, `${res.status} ERROR -- ${msg}`, "error");
      return { ok: false, mensaje: msg };
    } catch (err) {
      addLog(tag, `Sin conexion con ${tag}: ${err.message}`, "error");
      return { ok: false, mensaje: `Sin conexion con ${tag}` };
    } finally { setLoading(false); }
  }, [addLog]);
  const get  = useCallback((svc, path)       => request(svc, "GET",  path),       [request]);
  const post = useCallback((svc, path, body) => request(svc, "POST", path, body), [request]);
  const put  = useCallback((svc, path, body) => request(svc, "PUT",  path, body), [request]);
  return { loading, get, post, put };
}
