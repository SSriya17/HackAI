"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const CHAT_URL = "http://localhost:8000/api/interview/chat";

type Message = {
    role: "user" | "assistant";
    content: string;
};

export function useInterviewChat(
    onFeedback?: (fillers: number) => void,
    onAiFeedback?: (stats: { sentiment: string, accuracy: number }) => void
) {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string[]>([]);
    const [isInteracting, setIsInteracting] = useState(false);
    const [interimTranscript, setInterimTranscript] = useState("");
    const [volume, setVolume] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);

    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const isSpeakingRef = useRef(false);

    // Initialize Speech Recognition
    useEffect(() => {
        if (typeof window !== "undefined") {
            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (SpeechRecognition) {
                const recognition = new SpeechRecognition();
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.lang = "en-US";

                recognition.onresult = (event: any) => {
                    let finalTranscript = "";
                    let interim = "";

                    for (let i = event.resultIndex; i < event.results.length; ++i) {
                        if (event.results[i].isFinal) {
                            finalTranscript += event.results[i][0].transcript;
                        } else {
                            interim += event.results[i][0].transcript;
                        }
                    }

                    if (finalTranscript) {
                        setInterimTranscript(prev => (prev + " " + finalTranscript).trim());

                        // Filler detection on final chunks
                        const fillers = ["um", "uh", "like", "you know"];
                        let count = 0;
                        fillers.forEach(f => {
                            const matches = finalTranscript.toLowerCase().match(new RegExp(`\\b${f}\\b`, "g"));
                            if (matches) count += matches.length;
                        });
                        if (count > 0 && onFeedback) onFeedback(count);
                    }
                };

                recognition.onerror = (event: any) => {
                    console.error("Speech Recognition Error:", event.error);
                    if (event.error === "not-allowed") {
                        setError("Microphone permission denied.");
                    }
                };

                recognitionRef.current = recognition;
            } else {
                setError("Speech recognition not supported in this browser.");
            }
        }
    }, [onFeedback]);

    const submitAnswer = async () => {
        if (!interimTranscript.trim() || isSpeakingRef.current) return;

        const text = interimTranscript.trim();
        setInterimTranscript(""); // Clear for next answer

        console.log("Submitting answer:", text);
        setTranscript(prev => [...prev, `[You]: ${text}`]);

        const userMsg: Message = { role: "user", content: text };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);

        try {
            const response = await fetch(CHAT_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: updatedMessages }),
            });

            if (!response.ok) {
                const errBody = await response.json().catch(() => ({}));
                const detail = errBody?.detail ?? response.statusText;
                if (response.status === 500 && typeof detail === "string" && detail.includes("Groq API key")) {
                    throw new Error("Groq API key not configured. Add GROQ_API_KEY to backend/.env (get free key at console.groq.com)");
                }
                if (response.status >= 500) {
                    throw new Error(detail || "Backend error. Make sure the backend is running: uvicorn main:app --reload");
                }
                throw new Error(detail || "Failed to get response from AI Professor");
            }

            const data = await response.json();
            const aiMessage = data.message;

            if (data.raw_json) {
                try {
                    const parsed = JSON.parse(data.raw_json);
                    if (onAiFeedback) {
                        onAiFeedback({
                            sentiment: parsed.sentiment,
                            accuracy: parsed.technical_accuracy
                        });
                    }
                } catch (e) {
                    console.error("Failed to parse AI JSON stats", e);
                }
            }

            const assistantMsg: Message = { role: "assistant", content: aiMessage };
            setMessages(prev => [...prev, assistantMsg]);
            setTranscript(prev => [...prev, `[AI Professor]: ${aiMessage}`]);

            speak(aiMessage);
        } catch (err: any) {
            const msg = err?.message || String(err);
            if (msg.includes("Failed to fetch") || msg.includes("NetworkError") || msg.includes("Load failed")) {
                setError("Backend not running. Start it with: cd backend && uvicorn main:app --reload");
            } else {
                setError(msg);
            }
        }
    };

    const speak = (text: string) => {
        if (typeof window === "undefined") return;

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => {
            isSpeakingRef.current = true;
            setIsInteracting(false); // Stop listening while speaking
        };
        utterance.onend = () => {
            isSpeakingRef.current = false;
            setIsInteracting(true); // Resume listening
        };

        // Find a professional voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha"));
        if (preferredVoice) utterance.voice = preferredVoice;

        window.speechSynthesis.speak(utterance);
    };

    const connect = useCallback(async (professorContext: string) => {
        setConnected(true);
        setIsInteracting(true);
        setError(null);

        // Initial greeting
        const greeting = "Hello! I'm Dr. Anurag Nagar. I'm excited to talk to you about your interest in our air quality monitoring project. To start off, could you tell me a bit about your background in machine learning?";
        setTranscript([`[AI Professor]: ${greeting}`]);
        setMessages([{ role: "assistant", content: greeting }]);
        speak(greeting);

        if (recognitionRef.current) {
            recognitionRef.current.start();
        }

        startVolumeMonitoring();
    }, []);

    const disconnect = useCallback(() => {
        setConnected(false);
        setIsInteracting(false);
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        window.speechSynthesis.cancel();
        stopVolumeMonitoring();
    }, []);

    const startVolumeMonitoring = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            audioContextRef.current = audioContext;

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(2048, 1, 1);

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(Math.min(100, Math.round(rms * 500)));
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
        } catch (err) {
            console.error("Volume monitoring error:", err);
        }
    };

    const stopVolumeMonitoring = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
            audioContextRef.current.close();
        }
        setVolume(0);
    };

    return {
        connected,
        error,
        transcript,
        messages,
        interimTranscript,
        isInteracting,
        volume,
        connect,
        disconnect,
        submitAnswer,
        startAudioCapture: async () => { }, // No-op for compatibility
        stopAudioCapture: () => { }, // No-op for compatibility
    };
}
