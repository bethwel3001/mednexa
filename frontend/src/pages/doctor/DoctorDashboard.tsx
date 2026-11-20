import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Appointment } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import { ConsultationModal } from '../../components/ConsultationModal';
import { ConsultationRoomModal } from '../../components/ConsultationRoomModal';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Video,
  Loader2,
  Plus,
  ArrowRight,
  MessageSquare,
  MapPin
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointmentForConsult, setSelectedAppointmentForConsult] = useState<Appointment | null>(null);
  const [activeConsultationAppointment, setActiveConsultationAppointment] = useState<Appointment | null>(null);
  const [consultationMode, setConsultationMode] = useState<'chat' | 'video' | 'voice'>('chat');
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

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId: string, status: string) => {
    try {
      await api.updateAppointmentStatus(appointmentId, status);
      setActionMsg(`Appointment marked as ${status}.`);
      fetchAppointments();
    } catch (err: any) {
      alert(err.message || 'Status update failed');
    }
  };

  const pendingRequests = appointments.filter((a) => a.status === 'requested');
  const confirmedAppointments = appointments.filter((a) => a.status === 'accepted');
  const completedAppointments = appointments.filter((a) => a.status === 'completed');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Dr. Brian Otieno MD — Clinician Console
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Review incoming consultation requests, record clinical progress notes, and manage patient appointments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/doctor/schedule"
            className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Manage Schedule</span>
          </Link>
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

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Awaiting Decision</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">{pendingRequests.length}</div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">Pending approval</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Confirmed Scheduled</span>
            <Calendar className="w-4 h-4 text-[#131316]" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">{confirmedAppointments.length}</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Ready for consultation</span>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed Consultations</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">{completedAppointments.length}</div>
          <span className="text-[11px] text-[#56616B] font-medium mt-1 block">Notes filed to vault</span>
        </div>
      </div>

      {/* Pending Requests Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <h3 className="font-bold text-[#131316] text-base">
          Incoming Consultation Requests ({pendingRequests.length})
        </h3>

        {pendingRequests.length === 0 ? (
          <p className="text-xs text-[#8C94A0] py-6 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E9EBEF]">
            No pending patient requests awaiting response.
          </p>
        ) : (
          <div className="divide-y divide-[#EFF1F6]">
            {pendingRequests.map((req) => (
              <div
                key={req.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#131316] text-sm">
                      {req.patient?.display_name || 'Patient'}
                    </h4>
                    <span className="text-[10px] font-bold uppercase bg-[#F4F5F7] text-[#56616B] px-2.5 py-0.5 rounded-full">
                      {req.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#8C94A0] mt-1">
                    Requested for: {new Date(req.scheduled_at).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-[#131316] mt-1 font-medium">
                    Reason: "{req.reason || 'General medical evaluation'}"
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStatus(req.id, 'accepted')}
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Accept Request</span>
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(req.id, 'declined')}
                    className="inline-flex items-center gap-1.5 bg-[#FFF1F2] hover:bg-rose-100 text-[#E11D48] text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmed Appointments & Clinical Records Queue */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <h3 className="font-bold text-[#131316] text-base">
          Active Consultations & Clinical Note Recording
        </h3>

        {confirmedAppointments.length === 0 ? (
          <p className="text-xs text-[#8C94A0] py-6 text-center bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E9EBEF]">
            No confirmed appointments currently in queue.
          </p>
        ) : (
          <div className="divide-y divide-[#EFF1F6]">
            {confirmedAppointments.map((appt) => (
              <div
                key={appt.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#131316] text-sm">
                      {appt.patient?.display_name || 'Patient'}
                    </h4>
                    <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      Confirmed
                    </span>
                  </div>
                  <p className="text-xs text-[#8C94A0] mt-1">
                    Scheduled: {new Date(appt.scheduled_at).toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-[#56616B] mt-1">
                    Reason: {appt.reason || 'Primary health evaluation'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-[#DFF2E4] text-emerald-950 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                      <MapPin className="w-3 h-3 text-emerald-700" />
                      <span>{appt.patient?.location?.address || 'Kilimani, Nairobi'}</span>
                      <span className="font-bold text-emerald-800">• {appt.patient?.location?.distance_km ?? 3.2} km from clinic</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => {
                      setActiveConsultationAppointment(appt);
                      setConsultationMode('chat');
                    }}
                    className="inline-flex items-center gap-1.5 bg-[#161613] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#D9F99D]" />
                    <span>Enter Room</span>
                  </button>

                  <button
                    onClick={() => {
                      setActiveConsultationAppointment(appt);
                      setConsultationMode('video');
                    }}
                    className="inline-flex items-center gap-1 bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                  >
                    <Video className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Video</span>
                  </button>

                  <button
                    onClick={() => setSelectedAppointmentForConsult(appt)}
                    className="inline-flex items-center gap-1.5 bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#56616B]" />
                    <span>SOAP Notes</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Live Consultation Room Modal (Chat, Video, Voice) */}
      {activeConsultationAppointment && (
        <ConsultationRoomModal
          appointment={activeConsultationAppointment}
          initialMode={consultationMode}
          onClose={() => setActiveConsultationAppointment(null)}
        />
      )}

      {/* Consultation Record Modal */}
      {selectedAppointmentForConsult && (
        <ConsultationModal
          appointment={selectedAppointmentForConsult}
          onClose={() => setSelectedAppointmentForConsult(null)}
          onSuccess={() => {
            setActionMsg('Consultation record filed and medical note updated.');
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
};
