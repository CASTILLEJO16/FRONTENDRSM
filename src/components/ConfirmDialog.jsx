import React from "react";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full shadow-2xl">
        {/* Icono de advertencia */}
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-rose-500/10 rounded-full">
            <AlertTriangle className="text-rose-500" size={32} />
          </div>
        </div>

        {/* Título */}
        <h3 className="text-xl font-semibold text-slate-100 text-center mb-2">
          {title || "¿Estás seguro?"}
        </h3>

        {/* Mensaje */}
        <p className="text-slate-400 text-center mb-6">
          {message || "Esta acción no se puede deshacer."}
        </p>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}