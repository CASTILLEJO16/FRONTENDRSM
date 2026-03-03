import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { TrendingUp, Calendar, Filter } from "lucide-react";

export default function TrendChart({ clients }) {
  const [periodo, setPeriodo] = useState("semana");

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
          <TrendingUp className="text-slate-400" size={24} />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No hay datos disponibles</h3>
        <p className="text-sm text-slate-400">No hay ventas para mostrar en la tendencia</p>
      </div>
    );
  }

  // Función para obtener datos de tendencia según el período
  const getTrendData = useMemo(() => {
    const ahora = new Date();
    let datos = [];

    switch (periodo) {
      case "dia":
        // Últimas 24 horas
        for (let i = 23; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setHours(fecha.getHours() - i);
          
          const ventasEnHora = clients.reduce((total, cliente) => {
            const ventasHora = (cliente.ventas || []).filter(v => {
              const fechaVenta = new Date(v.fecha);
              return fechaVenta.getHours() === fecha.getHours() &&
                     fechaVenta.getDate() === fecha.getDate() &&
                     fechaVenta.getMonth() === fecha.getMonth() &&
                     fechaVenta.getFullYear() === fecha.getFullYear();
            });
            return total + ventasHora.reduce((sum, v) => sum + toFiniteNumber(v.monto), 0);
          }, 0);

          datos.push({
            hora: fecha.getHours() + ":00",
            ventas: ventasEnHora,
            clientes: clients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = new Date(v.fecha);
                return fechaVenta.getHours() === fecha.getHours() &&
                       fechaVenta.getDate() === fecha.getDate() &&
                       fechaVenta.getMonth() === fecha.getMonth() &&
                       fechaVenta.getFullYear() === fecha.getFullYear();
              })
            ).length
          });
        }
        break;

      case "semana":
        // Últimos 7 días
        for (let i = 6; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setDate(fecha.getDate() - i);
          fecha.setHours(0, 0, 0, 0);
          
          const ventasEnDia = clients.reduce((total, cliente) => {
            const ventasDia = (cliente.ventas || []).filter(v => {
              const fechaVenta = new Date(v.fecha);
              return fechaVenta.getDate() === fecha.getDate() &&
                     fechaVenta.getMonth() === fecha.getMonth() &&
                     fechaVenta.getFullYear() === fecha.getFullYear();
            });
            return total + ventasDia.reduce((sum, v) => sum + toFiniteNumber(v.monto), 0);
          }, 0);

          datos.push({
            dia: fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }),
            ventas: ventasEnDia,
            clientes: clients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = new Date(v.fecha);
                return fechaVenta.getDate() === fecha.getDate() &&
                       fechaVenta.getMonth() === fecha.getMonth() &&
                       fechaVenta.getFullYear() === fecha.getFullYear();
              })
            ).length
          });
        }
        break;

      case "mes":
        // Últimos 30 días
        for (let i = 29; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setDate(fecha.getDate() - i);
          fecha.setHours(0, 0, 0, 0);
          
          const ventasEnDia = clients.reduce((total, cliente) => {
            const ventasDia = (cliente.ventas || []).filter(v => {
              const fechaVenta = new Date(v.fecha);
              return fechaVenta.getDate() === fecha.getDate() &&
                     fechaVenta.getMonth() === fecha.getMonth() &&
                     fechaVenta.getFullYear() === fecha.getFullYear();
            });
            return total + ventasDia.reduce((sum, v) => sum + toFiniteNumber(v.monto), 0);
          }, 0);

          datos.push({
            dia: fecha.toLocaleDateString('es-MX', { day: 'numeric' }),
            ventas: ventasEnDia,
            clientes: clients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = new Date(v.fecha);
                return fechaVenta.getDate() === fecha.getDate() &&
                       fechaVenta.getMonth() === fecha.getMonth() &&
                       fechaVenta.getFullYear() === fecha.getFullYear();
              })
            ).length
          });
        }
        break;

      default:
        datos = [];
    }

    return datos;
  }, [clients, periodo]);

  return (
    <div className="w-full space-y-4">
      {/* Filtros */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="text-slate-400" size={18} />
          <span className="text-sm text-slate-400">Período:</span>
        </div>
        
        <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
          {[
            { value: 'dia', label: 'Hoy' },
            { value: 'semana', label: '7 días' },
            { value: 'mes', label: '30 días' }
          ].map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setPeriodo(value)}
              className={`px-4 py-2 rounded-lg transition-all ${
                periodo === value
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Gráfico de tendencia */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <TrendingUp className="text-indigo-400" size={20} />
              Tendencia de Ventas
            </h3>
            <p className="text-slate-400 text-sm">
              Evolución de ventas y clientes en el tiempo
            </p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={getTrendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis 
              dataKey={periodo === "dia" ? "hora" : "dia"}
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis 
              stroke="#64748b" 
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
            />
            <Tooltip 
              formatter={(value, name) => [
                name === "ventas" ? `$${value.toLocaleString()}` : value,
                name === "ventas" ? "Ventas" : "Clientes"
              ]}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9'
              }}
            />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
            />
            <Line 
              type="monotone" 
              dataKey="ventas" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              animationDuration={1000}
            />
            <Line 
              type="monotone" 
              dataKey="clientes" 
              stroke="#10b981" 
              strokeWidth={2}
              dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              activeDot={{ r: 5 }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Ventas Totales</div>
          <div className="text-2xl font-bold text-white">
            ${getTrendData.reduce((sum, d) => sum + d.ventas, 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Transacciones</div>
          <div className="text-2xl font-bold text-white">
            {getTrendData.reduce((sum, d) => sum + d.clientes, 0)}
          </div>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Promedio</div>
          <div className="text-2xl font-bold text-white">
            ${getTrendData.length > 0 
              ? Math.round(getTrendData.reduce((sum, d) => sum + d.ventas, 0) / getTrendData.length).toLocaleString()
              : 0}
          </div>
        </div>
      </div>
    </div>
  );
}
