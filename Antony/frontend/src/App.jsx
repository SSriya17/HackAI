import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentSetup from './pages/StudentSetup';
import ProfessorSetup from './pages/ProfessorSetup';
import StudentDashboard from './pages/StudentDashboard';
import ProfessorDashboard from './pages/ProfessorDashboard';
import StudentMatches from './pages/StudentMatches';
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
          {/* Header actions can go here based on route */}
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student/setup" element={<StudentSetup />} />
            <Route path="/professor/setup" element={<ProfessorSetup />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/student/matches" element={<StudentMatches />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
