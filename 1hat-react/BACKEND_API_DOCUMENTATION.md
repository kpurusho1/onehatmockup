# VHR Backend API Documentation

## Overview
The VHR (Voice Health Record) Backend API is a comprehensive FastAPI-based system that handles medical transcription, record management, and multi-channel dispatch. The system integrates with external APIs including OneHat (1hat) for patient management and Pradhi for voice transcription.

## Base URL
- **Production**: `https://vhrbackend1-staging.up.railway.app`

## Authentication
The API uses JWT (JSON Web Token) authentication with Row Level Security (RLS) for data isolation between doctors.

### Important Note on Authentication Methods

While the API is designed with JWT authentication in mind, many endpoints require explicit `doctor_id` as a query parameter rather than extracting it from the JWT token. This is an intentional design choice to support:

1. **Service-to-service communication**: Allowing backend services to make requests on behalf of doctors
2. **Debugging and support**: Enabling admin users to access data for specific doctors
3. **Flexibility**: Supporting both JWT and explicit ID authentication methods

When implementing clients, always include the `doctor_id` parameter when specified in the endpoint documentation, even if a valid JWT token is provided.

### Headers Required
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## API Endpoints

## Response Model Field Name Clarifications

Some endpoints use different field names for the same concept in different parts of the response. Below are the key differences to be aware of:

### Dispatch Router
- In the `/dispatch/send-record` endpoint response, individual method results use `method` in the `method_results` array, while successful dispatches use `dispatch_method` in the `dispatches` array.

When implementing clients, be prepared to handle these field name variations.

## Service Role Client Usage

Many endpoints in the API use a service role client for database operations. This is an important implementation detail with security implications:

### What is a Service Role Client?
The service role client bypasses Row Level Security (RLS) policies in the database, allowing operations that would otherwise be restricted by RLS.

### When is it Used?
Service role clients are used in scenarios where:
1. Cross-doctor data access is required (e.g., admin operations)
2. System-level operations need to be performed
3. Bulk operations that would be inefficient with RLS

### Endpoints Using Service Role
Most endpoints in the following routers use service role clients:
- `/settings/*` - All endpoints
- `/hospitals/*` - All endpoints
- `/dispatch/*` - Most endpoints
- `/medical-records/*` - Some endpoints

### Security Implications
While service role usage is necessary for certain operations, it requires careful implementation to prevent unauthorized data access. The API implements additional application-level checks to ensure data isolation between doctors even when using service role clients.

---

## API Endpoints

### 1. Authentication (`/auth`)

#### POST `/auth/login`
**Objective**: Complete doctor authentication flow with OneHat integration and patient sync.

**Process**:
1. Validate credentials against CSV
2. Authenticate with OneHat API
3. Get doctor details from OneHat
4. Create/update doctor profile in Supabase
5. Conditional patient sync based on doctor status
6. Generate JWT token

**Payload**:
```json
{
  "username": "string",
  "password": "string", 
  "hospital_id": "integer"
}
```

**Response**:
```json
{
  "access_token": "string",
  "token_type": "Bearer",
  "expires_in": 21600,
  "refresh_token": "string",
  "doctor_id": "uuid",
  "doctor_name": "string",
  "hospital_name": "string",
  "specialty": "string",
  "onehat_doctor_id": "integer"
}
```

**External APIs Called**:
- OneHat Authentication API
- OneHat Doctor Profile API
- OneHat Patient List API (conditional sync)

#### GET `/auth/profile`
**Objective**: Get current doctor's profile information.

**Process**:
1. Extract doctor_id from JWT token
2. Fetch doctor profile from local database

**Query Parameters**:
- `doctor_id`: string (required)

**Payload**: None

**Response**:
```json
{
  "id": "uuid",
  "onehat_doctor_id": "integer",
  "hospital_id": "integer", 
  "username": "string",
  "full_name": "string",
  "email": "string",
  "specialty": "string",
  "created_at": "datetime"
}
```

**External APIs Called**: None

#### GET `/auth/validate-credentials/{username}/{hospital_id}`
**Objective**: Validate doctor credentials without completing the full login flow.

**Process**:
1. Check if doctor exists in the database
2. Validate credentials against CSV
3. Return validation result

**Response**:
```json
{
  "valid": "boolean",
  "doctor_data": {
    "username": "string",
    "hospital_id": "integer",
    "onehat_doctor_id": "integer"
  },
  "error": "string"
}
```

**External APIs Called**: None

#### POST `/auth/refresh`
**Objective**: Refresh JWT token using OneHat adapter.

**Process**:
1. Call OneHat adapter refresh method
2. Extract data from OneHat response
3. Return new access and refresh tokens

**Payload**:
```json
{
  "refresh_token": "string"
}
```

