import apiClient from './apiClient';
import StorageUtil, { STORAGE_KEYS } from '../utils/storageUtil';

export interface HospitalSettings {
  id: string;
  name: string;
  pharmacy_contact?: string;
  default_segments?: {
    // New comprehensive segment types
    patientDetails: boolean;
    hospitalDetails: boolean;
    chiefComplaints: boolean;
    associatedSymptoms: boolean;
    presentIllness: boolean;
    pastMedicalHistory: boolean;
    doctorsObservations: boolean;
    preliminaryAssessment: boolean;
    treatmentPlan: boolean;
    prescriptionData: boolean;
    nextSteps: boolean;
    referralDetails: boolean;
    doctorsNotes: boolean;
    // Legacy fields for backward compatibility
    prescription: boolean;
    diagnosis: boolean;
    summary: boolean;
    followUp: boolean;
  };
}

export interface OneHatSyncResult {
  success: boolean;
  message: string;
  total_onehat_patients?: number;
  new_patients?: number;
  updated_patients?: number;
  errors?: string[];
}

interface PreferencesResponse {
  default_dispatch_sections?: string[] | Record<string, boolean>;
  [key: string]: unknown;
}

interface ProfileResponse {
  name?: string;
  specialty?: string;
  hospital?: string;
  [key: string]: unknown;
}

