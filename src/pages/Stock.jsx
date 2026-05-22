import React, { useEffect, useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { Package, Plus, Search, Edit, Trash2, DollarSign, Box } from "lucide-react";

export default function Stock() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, isLoading } = useProducts();
  const { currentUser } = useAuth();
  const { showSuccess, showError, showConfirm } = useNotifications();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    unidad: "unidad",
    categoria: "General",
    activo: true
  });

  const canManage = currentUser?.role === "admin" || currentUser?.role === "gerente";

  useEffect(() => {
    fetchProducts(undefined); // Cargar todos: activos e inactivos
  }, [fetchProducts]);

  const filtered = products.filter(p =>
    [p.nombre, p.descripcion, p.categoria].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      precio: Number(formData.precio),
      stock: Number(formData.stock),
      unidad: formData.unidad,
      categoria: formData.categoria,
      activo: formData.activo
    };

    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        showSuccess("Producto actualizado correctamente");
      } else {
        await createProduct(payload);
        showSuccess("Producto creado correctamente");
      }
      setOpen(false);
      resetForm();
      await fetchProducts(undefined); // Recargar todos
    } catch (error) {
      showError("Error al guardar producto");
    }
  };

  const handleEdit = (product) => {
    setEditing(product);
    setFormData({
      nombre: product.nombre,
      descripcion: product.descripcion || "",
      precio: product.precio,
      stock: product.stock,
      unidad: product.unidad || "unidad",
      categoria: product.categoria || "General",
      activo: product.activo !== false
    });
    setOpen(true);
  };

  const handleDelete = (product) => {
    showError(
      `No es posible borrar el producto "${product.nombre}". Para ocultarlo del sistema, edítalo y márcalo como Inactivo.`
    );
  };

  const resetForm = () => {
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      unidad: "unidad",
      categoria: "General",
      activo: true
    });
    setEditing(null);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Inventario</h1>
          <p className="text-sm text-slate-400 mt-1">Gestiona tus productos y stock</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Buscar productos..." 
              className="pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 w-64"
            />
          </div>
          {canManage && (
            <button 
              onClick={() => { setOpen(true); resetForm(); }} 
              className="bg-indigo-600 px-6 py-3 rounded-xl text-white font-medium hover:bg-indigo-700 transition-colors shadow-soft hover:shadow-soft-lg flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Productos</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{products.length}</p>
            </div>
            <Package className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Productos Activos</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{products.filter(p => p.activo !== false).length}</p>
            </div>
            <Box className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Stock Total</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">{products.reduce((sum, p) => sum + (p.stock || 0), 0)}</p>
            </div>
            <Box className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Valor Inventario</p>
              <p className="text-2xl font-bold text-slate-100 mt-1">${products.reduce((sum, p) => sum + ((p.precio || 0) * (p.stock || 0)), 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Unidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Estado</th>
                {canManage && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                    Cargando productos...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={canManage ? 7 : 6} className="px-6 py-12 text-center text-slate-400">
                    No hay productos registrados
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product._id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-slate-100">{product.nombre}</div>
                        {product.descripcion && (
                          <div className="text-sm text-slate-400 mt-1">{product.descripcion}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {product.categoria || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-100 font-medium">
                      ${product.precio?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-700 text-slate-300">
                        {product.unidad || 'unidad'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stock > 10 ? 'bg-green-900/50 text-green-300' :
                        product.stock > 0 ? 'bg-yellow-900/50 text-yellow-300' :
                        'bg-red-900/50 text-red-300'
                      }`}>
                        {product.stock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.activo !== false ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'
                      }`}>
                        {product.activo !== false ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    {canManage && (
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-2xl border border-slate-700 w-full max-w-lg shadow-2xl">
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold text-slate-100">
                {editing ? "Editar Producto" : "Nuevo Producto"}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Ej: Laptop HP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                  placeholder="Descripción del producto"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Precio *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.precio}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Unidad *</label>
                  <select
                    value={formData.unidad}
                    onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="unidad">Unidad</option>
                    <option value="kg">Kilogramo (kg)</option>
                    <option value="g">Gramo (g)</option>
                    <option value="lb">Libra (lb)</option>
                    <option value="caja">Caja</option>
                    <option value="litro">Litro</option>
                    <option value="ml">Mililitro (ml)</option>
                    <option value="metro">Metro (m)</option>
                    <option value="cm">Centímetro (cm)</option>
                    <option value="paca">Paca</option>
                    <option value="bulto">Bulto</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Categoría</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="General">General</option>
                  <option value="Electrónica">Electrónica</option>
                  <option value="Ropa">Ropa</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-800"
                />
                <label htmlFor="activo" className="text-sm text-slate-300">Producto activo</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-slate-700 text-slate-100 font-medium hover:bg-slate-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors"
                >
                  {editing ? "Actualizar" : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
