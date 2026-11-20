import React from 'react';
import { Appointment } from '../types';
import { StatusBadge } from './StatusBadge';
import { Calendar, Clock, Video, MapPin, CreditCard, FileText, MessageSquare, Mic } from 'lucide-react';

interface AppointmentCardProps {
  appointment: Appointment;
  isDoctorView?: boolean;
  onPay?: (appointment: Appointment) => void;
  onCancel?: (appointment: Appointment) => void;
  onRecordNotes?: (appointment: Appointment) => void;
  onViewNotes?: (appointment: Appointment) => void;
  onJoinRoom?: (appointment: Appointment, mode: 'chat' | 'video' | 'voice') => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  isDoctorView = false,
  onPay,
  onCancel,
  onRecordNotes,
  onViewNotes,
  onJoinRoom,
}) => {
  const dateObj = new Date(appointment.scheduled_at);
  const formattedDate = dateObj.toLocaleDateString('en-KE', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('en-KE', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-3xl border border-[#EFF1F6] p-6 shadow-sm hover:border-neutral-300 transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EFF1F6]">
        <div className="flex items-center gap-3.5">
          <img
            src={
              isDoctorView
                ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
                : appointment.doctor?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'
            }
            alt="Profile"
            className="w-12 h-12 rounded-2xl object-cover object-top border border-neutral-100"
          />
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-[#131316] text-sm">
                {isDoctorView
                  ? appointment.patient?.display_name || 'Patient'
                  : appointment.doctor?.full_name || 'Doctor'}
              </h4>
              <StatusBadge status={appointment.status} size="sm" />
            </div>
            <p className="text-xs text-[#8C94A0] mt-0.5">
              {isDoctorView
                ? `Patient Contact: ${appointment.patient?.phone || 'N/A'}`
                : appointment.doctor?.speciality || 'Specialist Physician'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#F4F5F7] text-[#131316] px-3.5 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5 text-[#56616B]" />
            {formattedDate}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold bg-[#F4F5F7] text-[#56616B] px-3 py-1.5 rounded-full">
            <Clock className="w-3.5 h-3.5 text-[#8C94A0]" />
            {formattedTime}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="py-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[#8C94A0] block text-[10px] font-bold uppercase tracking-wider mb-1">Mode</span>
          <div className="flex items-center gap-1.5 font-medium text-[#131316]">
            {appointment.type === 'teleconsultation' ? (
              <>
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span>Video Teleconsultation</span>
              </>
            ) : (
              <>
                <MapPin className="w-3.5 h-3.5 text-[#131316]" />
                <span>In-Clinic Visit</span>
              </>
            )}
          </div>
        </div>

        <div>
          <span className="text-[#8C94A0] block text-[10px] font-bold uppercase tracking-wider mb-1">Fee & Payment</span>
          <div className="flex items-center gap-2 font-medium text-[#131316]">
            <span className="font-extrabold">KES {appointment.fee.toLocaleString()}</span>
            <span
              className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                appointment.payment_status === 'paid'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border border-amber-200'
              }`}
            >
              {appointment.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
            </span>
          </div>
        </div>

        <div>
          <span className="text-[#8C94A0] block text-[10px] font-bold uppercase tracking-wider mb-1">Primary Reason</span>
          <p className="text-[#56616B] truncate font-medium">{appointment.reason || 'General health consultation'}</p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-3 border-t border-[#EFF1F6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Consultation Room Entry (Chat, Video, Voice) */}
          {onJoinRoom && (appointment.type === 'teleconsultation' || appointment.status === 'accepted') && (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onJoinRoom(appointment, 'chat')}
                className="inline-flex items-center gap-1.5 bg-[#161613] hover:bg-neutral-800 text-white text-xs font-semibold px-3.5 py-2 rounded-full shadow-xs transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D9F99D]" />
                <span>Chat Room</span>
              </button>

              <button
                onClick={() => onJoinRoom(appointment, 'video')}
                className="inline-flex items-center gap-1 bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                title="Start Video Call"
              >
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Video</span>
              </button>

              <button
                onClick={() => onJoinRoom(appointment, 'voice')}
                className="inline-flex items-center gap-1 bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] text-xs font-semibold px-3 py-2 rounded-full transition-colors"
                title="Start Voice Call"
              >
                <Mic className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Voice</span>
              </button>
            </div>
          )}

          {isDoctorView && appointment.status !== 'completed' && onRecordNotes && (
            <button
              onClick={() => onRecordNotes(appointment)}
              className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Record Consultation</span>
            </button>
          )}

          {appointment.has_consultation && onViewNotes && (
            <button
              onClick={() => onViewNotes(appointment)}
              className="inline-flex items-center gap-1.5 bg-[#F4F5F7] hover:bg-[#E9EBEF] text-[#131316] text-xs font-semibold px-4 py-2 rounded-full transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#56616B]" />
              <span>View Doctor Notes</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!isDoctorView && appointment.payment_status === 'unpaid' && onPay && (
            <button
              onClick={() => onPay(appointment)}
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Pay KES {appointment.fee}</span>
            </button>
          )}

          {appointment.status === 'requested' && onCancel && (
            <button
              onClick={() => onCancel(appointment)}
              className="text-xs text-[#E11D48] hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors font-medium"
            >
              Cancel Request
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
