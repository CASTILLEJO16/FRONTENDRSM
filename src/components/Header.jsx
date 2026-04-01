import React from "react";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Header() {
  const { logout } = useAuth();

  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
      <h1 className="text-2xl font-bold">SalesRSM</h1>
      <button
        onClick={logout}
        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded"
      >
        <LogOut size={18} /> Cerrar sesión
      </button>
    </div>
  );
}
