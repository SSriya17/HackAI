import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import './DashboardViews.css';

export default function ProfessorDashboard() {
  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout 
      title="Welcome, Dr. Smith" 
      subtitle="Intelligent Systems Lab"
      navItems={navItems}
    >
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-value text-gradient">8</div>
          <div className="stat-label mono-label">TOTAL APPLICANTS</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value" style={{color: '#ffb347'}}>2</div>
          <div className="stat-label mono-label">SPOTS OPEN</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value" style={{color: '#a395b3'}}>84%</div>
          <div className="stat-label mono-label">AVG MATCH SCORE</div>
        </Card>
      </div>

      <div className="dashboard-grid no-collapse">
        <div className="top-matches">
          <label className="mono-label section-label">MATCHED APPLICANTS</label>
          <div className="match-list flex-col">
            <Card hoverable className="match-card">
              <div className="match-avatar">AV</div>
              <div className="match-info">
                <h3>Antony Varkey</h3>
                <span className="match-sub">Freshman &middot; Computer Science</span>
              </div>
              <div className="match-score" style={{color: '#ffb347'}}>88%</div>
            </Card>
            
            <Card hoverable className="match-card">
              <div className="match-avatar" style={{backgroundColor: '#3b2359'}}>SG</div>
              <div className="match-info">
                <h3>Sreya Gudipati</h3>
                <span className="match-sub">Sophomore &middot; Cognitive Science</span>
              </div>
              <div className="match-score" style={{color: '#e83870'}}>74%</div>
            </Card>
          </div>
        </div>

        <div className="live-status">
          <label className="mono-label section-label">MY COURSE SECTIONS</label>
          <Card className="status-card">
            <div className="status-info">
              <label className="mono-label" style={{color: '#ffb347', marginBottom: '0.25rem', display: 'block'}}>CS 3341 &middot; TR 2:30-3:45</label>
              <h3 style={{fontSize: '1.1rem'}}>Probability and Statistics for CS</h3>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
