import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Appointment, FollowUp, MedicalRecord } from '../../types';
import { StatusBadge } from '../../components/StatusBadge';
import {
  Calendar,
  Sparkles,
  FileText,
  HeartPulse,
  Video,
  ArrowRight,
  Clock,
  ShieldCheck,
  Phone,
  Search,
  CheckCircle2,
  ChevronRight,
  Activity,
  CreditCard
} from 'lucide-react';

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptsRes, followRes, recsRes] = await Promise.all([
          api.getAppointments().catch(() => []),
          api.getFollowUps().catch(() => []),
          api.getMyRecords().catch(() => []),
        ]);
        setAppointments(apptsRes || []);
        setFollowUps(followRes || []);
        setRecords(recsRes || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const nextAppointment = appointments.find((a) => a.status === 'accepted' || a.status === 'requested');
  const pendingFollowUp = followUps.find((f) => f.status === 'pending');

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner (Mainstack Minimalist Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#131316] tracking-tight">
            Good day, {user?.profile?.display_name || 'Sarah'} 👋
          </h1>
          <p className="text-xs text-[#56616B] mt-1">
            Here is your active health overview, upcoming consultations, and care history.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/patient/find-doctor"
            className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xs transition-all"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Book Doctor</span>
          </Link>

          <Link
            to="/patient/assistant"
            className="inline-flex items-center gap-1.5 bg-[#F4F5F7] hover:bg-[#E9EBEF] text-[#131316] text-xs font-semibold px-4 py-2 rounded-full transition-all border border-[#E9EBEF]"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Symptom Intake</span>
          </Link>
        </div>
      </div>

      {/* Mainstack Style Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Upcoming Visits</span>
            <div className="w-7 h-7 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
              <Calendar className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">
            {appointments.filter((a) => a.status === 'accepted').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <span>●</span> Confirmed appointments
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Completed Care</span>
            <div className="w-7 h-7 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">
            {appointments.filter((a) => a.status === 'completed').length}
          </div>
          <span className="text-[11px] text-[#56616B] font-medium mt-1 block">
            With clinical records
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Care Check-Ins</span>
            <div className="w-7 h-7 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
              <HeartPulse className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">
            {pendingFollowUp ? '1 Due' : 'Up to date'}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-1 block">
            Recovery progress
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl p-5 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between text-[#8C94A0] mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wider">Health Records</span>
            <div className="w-7 h-7 rounded-full bg-[#F4F5F7] flex items-center justify-center text-[#131316]">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#131316]">{records.length}</div>
          <span className="text-[11px] text-[#56616B] font-medium mt-1 block">
            Encrypted documents
          </span>
        </div>
      </div>

      {/* Main Feature Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Session Spotlight */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block mb-0.5">
                Next Appointment
              </span>
              <h3 className="font-bold text-[#131316] text-base">
                Scheduled Consultation
              </h3>
            </div>
            {nextAppointment && <StatusBadge status={nextAppointment.status} size="sm" />}
          </div>

          {nextAppointment ? (
            <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#EFF1F6]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={nextAppointment.doctor?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                    alt="Doctor"
                    className="w-14 h-14 rounded-2xl object-cover object-top border border-white shadow-xs"
                  />
                  <div>
                    <h4 className="font-bold text-[#131316] text-sm">
                      {nextAppointment.doctor?.full_name || 'Dr. Brian Otieno'}
                    </h4>
                    <p className="text-xs text-[#56616B] font-medium">
                      {nextAppointment.doctor?.speciality || 'Pediatrics & Family Medicine'}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[#8C94A0] mt-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>
                        {new Date(nextAppointment.scheduled_at).toLocaleDateString('en-KE', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })} at {new Date(nextAppointment.scheduled_at).toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {nextAppointment.type === 'teleconsultation' && nextAppointment.meeting_link && (
                    <a
                      href={nextAppointment.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xs transition-colors"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Launch Video Call</span>
                    </a>
                  )}

                  <Link
                    to="/patient/appointments"
                    className="inline-flex items-center gap-1 bg-white hover:bg-neutral-50 text-[#131316] text-xs font-semibold px-3 py-2.5 rounded-full border border-[#E9EBEF] transition-colors"
                  >
                    <span>Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-[#8C94A0] bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E9EBEF]">
              <Calendar className="w-8 h-8 text-[#CBD0D6] mx-auto mb-2" />
              <p>No upcoming visits scheduled.</p>
              <Link
                to="/patient/find-doctor"
                className="mt-2 inline-block font-semibold text-[#131316] hover:underline"
              >
                Browse doctors and book a slot →
              </Link>
            </div>
          )}
        </div>

        {/* Recovery Tracker Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#8C94A0] uppercase tracking-wider block mb-0.5">
                  Care Plan
                </span>
                <h3 className="font-bold text-[#131316] text-base">Recovery Check-In</h3>
              </div>
              <div className="w-7 h-7 rounded-full bg-[#FFF1F2] text-[#E11D48] flex items-center justify-center">
                <HeartPulse className="w-3.5 h-3.5" />
              </div>
            </div>

            {pendingFollowUp ? (
              <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#EFF1F6]">
                <h4 className="font-bold text-[#131316] text-xs mb-1">{pendingFollowUp.title}</h4>
                <p className="text-[11px] text-[#56616B] leading-relaxed mb-4">
                  {pendingFollowUp.instructions}
                </p>
                <Link
                  to="/patient/recovery"
                  className="w-full inline-flex items-center justify-center gap-1.5 bg-[#131316] hover:bg-neutral-800 text-white text-xs font-semibold py-2.5 px-4 rounded-full transition-all shadow-xs"
                >
                  <span>Submit Daily Check-In</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-[#8C94A0] bg-[#F8F9FA] rounded-2xl border border-dashed border-[#E9EBEF]">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <p>All recovery check-ins are up to date.</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-[#EFF1F6] flex items-center justify-between text-xs text-[#56616B]">
            <span>Assigned clinician care</span>
            <Link to="/patient/recovery" className="font-semibold text-[#131316] hover:underline">
              View progress →
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Consultation History Feed */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFF1F6] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#EFF1F6]">
          <h3 className="font-bold text-[#131316] text-base">Recent Consultations & Clinical Notes</h3>
          <Link to="/patient/appointments" className="text-xs font-semibold text-[#56616B] hover:text-[#131316]">
            View all appointments →
          </Link>
        </div>

        {appointments.length === 0 ? (
          <p className="text-xs text-[#8C94A0] py-6 text-center">No consultation history found.</p>
        ) : (
          <div className="divide-y divide-[#EFF1F6]">
            {appointments.slice(0, 3).map((appt) => (
              <div key={appt.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img
                    src={appt.doctor?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200'}
                    alt="Doctor"
                    className="w-10 h-10 rounded-xl object-cover object-top border border-neutral-100"
                  />
                  <div>
                    <h4 className="font-semibold text-[#131316] text-xs">
                      {appt.doctor?.full_name}
                    </h4>
                    <p className="text-[#8C94A0] text-[11px]">{appt.doctor?.speciality}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-left sm:text-right">
                    <span className="font-medium text-[#131316] block">
                      {new Date(appt.scheduled_at).toLocaleDateString('en-KE', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[#8C94A0] text-[11px] capitalize">
                      {appt.type === 'teleconsultation' ? 'Video Telehealth' : 'In-Person Visit'}
                    </span>
                  </div>

                  <StatusBadge status={appt.status} size="sm" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