interface PharmacyWhatsAppResponse {
  hospital_pharmacy_whatsapp?: string;
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

/**
 * SettingsService handles settings and configuration API calls
 */
const SettingsService = {
  /**
   * Get hospital settings
   * @returns Promise with hospital settings
   */
  getHospitalSettings: async (): Promise<HospitalSettings> => {
    try {
      // Service role backend requires explicit doctor_id parameter
      const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      // Get segment preferences from service role backend
      const preferencesResponse = await apiClient.get('/settings/preferences', {
        params: { doctor_id: doctorId }
      });
      const backendResponse = preferencesResponse.data as PreferencesResponse || {};
      
      // Extract the actual array from the backend response
      const defaultSegments = backendResponse.default_dispatch_sections || [];
      
      // Debug logging to see what backend is returning
      console.log('🔍 Backend response for segment preferences:', backendResponse);
      console.log('🔍 Extracted segments array:', defaultSegments);
      console.log('🔍 Type of segments:', typeof defaultSegments);
      console.log('🔍 Is array?', Array.isArray(defaultSegments));
      
      // Handle both array and object responses from backend
      let segmentObject;
      
      if (Array.isArray(defaultSegments)) {
        // Backend returned array of segment names - convert to object format
        segmentObject = {
          patientDetails: defaultSegments.includes('Patient Details'),
          hospitalDetails: defaultSegments.includes('Hospital/Doctor Details'),
          chiefComplaints: defaultSegments.includes('Key Facts'), // Fixed: Use "Key Facts" instead of "Chief Complaint(s)"
          associatedSymptoms: defaultSegments.includes('Associated Symptoms'),
          presentIllness: defaultSegments.includes('Present Illness Information'),
          pastMedicalHistory: defaultSegments.includes('Past Medical History'),
          doctorsObservations: defaultSegments.includes('Doctor\'s Observations'),
          preliminaryAssessment: defaultSegments.includes('Preliminary Assessment'),
          treatmentPlan: defaultSegments.includes('Treatment Plan'),
          prescriptionData: defaultSegments.includes('Prescription Data'),
          nextSteps: defaultSegments.includes('Next Steps'),
          referralDetails: defaultSegments.includes('Referral Details'),
          doctorsNotes: defaultSegments.includes('Doctor\'s Notes'),
          // Legacy fields for backward compatibility
          prescription: defaultSegments.includes('Prescription Data'),
          diagnosis: defaultSegments.includes('Preliminary Assessment'),
          summary: defaultSegments.includes('Doctor\'s Notes'),
          followUp: defaultSegments.includes('Next Steps')
        };
      } else if (typeof defaultSegments === 'object' && defaultSegments !== null) {
        // Backend returned object format - use directly
        segmentObject = {
          patientDetails: defaultSegments.patientDetails || false,
          hospitalDetails: defaultSegments.hospitalDetails || false,
          chiefComplaints: defaultSegments.chiefComplaints || false,
          associatedSymptoms: defaultSegments.associatedSymptoms || false,
          presentIllness: defaultSegments.presentIllness || false,
          pastMedicalHistory: defaultSegments.pastMedicalHistory || false,
          doctorsObservations: defaultSegments.doctorsObservations || false,
          preliminaryAssessment: defaultSegments.preliminaryAssessment || false,
          treatmentPlan: defaultSegments.treatmentPlan || false,
          prescriptionData: defaultSegments.prescriptionData || false,
          nextSteps: defaultSegments.nextSteps || false,
          referralDetails: defaultSegments.referralDetails || false,
          doctorsNotes: defaultSegments.doctorsNotes || false,
          // Legacy fields for backward compatibility
          prescription: defaultSegments.prescription || false,
          diagnosis: defaultSegments.diagnosis || false,
          summary: defaultSegments.summary || false,
          followUp: defaultSegments.followUp || false
        };
      } else {
        // Backend returned unexpected format - use empty state
        segmentObject = {
          patientDetails: false,
          hospitalDetails: false,
          chiefComplaints: false,
          associatedSymptoms: false,
          presentIllness: false,
          pastMedicalHistory: false,
          doctorsObservations: false,
          preliminaryAssessment: false,
          treatmentPlan: false,
          prescriptionData: false,
          nextSteps: false,
          referralDetails: false,
          doctorsNotes: false,
          // Legacy fields
          prescription: false,
          diagnosis: false,
          summary: false,
          followUp: false
        };
      }
      
      // Get hospital name from storage (set during login)
      const hospitalName = await StorageUtil.getSecureItem(STORAGE_KEYS.HOSPITAL_NAME) || 'Hospital Name Not Available';
      
      return {
        id: String(doctorId || 'unknown'),
        name: hospitalName,
        pharmacy_contact: '+1 (555) 999-PHARM', // Default value
        default_segments: segmentObject
      };
    } catch (error) {
      console.error('Error fetching hospital settings:', error);
      // Return empty segment state on error - let Settings component show only saved preferences
      const hospitalName = await StorageUtil.getSecureItem(STORAGE_KEYS.HOSPITAL_NAME) || 'Hospital Name Not Available';
      const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
      return {
        id: String(doctorId || ''),
        name: hospitalName,
        pharmacy_contact: '+1 (555) 999-PHARM', // Default value
        default_segments: {
          patientDetails: false,
          hospitalDetails: false,
          chiefComplaints: false,
          associatedSymptoms: false,
          presentIllness: false,
          pastMedicalHistory: false,
          doctorsObservations: false,
          preliminaryAssessment: false,
          treatmentPlan: false,
          prescriptionData: false,
          nextSteps: false,
          referralDetails: false,
          doctorsNotes: false,
          // Legacy fields
          prescription: false,
          diagnosis: false,
          summary: false,
          followUp: false
        }
      };
    }
  },

  /**
   * Update hospital settings
   * @param settings Updated settings
   * @returns Promise with updated settings
   */
  updateHospitalSettings: async (settings: Partial<HospitalSettings>): Promise<HospitalSettings> => {
    // JWT token in Authorization header provides doctor authentication
    // No need to pass doctorId explicitly - backend extracts from JWT

    try {
      // Convert segment object back to array format for backend
      const segmentArray: string[] = [];
      const segments = settings.default_segments;
      
      if (segments) {
        // Add segments that are enabled
        if (segments.patientDetails) segmentArray.push('Patient Details');
        if (segments.hospitalDetails) segmentArray.push('Hospital/Doctor Details');
        if (segments.chiefComplaints) segmentArray.push('Key Facts'); // Fixed: Store "Key Facts" instead of "Chief Complaint(s)"
        if (segments.associatedSymptoms) segmentArray.push('Associated Symptoms');
        if (segments.presentIllness) segmentArray.push('Present Illness Information');
        if (segments.pastMedicalHistory) segmentArray.push('Past Medical History');
        if (segments.doctorsObservations) segmentArray.push('Doctor\'s Observations');
        if (segments.preliminaryAssessment) segmentArray.push('Preliminary Assessment');
        if (segments.treatmentPlan) segmentArray.push('Treatment Plan');
        if (segments.prescriptionData) segmentArray.push('Prescription Data');
        if (segments.nextSteps) segmentArray.push('Next Steps');
        if (segments.referralDetails) segmentArray.push('Referral Details');
        if (segments.doctorsNotes) segmentArray.push('Doctor\'s Notes');
      }

      // Get doctor ID from storage for the request
      const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      // Save preferences to JWT-secured backend with correct format
      await apiClient.post('/settings/preferences', {
        doctor_id: doctorId,
        default_dispatch_sections: segmentArray
      });
      
      console.log('Hospital settings updated successfully');
      
      // Get current settings and merge with updates
      const currentSettings = await SettingsService.getHospitalSettings();
      return { ...currentSettings, ...settings };
    } catch (error) {
      console.error('Error updating hospital settings:', error);
      throw error;
    }
  },

  /**
   * Sync patients from OneHat
   * @returns Promise with sync result
   */
  syncPatientsFromOneHat: async (): Promise<OneHatSyncResult> => {
    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    
    if (!doctorId) {
      throw new Error('No doctor ID available for OneHat sync');
    }

    try {
      const response = await apiClient.post<OneHatSyncResult>(`/patients/1hatsync`, {
        doctor_id: doctorId
      });
      
      return response.data;
    } catch (error) {
      console.error('Error syncing patients from OneHat:', error);
      const err = error as { response?: { data?: { detail?: string } }, message?: string };
      return {
        success: false,
        message: err.response?.data?.detail || err.message || 'Sync failed'
      };
    }
  },

  /**
   * Get doctor profile information
   * @returns Promise with doctor profile
   */
  getDoctorProfile: async () => {
    // Service role backend requires explicit doctor_id parameter
    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }

    const response = await apiClient.get<ProfileResponse>('/settings/doctor-profile', {
      params: { doctor_id: doctorId }
    });
    
    return response.data;
  },

  /**
   * Get hospital pharmacy WhatsApp number
   * @returns Promise with pharmacy WhatsApp number
   */
  getHospitalPharmacyWhatsApp: async () => {
    // Service role backend requires explicit doctor_id parameter
    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }

    const response = await apiClient.get<PharmacyWhatsAppResponse>('/settings/pharmacy-whatsapp', {
      params: { doctor_id: doctorId }
    });
    
    return response.data;
  },

  /**
   * Save hospital pharmacy WhatsApp number
   * @param whatsappNumber - The pharmacy WhatsApp number
   * @returns Promise with save result
   */
  saveHospitalPharmacyWhatsApp: async (whatsappNumber: string) => {
    // JWT token in Authorization header provides doctor authentication
    // No need to pass doctorId explicitly - backend extracts from JWT

    const doctorId = await StorageUtil.getSecureItem(STORAGE_KEYS.DOCTOR_ID);
    if (!doctorId) {
      throw new Error('Doctor ID not found in session');
    }

    const response = await apiClient.post<PharmacyWhatsAppResponse>('/settings/pharmacy-whatsapp', {
      doctor_id: doctorId,
      hospital_pharmacy_whatsapp: whatsappNumber
    });
    
    return response.data;
  }
};

export default SettingsService;
