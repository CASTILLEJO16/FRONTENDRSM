import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../context/AppContext";
import PieDistributionChart from "../components/PieDistributionChart";
import TrendChart from "../components/TrendChart";

export default function Reports() {
  const { clients, currentUser, listSalesUsers, showAlert } = useContext(AppContext);
  const role = currentUser?.role || "vendedor";
  const [salesUsers, setSalesUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!(role === "admin" || role === "gerente")) return;
      try {
        const users = await listSalesUsers();
        setSalesUsers(users || []);
      } catch (e) {
        console.error(e);
        showAlert("error", e?.response?.data?.msg || "Error cargando vendedores");
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

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
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <h1 className="text-2xl font-bold">Reportes Detallados</h1>
        <p className="text-white/80 mt-2">
          Análisis completo de métricas{role === "admin" || role === "gerente" ? ` • ${selectedLabel}` : ""}
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

