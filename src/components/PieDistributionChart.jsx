import React, { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { PieChart as PieChartIcon, Users, DollarSign, Filter } from "lucide-react";

export default function PieDistributionChart({ clients }) {
  const [tipo, setTipo] = useState("ventas");

  const toFiniteNumber = (value) => {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (typeof value === "string") {
      const cleaned = value.replace(/[^0-9.-]/g, "");
      const n = Number.parseFloat(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  if (!clients || !Array.isArray(clients)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
          <PieChartIcon className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No hay datos disponibles</h3>
        <p className="text-sm text-slate-400">No hay clientes para mostrar la distribución</p>
      </div>
    );
  }

  // Calcular datos según el tipo seleccionado
  const getPieData = useMemo(() => {
    let datos = [];

    switch (tipo) {
      case "ventas":
        // Top 10 clientes por ventas
        datos = clients
          .map(c => ({
            name: c.nombre || "Sin nombre",
            value: (c.ventas || []).reduce((sum, v) => sum + toFiniteNumber(v.monto), 0),
            ventas: (c.ventas || []).length
          }))
          .filter(c => c.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        break;

      case "clientes":
        // Top 10 clientes por número de ventas
        datos = clients
          .map(c => ({
            name: c.nombre || "Sin nombre",
            value: (c.ventas || []).length,
            monto: (c.ventas || []).reduce((sum, v) => sum + toFiniteNumber(v.monto), 0)
          }))
          .filter(c => c.value > 0)
          .sort((a, b) => b.value - a.value)
          .slice(0, 10);
        break;

      case "recientes":
        // Clientes con ventas más recientes
        datos = clients
          .filter(c => c.ventas && c.ventas.length > 0)
          .map(c => {
            const ultimaVenta = new Date(Math.max(...c.ventas.map(v => new Date(v.fecha))));
            return {
              name: c.nombre || "Sin nombre",
              value: (c.ventas || []).reduce((sum, v) => sum + toFiniteNumber(v.monto), 0),
              ultimaVenta: ultimaVenta
            };
          })
          .sort((a, b) => b.ultimaVenta - a.ultimaVenta)
          .slice(0, 10);
        break;

      default:
        datos = [];
    }

    return datos;
  }, [clients, tipo]);

  // Colores para el gráfico
  const COLORS = [
    '#6366f1', // índigo
    '#8b5cf6', // violeta
    '#a855f7', // púrpura
    '#d946ef', // fucsia
    '#ec4899', // rosa
    '#f43f5e', // rosa rojo
    '#ef4444', // rojo
    '#f97316', // naranja
    '#f59e0b', // ámbar
    '#eab308'  // amarillo
  ];

  // Calcular totales
  const totalValue = getPieData.reduce((sum, item) => sum + item.value, 0);

  if (getPieData.length === 0 || totalValue <= 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mb-4">
          <PieChartIcon className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No hay datos disponibles</h3>
        <p className="text-sm text-slate-400">No hay información para mostrar la distribución</p>
      </div>
    );
  }

  // Custom label para mostrar porcentajes
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // No mostrar labels muy pequeños

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <PieChartIcon className="text-slate-400" size={18} />
          <span className="text-sm text-slate-400">Distribución:</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          {[
            { value: 'ventas', label: 'Por Ventas', icon: DollarSign },
            { value: 'clientes', label: 'Por Frecuencia', icon: Users },
            { value: 'recientes', label: 'Más Recientes', icon: Users }
          ].map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTipo(value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                tipo === value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de pastel */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <PieChartIcon className="text-indigo-400" size={20} />
              {tipo === "ventas" && "Distribución de Ventas"}
              {tipo === "clientes" && "Frecuencia de Compras"}
              {tipo === "recientes" && "Clientes Activos Recientes"}
            </h3>
            <p className="text-slate-400 text-sm">
              Top 10 clientes {tipo === "ventas" ? "por monto" : tipo === "clientes" ? "por frecuencia" : "más activos"}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Gráfico */}
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={getPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {getPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => {
                    const safeValue = toFiniteNumber(value);
                    if (tipo === "ventas") {
                      return [`$${safeValue.toLocaleString()}`, name];
                    } else if (tipo === "clientes") {
                      return [`${safeValue} ventas`, name];
                    } else {
                      return [`$${safeValue.toLocaleString()}`, name];
                    }
                  }}
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#f1f5f9'
                  }}
                />
                <Legend 
                  wrapperStyle={{ color: '#94a3b8' }}
                  formatter={(value, entry) => [entry.payload.name, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Lista de clientes */}
          <div className="lg:w-80">
            <h4 className="text-lg font-medium text-white mb-4">Top Clientes</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {getPieData.map((cliente, index) => (
                <div key={cliente.name} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <div className="text-sm font-medium text-white">{cliente.name}</div>
                      <div className="text-xs text-slate-400">
                        {tipo === "ventas" && `${cliente.ventas} ventas`}
                        {tipo === "clientes" && `$${cliente.monto.toLocaleString()}`}
                        {tipo === "recientes" && `${cliente.ventas} ventas`}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-white">
                      {tipo === "ventas" && `$${cliente.value.toLocaleString()}`}
                      {tipo === "clientes" && `${cliente.value}`}
                      {tipo === "recientes" && `$${cliente.value.toLocaleString()}`}
                    </div>
                    <div className="text-xs text-slate-400">
                      {totalValue > 0 && `${((cliente.value / totalValue) * 100).toFixed(1)}%`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Total</div>
          <div className="text-2xl font-bold text-white">
            {tipo === "ventas" && `$${totalValue.toLocaleString()}`}
            {tipo === "clientes" && getPieData.length}
            {tipo === "recientes" && getPieData.length}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Promedio</div>
          <div className="text-2xl font-bold text-white">
            {getPieData.length > 0 && (
              tipo === "ventas" 
                ? `$${Math.round(totalValue / getPieData.length).toLocaleString()}`
                : Math.round(totalValue / getPieData.length)
            )}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Concentración</div>
          <div className="text-2xl font-bold text-white">
            {getPieData.length > 0 && `${((getPieData[0]?.value / totalValue) * 100).toFixed(1)}%`}
          </div>
        </div>
      </div>
    </div>
  );
}
