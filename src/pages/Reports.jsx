import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import PieDistributionChart from "../components/PieDistributionChart";
import TrendChart from "../components/TrendChart";

export default function Reports() {
  const { clients } = useContext(AppContext);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Reportes Detallados</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PieDistributionChart clients={clients} />
        <TrendChart clients={clients} />
      </div>
    </div>
  );
}
