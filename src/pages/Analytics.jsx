import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import BarSalesChart from "../components/BarSalesChart";
import GoalsChart from "../components/GoalsChart";

export default function Analytics() {
  const { clients } = useContext(AppContext);
  return (
    <div className="animate-page-enter pb-20">
      {/* Header móvil */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 text-white p-6 md:p-8 rounded-2xl shadow-soft-lg mb-6">
        <h1 className="text-2xl font-bold">Análisis de Ventas</h1>
        <p className="text-white/80 mt-2">Visualización de datos y métricas</p>
      </div>
      
      <div className="space-y-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Ventas por Cliente</h2>
            <BarSalesChart clients={clients} />
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Metas y Objetivos</h2>
            <GoalsChart clients={clients} />
          </div>
        </div>
      </div>
    </div>
  );
}
