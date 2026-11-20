export type UserRole = 'patient' | 'doctor' | 'facility_admin' | 'platform_admin';

export interface User {
  id: string;
  email: string;
  phone?: string;
  role: UserRole;
  status: string;
  created_at?: string;
  profile?: any;
}

export interface PatientProfile {
  id: string;
  user_id: string;
  display_name: string;
  date_of_birth?: string;
  gender?: string;
  blood_group?: string;
  language: string;
  emergency_contact?: string;
  medical_allergies?: string;
}

export interface AvailabilitySlot {
  id: string;
  doctor_id: string;
  start_at: string;
  end_at: string;
  status: 'available' | 'booked' | 'blocked';
}

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  speciality: string;
  registration_number: string;
  verification_status: 'verified' | 'pending' | 'rejected';
  bio?: string;
  fee: number;
  avatar_url?: string;
  clinic_address?: string;
  city: string;
  languages: string[];
  consultation_types: string[];
  rating: number;
  review_count: number;
  experience_years: number;
  hospital_affiliation?: string;
  latitude?: number;
  longitude?: number;
  available_slots?: AvailabilitySlot[];
}

export interface Facility {
  id: string;
  name: string;
  facility_type: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  phone: string;
  emergency_phone?: string;
  email?: string;
  verification_status: string;
  operating_hours: string;
  services: string[];
  image_url?: string;
  rating: number;
  beds_available: number;
}

export interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  facility_id?: string;
  slot_id?: string;
  status: 'requested' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  type: 'in_person' | 'teleconsultation';
  fee: number;
  payment_status: 'unpaid' | 'paid' | 'refunded';
  scheduled_at: string;
  reason?: string;
  meeting_link?: string;
  cancelled_reason?: string;
  created_at?: string;
  doctor?: {
    id: string;
    full_name: string;
    speciality: string;
    avatar_url?: string;
    clinic_address?: string;
  };
  patient?: {
    id: string;
    display_name: string;
    email: string;
    phone?: string;
    location?: {
      latitude?: number;
      longitude?: number;
      address?: string;
      area?: string;
      city?: string;
      distance_km?: number;
    };
  };
  facility?: {
    id: string;
    name: string;
    address: string;
  };
  has_consultation?: boolean;
}

export interface Consultation {
  id: string;
  appointment_id: string;
  doctor_id: string;
  patient_id: string;
  started_at?: string;
  ended_at?: string;
  chief_complaint?: string;
  subjective_notes?: string;
  objective_findings?: string;
  clinical_assessment?: string;
  plan_and_recommendations?: string;
  prescription_notes?: string;
  outcome?: string;
  created_at?: string;
}

export interface MedicalRecord {
  id: string;
  patient_id: string;
  created_by: string;
  facility_name?: string;
  record_type: string;
  title: string;
  date: string;
  secure_file_key?: string;
  summary?: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface FollowUpResponse {
  id: string;
  follow_up_id: string;
  submitted_at: string;
  symptom_status: 'significantly_better' | 'slightly_better' | 'unchanged' | 'worse';
  pain_score?: number;
  answers?: Record<string, string>;
  patient_notes?: string;
  requires_escalation?: boolean;
}

export interface FollowUp {
  id: string;
  patient_id: string;
  clinician_id: string;
  clinician_name?: string;
  appointment_id?: string;
  due_at: string;
  title: string;
  instructions?: string;
  questions: string[];
  status: 'pending' | 'submitted' | 'escalated';
  responses?: FollowUpResponse[];
  created_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'appointment' | 'payment' | 'follow_up' | 'alert' | 'info';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface EmergencyDirectory {
  disclaimer: string;
  hotlines: Array<{
    name: string;
    number: string;
    toll_free: boolean;
    alt?: string;
  }>;
  primary_trauma_centers: Array<{
    name: string;
    city: string;
    address: string;
    phone: string;
    hours: string;
  }>;
}

export interface ConsultationMessage {
  id: string;
  appointment_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: 'doctor' | 'patient';
  content: string;
  attachment_url?: string | null;
  timestamp: string;
}

export interface CallSession {
  session_id: string;
  appointment_id: string;
  call_type: 'video' | 'voice';
  status: 'active' | 'ended';
  duration_seconds: number;
  timestamp: string;
}
