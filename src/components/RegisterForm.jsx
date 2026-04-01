import React, { useState } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { UserPlus } from "lucide-react";

export default function RegisterForm({ goLogin }) {
  const { showSuccessAlert, showErrorAlert } = useNotifications();
  const [form, setForm] = useState({ username: "", password: "" });

  const register = () => {
    if (!form.username || !form.password)
      return showErrorAlert("Completa todos los campos");

    // TODO: Implementar registro con AuthContext
    showSuccessAlert("Usuario registrado");
    goLogin();
  };

  return (
    <>
      <input
        type="text"
        placeholder="Nuevo usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg mb-3"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg mb-3"
      />

      <button
        onClick={register}
        className="w-full bg-green-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
      >
        <UserPlus size={20} /> Registrar
      </button>

      <button
        onClick={goLogin}
        className="w-full border mt-3 py-2 rounded-lg"
      >
        Ya tengo cuenta
      </button>
    </>
  );
}
