import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Search } from "lucide-react";

export default function Topbar() {
  const { currentUser } = useContext(AppContext);

  return (
    <header className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
      <div className="flex items-center gap-3">
        <div className="text-slate-300">Bienvenido,</div>
        <div className="font-semibold text-slate-100">{currentUser?.nombre}</div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-slate-400" />
          <input placeholder="Buscar..." className="pl-10 pr-4 py-2 rounded bg-slate-800 border border-slate-700 text-slate-200" />
        </div>
      </div>
    </header>
  );
}
