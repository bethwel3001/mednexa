import React, { useState } from 'react';
import { DoctorProfile } from '../types';
import { api } from '../services/api';
import { X, Calendar, Clock, Video, MapPin, Loader2, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  doctor: DoctorProfile | null;
  onClose: () => void;
  onSuccess: (appointment: any) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ doctor, onClose, onSuccess }) => {
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [consultType, setConsultType] = useState<'in_person' | 'teleconsultation'>('teleconsultation');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!doctor) return null;

  const availableSlots = doctor.available_slots || [];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId && availableSlots.length > 0) {
      setError('Please select an available appointment time slot');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.requestAppointment({
        doctor_id: doctor.id,
        slot_id: selectedSlotId || undefined,
        scheduled_at: !selectedSlotId ? new Date(Date.now() + 86400000).toISOString() : undefined,
        type: consultType,
        reason: reason || 'General medical consultation',
      });

      onSuccess(res);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to complete appointment booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-[#EFF1F6] shadow-2xl overflow-hidden p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F4F5F7] text-[#8C94A0] hover:text-[#131316] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-[#EFF1F6]">
          <img
            src={doctor.avatar_url || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300'}
            alt={doctor.full_name}
            className="w-14 h-14 rounded-2xl object-cover object-top border border-neutral-100 shadow-xs"
          />
          <div>
            <h3 className="font-bold text-[#131316] text-base">{doctor.full_name}</h3>
            <p className="text-xs text-[#56616B] font-medium">{doctor.speciality}</p>
            <p className="text-xs text-[#8C94A0]">{doctor.hospital_affiliation || doctor.city}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-4">
          {/* Consultation Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">
              Select Consultation Mode
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setConsultType('teleconsultation')}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  consultType === 'teleconsultation'
                    ? 'border-[#131316] bg-[#131316] text-white shadow-xs'
                    : 'border-[#EFF1F6] hover:border-neutral-300 text-[#56616B] bg-[#FAFAFB]'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Video Call</span>
              </button>

              <button
                type="button"
                onClick={() => setConsultType('in_person')}
                className={`flex items-center gap-2 p-3 rounded-2xl border text-xs font-semibold transition-all ${
                  consultType === 'in_person'
                    ? 'border-[#131316] bg-[#131316] text-white shadow-xs'
                    : 'border-[#EFF1F6] hover:border-neutral-300 text-[#56616B] bg-[#FAFAFB]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>In-Clinic Visit</span>
              </button>
            </div>
          </div>

          {/* Slot Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">
              Available Slots
            </label>
            {availableSlots.length === 0 ? (
              <p className="text-xs text-[#8C94A0] bg-[#FAFAFB] p-3 rounded-2xl border border-[#EFF1F6]">
                No fixed slots currently listed. A consultation request will be submitted directly to the physician for confirmation.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                {availableSlots.map((slot) => {
                  const d = new Date(slot.start_at);
                  const isSelected = selectedSlotId === slot.id;
                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`text-left p-3 rounded-2xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#131316] bg-[#F4F5F7] text-[#131316] font-bold'
                          : 'border-[#EFF1F6] hover:border-neutral-300 text-[#56616B] bg-[#FAFAFB]'
                      }`}
                    >
                      <div className="font-semibold">{d.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="text-[11px] text-[#8C94A0]">
                        {d.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">
              Reason for Consultation (Optional)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Discussing allergy symptoms or seasonal wellness check..."
              className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none resize-none"
            />
          </div>

          {/* Fee summary */}
          <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#EFF1F6] flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block">Total Consultation Fee</span>
              <span className="text-base font-extrabold text-[#131316]">
                KES {doctor.fee.toLocaleString()}
              </span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Pay via M-Pesa on confirmation
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3.5 px-4 rounded-full shadow-xs flex items-center justify-center gap-2 transition-all text-xs"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Confirm Consultation Request</span>}
          </button>
        </form>
      </div>
    </div>
  );
};
