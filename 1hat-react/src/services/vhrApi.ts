import axios from 'axios';
import { 
  PatientsResponse, 
  Patient,
  GenericResponse,
  ErrorResponse,
  Consultation,
  ConsultationsResponse,
  Hospital,
  HospitalsResponse,
  DispatchResponse
} from '../types/api';
import { setAuthToken } from './pradhiApi';

const BASE_URL = 'https://vhrbackend1-staging.up.railway.app';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// VHR API service for patient data, consultations, and other VHR-specific functionality
export const vhrApi = {
  // Get all patients with optional pagination and search
  getPatients: async (doctorId: string, page = 1, limit = 20, search = ''): Promise<PatientsResponse> => {
    try {
      const response = await apiClient.get('/patients', {
        params: { doctor_id: doctorId, page, limit, search }
      });
      return response.data as PatientsResponse;
    } catch (error) {
      console.error('Error fetching patients:', error);
      throw error;
    }
  },

  // Get patient by ID
  getPatientById: async (patientId: string, doctorId: string): Promise<{ success: boolean; patient: Patient }> => {
    try {
      const response = await apiClient.get(`/patients/${patientId}`, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; patient: Patient };
    } catch (error) {
      console.error(`Error fetching patient ${patientId}:`, error);
      throw error;
    }
  },

  // Create new patient
  createPatient: async (patientData: Partial<Patient>, doctorId: string): Promise<{ success: boolean; patient: Patient }> => {
    try {
      const response = await apiClient.post('/patients', patientData, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; patient: Patient };
    } catch (error) {
      console.error('Error creating patient:', error);
      throw error;
    }
  },

  // Update patient
  updatePatient: async (patientId: string, patientData: Partial<Patient>, doctorId: string): Promise<{ success: boolean; patient: Patient }> => {
    try {
      const response = await apiClient.put(`/patients/${patientId}`, patientData, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; patient: Patient };
    } catch (error) {
      console.error(`Error updating patient ${patientId}:`, error);
      throw error;
    }
  },

  // Get consultations for a patient
  getPatientConsultations: async (patientId: string, doctorId: string, page = 1, limit = 20): Promise<{ success: boolean; consultations: Consultation[]; total: number }> => {
    try {
      const response = await apiClient.get(`/patients/${patientId}/consultations`, {
        params: { doctor_id: doctorId, page, limit }
      });
      return response.data as { success: boolean; consultations: Consultation[]; total: number };
    } catch (error) {
      console.error(`Error fetching consultations for patient ${patientId}:`, error);
      throw error;
    }
  },

  // Get consultation by ID
  getConsultation: async (consultationId: string, doctorId: string): Promise<{ success: boolean; consultation: Consultation }> => {
    try {
      const response = await apiClient.get(`/consultations/${consultationId}`, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; consultation: Consultation };
    } catch (error) {
      console.error(`Error fetching consultation ${consultationId}:`, error);
      throw error;
    }
  },

  // Get dashboard summary
  getDashboardSummary: async (doctorId: string, period: 'daily' | 'weekly' = 'daily'): Promise<any> => {
    try {
      const response = await apiClient.get('/dashboard/summary', {
        params: { doctor_id: doctorId, period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      throw error;
    }
  },

  // Get dashboard statistics
  getDashboardStats: async (doctorId: string, period: 'daily' | 'weekly' = 'weekly'): Promise<any> => {
    try {
      const response = await apiClient.get('/dashboard/stats', {
        params: { doctor_id: doctorId, period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Get doctor profile
  getDoctorProfile: async (doctorId: string): Promise<{ success: boolean; doctor: any }> => {
    try {
      const response = await apiClient.get('/auth/profile', {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; doctor: any };
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
      throw error;
    }
  },

  // No update doctor profile endpoint in documentation
  // Keeping this method but updating the error message
  updateDoctorProfile: async (profileData: any, doctorId: string): Promise<{ success: boolean; doctor: any }> => {
    try {
      console.warn('updateDoctorProfile endpoint may not be supported in the current API version');
      const response = await apiClient.put('/auth/profile', profileData, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; doctor: any };
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      throw error;
    }
  },

  // Sync doctor with OneHat
  syncDoctorWithOneHat: async (onehatDoctorId: number): Promise<GenericResponse> => {
    try {
      const response = await apiClient.post(`/auth/sync-doctor/${onehatDoctorId}`, {});
      return response.data as GenericResponse;
    } catch (error) {
      console.error('Error syncing doctor with OneHat:', error);
      throw error;
    }
  },

  // Dispatch record via multiple channels
  dispatchConsultation: async (consultationId: string, segmentIds: string[], dispatchData: { 
    dispatch_methods: string[];
    whatsapp_numbers?: string[];
    email_addresses?: string[];
  }, doctorId: string): Promise<DispatchResponse> => {
    try {
      const payload = {
        consultation_id: consultationId,
        segment_ids: segmentIds,
        ...dispatchData,
        current_doctor_id: doctorId
      };
      
      const response = await apiClient.post(`/dispatch/send-record`, payload);
      return response.data as DispatchResponse;
    } catch (error) {
      console.error(`Error dispatching consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Send digital prescription
  sendDigitalPrescription: async (consultationId: string, onehatPatientId: number, doctorId: string): Promise<any> => {
    try {
      const response = await apiClient.post(`/dispatch/digital-prescription`, {
        consultation_id: consultationId,
        onehat_patient_id: onehatPatientId,
        doctor_id: doctorId
      });
      return response.data;
    } catch (error) {
      console.error(`Error sending digital prescription for consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Get dispatch history for a consultation
  getDispatchHistory: async (consultationId: string, doctorId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/dispatch/history/${consultationId}`, {
        params: { doctor_id: doctorId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error getting dispatch history for consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Generate PDF download URL
  generatePdfDownloadUrl: async (consultationId: string, doctorId: string): Promise<any> => {
    try {
      const response = await apiClient.get(`/dispatch/pdf/download-url/${consultationId}`, {
        params: { doctor_id: doctorId }
      });
      return response.data;
    } catch (error) {
      console.error(`Error generating PDF download URL for consultation ${consultationId}:`, error);
      throw error;
    }
  },

  // Get available dispatch methods
  getDispatchMethods: async (doctorId: string): Promise<{ success: boolean; methods: { id: string; name: string; description: string; requires_phone: boolean; requires_email: boolean }[] }> => {
    try {
      const response = await apiClient.get('/dispatch/methods', {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; methods: { id: string; name: string; description: string; requires_phone: boolean; requires_email: boolean }[] };
    } catch (error) {
      console.error('Error fetching dispatch methods:', error);
      throw error;
    }
  },

  // Get hospitals list
  getHospitals: async (): Promise<HospitalsResponse> => {
    try {
      const response = await apiClient.get('/hospitals');
      const data = response.data as any; // Type assertion to handle unknown data
      
      // Add success flag for backward compatibility
      const result: HospitalsResponse = {
        success: true,
        hospitals: data.hospitals || [],
        total_count: data.total_count || 0
      };
      
      return result;
    } catch (error) {
      console.error('Error fetching hospitals:', error);
      throw error;
    }
  },

};

// Set auth token for all requests
export const setVhrAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export default vhrApi;
