const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://mednexa-5jk0.onrender.com/api/v1'
    : 'http://127.0.0.1:5000/api/v1');

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('mednexa_token');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('mednexa_token', token);
    } else {
      localStorage.removeItem('mednexa_token');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.error?.message || `Request failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return data?.data as T;
  }

  // Auth
  async login(payload: any) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async register(payload: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getMe() {
    return this.request<any>('/auth/me');
  }

  // Doctors
  async getDoctors(params: { q?: string; speciality?: string; city?: string; max_fee?: number } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.speciality) query.set('speciality', params.speciality);
    if (params.city) query.set('city', params.city);
    if (params.max_fee) query.set('max_fee', params.max_fee.toString());

    return this.request<any[]>(`/doctors?${query.toString()}`);
  }

  async getDoctor(id: string) {
    return this.request<any>(`/doctors/${id}`);
  }

  async getMyAvailability() {
    return this.request<any[]>('/doctors/me/availability');
  }

  async addAvailability(payload: { start_at: string; duration_minutes?: number }) {
    return this.request<any>('/doctors/me/availability', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Facilities
  async getFacilities(params: { q?: string; city?: string; type?: string } = {}) {
    const query = new URLSearchParams();
    if (params.q) query.set('q', params.q);
    if (params.city) query.set('city', params.city);
    if (params.type) query.set('type', params.type);

    return this.request<any[]>(`/facilities?${query.toString()}`);
  }

  async getFacility(id: string) {
    return this.request<any>(`/facilities/${id}`);
  }

  // Appointments
  async requestAppointment(payload: {
    doctor_id: string;
    slot_id?: string;
    scheduled_at?: string;
    type?: 'in_person' | 'teleconsultation';
    reason?: string;
    facility_id?: string;
  }) {
    return this.request<any>('/appointments', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async getAppointments(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<any[]>(`/appointments${query}`);
  }

  async updateAppointmentStatus(id: string, status: string, cancelled_reason?: string) {
    return this.request<any>(`/appointments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, cancelled_reason }),
    });
  }

  // Consultations
  async getConsultation(appointmentId: string) {
    return this.request<any>(`/consultations/${appointmentId}`);
  }

  async saveConsultationNotes(appointmentId: string, payload: any) {
    return this.request<any>(`/consultations/${appointmentId}/notes`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Follow-ups
  async getFollowUps() {
    return this.request<any[]>('/follow-ups');
  }

  async createFollowUp(payload: any) {
    return this.request<any>('/follow-ups', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async submitFollowUpResponse(followUpId: string, payload: any) {
    return this.request<any>(`/follow-ups/${followUpId}/responses`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Medical records
  async getMyRecords() {
    return this.request<any[]>('/patients/me/records');
  }

  // AI Symptom Intake
  async submitSymptomIntake(payload: {
    main_concern: string;
    onset?: string;
    severity?: number;
    associated_symptoms?: string[];
    current_medications?: string;
    medical_history?: string;
    impact_on_daily_life?: string;
    selected_red_flags?: string[];
  }) {
    return this.request<any>('/ai/symptom-intake', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Payments (M-Pesa, Credit/Debit Card, Bank Transfer, Bitcoin/Crypto)
  async createPaymentIntent(payload: {
    appointment_id: string;
    method?: 'mpesa' | 'card' | 'bank' | 'crypto';
    phone_number?: string;
    card_details?: any;
    bank_name?: string;
    crypto_currency?: string;
  }) {
    return this.request<any>('/payments/intents', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async simulatePaymentConfirmation(paymentId: string, payload: any = {}) {
    return this.request<any>(`/payments/simulate-sandbox-confirmation/${paymentId}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Consultation Chat, Video & Voice Call
  async getConsultationMessages(appointmentId: string) {
    return this.request<any[]>(`/consultations/${appointmentId}/messages`);
  }

  async sendConsultationMessage(appointmentId: string, content: string, attachmentUrl?: string) {
    return this.request<any>(`/consultations/${appointmentId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content, attachment_url: attachmentUrl }),
    });
  }

  async recordCallSession(appointmentId: string, payload: any) {
    return this.request<any>(`/consultations/${appointmentId}/call-session`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Emergencies
  async getEmergencies() {
    return this.request<any>('/emergencies');
  }

  async recordEmergencyAccess(payload: any = {}) {
    return this.request<any>('/emergencies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Notifications
  async getNotifications(unread_only: boolean = false) {
    return this.request<{ notifications: any[]; unread_count: number }>(`/notifications?unread_only=${unread_only}`);
  }

  async markNotificationRead(id: string) {
    return this.request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsRead() {
    return this.request<any>('/notifications/read-all', {
      method: 'POST',
    });
  }

  // MsingiAI Speech-to-Speech Platform APIs
  async getVoiceStatus(apiKey?: string) {
    const headers: Record<string, string> = {};
    if (apiKey) headers['x-msingi-key'] = apiKey;
    return this.request<any>('/voice/status', { headers });
  }

  async transcribeAudio(audioBase64: string, apiKey?: string) {
    const headers: Record<string, string> = {};
    if (apiKey) headers['x-msingi-key'] = apiKey;
    return this.request<any>('/voice/transcribe', {
      method: 'POST',
      headers,
      body: JSON.stringify({ audio_base64: audioBase64 }),
    });
  }

  async synthesizeSpeech(text: string, voiceId: string = 'male', apiKey?: string) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiKey) headers['x-msingi-key'] = apiKey;
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE_URL}/voice/synthesize`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text, voice_id: voiceId }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('audio/wav') || contentType.includes('audio/')) {
      const blob = await res.blob();
      return { audioUrl: URL.createObjectURL(blob), fallback: false };
    }

    const data = await res.json();
    return { fallback: true, text: data?.data?.text || text };
  }

  async processVoiceCommand(query: string, currentPath: string = '/') {
    return this.request<{
      intent: string;
      action: string;
      target_route: string;
      spoken_response: string;
      payload: any;
      query: string;
    }>('/voice/command', {
      method: 'POST',
      body: JSON.stringify({ query, current_path: currentPath }),
    });
  }

  // Location Access & Tracking
  async getPatientLocation() {
    return this.request<{
      latitude: number;
      longitude: number;
      address: string;
      area?: string;
      city: string;
      last_updated?: string;
    }>('/patients/me/location');
  }

  async updatePatientLocation(payload: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    area?: string;
  }) {
    return this.request<any>('/patients/me/location', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  }
}

export const api = new ApiService();
