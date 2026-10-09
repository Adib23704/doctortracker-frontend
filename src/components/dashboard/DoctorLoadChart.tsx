'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Users } from 'lucide-react';

interface DoctorLoadChartProps {
  data: Array<{
    doctorId: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }>;
}

export const DoctorLoadChart = ({ data }: DoctorLoadChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-72 w-full animate-pulse rounded-2xl bg-slate-50" />;
  }

  const formattedData = data.map((d) => ({
    ...d,
    shortName: d.doctorName.replace(/^Dr\.\s+/, ''),
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Patients Per Doctor</h3>
          <p className="text-xs text-slate-500">Caseload distribution across leading physicians</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-800">
          <Users className="h-3.5 w-3.5" />
          <span>Physician Load</span>
        </div>
      </div>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
              angle={-20}
              textAnchor="end"
              interval={0}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-md">
                      <p className="text-xs font-semibold text-slate-900">{item.doctorName}</p>
                      <p className="text-[11px] text-slate-500">{item.specialization} &bull; {item.hospital}</p>
                      <p className="mt-1.5 text-xs font-bold text-teal-700">
                        {item.patientCount} Assigned {item.patientCount === 1 ? 'Patient' : 'Patients'}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="patientCount" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={45} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
