import React, { useEffect, useState } from "react";
import { useNotifications } from "../context/NotificationsContext";
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

function ToastItem({ toast, onRemove }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Trigger entrada
    requestAnimationFrame(() => setIsVisible(true));

    // Barra de progreso y auto-remove
    if (!toast.persistent && toast.duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / toast.duration) * 100);
        setProgress(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          handleExit();
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [toast.duration, toast.persistent]);

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      bg: "bg-emerald-950/80",
      border: "border-emerald-500/30",
      iconColor: "text-emerald-400",
      progressColor: "bg-emerald-400",
      glow: "shadow-emerald-500/10"
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      bg: "bg-rose-950/80",
      border: "border-rose-500/30",
      iconColor: "text-rose-400",
      progressColor: "bg-rose-400",
      glow: "shadow-rose-500/10"
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      bg: "bg-amber-950/80",
      border: "border-amber-500/30",
      iconColor: "text-amber-400",
      progressColor: "bg-amber-400",
      glow: "shadow-amber-500/10"
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      bg: "bg-blue-950/80",
      border: "border-blue-500/30",
      iconColor: "text-blue-400",
      progressColor: "bg-blue-400",
      glow: "shadow-blue-500/10"
    }
  };

  const c = config[toast.type] || config.info;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl border backdrop-blur-xl
        ${c.bg} ${c.border} shadow-lg ${c.glow}
        transition-all duration-300 ease-out
        ${isVisible && !isExiting
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-full opacity-0 scale-95"
        }
        max-w-sm w-full
      `}
      role="alert"
    >
      <div className="flex items-start gap-3 p-4">
        {/* Icono */}
        <div className={`flex-shrink-0 mt-0.5 ${c.iconColor}`}>
          {c.icon}
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-100 leading-relaxed">
            {toast.message}
          </p>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={() => handleExit()}
          className="flex-shrink-0 text-slate-400 hover:text-slate-200 transition-colors rounded-lg p-1 hover:bg-white/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Barra de progreso */}
      {!toast.persistent && toast.duration > 0 && (
        <div className="h-0.5 w-full bg-white/5">
          <div
            className={`h-full ${c.progressColor} transition-none opacity-60`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}

export default function Toast() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2 max-sm:bottom-auto max-sm:top-4 max-sm:right-4 max-sm:left-4">
      {toasts.slice(-5).map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
}