**Response**:
```json
{
  "access_token": "string",
  "refresh_token": "string",
  "token_type": "Bearer",
  "expires_in": 86400
}
```

**External APIs Called**:
- OneHat Token Refresh API

#### POST `/auth/sync-doctor/{onehat_doctor_id}`
**Objective**: Manually sync doctor profile with OneHat data.

**Process**:
1. Fetch doctor data from OneHat API
2. Update doctor profile in local database
3. Return sync result and updated doctor data

**Path Parameters**:
- `onehat_doctor_id`: integer (required)

**Response**:
```json
{
  "message": "string",
  "doctor_data": {
    "id": "uuid",
    "onehat_doctor_id": "integer",
    "hospital_id": "integer",
    "username": "string",
    "full_name": "string",
    "email": "string",
    "specialty": "string"
  },
  "sync_time": "datetime"
}
```

**External APIs Called**:
- OneHat Doctor Profile API

#### POST `/auth/logout`
**Objective**: Logout current user (invalidate token).

**Process**:
1. Invalidate token in OneHat system (TODO implementation)

**Response**:
```json
{
  "message": "string"
}
```

**External APIs Called**: None

---

### 2. Dashboard (`/dashboard`)

#### GET `/dashboard/summary`
**Objective**: Get dashboard summary with statistics for specified period.

**Process**:
1. Get doctor_id from query parameter
2. Calculate date range based on period
3. Query consultations, patients, and dispatch data
4. Aggregate statistics and recent activities

**Query Parameters**:
- `period`: "daily" | "weekly" (default: "daily")
- `doctor_id`: string (required)

**Response**:
```json
{
  "summary": {
    "period": "string",
    "total_patients_viewed": "integer", 
    "total_records_generated": "integer",
    "total_records_sent": "integer",
    "last_updated": "datetime"
  },
  "recent_activities": [
    {
      "patient_name": "string",
      "consultation_time": "datetime",
      "record_status": "string",
      "segments_count": "integer"
    }
  ]
}
```

**External APIs Called**: None

#### GET `/dashboard/stats`
**Objective**: Get detailed statistics for analytics dashboard.

**Process**:
1. Get doctor_id from query parameter
2. Calculate date range based on period
3. Query consultations and patients for specified period
4. Calculate detailed metrics for sent/unsent records
5. Get new patients for the period

**Query Parameters**:
- `period`: "daily" | "weekly" (default: "weekly")
- `doctor_id`: string (required)

**Response for daily period**:
```json
{
  "todays_consultations": "integer",
  "total_patients": "integer",
  "sent_records_today": "integer", 
  "unsent_records_today": "integer",
  "new_patients_today": "integer",
  "period": "string",
  "last_updated": "datetime"
}
```

**Response for weekly period**:
```json
{
  "total_consultations_week": "integer",
  "total_patients": "integer",
  "sent_records_week": "integer", 
  "unsent_records_week": "integer",
  "new_patients_week": "integer",
  "period": "string",
  "week_start": "datetime",
  "week_end": "datetime",
  "last_updated": "datetime"
}
```

**External APIs Called**: None

---

### 3. Patients (`/patients`)

#### GET `/patients/`
**Objective**: Get paginated list of patients filtered by OneHat assignments.

**Process**:
1. Get doctor_id from query parameter
2. Get OneHat doctor ID for the specified doctor
3. Get filtered patient list using patient sync service
4. Apply pagination

**Query Parameters**:
- `page`: integer (default: 1)
- `page_size`: integer (default: 20, max: 100)
- `search`: string (optional - searches name and phone)
- `doctor_id`: string (required)

**Response**:
```json
{
  "patients": [
    {
      "id": "uuid",
      "onehat_patient_id": "integer",
      "full_name": "string",
      "phone_number": "string",
      "last_consultation": "datetime",
      "unsent_records_count": "integer",
      "total_consultations": "integer"
    }
  ],
  "total_count": "integer",
  "page": "integer",
  "page_size": "integer"
}
```

**External APIs Called**: None

#### GET `/patients/list/jwt`
**Objective**: Get dashboard-ready patient list with aggregated consultation data.

**Process**:
1. Get doctor_id from query parameter
2. Get doctor-patient relations or filter by recent consultations
3. Apply search filtering if provided
4. Fetch patient details with consultation statistics
5. Apply pagination

**Query Parameters**:
- `page`: integer (default: 1)
- `page_size`: integer (default: 20, max: 2000)
- `search`: string (optional - searches name and phone)
- `last_days`: integer (optional - filter patients with consultations in last N days)
- `doctor_id`: string (required)

