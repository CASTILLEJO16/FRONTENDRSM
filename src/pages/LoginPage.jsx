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
      // El showAlert de éxito ya está en AppContext
    } catch (err) {
      showAlert("error", err.response?.data?.msg || "❌ Error al iniciar sesión");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!regData.nombre.trim()) {
      showAlert("error", "⚠️ El nombre es obligatorio");
      return;
    }
    if (!regData.username.trim()) {
      showAlert("error", "⚠️ El usuario es obligatorio");
      return;
    }
    if (regData.password.length < 6) {
      showAlert("error", "⚠️ La contraseña debe tener mínimo 6 caracteres");
      return;
    }

    try {
      await register(regData.username, regData.password, regData.nombre);
      showAlert("success", "✅ Cuenta creada exitosamente. Ahora inicia sesión");
      setMode("login");
      setRegData({ username: "", password: "", nombre: "" });
    } catch (err) {
      showAlert("error", err.response?.data?.msg || "❌ Error al crear cuenta");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700 p-6 shadow-2xl">
        
        {/* Logo/Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-white">SR</span>
          </div>
          <h2 className="text-2xl text-slate-100 font-bold">SalesRSM</h2>
          <p className="text-slate-400 text-sm mt-1">
            {mode === "login" ? "Inicia sesión para continuar" : "Crea tu cuenta"}
          </p>
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Usuario</label>
              <input 
                placeholder="Ingresa tu usuario" 
                value={loginData.username} 
                onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} 
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 
                         focus:border-indigo-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block">Contraseña</label>
              <input 
                placeholder="Ingresa tu contraseña" 
                type="password" 
                value={loginData.password} 
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} 
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 
                         focus:border-indigo-500 focus:outline-none transition"
                required
              />
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white 
                             font-semibold transition shadow-lg hover:shadow-indigo-500/50">
              Iniciar sesión
            </button>

            <button 
              type="button" 
              onClick={() => setMode("register")} 
              className="w-full border border-slate-600 hover:border-slate-500 py-3 rounded-lg 
                       text-slate-200 transition"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm mb-2 block">Nombre completo</label>
              <input 
                placeholder="Ej: Juan Pérez" 
                value={regData.nombre} 
                onChange={(e) => setRegData({ ...regData, nombre: e.target.value })} 
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 
                         focus:border-emerald-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block">Usuario</label>
              <input 
                placeholder="Ej: juanperez" 
                value={regData.username} 
                onChange={(e) => setRegData({ ...regData, username: e.target.value })} 
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 
                         focus:border-emerald-500 focus:outline-none transition"
                required
              />
            </div>

            <div>
              <label className="text-slate-300 text-sm mb-2 block">Contraseña</label>
              <input 
                placeholder="Mínimo 6 caracteres" 
                type="password" 
                value={regData.password} 
                onChange={(e) => setRegData({ ...regData, password: e.target.value })} 
                className="w-full p-3 rounded-lg bg-slate-700 text-slate-100 border border-slate-600 
                         focus:border-emerald-500 focus:outline-none transition"
                required
                minLength="6"
              />
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-lg text-white 
                               font-semibold transition shadow-lg hover:shadow-emerald-500/50">
                Registrarme
              </button>
              <button 
                type="button" 
                onClick={() => setMode("login")} 
                className="flex-1 border border-slate-600 hover:border-slate-500 py-3 rounded-lg 
                         text-slate-200 transition"
              >
                Volver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}