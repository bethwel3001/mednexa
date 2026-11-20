# MedNexa

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React_18-20232A?logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?logo=leaflet&logoColor=white)](https://leafletjs.com/)

MedNexa is a full-stack digital healthcare coordination platform designed to address critical access barriers in outpatient care delivery, specialist scheduling, clinical triage, and emergency response across Kenya and the wider East African region.

---

## Table of Contents

- [Problem Statement](#problem-statement)
- [What the Platform Does](#what-the-platform-does)
- [Technical Architecture](#technical-architecture)
- [Technology Stack](#technology-stack)
- [Directory Structure](#directory-structure)
- [Installation and Setup](#installation-and-setup)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [Clinical Safety Notice](#clinical-safety-notice)

---

## Problem Statement

Healthcare delivery in Kenya and East Africa faces multiple structural access bottlenecks:

1. **Fragmented Provider Discovery**: Patients lack a centralized, verified register of medical specialists and accredited healthcare facilities. Locating licensed clinicians (registered with the Kenya Medical Practitioners and Dentists Council — KMPDC) often depends on informal recommendations.
2. **Geographical and Wait-Time Barriers**: Outpatient facilities frequently experience prolonged waiting room queues. For non-emergency consultations, travel to urban tertiary hubs imposes significant indirect financial and time costs.
3. **Inadequate Clinical Telehealth Infrastructure**: Consumer messaging applications lack clinical governance, integrated electronic medical records (EMR), structured SOAP note recording, and automated emergency interception.
4. **Rigid Payment Rail Integration**: Outpatient consultations require immediate settlement, yet many digital systems fail to support diverse local and international payment methods (mobile money, debit/credit cards, electronic bank transfers, and digital currencies for diaspora family support).
5. **Delayed Acute Triage**: Patients experiencing life-threatening symptoms frequently fail to recognize deterministic red-flag indicators, delaying critical hospital casualty admission.

---

## What the Platform Does

MedNexa unifies the primary clinical journey into a coherent, high-reliability web platform:

### 1. Verified Clinician Directory and Scheduling
- Search and filter licensed clinicians by clinical specialty (Pediatrics, Cardiology, Orthopedics, Family Medicine, Internal Medicine) and city (Nairobi, Mombasa, Kisumu).
- View verified credentials, KMPDC license identifiers, consultation fees in KES, and clinic addresses.
- Book both teleconsultation sessions and in-clinic physical visits with conflict-checked calendar slots.

### 2. Telehealth Consultation Room
- Integrated consultation modal offering three distinct communication channels:
  - **Live Clinical Chat**: Encrypted text exchange with simulated clinician response handling and diagnostic attachment support.
  - **Video Telehealth**: Two-way video call interface with self-view picture-in-picture, camera/mic toggling, and call duration counters.
  - **HD Voice Call**: Audio-only room with animated frequency equalizer and call management controls.
- **Clinician SOAP Notes Recorder**: Attending physicians can slide open an integrated documentation panel during live consultations to file Subjective notes, Objective findings, Clinical Assessments, and Management Plans directly into patient records.

### 3. Patient Geolocation and Facility Proximity
- Captures real-time patient coordinates via browser geolocation (`navigator.geolocation`).
- Automatically computes Haversine distances to nearby clinics and Level 6 referral hospitals (e.g., The Nairobi Hospital, Kenyatta National Hospital, Aga Khan University Hospital).
- Informs doctors of the patient's physical location and distance during consultation requests and active appointments.
- Provides a "Nearest First" sorting filter for accredited casualty and trauma facilities.

### 4. Speech-to-Speech Voice Assistant
- Powered by MsingiAI Sauti ASR and TTS with automated hybrid fallback to browser speech engines.
- Enables patients to speak health commands in English or Swahili and have actions executed automatically:
  - *"Book appointment with Dr. Brian Otieno"* -> Navigates and opens the booking modal.
  - *"Start video call with my doctor"* -> Navigates and opens the video consultation room.
  - *"Find nearest hospital casualty"* -> Navigates and filters nearest emergency centers.
  - *"Pay for my consultation"* -> Launches the multi-method payment modal.
  - *"Emergency 999"* -> Opens emergency guidance and broadcasts live GPS coordinates.

### 5. Multi-Method Payment Engine
- Supports flexible consultation settlement across four payment rails:
  - **Safaricom M-Pesa**: STK Push prompt simulation with authentic receipt codes.
  - **Credit and Debit Cards**: Visa and Mastercard processing with 3DS 2.0 verification simulation.
  - **Bank Transfer (EFT/PesaLink)**: Major Kenyan commercial banks (Equity, KCB, NCBA, Stanbic, Co-op).
  - **Bitcoin and Cryptocurrency**: Bitcoin (BTC) and Tether (USDT on TRC-20) with satoshi conversion and wallet verification.

### 6. Symptom Intake and Deterministic Red-Flag Triage
- Guided clinical intake protocol capturing chief complaint, onset timeline, symptom severity (1-10), and associated symptoms.
- Deterministic red-flag interception: identifies emergency patterns (crushing chest pain, severe dyspnea, focal neurological deficits, acute bleeding) and redirects immediately to national emergency dispatch (999, 112, Kenya Red Cross 1199).

---

## Technical Architecture

```
                       Browser Client (React 18 + Vite)
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
    Voice Engine            Geolocation Service        UI Components
 (SpeechRecognition /      (navigator.geolocation)    (Tailwind CSS)
  MsingiAI Hybrid)                  |                         |
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
                           REST API (HTTP/JSON)
                                    |
                      Backend Server (Node.js + Express)
                                    |
          +-------------------------+-------------------------+
          |                         |                         |
   Authentication             Consultations               Payments
    (JWT Tokens)           (Chat, Video, SOAP)      (M-Pesa, Card, Bank, BTC)
          |                         |                         |
          +-------------------------+-------------------------+
                                    |
                           Data and Services
    (In-Memory Relational Store + MsingiAI Speech Gateway + Geolocation)
```

---

## Technology Stack

### Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, PostCSS
- **Icons**: Lucide React
- **Mapping**: Leaflet, OpenStreetMap
- **Voice / Speech**: Web Speech API (`SpeechRecognition`, `SpeechSynthesis`), MediaRecorder API

### Backend
- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), Cryptographic IDs (`crypto.randomUUID`)
- **Voice Intelligence**: MsingiAI API integration (`https://api.msingiai.com`)
- **CORS**: Cross-Origin Resource Sharing enabled for frontend client integration

---

## Directory Structure

```
afya/
├── backend/
│   ├── .env.example              # Environment variables template
│   ├── package.json              # Backend dependencies and scripts
│   └── server.js                 # Express server, endpoints, and mock database
├── frontend/
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AppointmentCard.tsx
│   │   │   ├── AppShell.tsx
│   │   │   ├── BookingModal.tsx
│   │   │   ├── ConsultationModal.tsx
│   │   │   ├── ConsultationRoomModal.tsx
│   │   │   ├── FacilityCard.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── MapView.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   ├── ProviderCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   └── VoiceAssistantModal.tsx
│   │   ├── context/              # Global React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── LocationContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── pages/                # Route view components
│   │   │   ├── doctor/           # Clinician console and schedule
│   │   │   ├── emergency/        # Emergency hotlines and GPS broadcast
│   │   │   ├── facility/         # Hospital bed and triage dashboard
│   │   │   ├── patient/          # Patient dashboard, booking, consultations, records
│   │   │   ├── LandingPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   └── RegisterPage.tsx
│   │   ├── services/
│   │   │   └── api.ts            # Typed HTTP client for all backend endpoints
│   │   ├── types/
│   │   │   └── index.ts          # Domain interfaces and type contracts
│   │   ├── App.tsx               # Root route switcher and context providers
│   │   ├── main.tsx              # Application entrypoint
│   │   └── index.css             # Tailwind base styles and font imports
│   ├── index.html
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript compiler settings
│   └── vite.config.ts            # Vite bundler configuration
├── CONTRIBUTING.md               # Contribution and git commit guidelines
├── ENDPOINTS.md                  # Comprehensive REST endpoint specification
└── README.md                     # Project overview and documentation
```

---

## Installation and Setup

### 1. Prerequisites
- Node.js (version 18 or higher)
- npm (version 9 or higher)
- Git (version 2.30 or higher)

### 2. Clone the Repository
```bash
git clone https://github.com/bethwel3001/mednexa.git
cd mednexa
```

### 3. Backend Configuration and Launch
```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env

# Start backend server
node server.js
```
The backend server runs on `http://127.0.0.1:5000`.

### 4. Frontend Configuration and Launch
In a new terminal window:
```bash
cd frontend
npm install

# Start Vite development server
npm run dev
```
The frontend application will be accessible at `http://localhost:5173`.

### 5. Production Build Verification
To ensure all TypeScript typings and bundling passes cleanly:
```bash
npm run build
```

---

## Deployment Guide

The repository is configured to support both single-project unified deployment and split microservice deployment.

### Option A: Unified Full-Stack Vercel Deployment (Recommended)

The repository includes a root `vercel.json` and `api/index.js` serverless bridge that bundles both the React frontend and Express backend into a single Vercel deployment:

1. Import the repository in Vercel (`https://vercel.com/new`).
2. Leave **Root Directory** as `./` (do not select `frontend` or `backend`).
3. Vercel automatically detects `vercel.json`:
   - Builds frontend assets to `frontend/dist`.
   - Routes `/api/*` requests to the Express serverless function (`api/index.js`).
   - Serves the frontend application on all other paths.
4. Set Environment Variables in your Vercel project settings:
   - `JWT_SECRET`: A secure random string.
   - `MSINGI_API_KEY`: Your MsingiAI voice key.
5. Deploy. Both frontend and backend will be accessible on the exact same domain (e.g., `https://mednexa.vercel.app`), avoiding cross-origin (CORS) configuration.

### Option B: Split Service Deployment (Frontend on Vercel, Backend on Render/Railway)

If you prefer continuous Node.js server execution:

1. **Deploy Backend (e.g., on Render or Railway)**:
   - Connect the repository and set **Root Directory** to `backend`.
   - Build Command: `npm install`
   - Start Command: `node server.js`
   - Copy the published backend URL (e.g., `https://mednexa-api.onrender.com`).
2. **Deploy Frontend (on Vercel)**:
   - Connect the repository and set **Root Directory** to `frontend`.
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL`: `https://mednexa-api.onrender.com/api/v1`

---

## API Endpoints

A complete specification of all available backend endpoints, request payloads, query parameters, and response structures is documented in:

- [API Endpoints Specification](ENDPOINTS.md)

---

## Contributing

Guidelines on code standards, TypeScript rules, and Conventional Commit conventions are available in:

- [Contributing Guidelines](CONTRIBUTING.md)

---

## Clinical Safety Notice

MedNexa is designed for non-emergency scheduling, teleconsultations, and outpatient administrative coordination. It does not replace emergency medical triage. If you or someone you are assisting experiences acute chest pain, uncontrolled bleeding, sudden neurological weakness, or severe respiratory distress, immediately dial **999**, **112**, or proceed to the nearest tertiary hospital casualty department.