**Response**:
```json
{
  "patients": [
    {
      "patient_id": "uuid",
      "onehat_patient_id": "integer",
      "full_name": "string",
      "phone_number": "string",
      "last_consultation_date": "datetime",
      "total_consultations": "integer",
      "pending_records": "integer",
      "dispatched_records": "integer",
      "has_pending_consultations": "boolean"
    }
  ],
  "total_count": "integer",
  "page": "integer",
  "page_size": "integer",
  "total_pages": "integer",
  "search": "string"
}
```

**External APIs Called**: None

#### GET `/patients/{patient_id}`
**Objective**: Get detailed patient information with consultation history.

**Process**:
1. Get doctor_id from query parameter
2. Verify doctor has access to patient
3. Fetch patient details and consultation history
4. Calculate consultation statistics

**Response**:
```json
{
  "patient": {
    "id": "uuid",
    "onehat_patient_id": "integer",
    "full_name": "string",
    "phone_number": "string",
    "last_consultation": "datetime",
    "unsent_records_count": "integer",
    "total_consultations": "integer"
  },
  "consultation_history": [
    {
      "id": "uuid",
      "consultation_time": "datetime",
      "segments_count": "integer",
      "sent_count": "integer",
      "verified_count": "integer"
    }
  ]
}
```

**External APIs Called**: None

#### POST `/patients/create`
**Objective**: Create a new patient in both OneHat and local database.

**Process**:
1. Validate input data and calculate age from DOB
2. Get hospital_id from doctor's profile
3. Create patient in OneHat first
4. Create patient in Supabase with onehat_patient_id
5. Create doctor-patient relation

**Query Parameters**:
- `doctor_id`: string (required)

**Payload**:
```json
{
  "name": "string",
  "mobile_number": "string",
  "date_of_birth": "string (DD/MM/YYYY)",
  "gender": "string (Male/Female)",
  "age": "integer (optional)",
  "hospital_id": "integer (optional)"
}
```

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "patient_id": "uuid",
  "onehat_patient_id": "integer"
}
```

**External APIs Called**:
- OneHat Patient Creation API

#### POST `/patients/1hatsync`
**Objective**: Sync all patients for a doctor from OneHat to local database.

**Process**:
1. Get doctor's OneHat ID
2. Fetch all patients from OneHat
3. Process each patient (create/update in local DB)
4. Create doctor-patient relations
5. Handle removed patients (set inactive)

**Payload**:
```json
{
  "doctor_id": "uuid"
}
```

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "total_onehat_patients": "integer",
  "new_patients": "integer", 
  "updated_patients": "integer",
  "errors": ["string"]
}
```

**External APIs Called**:
- OneHat Patient List API

#### POST `/patients/{patient_id}/sync`
**Objective**: Manual sync of specific patient data from OneHat.

**Process**:
1. Check if patient exists locally
2. Get OneHat patient ID
3. Sync patient data from OneHat
4. Update local database

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "patient_id": "uuid"
}
```

**External APIs Called**:
- OneHat Patient Detail API

#### POST `/patients/{patient_id}/assign-doctor`
**Objective**: Assign doctor to patient (for V2 doctor-patient assignments).

**Process**:
1. Get doctor_id from query parameter
2. Create doctor-patient relation

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "success": "boolean",
  "message": "string"
}
```

**External APIs Called**: None

---

### 4. Medical Records (`/medical-records`)

#### POST `/medical-records/start-recording`
**Objective**: Start a new recording session and get configuration.

**Process**:
1. Generate correlation ID
2. Get configuration from Pradhi API
3. Return recording configuration

**Payload**:
```json
{
  "doctor_id": "uuid",
  "patient_id": "uuid",
  "hospital_id": "integer"
}
```

**Response**:
```json
{
  "correlation_id": "string",
  "config": {
    "recording_url": "string",
    "recording_token": "string",
    "max_duration_seconds": "integer"
  }
}
```

**External APIs Called**:
- Pradhi API (recording configuration)

#### POST `/medical-records/recording/{correlation_id}/chunk`
**Objective**: Submit audio chunk during recording.

**Process**:
1. Validate correlation ID
2. Submit audio chunk to Pradhi API
3. Return success status

**Payload**:
```json
{
  "audio_data": "base64_string",
  "timestamp": "integer"
}
```

**Response**:
```json
{
  "success": "boolean"
}
```

**External APIs Called**:
- Pradhi API (audio chunk submission)

#### POST `/medical-records/recording/{correlation_id}/stop`
**Objective**: Stop recording session and start transcription.

**Process**:
1. Validate correlation ID
2. Stop recording in Pradhi API
3. Start transcription processing
4. Return submission ID for status checking

**Payload**:
```json
{
  "doctor_id": "uuid",
  "patient_id": "uuid",
  "hospital_id": "integer"
}
```

