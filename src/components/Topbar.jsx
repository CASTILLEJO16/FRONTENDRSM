import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { currentUser } = useAuth();

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-slate-900/60 border-b border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="text-slate-400 text-sm">Bienvenido,</div>
        <div className="font-semibold text-slate-100 text-lg">{currentUser?.nombre}</div>
      </div>
    </header>
  );
}
