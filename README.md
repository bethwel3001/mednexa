# MedNexa — Modern Healthcare Access & Coordination Platform

> Sleek, accessible digital healthcare connecting patients in Kenya with verified medical doctors, casualty hospital centers, teleconsultations, and M-Pesa payments.
> Featuring a floating circular navigation inspired by **truerev**, clean aesthetics inspired by **Mainstack**, and bilingual **Speech-to-Speech AI** powered by **MsingiAI (Sauti ASR & TTS)**.

---

## 🎨 Design Philosophy (truerev & Mainstack.com)

- **Floating Circular Pill Navbar**: Inspired by `truerev`, the navigation floats cleanly at the top (`rounded-full border border-[#E8E6DD]/90 bg-white/95 px-3 py-1.5 shadow-soft backdrop-blur-xl max-w-5xl mx-auto`).
- **Creative Brand Monogram**: An obsidian ink circle with an italic serif `m` in soft electric lime (`#D9F99D`), paired with modern lowercase typography `mednexa.`.
- **Zero Navbar Clutter**: No distracting role badges or walls of text in the navbar; clean, high-signal links only (`Find Doctors`, `Hospitals & Casualty`, `Symptom Check`, `Emergency 999`).
- **Sleek Dark Card Footer**: Full-width rounded card (`rounded-[32px] bg-[#161613] p-10 text-white`) with direct emergency hotlines (`999`, `112`, `1199`) and clinical standards.

---

## 🎙️ Speech-to-Speech Feature (Powered by MsingiAI)

Positioned directly next to the **Find** button in the care finder and accessible via a floating trigger on all pages:
- **Platform**: Uses **MsingiAI** (`https://api.msingiai.com`), Africa's leading voice intelligence platform specializing in Swahili and code-switching speech.
- **Sauti ASR (Automatic Speech Recognition)**: Transcribes spoken Swahili/English voice notes and commands into structured text.
- **Sauti TTS (Text-to-Speech)**: Synthesizes natural spoken voice responses in Swahili/English (`male` / `female3`).
- **Full App Action Execution via Voice**:
  - *"Natafuta daktari wa watoto Nairobi"* → Searches & filters pediatricians in Nairobi.
  - *"Book consultation with Dr. Brian Otieno"* → Opens appointment booking modal for Dr. Brian.
  - *"Nearest hospital casualty in Mombasa"* → Opens Level 6 emergency casualty directory.
  - *"Severe chest pain (Emergency 999)"* → Triggers emergency escalation and dials `999 / 112`.
  - *"Check my symptoms (Fever & headache)"* → Launches guided clinical symptom intake.
  - *"Lipa na M-Pesa"* → Triggers M-Pesa STK push checkout for appointment.
  - *"Switch to doctor console"* → Changes active role to Dr. Brian Otieno.

---

## 🚀 Core Platform Features

1. **Verified Physician Directory**:
   - Filter by specialty (Pediatrics, Cardiology, Ob/Gyn, Orthopedics, Family Medicine) and city (Nairobi, Mombasa, Kisumu).
   - Real KMPDC license registration numbers (e.g. `KMPDC-A4821`), clinic locations, and transparent KES fees.
   - Dual-view interface: interactive OpenStreetMap pins alongside responsive cards.

2. **Teleconsultation & In-Clinic Booking**:
   - Concurrency-safe calendar slot selection.
   - One-click launch for virtual consultation rooms (`https://meet.mednexa.health/...`).
   - Attending doctor SOAP notes recorder (Subjective, Objective, Assessment, Plan) with prescription logs.

3. **Clinically-Governed Symptom Intake & Red-Flag Escalation**:
   - Structured patient intake briefing (chief complaint, onset, severity, associated symptoms).
   - Deterministic red-flag safety screen: immediately intercepts critical indicators (crushing chest pain, shortness of breath, acute neurological deficits) and directs to national emergency dispatch (**999 / 112 / Red Cross 1199**).

4. **Safaricom M-Pesa STK Push Sandbox**:
   - Realistic mobile checkout flow with phone input, real-time STK push simulation prompt, and instant receipt reconciliation (`QK...`).

5. **24/7 Casualty & Hospital Directory**:
   - Direct-dial access to certified Level 6 & trauma casualty units across Kenya (The Nairobi Hospital, Aga Khan University Hospital, Coast General, JOOTRH Kisumu).

6. **Post-Consultation Recovery Monitoring**:
   - Patient daily recovery check-ins (pain score, symptom progression).
   - Automatic escalation alert triggered to the attending physician if symptoms deteriorate.

---

## ⚡ Quick Start

### 1. Backend Server
```bash
cd backend
npm install
node server.js
# API running on http://127.0.0.1:5000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
# Frontend running on http://localhost:5173
```

To build for production:
```bash
cd frontend
npm run build
```

---

## 👥 Demo Personas

| Role | Email | Password | Persona |
| :--- | :--- | :--- | :--- |
| **Patient** | `patient@mednexa.com` | `Password123!` | Sarah Achieng (Nairobi) |
| **Doctor** | `doctor@mednexa.com` | `Password123!` | Dr. Brian Otieno, MD (Pediatrics & Family Medicine) |
| **Facility Admin** | `admin@mednexa.com` | `Password123!` | The Nairobi Hospital Administration |

---

## 📋 Key API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/voice/status` | MsingiAI Sauti ASR/TTS connection status |
| `POST` | `/api/v1/voice/transcribe` | Sauti ASR audio-to-text transcription |
| `POST` | `/api/v1/voice/synthesize` | Sauti TTS text-to-speech WAV audio synthesis |
| `POST` | `/api/v1/voice/command` | Natural voice intent recognition and action execution |
| `GET` | `/api/v1/doctors` | Query verified physicians with filters |
| `GET` | `/api/v1/facilities` | List hospitals and accredited casualty centers |
| `GET` / `POST` | `/api/v1/appointments` | List or book appointments with slot concurrency checks |
| `POST` | `/api/v1/payments/intents` | Initiate Safaricom M-Pesa Express STK Push |
| `GET` | `/api/v1/emergencies` | Kenyan national emergency hotlines and trauma facilities |