**Response**:
```json
{
  "submission_id": "string",
  "status": "string"
}
```

**External APIs Called**:
- Pradhi API (stop recording, start transcription)

#### GET `/medical-records/transcription/{submission_id}/status`
**Objective**: Check transcription processing status.

**Process**:
1. Query Pradhi API for transcription status
2. Return status information

**Response**:
```json
{
  "status": "string",
  "progress": "integer",
  "estimated_completion_time": "integer"
}
```

**External APIs Called**:
- Pradhi API (transcription status)

#### POST `/medical-records/transcription/{submission_id}/retrieve`
**Objective**: Retrieve completed transcription and create medical record segments.

**Process**:
1. Get transcription from Pradhi API
2. Process transcription into segments
3. Create consultation and segments in database
4. Return consultation details

**Response**:
```json
{
  "consultation_id": "uuid",
  "segments_count": "integer",
  "segments": ["uuid"]
}
```

**External APIs Called**:
- Pradhi API (retrieve transcription)

#### POST `/medical-records/consultations`
**Objective**: Create a new consultation record.

**Process**:
1. Create consultation in database
2. Process segments if provided
3. Return consultation ID

**Form Parameters**:
- `patient_id`: string (required)
- `doctor_id`: string (required)
- `hospital_id`: integer (optional)

**Response**:
```json
{
  "consultation_id": "uuid"
}
```

**External APIs Called**: None

#### GET `/medical-records/patients/{patient_id}/consultations`
**Objective**: Get consultations for a specific patient.

**Process**:
1. Get doctor_id from query parameter
2. Verify doctor has access to patient
3. Fetch consultations for patient

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "consultations": [
    {
      "id": "uuid",
      "consultation_time": "datetime",
      "segments_count": "integer",
      "verified_count": "integer",
      "sent_count": "integer"
    }
  ]
}
```

**External APIs Called**: None

#### GET `/medical-records/consultations/{consultation_id}`
**Objective**: Get consultation details with segments.

**Process**:
1. Get doctor_id from query parameter
2. Verify doctor owns the consultation
3. Fetch consultation and patient details
4. Get all segments for consultation
5. Process segment content and metadata

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "id": "uuid",
  "patient_id": "uuid",
  "patient_name": "string",
  "doctor_name": "string",
  "consultation_time": "datetime",
  "segments": [
    {
      "id": "uuid",
      "title": "string",
      "content": "object",
      "original_content": "object",
      "edited_content": "string",
      "is_verified": "boolean",
      "sent_count": "integer",
      "edit_count": "integer",
      "ordinal": "integer"
    }
  ],
  "pradhi_submission_id": "string"
}
```

**External APIs Called**: None

#### GET `/medical-records/consultations`
**Objective**: List consultations with optional filtering.

**Process**:
1. Apply filters if provided
2. Fetch consultations matching criteria
3. Return consultation list

**Query Parameters**:
- `patient_id`: string (optional)
- `status`: string (optional)
- `doctor_id`: string (required)

**Response**:
```json
{
  "consultations": [
    {
      "id": "uuid",
      "patient_id": "uuid",
      "patient_name": "string",
      "consultation_time": "datetime",
      "segments_count": "integer",
      "verified_segments": "integer",
      "sent_segments": "integer"
    }
  ]
}
```

**External APIs Called**: None

#### POST `/medical-records/consultations/pradhi`
**Objective**: Create a new consultation from Pradhi processed data.

**Process**:
1. Process Pradhi data
2. Create consultation and segments
3. Return consultation ID

**Payload**:
```json
{
  "doctor_id": "uuid",
  "patient_id": "uuid",
  "pradhi_data": "object"
}
```

**Response**:
```json
{
  "consultation_id": "uuid",
  "segments_count": "integer"
}
```

**External APIs Called**: None

#### PUT `/medical-records/segments/{segment_id}/edit`
**Objective**: Edit a record segment content without verification.

**Process**:
1. Get doctor_id from query parameter
2. Verify segment belongs to doctor's consultation
3. Update segment with edited content
4. Increment edit count and reset verification

**Query Parameters**:
- `doctor_id`: string (required)

**Payload**:
```json
{
  "edited_content": "string"
}
```

**Response**:
```json
{
  "message": "string",
  "segment_id": "uuid",
  "edit_count": "integer"
}
```

**External APIs Called**: None

#### PUT `/medical-records/segments/{segment_id}/verify`
**Objective**: Verify a record segment.

