import apiClient from './apiClient';
import StorageUtil, { STORAGE_KEYS } from '../utils/storageUtil';

interface getDetailedStatsResponse {
  stats: {
    [key: string]: number;
  };
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  gender?: string;
  phone?: string;
  last_consultation_date?: string;
  [key: string]: unknown;
}

export interface DashboardSummary {
  todayAppointments: number;
  pendingRecordings: number;
  completedRecordings: number;
  totalPatients: number;
}

export interface DashboardStats {
  // Daily stats
  todays_consultations?: number;
  sent_records_today?: number;
  unsent_records_today?: number;
  new_patients_today?: number;
  
  // Weekly stats
  total_consultations_week?: number;
  sent_records_week?: number;
  unsent_records_week?: number;
  new_patients_week?: number;
  week_start?: string;
  week_end?: string;
  
  // Common fields
  total_patients: number;
  period: 'daily' | 'weekly';
  last_updated: string;
}

export interface NewPatient {
  patient_id: string;
  full_name: string;
  phone_number?: string;
  onehat_patient_id?: number;
  relation_created_at: string;
  relation_updated_at: string;
  total_consultations: number;
  last_consultation_date?: string;
}

export interface NewPatientsResponse {
  patients: NewPatient[];
  total_count: number;
  period_days: number;
  last_updated: string;
}


/**
 * DashboardService handles API calls related to the dashboard screen
 */
const DashboardService = {
  /**
   * Get detailed dashboard statistics with period support
   * @param period - 'daily' or 'weekly' stats period
   * @returns Promise with detailed dashboard statistics
   */
  getDetailedStats: async (period: 'daily' | 'weekly' = 'weekly'): Promise<DashboardStats> => {
    // JWT token in Authorization header provides doctor authentication
    // No need to pass doctorId explicitly - backend extracts from JWT
    
    try {
      const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }
      
      const response = await apiClient.get<DashboardStats>('/dashboard/stats', {
        params: { 
          doctor_id: doctorId,
          period: period
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed dashboard stats:', error);
      // Return fallback stats if API fails
      return {
        total_patients: 0,
        period: period,
        last_updated: new Date().toISOString(),
        ...(period === 'daily' ? {
          todays_consultations: 0,
          sent_records_today: 0,
          unsent_records_today: 0,
          new_patients_today: 0
        } : {
          total_consultations_week: 0,
          sent_records_week: 0,
          unsent_records_week: 0,
          new_patients_week: 0,
          week_start: new Date().toISOString(),
          week_end: new Date().toISOString()
        })
      };
    }
  },


  /**
   * Get new patients based on doctor_patient_relations.updated_at timestamp
   * @param days Number of days to look back (default 2)
   * @param limit Maximum number of patients to return (default 20)
   * @returns Promise with new patients response
   */
  getNewPatients: async (days = 2, limit = 20): Promise<NewPatientsResponse> => {
    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    console.log('Doctor ID:', doctorId);
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }
    
    try {
      const response = await apiClient.get<NewPatientsResponse>('/dashboard/patients/new', {
        params: { 
          doctor_id: doctorId,
          days: days,
          limit: limit
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new patients:', error);
      // Return empty response if API fails
      return {
        patients: [],
        total_count: 0,
        period_days: days,
        last_updated: new Date().toISOString()
      };
    }
  }
};

export default DashboardService;
