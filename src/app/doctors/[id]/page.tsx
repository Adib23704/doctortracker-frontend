'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { DoctorProfileHeader } from '../../../components/doctors/DoctorProfileHeader';
import { DoctorPatientList } from '../../../components/doctors/DoctorPatientList';
import { AddPatientUnderDoctorModal } from '../../../components/doctors/AddPatientUnderDoctorModal';
import { ConfirmDialog } from '../../../components/common/ConfirmDialog';
import { SearchBar } from '../../../components/common/SearchBar';
import { Pagination } from '../../../components/common/Pagination';
import { Doctor, Patient, PaginationInfo } from '../../../types';
import { api } from '../../../lib/api';
import { toast } from 'sonner';

export default function DoctorDetailPage() {
  const params = useParams();
  const doctorId = params.id as string;

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoadingDoctor, setIsLoadingDoctor] = useState(true);
  const [isLoadingPatients, setIsLoadingPatients] = useState(true);
  const [search, setSearch] = useState('');

  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [isAddPatientModalOpen, setIsAddPatientModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDoctor = useCallback(async () => {
    setIsLoadingDoctor(true);
    try {
      const res = await api.getDoctor(doctorId);
      setDoctor(res.data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load doctor profile.');
    } finally {
      setIsLoadingDoctor(false);
    }
  }, [doctorId]);

  const fetchPatients = useCallback(async () => {
    setIsLoadingPatients(true);
    try {
      const res = await api.getDoctorPatients(doctorId, {
        page: pagination.page,
        limit: pagination.limit,
        search,
      });
      setPatients(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load doctor patients.');
    } finally {
      setIsLoadingPatients(false);
    }
  }, [doctorId, pagination.page, pagination.limit, search]);

  useEffect(() => {
    fetchDoctor();
  }, [fetchDoctor]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleDeletePatientConfirm = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      await api.deletePatientFromDoctor(doctorId, patientToDelete._id);
      toast.success(`Patient ${patientToDelete.name} removed from doctor record.`);
      setPatientToDelete(null);
      fetchPatients();
      fetchDoctor();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete patient.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoadingDoctor) {
    return (
      <DashboardLayout title="Doctor Profile">
        <div className="h-44 w-full animate-pulse rounded-2xl bg-white border border-slate-200" />
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout title="Doctor Profile">
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">
          Doctor not found or has been removed.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title={`Doctor Profile: ${doctor.name}`}
      subtitle={`${doctor.specialization} &bull; ${doctor.hospital}`}
    >
      <div className="space-y-6">
        <DoctorProfileHeader
          doctor={doctor}
          onAddPatient={() => setIsAddPatientModalOpen(true)}
        />

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Assigned Patients ({pagination.total})
              </h2>
              <p className="text-xs text-slate-500">
                Patients actively managed by or receiving consultation from {doctor.name}
              </p>
            </div>

            <SearchBar
              placeholder="Search assigned patients..."
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
            />
          </div>

          <DoctorPatientList
            patients={patients}
            isLoading={isLoadingPatients}
            onDeletePatient={(p) => setPatientToDelete(p)}
          />

          <Pagination
            pagination={pagination}
            onPageChange={(newPage) => setPagination((prev) => ({ ...prev, page: newPage }))}
            onLimitChange={(newLimit) => setPagination((prev) => ({ ...prev, limit: newLimit, page: 1 }))}
          />
        </div>
      </div>

      <AddPatientUnderDoctorModal
        doctorId={doctor._id}
        doctorName={doctor.name}
        isOpen={isAddPatientModalOpen}
        onClose={() => setIsAddPatientModalOpen(false)}
        onSuccess={() => {
          fetchPatients();
          fetchDoctor();
        }}
      />

      <ConfirmDialog
        isOpen={!!patientToDelete}
        title="Remove Patient"
        message={`Are you sure you want to delete patient "${patientToDelete?.name}" from this doctor's patient list?`}
        confirmLabel="Remove Patient"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeletePatientConfirm}
        onCancel={() => setPatientToDelete(null)}
      />
    </DashboardLayout>
  );
}
