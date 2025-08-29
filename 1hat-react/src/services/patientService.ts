import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Patient {
  id: string;
  full_name: string;
  phone_number: string;
  email?: string;
  onehat_patient_id: number;
  has_consultations: boolean;
  created_at: string;
  last_consultation_date?: string;
  number_of_records: number;
  number_of_dispatches: number;
  pending_records: number;
  dispatched_records: number;
  // Legacy fields for backward compatibility
  total_consultations?: number;
  unsent_records_count?: number;
}

export interface PaginatedResponse<T> {
  patients: T[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface DashboardPatientsResponse {
  patients: Patient[];
  total_count: number;
  page: number;
  page_size: number;
}

/**
 * Get patients for a doctor with pagination (JWT-secured)
 * @param page Page number (1-based)
 * @param pageSize Number of patients per page
 * @returns Promise with paginated patient list
 */
const getPatients = async (page: number = 1, pageSize: number = 10): Promise<{
  patients: Patient[];
  total: number;
  page: number;
  pageSize: number;
}> => {
  // JWT token in Authorization header provides doctor authentication
  // No need to pass doctorId explicitly - backend extracts from JWT
  
  const response = await apiClient.get<{
    patients: Patient[];
    total_count: number;
    page: number;
    page_size: number;
  }>('/patients/list/jwt', {
    params: {
      page,
      page_size: pageSize
    }
  });

  return {
    patients: response.data.patients,
    total: response.data.total_count, // Updated field name from JWT endpoint
    page: response.data.page,
    pageSize: response.data.page_size
  };
};

/**
 * Get all patients for a doctor (for frontend caching) - JWT-secured
 * @returns Promise with all patients
 */
const getAllPatients = async (): Promise<Patient[]> => {
  // JWT token in Authorization header provides doctor authentication
  // No need to pass doctorId explicitly - backend extracts from JWT
  
  const response = await apiClient.get<PaginatedResponse<Patient>>('/patients/list/jwt', {
    params: {
      page: 1,
      page_size: 1000 // Large page size to get all patients
    }
  });

  return response.data.patients;
};

/**
 * PatientService handles all patient-related API calls
 */
const PatientService = {
  getPatients,
  getAllPatients,

  /**
   * Get detailed patient information with consultation history
   * @param patientId Patient ID
   * @returns Promise with patient details and consultation history
   */
  getPatientDetail: async (patientId: string): Promise<{
    patient: {
      id: string;
      onehat_patient_id: number;
      full_name: string;
      phone_number?: string;
      age?: number;
      last_consultation?: string;
      unsent_records_count: number;
      total_consultations: number;
    };
    consultation_history: Array<{
      id: string;
      consultation_time: string;
      segments_count: number;
      verified_segments: number;
      sent_segments: number;
      record_status: string;
    }>;
  }> => {
    // Service role backend requires explicit doctor_id parameter
    const doctorId = await AsyncStorage.getItem('doctorId');
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }
    
    const response = await apiClient.get(`/patients/${patientId}`, {
      params: { doctor_id: doctorId }
    });
    return response.data;
  },

  /**
   * Get detailed consultation with segments
   * @param consultationId Consultation ID
   * @returns Promise with consultation details and segments
   */
  getConsultationDetail: async (consultationId: string): Promise<{
    consultation_id: string;
    patient_id: string;
    doctor_id: string;
    doctor_name: string;
    patient_name: string;
    consultation_time: string;
    segments: Array<{
      id: string;
      segment_type: string;
      original_content: string;
      edited_content: string;
      sent_count: number;
      edit_count: number;
    }>;
    pradhi_submission_id?: string;
  }> => {
    // Service role backend requires explicit doctor_id parameter
    const doctorId = await AsyncStorage.getItem('doctorId');
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }
    
    const response = await apiClient.get(`/medical-records/consultations/${consultationId}`, {
      params: { doctor_id: doctorId }
    });
    return response.data;
  },



  /**
   * Create a new patient
   * @param patientData Patient creation data
   * @returns Promise with creation response
   */
  createPatient: async (patientData: {
    name: string;
    mobile_number: string;
    date_of_birth: string; // DD/MM/YYYY format
    gender: string; // Male or Female
    age?: number; // Auto-calculated from DOB
    hospital_id?: number; // Will be set from session/backend
  }): Promise<{
    success: boolean;
    message: string;
    patient_id?: string;
    onehat_patient_id?: string;
  }> => {
    const doctorId = await AsyncStorage.getItem('doctorId');
    
    console.log('🔍 PatientService: Retrieved doctor ID from AsyncStorage:', doctorId);
    
    if (!doctorId) {
      throw new Error('No doctor ID available');
    }

    console.log('📤 PatientService: Making request to /patients/create with doctor_id:', doctorId);
    console.log('📤 PatientService: Payload:', patientData);

    const response = await apiClient.post('/patients/create', patientData, {
      params: {
        doctor_id: doctorId
      }
    });
    
    return response.data;
  },


  /**
   * Get patients for dashboard (last N days)
   * @param lastDays Number of days to look back
   * @returns Promise with patients data
   */
  getDashboardPatients: async (lastDays: number = 2): Promise<DashboardPatientsResponse> => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }
      
      const response = await apiClient.get(`/patients/list/jwt?doctor_id=${doctorId}&last_days=${lastDays}&page_size=50`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard patients:', error);
      throw error;
    }
  },

  /**
   * Search patients
   * @param searchTerm Search term
   * @returns Promise with search results
   */
  searchPatients: async (searchTerm: string): Promise<{
    patients: Patient[];
    total_count: number;
    page: number;
    page_size: number;
  }> => {
    try {
      // Service role backend requires explicit doctor_id parameter
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }
      
      const response = await apiClient.get(`/patients/list/jwt`, {
        params: {
          doctor_id: doctorId,
          search: searchTerm,
          page_size: 20
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching patients:', error);
      throw error;
    }
  }
};

export default PatientService;
