"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Sen", value: 400 },
  { name: "Sel", value: 300 },
  { name: "Rab", value: 600 },
  { name: "Kam", value: 800 },
  { name: "Jum", value: 500 },
  { name: "Sab", value: 900 },
  { name: "Min", value: 1000 },
];

export const DashboardCharts = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-64 animate-pulse bg-surface-container-low rounded-xl" />;

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#fd8b00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#fd8b00" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e3e2e8" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "#757682", fontSize: 12 }} 
            dy={10}
          />
          <YAxis hide />
          <Tooltip 
            contentStyle={{ 
              borderRadius: "12px", 
              border: "none", 
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#ffffff"
            }} 
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#fd8b00"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
