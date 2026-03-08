import { useState, useEffect, useRef } from 'react';
import { Mic, Play, BarChart3, AlertCircle, CheckCircle2, Zap, User, Bot, Clock, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE } from '@/config';
import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { useInterviewChat } from '../hooks/useInterviewChat';

const navItems = [
  { label: 'Dashboard', path: '/student/dashboard' },
  { label: 'Find Matches', path: '/student/matches' },
  { label: 'Interview Prep', path: '/interview-prep' },
  { label: 'Applications', path: '/student/applications' },
  { label: 'Settings', path: '/student/settings' },
];

export default function InterviewPrepPage() {
  const { fullName, email } = useUser();
  const userId = email || fullName || 'guest';
  const [feedback, setFeedback] = useState({
    fillers: 0,
    sentiment: 'Neutral',
    pacing: 'Perfect',
    accuracy: 0,
  });
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const { connected, error, messages, interimTranscript, isInteracting, volume, connect, disconnect, submitAnswer } =
    useInterviewChat(
      (newFillers) =>
        setFeedback((prev) => ({
          ...prev,
          fillers: prev.fillers + newFillers,
          accuracy: Math.max(0, prev.accuracy - newFillers * 2),
        })),
      (stats) =>
        setFeedback((prev) => ({
          ...prev,
          sentiment: stats.sentiment || prev.sentiment,
          accuracy: stats.accuracy ?? prev.accuracy,
        }))
    );

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/interview/history?user_id=${encodeURIComponent(userId)}`);
      if (res.ok) setHistory(await res.json());
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const fetchSessionDetails = async (sessionId) => {
    try {
      const res = await fetch(`${API_BASE}/interview/history/${sessionId}`);
      if (res.ok) setSelectedHistory(await res.json());
    } catch (err) {
      console.error('Failed to fetch session details:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const toggleLive = async () => {
    if (connected) {
      setIsSaving(true);
      try {
        if (messages.length > 0) {
          await fetch(`${API_BASE}/interview/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, professor_name: 'Dr. Anurag Nagar', messages }),
          });
          await fetchHistory();
        }
      } catch (err) {
        console.error('Failed to save session:', err);
      } finally {
        setIsSaving(false);
        disconnect();
      }
    } else {
      await connect();
    }
  };

  return (
    <DashboardLayout navItems={navItems} title="Ghost-Twin Interview Prep" subtitle="Real-time voice mock interview with AI Professor">
    <div className="max-w-[1200px] m-auto flex flex-col gap-8">
      <header className="flex justify-between items-end">
        <div>
          <p className="text-secondary mt-1 text-sm">Real-time voice interaction powered by Groq Llama-3 & Browser Voice.</p>
        </div>
        <div className="flex items-center gap-3 bg-overlay px-4 py-2 rounded-full border border-border">
          <Zap className="w-4 h-4 text-accent" style={{ color: connected ? 'var(--accent-color)' : 'var(--accent-color)' }} />
          <span className="font-mono text-xs uppercase tracking-widest">
            {connected ? 'AI PROFESSOR ACTIVE' : 'INTERVIEW ENGINE READY'}
          </span>
        </div>
      </header>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-2 p-6 rounded-lg border border-red-500/30 bg-red-500/10 text-red-500"
        >
          <div className="flex items-center gap-4">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <p className="font-serif text-lg font-medium">Configuration Error</p>
          </div>
          <p className="text-sm opacity-80 ml-10">{error}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-8 flex flex-col gap-6">
          <div
            className="h-[600px] relative overflow-hidden flex flex-col bg-overlay border border-border rounded-lg"
            style={{ minHeight: '600px' }}
          >
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32" style={{ scrollbarWidth: 'thin' }}>
              {selectedHistory ? (
                <div className="flex flex-col gap-6">
                  <button
                    type="button"
                    onClick={() => setSelectedHistory(null)}
                    className="font-mono text-xs uppercase tracking-widest text-secondary hover:text-primary transition-colors flex items-center gap-2 mb-2 self-start"
                  >
                    ← Back to Live Session
                  </button>
                  <div className="p-4 bg-overlay rounded-lg border border-border mb-6">
                    <h3 className="font-serif text-lg font-medium text-primary">{selectedHistory.professor_name}</h3>
                    <p className="font-mono text-xs text-secondary mt-1">
                      {new Date(selectedHistory.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedHistory.messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex w-full gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          msg.role === 'user'
                            ? 'bg-accent-subtle text-accent border border-accent'
                            : 'bg-surface border border-border text-primary'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-lg text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-accent-subtle border border-accent text-primary'
                            : 'bg-overlay border border-border text-primary'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.length === 0 && !connected && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center gap-6"
                    >
                      <div className="w-20 h-20 rounded-full bg-overlay flex items-center justify-center mx-auto border border-border">
                        <Play className="w-8 h-8 text-muted" />
                      </div>
                      <div className="flex flex-col gap-2">
                        <h3 className="font-serif text-xl font-medium text-secondary">Ready to Start?</h3>
                        <p className="text-sm text-muted max-w-xs mx-auto">
                          Dr. Anurag Nagar is ready to conduct your technical mock interview.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={toggleLive}
                        className="px-8 py-3 rounded-lg font-sans font-semibold text-primary transition-opacity hover:opacity-90"
                        style={{ background: 'var(--accent-gradient)' }}
                      >
                        START MOCK INTERVIEW
                      </button>
                    </motion.div>
                  )}

                  {messages.map((msg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      className={`flex w-full gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          msg.role === 'user'
                            ? 'bg-accent-subtle text-accent border border-accent'
                            : 'bg-surface border border-border text-primary'
                        }`}
                      >
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                      </div>
                      <div
                        className={`max-w-[80%] p-4 rounded-lg text-sm leading-relaxed ${
                          msg.role === 'user'
                            ? 'bg-accent-subtle border border-accent text-primary'
                            : 'bg-overlay border border-border text-primary'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={chatEndRef} />
                </AnimatePresence>
              )}
            </div>

            <AnimatePresence>
              {connected && (
                <motion.div
                  initial={{ y: 100 }}
                  animate={{ y: 0 }}
                  exit={{ y: 100 }}
                  className="absolute bottom-20 left-6 right-6 p-4 rounded-lg backdrop-blur-md z-20 border border-accent"
                  style={{ background: 'rgba(242, 95, 92, 0.1)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-1 flex flex-col gap-2">
                      <p className="font-mono text-[10px] font-semibold text-accent uppercase tracking-widest">
                        Current Answer (Speaking...)
                      </p>
                      <p className="text-sm text-primary min-h-[1.5rem]">
                        {interimTranscript || (
                          <span className="text-muted italic">Start speaking to see your answer here...</span>
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={submitAnswer}
                      disabled={!interimTranscript.trim()}
                      className={`px-6 py-3 rounded-lg font-sans font-semibold text-sm transition-all flex items-center gap-2 ${
                        interimTranscript.trim()
                          ? 'text-primary hover:opacity-90'
                          : 'bg-overlay text-muted cursor-not-allowed border border-border'
                      }`}
                      style={interimTranscript.trim() ? { background: 'var(--accent-gradient)' } : {}}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      DONE
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-4 border-t border-border flex items-center justify-between relative z-30 bg-surface">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden border border-border"
                    style={{ background: 'rgba(242, 95, 92, 0.1)' }}
                  >
                    <motion.div
                      animate={{ height: `${volume}%` }}
                      className="absolute bottom-0 left-0 right-0 w-full rounded-full"
                      style={{ background: 'rgba(242, 95, 92, 0.4)' }}
                    />
                    <Mic
                      className={`w-5 h-5 relative z-10 transition-colors ${
                        isInteracting ? 'text-accent' : 'text-muted'
                      }`}
                    />
                  </div>
                  {isInteracting && (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      style={{ borderColor: 'rgba(242, 95, 92, 0.3)' }}
                    />
                  )}
                </div>
                <div>
                  <p className="font-mono text-xs font-semibold text-secondary">
                    {connected ? (isInteracting ? 'LISTENING...' : 'AI SPEAKING...') : 'OFFLINE'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-24 h-1 bg-overlay rounded-full overflow-hidden">
                      <motion.div
                        animate={{ width: `${volume}%` }}
                        className="h-full rounded-full bg-accent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={toggleLive}
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg font-mono font-semibold text-xs transition-all ${
                  isSaving
                    ? 'bg-overlay text-muted cursor-not-allowed'
                    : connected
                      ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20'
                      : 'text-primary'
                }`}
                style={!isSaving && !connected ? { background: 'var(--accent-gradient)' } : {}}
              >
                {isSaving ? 'SAVING...' : connected ? 'END SESSION & SAVE' : 'START SESSION'}
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          <div className="p-6 flex flex-col gap-6 rounded-lg border border-border bg-overlay">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-accent">Live Feedback</h3>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-secondary">FILLER DETECTION</span>
                  <span className={`font-mono text-xs font-semibold ${feedback.fillers > 5 ? 'text-red-400' : 'text-accent'}`}>
                    {feedback.fillers} DETECTED
                  </span>
                </div>
                <div className="h-1.5 w-full bg-overlay rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${Math.min(feedback.fillers * 10, 100)}%` }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-secondary">SENTIMENT / CONFIDENCE</span>
                  <span className="font-mono text-xs font-semibold text-accent uppercase">{feedback.sentiment}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full ${i <= 3 ? 'bg-accent' : 'bg-overlay'}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-secondary">TECHNICAL ACCURACY</span>
                  <span className="font-mono text-xs font-semibold text-accent">{feedback.accuracy}%</span>
                </div>
                <div className="h-1.5 w-full bg-overlay rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${feedback.accuracy}%` }}
                    className="h-full rounded-full bg-accent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-red-400/80">Watch out for &quot;um&quot; and &quot;like&quot; when explaining technical concepts.</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-accent" style={{ background: 'rgba(242, 95, 92, 0.05)' }}>
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <p className="text-[10px] font-medium text-accent">Great explanation of the sensor calibration process!</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4 rounded-lg border border-border bg-overlay">
            <h3 className="font-mono text-xs uppercase tracking-widest text-secondary">Professor Persona</h3>
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center font-serif font-semibold text-accent"
                style={{ background: 'rgba(242, 95, 92, 0.1)' }}
              >
                AN
              </div>
              <div>
                <p className="font-serif text-sm font-medium text-primary">Dr. Anurag Nagar</p>
                <p className="font-mono text-[10px] text-secondary">CS • Air Quality Research</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-4 rounded-lg border border-border bg-overlay">
            <div className="flex items-center gap-2 border-b border-border pb-4">
              <Clock className="w-5 h-5 text-secondary" />
              <h3 className="font-mono text-xs uppercase tracking-widest text-secondary">Past Interviews</h3>
            </div>
            <div className="flex flex-col gap-2">
              {history.length === 0 ? (
                <p className="text-sm text-muted italic">No past sessions found.</p>
              ) : (
                history.map((session) => (
                  <div
                    key={session.id}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && fetchSessionDetails(session.id)}
                    onClick={() => fetchSessionDetails(session.id)}
                    className="flex items-center justify-between p-3 rounded-lg bg-overlay hover:bg-surface-hover transition-colors cursor-pointer group border border-border"
                  >
                    <div>
                      <p className="font-mono text-xs font-semibold text-primary">{session.professor_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-[10px] text-secondary">
                          {new Date(session.created_at).toLocaleDateString()}
                        </span>
                        <span className="font-mono text-[10px] bg-overlay px-2 py-0.5 rounded-full text-secondary">
                          {session.message_count} msgs
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted group-hover:text-accent transition-colors" />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </DashboardLayout>
  );
}
