'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { DoctorTable } from '../../components/doctors/DoctorTable';
import { AddDoctorModal } from '../../components/doctors/AddDoctorModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { SearchBar } from '../../components/common/SearchBar';
import { Pagination } from '../../components/common/Pagination';
import { Doctor, PaginationInfo } from '../../types';
import { api } from '../../lib/api';
import { UserPlus, Filter, RotateCcw, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const SPECIALTIES = [
  'All',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Oncology',
  'Dermatology',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<Doctor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getDoctors({
        page: pagination.page,
        limit: pagination.limit,
        search,
        specialization: specialization === 'All' ? undefined : specialization,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setDoctors(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, specialization, startDate, endDate]);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearch('');
    setSpecialization('All');
    setStartDate('');
    setEndDate('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }));
  };

  const handleDeleteConfirm = async () => {
    if (!doctorToDelete) return;
    setIsDeleting(true);
    try {
      await api.deleteDoctor(doctorToDelete._id);
      toast.success(`Doctor ${doctorToDelete.name} deleted successfully.`);
      setDoctorToDelete(null);
      fetchDoctors();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete doctor.');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters = search || specialization !== 'All' || startDate || endDate;

  return (
    <DashboardLayout
      title="Doctors Directory"
      subtitle="Manage medical practitioners, clinical specialties, and patient assignments"
    >
      <div className="space-y-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            placeholder="Search doctor by name, specialty, or hospital..."
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPagination((prev) => ({ ...prev, page: 1 }));
            }}
          />

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-teal-700"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add New Doctor</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 pr-2 border-r border-slate-200">
            <Filter className="h-3.5 w-3.5 text-teal-600" />
            <span>Filters:</span>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-500">Specialty:</label>
            <select
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              {SPECIALTIES.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Date from:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <span className="text-xs text-slate-400">to:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
          </div>

          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="space-y-0">
          <DoctorTable
            doctors={doctors}
            isLoading={isLoading}
            onDeleteDoctor={(doc) => setDoctorToDelete(doc)}
          />
          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </div>
      </div>

      <AddDoctorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchDoctors}
      />

      <ConfirmDialog
        isOpen={!!doctorToDelete}
        title="Delete Doctor Record"
        message={
          doctorToDelete?.patientCount && doctorToDelete.patientCount > 0
            ? `Cannot delete ${doctorToDelete?.name} because they have ${doctorToDelete.patientCount} assigned patient(s). Please reassign or remove their patients first.`
            : `Are you sure you want to delete ${doctorToDelete?.name}? This record will be permanently removed.`
        }
        confirmLabel="Delete Doctor"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDoctorToDelete(null)}
      />
    </DashboardLayout>
  );
}
