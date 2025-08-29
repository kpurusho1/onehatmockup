import apiClient from './apiClient';
import StorageUtil, { STORAGE_KEYS } from '../utils/storageUtil';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions for API error responses
interface ApiErrorResponse {
  data?: {
    detail?: string;
    message?: string;
  };
}

interface ApiError {
  response?: ApiErrorResponse;
}

/**
 * DispatchService handles dispatch of medical records and prescriptions
 * Updated to support new Send Record functionality
 */
const DispatchService = {
  /**
   * Send prescription screenshot to hospital pharmacy WhatsApp
   * @param consultationId - The consultation ID
   * @param patientName - Patient name
   * @param doctorName - Doctor name
   * @returns Promise with dispatch result
   */
  sendPrescriptionToPharmacy: async (
    consultationId: string,
    patientName: string,
    doctorName: string
  ): Promise<{
    status: string;
    message: string;
    consultation_id: string;
    pharmacy_whatsapp: string;
    patient_name: string;
    doctor_name: string;
    message_id: string;
    sent_at: string;
  }> => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      const response = await apiClient.post('/dispatch/prescription-to-pharmacy', {
        consultation_id: consultationId,
        doctor_id: doctorId,
        patient_name: patientName,
        doctor_name: doctorName
      });

      console.log('✅ Prescription sent to pharmacy successfully');
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Error sending prescription to pharmacy:', error);
      
      // Extract error message from response
      const errorMessage = 
        error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null && 'response' in error ? 
          (error as ApiError).response?.data?.detail || 
          (error as ApiError).response?.data?.message : 
        'Failed to send prescription to pharmacy';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Send record to patient using all available methods (OneHat PDF, Digital Prescription, WhatsApp)
   * @param consultationId - The consultation ID
   * @param segmentIds - Array of segment IDs to send
   * @returns Promise with detailed dispatch results
   */
  sendRecordToPatient: async (
    consultationId: string,
    segmentIds: string[]
  ): Promise<{
    consultation_id: string;
    total_methods_attempted: number;
    successful_methods: string[];
    failed_methods: string[];
    skipped_methods: Record<string, string>;
    method_results: Array<{
      method: string;
      success: boolean;
      error?: string;
      dispatch_id?: string;
    }>;
    dispatches: Array<{
      dispatch_id: string;
      consultation_id: string;
      dispatch_method: string;
      segments_count: number;
      pdf_url?: string;
      status: string;
      sent_at: string;
    }>;
  }> => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      console.log('🚀 Sending record to patient via all methods...', {
        consultationId,
        segmentIds: segmentIds.length,
        doctorId
      });

      const response = await apiClient.post('/dispatch/send-record', {
        consultation_id: consultationId,
        segment_ids: segmentIds,
        dispatch_methods: ['1hat_app_pdf', 'digital_prescription', 'whatsapp_patient'],
        current_doctor_id: doctorId
      });

      console.log('✅ Record sent to patient successfully:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Error sending record to patient:', error);
      
      // Extract error message from response
      const errorMessage = 
        error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null && 'response' in error ? 
          (error as ApiError).response?.data?.detail || 
          (error as ApiError).response?.data?.message : 
        'Failed to send record to patient';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Send record using advanced dispatch options
   * @param consultationId - The consultation ID
   * @param segmentIds - Array of segment IDs to send
   * @param dispatchMethod - Specific dispatch method to use
   * @param customPhoneNumber - Custom phone number for WhatsApp (optional)
   * @returns Promise with dispatch results
   */
  sendRecordAdvanced: async (
    consultationId: string,
    segmentIds: string[],
    dispatchMethod: string,
    customPhoneNumber?: string
  ): Promise<{
    consultation_id: string;
    total_methods_attempted: number;
    successful_methods: string[];
    failed_methods: string[];
    skipped_methods: Record<string, string>;
    method_results: Array<{
      method: string;
      success: boolean;
      error?: string;
      dispatch_id?: string;
    }>;
    dispatches: Array<{
      dispatch_id: string;
      consultation_id: string;
      dispatch_method: string;
      segments_count: number;
      pdf_url?: string;
      status: string;
      sent_at: string;
    }>;
  }> => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      console.log('🎯 Sending record via advanced method...', {
        consultationId,
        segmentIds: segmentIds.length,
        dispatchMethod,
        customPhoneNumber,
        doctorId
      });

      // Prepare dispatch payload
      const payload: {
        consultation_id: string;
        segment_ids: string[];
        dispatch_methods: string[];
        current_doctor_id: string;
        whatsapp_numbers?: string[];
      } = {
        consultation_id: consultationId,
        segment_ids: segmentIds,
        dispatch_methods: [dispatchMethod],
        current_doctor_id: doctorId
      };

      // Add custom phone number for WhatsApp methods
      if (dispatchMethod === 'whatsapp_custom' && customPhoneNumber) {
        payload.whatsapp_numbers = [customPhoneNumber];
      }

      const response = await apiClient.post('/dispatch/send', payload);

      console.log('✅ Advanced dispatch successful:', response.data);
      
      // Transform response to match expected format
      const dispatches = response.data || [] as Array<{
        dispatch_id: string;
        consultation_id: string;
        dispatch_method: string;
        segments_count: number;
        pdf_url?: string;
        status: string;
        sent_at: string;
      }>;
      return {
        consultation_id: consultationId,
        total_methods_attempted: 1,
        successful_methods: dispatches.length > 0 ? [dispatchMethod] : [],
        failed_methods: dispatches.length === 0 ? [dispatchMethod] : [],
        skipped_methods: {},
        method_results: [{
          method: dispatchMethod,
          success: dispatches.length > 0,
          dispatch_id: dispatches[0]?.dispatch_id
        }],
        dispatches: dispatches
      };
    } catch (error: unknown) {
      console.error('❌ Error in advanced dispatch:', error);
      
      const errorMessage = 
        error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null && 'response' in error ? 
          (error as ApiError).response?.data?.detail || 
          (error as ApiError).response?.data?.message : 
        'Failed to send record via advanced method';
      
      throw new Error(errorMessage);
    }
  },

  /**
   * Send digital prescription to OneHat patient app
   * @param consultationId - The consultation ID
   * @param onehatPatientId - OneHat patient ID
   * @returns Promise with dispatch result
   */
  sendDigitalPrescription: async (
    consultationId: string,
    onehatPatientId: number
  ): Promise<{
    consultation_id: string;
    patient_id: number;
    prescription_id: string;
    status: string;
    message: string;
    saved_at: string;
  }> => {
    try {
      const doctorId = await AsyncStorage.getItem('doctorId');
      if (!doctorId) {
        throw new Error('Doctor ID not found in session');
      }

      console.log('🔧 Sending digital prescription to OneHat...', {
        consultationId,
        onehatPatientId,
        doctorId
      });

      const response = await apiClient.post('/dispatch/digital-prescription', {
        consultation_id: consultationId,
        onehat_patient_id: onehatPatientId,
        doctor_id: doctorId
      });

      console.log('✅ Digital prescription sent successfully');
      return response.data;
    } catch (error: unknown) {
      console.error('❌ Error sending digital prescription:', error);
      
      // Extract error message from response
      const errorMessage = 
        error instanceof Error ? error.message : 
        typeof error === 'object' && error !== null && 'response' in error ? 
          (error as ApiError).response?.data?.detail || 
          (error as ApiError).response?.data?.message : 
        'Failed to send digital prescription';
      
      throw new Error(errorMessage);
    }
  }
};

export default DispatchService;
