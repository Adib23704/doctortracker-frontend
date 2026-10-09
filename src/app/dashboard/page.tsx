'use client';

import React from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';

export default function DashboardPage() {
  return (
    <DashboardLayout
      title="Administrative Dashboard"
      subtitle="Overview of clinical doctors, patient registrations, and real-time statistics"
    >
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
        <h3 className="text-base font-semibold text-slate-800">Dashboard Overview</h3>
        <p className="mt-1 text-sm text-slate-500">
          Foundation initialized. Complete analytics charts and KPI metrics will mount in Phase 5.
        </p>
      </div>
    </DashboardLayout>
  );
}
