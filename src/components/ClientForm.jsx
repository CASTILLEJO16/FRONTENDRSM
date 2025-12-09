import React, { useEffect, useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";

export default function ClientForm({
  open,
  onClose,
  onSave,
  editing = null,
}) {

  // 🔥 FUNCIÓN PARA FECHA LOCAL CORRECTA (sin problema de UTC)
  function getLocalDate() {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  }

  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    email: "",
    empresa: "",
    compro: null,
    razonNoCompra: "",
    observaciones: "",
    fecha: getLocalDate(),
    producto: "",
    monto: "",
    contactosAdicionales: [],
  });

  const [nuevoContacto, setNuevoContacto] = useState({
    nombre: "",
    telefono: ""
  });

  useEffect(() => {
    if (editing) {
      setForm({
        ...editing,
        monto: "",
        producto: "",
        contactosAdicionales: editing.contactosAdicionales || [],
        fecha: editing.fecha ? editing.fecha : getLocalDate()
      });
    } else {
      setForm({
        nombre: "",
        telefono: "",
        email: "",
        empresa: "",
        compro: null,
        razonNoCompra: "",
        observaciones: "",
        fecha: getLocalDate(),
        producto: "",
        monto: "",
        contactosAdicionales: [],
      });
    }
    setNuevoContacto({ nombre: "", telefono: "" });
  }, [editing, open]);

  const agregarContacto = () => {
    if (!nuevoContacto.nombre || !nuevoContacto.telefono) {
      alert("Por favor completa nombre y teléfono del contacto");
      return;
    }

    setForm({
      ...form,
      contactosAdicionales: [...form.contactosAdicionales, nuevoContacto]
    });

    setNuevoContacto({ nombre: "", telefono: "" });
  };

  const eliminarContacto = (index) => {
    setForm({
      ...form,
      contactosAdicionales: form.contactosAdicionales.filter((_, i) => i !== index)
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-100">
            {editing ? "Editar Cliente" : "Nuevo Cliente"}
          </h3>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3">
          {/* Nombre y Teléfono Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Nombre *" 
              value={form.nombre} 
              onChange={(e) => setForm({ ...form, nombre: e.target.value })} 
            />
            <input 
              className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Teléfono *" 
              value={form.telefono} 
              onChange={(e) => setForm({ ...form, telefono: e.target.value })} 
            />
          </div>

          {/* Contactos Adicionales */}
          <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-slate-300">
                Contactos Adicionales
              </h4>
            </div>

            {form.contactosAdicionales.length > 0 && (
              <div className="space-y-2 mb-3">
                {form.contactosAdicionales.map((contacto, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 p-2 bg-slate-900 rounded border border-slate-700"
                  >
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 font-medium">{contacto.nombre}</p>
                      <p className="text-xs text-slate-400">{contacto.telefono}</p>
                    </div>
                    <button
                      onClick={() => eliminarContacto(index)}
                      className="text-rose-400 hover:text-rose-200 transition-colors p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input 
                  className="p-2 text-sm rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Nombre del contacto" 
                  value={nuevoContacto.nombre} 
                  onChange={(e) => setNuevoContacto({ ...nuevoContacto, nombre: e.target.value })} 
                />
                <input 
                  className="p-2 text-sm rounded bg-slate-900 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                  placeholder="Teléfono" 
                  value={nuevoContacto.telefono} 
                  onChange={(e) => setNuevoContacto({ ...nuevoContacto, telefono: e.target.value })} 
                />
              </div>
              <button
                onClick={agregarContacto}
                className="w-full flex items-center justify-center gap-2 p-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-600/50 rounded text-indigo-300 text-sm transition-colors"
              >
                <Plus size={16} />
                Agregar contacto
              </button>
            </div>
          </div>

          {/* Venta inicial solo si NO estamos editando */}
          {!editing && (
            <>
              <input 
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Producto vendido" 
                value={form.producto} 
                onChange={(e) => setForm({ ...form, producto: e.target.value })} 
              />
              <input 
                type="number" 
                className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                placeholder="Monto de la venta inicial" 
                value={form.monto} 
                onChange={(e) => setForm({ ...form, monto: e.target.value })} 
              />
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input 
              className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Email" 
              value={form.email} 
              onChange={(e) => setForm({ ...form, email: e.target.value })} 
            />
            <input 
              className="p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="Empresa" 
              value={form.empresa} 
              onChange={(e) => setForm({ ...form, empresa: e.target.value })} 
            />
          </div>

          <div>
            <p className="text-sm text-slate-300 mb-1">¿Realizó la compra?</p>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-slate-200">
                <input 
                  type="radio" 
                  checked={form.compro === true} 
                  onChange={() => setForm({ ...form, compro: true, razonNoCompra: "" })} 
                  className="text-indigo-600"
                /> 
                <span>Sí</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200">
                <input 
                  type="radio" 
                  checked={form.compro === false} 
                  onChange={() => setForm({ ...form, compro: false })} 
                  className="text-indigo-600"
                /> 
                <span>No</span>
              </label>
              <label className="flex items-center gap-2 text-slate-200">
                <input 
                  type="radio" 
                  checked={form.compro === null} 
                  onChange={() => setForm({ ...form, compro: null, razonNoCompra: "" })} 
                  className="text-indigo-600"
                /> 
                <span>Pendiente</span>
              </label>
            </div>
          </div>

          {form.compro === false && (
            <textarea 
              className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              placeholder="¿Por qué no compró?" 
              value={form.razonNoCompra} 
              onChange={(e) => setForm({ ...form, razonNoCompra: e.target.value })} 
              rows="2"
            />
          )}

          <textarea 
            className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="Observaciones" 
            value={form.observaciones} 
            onChange={(e) => setForm({ ...form, observaciones: e.target.value })} 
            rows="3"
          />

          <div className="flex gap-3 pt-3">
            <button 
              onClick={() => onSave(form)} 
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 py-2 rounded transition-colors text-white font-medium"
            >
              {editing ? "Guardar Cambios" : "Crear Cliente"}
            </button>
            <button 
              onClick={onClose} 
              className="px-6 py-2 border border-slate-700 rounded hover:bg-slate-800 transition-colors text-slate-300"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
