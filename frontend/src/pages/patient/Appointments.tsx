import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { Appointment } from '../../types';
import { AppointmentCard } from '../../components/AppointmentCard';
import { PaymentModal } from '../../components/PaymentModal';
import { ConsultationRoomModal } from '../../components/ConsultationRoomModal';
import { useAuth } from '../../context/AuthContext';
import { Calendar, CheckCircle2, Clock, X, FileText, Loader2 } from 'lucide-react';

export const Appointments: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [payingAppointment, setPayingAppointment] = useState<Appointment | null>(null);
  const [viewingNotesAppointment, setViewingNotesAppointment] = useState<Appointment | null>(null);
  const [activeConsultationAppointment, setActiveConsultationAppointment] = useState<Appointment | null>(null);
  const [consultationInitialMode, setConsultationInitialMode] = useState<'chat' | 'video' | 'voice'>('chat');
  const [consultationNotes, setConsultationNotes] = useState<any>(null);
  const [notesLoading, setNotesLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await api.getAppointments();
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Voice Action Auto-Execution: auto-open room or payment modal
  useEffect(() => {
    if (appointments.length === 0) return;

    if (searchParams.get('openRoom') === 'true') {
      const mode = (searchParams.get('mode') as 'chat' | 'video' | 'voice') || 'chat';
      const targetAppt = appointments.find((a) => a.status === 'accepted') || appointments[0];
      if (targetAppt) {
        setActiveConsultationAppointment(targetAppt);
        setConsultationInitialMode(mode);
      }
    } else if (searchParams.get('pay') === 'true') {
      const unpaid = appointments.find((a) => a.payment_status === 'unpaid') || appointments[0];
      if (unpaid) {
        setPayingAppointment(unpaid);
      }
    }
  }, [appointments, searchParams]);

  const handleCancel = async (appt: Appointment) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    try {
      await api.updateAppointmentStatus(appt.id, 'cancelled', 'Cancelled by patient');
      setActionMsg('Appointment cancelled.');
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel appointment');
    }
  };

  const handleViewNotes = async (appt: Appointment) => {
    setViewingNotesAppointment(appt);
    setNotesLoading(true);
    try {
      const notes = await api.getConsultation(appt.id);
      setConsultationNotes(notes);
    } catch (err) {
      setConsultationNotes(null);
    } finally {
      setNotesLoading(false);
    }
  };

  const isDoctor = user?.role === 'doctor';

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'requested' || a.status === 'accepted'
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled' || a.status === 'declined'
  );

  const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Consultations & Visits
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Manage your teleconsultation links, in-clinic schedules, and doctor notes.
          </p>
        </div>

        {/* Tab Switcher (Mainstack Segmented Pill) */}
        <div className="flex items-center gap-1 bg-[#F4F5F7] p-1 rounded-full border border-[#E9EBEF]">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-[#131316] shadow-xs'
                : 'text-[#56616B] hover:text-[#131316]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Upcoming ({upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-white text-[#131316] shadow-xs'
                : 'text-[#56616B] hover:text-[#131316]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#8C94A0]" />
            <span>Past History ({pastAppointments.length})</span>
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-between shadow-xs">
          <span>{actionMsg}</span>
          <button onClick={() => setActionMsg(null)} className="font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Appointment Cards */}
      {loading ? (
        <div className="py-16 text-center text-[#8C94A0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#131316]" />
          <p className="text-xs">Loading consultations...</p>
        </div>
      ) : displayedAppointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EFF1F6]">
          <Calendar className="w-10 h-10 text-[#CBD0D6] mx-auto mb-3" />
          <h3 className="font-bold text-[#131316] text-sm mb-1">
            No {activeTab} consultations found
          </h3>
          <p className="text-xs text-[#8C94A0] max-w-sm mx-auto">
            {activeTab === 'upcoming'
              ? 'You do not have any consultations currently scheduled.'
              : 'You have no past consultation records.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              isDoctorView={isDoctor}
              onPay={(item) => setPayingAppointment(item)}
              onCancel={handleCancel}
              onViewNotes={handleViewNotes}
              onJoinRoom={(item, mode) => {
                setActiveConsultationAppointment(item);
                setConsultationInitialMode(mode);
              }}
            />
          ))}
        </div>
      )}

      {/* Consultation Room Modal (Chat, Video, Voice) */}
      {activeConsultationAppointment && (
        <ConsultationRoomModal
          appointment={activeConsultationAppointment}
          initialMode={consultationInitialMode}
          onClose={() => setActiveConsultationAppointment(null)}
        />
      )}

      {/* Payment Modal */}
      {payingAppointment && (
        <PaymentModal
          appointment={payingAppointment}
          onClose={() => setPayingAppointment(null)}
          onSuccess={() => {
            fetchAppointments();
          }}
        />
      )}

      {/* View Doctor Notes Modal */}
      {viewingNotesAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EFF1F6] shadow-2xl overflow-hidden p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => {
                setViewingNotesAppointment(null);
                setConsultationNotes(null);
              }}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F4F5F7] text-[#8C94A0] hover:text-[#131316] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#EFF1F6]">
              <div className="w-10 h-10 rounded-2xl bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#131316] text-base">Doctor Consultation Record</h3>
                <p className="text-xs text-[#8C94A0]">
                  {viewingNotesAppointment.doctor?.full_name}
                </p>
              </div>
            </div>

            {notesLoading ? (
              <div className="py-8 text-center text-xs text-[#8C94A0]">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#131316]" />
                Loading notes...
              </div>
            ) : consultationNotes ? (
              <div className="space-y-3.5 text-xs">
                <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6]">
                  <span className="font-bold text-[#8C94A0] uppercase tracking-wider block text-[10px] mb-1">
                    Chief Complaint
                  </span>
                  <p className="text-[#131316] font-medium">{consultationNotes.chief_complaint || 'N/A'}</p>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6]">
                  <span className="font-bold text-[#8C94A0] uppercase tracking-wider block text-[10px] mb-1">
                    Clinical Assessment & Diagnosis
                  </span>
                  <p className="text-[#131316] font-medium">{consultationNotes.clinical_assessment || 'N/A'}</p>
                </div>

                <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#EFF1F6]">
                  <span className="font-bold text-[#8C94A0] uppercase tracking-wider block text-[10px] mb-1">
                    Management Plan & Follow-Up
                  </span>
                  <p className="text-[#131316] font-medium">{consultationNotes.plan_and_recommendations || 'N/A'}</p>
                </div>

                {consultationNotes.prescription_notes && (
                  <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-emerald-950">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider block text-[10px] mb-1">
                      Prescription / Orders
                    </span>
                    <p className="font-medium">{consultationNotes.prescription_notes}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#8C94A0]">
                No notes have been submitted for this consultation.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
