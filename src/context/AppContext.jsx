import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [clients, setClients] = useState([]);
  const [alert, setAlert] = useState(null);

  const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
    timeout: 10000,
  });

  API.interceptors.request.use((cfg) => {
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
  });

  useEffect(() => {
    if (token) fetchClients();
  }, [token]);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  // AUTH
  const login = async (username, password) => {
    const res = await API.post("/auth/login", { username, password });
    const { token: t, user } = res.data;

    setToken(t);
    setCurrentUser(user);

    localStorage.setItem("token", t);
    localStorage.setItem("user", JSON.stringify(user));

    showAlert("success", "Inicio de sesión exitoso");
  };

  const register = async (username, password, nombre) => {
    await API.post("/auth/register", { username, password, nombre });
    showAlert("success", "Usuario registrado. Inicia sesión.");
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showAlert("success", "Sesión cerrada");
  };

  // CLIENTES
  const fetchClients = async () => {
    if (!token) return;

    try {
      const res = await API.get("/clients");
      setClients(res.data);
    } catch (e) {
      console.error(e);
      showAlert("error", "Error al obtener clientes");
    }
  };

  const createClient = async (payload) => {
    const res = await API.post("/clients", payload);
    setClients((p) => [res.data, ...p]);
    return res.data;
  };

  const updateClient = async (id, payload) => {
    const res = await API.put(`/clients/${id}`, payload);
    setClients((p) => p.map((c) => (c._id === id ? res.data : c)));
    return res.data;
  };

  const deleteClient = async (id) => {
    await API.delete(`/clients/${id}`);
    setClients((p) => p.filter((c) => c._id !== id));
  };

  // ✅ AGREGAR VENTA (ya estaba bien)
  const agregarVenta = async (id, payload) => {
    try {
      const res = await API.post(`/clients/${id}/ventas`, payload);
      setClients((p) => p.map(c => c._id === id ? res.data : c));
      showAlert("success", "Venta registrada correctamente");
      return res.data;
    } catch (error) {
      console.error("Error agregando venta:", error);
      showAlert("error", "Error al registrar venta");
      throw error;
    }
  };

 // Actualizar la función enviarMensaje
const enviarMensaje = async (clienteId, data) => {
  try {
    // Aceptar tanto string como objeto
    const payload = typeof data === 'string' 
      ? { mensaje: data } 
      : data;

    const res = await API.post(`/clients/${clienteId}/mensaje`, payload);
    setClients((p) => p.map(c => c._id === clienteId ? res.data : c));
    showAlert("success", "Mensaje enviado correctamente");
    return res.data;
  } catch (error) {
    console.error("Error enviando mensaje:", error);
    showAlert("error", "Error al enviar mensaje");
    throw error;
  }
};

  // ✅ PUEDES ELIMINAR O ACTUALIZAR agregarObservacion (opcional)
  // Si prefieres mantener ambas funciones, puedes dejar esta:
  const agregarObservacion = async (id, texto) => {
    try {
      // Usar la misma ruta que enviarMensaje
      const res = await API.post(`/clients/${id}/mensaje`, { mensaje: texto });
      setClients((p) => p.map(c => c._id === id ? res.data : c));
      showAlert("success", "Observación guardada");
      return res.data;
    } catch (error) {
      console.error("Error agregando observación:", error);
      showAlert("error", "Error al guardar observación");
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        token,
        currentUser,
        clients,
        alert,
        showAlert,
        login,
        register,
        logout,
        fetchClients,
        createClient,
        updateClient,
        deleteClient,
        agregarVenta,
        agregarObservacion,
        enviarMensaje, // ✅ AGREGAR ESTA FUNCIÓN
      }}
    >
      {children}
    </AppContext.Provider>
  );
}