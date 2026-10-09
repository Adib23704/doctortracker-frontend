'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { HeartPulse } from 'lucide-react';

interface ConditionDistributionChartProps {
  data: Array<{
    condition: string;
    count: number;
    percentage: number;
  }>;
}

const PALETTE = ['#0d9488', '#0284c7', '#6366f1', '#10b981', '#f59e0b', '#f43f5e'];

export const ConditionDistributionChart = ({ data }: ConditionDistributionChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-slate-50" />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Clinical Conditions Breakdown</h3>
          <p className="text-xs text-slate-500">Distribution across major diagnoses</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
          <HeartPulse className="h-3.5 w-3.5" />
          <span>Diagnoses</span>
        </div>
      </div>

      <div className="mt-4 flex flex-col items-center sm:flex-row sm:items-center sm:justify-between">
        <div className="h-56 w-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-md">
                        <p className="text-xs font-semibold text-slate-900">{item.condition}</p>
                        <p className="text-xs font-bold text-teal-700">
                          {item.count} cases ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="condition"
                cx="50%"
                cy="50%"
                innerRadius={52}
                outerRadius={80}
                paddingAngle={3}
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PALETTE[index % PALETTE.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 flex-1 space-y-2 sm:mt-0 sm:pl-6">
          {data.map((item, index) => (
            <div key={item.condition} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: PALETTE[index % PALETTE.length] }}
                />
                <span className="font-medium text-slate-700 truncate max-w-[140px]">
                  {item.condition}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 font-mono text-[11px]">
                <span>{item.count}</span>
                <span className="text-slate-400">({item.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
