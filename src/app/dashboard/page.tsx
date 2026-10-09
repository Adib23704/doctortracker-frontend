'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { StatCards } from '../../components/dashboard/StatCards';
import { AdmissionsChart } from '../../components/dashboard/AdmissionsChart';
import { DoctorLoadChart } from '../../components/dashboard/DoctorLoadChart';
import { ConditionDistributionChart } from '../../components/dashboard/ConditionDistributionChart';
import { RecentAdmissionsTable } from '../../components/dashboard/RecentAdmissionsTable';
import { DashboardAnalytics, Patient } from '../../types';
import { api } from '../../lib/api';
import { toast } from 'sonner';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [recentPatients, setRecentPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const [analyticsRes, patientsRes] = await Promise.all([
          api.getDashboardAnalytics(),
          api.getPatients({ limit: 5 }),
        ]);

        setAnalytics(analyticsRes.data);
        setRecentPatients(patientsRes.data);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const defaultKpis = {
    totalDoctors: 0,
    totalPatients: 0,
    activePatients: 0,
    criticalPatients: 0,
    avgPatientsPerDoctor: 0,
  };

  return (
    <DashboardLayout
      title="Administrative Dashboard"
      subtitle="Real-time clinical metrics, doctor workloads, and patient analytics"
    >
      <div className="space-y-6">
        <StatCards kpis={analytics?.kpis || defaultKpis} isLoading={isLoading} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdmissionsChart data={analytics?.admissionsOverTime || []} />

          <DoctorLoadChart data={analytics?.patientsPerDoctor || []} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <ConditionDistributionChart data={analytics?.conditionBreakdown || []} />
          </div>

          <div className="lg:col-span-2">
            <RecentAdmissionsTable patients={recentPatients} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
