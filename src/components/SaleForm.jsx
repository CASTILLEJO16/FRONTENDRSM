// SaleForm.jsx
import React, { useState } from "react";
import { X } from "lucide-react";

export default function SaleForm({ open, cliente, onClose, onSave }) {
  const [form, setForm] = useState({
    producto: "",
    monto: "",
    fecha: new Date().toISOString().split('T')[0]
  });

  if (!open || !cliente) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.producto.trim() || !form.monto || Number(form.monto) <= 0) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    onSave(form);
    setForm({ producto: "", monto: "", fecha: new Date().toISOString().split('T')[0] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            Registrar Venta para {cliente.nombre}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">Producto/Servicio</label>
            <input
              type="text"
              value={form.producto}
              onChange={(e) => setForm({ ...form, producto: e.target.value })}
              placeholder="Ej: Laptop Dell XPS 15"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Monto</label>
            <input
              type="number"
              value={form.monto}
              onChange={(e) => setForm({ ...form, monto: e.target.value })}
              placeholder="Ej: 25000"
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => setForm({ ...form, fecha: e.target.value })}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-2 rounded transition-colors text-white font-medium"
            >
              Guardar Venta
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