**Process**:
1. Get doctor_id from query parameter
2. Verify segment belongs to doctor's consultation
3. Update segment verification status

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "message": "string",
  "segment_id": "uuid"
}
```

**External APIs Called**: None

#### POST `/medical-records/consultations/{consultation_id}/verify-all`
**Objective**: Verify all unverified segments in a consultation.

**Process**:
1. Get doctor_id from query parameter
2. Verify consultation belongs to doctor
3. Get all unverified segments
4. Bulk update verification status

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "message": "string",
  "consultation_id": "uuid",
  "verified_count": "integer"
}
```

**External APIs Called**: None

---

### 5. Dispatch (`/dispatch`)

#### POST `/dispatch/send`
**Objective**: Dispatch selected record segments via multiple channels.

**Process**:
1. Validate consultation access
2. Get consultation and segment data
3. Generate PDF if needed
4. Transform data to OneHat format
5. Dispatch via selected methods (1hat App, WhatsApp)
6. Log dispatch records

**Payload**:
```json
{
  "consultation_id": "uuid",
  "segment_ids": ["uuid"],
  "dispatch_methods": ["1hat_app_pdf", "whatsapp_patient"],
  "whatsapp_numbers": ["string"],
  "email_addresses": ["string"],
  "current_doctor_id": "uuid"
}
```

**Response**:
```json
[
  {
    "dispatch_id": "uuid",
    "consultation_id": "uuid", 
    "dispatch_method": "string",
    "segments_count": "integer",
    "pdf_url": "string",
    "status": "string",
    "sent_at": "datetime"
  }
]
```

**External APIs Called**:
- OneHat Health Records API
- AISensy WhatsApp API

#### POST `/dispatch/send-record`
**Objective**: Send record to patient using all available methods (OneHat PDF, Digital Prescription, WhatsApp).

**Process**:
1. Force the methods to include all available channels: "1hat_app_pdf", "digital_prescription", "whatsapp_patient"
2. Call the main dispatch function
3. Return detailed success/failure status for each method

**Payload**:
```json
{
  "consultation_id": "uuid",
  "segment_ids": ["uuid"],
  "dispatch_methods": ["string"],
  "whatsapp_numbers": ["string"],
  "email_addresses": ["string"],
  "current_doctor_id": "uuid"
}
```

**Response**:
```json
{
  "consultation_id": "uuid",
  "total_methods_attempted": "integer",
  "successful_methods": ["string"],
  "failed_methods": ["string"],
  "skipped_methods": {
    "method_name": "reason_string"
  },
  "method_results": [{
    "method": "string",
    "status": "string",
    "details": "object"
  }],
  "dispatches": [{
    "dispatch_id": "uuid",
    "consultation_id": "uuid",
    "dispatch_method": "string",
    "segments_count": "integer",
    "pdf_url": "string",
    "status": "string",
    "sent_at": "datetime"
  }]
}
```

**External APIs Called**:
- OneHat Health Records API
- OneHat Digital Prescription API
- AISensy WhatsApp API

#### POST `/dispatch/digital-prescription`
**Objective**: Send digital prescription to OneHat using Pradhi prescription parsing.

**Process**:
1. Get consultation and prescription segments
2. Parse prescription data (multiple formats supported)
3. Transform to OneHat /erx format
4. Send to OneHat prescription API
5. Log dispatch record

**Payload**:
```json
{
  "consultation_id": "uuid",
  "onehat_patient_id": "integer",
  "doctor_id": "uuid"
}
```

**Response**:
```json
{
  "consultation_id": "uuid",
  "patient_id": "integer",
  "prescription_id": "string",
  "status": "string",
  "message": "string",
  "saved_at": "datetime"
}
```

**External APIs Called**:
- OneHat Prescription API (/erx)

#### POST `/dispatch/prescription/{consultation_id}`
**Objective**: Send prescription data to 1hat App via /erx endpoint.

**Process**:
1. Get consultation data
2. Extract prescription segments
3. Parse prescription data
4. Transform to OneHat format
5. Send via OneHat API

**Payload**:
```json
{
  "consultation_id": "uuid",
  "onehat_patient_id": "integer", 
  "doctor_id": "uuid"
}
```

**Response**:
```json
{
  "consultation_id": "uuid",
  "patient_id": "integer",
  "prescription_id": "string",
  "status": "string",
  "message": "string",
  "saved_at": "datetime"
}
```

**External APIs Called**:
- OneHat Prescription API (/erx)

#### POST `/dispatch/prescription-to-pharmacy`
**Objective**: Send prescription to hospital pharmacy via WhatsApp.

**Process**:
1. Get consultation and prescription data
2. Format prescription for pharmacy
3. Send via WhatsApp to pharmacy number
4. Log dispatch record

**Payload**:
```json
{
  "consultation_id": "uuid",
  "doctor_id": "uuid",
  "patient_name": "string",
  "doctor_name": "string"
}
```

