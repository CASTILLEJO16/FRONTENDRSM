import React from "react";
import { useNotifications } from "../context/NotificationsContext";

export default function Alert() {
  const { alerts } = useNotifications();
  const alert = alerts[0]; // Mostrar primera alerta
  if (!alert) return null;
  const cls = alert.type === "success" ? "bg-emerald-800" : "bg-rose-800";
  return (
    <div className={`${cls} text-white px-4 py-2 rounded-md mb-4 max-w-2xl`}>
      {alert.message}
    </div>
  );
}
