import React, { useContext } from "react";
import { Home, Users, BarChart2, Settings, History, FileText, Bell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function MobileNavbar() {
  const { pathname } = useLocation();
  const { currentUser } = useContext(AppContext);
  const role = currentUser?.role || "vendedor";

  const isActive = (path) =>
    pathname === path ? "text-indigo-400" : "text-slate-400";

  return (
    <div
      className="
        fixed bottom-3 left-1/2 transform -translate-x-1/2 w-[95%] max-w-sm
        bg-slate-900/95 backdrop-blur-xl border border-slate-700/50 
        py-3 flex justify-around md:hidden z-50
        rounded-2xl shadow-soft-lg
      "
    >
      <Link to="/dashboard" className={`flex flex-col items-center ${isActive("/dashboard")} transition-colors`} title="Inicio">
        <Home size={20} />
      </Link>

      <Link to="/clients" className={`flex flex-col items-center ${isActive("/clients")} transition-colors`} title="Clientes">
        <Users size={20} />
      </Link>

      {(role === "admin" || role === "gerente" || role === "vendedor") && (
        <Link to="/analytics" className={`flex flex-col items-center ${isActive("/analytics")} transition-colors`} title="Análisis">
          <BarChart2 size={20} />
        </Link>
      )}

      {(role === "admin" || role === "gerente" || role === "vendedor") && (
        <Link to="/reports" className={`flex flex-col items-center ${isActive("/reports")} transition-colors`} title="Reportes">
          <FileText size={20} />
        </Link>
      )}

      <Link to="/activity" className={`flex flex-col items-center ${isActive("/activity")} transition-colors`} title="Recordatorios">
        <Bell size={20} />
      </Link>

      <Link to="/historial" className={`flex flex-col items-center ${isActive("/historial")} transition-colors`} title="Historial">
        <History size={20} />
      </Link>

      {role === "admin" && (
        <Link to="/settings" className={`flex flex-col items-center ${isActive("/settings")} transition-colors`} title="Ajustes">
          <Settings size={20} />
        </Link>
      )}
    </div>
  );
}
