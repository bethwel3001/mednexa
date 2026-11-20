import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { FollowUp } from '../../types';
import { HeartPulse, CheckCircle2, AlertTriangle, Send, Loader2 } from 'lucide-react';

export const RecoveryTracking: React.FC = () => {
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<FollowUp | null>(null);

  const [symptomStatus, setSymptomStatus] = useState<string>('significantly_better');
  const [painScore, setPainScore] = useState<number>(2);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchFollowUps = async () => {
    setLoading(true);
    try {
      const data = await api.getFollowUps();
      setFollowUps(data || []);
      if (data && data.length > 0) {
        setActivePlan(data[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, []);

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePlan) return;

    setSubmitting(true);
    setSuccessMsg(null);

    try {
      await api.submitFollowUpResponse(activePlan.id, {
        symptom_status: symptomStatus,
        pain_score: painScore,
        patient_notes: notes,
      });

      setSuccessMsg(
        symptomStatus === 'worse'
          ? 'Check-in recorded. Since you noted worsening symptoms, an alert has been flagged for your attending doctor.'
          : 'Thank you! Your recovery progress check-in has been sent to your doctor.'
      );

      fetchFollowUps();
    } catch (err: any) {
      alert(err.message || 'Failed to submit check-in');
    } finally {
      setSubmitting(false);
    }
  };

  const statusOptions = [
    { id: 'significantly_better', label: 'Significantly Better' },
    { id: 'slightly_better', label: 'Slightly Better' },
    { id: 'unchanged', label: 'About the Same' },
    { id: 'worse', label: 'Worse / Deteriorating' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Recovery Care Tracker
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Submit daily recovery updates prescribed by your doctor and track symptom resolution.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-[#FFF1F2] px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#E11D48]">
          <HeartPulse className="w-3.5 h-3.5" />
          <span>Active Patient Monitoring</span>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-medium text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="font-bold hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-[#8C94A0]">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#131316]" />
          <p className="text-xs">Loading care plans...</p>
        </div>
      ) : followUps.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EFF1F6]">
          <HeartPulse className="w-10 h-10 text-[#CBD0D6] mx-auto mb-3" />
          <h3 className="font-bold text-[#131316] text-sm mb-1">No active follow-up plans</h3>
          <p className="text-xs text-[#8C94A0] max-w-sm mx-auto">
            When your doctor completes a consultation and prescribes a recovery timeline, check-in prompts will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Plan Selector */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block">
              Active Care Plans
            </span>
            {followUps.map((plan) => {
              const isSelected = activePlan?.id === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setActivePlan(plan)}
                  className={`w-full text-left p-4 rounded-3xl border transition-all ${
                    isSelected
                      ? 'border-[#131316] bg-white text-[#131316] shadow-sm'
                      : 'border-[#EFF1F6] hover:border-neutral-300 bg-white text-[#56616B]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        plan.status === 'submitted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : plan.status === 'escalated'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {plan.status}
                    </span>
                    <span className="text-[11px] text-[#8C94A0]">
                      Due: {new Date(plan.due_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs truncate text-[#131316]">{plan.title}</h4>
                  <p className="text-[11px] text-[#8C94A0] mt-1">
                    Clinician: {plan.clinician_name}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Active Check-In Form */}
          <div className="md:col-span-2">
            {activePlan && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-5">
                <div>
                  <h3 className="font-bold text-[#131316] text-base">{activePlan.title}</h3>
                  <p className="text-xs text-[#56616B] mt-1 leading-relaxed">
                    {activePlan.instructions}
                  </p>
                </div>

                <form onSubmit={handleSubmitResponse} className="space-y-4 pt-2 border-t border-[#EFF1F6]">
                  <div>
                    <label className="block text-xs font-semibold text-[#131316] mb-2">
                      How are your symptoms progressing today?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {statusOptions.map((opt) => {
                        const isChecked = symptomStatus === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSymptomStatus(opt.id)}
                            className={`p-3 rounded-2xl border text-xs font-semibold text-left transition-all ${
                              isChecked
                                ? 'border-[#131316] bg-[#131316] text-white shadow-xs'
                                : 'border-[#EFF1F6] hover:border-neutral-300 text-[#56616B] bg-[#FAFAFB]'
                            }`}
                          >
                            <span>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-semibold text-[#131316] mb-1.5">
                      <span>Current Discomfort / Pain Level</span>
                      <span className="font-bold text-[#131316]">{painScore} / 10</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={painScore}
                      onChange={(e) => setPainScore(Number(e.target.value))}
                      className="w-full accent-[#131316] cursor-pointer mt-1"
                    />
                    <div className="flex justify-between text-[10px] text-[#8C94A0] mt-1">
                      <span>0 - No pain</span>
                      <span>5 - Moderate</span>
                      <span>10 - Severe</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                      Notes or Observations for Your Clinician
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Headache reduced after hydration; no dizziness today."
                      className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none resize-none"
                    />
                  </div>

                  {symptomStatus === 'worse' && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-[#E11D48] flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>Reporting worsening symptoms notifies your doctor immediately.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-full shadow-xs flex items-center justify-center gap-2 text-xs transition-all"
                  >
                    {submitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Check-In</span>
                      </>
                    )}
                  </button>
                </form>

                {activePlan.responses && activePlan.responses.length > 0 && (
                  <div className="pt-4 border-t border-[#EFF1F6] space-y-2">
                    <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block">
                      Previous Check-In Log
                    </span>
                    {activePlan.responses.map((resp) => (
                      <div
                        key={resp.id}
                        className="bg-[#F8F9FA] p-3.5 rounded-2xl border border-[#EFF1F6] text-xs text-[#131316]"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold capitalize">
                            Status: {resp.symptom_status.replace('_', ' ')}
                          </span>
                          <span className="text-[11px] text-[#8C94A0]">
                            {new Date(resp.submitted_at).toLocaleDateString('en-KE')}
                          </span>
                        </div>
                        {resp.patient_notes && (
                          <p className="text-[#56616B] italic">"{resp.patient_notes}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
