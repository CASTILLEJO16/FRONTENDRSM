import React, { useState, useMemo, useContext, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine
} from "recharts";
import { Target, TrendingUp } from "lucide-react";
import { AppContext } from "../context/AppContext";

const parseVentaDate = (fecha) => {
  if (!fecha) return null;
  if (fecha instanceof Date) return fecha;

  if (typeof fecha === 'string') {
    // Manejar formato ISO con timezone
    if (fecha.includes('T') && fecha.includes('Z')) {
      const isoDate = new Date(fecha);
      if (!Number.isNaN(isoDate.getTime())) {
        // Tratar como fecha de calendario (YYYY-MM-DD en UTC) para evitar desfase por zona horaria
        const localDate = new Date(
          isoDate.getUTCFullYear(),
          isoDate.getUTCMonth(),
          isoDate.getUTCDate(),
          12,
          0,
          0,
          0
        );
        console.log(`Parseando fecha ISO ${fecha} -> ${localDate.toLocaleDateString()}`);
        return localDate;
      }
    }
    
    const m = fecha.match(/^\d{4}-\d{2}-\d{2}$/);
    if (m) {
      const [y, mo, d] = fecha.split('-').map(Number);
      // Crear fecha a mediodía para evitar problemas de zona horaria
      const parsed = new Date(y, mo - 1, d, 12, 0, 0, 0);
      console.log(`Parseando fecha simple ${fecha} -> ${parsed.toLocaleDateString()}`);
      return parsed;
    }
  }

  const parsed = new Date(fecha);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const sameLocalDay = (a, b) => {
  if (!a || !b) return false;
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
};

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

const getVentaMonto = (v) => toFiniteNumber(v?.monto ?? v?.total ?? v?.importe ?? 0);

export default function GoalsChart({ clients, currentUser }) {
  const { showAlert } = useContext(AppContext);
  const [periodo, setPeriodo] = useState("mes");
  const tipoMeta = "ventas";

  const safeClients = Array.isArray(clients) ? clients : [];

  // Metas configuradas por el usuario (en un sistema real, estas vendrían de una base de datos)
  const [metasConfiguradas, setMetasConfiguradas] = useState(() => {
    const savedMetas = localStorage.getItem('metasConfiguradas');
    if (savedMetas) {
      try {
        return JSON.parse(savedMetas);
      } catch (e) {
        console.error('Error parsing saved metas:', e);
      }
    }
    return {
      ventas: {
        dia: 5000,
        semana: 35000,
        mes: 150000,
        trimestre: 450000,
        año: 1800000
      }
    };
  });

  const updateMeta = (tipo, periodo, valor) => {
    if (tipo !== 'ventas') return;
    if (periodo !== 'mes') return;

    const mes = Number(valor) || 0;
    const dia = Math.round(mes / 30);
    const semana = Math.round(mes / 4);
    const trimestre = mes * 3;
    const año = mes * 12;

    const nuevasMetas = {
      ...metasConfiguradas,
      ventas: {
        ...metasConfiguradas.ventas,
        mes,
        dia,
        semana,
        trimestre,
        año
      }
    };

    setMetasConfiguradas(nuevasMetas);
    localStorage.setItem('metasConfiguradas', JSON.stringify(nuevasMetas));
  };

  const guardarMetas = () => {
    setMetasActivas(metasConfiguradas);
    localStorage.setItem('metasActivas', JSON.stringify(metasConfiguradas));
    showAlert('success', '¡Metas guardadas exitosamente!', {
      duration: 3000
    });
  };

  const descartarCambios = () => {
    setMetasConfiguradas(metasActivas);
    showAlert('info', 'Cambios descartados', {
      duration: 3000
    });
  };

  // Metas activas (las que se usan en el gráfico)
  const [metasActivas, setMetasActivas] = useState(() => {
    const savedMetasActivas = localStorage.getItem('metasActivas');
    if (savedMetasActivas) {
      try {
        return JSON.parse(savedMetasActivas);
      } catch (e) {
        console.error('Error parsing saved active metas:', e);
      }
    }
    return metasConfiguradas;
  });

  const ventasHoy = useMemo(() => {
    const ahora = new Date();
    return safeClients.reduce((total, cliente) => {
      const ventasDia = (cliente.ventas || []).filter(v => {
        const fechaVenta = parseVentaDate(v.fecha);
        return sameLocalDay(fechaVenta, ahora);
      });
      return total + ventasDia.reduce((sum, v) => sum + getVentaMonto(v), 0);
    }, 0);
  }, [safeClients]);

  // Forzar actualización cuando cambian los clientes
  useEffect(() => {
    // Este efecto se dispara cuando clients cambia, forzando la recálculación
  }, [clients]);

  // Calcular datos reales según el período
  const getRealData = useMemo(() => {
    const ahora = new Date();
    const metaDia = toFiniteNumber(metasActivas?.ventas?.dia);
    let datos = [];

    const metaPorPunto =
      periodo === 'dia'
        ? metaDia / 24
        : (periodo === 'semana' || periodo === 'mes')
          ? metaDia
          : metaDia;

    switch (periodo) {
      case "dia":
        // Datos de hoy
        for (let i = 23; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setHours(fecha.getHours() - i);
          
          let valor = 0;
          if (tipoMeta === "ventas") {
            valor = safeClients.reduce((total, cliente) => {
              const ventasHora = (cliente.ventas || []).filter(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                if (!fechaVenta) return false;
                return fechaVenta.getHours() === fecha.getHours() &&
                       fechaVenta.getDate() === fecha.getDate() &&
                       fechaVenta.getMonth() === fecha.getMonth() &&
                       fechaVenta.getFullYear() === fecha.getFullYear();
              });
              return total + ventasHora.reduce((sum, v) => sum + getVentaMonto(v), 0);
            }, 0);
          } else if (tipoMeta === "clientes") {
            valor = safeClients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                if (!fechaVenta) return false;
                return fechaVenta.getHours() === fecha.getHours() &&
                       fechaVenta.getDate() === fecha.getDate() &&
                       fechaVenta.getMonth() === fecha.getMonth() &&
                       fechaVenta.getFullYear() === fecha.getFullYear();
              })
            ).length;
          } else if (tipoMeta === "visitas") {
            // Simular visitas (en sistema real vendría de datos reales)
            valor = Math.floor(Math.random() * 3);
          }
          
          datos.push({
            hora: fecha.getHours() + ":00",
            real: valor,
            meta: metaPorPunto
          });
        }
        break;

      case "semana":
        // Últimos 7 días
        for (let i = 6; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setDate(fecha.getDate() - i);
          fecha.setHours(0, 0, 0, 0);
          
          let valor = 0;
          if (tipoMeta === "ventas") {
            valor = safeClients.reduce((total, cliente) => {
              const ventasDia = (cliente.ventas || []).filter(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                return sameLocalDay(fechaVenta, fecha);
              });
              return total + ventasDia.reduce((sum, v) => sum + getVentaMonto(v), 0);
            }, 0);
          } else if (tipoMeta === "clientes") {
            valor = safeClients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                return sameLocalDay(fechaVenta, fecha);
              })
            ).length;
          } else if (tipoMeta === "visitas") {
            valor = Math.floor(Math.random() * 8);
          }
          
          datos.push({
            dia: fecha.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric' }),
            real: valor,
            meta: metaPorPunto
          });
        }
        break;

      case "mes":
        // Últimos 30 días
        for (let i = 29; i >= 0; i--) {
          const fecha = new Date(ahora);
          fecha.setDate(fecha.getDate() - i);
          fecha.setHours(0, 0, 0, 0);
          
          let valor = 0;
          if (tipoMeta === "ventas") {
            valor = safeClients.reduce((total, cliente) => {
              const ventasDia = (cliente.ventas || []).filter(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                return sameLocalDay(fechaVenta, fecha);
              });
              return total + ventasDia.reduce((sum, v) => sum + getVentaMonto(v), 0);
            }, 0);
          } else if (tipoMeta === "clientes") {
            valor = safeClients.filter(c => 
              (c.ventas || []).some(v => {
                const fechaVenta = parseVentaDate(v.fecha);
                return sameLocalDay(fechaVenta, fecha);
              })
            ).length;
          } else if (tipoMeta === "visitas") {
            valor = Math.floor(Math.random() * 6);
          }
          
          datos.push({
            dia: fecha.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
            real: valor,
            meta: metaPorPunto
          });
        }
        break;

      default:
        datos = [];
    }

    return datos;
  }, [safeClients, metasActivas, periodo, tipoMeta]);

  // Calcular estadísticas
  const stats = useMemo(() => {
    const realTotal = getRealData.reduce((sum, d) => sum + d.real, 0);
    const metaTotal = getRealData.reduce((sum, d) => sum + d.meta, 0);
    const progreso = metaTotal > 0 ? (realTotal / metaTotal) * 100 : 0;
    
    // Proyección basada en tendencia actual
    const diasTranscurridos = getRealData.length;
    const proyeccion = diasTranscurridos > 0 ? (realTotal / diasTranscurridos) * 
      (periodo === "dia" ? 24 : periodo === "semana" ? 7 : periodo === "mes" ? 30 : 90) : 0;
    
    return {
      realTotal,
      metaTotal,
      progreso,
      proyeccion,
      diasTranscurridos
    };
  }, [getRealData, periodo]);

  return (
    <div className="w-full space-y-4">
      {/* Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Target className="text-slate-400" size={18} />
          <span className="text-sm text-slate-400">Objetivos:</span>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Período */}
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-xl border border-slate-700/50">
            {[
              { value: 'dia', label: 'Hoy' },
              { value: 'semana', label: 'Semana' },
              { value: 'mes', label: 'Mes' }
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
      </div>

      {/* Configuración de metas */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-3">
          <Target className="text-indigo-400" size={20} />
          Configurar Metas
        </h3>
        
        <div className="space-y-4">
          <h4 className="text-white font-medium flex items-center gap-2">
            <TrendingUp size={16} className="text-indigo-400" />
            Ventas
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block capitalize">mes</label>
              <input
                type="number"
                value={metasConfiguradas.ventas.mes}
                onChange={(e) => updateMeta('ventas', 'mes', e.target.value)}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Meta mes"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block capitalize">dia</label>
              <input
                type="number"
                value={metasConfiguradas.ventas.dia}
                readOnly
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block capitalize">semana</label>
              <input
                type="number"
                value={metasConfiguradas.ventas.semana}
                readOnly
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block capitalize">trimestre</label>
              <input
                type="number"
                value={metasConfiguradas.ventas.trimestre}
                readOnly
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block capitalize">año</label>
              <input
                type="number"
                value={metasConfiguradas.ventas.año}
                readOnly
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50">
        <button
          onClick={descartarCambios}
          className="btn bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 border border-slate-600/50"
        >
          Descartar
        </button>
        <button
          onClick={guardarMetas}
          className="btn btn-primary flex items-center gap-2"
        >
          <Target size={16} />
          Guardar Metas
        </button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Real</div>
          <div className="text-2xl font-bold text-white">
            {tipoMeta === "ventas" ? `$${stats.realTotal.toLocaleString()}` : stats.realTotal}
          </div>
          <div className="text-xs text-slate-500">
            {tipoMeta === "ventas" ? "en ventas" : tipoMeta === "clientes" ? "clientes" : "visitas"}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Meta diaria</div>
          <div className="text-2xl font-bold text-white">
            ${metasActivas.ventas.dia.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            Meta de hoy
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Llevas hoy</div>
          <div className="text-2xl font-bold text-white">
            ${ventasHoy.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500">
            Se reinicia cada día
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Meta</div>
          <div className="text-2xl font-bold text-white">
            {tipoMeta === "ventas" ? `$${stats.metaTotal.toLocaleString()}` : stats.metaTotal}
          </div>
          <div className="text-xs text-slate-500">
            Objetivo del período
          </div>
        </div>
      </div>

      {/* Gráfico de progreso */}
      <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2 flex items-center gap-3">
              <Target className="text-indigo-400" size={20} />
              Seguimiento de Metas
            </h3>
            <p className="text-slate-400 text-sm">
              Comparación de rendimiento vs objetivos establecidos
            </p>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={getRealData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
                tipoMeta === "ventas" ? `$${toFiniteNumber(value).toLocaleString()}` : toFiniteNumber(value),
                name === "real" ? "Real" : "Meta"
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
            <ReferenceLine 
              y={periodo === 'dia' ? toFiniteNumber(metasActivas?.ventas?.dia) / 24 : toFiniteNumber(metasActivas?.ventas?.dia)}
              stroke="#ef4444" 
              strokeDasharray="3 3"
              label="Meta"
              labelPosition="topRight"
            />
            <Bar 
              dataKey="real" 
              fill="#6366f1" 
              radius={[4, 0]}
              animationDuration={1000}
            />
            <Bar 
              dataKey="meta" 
              fill="#10b981" 
              radius={[4, 0]}
              opacity={0.3}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* Indicadores de rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className={`p-4 rounded-xl border ${
          stats.progreso >= 100 
            ? 'bg-emerald-600/20 border-emerald-600/50' 
            : stats.progreso >= 80 
              ? 'bg-blue-600/20 border-blue-600/50'
              : stats.progreso >= 60 
                ? 'bg-amber-600/20 border-amber-600/50'
                : 'bg-rose-600/20 border-rose-600/50'
        }`}>
          <div className="text-sm text-slate-400 mb-1">Estado</div>
          <div className="text-lg font-bold text-white">
            {stats.progreso >= 100 ? '🎉 Meta alcanzada' : 
             stats.progreso >= 80 ? '🚀 Casi allí' : 
             stats.progreso >= 60 ? '⚡ En camino' : '📈 Necesita esfuerzo'}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Diferencia</div>
          <div className="text-lg font-bold text-white">
            {stats.realTotal - stats.metaTotal >= 0 ? '+' : ''}
            {tipoMeta === "ventas" 
              ? `$${Math.abs(stats.realTotal - stats.metaTotal).toLocaleString()}`
              : Math.abs(stats.realTotal - stats.metaTotal)
            }
          </div>
          <div className="text-xs text-slate-500">
            {stats.realTotal >= stats.metaTotal ? 'Sobre la meta' : 'Por alcanzar'}
          </div>
        </div>
        
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <div className="text-sm text-slate-400 mb-1">Rendimiento</div>
          <div className="text-lg font-bold text-white">
            {stats.progreso >= 100 ? 'Excelente' : 
             stats.progreso >= 80 ? 'Muy bueno' : 
             stats.progreso >= 60 ? 'Bueno' : 'Mejorable'}
          </div>
          <div className="text-xs text-slate-500">
            Basado en objetivos
          </div>
        </div>
      </div>
    </div>
  );
}
