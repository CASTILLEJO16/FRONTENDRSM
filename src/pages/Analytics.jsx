import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import BarSalesChart from "../components/BarSalesChart";
import GoalsChart from "../components/GoalsChart";
import PieDistributionChart from "../components/PieDistributionChart";
import TrendChart from "../components/TrendChart";
import RemindersSystem from "../components/RemindersSystem";
import NotificationsPanel from "../components/NotificationsPanel";

export default function Analytics() {
  const { clients } = useContext(AppContext);
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarSalesChart clients={clients} />
        <GoalsChart clients={clients} />
        <PieDistributionChart clients={clients} />
        <TrendChart clients={clients} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RemindersSystem clients={clients} />
        <NotificationsPanel clients={clients} />
      </div>
    </div>
  );
}
