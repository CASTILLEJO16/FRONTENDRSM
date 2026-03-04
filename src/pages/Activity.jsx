import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import RemindersSystem from "../components/RemindersSystem";
import NotificationsPanel from "../components/NotificationsPanel";

export default function Activity() {
  const { clients } = useContext(AppContext);
  return (
    <div className="animate-page-enter pb-20">
      {/* Header móvil */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <h1 className="text-2xl font-bold">Actividad y Recordatorios</h1>
        <p className="text-white/80 mt-2">Gestiona tus tareas y notificaciones</p>
      </div>
      
      <div className="space-y-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Recordatorios</h2>
            <RemindersSystem clients={clients} />
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Notificaciones</h2>
            <NotificationsPanel clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}
