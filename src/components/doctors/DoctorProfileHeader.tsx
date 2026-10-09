'use client';

import React from 'react';
import Link from 'next/link';
import { Doctor } from '../../types';
import { formatDate } from '../../lib/utils';
import { ArrowLeft, Stethoscope, Building2, Phone, Mail, Users, Calendar } from 'lucide-react';

interface DoctorProfileHeaderProps {
  doctor: Doctor;
  onAddPatient: () => void;
}

export const DoctorProfileHeader = ({ doctor, onAddPatient }: DoctorProfileHeaderProps) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Doctors Directory</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50 text-teal-700 shadow-2xs">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900">{doctor.name}</h1>
                <span className="rounded-md border border-teal-200 bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-800">
                  {doctor.specialization}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                <span>{doctor.hospital}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <button
            onClick={onAddPatient}
            className="inline-flex items-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-2xs transition hover:bg-teal-700"
          >
            <Users className="h-4 w-4" />
            <span>Add Patient Under Doctor</span>
          </button>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-4">
        <div className="flex items-center gap-2 text-xs">
          <Phone className="h-4 w-4 text-slate-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Contact Phone</p>
            <p className="font-semibold text-slate-700">{doctor.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Mail className="h-4 w-4 text-slate-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Email Address</p>
            <p className="font-semibold text-slate-700 truncate max-w-[150px]">{doctor.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Users className="h-4 w-4 text-teal-600" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Assigned Patients</p>
            <p className="font-bold text-teal-700 text-sm">{doctor.patientCount || 0}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Calendar className="h-4 w-4 text-slate-400" />
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-medium">Joined On</p>
            <p className="font-semibold text-slate-700">{formatDate(doctor.createdAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
