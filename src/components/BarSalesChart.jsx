import React, { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

export default function BarSalesChart({ clients }) {
  const [filtro, setFiltro] = useState("mes");

  if (!clients || !Array.isArray(clients)) {
    return <div className="text-center text-slate-300 py-4">No hay datos</div>;
  }

  // 🔥 Normaliza fecha a (00:00:00)
  const startOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  // 🔥 Normaliza fecha a (23:59:59)
  const endOfDay = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59);
  };

  // ---------------------------------------------------------
  // 🔥 Función que determina el rango de fechas según el filtro
  // ---------------------------------------------------------
  const obtenerRango = () => {
    const hoy = new Date();

    let desde, hasta;

    switch (filtro) {
      case "dia":
        desde = startOfDay(hoy);      // 00:00
        hasta = endOfDay(hoy);        // 23:59
        break;

      case "semana":
        hasta = endOfDay(hoy);
        desde = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 7);
        desde = startOfDay(desde);
        break;

      case "mes":
        hasta = endOfDay(hoy);
        desde = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        desde = startOfDay(desde);
        break;

      case "anio":
        hasta = endOfDay(hoy);
        desde = new Date(hoy.getFullYear(), 0, 1);
        desde = startOfDay(desde);
        break;

      default:
        desde = new Date(0);
        hasta = new Date();
    }

    return { desde, hasta };
  };

  // -----------------------------------------------------------------
  // 🔥 FILTRAR ventas por rango de fechas según el filtro seleccionado
  // -----------------------------------------------------------------
  const data = useMemo(() => {
    const { desde, hasta } = obtenerRango();

    return clients.map((c) => {
      const ventasFiltradas = (c.ventas || []).filter((v) => {
        const fechaVenta = new Date(v.fecha);
        return fechaVenta >= desde && fechaVenta <= hasta;
      });

      const totalVentas = ventasFiltradas.reduce(
        (sum, v) => sum + Number(v.monto || 0),
        0
      );

      return {
        nombre: c.nombre || "Sin nombre",
        ventas: totalVentas
      };
    });
  }, [clients, filtro]);

  return (
    <div className="w-full">
      {/* Filtro */}
      <div className="mb-4 flex justify-end">
        <select
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="bg-slate-800 text-slate-200 p-2 rounded border border-slate-600"
        >
          <option value="dia">Hoy</option>
          <option value="semana">Últimos 7 días</option>
          <option value="mes">Este mes</option>
          <option value="anio">Este año</option>
        </select>
      </div>

      {/* Gráfica */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="nombre" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value}`} />
          <Legend />
          <Bar dataKey="ventas" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
