import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Search } from "lucide-react";

export default function Topbar() {
  const { currentUser } = useContext(AppContext);

  return (
    <header className="flex items-center justify-between px-8 py-6 bg-slate-900/60 border-b border-slate-800 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="text-slate-400 text-sm">Bienvenido,</div>
        <div className="font-semibold text-slate-100 text-lg">{currentUser?.nombre}</div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar..." 
            className="pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-80" 
          />
        </div>
      </div>
    </header>
  );
}
