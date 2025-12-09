import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Alert() {
  const { alert } = useContext(AppContext);
  if (!alert) return null;
  const cls = alert.type === "success" ? "bg-emerald-800" : "bg-rose-800";
  return (
    <div className={`${cls} text-white px-4 py-2 rounded-md mb-4 max-w-2xl`}>
      {alert.msg}
    </div>
  );
}
