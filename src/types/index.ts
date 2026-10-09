export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  createdAt?: string;
}

export interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  hospital: string;
  phone: string;
  email: string;
  patientCount: number;
  createdAt: string;
  updatedAt?: string;
}

export type PatientStatus = 'Active' | 'Discharged' | 'Under Observation' | 'Critical';
export type PatientGender = 'Male' | 'Female' | 'Other';

export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: PatientGender;
  phone: string;
  email?: string;
  condition: string;
  status: PatientStatus;
  admissionDate: string;
  doctor: string | {
    _id: string;
    name: string;
    specialization: string;
    hospital: string;
    phone?: string;
    email?: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  pagination?: PaginationInfo;
  error?: {
    message: string;
    details?: Array<{ field: string; message: string }> | string;
  };
}

export interface DashboardAnalytics {
  kpis: {
    totalDoctors: number;
    totalPatients: number;
    activePatients: number;
    criticalPatients: number;
    avgPatientsPerDoctor: number;
  };
  patientsPerDoctor: Array<{
    doctorId: string;
    doctorName: string;
    specialization: string;
    hospital: string;
    patientCount: number;
  }>;
  admissionsOverTime: Array<{
    date: string;
    admissions: number;
  }>;
  conditionBreakdown: Array<{
    condition: string;
    count: number;
    percentage: number;
  }>;
  statusBreakdown: Array<{
    status: string;
    count: number;
  }>;
}