**Response**:
```json
{
  "consultation_id": "uuid",
  "patient_name": "string",
  "doctor_name": "string", 
  "message_id": "string",
  "sent_at": "datetime"
}
```

**External APIs Called**:
- AISensy WhatsApp API

#### GET `/dispatch/history/{consultation_id}`
**Objective**: Get dispatch history for a consultation.

**Process**:
1. Get doctor_id from query parameter
2. Verify consultation access
3. Get all dispatch records
4. Return formatted history

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "consultation_id": "uuid",
  "dispatches": [
    {
      "id": "uuid",
      "dispatch_method": "string",
      "segments_count": "integer",
      "sent_at": "datetime",
      "status": "string"
    }
  ]
}
```

**External APIs Called**: None

#### GET `/dispatch/download-button/{consultation_id}`
**Objective**: Generate PDF download URL for consultation.

**Process**:
1. Verify doctor owns consultation
2. Get consultation and segments
3. Generate PDF
4. Return download URL

**Query Parameters**:
- `doctor_id`: string (required for privacy)

**Response**:
```json
{
  "success": "boolean",
  "download_url": "string",
  "filename": "string",
  "consultation_id": "uuid"
}
```

**External APIs Called**: None

#### GET `/dispatch/pdf/download/{filename}`
**Objective**: Download a generated PDF file by filename.

**Process**:
1. Verify file exists
2. Return file for download

**Response**: Binary PDF file

**External APIs Called**: None

#### GET `/dispatch/pdf/generate/{consultation_id}`
**Objective**: Generate PDF for a consultation.

**Process**:
1. Verify doctor owns consultation
2. Get consultation and segment data
3. Generate PDF using template
4. Save to S3
5. Return download URL

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "success": "boolean",
  "filename": "string",
  "consultation_id": "uuid"
}
```

**External APIs Called**: None

#### GET `/dispatch/pdf/download-url/{consultation_id}`
**Objective**: Get pre-signed URL for PDF download.

**Process**:
1. Verify doctor owns consultation
2. Check if PDF exists in S3
3. Generate pre-signed URL
4. Return URL with expiration

**Query Parameters**:
- `doctor_id`: string (required for access control)

**Response**:
```json
{
  "success": "boolean",
  "download_url": "string",
  "filename": "string",
  "consultation_id": "uuid"
}
```

**External APIs Called**: None

#### GET `/dispatch/stats`
**Objective**: Get dispatch statistics for a doctor.

**Process**:
1. Get doctor's dispatch records
2. Calculate statistics
3. Return formatted stats

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "total_dispatches": "integer",
  "dispatches_by_method": {
    "whatsapp": "integer",
    "1hat_app": "integer",
    "email": "integer"
  },
  "period": "string"
}
```

**External APIs Called**: None

#### GET `/dispatch/methods`
**Objective**: Get list of available dispatch methods.

**Process**:
1. Return predefined list of available dispatch methods
2. Include method details and display names

**Response**:
```json
{
  "methods": [
    {
      "id": "string",
      "name": "string", 
      "description": "string",
      "requires_phone": "boolean",
      "requires_email": "boolean"
    }
  ]
}
```

**External APIs Called**: None

---

### 6. Pradhi Proxy (`/pradhi`)

#### GET `/pradhi/auth/test`
**Objective**: Test Pradhi authentication.

**Process**:
1. Attempt to get Pradhi access token
2. Return authentication status

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "token_preview": "string"
}
```

**External APIs Called**:
- Pradhi Authentication API

#### GET `/pradhi/status`
**Objective**: Get overall Pradhi integration status.

**Process**:
1. Test Pradhi authentication
2. Test recording configuration
3. Return status summary

**Response**:
```json
{
  "overall_status": "string",
  "authentication": {
    "status": "string",
    "message": "string"
  },
  "recording_configuration": {
    "status": "string",
    "message": "string"
  },
  "timestamp": "datetime"
}
```

**External APIs Called**:
- Pradhi Authentication API
- Pradhi Configuration API

#### POST `/pradhi/recording/start`
**Objective**: Start a new recording session with Pradhi.

**Process**:
1. Authenticate with Pradhi
2. Start recording session
3. Return session details

**Response**:
```json
{
  "success": "boolean",
  "correlation_id": "string",
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Recording Start API

#### POST `/pradhi/recording/chunk`
**Objective**: Upload audio chunk during recording.

**Process**:
1. Validate correlation_id
2. Upload audio chunk to Pradhi
3. Return upload status

**Payload**:
```json
{
  "correlation_id": "string",
  "audio_data": "string (base64)",
  "is_final": "boolean"
}
```

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "chunk_count": "integer"
}
```

**External APIs Called**:
- Pradhi Audio Upload API


