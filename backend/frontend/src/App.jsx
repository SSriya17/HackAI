import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chatbot from './pages/Chatbot';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <header className="app-header">
          <div className="logo-container">
            <span className="logo-icon">🔬</span>
            <div className="logo-text">
              <h1>ALIGN</h1>
              <span>YOUR LAB IS WAITING</span>
            </div>
          </div>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="*" element={<Chatbot />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
