import React, { useEffect, useMemo, useState } from "react";
import { useClients } from "../context/ClientsContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import BarSalesChart from "../components/BarSalesChart";
import GoalsChart from "../components/GoalsChart";
import { Search } from "lucide-react";

export default function Analytics() {
  console.log('[Analytics] Componente renderizado, role:', useAuth().currentUser?.role);
  
  const { clients } = useClients();
  const { currentUser, listSalesUsers } = useAuth();
  const { showErrorAlert } = useNotifications();
  const role = currentUser?.role || "vendedor";
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!(role === "admin" || role === "gerente")) return;
      try {
        console.log('[Analytics] Cargando vendedores...');
        const result = await listSalesUsers();
        console.log('[Analytics] Resultado:', result);
        if (result.success) {
          console.log('[Analytics] Vendedores cargados:', result.users?.length || 0);
          setSalesUsers(result.users || []);
        } else {
          console.error('[Analytics] Error cargando vendedores:', result.error);
          showErrorAlert("Error al cargar vendedores");
        }
      } catch (error) {
        console.error("[Analytics] Error loading sales users:", error);
        showErrorAlert("Error al cargar usuarios de ventas");
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, showErrorAlert, listSalesUsers]);

  const viewClients = useMemo(() => {
    let filtered = clients;

    // Filtrar por vendedor (admin/gerente)
    if (role === "admin" || role === "gerente") {
      if (selectedUserId) {
        filtered = (filtered || []).filter((c) => String(c?.vendedor?.id || "") === String(selectedUserId));
      }
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(client =>
        client.nombre?.toLowerCase().includes(term) ||
        client.empresa?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [clients, role, selectedUserId, searchTerm]);

  const selectedLabel = useMemo(() => {
    if (!selectedUserId) return "Todos";
    const u = (salesUsers || []).find((x) => String(x?._id) === String(selectedUserId));
    return u?.nombre || u?.username || "Vendedor";
  }, [salesUsers, selectedUserId]);

  const handleSelectClient = (client) => {
    setSearchTerm(client.nombre);
    setShowSuggestions(false);
  };

  const suggestions = searchTerm.trim()
    ? clients.filter(client =>
        client.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.empresa?.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="animate-page-enter pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <h1 className="text-2xl font-bold">Análisis de Ventas</h1>
        <p className="text-white/80 mt-2">
          Visualización de datos y métricas{role === "admin" || role === "gerente" ? ` • ${selectedLabel}` : ""}
        </p>
      </div>

      <div className="space-y-6 px-4">
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

        {/* Buscador de clientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-soft">
          <div className="text-sm text-slate-400 mb-2">Buscar cliente</div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Buscar por nombre o empresa..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            />

            {/* Dropdown de sugerencias */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-soft-lg z-50 max-h-64 overflow-y-auto">
                {suggestions.map((client) => (
                  <button
                    key={client._id}
                    onClick={() => handleSelectClient(client)}
                    className="w-full px-4 py-3 text-left hover:bg-slate-700 transition-colors border-b border-slate-700 last:border-b-0"
                  >
                    <div className="font-medium text-slate-100">{client.nombre}</div>
                    {client.empresa && (
                      <div className="text-sm text-slate-400">{client.empresa}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Ventas por Cliente</h2>
            <BarSalesChart clients={viewClients} />
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Metas y Objetivos</h2>
            <GoalsChart clients={viewClients} />
          </div>
        </div>
      </div>
    </div>
  );
}

