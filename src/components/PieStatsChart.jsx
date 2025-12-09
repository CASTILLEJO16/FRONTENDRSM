
import React from "react";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

export default function PieStatsChart() {
  const { clients } = useContext(AppContext);

  const data = clients.map((c) => ({
    name: c.name,
    value: c.total,
  }));

  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f"];

  return (
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-bold mb-4">Distribución de ventas</h2>

      <PieChart width={400} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={80}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={colors[i % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
