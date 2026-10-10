'use client';

import { HeartPulse } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ConditionDistributionChartProps {
  data: Array<{
    condition: string;
    count: number;
    percentage: number;
  }>;
}

const PALETTE = [
  '#0d9488',
  '#0284c7',
  '#6366f1',
  '#10b981',
  '#f59e0b',
  '#f43f5e',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

const getColor = (condition: string, index: number) => {
  if (condition.toLowerCase().startsWith('other')) {
    return '#64748b';
  }
  return PALETTE[index % (PALETTE.length - 1)];
};

export const ConditionDistributionChart = ({ data }: ConditionDistributionChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-full min-h-[380px] w-full animate-pulse rounded-2xl bg-slate-50" />;
  }

  const totalCases = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
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

      {data.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-xs text-slate-400">
          <p>No diagnosis records recorded yet.</p>
        </div>
      ) : (
        <div className="mt-4 flex flex-1 flex-col justify-between">
          <div className="relative mx-auto h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
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
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                >
                  {data.map((item, index) => (
                    <Cell key={`cell-${item.condition}`} fill={getColor(item.condition, index)} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xl font-bold tracking-tight text-slate-800">{totalCases}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Cases
              </span>
            </div>
          </div>

          <div className="mt-4 max-h-56 overflow-y-auto divide-y divide-slate-100 border-t border-slate-100 pt-2 pr-1">
            {data.map((item, index) => (
              <div
                key={item.condition}
                className="flex items-center justify-between py-1.5 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: getColor(item.condition, index) }}
                  />
                  <span className="font-medium text-slate-700 truncate" title={item.condition}>
                    {item.condition}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-2 font-mono text-[11px] text-slate-500">
                  <span className="font-semibold text-slate-800">{item.count}</span>
                  <span className="text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
