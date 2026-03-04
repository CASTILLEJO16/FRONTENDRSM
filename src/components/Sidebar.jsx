import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Menu, X, Home, Users, BarChart2, Settings, LogOut, History, FileText, Bell } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AppContext);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/clients", label: "Clientes", icon: <Users size={20} /> },
    { to: "/analytics", label: "Análisis", icon: <BarChart2 size={20} /> },
    { to: "/reports", label: "Reportes", icon: <FileText size={20} /> },
    { to: "/activity", label: "Actividad", icon: <Bell size={20} /> },
    { to: "/historial", label: "Historial", icon: <History size={20} /> },
    { to: "/settings", label: "Configuración", icon: <Settings size={20} /> },
  ];

  return (
    <>
      {/* === BOTÓN HAMBURGUESA — SOLO PC === */}
      <button
        className="hidden md:block fixed top-6 left-6 z-50 p-3 bg-slate-800 rounded-xl shadow-soft border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-200 transition-all duration-200"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* === SIDEBAR CON HOVER === */}
      <aside
        className={`
          hidden md:block 
          fixed top-0 left-0 h-full bg-slate-900 border-r border-slate-800 
          transform transition-all duration-300 ease-out z-40
          ${open ? "translate-x-0 w-64" : "-translate-x-48 w-16 hover:translate-x-0 hover:w-64"}
        `}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="p-4 flex flex-col h-full">

          {/* LOGO - CAMBIA SEGÚN ESTADO */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-soft">
              SR
            </div>
            {open && (
              <div>
                <div className="text-slate-100 font-bold text-lg">SalesRSM</div>
                <div className="text-xs text-slate-400 font-medium">Panel de Control</div>
              </div>
            )}
          </div>

          {/* LINKS - CAMBIA SEGÚN ESTADO */}
          <nav className="flex flex-col gap-2 flex-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `flex items-center transition-all duration-200 ${
                    open
                      ? "gap-3 px-4 py-3 rounded-lg"
                      : "justify-center p-3 rounded-lg"
                  } ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 font-medium border border-indigo-500/30"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                  }`
                }
              >
                {l.icon}
                {open && <span className="text-sm">{l.label}</span>}
              </NavLink>
            ))}
          </nav>

          {/* CERRAR SESIÓN - CAMBIA SEGÚN ESTADO */}
          <button
            onClick={logout}
            className={`hidden md:flex items-center transition-all duration-200 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 ${
              open ? "gap-3 px-4 py-3" : "justify-center p-3"
            }`}
            title="Cerrar sesión"
          >
            <LogOut size={20} />
            {open && <span className="text-sm">Cerrar sesión</span>}
          </button>
        </div>
      </aside>
    </>
  );
}