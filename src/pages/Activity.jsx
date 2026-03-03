import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import RemindersSystem from "../components/RemindersSystem";
import NotificationsPanel from "../components/NotificationsPanel";

export default function Activity() {
  const { clients } = useContext(AppContext);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Actividad y Recordatorios</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RemindersSystem clients={clients} />
        <NotificationsPanel clients={clients} />
      </div>
    </div>
  );
}
