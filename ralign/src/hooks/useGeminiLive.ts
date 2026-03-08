"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const URL = "ws://localhost:8000/api/voice";

export function useGeminiLive(onFeedback?: (fillers: number) => void) {
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string[]>([]);
    const [isInteracting, setIsInteracting] = useState(false);
    const [volume, setVolume] = useState(0);

    const wsRef = useRef<WebSocket | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const processorRef = useRef<ScriptProcessorNode | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const connect = useCallback(async (professorContext: string) => {
        if (wsRef.current) return;

        setError(null);
        console.log("Connecting to Backend Voice Proxy...");
        try {
            const ws = new WebSocket(URL);
            wsRef.current = ws;

            ws.onopen = () => {
                console.log("WebSocket Connected to Proxy");
                setConnected(true);
                // Send setup message
                const setupMsg = {
                    setup: {
                        model: "models/gemini-2.5-flash-native-audio-latest"
                    }
                };
                console.log("Sending setup message:", setupMsg);
                ws.send(JSON.stringify(setupMsg));
            };

            ws.onmessage = async (event) => {
                const response = JSON.parse(event.data);
                console.log("Received message from Gemini:", response);

                if (response.error) {
                    console.error("Backend Error:", response.error);
                    setError(response.error);
                    return;
                }

                if (response.serverContent) {
                    if (response.serverContent.modelTurn) {
                        const parts = response.serverContent.modelTurn.parts;
                        for (const part of parts) {
                            if (part.inlineData && part.inlineData.mimeType === "audio/pcm;rate=16000") {
                                console.log("Playing received audio chunk...");
                                playAudio(part.inlineData.data);
                            }
                            if (part.text) {
                                console.log("Received text:", part.text);
                                setTranscript(prev => [...prev, `[AI Professor]: ${part.text}`]);
                            }
                        }
                    }
                }

                // Simple filler detection for user turns (if transcript is available)
                if (response.realtimeInput && response.realtimeInput.text) {
                    const text = response.realtimeInput.text.toLowerCase();
                    console.log("User transcript:", text);
                    const fillers = ["um", "uh", "like", "you know"];
                    let count = 0;
                    fillers.forEach(f => {
                        const matches = text.match(new RegExp(`\\b${f}\\b`, "g"));
                        if (matches) count += matches.length;
                    });
                    if (count > 0 && onFeedback) {
                        onFeedback(count);
                    }
                    setTranscript(prev => [...prev, `[You]: ${response.realtimeInput.text}`]);
                }
            };

            ws.onclose = (event) => {
                console.log("WebSocket Closed:", event.code, event.reason);
                setConnected(false);
                wsRef.current = null;
                stopAudioCapture();
                if (event.code !== 1000) {
                    setError(`Connection closed: ${event.reason || "Invalid API Key or Network Issue"}`);
                }
            };

            ws.onerror = (error) => {
                console.error("WebSocket Error:", error);
                setError("Failed to connect to Gemini Live. Please check your API key.");
            };
        } catch (err) {
            console.error("Connection Error:", err);
            setError("An unexpected error occurred while connecting.");
        }
    }, [onFeedback]);

    const disconnect = useCallback(() => {
        console.log("Disconnecting...");
        if (wsRef.current) {
            wsRef.current.close();
        }
    }, []);

    const startAudioCapture = async () => {
        try {
            console.log("Requesting microphone access...");
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            console.log("Microphone access granted");

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            audioContextRef.current = audioContext;

            if (audioContext.state === "suspended") {
                console.log("Resuming AudioContext...");
                await audioContext.resume();
            }

            const source = audioContext.createMediaStreamSource(stream);
            const processor = audioContext.createScriptProcessor(4096, 1, 1);
            processorRef.current = processor;

            processor.onaudioprocess = (e) => {
                const inputData = e.inputBuffer.getChannelData(0);

                // Calculate volume for UI feedback
                let sum = 0;
                for (let i = 0; i < inputData.length; i++) {
                    sum += inputData[i] * inputData[i];
                }
                const rms = Math.sqrt(sum / inputData.length);
                setVolume(Math.min(100, Math.round(rms * 500)));

                if (wsRef.current?.readyState === WebSocket.OPEN) {
                    // Convert Float32 to Int16
                    const pcmData = new Int16Array(inputData.length);
                    for (let i = 0; i < inputData.length; i++) {
                        pcmData[i] = Math.max(-1, Math.min(1, inputData[i])) * 0x7FFF;
                    }

                    // Send as base64
                    const base64Data = btoa(String.fromCharCode(...new Uint8Array(pcmData.buffer)));
                    wsRef.current.send(JSON.stringify({
                        realtime_input: {
                            media_chunks: [{
                                mime_type: "audio/pcm;rate=16000",
                                data: base64Data
                            }]
                        }
                    }));
                }
            };

            source.connect(processor);
            processor.connect(audioContext.destination);
            setIsInteracting(true);
            console.log("Audio capture active and processing");
        } catch (err: any) {
            console.error("Error accessing microphone:", err);
            let msg = "Microphone access denied.";
            if (err.name === "NotAllowedError") msg = "Microphone permission was denied by the browser.";
            if (err.name === "NotFoundError") msg = "No microphone found on this device.";
            setError(msg);
            setIsInteracting(false);
        }
    };

    const stopAudioCapture = useCallback(() => {
        console.log("Stopping audio capture...");
        if (processorRef.current) {
            processorRef.current.disconnect();
            processorRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (audioContextRef.current) {
            if (audioContextRef.current.state !== "closed") {
                audioContextRef.current.close();
            }
            audioContextRef.current = null;
        }
        setIsInteracting(false);
        setVolume(0); // Reset volume when stopping capture
    }, []);

    const playAudio = (base64Data: string) => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        }

        const binaryString = atob(base64Data);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        const pcmData = new Int16Array(bytes.buffer);
        const floatData = new Float32Array(pcmData.length);
        for (let i = 0; i < pcmData.length; i++) {
            floatData[i] = pcmData[i] / 0x7FFF;
        }

        const buffer = audioContextRef.current.createBuffer(1, floatData.length, 16000);
        buffer.getChannelData(0).set(floatData);

        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContextRef.current.destination);
        source.start();
    };

    return {
        connected,
        error,
        transcript,
        isInteracting,
        volume,
        connect,
        disconnect,
        startAudioCapture,
        stopAudioCapture
    };
}
