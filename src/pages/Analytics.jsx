import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import BarSalesChart from "../components/BarSalesChart";

export default function Analytics() {
  const { clients } = useContext(AppContext);
  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <BarSalesChart clients={clients} />
    </div>
  );
}
