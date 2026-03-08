"use client";

import { useState } from "react";
import { Send, Sparkles, Sliders, Mail, MapPin, BookOpen, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type OutreachProps = {
    professor: {
        name: string;
        latest_publication: string;
        office: string;
    };
};

export default function OutreachAgent({ professor }: OutreachProps) {
    const [tone, setTone] = useState(50); // 0: Academic, 100: High Energy
    const [email, setEmail] = useState("");
    const [generating, setGenerating] = useState(false);

    const generateEmail = () => {
        setGenerating(true);
        // Simulate AI generation
        setTimeout(() => {
            const academic = `Dear Professor ${professor.name.split(" ").pop()},\n\nI am writing to express my interest in your research, particularly your recent work on "${professor.latest_publication}". My background in computer science aligns with the technical requirements of your lab...`;
            const highEnergy = `Hi Professor ${professor.name.split(" ").pop()}! 👋\n\nI just read your paper on "${professor.latest_publication}" and I'm absolutely blown away! I've been working on similar projects and would love to bring that same energy to your team at ${professor.office}...`;

            // Simple interpolation for demo
            setEmail(tone > 50 ? highEnergy : academic);
            setGenerating(false);
        }, 1500);
    };

    return (
        <div className="glass-card p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-comet-orange/10 rounded-xl flex items-center justify-center">
                        <Mail className="text-comet-orange w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold">Precision Cold Outreach</h3>
                        <p className="text-xs text-foreground/40 font-mono uppercase tracking-widest">Autonomous Agent Active</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <div className="w-2 h-2 rounded-full bg-galaxy-green animate-pulse" />
                    <span className="text-[10px] font-bold tracking-tight">CONTEXT INJECTED: NEBULA API</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-foreground/40 tracking-widest uppercase flex items-center gap-2">
                            <Sliders className="w-3 h-3" />
                            Tone Control
                        </label>
                        <div className="space-y-2">
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={tone}
                                onChange={(e) => setTone(parseInt(e.target.value))}
                                className="w-full accent-comet-orange bg-white/5 h-2 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-foreground/40 tracking-tight">
                                <span>STANDARD ACADEMIC</span>
                                <span>HIGH ENERGY START-UP</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-xs font-bold text-foreground/40 tracking-widest uppercase">Contextual Data</label>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <BookOpen className="w-4 h-4 text-comet-orange" />
                                <span className="text-xs font-medium truncate">{professor.latest_publication}</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                                <MapPin className="w-4 h-4 text-galaxy-green" />
                                <span className="text-xs font-medium">{professor.office}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={generateEmail}
                        disabled={generating}
                        className="w-full bg-gradient-to-r from-comet-orange to-comet-orange/80 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {generating ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                GENERATING PRECISION DRAFT...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-5 h-5" />
                                GENERATE PRECISION DRAFT
                            </>
                        )}
                    </button>
                </div>

                <div className="space-y-4">
                    <label className="text-xs font-bold text-foreground/40 tracking-widest uppercase">Draft Preview</label>
                    <div className="relative h-[300px]">
                        <textarea
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Your precision draft will appear here..."
                            className="w-full h-full bg-black/20 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:outline-none focus:border-galaxy-green/50 transition-all resize-none"
                        />
                        {email && (
                            <div className="absolute bottom-4 right-4">
                                <button className="bg-galaxy-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-galaxy-green/20">
                                    <Send className="w-4 h-4" />
                                    SEND & TRACK
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
