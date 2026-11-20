# MedNexa API Endpoints Specification

This document details the REST API surface for the MedNexa healthcare platform backend. All requests and responses use JSON format unless binary audio streaming is specified.

Base URL: `http://127.0.0.1:5000/api/v1`

---

## Table of Contents

- [Authentication](#authentication)
- [Doctor Management](#doctor-management)
- [Facility Management](#facility-management)
- [Appointments](#appointments)
- [Consultations and Clinical Chat](#consultations-and-clinical-chat)
- [Patient Location and Geolocation](#patient-location-and-geolocation)
- [Multi-Method Payments](#multi-method-payments)
- [Symptom Intake and Clinical Triage](#symptom-intake-and-clinical-triage)
- [Medical Records](#medical-records)
- [Recovery Tracking](#recovery-tracking)
- [Voice Intelligence Suite](#voice-intelligence-suite)
- [Emergency and Notifications](#emergency-and-notifications)

---

## Authentication

### Sign In
- **Method**: `POST`
- **Path**: `/auth/login`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "patient@mednexa.com",
  "password": "Password123!"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_pat_1",
      "email": "patient@mednexa.com",
      "role": "patient",
      "phone": "+254 712 345 678",
      "profile": {
        "display_name": "Sarah Achieng"
      }
    },
    "tokens": {
      "access_token": "<jwt_token>"
    }
  },
  "message": "Sign in successful"
}
```

### Register Account
- **Method**: `POST`
- **Path**: `/auth/register`
- **Auth Required**: No
- **Request Body**:
```json
{
  "email": "doctor.new@mednexa.com",
  "password": "SecurePassword123!",
  "role": "doctor",
  "full_name": "Dr. Grace Muthoni",
  "phone": "+254 722 999 888",
  "speciality": "General Practitioner"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "usr_1795134900000",
      "email": "doctor.new@mednexa.com",
      "role": "doctor"
    },
    "tokens": {
      "access_token": "<jwt_token>"
    }
  },
  "message": "Account created successfully"
}
```

### Current User Profile
- **Method**: `GET`
- **Path**: `/auth/me`
- **Auth Required**: Yes (`Bearer <token>` or `Bearer mock-token-pat_1`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "id": "usr_pat_1",
    "email": "patient@mednexa.com",
    "role": "patient",
    "profile": {
      "display_name": "Sarah Achieng",
      "date_of_birth": "1994-08-14",
      "blood_group": "O+"
    }
  }
}
```

---

## Doctor Management

### List Doctors
- **Method**: `GET`
- **Path**: `/doctors`
- **Auth Required**: No
- **Query Parameters**:
  - `q`: Search keyword across clinician name, specialty, bio
  - `speciality`: Filter by clinical field (e.g., `Pediatrics`, `Cardiology`)
  - `city`: Filter by city (e.g., `Nairobi`, `Mombasa`, `Kisumu`)
  - `max_fee`: Maximum consultation fee in KES
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "doc_1",
      "full_name": "Dr. Brian Otieno, MD",
      "speciality": "Pediatrics & Family Medicine",
      "registration_number": "KMPDC-A4821",
      "verification_status": "verified",
      "fee": 2500,
      "clinic_address": "Upper Hill Medical Centre, Nairobi",
      "city": "Nairobi",
      "latitude": -1.2985,
      "longitude": 36.8125,
      "available_slots": []
    }
  ]
}
```

### Get Doctor Details
- **Method**: `GET`
- **Path**: `/doctors/:id`
- **Auth Required**: No

### Manage Doctor Availability Slots
- **Method**: `GET` / `POST`
- **Path**: `/doctors/me/availability`
- **Auth Required**: Yes (`role: doctor`)
- **POST Request Body**:
```json
{
  "start_at": "2026-11-25T09:00:00Z",
  "duration_minutes": 45
}
```

---

## Facility Management

### List Healthcare Facilities
- **Method**: `GET`
- **Path**: `/facilities`
- **Auth Required**: No
- **Query Parameters**:
  - `q`: Facility name or services query
  - `city`: Region filter
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "fac_1",
      "name": "The Nairobi Hospital",
      "facility_type": "Level 6 Tertiary Referral",
      "address": "Argwings Kodhek Rd, Upper Hill",
      "city": "Nairobi",
      "latitude": -1.2965,
      "longitude": 36.8055,
      "beds_available": 34,
      "emergency_phone": "+254 703 082 000"
    }
  ]
}
```

---

## Appointments

### List Appointments
- **Method**: `GET`
- **Path**: `/appointments`
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: Filter by status (`requested`, `accepted`, `completed`, `cancelled`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "apt_1",
      "patient_id": "usr_pat_1",
      "doctor_id": "doc_1",
      "scheduled_at": "2026-11-21T08:00:00Z",
      "type": "teleconsultation",
      "fee": 2500,
      "payment_status": "paid",
      "status": "accepted",
      "patient": {
        "id": "usr_pat_1",
        "display_name": "Sarah Achieng",
        "location": {
          "address": "Argwings Kodhek Rd, Kilimani, Nairobi",
          "distance_km": 3.2
        }
      }
    }
  ]
}
```

### Book Appointment
- **Method**: `POST`
- **Path**: `/appointments`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "doctor_id": "doc_1",
  "scheduled_at": "2026-11-25T10:00:00Z",
  "type": "teleconsultation",
  "reason": "Persistent dry cough for 3 days",
  "fee": 2500
}
```

### Update Appointment Status
- **Method**: `PATCH`
- **Path**: `/appointments/:id`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "status": "accepted",
  "cancelled_reason": ""
}
```

---

## Consultations and Clinical Chat

### Get Consultation Message Thread
- **Method**: `GET`
- **Path**: `/consultations/:id/messages`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "msg_1",
      "appointment_id": "apt_1",
      "sender_id": "usr_doc_1",
      "sender_name": "Dr. Brian Otieno, MD",
      "sender_role": "doctor",
      "content": "Habari Sarah, I have reviewed your clinical intake notes.",
      "timestamp": "2026-11-20T00:19:21Z"
    }
  ]
}
```

### Send Consultation Message
- **Method**: `POST`
- **Path**: `/consultations/:id/messages`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "content": "Doctor, is it normal to experience mild fatigue following the first dose?",
  "attachment_url": null
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "id": "msg_1795133961079",
    "appointment_id": "apt_1",
    "sender_name": "Sarah Achieng",
    "sender_role": "patient",
    "content": "Doctor, is it normal to experience mild fatigue following the first dose?",
    "timestamp": "2026-11-20T00:19:21Z"
  },
  "message": "Message delivered"
}
```

### Record Telehealth Call Session
- **Method**: `POST`
- **Path**: `/consultations/:id/call-session`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "call_type": "video",
  "status": "active",
  "duration_seconds": 120
}
```

