'use client';

import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

interface AdmissionsChartProps {
  data: Array<{ date: string; admissions: number }>;
}

export const AdmissionsChart = ({ data }: AdmissionsChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-slate-50" />;
  }

  const formatMonth = (str: string) => {
    if (!str) return '';
    const parts = str.split('-');
    if (parts.length === 2) {
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1);
      return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    }
    return str;
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Patient Admissions Timeline</h3>
          <p className="text-xs text-slate-500">Date-based historical admissions trend</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-800">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Clinical Volume</span>
        </div>
      </div>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="admissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="date"
              tickFormatter={formatMonth}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload?.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md">
                      <p className="text-xs font-semibold text-slate-800">
                        {formatMonth(String(label))}
                      </p>
                      <p className="mt-1 text-xs text-teal-700 font-bold">
                        {payload[0].value} {payload[0].value === 1 ? 'Patient' : 'Patients'}{' '}
                        Admitted
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="admissions"
              stroke="#0d9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#admissionGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
