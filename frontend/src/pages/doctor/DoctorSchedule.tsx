import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AvailabilitySlot } from '../../types';
import { Calendar, Plus, Clock, CheckCircle2, Loader2 } from 'lucide-react';

export const DoctorSchedule: React.FC = () => {
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [slotDate, setSlotDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [slotTime, setSlotTime] = useState('10:00');
  const [duration, setDuration] = useState(45);
  const [adding, setAdding] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const fetchSlots = async () => {
    setLoading(true);
    try {
      const data = await api.getMyAvailability();
      setSlots(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setMsg(null);

    try {
      const startIso = new Date(`${slotDate}T${slotTime}:00Z`).toISOString();
      await api.addAvailability({
        start_at: startIso,
        duration_minutes: duration,
      });

      setMsg('New consultation availability slot opened.');
      fetchSlots();
    } catch (err: any) {
      alert(err.message || 'Failed to add availability slot');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Consultation Availability
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Configure open time slots when patients can book video teleconsultations or clinic visits.
          </p>
        </div>
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-between shadow-xs">
          <span>{msg}</span>
          <button onClick={() => setMsg(null)} className="font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Add Slot Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm">
        <h3 className="font-bold text-[#131316] text-sm mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-[#131316]" />
          <span>Open New Consultation Slot</span>
        </h3>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">Date</label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">Start Time</label>
            <input
              type="time"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1.5">Duration</label>
            <select
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
            >
              <option value={30}>30 Minutes</option>
              <option value={45}>45 Minutes</option>
              <option value={60}>60 Minutes</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={adding}
            className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold py-2.5 px-4 rounded-full shadow-xs text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Open Slot</span>}
          </button>
        </form>
      </div>

      {/* Slots List */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <h3 className="font-bold text-[#131316] text-base">
          Scheduled Availability ({slots.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-xs text-[#8C94A0]">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#131316]" />
            Loading calendar...
          </div>
        ) : slots.length === 0 ? (
          <p className="text-xs text-[#8C94A0] text-center py-8">
            No availability slots currently opened. Add a slot above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {slots.map((slot) => {
              const start = new Date(slot.start_at);
              const end = new Date(slot.end_at);
              const isBooked = slot.status === 'booked';

              return (
                <div
                  key={slot.id}
                  className={`p-4 rounded-2xl border text-xs transition-all flex flex-col justify-between ${
                    isBooked ? 'bg-[#FFFBEB] border-amber-200' : 'bg-[#FAFAFB] border-[#EFF1F6]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isBooked ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {slot.status}
                      </span>
                    </div>

                    <div className="font-bold text-[#131316] text-sm">
                      {start.toLocaleDateString('en-KE', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </div>

                    <div className="flex items-center gap-1 text-[#56616B] mt-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#8C94A0]" />
                      <span>
                        {start.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })} - {end.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
