import type { ApiResponse, DashboardAnalytics, Doctor, Patient } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private getHeaders(): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      ...this.getHeaders(),
      ...(options.headers || {}),
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 && typeof window !== 'undefined') {
          if (!endpoint.includes('/auth/login')) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (window.location.pathname !== '/login') {
              window.location.href = '/login';
            }
          }
        }

        const errorMessage =
          data?.error?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      return data as ApiResponse<T>;
    } catch (error: any) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected network error occurred.');
    }
  }

  async login(credentials: { email: string; password: string }) {
    return this.request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async getDoctors(params: Record<string, string | number | undefined> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== 'all') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<Doctor[]>(`/doctors${queryString}`);
  }

  async getDoctor(id: string) {
    return this.request<Doctor>(`/doctors/${id}`);
  }

  async createDoctor(data: Partial<Doctor>) {
    return this.request<Doctor>('/doctors', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDoctor(id: string) {
    return this.request<{ message: string }>(`/doctors/${id}`, {
      method: 'DELETE',
    });
  }

  async getDoctorPatients(
    doctorId: string,
    params: Record<string, string | number | undefined> = {}
  ) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<Patient[]>(`/doctors/${doctorId}/patients${queryString}`);
  }

  async addPatientUnderDoctor(doctorId: string, patientData: any) {
    return this.request<Patient>(`/doctors/${doctorId}/patients`, {
      method: 'POST',
      body: JSON.stringify(patientData),
    });
  }

  async deletePatientFromDoctor(doctorId: string, patientId: string) {
    return this.request<{ message: string }>(`/doctors/${doctorId}/patients/${patientId}`, {
      method: 'DELETE',
    });
  }

  async getPatients(params: Record<string, string | number | undefined> = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== '' && val !== 'all') {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<Patient[]>(`/patients${queryString}`);
  }

  async getPatient(id: string) {
    return this.request<Patient>(`/patients/${id}`);
  }

  async createPatient(data: any) {
    return this.request<Patient>('/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePatient(id: string, data: any) {
    return this.request<Patient>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePatient(id: string) {
    return this.request<{ message: string }>(`/patients/${id}`, {
      method: 'DELETE',
    });
  }

  async getDashboardAnalytics() {
    return this.request<DashboardAnalytics>('/analytics/dashboard');
  }
}

export const api = new ApiClient();
