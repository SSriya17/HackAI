import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../config';

export function useInterviewChat(onFeedback, onAiFeedback) {
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [volume, setVolume] = useState(0);
  const [messages, setMessages] = useState([]);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const streamRef = useRef(null);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInterimTranscript((prev) => (prev + ' ' + finalTranscript).trim());
            const fillers = ['um', 'uh', 'like', 'you know'];
            let count = 0;
            fillers.forEach((f) => {
              const matches = finalTranscript.toLowerCase().match(new RegExp(`\\b${f}\\b`, 'g'));
              if (matches) count += matches.length;
            });
            if (count > 0 && onFeedback) onFeedback(count);
          }
        };

        recognition.onerror = (event) => {
          if (event.error === 'not-allowed') setError('Microphone permission denied.');
        };

        recognitionRef.current = recognition;
      } else {
        setError('Speech recognition not supported in this browser.');
      }
    }
  }, [onFeedback]);

  const submitAnswer = async () => {
    if (!interimTranscript.trim() || isSpeakingRef.current) return;
    const text = interimTranscript.trim();
    setInterimTranscript('');
    setTranscript((prev) => [...prev, `[You]: ${text}`]);

    const userMsg = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);

    try {
      const response = await fetch(`${API_BASE}/interview/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const detail = errBody?.detail ?? response.statusText;
        if (response.status === 500 && typeof detail === 'string' && detail.includes('Groq API key')) {
          throw new Error('Groq API key not configured. Add GROQ_API_KEY to backend/.env');
        }
        if (response.status >= 500) {
          throw new Error(detail || 'Backend error. Start: cd backend && uvicorn main:app --reload');
        }
        throw new Error(detail || 'Failed to get response from AI Professor');
      }

      const data = await response.json();
      const aiMessage = data.message;

      if (data.raw_json) {
        try {
          const parsed = JSON.parse(data.raw_json);
          if (onAiFeedback) onAiFeedback({ sentiment: parsed.sentiment, accuracy: parsed.technical_accuracy });
        } catch (e) {
          console.error('Failed to parse AI JSON stats', e);
        }
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: aiMessage }]);
      setTranscript((prev) => [...prev, `[AI Professor]: ${aiMessage}`]);
      speak(aiMessage);
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('Load failed')) {
        setError('Backend not running. Start: cd backend && uvicorn main:app --reload');
      } else {
        setError(msg);
      }
    }
  };

  const speak = (text) => {
    if (typeof window === 'undefined') return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      isSpeakingRef.current = true;
      setIsInteracting(false);
    };
    utterance.onend = () => {
      isSpeakingRef.current = false;
      setIsInteracting(true);
    };
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find((v) => v.name.includes('Google US English') || v.name.includes('Samantha'));
    if (preferred) utterance.voice = preferred;
    window.speechSynthesis.speak(utterance);
  };

  const connect = useCallback(async () => {
    setConnected(true);
    setIsInteracting(true);
    setError(null);
    const greeting =
      "Hello! I'm Dr. Anurag Nagar. I'm excited to talk to you about your interest in our air quality monitoring project. To start off, could you tell me a bit about your background in machine learning?";
    setTranscript([`[AI Professor]: ${greeting}`]);
    setMessages([{ role: 'assistant', content: greeting }]);
    speak(greeting);
    if (recognitionRef.current) recognitionRef.current.start();
    startVolumeMonitoring();
  }, []);

  const disconnect = useCallback(() => {
    setConnected(false);
    setIsInteracting(false);
    if (recognitionRef.current) recognitionRef.current.stop();
    window.speechSynthesis.cancel();
    stopVolumeMonitoring();
  }, []);

  const startVolumeMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = ac;
      const source = ac.createMediaStreamSource(stream);
      const processor = ac.createScriptProcessor(2048, 1, 1);
      processor.onaudioprocess = (e) => {
        const data = e.inputBuffer.getChannelData(0);
        let sum = 0;
        for (let i = 0; i < data.length; i++) sum += data[i] * data[i];
        setVolume(Math.min(100, Math.round(Math.sqrt(sum / data.length) * 500)));
      };
      source.connect(processor);
      processor.connect(ac.destination);
    } catch (err) {
      console.error('Volume monitoring error:', err);
    }
  };

  const stopVolumeMonitoring = () => {
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (audioContextRef.current) audioContextRef.current.close();
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
  };
}
