import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { Menu, X, Home, Users, BarChart2, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);
  const { logout } = useContext(AppContext);

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={16} /> },
    { to: "/clients", label: "Clientes", icon: <Users size={16} /> },
    { to: "/analytics", label: "Ventas", icon: <BarChart2 size={16} /> },
    { to: "/settings", label: "Configuración", icon: <Settings size={16} /> },
    { to: "/Historial", label: "Historial", icon: <Settings size={16} /> },
  ];

  return (
    <>
      {/* Botón hamburguesa (mobile) */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 rounded text-white"
        onClick={() => setOpen(!open)}
      >
        {open ? <X /> : <Menu />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 z-40
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="p-6 flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              SR
            </div>
            <div>
              <div className="text-white font-semibold">SalesRSM</div>
              <div className="text-xs text-slate-400">Panel</div>
            </div>
          </div>

          {/* Navegación */}
          <nav className="flex flex-col gap-2 flex-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "text-slate-300 hover:bg-slate-800"
                  }`
                }
              >
                {l.icon}
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Botón Cerrar Sesión */}
          <button
            onClick={() => {
              logout();
              setOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition mt-4"
          >
            <LogOut size={16} />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
}
