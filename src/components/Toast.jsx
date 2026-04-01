import React from "react";
import { useNotifications } from "../context/NotificationsContext";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

export default function Toast() {
  const { toasts, removeToast } = useNotifications();

  if (toasts.length === 0) return null;

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-400" />,
    error: <XCircle className="w-5 h-5 text-rose-400" />,
    info: <AlertCircle className="w-5 h-5 text-blue-400" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-400" />
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 p-4 rounded-lg shadow-lg backdrop-blur-sm border max-w-sm transition-all duration-300 transform
            ${toast.type === 'success' ? 'bg-emerald-900/90 border-emerald-700 text-emerald-100' : ''}
            ${toast.type === 'error' ? 'bg-rose-900/90 border-rose-700 text-rose-100' : ''}
            ${toast.type === 'info' ? 'bg-blue-900/90 border-blue-700 text-blue-100' : ''}
            ${toast.type === 'warning' ? 'bg-yellow-900/90 border-yellow-700 text-yellow-100' : ''}
          `}
        >
          {icons[toast.type] || icons.info}
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-current/60 hover:text-current transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}