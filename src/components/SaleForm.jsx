// SaleForm.jsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useProducts } from "../context/ProductsContext";

export default function SaleForm({ open, cliente, onClose, onSave }) {
  const { getActiveProducts } = useProducts();
  const [form, setForm] = useState({
    producto: "",
    cantidad: 1,
    unidad: "unidad",
    precioUnitario: "",
    monto: "",
    fecha: new Date().toISOString().split('T')[0]
  });
  const activeProducts = getActiveProducts();

  // Resetear formulario cuando se abre el modal
  useEffect(() => {
    if (open) {
      setForm({
        producto: "",
        cantidad: 1,
        unidad: "unidad",
        precioUnitario: "",
        monto: "",
        fecha: new Date().toISOString().split('T')[0]
      });
    }
  }, [open]);

  if (!open || !cliente) return null;

  const handleProductChange = (e) => {
    const selectedProductId = e.target.value;
    const selectedProduct = activeProducts.find(p => p._id === selectedProductId);
    
    if (selectedProduct) {
      setForm({
        ...form,
        producto: selectedProduct.nombre,
        unidad: selectedProduct.unidad || 'unidad',
        precioUnitario: selectedProduct.precio.toString()
      });
    } else {
      setForm({
        ...form,
        producto: "",
        unidad: "unidad",
        precioUnitario: ""
      });
    }
  };

  const handleCantidadChange = (e) => {
    setForm({
      ...form,
      cantidad: Number(e.target.value) || 1
    });
  };

  const handleMontoChange = (e) => {
    setForm({
      ...form,
      monto: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!form.producto.trim() || !form.cantidad || Number(form.cantidad) <= 0 || !form.monto || Number(form.monto) <= 0) {
      alert("Por favor completa todos los campos correctamente");
      return;
    }

    onSave(form);
    setForm({ 
      producto: "", 
      cantidad: 1, 
      unidad: "unidad", 
      precioUnitario: "", 
      monto: "", 
      fecha: new Date().toISOString().split('T')[0] 
    });
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
            <label className="block text-sm text-slate-300 mb-1">Producto</label>
            <select
              value={activeProducts.find(p => p.nombre === form.producto)?._id || ""}
              onChange={handleProductChange}
              className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoFocus
            >
              <option value="">Seleccionar producto...</option>
              {activeProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.nombre} - ${product.precio?.toLocaleString()}/{product.unidad || 'unidad'} (Stock: {product.stock})
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Selecciona un producto para auto-rellenar los datos</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Cantidad</label>
              <input
                type="number"
                value={form.cantidad}
                onChange={handleCantidadChange}
                placeholder="Ej: 1"
                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="1"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Unidad</label>
              <select
                value={form.unidad}
                onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="unidad">Unidad</option>
                <option value="kg">Kilogramo (kg)</option>
                <option value="g">Gramo (g)</option>
                <option value="lb">Libra (lb)</option>
                <option value="caja">Caja</option>
                <option value="tarima">Tarima</option>
                <option value="paca">Paca</option>
                <option value="bulto">Bulto</option>
                <option value="litro">Litro</option>
                <option value="ml">Mililitro (ml)</option>
                <option value="metro">Metro (m)</option>
                <option value="cm">Centímetro (cm)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-300 mb-1">Monto Total</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">$</span>
              <input
                type="number"
                value={form.monto}
                onChange={handleMontoChange}
                placeholder="Ej: 15000"
                className="w-full pl-8 pr-4 py-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Ingresa el monto total de la venta</p>
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