import React, { useState } from 'react';
import { Appointment } from '../types';
import { api } from '../services/api';
import { X, Loader2, Stethoscope, Save, AlertCircle } from 'lucide-react';

interface ConsultationModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  appointment,
  onClose,
  onSuccess,
}) => {
  const [chiefComplaint, setChiefComplaint] = useState(appointment?.reason || '');
  const [subjective, setSubjective] = useState('');
  const [objective, setObjective] = useState('');
  const [assessment, setAssessment] = useState('');
  const [plan, setPlan] = useState('');
  const [prescription, setPrescription] = useState('');
  const [outcome, setOutcome] = useState('completed');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.saveConsultationNotes(appointment.id, {
        chief_complaint: chiefComplaint,
        subjective_notes: subjective,
        objective_findings: objective,
        clinical_assessment: assessment,
        plan_and_recommendations: plan,
        prescription_notes: prescription,
        outcome,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save clinical consultation record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-[#EFF1F6] shadow-2xl overflow-hidden p-6 relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFF1F6]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#131316] text-base">Record Clinical Consultation</h3>
              <p className="text-xs text-[#8C94A0]">
                Patient: <span className="font-semibold text-[#131316]">{appointment.patient?.display_name || 'Sarah Achieng'}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F5F7] text-[#8C94A0] hover:text-[#131316] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48] flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1">
              Chief Complaint
            </label>
            <input
              type="text"
              value={chiefComplaint}
              onChange={(e) => setChiefComplaint(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              placeholder="e.g. Tension headache and lightheadedness for 4 days"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1">
                Subjective Notes (History of Present Illness)
              </label>
              <textarea
                rows={3}
                value={subjective}
                onChange={(e) => setSubjective(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none resize-none"
                placeholder="Patient describes gradual onset, aggravated by bright screens..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1">
                Objective Findings (Vitals & Physical)
              </label>
              <textarea
                rows={3}
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none resize-none"
                placeholder="BP: 120/80 mmHg, HR: 74 bpm, SpO2: 99%..."
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1">
              Clinical Assessment & Diagnosis
            </label>
            <input
              type="text"
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              placeholder="e.g. Mild tension-type headache secondary to eye strain"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1">
              Management Plan & Recovery Recommendations
            </label>
            <textarea
              rows={2}
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none resize-none"
              placeholder="Recommended ergonomic rest, increased hydration, follow-up in 3 days..."
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#131316] mb-1">
              Prescription / Medication Orders
            </label>
            <input
              type="text"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
              placeholder="e.g. Paracetamol 500mg PO TDS PRN for 3 days"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-full shadow-xs flex items-center justify-center gap-2 transition-all text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Record & Complete Consultation</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
