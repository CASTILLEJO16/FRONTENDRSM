import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export default function Toast() {
  const { alert, setAlert } = useContext(AppContext);

  if (!alert) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    info: <AlertCircle className="w-5 h-5" />
  };

  const colors = {
    success: "bg-emerald-500 border-emerald-600",
    error: "bg-red-500 border-red-600",
    info: "bg-blue-500 border-blue-600"
  };

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-slide-in">
      <div
        className={`
          ${colors[alert.type]} 
          text-white px-6 py-4 rounded-2xl shadow-soft-lg border-l-4
          flex items-center gap-4 min-w-[350px] max-w-lg
          backdrop-blur-sm
        `}
      >
        {icons[alert.type]}
        <span className="flex-1 font-medium">{alert.msg}</span>
        <button
          onClick={() => setAlert(null)}
          className="hover:bg-white/20 p-2 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}