#### POST `/pradhi/recording/submit`
**Objective**: Submit recording form to Pradhi.

**Process**:
1. Submit patient details and recording
2. Get submission ID
3. Return submission status

**Payload**:
```json
{
  "correlation_id": "string",
  "patient_id": "string",
  "patient_name": "string",
  "patient_phone": "string",
  "patient_email": "string (optional)",
  "onehat_doctor_id": "string"
}
```

**Response**:
```json
{
  "success": "boolean",
  "submission_id": "string",
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Form Submission API

#### POST `/pradhi/submission/fetch`
**Objective**: Fetch latest submission for a patient.

**Process**:
1. Get appropriate Pradhi adapter
2. Fetch latest submission for patient based on name and phone
3. Return submission data or error message

**Payload**:
```json
{
  "patient_name": "string",
  "patient_phone": "string"
}
```

**Response**:
```json
{
  "success": "boolean",
  "data": "object (optional)",
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Submission Fetch API

#### POST `/pradhi/submission/fetch-by-id`
**Objective**: Fetch submission by specific submission ID.

**Process**:
1. Query Pradhi for submission
2. Return submission data if ready

**Payload**:
```json
{
  "submission_id": "string",
  "doctor_id": "string (optional)",
  "patient_id": "string (optional)"
}
```

**Response**:
```json
{
  "success": "boolean",
  "data": "object",
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Submission Fetch API

#### POST `/pradhi/submission/poll-by-id`
**Objective**: Poll submission by ID with retry mechanism for up to 5 minutes.

**Process**:
1. Start polling for submission
2. Retry until insights are ready or timeout
3. Return final result

**Payload**:
```json
{
  "submission_id": "string",
  "doctor_id": "string (optional)",
  "patient_id": "string (optional)"
}
```

**Response**:
```json
{
  "success": "boolean",
  "data": "object",
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Submission Fetch API (with polling)

#### POST `/pradhi/submission/fetch-and-save`
**Objective**: Fetch submission from Pradhi and save to database.

**Process**:
1. Fetch submission from Pradhi
2. Parse patient and consultation data
3. Create consultation and segments in database
4. Return saved consultation details

**Payload**:
```json
{
  "submission_id": "string",
  "doctor_id": "string",
  "patient_id": "string"
}
```

**Response**:
```json
{
  "success": "boolean",
  "data": {
    "consultation_id": "uuid",
    "submission_id": "string",
    "segments_count": "integer"
  },
  "message": "string"
}
```

**External APIs Called**:
- Pradhi Submission Fetch API

---

### 7. Settings (`/settings`)

#### GET `/settings/summary`
**Objective**: Get a summary of all settings for a doctor.

**Process**:
1. Get doctor_id from query parameter
2. Get doctor profile
3. Get default dispatch sections
4. Return settings summary

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "doctor_id": "uuid",
  "profile": {
    "username": "string",
    "full_name": "string",
    "email": "string",
    "specialty": "string"
  },
  "default_dispatch_sections": ["string"],
  "nurse_count": "integer",
  "settings_complete": "boolean"
}
```

**External APIs Called**: None

#### GET `/settings/preferences`
**Objective**: Get doctor's segment preferences.

**Process**:
1. Get doctor_id from query parameter
2. Get segment preferences from database
3. Return preferences with defaults

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "doctor_id": "uuid",
  "default_dispatch_sections": ["string"]
}
```

**External APIs Called**: None

#### POST `/settings/preferences`
**Objective**: Save doctor's segment preferences.

**Process**:
1. Get doctor_id from request body
2. Check if settings already exist
3. Update or insert preferences in database
4. Return confirmation

**Request Body**:
```json
{
  "doctor_id": "uuid",
  "default_dispatch_sections": ["string"]
}
```

**Response**:
```json
{
  "message": "string",
  "doctor_id": "uuid",
  "default_dispatch_sections": ["string"]
}
```

**External APIs Called**: None

#### GET `/settings/profile`
**Objective**: Get doctor's profile settings.

**Process**:
1. Get doctor_id from query parameter
2. Get doctor profile from database
3. Return profile data

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "id": "uuid",
  "username": "string",
  "full_name": "string",
  "email": "string",
  "specialty": "string",
  "hospital_name": "string"
}
```

**External APIs Called**: None

#### GET `/settings/pharmacy-whatsapp`
**Objective**: Get hospital pharmacy WhatsApp number.

**Process**:
1. Get doctor_id from query parameter
2. Get pharmacy WhatsApp from settings
3. Return phone number

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "doctor_id": "uuid",
  "hospital_pharmacy_whatsapp": "string"
}
```

**External APIs Called**: None

