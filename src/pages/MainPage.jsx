import React from "react";
import Header from "../components/Header";
import ClientList from "../components/ClientList";
import BarSalesChart from "../components/BarSalesChart";

export default function MainPage() {
  return (
    <div className="p-6 space-y-6">
      <Header />
      <ClientList />
      <BarSalesChart />
    </div>
  );
}
