# VHR Active API Documentation

## Overview
This document outlines all the active APIs currently used by the VHR (Voice Health Record) frontend application. These APIs are confirmed to be in active use based on a comprehensive review of the frontend codebase.

## Base URL
- **Development**: `http://localhost:8000`
- **Production**: `http://localhost:8000`

## Authentication
The API uses JWT (JSON Web Token) authentication with Row Level Security (RLS) for data isolation between doctors.

### Headers Required
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## API Endpoints

### 1. Authentication (`/auth`)

#### POST `/auth/login`
**Objective**: Complete doctor authentication flow with OneHat integration and patient sync.

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
  "doctor_id": "uuid",
  "doctor_name": "string",
  "hospital_name": "string",
  "specialty": "string"
}
```

#### POST `/auth/logout`
**Objective**: Logout user and invalidate tokens.

**Response**:
```json
{
  "message": "Successfully logged out"
}
```

---

### 2. Dashboard (`/dashboard`)

#### GET `/dashboard/stats`
**Objective**: Get detailed statistics for analytics dashboard.

**Query Parameters**:
- `period`: "daily" | "weekly" (default: "weekly")
- `doctor_id`: UUID string

**Response**:
```json
{
  "todays_consultations": "integer",
  "total_patients": "integer",
  "sent_records": "integer", 
  "unsent_records": "integer",
  "new_patients": "integer"
}
```

#### GET `/dashboard/patients/new`
**Objective**: Get new patients for the dashboard.

**Query Parameters**:
- `doctor_id`: UUID string
- `limit`: integer (optional, default: 5)

**Response**:
```json
{
  "patients": [
    {
      "id": "uuid",
      "name": "string",
      "created_at": "datetime",
      "phone_number": "string"
    }
  ],
  "count": "integer"
}
```

---

### 3. Patients (`/patients`)

#### GET `/patients/list/jwt`
**Objective**: Get dashboard-ready patient list with aggregated consultation data.

**Query Parameters**:
- `page`: integer (default: 1)
- `page_size`: integer (default: 20, max: 2000)
- `search`: string (optional - searches name and phone)
- `last_days`: integer (optional - for dashboard patients)

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
  "page_size": "integer",
  "total_pages": "integer",
  "search": "string"
}
```

#### GET `/patients/{patientId}`
**Objective**: Get detailed patient information with consultation history.

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

#### GET `/medical-records/consultations/{consultationId}`
**Objective**: Get consultation details with segments.

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

#### POST `/patients/create`
**Objective**: Create a new patient in both OneHat and local database.

**Query Parameters**:
- `doctor_id`: UUID string

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

---

### 4. Dispatch (`/dispatch`)

#### POST `/dispatch/send`
**Objective**: Dispatch selected record segments via multiple channels.

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
{
  "dispatch_id": "uuid",
  "consultation_id": "uuid", 
  "dispatch_method": "string",
  "segments_count": "integer",
  "pdf_url": "string",
  "status": "string",
  "sent_at": "datetime"
}
```

---

### 5. Pradhi APIs (`/pradhi`)

#### POST `/pradhi/recording/start`
**Objective**: Start a new recording session with Pradhi.

**Response**:
```json
{
  "success": "boolean",
  "correlation_id": "string",
  "message": "string"
}
```

#### POST `/pradhi/recording/chunk`
**Objective**: Upload audio chunk during recording.

**Payload**:
```json
{
  "correlation_id": "string",
  "audio_data": "string (base64)",
  "chunk_number": "integer"
}
```

**Response**:
```json
{
  "success": "boolean",
  "chunk_number": "integer",
  "message": "string"
}
```

#### POST `/pradhi/recording/stop`
**Objective**: Stop recording session.

**Payload**:
```json
{
  "correlation_id": "string"
}
```

**Response**:
```json
{
  "success": "boolean",
  "message": "string"
}
```

#### POST `/pradhi/recording/submit`
**Objective**: Submit recording form to Pradhi.

**Payload**:
```json
{
  "correlation_id": "string",
  "patient_name": "string",
  "patient_phone": "string", 
  "patient_email": "string"
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

#### POST `/pradhi/submission/fetch-and-save`
**Objective**: Fetch submission from Pradhi and save to database.

**Payload**:
```json
{
  "submission_id": "string"
}
```

**Response**:
```json
{
  "success": "boolean",
  "consultation_id": "uuid",
  "message": "string"
}
```

---

### 6. RAG APIs (`/rag`)

#### POST `/rag/query-text`
**Objective**: Query patient history using text.

**Query Parameters**:
- `doctor_id`: UUID string

**Payload**:
```json
{
  "query": "string",
  "patient_id": "uuid"
}
```

**Response**:
```json
{
  "results": [
    {
      "segment_id": "uuid",
      "consultation_id": "uuid",
      "consultation_date": "datetime",
      "content": "string",
      "relevance_score": "float"
    }
  ],
  "query": "string"
}
```

#### POST `/rag/query-voice`
**Objective**: Query patient history using voice.

**Query Parameters**:
- `doctor_id`: UUID string

**Payload**:
```json
{
  "audio_data": "string (base64)",
  "patient_id": "uuid"
}
```

**Response**:
```json
{
  "results": [
    {
      "segment_id": "uuid",
      "consultation_id": "uuid",
      "consultation_date": "datetime",
      "content": "string",
      "relevance_score": "float"
    }
  ],
  "transcribed_query": "string"
}
```

---

### 7. Settings (`/settings`)

#### GET `/settings/preferences`
**Objective**: Get doctor's segment preferences.

**Response**:
```json
{
  "doctor_id": "uuid",
  "preferences": {
    "segment_name": {
      "selected": "boolean",
      "order": "integer"
    }
  }
}
```

#### POST `/settings/preferences`
**Objective**: Save doctor's segment preferences.

**Payload**:
```json
{
  "preferences": {
    "segment_name": {
      "selected": "boolean", 
      "order": "integer"
    }
  }
}
```

**Response**:
```json
{
  "message": "string",
  "doctor_id": "uuid",
  "preferences_count": "integer"
}
```

#### GET `/settings/pharmacy-whatsapp`
**Objective**: Get hospital pharmacy WhatsApp number.

**Response**:
```json
{
  "doctor_id": "uuid",
  "hospital_pharmacy_whatsapp": "string"
}
```

#### POST `/settings/pharmacy-whatsapp`
**Objective**: Save hospital pharmacy WhatsApp number.

**Payload**:
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

---

### 8. Hospitals (`/hospitals`)

#### GET `/hospitals`
**Objective**: Get list of all hospitals.

**Response**:
```json
{
  "hospitals": [
    {
      "id": "integer",
      "name": "string",
      "location": "string",
      "contact_info": "string"
    }
  ]
}
```

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
