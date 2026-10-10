'use client';

import { Calendar, HeartPulse, Phone, Trash2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import type { Patient } from '../../types';

interface DoctorPatientListProps {
  patients: Patient[];
  isLoading: boolean;
  onDeletePatient: (patient: Patient) => void;
}

export const DoctorPatientList = ({
  patients,
  isLoading,
  onDeletePatient,
}: DoctorPatientListProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="p-4 space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white p-12 text-center">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
          <HeartPulse className="h-5 w-5" />
        </div>
        <h4 className="mt-3 text-sm font-semibold text-slate-800">
          No patients under this doctor yet
        </h4>
        <p className="mt-1 max-w-xs text-xs text-slate-500">
          This doctor currently has 0 registered patients. Click &quot;Add Patient Under
          Doctor&quot; to assign a new patient.
        </p>
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
      case 'Discharged':
        return 'border-slate-200 bg-slate-100 text-slate-600';
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="py-3 pl-6 pr-3">Patient</th>
              <th className="px-3 py-3">Age / Gender</th>
              <th className="px-3 py-3">Medical Condition</th>
              <th className="px-3 py-3">Case Status</th>
              <th className="px-3 py-3">Phone</th>
              <th className="px-3 py-3">Admission</th>
              <th className="py-3 pl-3 pr-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {patients.map((p) => (
              <tr key={p._id} className="transition-colors hover:bg-slate-50/80">
                <td className="py-3.5 pl-6 pr-3">
                  <div>
                    <span className="font-semibold text-slate-900">{p.name}</span>
                    {p.notes && (
                      <p className="text-[11px] text-slate-400 truncate max-w-xs">{p.notes}</p>
                    )}
                  </div>
                </td>

                <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap">
                  <span>
                    {p.age} yrs &bull; {p.gender}
                  </span>
                </td>

                <td className="px-3 py-3.5 font-medium text-slate-800 whitespace-nowrap">
                  {p.condition}
                </td>

                <td className="px-3 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadge(
                      p.status
                    )}`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" />
                    <span>{p.phone}</span>
                  </div>
                </td>

                <td className="px-3 py-3.5 text-slate-500 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-400" />
                    <span>{formatDate(p.admissionDate)}</span>
                  </div>
                </td>

                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                  <button
                    onClick={() => onDeletePatient(p)}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                    title="Remove patient from doctor record"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
