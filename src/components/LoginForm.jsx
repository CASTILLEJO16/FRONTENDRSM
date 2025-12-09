import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

export default function LoginPage() {
  const { login } = useContext(AppContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    await login(username, password);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-slate-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow rounded-xl w-80"
      >
        <h2 className="text-xl font-bold mb-4">Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          className="border p-2 w-full mb-4 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="border p-2 w-full mb-4 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 w-full p-2 text-white rounded">
          Entrar
        </button>
      </form>
    </div>
  );
}
