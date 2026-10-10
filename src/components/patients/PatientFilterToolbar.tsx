'use client';

import { Calendar, Filter, RotateCcw } from 'lucide-react';
import type { Doctor } from '../../types';
import { SearchBar } from '../common/SearchBar';

interface PatientFilterToolbarProps {
  search: string;
  onSearchChange: (val: string) => void;
  condition: string;
  onConditionChange: (val: string) => void;
  conditions?: string[];
  status: string;
  onStatusChange: (val: string) => void;
  doctorId: string;
  onDoctorChange: (val: string) => void;
  startDate: string;
  onStartDateChange: (val: string) => void;
  endDate: string;
  onEndDateChange: (val: string) => void;
  doctors: Doctor[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

const STATUS_OPTIONS = ['All', 'Active', 'Under Observation', 'Critical', 'Discharged'];

export const PatientFilterToolbar = ({
  search,
  onSearchChange,
  condition,
  onConditionChange,
  conditions = [],
  status,
  onStatusChange,
  doctorId,
  onDoctorChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  doctors,
  onReset,
  hasActiveFilters,
}: PatientFilterToolbarProps) => {
  const dynamicConditionOptions = Array.from(
    new Set(['All', ...conditions, ...(condition && condition !== 'All' ? [condition] : [])])
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          placeholder="Search patient by name, phone, or condition..."
          value={search}
          onChange={onSearchChange}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 pr-2 border-r border-slate-200">
          <Filter className="h-3.5 w-3.5 text-teal-600" />
          <span>Filters:</span>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-500">Condition:</label>
          <select
            value={condition}
            onChange={(e) => onConditionChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[170px] truncate"
          >
            {dynamicConditionOptions.map((c) => (
              <option key={c} value={c}>
                {c === 'All' ? 'All Conditions' : c}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-500">Status:</label>
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <label className="text-xs text-slate-500">Physician:</label>
          <select
            value={doctorId}
            onChange={(e) => onDoctorChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 max-w-[140px] truncate"
          >
            <option value="All">All Doctors</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs text-slate-500">Admitted:</span>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
          <span className="text-xs text-slate-400">to:</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
