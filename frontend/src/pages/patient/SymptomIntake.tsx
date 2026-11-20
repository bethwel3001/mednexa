import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Phone,
  ArrowRight,
  Loader2,
  RefreshCw,
  FileText
} from 'lucide-react';

export const SymptomIntake: React.FC = () => {
  const navigate = useNavigate();

  const [selectedRedFlags, setSelectedRedFlags] = useState<string[]>([]);
  const [mainConcern, setMainConcern] = useState('');
  const [onset, setOnset] = useState('2 days ago');
  const [severity, setSeverity] = useState<number>(4);
  const [associatedSymptoms, setAssociatedSymptoms] = useState<string[]>([]);
  const [medications, setMedications] = useState('None');
  const [medicalHistory, setMedicalHistory] = useState('None');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const emergencySymptoms = [
    { id: 'chest_pain', label: 'Crushing chest pain or pressure radiating to arm or jaw' },
    { id: 'severe_dyspnea', label: 'Severe shortness of breath or inability to catch breath' },
    { id: 'stroke_signs', label: 'Sudden face drooping, arm weakness, or slurred speech' },
    { id: 'severe_hemorrhage', label: 'Uncontrolled bleeding or coughing up blood' },
  ];

  const commonSymptoms = [
    'Headache',
    'Fever',
    'Fatigue',
    'Persistent Cough',
    'Sore Throat',
    'Nausea',
    'Body Aches',
    'Skin Rash',
    'Dizziness',
    'Joint Pain',
  ];

  const toggleEmergency = (id: string) => {
    setSelectedRedFlags((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAssociated = (symptom: string) => {
    setAssociatedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainConcern.trim()) {
      setError('Please enter your primary symptom or health concern');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await api.submitSymptomIntake({
        main_concern: mainConcern,
        onset,
        severity,
        associated_symptoms: associatedSymptoms,
        current_medications: medications,
        medical_history: medicalHistory,
        selected_red_flags: selectedRedFlags,
      });

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process clinical intake');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setSelectedRedFlags([]);
    setMainConcern('');
    setAssociatedSymptoms([]);
  };

  return (
    <div className="space-y-6 animate-fadeIn max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="w-10 h-10 rounded-2xl bg-[#F4F5F7] text-[#131316] flex items-center justify-center mx-auto mb-3">
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
          Clinical Intake Prep
        </h1>
        <p className="text-xs text-[#56616B] mt-1.5 leading-relaxed">
          Answer a few quick questions to organize your symptoms into a structured clinical briefing for your doctor before your consultation.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-[#E11D48] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Emergency Escalation View */}
      {result && result.is_emergency ? (
        <div className="bg-[#FFF1F2] rounded-3xl p-8 border border-rose-200 text-center space-y-6 animate-fadeIn">
          <div className="w-14 h-14 rounded-full bg-[#E11D48] text-white flex items-center justify-center mx-auto shadow-md">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div>
            <h2 className="text-2xl font-black text-rose-950 mb-2">
              Immediate Medical Attention Recommended
            </h2>
            <p className="text-xs text-rose-900 max-w-md mx-auto leading-relaxed">
              Based on your reported symptoms, this may be an acute emergency that requires direct intervention rather than a routine digital consultation.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-rose-200 text-left max-w-md mx-auto space-y-2.5 text-xs text-neutral-800">
            <div className="font-bold text-[#131316]">Recommended Next Steps:</div>
            <p>1. Call Kenya Emergency Services at <strong className="text-rose-700">999</strong> or <strong className="text-rose-700">112</strong>.</p>
            <p>2. Call Kenya Red Cross Ambulance at <strong className="text-rose-700">1199</strong>.</p>
            <p>3. Proceed directly to the nearest hospital casualty trauma center.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="tel:999"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E11D48] hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-colors shadow-xs"
            >
              <Phone className="w-4 h-4" />
              <span>Call 999 Emergency</span>
            </a>

            <button
              onClick={handleReset}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-white text-[#131316] font-semibold px-5 py-3 rounded-full border border-neutral-200 text-xs hover:bg-neutral-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Start Over</span>
            </button>
          </div>
        </div>
      ) : result && !result.is_emergency ? (
        /* Formatted Clinical Briefing Output */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFF1F6] shadow-sm space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-[#EFF1F6]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[#131316] text-base">
                  Clinical Intake Note Prepared
                </h3>
                <p className="text-xs text-[#8C94A0]">
                  Ready to attach to your doctor consultation
                </p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="text-xs font-semibold text-[#56616B] hover:text-[#131316] flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>New Intake</span>
            </button>
          </div>

          <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#EFF1F6] font-mono text-xs text-[#131316] whitespace-pre-wrap leading-relaxed">
            {result.clinician_summary}
          </div>

          {result.suggested_focus_areas && (
            <div className="bg-[#F4F5F7] rounded-2xl p-4 border border-[#E9EBEF]">
              <span className="text-[11px] font-bold text-[#131316] uppercase tracking-wider block mb-2">
                Suggested Doctor Evaluation Points:
              </span>
              <ul className="text-xs text-[#56616B] space-y-1 list-disc list-inside">
                {result.suggested_focus_areas.map((pt: string, idx: number) => (
                  <li key={idx}>{pt}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-[#8C94A0]">
              You can now select a doctor and book an appointment with this intake attached.
            </span>

            <button
              onClick={() => navigate('/patient/find-doctor')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#131316] hover:bg-neutral-800 text-white font-bold px-6 py-3 rounded-full shadow-xs text-xs transition-colors"
            >
              <span>Choose Doctor & Book Slot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Safety Screen */}
          <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm">
            <span className="text-xs font-bold text-[#8C94A0] uppercase tracking-wider block mb-1">
              Safety Screening
            </span>
            <h3 className="font-bold text-[#131316] text-sm mb-3">
              Are you experiencing any of these acute warning symptoms?
            </h3>

            <div className="space-y-2">
              {emergencySymptoms.map((rf) => {
                const isChecked = selectedRedFlags.includes(rf.id);
                return (
                  <button
                    key={rf.id}
                    type="button"
                    onClick={() => toggleEmergency(rf.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between transition-all ${
                      isChecked
                        ? 'border-rose-400 bg-rose-50 text-rose-950 font-semibold'
                        : 'border-[#EFF1F6] hover:border-neutral-300 text-[#56616B] bg-[#FAFAFB]'
                    }`}
                  >
                    <span>{rf.label}</span>
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                        isChecked ? 'bg-[#E11D48] border-[#E11D48] text-white' : 'border-neutral-300'
                      }`}
                    >
                      {isChecked && '✓'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Symptoms */}
          <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm space-y-4">
            <span className="text-xs font-bold text-[#8C94A0] uppercase tracking-wider block mb-1">
              Symptom Details
            </span>

            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                What is your main health concern or symptom? *
              </label>
              <input
                type="text"
                value={mainConcern}
                onChange={(e) => setMainConcern(e.target.value)}
                placeholder="e.g. Persistent tension headache and eye strain"
                className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                  When did it start (Onset)?
                </label>
                <input
                  type="text"
                  value={onset}
                  onChange={(e) => setOnset(e.target.value)}
                  placeholder="e.g. 2 days ago, gradually"
                  className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#131316] mb-1.5">
                  <span>Discomfort Level</span>
                  <span className="font-bold text-[#131316]">{severity} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(Number(e.target.value))}
                  className="w-full accent-[#131316] cursor-pointer mt-2"
                />
              </div>
            </div>

            {/* Associated Symptoms Pills */}
            <div>
              <label className="block text-xs font-semibold text-[#131316] mb-2">
                Any other associated symptoms?
              </label>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => {
                  const isSelected = associatedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleAssociated(symptom)}
                      className={`text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'border-[#131316] bg-[#131316] text-white font-semibold'
                          : 'border-[#EFF1F6] bg-[#FAFAFB] text-[#56616B] hover:border-neutral-300'
                      }`}
                    >
                      {isSelected ? `✓ ${symptom}` : `+ ${symptom}`}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Background Context */}
          <div className="bg-white rounded-3xl p-6 border border-[#EFF1F6] shadow-sm space-y-4">
            <span className="text-xs font-bold text-[#8C94A0] uppercase tracking-wider block mb-1">
              Background Context
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                  Current Medications or Supplements
                </label>
                <input
                  type="text"
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="e.g. None, or Multivitamin daily"
                  className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#131316] mb-1.5">
                  Known Pre-Existing Conditions
                </label>
                <input
                  type="text"
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                  placeholder="e.g. Asthma, Hypertension, None"
                  className="w-full px-4 py-3 rounded-2xl border border-[#EFF1F6] bg-[#FAFAFB] text-xs font-medium focus:ring-2 focus:ring-[#131316] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#131316] hover:bg-neutral-800 disabled:opacity-50 text-white font-bold py-3.5 px-6 rounded-full shadow-xs flex items-center justify-center gap-2 text-xs transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Prepare Clinical Briefing</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