### Save SOAP Consultation Notes
- **Method**: `POST`
- **Path**: `/consultations/:appointmentId/notes`
- **Auth Required**: Yes (`role: doctor`)
- **Request Body**:
```json
{
  "chief_complaint": "Seasonal allergic rhinitis",
  "subjective_notes": "Mild nasal congestion, dry nighttime cough",
  "objective_findings": "Clear lung fields, normal temperature",
  "clinical_assessment": "Upper respiratory allergic reaction",
  "plan_and_recommendations": "Prescribed Cetirizine 10mg once daily",
  "prescription_notes": "Cetirizine 10mg PO OD x 7 days",
  "outcome": "completed"
}
```

---

## Patient Location and Geolocation

### Get Patient Location
- **Method**: `GET`
- **Path**: `/patients/me/location`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "latitude": -1.2921,
    "longitude": 36.7842,
    "address": "Argwings Kodhek Rd, Kilimani, Nairobi",
    "area": "Kilimani",
    "city": "Nairobi",
    "last_updated": "2026-11-20T01:21:34Z"
  }
}
```

### Update Patient Location
- **Method**: `PATCH`
- **Path**: `/patients/me/location`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "latitude": -1.2921,
  "longitude": 36.7842,
  "address": "Argwings Kodhek Rd, Kilimani, Nairobi",
  "area": "Kilimani",
  "city": "Nairobi"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "latitude": -1.2921,
    "longitude": 36.7842,
    "address": "Argwings Kodhek Rd, Kilimani, Nairobi",
    "area": "Kilimani",
    "city": "Nairobi",
    "last_updated": "2026-11-20T01:21:34Z"
  },
  "message": "Patient location updated and synced with doctors"
}
```

---

## Multi-Method Payments

### Create Payment Intent
- **Method**: `POST`
- **Path**: `/payments/intents`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "appointment_id": "apt_1",
  "method": "mpesa",
  "phone_number": "+254712345678"
}
```
*Supported `method` values*: `mpesa`, `card`, `bank`, `crypto`

- **Response** (`201 Created`):
```json
{
  "success": true,
  "data": {
    "payment_id": "pay_1795133996472",
    "method": "mpesa",
    "amount": 2500,
    "checkout_request_id": "ws_CO_20261120_179513",
    "phone_number": "+254 712 345 678",
    "appointment_id": "apt_1"
  },
  "message": "MPESA payment initiated"
}
```

### Simulate Sandbox Confirmation
- **Method**: `POST`
- **Path**: `/payments/simulate-sandbox-confirmation/:id`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "method": "card",
  "appointment_id": "apt_1"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "status": "completed",
    "payment_method": "card",
    "provider_reference": "TX_CARD_22630637",
    "completed_at": "2026-11-20T01:21:09Z"
  },
  "message": "Payment verified successfully"
}
```

---

## Symptom Intake and Clinical Triage

