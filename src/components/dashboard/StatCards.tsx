'use client';

import { Activity, AlertCircle, Scale, Stethoscope, Users } from 'lucide-react';
import type { DashboardAnalytics } from '../../types';

interface StatCardsProps {
  kpis: DashboardAnalytics['kpis'];
  isLoading?: boolean;
}

export const StatCards = ({ kpis, isLoading }: StatCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
          />
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Total Doctors',
      value: kpis.totalDoctors,
      subtext: 'Registered practitioners',
      icon: Stethoscope,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-700',
    },
    {
      title: 'Total Patients',
      value: kpis.totalPatients,
      subtext: 'Active clinical records',
      icon: Users,
      iconBg: 'bg-sky-50',
      iconColor: 'text-sky-700',
    },
    {
      title: 'Active Cases',
      value: kpis.activePatients,
      subtext: 'Currently receiving care',
      icon: Activity,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-700',
    },
    {
      title: 'Critical Patients',
      value: kpis.criticalPatients,
      subtext: 'High-acuity monitoring',
      icon: AlertCircle,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-700',
    },
    {
      title: 'Patients / Doctor',
      value: kpis.avgPatientsPerDoctor,
      subtext: 'Average patient load',
      icon: Scale,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-slate-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">{card.title}</span>
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl ${card.iconBg} ${card.iconColor}`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-slate-900">{card.value}</span>
              <p className="mt-0.5 text-[11px] text-slate-400">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
