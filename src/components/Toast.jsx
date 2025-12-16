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
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div
        className={`
          ${colors[alert.type]} 
          text-white px-4 py-3 rounded-lg shadow-2xl border-l-4
          flex items-center gap-3 min-w-[300px] max-w-md
          backdrop-blur-sm
        `}
      >
        {icons[alert.type]}
        <span className="flex-1 font-medium">{alert.msg}</span>
        <button
          onClick={() => setAlert(null)}
          className="hover:bg-white/20 p-1 rounded transition"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}