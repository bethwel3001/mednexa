import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Mic,
  MicOff,
  Volume2,
  X,
  CheckCircle2,
  Send
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { quickSwitchUser } = useAuth();

  const [status, setStatus] = useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);
  const [textInput, setTextInput] = useState('');

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // 1. Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // 2. Handle escape key to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) handleStopAndClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const handleStopAndClose = () => {
    stopListening();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current = null;
    }
    setStatus('idle');
    onClose();
  };

  // Start Speech Recognition
  const startListening = async () => {
    if (status === 'speaking') {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioElementRef.current) audioElementRef.current.pause();
    }

    setTranscript('');
    setActionFeedback(null);
    setStatus('listening');

    // Attempt browser Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'sw-KE'; // Swahili / English code-switching
        recognition.continuous = false;
        recognition.interimResults = true;

        recognition.onresult = (event: any) => {
          let current = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            current += event.results[i][0].transcript;
          }
          setTranscript(current);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setStatus('idle');
        };

        recognition.onend = () => {
          if (transcript.trim()) {
            executeCommand(transcript.trim());
          } else {
            setStatus('idle');
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition error, falling back to audio capture:', err);
      }
    }

    // MediaRecorder audio capture fallback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            setStatus('processing');
            try {
              const res = await api.transcribeAudio(base64Audio);
              if (res && res.text) {
                setTranscript(res.text);
                executeCommand(res.text);
              } else {
                setStatus('idle');
              }
            } catch (err) {
              console.error(err);
              setStatus('idle');
            }
          };
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start();
      } catch (err) {
        console.error('Microphone access denied:', err);
        setStatus('idle');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
    }
  };

  // Natural Language Action Engine
  const executeCommand = async (commandText: string) => {
    setStatus('processing');
    try {
      const res = await api.processVoiceCommand(commandText, location.pathname);
      const data = res;

      setActionFeedback(data.spoken_response);

      // Perform App Action
      if (data.action === 'SWITCH_ROLE' && data.payload?.target_role) {
        await quickSwitchUser(data.payload.target_role);
      }

      if (data.target_route) {
        navigate(data.target_route);
        // Automatically close modal after speech execution so the screen & target modal are interactive!
        setTimeout(() => {
          onClose();
        }, 1800);
      }

      // Speak back audio (Speech to Speech)
      speakResponse(data.spoken_response);
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  // Speak back response using MsingiAI TTS or browser voice
  const speakResponse = async (textToSpeak: string) => {
    setStatus('speaking');
    try {
      const audioRes = await api.synthesizeSpeech(textToSpeak, 'female3');
      if (audioRes.audioUrl) {
        const audio = new Audio(audioRes.audioUrl);
        audioElementRef.current = audio;
        audio.onended = () => setStatus('idle');
        audio.onerror = () => fallbackBrowserSpeak(textToSpeak);
        await audio.play();
        return;
      }
    } catch (err) {
      console.warn('Msingi TTS direct audio playback failed, using client voice:', err);
    }

    fallbackBrowserSpeak(textToSpeak);
  };

  const fallbackBrowserSpeak = (textToSpeak: string) => {
    if (!window.speechSynthesis) {
      setStatus('idle');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const swVoice = voices.find((v) => v.lang.includes('sw') || v.name.toLowerCase().includes('swahili') || v.lang.includes('ke'));
    if (swVoice) utterance.voice = swVoice;

    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    window.speechSynthesis.speak(utterance);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    const text = textInput.trim();
    setTextInput('');
    setTranscript(text);
    executeCommand(text);
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={handleStopAndClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#161613]/55 backdrop-blur-md animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-[32px] border border-[#E8E6DD] bg-white p-6 sm:p-7 shadow-lift overflow-hidden text-[#161613]"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E8E6DD]/70">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#161613] font-serif text-lg italic text-[#D9F99D] shadow-xs">
              m
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-[#161613] tracking-tight">MedNexa Voice</h3>
                <span className="text-[10px] font-semibold bg-[#D9F99D] text-[#161613] px-2 py-0.5 rounded-full">
                  Speech to Speech
                </span>
              </div>
              <p className="text-[11px] text-[#74736B]">Talk to perform any action on the platform</p>
            </div>
          </div>

          {/* Prominent, High-Contrast Close Button */}
          <button
            onClick={handleStopAndClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] transition-colors cursor-pointer shadow-xs"
            aria-label="Close Voice Assistant"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visualizer & Waveform */}
        <div className="py-6 text-center flex flex-col items-center justify-center">
          {/* Animated Sauti Voice Wave Bars */}
          <div className="flex items-end gap-1.5 h-14 mb-4">
            {[18, 34, 52, 28, 64, 40, 22, 48, 60, 30, 16, 38, 26, 14].map((h, i) => {
              const active = status === 'listening' || status === 'speaking';
              const dynamicHeight = active ? Math.min(56, Math.max(10, (h * (i % 2 === 0 ? 1.15 : 0.85)))) : 8;
              return (
                <span
                  key={i}
                  style={{
                    height: `${active ? dynamicHeight : 6}px`,
                    transition: 'height 0.15s ease-in-out'
                  }}
                  className={`w-1.5 rounded-full ${
                    status === 'listening'
                      ? 'bg-emerald-500 animate-pulse'
                      : status === 'speaking'
                      ? 'bg-[#161613]'
                      : status === 'processing'
                      ? 'bg-amber-500'
                      : 'bg-[#E8E6DD]'
                  }`}
                />
              );
            })}
          </div>

          {/* Status Label */}
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold bg-[#F4F2EC] text-[#161613]">
            {status === 'listening' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>Listening... Speak your command</span>
              </>
            )}
            {status === 'processing' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-spin" />
                <span>Thinking... Executing health action</span>
              </>
            )}
            {status === 'speaking' && (
              <>
                <Volume2 className="w-3.5 h-3.5 text-emerald-700 animate-bounce" />
                <span>Speaking response &amp; opening screen...</span>
              </>
            )}
            {status === 'idle' && (
              <>
                <span>Ready · Tap microphone to speak in English or Swahili</span>
              </>
            )}
          </div>

          {/* Dynamic Transcript / Output */}
          <div className="mt-4 min-h-[44px] w-full px-2">
            {transcript ? (
              <p className="text-sm font-semibold text-[#161613] italic">
                "{transcript}"
              </p>
            ) : (
              <p className="text-xs text-[#74736B]">
                Say "Book Dr. Brian", "Natafuta daktari wa watoto", "Emergency 999", or "Hospital casualty".
              </p>
            )}

            {actionFeedback && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#DFF2E4] border border-emerald-200 text-xs text-emerald-950 font-medium animate-fadeIn text-left">
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Action Executed:</span>
                </div>
                {actionFeedback}
              </div>
            )}
          </div>

          {/* Main Microphone Button */}
          <div className="mt-5">
            {status === 'listening' ? (
              <button
                onClick={stopListening}
                className="grid h-16 w-16 place-items-center rounded-full bg-[#E11D48] text-white shadow-lift animate-pulse cursor-pointer"
                title="Stop listening"
              >
                <MicOff className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={startListening}
                className="grid h-16 w-16 place-items-center rounded-full bg-[#161613] text-[#D9F99D] hover:bg-black hover:scale-105 active:scale-95 transition-all shadow-lift cursor-pointer"
                title="Tap to speak"
              >
                <Mic className="w-7 h-7" />
              </button>
            )}
          </div>
        </div>

        {/* Quick Action Chips (Tap to execute) */}
        <div className="pt-2 border-t border-[#E8E6DD]/70">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#74736B] mb-2">
            Quick Health Actions (Tap to speak & execute):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: '🩺 Book Dr. Brian Otieno', query: 'Book appointment with Dr. Brian Otieno' },
              { label: '📹 Start Video Call', query: 'Start video call with Dr. Brian' },
              { label: '📍 Share my location', query: 'Share my location with my doctor' },
              { label: '🏥 Nearest hospital casualty', query: 'Find nearest casualty hospital' },
              { label: '💳 Pay for consultation', query: 'Pay for my consultation' },
              { label: '🚨 Emergency 999', query: 'Severe chest pain emergency 999' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTranscript(chip.query);
                  executeCommand(chip.query);
                }}
                className="rounded-full bg-[#F4F2EC] hover:bg-[#E8E6DD] text-[#161613] px-3 py-1 text-[11px] font-medium transition-colors cursor-pointer"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Fallback */}
        <form onSubmit={handleManualSubmit} className="mt-3.5 flex items-center gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Or type a health command here..."
            className="flex-1 rounded-full border border-[#E8E6DD] bg-[#FBFAF7] px-4 py-2 text-xs focus:outline-none focus:border-[#161613]"
          />
          <button
            type="submit"
            className="rounded-full bg-[#161613] hover:bg-black text-white p-2.5 shadow-xs transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
