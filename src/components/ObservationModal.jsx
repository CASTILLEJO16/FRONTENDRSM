import React, { useState } from "react";
import { X } from "lucide-react";

export default function ObservationModal({ cliente, onClose, onSave }) {
  const [mensaje, setMensaje] = useState("");

  if (!cliente) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mensaje.trim()) {
      onSave(mensaje);
      setMensaje("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Enviar Observación a {cliente.nombre}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe tu observación aquí..."
            className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px]"
            autoFocus
          />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={!mensaje.trim()}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-700 disabled:cursor-not-allowed py-2 rounded transition-colors text-white font-medium"
            >
              Guardar Observación
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-300"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}