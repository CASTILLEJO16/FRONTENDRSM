import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function LoginPage() {
  const { login, register, showAlert } = useContext(AppContext);
  const [mode, setMode] = useState("login");
  const [loginData, setLoginData] = useState({ username: "", password: "" });
  const [regData, setRegData] = useState({ username: "", password: "", nombre: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(loginData.username, loginData.password);
    } catch (err) {
      showAlert("error", err.response?.data?.msg || "Error login");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(regData.username, regData.password, regData.nombre);
      setMode("login");
    } catch (err) {
      showAlert("error", err.response?.data?.msg || "Error registro");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700 p-6">
        <h2 className="text-xl text-slate-100 font-semibold mb-4">SalesRSM</h2>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <input placeholder="Usuario" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} className="w-full p-2 rounded bg-slate-700 text-slate-100" />
            <input placeholder="Contraseña" type="password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="w-full p-2 rounded bg-slate-700 text-slate-100" />
            <button className="w-full bg-indigo-600 py-2 rounded text-white">Iniciar sesión</button>
            <button type="button" onClick={() => setMode("register")} className="w-full border border-slate-600 py-2 rounded text-slate-200">Crear cuenta</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <input placeholder="Nombre completo" value={regData.nombre} onChange={(e) => setRegData({ ...regData, nombre: e.target.value })} className="w-full p-2 rounded bg-slate-700 text-slate-100" />
            <input placeholder="Usuario" value={regData.username} onChange={(e) => setRegData({ ...regData, username: e.target.value })} className="w-full p-2 rounded bg-slate-700 text-slate-100" />
            <input placeholder="Contraseña" type="password" value={regData.password} onChange={(e) => setRegData({ ...regData, password: e.target.value })} className="w-full p-2 rounded bg-slate-700 text-slate-100" />
            <div className="flex gap-2">
              <button className="flex-1 bg-emerald-600 py-2 rounded text-white">Registrar</button>
              <button type="button" onClick={() => setMode("login")} className="flex-1 border border-slate-600 py-2 rounded text-slate-200">Volver</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
