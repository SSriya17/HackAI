import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import StudentSetup from './pages/StudentSetup';
import ProfessorSetup from './pages/ProfessorSetup';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import StudentSettings from './pages/StudentSettings';
import ProfessorDashboard from './pages/ProfessorDashboard';
import ProfessorApplicants from './pages/ProfessorApplicants';
import ProfessorCourses from './pages/ProfessorCourses';
import ProfessorProfile from './pages/ProfessorProfile';
import StudentMatches from './pages/StudentMatches';
import InterviewPrepPage from './pages/InterviewPrepPage';
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <header className="flex items-center justify-between p-6 bg-transparent w-full">
          <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none' }}>
            <img src="/RAlign_logo.png" alt="RAlign Logo" className="max-w-[450px] h-auto object-contain drop-shadow-lg" />
          </Link>
          {/* Header actions can go here based on route */}
        </header>

        <main className="flex-1 flex flex-col w-full">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/student/setup" element={<StudentSetup />} />
            <Route path="/professor/setup" element={<ProfessorSetup />} />
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/applications" element={<StudentApplications />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
            <Route path="/professor/applicants" element={<ProfessorApplicants />} />
            <Route path="/professor/courses" element={<ProfessorCourses />} />
            <Route path="/professor/profile" element={<ProfessorProfile />} />
            <Route path="/student/matches" element={<StudentMatches />} />
            <Route path="/interview-prep" element={<InterviewPrepPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