### Submit Symptom Assessment
- **Method**: `POST`
- **Path**: `/symptoms/intake`
- **Auth Required**: No (Accessible to patients before registration)
- **Request Body**:
```json
{
  "main_concern": "Persistent fever and frontal headache for 48 hours",
  "onset": "2 days ago",
  "severity": 6,
  "associated_symptoms": ["mild nausea", "sensitivity to light"],
  "current_medications": "Paracetamol 500mg",
  "medical_history": "None",
  "selected_red_flags": []
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "triage_category": "Standard Clinical Review",
    "urgency": "moderate",
    "red_flags_present": false,
    "summary": "Patient presenting with acute onset fever and headache.",
    "suggested_specialists": ["General Practitioner", "Internal Medicine"],
    "action_plan": "Schedule a teleconsultation for physician assessment."
  }
}
```

---

## Medical Records

### Get Patient Records Vault
- **Method**: `GET`
- **Path**: `/patients/me/records`
- **Auth Required**: Yes
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": [
    {
      "id": "rec_1",
      "record_type": "Consultation Note",
      "title": "Primary Care Assessment — Headache & Wellness",
      "date": "May 14, 2026",
      "facility_name": "The Nairobi Hospital",
      "created_by": "Dr. David Kiprop, MBChB",
      "summary": "Blood pressure 118/76 mmHg. Recommended hydration and screen-rest schedule."
    }
  ]
}
```

---

## Recovery Tracking

### Get Care Plans
- **Method**: `GET`
- **Path**: `/follow-ups`
- **Auth Required**: Yes

### Submit Daily Check-In
- **Method**: `POST`
- **Path**: `/follow-ups/:id/responses`
- **Auth Required**: Yes
- **Request Body**:
```json
{
  "symptom_status": "slightly_better",
  "pain_score": 3,
  "patient_notes": "Dry cough subsided after taking medication with warm water."
}
```

---

## Voice Intelligence Suite

### Voice Status and Capabilities
- **Method**: `GET`
- **Path**: `/voice/status`
- **Auth Required**: No
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "provider": "MsingiAI Sauti Speech Platform",
    "base_url": "https://api.msingiai.com",
    "configured": true,
    "api_healthy": true,
    "supported_voices": ["male", "female3"],
    "actions_supported": [
      "search_doctor",
      "book_appointment",
      "find_facility",
      "emergency_escalation",
      "symptom_intake",
      "view_appointments",
      "launch_consultation_room",
      "pay_multi_method",
      "share_location",
      "view_records",
      "recovery_tracking",
      "switch_role"
    ]
  }
}
```

### Transcribe Audio (ASR)
- **Method**: `POST`
- **Path**: `/voice/transcribe`
- **Auth Required**: No
- **Request Body**:
```json
{
  "audio_base64": "<base64_wav_bytes>",
  "mime_type": "audio/wav"
}
```

### Synthesize Speech (TTS)
- **Method**: `POST`
- **Path**: `/voice/synthesize`
- **Auth Required**: No
- **Request Body**:
```json
{
  "text": "Opening appointment booking for Dr. Brian Otieno.",
  "voice_id": "female3"
}
```
- **Response**: Binary audio bytes (`Content-Type: audio/wav`) or JSON fallback object.

### Natural Language Voice Command Engine
- **Method**: `POST`
- **Path**: `/voice/command`
- **Auth Required**: No
- **Request Body**:
```json
{
  "query": "Book appointment with Dr. Brian Otieno",
  "current_path": "/patient/dashboard"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "intent": "BOOK_APPOINTMENT",
    "action": "BOOK_DOCTOR",
    "target_route": "/patient/find-doctor?book=doc_1",
    "spoken_response": "Opening appointment booking modal for Dr. Brian Otieno.",
    "payload": {
      "doctor_id": "doc_1",
      "doctor_name": "Dr. Brian Otieno, MD"
    },
    "query": "Book appointment with Dr. Brian Otieno"
  }
}
```

---

## Emergency and Notifications

### List Notifications
- **Method**: `GET`
- **Path**: `/notifications`
- **Auth Required**: Yes
- **Query Parameters**: `unread_only=true|false`

### Mark All Read
- **Method**: `POST`
- **Path**: `/notifications/read-all`
- **Auth Required**: Yes

### Get Emergency Directory
- **Method**: `GET`
- **Path**: `/emergencies`
- **Auth Required**: No
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "disclaimer": "For life-threatening emergencies, call national dispatch immediately.",
    "hotlines": [
      { "name": "National Emergency Police & Ambulance", "number": "999", "toll_free": true },
      { "name": "Emergency Medical Response", "number": "112", "toll_free": true },
      { "name": "Kenya Red Cross Emergency Dispatch", "number": "1199", "toll_free": true }
    ],
    "primary_trauma_centers": [
      {
        "name": "Kenyatta National Hospital — Level 6 Trauma Center",
        "city": "Nairobi",
        "address": "Hospital Road, Upper Hill",
        "phone": "+254 20 2726300",
        "hours": "24/7 Casualty & Resuscitation"
      }
    ]
  }
}
```
