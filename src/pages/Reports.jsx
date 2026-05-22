import React, { useEffect, useMemo, useState } from "react";
import { useClients } from "../context/ClientsContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { useProducts } from "../context/ProductsContext";
import PieDistributionChart from "../components/PieDistributionChart";
import TrendChart from "../components/TrendChart";
import { FileText, Filter, X } from "lucide-react";
import { generateSalesReport } from "../utils/reportGenerator";

export default function Reports() {
  const { clients } = useClients();
  const { currentUser, listSalesUsers } = useAuth();
  const { showErrorAlert } = useNotifications();
  const { products, fetchProducts } = useProducts();
  const role = currentUser?.role || "vendedor";
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    periodo: "",
    producto: "",
    cliente: [],
    vendedor: ""
  });

  // Limpiar clientes seleccionados si cambia el vendedor
  useEffect(() => {
    setFilters(prev => ({ ...prev, cliente: [] }));
  }, [filters.vendedor, selectedUserId]);

  // Usar los productos desde el contexto del inventario (activos e inactivos)
  const uniqueProducts = useMemo(() => {
    const pNames = new Set((products || []).map(p => p.nombre));
    return Array.from(pNames).sort();
  }, [products]);

  // Obtener lista única de vendedores de todos los clientes
  const uniqueVendors = useMemo(() => {
    const vendors = new Set();
    (clients || []).forEach(client => {
      if (client.vendedor?.nombre) vendors.add(client.vendedor.nombre);
      if (client.vendedor?.username) vendors.add(client.vendedor.username);
    });
    return Array.from(vendors).sort();
  }, [clients]);

  useEffect(() => {
    // Cargar todos los productos (activos e inactivos)
    fetchProducts(undefined);
  }, [fetchProducts]);

  useEffect(() => {
    const load = async () => {
      if (!(role === "admin" || role === "gerente")) return;
      try {
        console.log('[Reports] Cargando vendedores...');
        const result = await listSalesUsers();
        console.log('[Reports] Resultado:', result);
        if (result.success) {
          console.log('[Reports] Vendedores cargados:', result.users?.length || 0);
          setSalesUsers(result.users || []);
        } else {
          console.error('[Reports] Error cargando vendedores:', result.error);
          showErrorAlert("Error al cargar vendedores");
        }
      } catch (error) {
        console.error("[Reports] Error loading sales users:", error);
        showErrorAlert("Error al cargar usuarios de ventas");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, showErrorAlert, listSalesUsers]);

  const viewClients = useMemo(() => {
    let filtered = clients;

    // Filtrar por vendedor (selector de admin/gerente) - PRIMERO
    if (role === "admin" || role === "gerente") {
      if (selectedUserId) {
        filtered = filtered.filter((c) => String(c?.vendedor?.id || "") === String(selectedUserId));
      }
    }

    // Filtrar por vendedor (filtro avanzado) - PRIMERO
    if (filters.vendedor) {
      filtered = filtered.filter(c => {
        const vendedorNombre = c.vendedor?.nombre || c.vendedor?.username || '';
        return vendedorNombre === filters.vendedor;
      });
    }

    // Filtrar por cliente (selección múltiple) - SEGUNDO
    if (filters.cliente && filters.cliente.length > 0) {
      filtered = filtered.filter(c => filters.cliente.includes(c.nombre));
    }

    // Filtrar por periodo - TERCERO (filtra ventas dentro de clientes)
    if (filters.periodo) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let startDate = new Date(today);

      if (filters.periodo === "dia") {
        // startDate is already today at 00:00:00
      } else if (filters.periodo === "semana") {
        startDate.setDate(startDate.getDate() - 7);
      } else if (filters.periodo === "mes") {
        startDate.setMonth(startDate.getMonth() - 1);
      } else if (filters.periodo === "año") {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }

      filtered = filtered.map(c => ({
        ...c,
        ventas: (c.ventas || []).filter(v => new Date(v.fecha) >= startDate)
      })).filter(c => c.ventas.length > 0);
    }

    // Filtrar por producto - CUARTO (filtra ventas dentro de clientes)
    if (filters.producto) {
      filtered = filtered.map(c => ({
        ...c,
        ventas: (c.ventas || []).filter(v => v.producto === filters.producto)
      })).filter(c => c.ventas.length > 0);
    }

    return filtered;
  }, [clients, role, selectedUserId, filters]);

  const availableClientsForFilter = useMemo(() => {
    let list = clients || [];
    
    // Filtrar por vendedor (selector de admin/gerente)
    if (role === "admin" || role === "gerente") {
      if (selectedUserId) {
        list = list.filter((c) => String(c?.vendedor?.id || "") === String(selectedUserId));
      }
    }
    
    // Filtrar por vendedor (filtro avanzado)
    if (filters.vendedor) {
      list = list.filter(c => {
        const vendedorNombre = c.vendedor?.nombre || c.vendedor?.username || '';
        return vendedorNombre === filters.vendedor;
      });
    }
    
    return list;
  }, [clients, selectedUserId, filters.vendedor, role]);

  const selectedLabel = useMemo(() => {
    if (!selectedUserId) return "Todos";
    const u = (salesUsers || []).find((x) => String(x?._id) === String(selectedUserId));
    return u?.nombre || u?.username || "Vendedor";
  }, [salesUsers, selectedUserId]);

  const clearFilters = () => {
    setFilters({
      periodo: "",
      producto: "",
      cliente: [],
      vendedor: ""
    });
  };

  const hasActiveFilters = Object.values(filters).some(v => {
    if (Array.isArray(v)) return v.length > 0;
    return v !== "";
  });

  return (
    <div className="animate-page-enter pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reportes Detallados</h1>
          <p className="text-white/80 mt-2">
            Análisis completo de métricas{role === "admin" || role === "gerente" ? ` • ${selectedLabel}` : ""}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-3 rounded-xl font-semibold transition-all border border-white/30"
          >
            <Filter size={20} />
            Filtros
            {hasActiveFilters && <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">•</span>}
          </button>
          <button
            onClick={() => generateSalesReport(viewClients, `Reporte de Ventas - ${selectedLabel}`, filters)}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-3 rounded-xl font-semibold transition-all border border-white/30"
          >
            <FileText size={20} />
            Exportar PDF
          </button>
        </div>
      </div>

      <div className="space-y-6 px-4">
        {/* Panel de filtros avanzados */}
        {showFilters && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-slate-100">Filtros Avanzados</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Filtro de periodo */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">Período</label>
                <select
                  value={filters.periodo}
                  onChange={(e) => setFilters({ ...filters, periodo: e.target.value })}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todo el tiempo</option>
                  <option value="dia">Hoy</option>
                  <option value="semana">Últimos 7 días</option>
                  <option value="mes">Último mes</option>
                  <option value="año">Último año</option>
                </select>
              </div>

              {/* Filtro de producto */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">Producto</label>
                <select
                  value={filters.producto}
                  onChange={(e) => setFilters({ ...filters, producto: e.target.value })}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos los productos</option>
                  {uniqueProducts.map((producto) => (
                    <option key={producto} value={producto}>
                      {producto}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtro de cliente (Selección Múltiple) */}
              <div className="flex flex-col">
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm text-slate-300">Clientes</label>
                  {filters.cliente.length > 0 && (
                    <span className="text-xs text-indigo-400 font-medium">
                      {filters.cliente.length} seleccionados
                    </span>
                  )}
                </div>
                <div className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-slate-200 max-h-40 overflow-y-auto space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-700 rounded transition-colors">
                    <input 
                      type="checkbox" 
                      checked={filters.cliente.length === 0} 
                      onChange={() => setFilters({ ...filters, cliente: [] })} 
                      className="rounded bg-slate-900 border-slate-600 text-indigo-500 focus:ring-indigo-500 cursor-pointer" 
                    />
                    <span className="text-sm font-medium">Todos los clientes</span>
                  </label>
                  {availableClientsForFilter.map((cliente) => (
                    <label key={cliente._id} className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-700 rounded transition-colors">
                      <input 
                        type="checkbox" 
                        checked={filters.cliente.includes(cliente.nombre)} 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, cliente: [...filters.cliente, cliente.nombre] });
                          } else {
                            setFilters({ ...filters, cliente: filters.cliente.filter(c => c !== cliente.nombre) });
                          }
                        }} 
                        className="rounded bg-slate-900 border-slate-600 text-indigo-500 focus:ring-indigo-500 cursor-pointer" 
                      />
                      <span className="text-sm">{cliente.nombre}</span>
                    </label>
                  ))}
                  {availableClientsForFilter.length === 0 && (
                    <div className="text-sm text-slate-400 p-2 text-center">No hay clientes disponibles</div>
                  )}
                </div>
              </div>

              {/* Filtro de vendedor */}
              <div>
                <label className="block text-sm text-slate-300 mb-1">Vendedor</label>
                <select
                  value={filters.vendedor}
                  onChange={(e) => setFilters({ ...filters, vendedor: e.target.value })}
                  className="w-full p-3 rounded bg-slate-800 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Todos los vendedores</option>
                  {uniqueVendors.map((vendedor) => (
                    <option key={vendedor} value={vendedor}>
                      {vendedor}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Filtro por vendedor (solo admin/gerente) */}
        {(role === "admin" || role === "gerente") && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-soft">
            <div className="text-sm text-slate-400 mb-2">Filtrar por vendedor</div>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-100"
            >
              <option value="">Todos</option>
              {salesUsers.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.nombre ? `${u.nombre} (${u.username})` : u.username}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Distribución de Ventas</h2>
            <PieDistributionChart clients={viewClients} />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Tendencias</h2>
            <TrendChart clients={viewClients} />
          </div>
        </div>
      </div>
    </div>
  );
}

