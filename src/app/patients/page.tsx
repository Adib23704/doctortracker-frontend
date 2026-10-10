'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { EditPatientModal } from '../../components/patients/EditPatientModal';
import { PatientFilterToolbar } from '../../components/patients/PatientFilterToolbar';
import { PatientTable } from '../../components/patients/PatientTable';
import { api } from '../../lib/api';
import type { Doctor, PaginationInfo, Patient } from '../../types';

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
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
  const [condition, setCondition] = useState('All');
  const [status, setStatus] = useState('All');
  const [doctorId, setDoctorId] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchConditions = useCallback(async () => {
    try {
      const res = await api.getConditions();
      setConditions(res.data);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    api
      .getDoctors({ limit: 100 })
      .then((res) => setDoctors(res.data))
      .catch(() => {});
    fetchConditions();
  }, [fetchConditions]);

  const fetchPatients = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.getPatients({
        page: pagination.page,
        limit: pagination.limit,
        search,
        condition: condition === 'All' ? undefined : condition,
        status: status === 'All' ? undefined : status,
        doctorId: doctorId === 'All' ? undefined : doctorId,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setPatients(res.data);
      if (res.pagination) {
        setPagination(res.pagination);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to load patients.');
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, search, condition, status, doctorId, startDate, endDate]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleResetFilters = () => {
    setSearch('');
    setCondition('All');
    setStatus('All');
    setDoctorId('All');
    setStartDate('');
    setEndDate('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    setIsDeleting(true);
    try {
      await api.deletePatient(patientToDelete._id);
      toast.success(`Patient ${patientToDelete.name} deleted successfully.`);
      setPatientToDelete(null);
      fetchPatients();
      fetchConditions();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete patient record.');
    } finally {
      setIsDeleting(false);
    }
  };

  const hasActiveFilters =
    Boolean(search) ||
    condition !== 'All' ||
    status !== 'All' ||
    doctorId !== 'All' ||
    Boolean(startDate) ||
    Boolean(endDate);

  return (
    <DashboardLayout
      title="Patient Records Management"
      subtitle="Dedicated directory for clinical patients, diagnosis tracking, and physician assignments"
    >
      <div className="space-y-5">
        <PatientFilterToolbar
          search={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          condition={condition}
          onConditionChange={(val) => {
            setCondition(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          conditions={conditions}
          status={status}
          onStatusChange={(val) => {
            setStatus(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          doctorId={doctorId}
          onDoctorChange={(val) => {
            setDoctorId(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          startDate={startDate}
          onStartDateChange={(val) => {
            setStartDate(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          endDate={endDate}
          onEndDateChange={(val) => {
            setEndDate(val);
            setPagination((prev) => ({ ...prev, page: 1 }));
          }}
          doctors={doctors}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <div className="space-y-0">
          <PatientTable
            patients={patients}
            isLoading={isLoading}
            onEditPatient={(p) => setPatientToEdit(p)}
            onDeletePatient={(p) => setPatientToDelete(p)}
          />
          <Pagination
            pagination={pagination}
            onPageChange={(p) => setPagination((prev) => ({ ...prev, page: p }))}
            onLimitChange={(l) => setPagination((prev) => ({ ...prev, limit: l, page: 1 }))}
          />
        </div>
      </div>

      <EditPatientModal
        patient={patientToEdit}
        isOpen={!!patientToEdit}
        onClose={() => setPatientToEdit(null)}
        onSuccess={() => {
          fetchPatients();
          fetchConditions();
        }}
      />

      <ConfirmDialog
        isOpen={!!patientToDelete}
        title="Delete Patient Record"
        message={`Are you sure you want to permanently delete patient "${patientToDelete?.name}"? This action cannot be undone.`}
        confirmLabel="Delete Record"
        isDestructive={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setPatientToDelete(null)}
      />
    </DashboardLayout>
  );
}