#### POST `/settings/pharmacy-whatsapp`
**Objective**: Save hospital pharmacy WhatsApp number.

**Process**:
1. Get doctor_id from request body
2. Validate phone number format
3. Check if settings already exist
4. Update or insert settings in database
5. Return success status

**Request Body**:
```json
{
  "doctor_id": "uuid",
  "hospital_pharmacy_whatsapp": "string"
}
```

**Response**:
```json
{
  "message": "string",
  "doctor_id": "uuid", 
  "hospital_pharmacy_whatsapp": "string"
}
```

**External APIs Called**: None

#### GET `/settings/nurses`
**Objective**: Get nurses assigned to a doctor.

**Process**:
1. Get doctor_id from query parameter
2. Get nurses from database
3. Return nurse list with permissions

**Query Parameters**:
- `doctor_id`: string (required)

**Response**:
```json
{
  "doctor_id": "uuid",
  "nurses": [
    {
      "id": "uuid",
      "username": "string",
      "full_name": "string",
      "permissions": {
        "can_view": "boolean",
        "can_edit": "boolean", 
        "can_send": "boolean"
      }
    }
  ]
}
```

**External APIs Called**: None

#### POST `/settings/nurses/permissions`
**Objective**: Save nurse permissions for a doctor.

**Process**:
1. Get doctor_id from request body
2. Update permissions for each nurse in the list
3. Return success status

**Request Body**:
```json
{
  "doctor_id": "uuid",
  "nurses": [
    {
      "id": "uuid",
      "username": "string",
      "full_name": "string",
      "permissions": {
        "can_view": "boolean",
        "can_edit": "boolean",
        "can_send": "boolean"
      }
    }
  ]
}
```

**Response**:
```json
{
  "message": "string",
  "doctor_id": "uuid",
  "nurses_updated": "integer"
}
```

**External APIs Called**: None

---

### 8. Hospitals (`/hospitals`)

#### GET `/hospitals/`
**Objective**: Get list of all hospitals for login dropdown.

**Process**:
1. Load hospitals from CSV via hospital service
2. Return hospital list

**Response**:
```json
{
  "hospitals": [
    {
      "id": "integer",
      "name": "string"
    }
  ],
  "total_count": "integer"
}
```

**External APIs Called**: None

#### GET `/hospitals/validate-doctor/{username}/{hospital_id}`
**Objective**: Validate doctor credentials against CSV data during authentication.

**Process**:
1. Check if doctor exists in CSV data
2. Return validation result with doctor data

**Response**:
```json
{
  "valid": "boolean",
  "doctor_data": {
    "full_name": "string",
    "username": "string",
    "specialty": "string"
  }
}
```

**External APIs Called**: None

#### POST `/hospitals/seed`
**Objective**: Seed hospitals from CSV to database for foreign key references.

**Process**:
1. Load hospitals from CSV
2. Insert into database
3. Return seeding results

**Response**:
```json
{
  "message": "string",
  "hospitals_seeded": "integer",
  "hospitals": [{
    "id": "integer",
    "name": "string"
  }]
}
```

**External APIs Called**: None

---

## Error Responses

### Standard Error Format
```json
{
  "detail": "string",
  "status_code": "integer"
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized (Invalid/Missing JWT)
- `403`: Forbidden (RLS Access Denied)
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

---

## External API Integrations

### 1. OneHat (1hat) API
**Purpose**: Patient management and prescription dispatch
**Endpoints Used**:
- Authentication
- Doctor Profile
- Patient Management (CRUD)
- Health Records Dispatch
- Digital Prescription (/erx)

### 2. Pradhi API
**Purpose**: Voice transcription and medical record generation
**Endpoints Used**:
- Authentication
- Recording Session Management
- Audio Upload (Chunked)
- Form Submission
- Transcription Fetch

### 3. AISensy WhatsApp API
**Purpose**: WhatsApp message and PDF dispatch
**Endpoints Used**:
- Send Message
- Send Document/PDF
- Message Status

---

## Security Features

### JWT Authentication
- All user endpoints require valid JWT tokens
- Tokens include doctor_id for RLS enforcement
- 6-hour token expiration

### Row Level Security (RLS)
- Database-level data isolation between doctors
- Each doctor can only access their own data
- Service role bypass for system operations

### Data Privacy
- Cross-doctor access prevention
- Consultation ownership verification
- Patient access control via doctor-patient relations

---

## Rate Limiting
- No explicit rate limiting implemented
- Recommended to implement in production

## Pagination
- Default page size: 20
- Maximum page size: 2000 (patients), 100 (others)
- Standard pagination response format

## Logging
- Comprehensive logging for all operations
- Error tracking and debugging support
- External API call logging

----

**External APIs Called**: None
