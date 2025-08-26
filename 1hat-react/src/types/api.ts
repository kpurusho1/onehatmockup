// API Response Types for VHR Backend API

// Generic Response
export interface GenericResponse {
  success: boolean;
  message?: string;
}

// Fetch and Save Response
export interface FetchAndSaveResponse extends GenericResponse {
  consultation_id?: string;
  submission_id?: string;
  segments_count?: number;
  data?: {
    consultation_id: string;
    submission_id: string;
    segments_count: number;
  };
}

// Authentication
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  hospital_id?: string;
  onehat_doctor_id?: number;
  specialty?: string;
}

// Original AuthResponse interface for client-side use
export interface AuthResponse {
  success: boolean;
  token: string;
  refresh_token?: string;
  user: User | null;
  error?: string;
}

// Backend API login response format
export interface BackendAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  doctor_id: string;
  doctor_name: string;
  hospital_name: string;
  specialty: string;
  onehat_doctor_id: number;
}

// Token refresh response
export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// Recording Session
export interface StartRecordingResponse {
  correlation_id: string;
  config: {
    recording_url: string;
    recording_token: string;
    max_duration_seconds: number;
  };
}

export interface StopRecordingResponse {
  submission_id: string;
  status: string;
}

export interface UploadChunkResponse {
  success: boolean;
  message?: string;
  chunk_count?: number;
}

export interface SubmitRecordingResponse {
  success: boolean;
  submission_id: string;
  message?: string;
}

// Transcription
export interface TranscriptionStatusResponse {
  status: string;
  progress: number;
  estimated_completion_time: number;
}

export interface PollSubmissionResponse {
  success: boolean;
  status?: string;
  transcription?: any;
  data?: any;
  message?: string;
}

export interface TranscriptionSegment {
  id: string;
  title?: string;
  content?: any;
  original_content?: any;
  edited_content?: string;
  is_verified: boolean;
  sent_count: number;
  edit_count: number;
  ordinal: number;
}

export interface SaveTranscriptionResponse {
  consultation_id: string;
  segments_count: number;
  segments: string[];
}

// Patient Data
export interface Patient {
  id: string;
  onehat_patient_id: number;
  full_name: string;
  phone_number: string;
  last_consultation?: string;
  unsent_records_count?: number;
  total_consultations?: number;
  pending_records?: number;
  dispatched_records?: number;
  has_pending_consultations?: boolean;
}

export interface PatientsResponse {
  patients: Patient[];
  total_count: number;
  page: number;
  page_size: number;
  total_pages?: number;
  search?: string;
}

// Error Response
export interface ErrorResponse {
  detail: string;
  status_code: number;
}

// Hospital Data
export interface Hospital {
  id: string | number;
  name: string;
}

export interface HospitalsResponse {
  success?: boolean;
  hospitals: Hospital[];
  total_count: number;
}

// Consultation Data
export interface Consultation {
  id: string;
  patient_id: string;
  patient_name: string;
  doctor_name?: string;
  consultation_time: string;
  segments?: TranscriptionSegment[];
  segments_count?: number;
  verified_count?: number;
  sent_count?: number;
  pradhi_submission_id?: string;
}

export interface ConsultationsResponse {
  consultations: Consultation[];
}

// Dispatch Data
export interface DispatchMethod {
  id: string;
  name: string;
  description: string;
  requires_phone: boolean;
  requires_email: boolean;
}

export interface DispatchResponse {
  consultation_id: string;
  total_methods_attempted: number;
  successful_methods: string[];
  failed_methods: string[];
  skipped_methods: Record<string, string>;
  method_results: {
    method: string;
    status: string;
    details: any;
  }[];
  dispatches: {
    dispatch_id: string;
    consultation_id: string;
    dispatch_method: string;
    segments_count: number;
    pdf_url?: string;
    status: string;
    sent_at: string;
  }[];
}

// Dashboard Data
export interface DashboardSummary {
  summary: {
    period: string;
    total_patients_viewed: number;
    total_records_generated: number;
    total_records_sent: number;
    last_updated: string;
  };
  recent_activities: {
    patient_name: string;
    consultation_time: string;
    record_status: string;
    segments_count: number;
  }[];
}
