import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import {
  User,
  Home,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  BarChart2
} from "lucide-react";

export default function Dashboard() {
  const { currentUser, clients } = useContext(AppContext);
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

  return (
    <div className="pb-20">

      {/* Header móvil */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-8 md:p-10 rounded-3xl shadow-soft-lg mb-8">
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

        {/* Selector periodo */}
        <div className="mt-6 bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className="w-full bg-white/20 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <option value="hoy" className="text-slate-900">Hoy</option>
            <option value="semana" className="text-slate-900">Esta semana</option>
            <option value="mes" className="text-slate-900">Este mes</option>
            <option value="todo" className="text-slate-900">Todo el tiempo</option>
          </select>
        </div>
      </div>

      {/* Tarjetas estadísticas (optimizado móvil) */}
      <div className="px-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mb-8">

        {/* CARD */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4">
            <DollarSign className="text-emerald-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Total ventas</p>
          <p className="text-2xl font-bold text-slate-100">
            ${stats.totalVentas.toLocaleString()}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
            <Users className="text-indigo-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Clientes</p>
          <p className="text-2xl font-bold text-slate-100">
            {stats.numClientes}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4">
            <ShoppingCart className="text-purple-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Compraron</p>
          <p className="text-2xl font-bold text-slate-100">
            {stats.clientesCompraron}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center mb-4">
            <TrendingUp className="text-amber-400" size={20} />
          </div>
          <p className="text-slate-400 text-sm font-medium mb-1">Promedio</p>
          <p className="text-2xl font-bold text-slate-100">
            ${stats.promedioPorVenta.toFixed(0)}
          </p>
        </div>

      </div>

      {/* Resumen */}
      <div className="px-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-soft">
          <h3 className="text-xl font-bold text-slate-100 mb-6">Resumen</h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-slate-400 text-sm font-medium mb-2">Sin compra</p>
              <p className="text-3xl font-bold text-slate-100">
                {stats.numClientes - stats.clientesCompraron}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-slate-400 text-sm font-medium mb-2">Mejor venta</p>
              <p className="text-3xl font-bold text-slate-100">
                $
                {Math.max(
                  ...clientesFiltrados.flatMap((c) =>
                    (c.ventas || []).map((v) => Number(v.monto || 0))
                  ),
                  0
                ).toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-800 p-6 rounded-xl">
              <p className="text-slate-400 text-sm font-medium mb-2">Transacciones</p>
              <p className="text-3xl font-bold text-slate-100">
                {clientesFiltrados.reduce(
                  (sum, c) => sum + (c.ventas?.length || 0),
                  0
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      </div>
  );
}
