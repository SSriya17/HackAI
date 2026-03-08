import React, { useState } from 'react';
import Chatbot from './Chatbot';
import Dashboard from './Dashboard';
import './App.css';

function App() {
  const [view, setView] = useState('chatbot'); // 'chatbot' or 'dashboard'

  return (
    <div className="app-layout">
      <nav className="main-nav">
        <div className="nav-logo">⚡</div>
        <button
          className={`nav-item ${view === 'chatbot' ? 'active' : ''}`}
          onClick={() => setView('chatbot')}
        >
          Chatbot
        </button>
        <button
          className={`nav-item ${view === 'dashboard' ? 'active' : ''}`}
          onClick={() => setView('dashboard')}
        >
          Dashboard
        </button>
      </nav>

      <div className="content-area">
        {view === 'chatbot' ? <Chatbot /> : <Dashboard />}
      </div>
    </div>
  );
}

export default App;
