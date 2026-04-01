import React, { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useClients } from "../context/ClientsContext";
import {
  User,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  PackageOpen
} from "lucide-react";

const periodos = [
  { value: "hoy", label: "Hoy" },
  { value: "semana", label: "Esta semana" },
  { value: "mes", label: "Este mes" },
  { value: "todo", label: "Todo" }
];

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { clients } = useClients();
  const [periodo, setPeriodo] = useState("todo");

  // Filtrar clientes por periodo
  const clientesFiltrados = useMemo(() => {
    const ahora = new Date();
    return clients.filter((c) => {
      const fechaCliente = new Date(c.fecha);

      switch (periodo) {
        case "hoy":
          return fechaCliente.toDateString() === ahora.toDateString();
        case "semana":
          const hace7dias = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
          return fechaCliente >= hace7dias;
        case "mes":
          return (
            fechaCliente.getMonth() === ahora.getMonth() &&
            fechaCliente.getFullYear() === ahora.getFullYear()
          );
        default:
          return true;
      }
    });
  }, [clients, periodo]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    let totalVentas = 0;
    let numVentas = 0;
    let clientesCompraron = 0;

    clientesFiltrados.forEach((c) => {
      if (c.ventas && c.ventas.length > 0) {
        clientesCompraron++;
        c.ventas.forEach((v) => {
          totalVentas += Number(v.monto || 0);
          numVentas++;
        });
      }
    });

    return {
      totalVentas,
      numClientes: clientesFiltrados.length,
      clientesCompraron,
      promedioPorVenta: numVentas > 0 ? totalVentas / numVentas : 0,
      tasaConversion:
        clientesFiltrados.length > 0
          ? (clientesCompraron / clientesFiltrados.length) * 100
          : 0
    };
  }, [clientesFiltrados]);

  // Calcular estadísticas adicionales memoizadas
  const additionalStats = useMemo(() => {
    const mejorVenta = Math.max(
      ...clientesFiltrados.flatMap((c) =>
        (c.ventas || []).map((v) => Number(v.monto || 0))
      ),
      0
    );

    const totalTransacciones = clientesFiltrados.reduce(
      (sum, c) => sum + (c.ventas?.length || 0),
      0
    );

    return {
      mejorVenta,
      totalTransacciones,
      sinCompra: stats.numClientes - stats.clientesCompraron
    };
  }, [clientesFiltrados, stats.numClientes, stats.clientesCompraron]);

  const hayDatos = stats.numClientes > 0;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-page-enter pb-20 px-4 sm:px-6">

      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 md:p-10 rounded-3xl shadow-soft-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <User size={36} />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {currentUser?.nombre || "Vendedor"}
            </h1>
            <p className="text-sm text-white/80">@{currentUser?.username}</p>
          </div>
        </div>

        {/* Selector de período con botones segmentados */}
        <div className="mt-6 bg-white/10 p-1.5 rounded-xl backdrop-blur-sm">
          <div className="flex gap-1">
            {periodos.map((p) => (
              <button
                key={p.value}
                onClick={() => setPeriodo(p.value)}
                className={`flex-1 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                  ${periodo === p.value 
                    ? "bg-white/20 text-white shadow-sm" 
                    : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estado vacío */}
      {!hayDatos && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
            <PackageOpen className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-2">No hay datos</h3>
          <p className="text-slate-400 text-sm">
            No se encontraron clientes para el período seleccionado.
          </p>
        </div>
      )}

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <DollarSign className="text-emerald-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total ventas</p>
          <p className="text-2xl font-bold text-slate-100 tabular-nums">
            ${stats.totalVentas.toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
            <Users className="text-indigo-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Clientes</p>
          <p className="text-2xl font-bold text-slate-100 tabular-nums">
            {stats.numClientes}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
            <ShoppingCart className="text-purple-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Compraron</p>
          <p className="text-2xl font-bold text-slate-100 tabular-nums">
            {stats.clientesCompraron}
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
            <TrendingUp className="text-amber-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Promedio</p>
          <p className="text-2xl font-bold text-slate-100 tabular-nums">
            ${stats.promedioPorVenta.toFixed(0)}
          </p>
        </div>

      </div>

      {/* Resumen */}
      <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 shadow-soft">
        <h3 className="text-xl font-bold text-slate-100 mb-6">Resumen</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50">
            <p className="text-slate-400 text-sm font-medium mb-2">Sin compra</p>
            <p className="text-3xl font-bold text-slate-100 tabular-nums">
              {additionalStats.sinCompra}
            </p>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50">
            <p className="text-slate-400 text-sm font-medium mb-2">Mejor venta</p>
            <p className="text-3xl font-bold text-slate-100 tabular-nums">
              ${additionalStats.mejorVenta.toLocaleString()}
            </p>
          </div>

          <div className="bg-slate-700/50 p-6 rounded-xl border border-slate-600/50">
            <p className="text-slate-400 text-sm font-medium mb-2">Transacciones</p>
            <p className="text-3xl font-bold text-slate-100 tabular-nums">
              {additionalStats.totalTransacciones}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
