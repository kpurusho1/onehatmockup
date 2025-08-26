import axios from 'axios';
import {
  StartRecordingResponse,
  StopRecordingResponse,
  UploadChunkResponse,
  SubmitRecordingResponse,
  PollSubmissionResponse,
  SaveTranscriptionResponse,
  ErrorResponse,
  GenericResponse,
  FetchAndSaveResponse
} from '../types/api';

const BASE_URL = 'https://vhrbackend1-staging.up.railway.app';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Set auth token for all requests
export const setAuthToken = (token: string) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Pradhi API service
export const pradhiApi = {
  // Start a new recording session
  startRecording: async (doctorId: string, patientId?: string): Promise<StartRecordingResponse> => {
    try {
      const params: Record<string, string> = { doctor_id: doctorId };
      if (patientId) {
        params.patient_id = patientId;
      }
      
      const response = await apiClient.post('/pradhi/recording/start', {}, {
        params
      });
      return response.data as StartRecordingResponse;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  },

  // Upload audio chunk during recording
  uploadChunk: async (correlationId: string, audioData: string, chunkNumber: number, doctorId: string): Promise<UploadChunkResponse> => {
    try {
      const response = await apiClient.post('/pradhi/recording/chunk', {
        correlation_id: correlationId,
        audio_data: audioData,
        chunk_number: chunkNumber,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as UploadChunkResponse;
    } catch (error) {
      console.error('Error uploading chunk:', error);
      throw error;
    }
  },

  // Stop recording session
  stopRecording: async (correlationId: string, doctorId: string): Promise<StopRecordingResponse> => {
    try {
      const response = await apiClient.post('/pradhi/recording/stop', {
        correlation_id: correlationId,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as StopRecordingResponse;
    } catch (error) {
      console.error('Error stopping recording:', error);
      throw error;
    }
  },

  // Submit recording with patient details
  submitRecording: async (correlationId: string, patientId: string, doctorId: string): Promise<SubmitRecordingResponse> => {
    try {
      // The endpoint is /pradhi/recording/submit according to the API docs
      const response = await apiClient.post('/pradhi/recording/submit', {
        correlation_id: correlationId,
        patient_id: patientId,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as SubmitRecordingResponse;
    } catch (error) {
      console.error('Error submitting recording:', error);
      throw error;
    }
  },
  
  // Submit recording with new patient details
  submitRecordingWithNewPatient: async (correlationId: string, patientName: string, patientPhone: string, doctorId: string): Promise<SubmitRecordingResponse> => {
    try {
      const response = await apiClient.post('/pradhi/recording/submit-new-patient', {
        correlation_id: correlationId,
        patient_name: patientName,
        patient_phone: patientPhone,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as SubmitRecordingResponse;
    } catch (error) {
      console.error('Error submitting recording with new patient:', error);
      throw error;
    }
  },

  // Poll for submission results
  pollSubmission: async (submissionId: string, doctorId: string): Promise<PollSubmissionResponse> => {
    try {
      const response = await apiClient.post('/pradhi/submission/poll-by-id', {
        submission_id: submissionId,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as PollSubmissionResponse;
    } catch (error) {
      console.error('Error polling submission:', error);
      throw error;
    }
  },

  // Fetch and save submission to database
  fetchAndSaveSubmission: async (submissionId: string, doctorId: string): Promise<FetchAndSaveResponse> => {
    try {
      const response = await apiClient.post('/pradhi/submission/fetch-and-save', {
        submission_id: submissionId,
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as FetchAndSaveResponse;
    } catch (error) {
      console.error('Error fetching and saving submission:', error);
      throw error;
    }
  },
  
  // Get available transcription segments for a consultation
  getTranscriptionSegments: async (consultationId: string, doctorId: string): Promise<{ success: boolean; segments: any[] }> => {
    try {
      const response = await apiClient.get(`/consultations/${consultationId}/segments`, {
        params: { doctor_id: doctorId }
      });
      return response.data as { success: boolean; segments: any[] };
    } catch (error) {
      console.error(`Error fetching transcription segments for consultation ${consultationId}:`, error);
      throw error;
    }
  },
  
  // Update a transcription segment
  updateTranscriptionSegment: async (consultationId: string, segmentId: string, editedContent: string, doctorId: string): Promise<GenericResponse> => {
    try {
      const response = await apiClient.put(`/consultations/${consultationId}/segments/${segmentId}`, {
        edited_content: editedContent
      }, {
        params: { doctor_id: doctorId }
      });
      return response.data as GenericResponse;
    } catch (error) {
      console.error(`Error updating transcription segment ${segmentId}:`, error);
      throw error;
    }
  },
};

export default pradhiApi;
