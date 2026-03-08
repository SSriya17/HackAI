import { useState, useEffect, useRef } from 'react';
import { Mic, Play, Zap, User, Bot, Clock, ChevronRight, Link as LinkIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { API_BASE } from '@/config';
import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { useInterviewChat } from '../hooks/useInterviewChat';
import { getInterviewProfessors } from '@/api/client';

const STORAGE_MATCHES = 'lastStudentMatches';

function getStoredMatches() {
  try {
    const raw = localStorage.getItem(STORAGE_MATCHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function toProfessorOption(m) {
  const courses = m.courses || [];
  const research = courses.slice(0, 3).join(', ') || 'Computer Science research';
  return {
    professor_id: m.professor_id,
    professor_name: m.professor_name,
    research_context: research,
  };
}

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
  const [professors, setProfessors] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);
  const [loadingProfs, setLoadingProfs] = useState(true);
  const [history, setHistory] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const { connected, error, messages, interimTranscript, isInteracting, volume, connect, disconnect, submitAnswer } =
    useInterviewChat();

  const chatEndRef = useRef(null);

  useEffect(() => {
    async function load() {
      const matches = getStoredMatches();
      if (matches.length > 0) {
        const opts = matches.map(toProfessorOption);
        setProfessors(opts);
        if (!selectedProfessor && opts.length > 0) {
          setSelectedProfessor(opts[0]);
        }
      } else {
        try {
          const list = await getInterviewProfessors(10);
          if (Array.isArray(list) && list.length > 0) {
            setProfessors(list);
            setSelectedProfessor(list[0]);
          }
        } catch (err) {
          console.error('Failed to load professors:', err);
        }
      }
      setLoadingProfs(false);
    }
    load();
  }, []);

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
        const profName = selectedProfessor?.professor_name || 'Dr. Professor';
        if (messages.length > 0) {
          await fetch(`${API_BASE}/interview/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId, professor_name: profName, messages }),
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
      await connect(selectedProfessor || null);
    }
  };

  const displayProfessor = selectedProfessor || (professors.length > 0 ? professors[0] : null);
  const initials = displayProfessor?.professor_name
    ? displayProfessor.professor_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'PR';

  return (
    <DashboardLayout navItems={navItems} title="Ghost-Twin Interview Prep" subtitle="Real-time voice mock interview with AI Professor">
      <div className="max-w-[1200px] m-auto flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <p className="text-[#a08eb5] mt-1 text-sm">Voice mock interview powered by Groq Llama-3 & Browser Voice.</p>
          </div>
          <div className="flex items-center gap-3 bg-[#150a21] px-4 py-2 rounded-full border border-[#2e1a47]">
            <Zap className="w-4 h-4 text-[#f25f5c]" />
            <span className="font-mono text-xs uppercase tracking-widest text-white">
              {connected ? 'AI PROFESSOR ACTIVE' : 'INTERVIEW ENGINE READY'}
            </span>
          </div>
        </header>

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col gap-2 p-6 rounded-lg border border-red-500/30 bg-red-500/10"
          >
            <p className="font-serif text-lg font-medium text-red-200">Configuration Error</p>
            <p className="text-sm text-red-300">{error}</p>
          </motion.div>
        )}

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 flex flex-col gap-6">
            <div
              className="h-[600px] relative overflow-hidden flex flex-col bg-[#150a21] border border-[#2e1a47] rounded-lg"
              style={{ minHeight: '600px' }}
            >
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 pb-32" style={{ scrollbarWidth: 'thin' }}>
                {selectedHistory ? (
                  <div className="flex flex-col gap-6">
                    <button
                      type="button"
                      onClick={() => setSelectedHistory(null)}
                      className="font-mono text-xs uppercase tracking-widest text-[#a08eb5] hover:text-white transition-colors flex items-center gap-2 mb-2 self-start"
                    >
                      ← Back to Live Session
                    </button>
                    <div className="p-4 bg-[#1f0f33] rounded-lg border border-[#2e1a47] mb-6">
                      <h3 className="font-serif text-lg font-medium text-white">{selectedHistory.professor_name}</h3>
                      <p className="font-mono text-xs text-[#a08eb5] mt-1">
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
                              ? 'bg-[#2e1a47] text-[#f25f5c] border border-[#f25f5c]'
                              : 'bg-[#1f0f33] border border-[#2e1a47] text-white'
                          }`}
                        >
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div
                          className={`max-w-[80%] p-4 rounded-lg text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#2e1a47]/80 border border-[#553385] text-white'
                              : 'bg-[#1f0f33] border border-[#2e1a47] text-white'
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
                        <div className="w-20 h-20 rounded-full bg-[#1f0f33] flex items-center justify-center mx-auto border border-[#2e1a47]">
                          <Play className="w-8 h-8 text-[#5e4e73]" />
                        </div>
                        <div className="flex flex-col gap-4">
                          <h3 className="font-serif text-xl font-medium text-white">Ready to Start?</h3>
                          <p className="text-sm text-[#a08eb5] max-w-md mx-auto">
                            Practice with one of your matched professors or pick from available faculty. Each session uses their research focus for relevant questions.
                          </p>
                          {loadingProfs ? (
                            <p className="text-sm text-[#5e4e73]">Loading professors…</p>
                          ) : professors.length > 0 ? (
                            <div className="w-full max-w-sm text-left">
                              <label className="font-mono text-xs uppercase tracking-widest text-[#a08eb5] block mb-2">CHOOSE PROFESSOR TO PRACTICE WITH</label>
                              <select
                                value={selectedProfessor?.professor_id || professors[0]?.professor_id || ''}
                                onChange={(e) => {
                                  const p = professors.find((x) => x.professor_id === e.target.value);
                                  setSelectedProfessor(p || professors[0]);
                                }}
                                className="w-full rounded-md border border-[#2e1a47] bg-[#0a0410] px-3 py-2 text-sm text-white focus:border-[#553385] focus:outline-none focus:ring-1 focus:ring-[#553385]"
                              >
                                {professors.map((p) => (
                                  <option key={p.professor_id} value={p.professor_id}>
                                    {p.professor_name} — {p.research_context?.slice(0, 40) || 'Research'}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <p className="text-sm text-[#a08eb5]">
                              <Link to="/student/matches" className="text-[#f25f5c] hover:underline inline-flex items-center gap-1">
                                <LinkIcon className="w-4 h-4" /> Find matches
                              </Link>{' '}
                              to practice with professors tailored to you.
                            </p>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={toggleLive}
                          disabled={loadingProfs || professors.length === 0}
                          className="px-8 py-3 rounded-lg font-sans font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ background: 'linear-gradient(90deg, #ff714a, #e62876)' }}
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
                              ? 'bg-[#2e1a47] text-[#f25f5c] border border-[#f25f5c]'
                              : 'bg-[#1f0f33] border border-[#2e1a47] text-white'
                          }`}
                        >
                          {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                        <div
                          className={`max-w-[80%] p-4 rounded-lg text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#2e1a47]/80 border border-[#553385] text-white'
                              : 'bg-[#1f0f33] border border-[#2e1a47] text-white'
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
                    className="absolute bottom-20 left-6 right-6 p-4 rounded-lg backdrop-blur-md z-20 border border-[#553385]"
                    style={{ background: 'rgba(46, 26, 71, 0.95)' }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-1 flex flex-col gap-2">
                        <p className="font-mono text-[10px] font-semibold text-[#f25f5c] uppercase tracking-widest">
                          Current Answer (Speaking...)
                        </p>
                        <p className="text-sm text-white min-h-[1.5rem]">
                          {interimTranscript || (
                            <span className="text-[#5e4e73] italic">Start speaking to see your answer here...</span>
                          )}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={submitAnswer}
                        disabled={!interimTranscript.trim()}
                        className={`px-6 py-3 rounded-lg font-sans font-semibold text-sm transition-all flex items-center gap-2 ${
                          interimTranscript.trim()
                            ? 'text-white hover:opacity-90'
                            : 'bg-[#1f0f33] text-[#5e4e73] cursor-not-allowed border border-[#2e1a47]'
                        }`}
                        style={interimTranscript.trim() ? { background: 'linear-gradient(90deg, #ff714a, #e62876)' } : {}}
                      >
                        DONE
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="p-4 border-t border-[#2e1a47] flex items-center justify-between relative z-30 bg-[#0a0410]">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center relative overflow-hidden border border-[#2e1a47]"
                      style={{ background: 'rgba(46, 26, 71, 0.5)' }}
                    >
                      <motion.div
                        animate={{ height: `${volume}%` }}
                        className="absolute bottom-0 left-0 right-0 w-full rounded-full"
                        style={{ background: 'rgba(242, 95, 92, 0.4)' }}
                      />
                      <Mic
                        className={`w-5 h-5 relative z-10 transition-colors ${
                          isInteracting ? 'text-[#f25f5c]' : 'text-[#5e4e73]'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-mono text-xs font-semibold text-[#a08eb5]">
                      {connected ? (isInteracting ? 'LISTENING...' : 'AI SPEAKING...') : 'OFFLINE'}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1 bg-[#1f0f33] rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: `${volume}%` }}
                          className="h-full rounded-full bg-[#f25f5c]"
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
                      ? 'bg-[#1f0f33] text-[#5e4e73] cursor-not-allowed'
                      : connected
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300 hover:bg-red-500/20'
                        : 'text-white'
                  }`}
                  style={!isSaving && !connected ? { background: 'linear-gradient(90deg, #ff714a, #e62876)' } : {}}
                >
                  {isSaving ? 'SAVING...' : connected ? 'END SESSION & SAVE' : 'START SESSION'}
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <div className="p-6 flex flex-col gap-4 rounded-lg border border-[#2e1a47] bg-[#150a21]">
              <h3 className="font-mono text-xs uppercase tracking-widest text-[#a08eb5]">Professor Persona</h3>
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center font-serif font-semibold text-[#f25f5c]"
                  style={{ background: 'rgba(242, 95, 92, 0.15)' }}
                >
                  {initials}
                </div>
                <div>
                  <p className="font-serif text-sm font-medium text-white">
                    {displayProfessor?.professor_name || 'Select a professor'}
                  </p>
                  <p className="font-mono text-[10px] text-[#a08eb5]">
                    {displayProfessor?.research_context || '—'}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 flex flex-col gap-4 rounded-lg border border-[#2e1a47] bg-[#150a21]">
              <div className="flex items-center gap-2 border-b border-[#2e1a47] pb-4">
                <Clock className="w-5 h-5 text-[#a08eb5]" />
                <h3 className="font-mono text-xs uppercase tracking-widest text-[#a08eb5]">Past Interviews</h3>
              </div>
              <div className="flex flex-col gap-2">
                {history.length === 0 ? (
                  <p className="text-sm text-[#5e4e73] italic">No past sessions found.</p>
                ) : (
                  history.map((session) => (
                    <div
                      key={session.id}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && fetchSessionDetails(session.id)}
                      onClick={() => fetchSessionDetails(session.id)}
                      className="flex items-center justify-between p-3 rounded-lg bg-[#1f0f33] hover:bg-[#2e1a47] transition-colors cursor-pointer group border border-[#2e1a47]"
                    >
                      <div>
                        <p className="font-mono text-xs font-semibold text-white">{session.professor_name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[10px] text-[#a08eb5]">
                            {new Date(session.created_at).toLocaleDateString()}
                          </span>
                          <span className="font-mono text-[10px] bg-[#2e1a47] px-2 py-0.5 rounded-full text-[#a08eb5]">
                            {session.message_count} msgs
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#5e4e73] group-hover:text-[#f25f5c] transition-colors" />
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
