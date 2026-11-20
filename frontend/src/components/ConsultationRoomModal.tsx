import React, { useState, useEffect, useRef } from 'react';
import { Appointment, ConsultationMessage } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  MessageSquare,
  Video,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Send,
  Paperclip,
  ShieldCheck,
  X,
  Volume2,
  VolumeX,
  FileText,
  Clock,
  Sparkles,
  CheckCheck,
  ChevronDown,
  Activity,
  Smile,
  MapPin
} from 'lucide-react';

interface ConsultationRoomModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  initialMode?: 'chat' | 'video' | 'voice';
}

export const ConsultationRoomModal: React.FC<ConsultationRoomModalProps> = ({
  appointment,
  onClose,
  initialMode = 'chat',
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'video' | 'voice'>(initialMode);
  const [messages, setMessages] = useState<ConsultationMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Call Controls State
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSpeakerMuted, setIsSpeakerMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(145); // seconds
  const [showNotesDrawer, setShowNotesDrawer] = useState(false);
  const [quickNotes, setQuickNotes] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const userVideoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const isDoctor = user?.role === 'doctor';
  const otherPartyName = isDoctor
    ? appointment?.patient?.display_name || 'Patient'
    : appointment?.doctor?.full_name || 'Dr. Brian Otieno, MD';

  const otherPartyRole = isDoctor ? 'Patient' : appointment?.doctor?.speciality || 'Attending Physician';
  const otherPartyAvatar = isDoctor
    ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    : appointment?.doctor?.avatar_url || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=200';

  // Prevent background scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Fetch messages
  const fetchMessages = async () => {
    if (!appointment) return;
    try {
      const data = await api.getConsultationMessages(appointment.id);
      if (Array.isArray(data)) {
        setMessages(data);
      }
    } catch (err) {
      console.error('Failed to load consultation messages', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [appointment?.id]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeTab]);

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (activeTab === 'video' || activeTab === 'voice') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [activeTab]);

  // Optional local camera capture for video mode
  useEffect(() => {
    if (activeTab === 'video' && !isVideoOff) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: false })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream;
          }
        })
        .catch(() => {
          // Camera permission denied or not available; fallback to avatar preview gracefully
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [activeTab, isVideoOff]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !appointment || sending) return;

    const content = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      await api.sendConsultationMessage(appointment.id, content);
      await fetchMessages();
    } catch (err) {
      console.error('Failed to send message', err);
    } finally {
      setSending(false);
    }
  };

  const handleQuickPrompt = (promptText: string) => {
    setNewMessage(promptText);
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveNotes = async () => {
    if (!appointment || !quickNotes.trim()) return;
    try {
      await api.saveConsultationNotes(appointment.id, {
        chief_complaint: appointment.reason || 'Telehealth Consultation',
        subjective_notes: quickNotes,
        clinical_assessment: 'Ongoing evaluation via telehealth consultation room',
        plan_and_recommendations: 'Follow prescription plan and return for follow-up review',
        outcome: 'in_progress',
      });
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!appointment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#FBFAF7] rounded-[28px] sm:rounded-[36px] w-full max-w-5xl h-[92vh] max-h-[820px] border border-[#E8E6DD] shadow-2xl flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-[#E8E6DD] bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative">
              <img
                src={otherPartyAvatar}
                alt={otherPartyName}
                className="w-10 h-10 rounded-full object-cover border border-[#E8E6DD]"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-500/30" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-[#161613] text-sm truncate">
                  {otherPartyName}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Encrypted
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 text-[10px] font-semibold text-[#161613] bg-[#F4F2EC] border border-[#E8E6DD] px-2 py-0.5 rounded-full">
                  <MapPin className="w-3 h-3 text-emerald-600" />
                  <span>{appointment.patient?.location?.area || 'Kilimani'} ({appointment.patient?.location?.distance_km ?? 3.2} km)</span>
                </span>
              </div>
              <p className="text-[11px] text-[#74736B] truncate">
                {otherPartyRole} • Appointment #{appointment.id.replace('apt_', '')}
              </p>
            </div>
          </div>

          {/* Mode Tabs (Mainstack pill design) */}
          <div className="flex items-center bg-[#F4F2EC] p-1 rounded-full border border-[#E8E6DD]/80">
            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-white text-[#161613] shadow-xs'
                  : 'text-[#74736B] hover:text-[#161613]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'video'
                  ? 'bg-white text-[#161613] shadow-xs'
                  : 'text-[#74736B] hover:text-[#161613]'
              }`}
            >
              <Video className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">Video Call</span>
            </button>

            <button
              onClick={() => setActiveTab('voice')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === 'voice'
                  ? 'bg-white text-[#161613] shadow-xs'
                  : 'text-[#74736B] hover:text-[#161613]'
              }`}
            >
              <Mic className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Voice Call</span>
            </button>
          </div>

          {/* Quick Doctor Notes Toggle & Close */}
          <div className="flex items-center gap-1.5">
            {isDoctor && (
              <button
                onClick={() => setShowNotesDrawer(!showNotesDrawer)}
                className={`p-2 rounded-full border text-xs font-semibold transition-colors flex items-center gap-1 ${
                  showNotesDrawer
                    ? 'bg-[#161613] text-white border-[#161613]'
                    : 'bg-white text-[#161613] border-[#E8E6DD] hover:bg-[#F4F2EC]'
                }`}
                title="Clinical Notes Drawer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Notes</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[#F4F2EC] text-[#74736B] hover:text-[#161613] transition-colors"
              aria-label="Close consultation room"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden relative">
          
          {/* Active Mode View */}
          <div className="flex-1 flex flex-col overflow-hidden bg-[#FBFAF7]">
            
            {/* 1. CHAT MODE */}
            {activeTab === 'chat' && (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Messages Stream */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5">
                  <div className="text-center my-2">
                    <span className="text-[11px] font-medium text-[#74736B] bg-white border border-[#E8E6DD] px-3 py-1 rounded-full">
                      Consultation Session Started • Medical Records Confidential
                    </span>
                  </div>

                  {messages.map((msg) => {
                    const isSelf = isDoctor ? msg.sender_role === 'doctor' : msg.sender_role === 'patient';
                    const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[70%] ${
                          isSelf ? 'ml-auto' : 'mr-auto'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1">
                          <span className="text-[10px] font-semibold text-[#74736B]">
                            {isSelf ? 'You' : msg.sender_name}
                          </span>
                          <span className="text-[9px] text-[#A8A7A0]">{timeStr}</span>
                        </div>

                        <div
                          className={`p-3.5 text-xs font-normal leading-relaxed shadow-xs ${
                            isSelf
                              ? 'bg-[#161613] text-white rounded-2xl rounded-tr-xs'
                              : 'bg-white border border-[#E8E6DD] text-[#161613] rounded-2xl rounded-tl-xs'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {msg.attachment_url && (
                            <div className="mt-2 pt-2 border-t border-neutral-200/40">
                              <a
                                href={msg.attachment_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] underline flex items-center gap-1 text-emerald-500"
                              >
                                <Paperclip className="w-3 h-3" /> View Attachment
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Patient Response Chips */}
                {!isDoctor && (
                  <div className="px-4 py-2 border-t border-[#E8E6DD]/60 bg-white/70 flex items-center gap-2 overflow-x-auto text-nowrap scrollbar-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#74736B] shrink-0">
                      Quick:
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('My symptoms have improved slightly since yesterday.')}
                      className="text-[11px] font-medium bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-3 py-1 rounded-full transition-colors"
                    >
                      Symptoms improved
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('Can you clarify the medication frequency and dosage?')}
                      className="text-[11px] font-medium bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-3 py-1 rounded-full transition-colors"
                    >
                      Clarify medication
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('I have uploaded my latest vitals for review.')}
                      className="text-[11px] font-medium bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-3 py-1 rounded-full transition-colors"
                    >
                      Uploaded vitals
                    </button>
                  </div>
                )}

                {/* Chat Input Bar */}
                <form
                  onSubmit={handleSendMessage}
                  className="p-3 sm:p-4 bg-white border-t border-[#E8E6DD] flex items-center gap-2 shrink-0"
                >
                  <button
                    type="button"
                    onClick={() => {
                      const sampleAttachment = 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=600';
                      setNewMessage((prev) => prev ? `${prev} [Attached Lab Scan]` : 'Attached recent diagnostic image.');
                    }}
                    className="p-2.5 rounded-full hover:bg-[#F4F2EC] text-[#74736B] hover:text-[#161613] transition-colors"
                    title="Attach file or lab report"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={`Message ${otherPartyName}...`}
                    className="flex-1 bg-[#F4F2EC] border border-[#E8E6DD] rounded-full px-4 py-2.5 text-xs text-[#161613] placeholder-[#A8A7A0] focus:outline-none focus:ring-1 focus:ring-[#161613]"
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="w-9 h-9 rounded-full bg-[#161613] hover:bg-neutral-800 disabled:opacity-40 text-white flex items-center justify-center transition-all shadow-xs shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}

            {/* 2. VIDEO CALL MODE */}
            {activeTab === 'video' && (
              <div className="flex-1 flex flex-col bg-[#121210] relative overflow-hidden text-white">
                {/* Main Remote Video View */}
                <div className="flex-1 relative flex items-center justify-center p-4">
                  <div className="relative w-full h-full max-w-4xl max-h-[580px] rounded-3xl overflow-hidden bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-2xl">
                    <img
                      src={otherPartyAvatar}
                      alt={otherPartyName}
                      className="w-full h-full object-cover brightness-95"
                    />

                    {/* Remote Tag & Overlay */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-semibold text-white">{otherPartyName}</span>
                      <span className="text-neutral-400 text-[10px]">({otherPartyRole})</span>
                    </div>

                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{formatTimer(callDuration)}</span>
                    </div>

                    {/* Self-view Picture-in-Picture (PiP) */}
                    <div className="absolute bottom-4 right-4 w-32 h-44 sm:w-44 sm:h-56 rounded-2xl overflow-hidden bg-neutral-800 border-2 border-white/20 shadow-2xl z-10 flex items-center justify-center">
                      {!isVideoOff ? (
                        <video
                          ref={userVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-center p-2 text-neutral-400">
                          <VideoOff className="w-6 h-6 mb-1 text-neutral-500" />
                          <span className="text-[10px] font-medium">Camera Off</span>
                        </div>
                      )}
                      <span className="absolute bottom-1.5 left-2 text-[9px] font-semibold bg-black/70 px-2 py-0.5 rounded-full text-white">
                        You {isMuted && '• Muted'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Video Controls Bar */}
                <div className="py-4 px-6 bg-[#161613]/90 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-3 shrink-0">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition-all ${
                      isMuted
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsVideoOff(!isVideoOff)}
                    className={`p-3 rounded-full transition-all ${
                      isVideoOff
                        ? 'bg-rose-500 text-white hover:bg-rose-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={isVideoOff ? 'Turn on camera' : 'Turn off camera'}
                  >
                    {isVideoOff ? <VideoOff className="w-4 h-4" /> : <Video className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                    className={`p-3 rounded-full transition-all ${
                      isSpeakerMuted
                        ? 'bg-amber-500 text-white hover:bg-amber-600'
                        : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
                    title="Open chat beside call"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-lg ml-2"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>Leave Call</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. VOICE CALL MODE */}
            {activeTab === 'voice' && (
              <div className="flex-1 flex flex-col items-center justify-between p-8 bg-[#FBFAF7] relative overflow-hidden">
                <div className="text-center mt-4">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    HD Voice Call • Active
                  </span>
                  <h3 className="text-xl font-bold text-[#161613]">{otherPartyName}</h3>
                  <p className="text-xs text-[#74736B]">{otherPartyRole}</p>
                  <p className="text-xs font-mono text-[#161613] font-bold mt-2">
                    {formatTimer(callDuration)}
                  </p>
                </div>

                {/* Animated Audio Visualizer */}
                <div className="my-auto flex flex-col items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping opacity-75" />
                    <img
                      src={otherPartyAvatar}
                      alt={otherPartyName}
                      className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl relative z-10"
                    />
                  </div>

                  {/* Equalizer bars */}
                  <div className="flex items-center gap-1.5 mt-8 h-8">
                    {[40, 70, 95, 60, 85, 45, 90, 65, 35, 75, 50].map((h, i) => (
                      <span
                        key={i}
                        className="w-1 bg-[#161613] rounded-full transition-all duration-300"
                        style={{
                          height: `${isMuted ? 8 : (h * (0.4 + (i % 3) * 0.25))}%`,
                          opacity: isMuted ? 0.3 : 0.85,
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-[#74736B] mt-2">
                    {isMuted ? 'Your microphone is muted' : 'Connected to audio feed'}
                  </span>
                </div>

                {/* Voice Call Controls */}
                <div className="py-3 px-6 bg-white rounded-full border border-[#E8E6DD] shadow-soft flex items-center gap-3">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`p-3 rounded-full transition-all ${
                      isMuted
                        ? 'bg-rose-500 text-white'
                        : 'bg-[#F4F2EC] text-[#161613] hover:bg-[#E8E6DD]'
                    }`}
                    title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
                  >
                    {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setIsSpeakerMuted(!isSpeakerMuted)}
                    className={`p-3 rounded-full transition-all ${
                      isSpeakerMuted
                        ? 'bg-amber-500 text-white'
                        : 'bg-[#F4F2EC] text-[#161613] hover:bg-[#E8E6DD]'
                    }`}
                    title={isSpeakerMuted ? 'Unmute speaker' : 'Mute speaker'}
                  >
                    {isSpeakerMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className="p-3 rounded-full bg-[#F4F2EC] text-[#161613] hover:bg-[#E8E6DD] transition-all"
                    title="Switch to video call"
                  >
                    <Video className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setActiveTab('chat')}
                    className="p-3 rounded-full bg-[#F4F2EC] text-[#161613] hover:bg-[#E8E6DD] transition-all"
                    title="Switch to chat"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onClose}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs ml-1"
                  >
                    <PhoneOff className="w-4 h-4" />
                    <span>End Voice</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Doctor Clinical Notes Drawer (Collapsible Right Panel) */}
          {showNotesDrawer && isDoctor && (
            <div className="w-80 border-l border-[#E8E6DD] bg-white flex flex-col p-4 animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E6DD]">
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#161613]" />
                  <span className="font-bold text-xs text-[#161613]">Clinical Consultation Note</span>
                </div>
                <button
                  onClick={() => setShowNotesDrawer(false)}
                  className="p-1 rounded-full hover:bg-[#F4F2EC] text-[#74736B]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex-1 py-3 space-y-3 overflow-y-auto text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#74736B] tracking-wider block mb-1">
                    Patient Chief Complaint
                  </span>
                  <p className="p-2.5 rounded-xl bg-[#F4F2EC] text-[#161613] font-medium text-[11px]">
                    {appointment.reason || 'General Health Consultation'}
                  </p>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-[#74736B] tracking-wider block mb-1">
                    Live Telehealth Findings
                  </label>
                  <textarea
                    value={quickNotes}
                    onChange={(e) => setQuickNotes(e.target.value)}
                    rows={8}
                    placeholder="Enter observation, symptoms discussed, and diagnosis notes..."
                    className="w-full p-3 rounded-2xl border border-[#E8E6DD] bg-[#FBFAF7] text-xs focus:ring-1 focus:ring-[#161613] focus:outline-none"
                  />
                </div>

                {notesSaved && (
                  <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold text-center">
                    Note recorded to patient vault!
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E6DD]">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="w-full py-2.5 rounded-full bg-[#161613] hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  Save to Patient Record
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
