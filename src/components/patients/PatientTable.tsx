'use client';

import { ArrowUpRight, Calendar, Edit, HeartPulse, Phone, Stethoscope, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '../../lib/utils';
import type { Patient } from '../../types';

interface PatientTableProps {
  patients: Patient[];
  isLoading: boolean;
  onEditPatient: (patient: Patient) => void;
  onDeletePatient: (patient: Patient) => void;
}

export const PatientTable = ({
  patients,
  isLoading,
  onEditPatient,
  onDeletePatient,
}: PatientTableProps) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="p-4 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <HeartPulse className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No patients found</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No clinical patient records match your current search or filter parameters. Try clearing
          filters.
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
              <th className="py-3.5 pl-6 pr-3">Patient</th>
              <th className="px-3 py-3.5">Age / Gender</th>
              <th className="px-3 py-3.5">Condition</th>
              <th className="px-3 py-3.5">Status</th>
              <th className="px-3 py-3.5">Assigned Doctor</th>
              <th className="px-3 py-3.5">Contact</th>
              <th className="px-3 py-3.5">Admission</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {patients.map((p) => {
              const doctorObj = typeof p.doctor === 'object' && p.doctor !== null ? p.doctor : null;
              return (
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

                  <td className="px-3 py-3.5 whitespace-nowrap font-medium text-slate-800">
                    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px]">
                      {p.condition}
                    </span>
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

                  <td className="px-3 py-3.5 whitespace-nowrap">
                    {doctorObj ? (
                      <Link
                        href={`/doctors/${doctorObj._id}`}
                        className="group inline-flex items-center gap-1 font-medium text-teal-700 hover:text-teal-900"
                      >
                        <Stethoscope className="h-3.5 w-3.5 text-teal-600" />
                        <span>{doctorObj.name}</span>
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition group-hover:opacity-100" />
                      </Link>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onEditPatient(p)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50 hover:text-teal-700"
                        title="Edit patient record"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePatient(p)}
                        className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete patient record"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
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
