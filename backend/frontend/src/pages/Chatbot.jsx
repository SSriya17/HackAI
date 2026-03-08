import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import './Chatbot.css';

const Chatbot = () => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I can help you draft a compelling cold email to a professor. Who are you looking to contact and what is your goal?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [professorName, setProfessorName] = useState('');
    const [studentName, setStudentName] = useState('');
    const [labPrefs, setLabPrefs] = useState('');
    const [skills, setSkills] = useState('');
    const messagesEndRef = useRef(null);

    const navItems = [
        { label: 'Dashboard', path: '/student/dashboard' },
        { label: 'Find Matches', path: '/student/matches' },
        { label: 'Outreach AI', path: '/student/outreach' },
        { label: 'Applications', path: '/student/applications' },
        { label: 'Settings', path: '/student/settings' }
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() && !professorName) return;

        const userMessage = input.trim() || `I want to email Prof. ${professorName} about research opportunities.`;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('http://localhost:8000/api/email/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    professor_name: professorName,
                    professor_id: professorName, // Using name as ID for now if not selected from list
                    student_name: studentName || 'Alex Johnson',
                    student_lab_preferences: labPrefs || 'Machine Learning',
                    student_skills: skills || 'Python, PyTorch'
                })
            });

            const data = await response.json();
            if (data.email_text) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.email_text, papers: data.papers_used }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I couldn't generate the email. Please check the professor's name." }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Error connecting to the server. Make sure the backend is running." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout
            title="Outreach AI"
            subtitle="Draft personalized cold emails for your research opportunities"
            navItems={navItems}
        >
            <div className="chatbot-page-content">
                <div className="chatbot-setup-sidebar">
                    <div className="sidebar-section">
                        <h3>Professor Search</h3>
                        <input
                            type="text"
                            placeholder="Professor Name"
                            value={professorName}
                            onChange={(e) => setProfessorName(e.target.value)}
                        />
                    </div>

                    <div className="sidebar-section">
                        <h3>Your Profile</h3>
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Research Interests"
                            value={labPrefs}
                            onChange={(e) => setLabPrefs(e.target.value)}
                        />
                        <textarea
                            placeholder="Your Skills"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>
                </div>

                <main className="chat-area">
                    <div className="messages-container">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`message ${msg.role}`}>
                                <div className="message-avatar">
                                    {msg.role === 'assistant' ? '⚡' : '👤'}
                                </div>
                                <div className="message-content">
                                    <div className="message-header">
                                        {msg.role === 'assistant' ? 'Professor Outreach AI' : 'You'}
                                    </div>
                                    <div className="message-body">
                                        {msg.content.split('\n').map((line, i) => (
                                            <p key={i}>{line}</p>
                                        ))}
                                    </div>
                                    {msg.papers && msg.papers.length > 0 && (
                                        <div className="papers-used">
                                            <h4>Papers Referenced:</h4>
                                            <ul>
                                                {msg.papers.map((p, i) => (
                                                    <li key={i}>{p.title} ({p.year})</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {loading && <div className="message assistant loading">Thinking...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input-area">
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Type your response..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            />
                            <div className="input-actions">
                                <button className="send-btn" onClick={handleSend}>Send</button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </DashboardLayout>
    );
};

export default Chatbot;
