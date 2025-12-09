import React from "react";

import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { UserPlus } from "lucide-react";

export default function RegisterForm({ goLogin }) {
  const { users, saveUsers, showAlert } = useContext(AppContext);
  const [form, setForm] = useState({ username: "", password: "" });

  const register = () => {
    if (!form.username || !form.password)
      return showAlert("error", "Completa todos los campos");

    if (users.find((u) => u.username === form.username)) {
      return showAlert("error", "El usuario ya existe");
    }

    const newUser = [...users, form];
    saveUsers(newUser);

    showAlert("success", "Usuario registrado");
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
