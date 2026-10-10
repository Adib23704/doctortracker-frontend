'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AdmissionsChart } from '../../components/dashboard/AdmissionsChart';
import { ConditionDistributionChart } from '../../components/dashboard/ConditionDistributionChart';
import { DoctorLoadChart } from '../../components/dashboard/DoctorLoadChart';
import { RecentAdmissionsTable } from '../../components/dashboard/RecentAdmissionsTable';
import { StatCards } from '../../components/dashboard/StatCards';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { api } from '../../lib/api';
import type { DashboardAnalytics, Patient } from '../../types';

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
          api.getPatients({ limit: 8 }),
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

        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3">
          <div className="h-full lg:col-span-1">
            <ConditionDistributionChart data={analytics?.conditionBreakdown || []} />
          </div>

          <div className="h-full lg:col-span-2">
            <RecentAdmissionsTable patients={recentPatients} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
