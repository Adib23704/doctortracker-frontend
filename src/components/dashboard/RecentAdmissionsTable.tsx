'use client';

import React from 'react';
import Link from 'next/link';
import { Patient } from '../../types';
import { formatDate } from '../../lib/utils';
import { ArrowUpRight, Stethoscope } from 'lucide-react';

interface RecentAdmissionsTableProps {
  patients: Patient[];
  isLoading?: boolean;
}

export const RecentAdmissionsTable = ({ patients, isLoading }: RecentAdmissionsTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-full animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'border-emerald-200 bg-emerald-50 text-emerald-800';
      case 'Under Observation':
        return 'border-amber-200 bg-amber-50 text-amber-800';
      case 'Critical':
        return 'border-rose-200 bg-rose-50 text-rose-800';
      default:
        return 'border-slate-200 bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xs">
      <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent Patient Admissions</h3>
          <p className="text-xs text-slate-500">Latest recorded patients in the system</p>
        </div>
        <Link
          href="/patients"
          className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:text-teal-900 transition"
        >
          <span>View All Patients</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="py-3 pl-6 pr-3">Patient</th>
              <th className="px-3 py-3">Condition</th>
              <th className="px-3 py-3">Status</th>
              <th className="px-3 py-3">Assigned Physician</th>
              <th className="py-3 pl-3 pr-6 text-right">Admitted</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {patients.slice(0, 5).map((p) => {
              const doctorObj = typeof p.doctor === 'object' && p.doctor !== null ? p.doctor : null;
              return (
                <tr key={p._id} className="transition-colors hover:bg-slate-50/80">
                  <td className="py-3 pl-6 pr-3 font-semibold text-slate-900 whitespace-nowrap">
                    {p.name}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-700 whitespace-nowrap">
                    {p.condition}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                        p.status
                      )}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap">
                    {doctorObj ? (
                      <Link
                        href={`/doctors/${doctorObj._id}`}
                        className="inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-900"
                      >
                        <Stethoscope className="h-3 w-3 text-teal-600" />
                        <span>{doctorObj.name}</span>
                      </Link>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="py-3 pl-3 pr-6 text-right text-slate-500 whitespace-nowrap">
                    {formatDate(p.admissionDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
