"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Play, BarChart3, AlertCircle, CheckCircle2, Zap, User, Bot, Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useInterviewChat } from "@/hooks/useInterviewChat";

type Feedback = {
    fillers: number;
    sentiment: "Confident" | "Unsure" | "Neutral";
    pacing: "Fast" | "Slow" | "Perfect";
    accuracy: number;
};

export default function InterviewPrepPage() {
    const [feedback, setFeedback] = useState<Feedback>({
        fillers: 0,
        sentiment: "Neutral",
        pacing: "Perfect",
        accuracy: 0,
    });
    const [history, setHistory] = useState<any[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<any>(null);

    const { connected, error, messages, interimTranscript, isInteracting, volume, connect, disconnect, submitAnswer } = useInterviewChat(
        (newFillers) => {
            setFeedback(prev => ({
                ...prev,
                fillers: prev.fillers + newFillers,
                accuracy: Math.max(0, prev.accuracy - (newFillers * 2))
            }));
        },
        (stats) => {
            setFeedback(prev => ({
                ...prev,
                sentiment: stats.sentiment as any,
                accuracy: stats.accuracy || prev.accuracy
            }));
        }
    );

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchHistory = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/interview/history?user_id=guest");
            if (res.ok) {
                const data = await res.json();
                setHistory(data);
            }
        } catch (err) {
            console.error("Failed to fetch history:", err);
        }
    };

    const fetchSessionDetails = async (sessionId: number) => {
        try {
            const res = await fetch(`http://localhost:8000/api/interview/history/${sessionId}`);
            if (res.ok) {
                const data = await res.json();
                setSelectedHistory(data);
            }
        } catch (err) {
            console.error("Failed to fetch session details:", err);
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
                    await fetch("http://localhost:8000/api/interview/save", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            user_id: "guest",
                            professor_name: "Dr. Anurag Nagar",
                            messages: messages
                        })
                    });
                    await fetchHistory(); // Refresh history
                }
            } catch (err) {
                console.error("Failed to save session:", err);
            } finally {
                setIsSaving(false);
                disconnect();
            }
        } else {
            const professorContext = `You are Dr. Anurag Nagar, a Computer Science professor at UTD. 
      Your research focuses on Machine Learning, Data Mining, and Air Quality Monitoring. 
      You are interviewing a student for a research assistant position in your lab. 
      Be professional, technical, and encouraging. Start by welcoming the student and asking about their interest in your air quality monitoring project.
      Speak naturally and concisely.`;

            await connect(professorContext);
        }
    };

    return (
        <div className="space-y-8 max-w-6xl mx-auto">
            <header className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Ghost-Twin Interview Prep</h2>
                    <p className="text-foreground/40 mt-1">Real-time voice interaction powered by Groq Llama-3 & Browser Voice.</p>
                </div>
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <Zap className={cn("w-4 h-4", connected ? "text-galaxy-green" : "text-comet-orange")} />
                    <span className="text-xs font-bold tracking-tight">
                        {connected ? "AI PROFESSOR ACTIVE" : "INTERVIEW ENGINE READY"}
                    </span>
                </div>
            </header>

            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl flex flex-col gap-2 text-red-500"
                >
                    <div className="flex items-center gap-4">
                        <AlertCircle className="w-6 h-6" />
                        <p className="text-lg font-bold">Configuration Error</p>
                    </div>
                    <p className="text-sm opacity-80 ml-10">{error}</p>
                </motion.div>
            )}

            <div className="grid grid-cols-12 gap-8">
                {/* Main Interview Area */}
                <div className="col-span-8 space-y-6">
                    <div className="glass-card h-[600px] relative overflow-hidden flex flex-col bg-black/40 border-white/10">
                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-32">
                            {selectedHistory ? (
                                <div className="space-y-6">
                                    <button 
                                        onClick={() => setSelectedHistory(null)}
                                        className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2 mb-2"
                                    >
                                        ← Back to Live Session
                                    </button>
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                                        <h3 className="font-bold text-lg">{selectedHistory.professor_name}</h3>
                                        <p className="text-xs text-foreground/40">{new Date(selectedHistory.created_at).toLocaleString()}</p>
                                    </div>
                                    {selectedHistory.messages.map((msg: any, i: number) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "flex w-full gap-4",
                                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                msg.role === "user" ? "bg-galaxy-green/20 text-galaxy-green" : "bg-antony-purple text-white shadow-lg"
                                            )}>
                                                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            <div className={cn(
                                                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                                msg.role === "user"
                                                    ? "bg-galaxy-green/10 border border-galaxy-green/20 text-white rounded-tr-none"
                                                    : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                                            )}>
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
                                            className="h-full flex flex-col items-center justify-center text-center space-y-6"
                                        >
                                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                                                <Play className="w-8 h-8 text-foreground/20" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-bold text-foreground/60">Ready to Start?</h3>
                                                <p className="text-sm text-foreground/40 max-w-xs mx-auto">Dr. Anurag Nagar is ready to conduct your technical mock interview.</p>
                                            </div>
                                            <button
                                                onClick={toggleLive}
                                                className="bg-comet-orange text-white px-8 py-3 rounded-2xl font-bold hover:opacity-90 transition-opacity"
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
                                            className={cn(
                                                "flex w-full gap-4",
                                                msg.role === "user" ? "flex-row-reverse" : "flex-row"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                                                msg.role === "user" ? "bg-galaxy-green/20 text-galaxy-green" : "bg-antony-purple text-white shadow-lg"
                                            )}>
                                                {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                                            </div>
                                            <div className={cn(
                                                "max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed",
                                                msg.role === "user"
                                                    ? "bg-galaxy-green/10 border border-galaxy-green/20 text-white rounded-tr-none"
                                                    : "bg-white/5 border border-white/10 text-white/90 rounded-tl-none"
                                            )}>
                                                {msg.content}
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={chatEndRef} />
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Answer Preview & Done Button */}
                        <AnimatePresence>
                            {connected && (
                                <motion.div
                                    initial={{ y: 100 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: 100 }}
                                    className="absolute bottom-20 left-6 right-6 p-4 bg-galaxy-green/10 border border-galaxy-green/20 rounded-2xl backdrop-blur-md z-20"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-2">
                                            <p className="text-[10px] font-bold text-galaxy-green uppercase tracking-widest">Current Answer (Speaking...)</p>
                                            <p className="text-sm text-white/90 min-h-[1.5rem]">
                                                {interimTranscript || <span className="text-white/20 italic">Start speaking to see your answer here...</span>}
                                            </p>
                                        </div>
                                        <button
                                            onClick={submitAnswer}
                                            disabled={!interimTranscript.trim()}
                                            className={cn(
                                                "px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2",
                                                interimTranscript.trim()
                                                    ? "bg-galaxy-green text-black hover:scale-105 active:scale-95"
                                                    : "bg-white/5 text-white/20 cursor-not-allowed"
                                            )}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                            DONE
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bottom Status Bar */}
                        <div className="p-4 bg-black/60 border-t border-white/5 flex items-center justify-between relative z-30">
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-comet-orange/20 flex items-center justify-center relative overflow-hidden">
                                        <motion.div
                                            animate={{ height: `${volume}%` }}
                                            className="absolute bottom-0 left-0 right-0 bg-comet-orange/40 w-full"
                                        />
                                        <Mic className={cn("w-5 h-5 transition-colors relative z-10", isInteracting ? "text-comet-orange" : "text-foreground/20")} />
                                    </div>
                                    {isInteracting && (
                                        <motion.div
                                            animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ repeat: Infinity, duration: 1.5 }}
                                            className="absolute inset-0 rounded-full border-2 border-comet-orange/30"
                                        />
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-foreground/60">
                                        {connected ? (isInteracting ? "LISTENING..." : "AI SPEAKING...") : "OFFLINE"}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                animate={{ width: `${volume}%` }}
                                                className="h-full bg-comet-orange"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleLive}
                                disabled={isSaving}
                                className={cn(
                                    "px-6 py-2 rounded-xl font-bold text-xs transition-all",
                                    isSaving ? "bg-white/10 text-white/50 cursor-not-allowed" :
                                    connected ? "bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20" : "bg-comet-orange text-white"
                                )}
                            >
                                {isSaving ? "SAVING..." : connected ? "END SESSION & SAVE" : "START SESSION"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Real-time Feedback Sidebar */}
                <div className="col-span-4 space-y-6">
                    <div className="glass-card p-6 space-y-6">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <BarChart3 className="w-5 h-5 text-galaxy-green" />
                            <h3 className="text-sm font-bold tracking-widest uppercase">Live Feedback</h3>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-foreground/40 tracking-tight">FILLER DETECTION</span>
                                    <span className={cn("text-xs font-bold", feedback.fillers > 5 ? "text-red-400" : "text-galaxy-green")}>
                                        {feedback.fillers} DETECTED
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${Math.min(feedback.fillers * 10, 100)}%` }}
                                        className="h-full bg-galaxy-green"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-foreground/40 tracking-tight">SENTIMENT / CONFIDENCE</span>
                                    <span className="text-xs font-bold text-comet-orange uppercase">{feedback.sentiment}</span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={cn("h-1.5 flex-1 rounded-full", i <= 3 ? "bg-comet-orange" : "bg-white/5")} />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-foreground/40 tracking-tight">TECHNICAL ACCURACY</span>
                                    <span className="text-xs font-bold text-galaxy-green">{feedback.accuracy}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={{ width: `${feedback.accuracy}%` }}
                                        className="h-full bg-galaxy-green"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl">
                                <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                                <p className="text-[10px] font-medium text-red-400/80">Watch out for "um" and "like" when explaining technical concepts.</p>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-galaxy-green/5 border border-galaxy-green/10 rounded-xl">
                                <CheckCircle2 className="w-4 h-4 text-galaxy-green mt-0.5" />
                                <p className="text-[10px] font-medium text-galaxy-green/80">Great explanation of the sensor calibration process!</p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-6 space-y-4">
                        <h3 className="text-xs font-bold tracking-widest uppercase text-foreground/40">Professor Persona</h3>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-comet-orange/10 flex items-center justify-center text-comet-orange font-bold">
                                AN
                            </div>
                            <div>
                                <p className="text-sm font-bold">Dr. Anurag Nagar</p>
                                <p className="text-[10px] text-foreground/40 font-mono">CS • Air Quality Research</p>
                            </div>
                        </div>
                    </div>

                    {/* Interview History */}
                    <div className="glass-card p-6 space-y-4">
                        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                            <Clock className="w-5 h-5 text-foreground/40" />
                            <h3 className="text-sm font-bold tracking-widest uppercase">Past Interviews</h3>
                        </div>
                        <div className="space-y-2">
                            {history.length === 0 ? (
                                <p className="text-sm text-foreground/40 italic">No past sessions found.</p>
                            ) : (
                                history.map((session: any) => (
                                    <div 
                                        key={session.id} 
                                        onClick={() => fetchSessionDetails(session.id)}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div>
                                            <p className="text-xs font-bold">{session.professor_name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[10px] text-foreground/40 font-mono">
                                                    {new Date(session.created_at).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full">{session.message_count} msgs</span>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-foreground/20 group-hover:text-galaxy-green transition-colors" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
