'use client';

import { ArrowUpRight, Building2, Mail, Phone, Stethoscope, Trash2, Users } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '../../lib/utils';
import type { Doctor } from '../../types';

interface DoctorTableProps {
  doctors: Doctor[];
  isLoading: boolean;
  onDeleteDoctor: (doctor: Doctor) => void;
}

export const DoctorTable = ({ doctors, isLoading, onDeleteDoctor }: DoctorTableProps) => {
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

  if (doctors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
          <Stethoscope className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-800">No doctors found</h3>
        <p className="mt-1 max-w-sm text-xs text-slate-500">
          No medical practitioner records match your current search or filter criteria. Try
          adjusting filters or create a new doctor.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            <tr>
              <th className="py-3.5 pl-6 pr-3">Doctor</th>
              <th className="px-3 py-3.5">Specialization</th>
              <th className="px-3 py-3.5">Hospital</th>
              <th className="px-3 py-3.5">Contact</th>
              <th className="px-3 py-3.5 text-center">Patients</th>
              <th className="px-3 py-3.5">Registered</th>
              <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {doctors.map((doc) => (
              <tr key={doc._id} className="transition-colors hover:bg-slate-50/80">
                <td className="py-3.5 pl-6 pr-3">
                  <Link
                    href={`/doctors/${doc._id}`}
                    className="group inline-flex items-center gap-2 font-semibold text-slate-900 hover:text-teal-700"
                  >
                    <span>{doc.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 opacity-0 transition group-hover:opacity-100 group-hover:text-teal-700" />
                  </Link>
                </td>

                <td className="px-3 py-3.5 whitespace-nowrap">
                  <span className="inline-flex items-center rounded-md border border-teal-200/80 bg-teal-50/70 px-2 py-0.5 text-[11px] font-medium text-teal-800">
                    {doc.specialization}
                  </span>
                </td>

                <td className="px-3 py-3.5 text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                    <span>{doc.hospital}</span>
                  </div>
                </td>

                <td className="px-3 py-3.5 whitespace-nowrap">
                  <div className="flex flex-col gap-0.5 text-[11px]">
                    <span className="flex items-center gap-1 text-slate-700">
                      <Phone className="h-3 w-3 text-slate-400" />
                      {doc.phone}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Mail className="h-3 w-3 text-slate-400" />
                      {doc.email}
                    </span>
                  </div>
                </td>

                <td className="px-3 py-3.5 text-center whitespace-nowrap">
                  <Link
                    href={`/doctors/${doc._id}`}
                    className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-teal-50 hover:text-teal-800"
                    title="View assigned patients"
                  >
                    <Users className="h-3 w-3 text-slate-400" />
                    <span>{doc.patientCount || 0}</span>
                  </Link>
                </td>

                <td className="px-3 py-3.5 text-slate-500 whitespace-nowrap">
                  {formatDate(doc.createdAt)}
                </td>

                <td className="py-3.5 pl-3 pr-6 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/doctors/${doc._id}`}
                      className="rounded-md border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-teal-700"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => onDeleteDoctor(doc)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                      title="Delete doctor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
