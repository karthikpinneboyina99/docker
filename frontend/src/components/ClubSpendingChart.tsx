'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function ClubSpendingChart({
  data
}: {
  data: { window: string; totalSpend: number }[];
}) {
  const formatYAxis = (tickItem: number) => {
    if (tickItem === 0) return '€0';
    return `€${(tickItem / 1_000_000).toFixed(0)}M`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#181818] border border-[#2e2e2e] p-3 rounded-md shadow-xl">
          <p className="text-[#888] text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
          <p className="text-[#f59e0b] font-black text-lg">
            €{(payload[0].value / 1_000_000).toFixed(1)}M
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
          <XAxis 
            dataKey="window" 
            stroke="#888" 
            tick={{ fill: '#888', fontSize: 12 }} 
            axisLine={{ stroke: '#2e2e2e' }}
            tickLine={false}
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            stroke="#888" 
            tick={{ fill: '#888', fontSize: 12 }}
            axisLine={{ stroke: '#2e2e2e' }}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#222' }} />
          <Bar 
            dataKey="totalSpend" 
            fill="#f59e0b" 
            radius={[4, 4, 0, 0]}
            maxBarSize={60}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
