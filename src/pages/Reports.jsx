import React, { useEffect, useMemo, useState } from "react";
import { useClients } from "../context/ClientsContext";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import PieDistributionChart from "../components/PieDistributionChart";
import TrendChart from "../components/TrendChart";
import { FileText } from "lucide-react";
import { generateSalesReport } from "../utils/reportGenerator";

export default function Reports() {
  const { clients } = useClients();
  const { currentUser, listSalesUsers } = useAuth();
  const { showErrorAlert } = useNotifications();
  const role = currentUser?.role || "vendedor";
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

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
    if (!(role === "admin" || role === "gerente")) return clients;
    if (!selectedUserId) return clients;
    return (clients || []).filter((c) => String(c?.vendedor?.id || "") === String(selectedUserId));
  }, [clients, role, selectedUserId]);

  const selectedLabel = useMemo(() => {
    if (!selectedUserId) return "Todos";
    const u = (salesUsers || []).find((x) => String(x?._id) === String(selectedUserId));
    return u?.nombre || u?.username || "Vendedor";
  }, [salesUsers, selectedUserId]);

  return (
    <div className="animate-page-enter pb-20">
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reportes Detallados</h1>
          <p className="text-white/80 mt-2">
            Análisis completo de métricas{role === "admin" || role === "gerente" ? ` • ${selectedLabel}` : ""}
          </p>
        </div>
        <button
          onClick={() => generateSalesReport(viewClients, `Reporte de Ventas - ${selectedLabel}`)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-3 rounded-xl font-semibold transition-all border border-white/30"
        >
          <FileText size={20} />
          Exportar PDF
        </button>
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

