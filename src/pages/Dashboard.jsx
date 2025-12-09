import React, { useContext, useState, useMemo } from "react";
import { AppContext } from "../context/AppContext";
import { User, DollarSign, Users, ShoppingCart, TrendingUp } from "lucide-react";

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
      tasaConversion: clientesFiltrados.length > 0 
        ? (clientesCompraron / clientesFiltrados.length) * 100 
        : 0
    };
  }, [clientesFiltrados]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header con perfil */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 mb-6 text-white">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-4 border-white/30">
            <User size={48} className="text-white" />
          </div>
          
          {/* Info del vendedor */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">
              {currentUser?.nombre || currentUser?.username || "Vendedor"}
            </h1>
            <p className="text-white/80 text-lg">Panel de Control</p>
            <p className="text-white/60 text-sm mt-1">
              @{currentUser?.username}
            </p>
          </div>

          {/* Filtro de periodo */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <label className="block text-sm font-medium mb-2">Periodo</label>
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="bg-white/20 border border-white/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="hoy" className="text-slate-900">Hoy</option>
              <option value="semana" className="text-slate-900">Esta semana</option>
              <option value="mes" className="text-slate-900">Este mes</option>
              <option value="todo" className="text-slate-900">Todo el tiempo</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* Total de ventas */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-500/10 rounded-lg">
              <DollarSign className="text-green-500" size={24} />
            </div>
            <TrendingUp className="text-green-500" size={20} />
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Total Ventas</h3>
          <p className="text-3xl font-bold text-slate-100">
            ${stats.totalVentas.toLocaleString()}
          </p>
        </div>

        {/* Total de clientes */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Users className="text-blue-500" size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Clientes Registrados</h3>
          <p className="text-3xl font-bold text-slate-100">
            {stats.numClientes}
          </p>
        </div>

        {/* Clientes que compraron */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <ShoppingCart className="text-purple-500" size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Compraron</h3>
          <p className="text-3xl font-bold text-slate-100">
            {stats.clientesCompraron}
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {stats.tasaConversion.toFixed(1)}% tasa de conversión
          </p>
        </div>

        {/* Promedio por venta */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-amber-500/10 rounded-lg">
              <DollarSign className="text-amber-500" size={24} />
            </div>
          </div>
          <h3 className="text-slate-400 text-sm font-medium mb-1">Promedio por Venta</h3>
          <p className="text-3xl font-bold text-slate-100">
            ${stats.promedioPorVenta.toFixed(0)}
          </p>
        </div>
      </div>

      {/* Resumen adicional */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-slate-100 mb-4">Resumen del Periodo</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Clientes sin compra</p>
            <p className="text-2xl font-bold text-slate-100">
              {stats.numClientes - stats.clientesCompraron}
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Mejor venta</p>
            <p className="text-2xl font-bold text-slate-100">
              ${Math.max(...clientesFiltrados.flatMap(c => 
                (c.ventas || []).map(v => Number(v.monto || 0))
              ), 0).toLocaleString()}
            </p>
          </div>
          <div className="p-4 bg-slate-800 rounded-lg">
            <p className="text-slate-400 text-sm mb-1">Total de transacciones</p>
            <p className="text-2xl font-bold text-slate-100">
              {clientesFiltrados.reduce((sum, c) => sum + (c.ventas?.length || 0), 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}