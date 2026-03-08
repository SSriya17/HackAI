import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import './DashboardViews.css';

export default function StudentDashboard() {
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout 
      title="Welcome back, Antony" 
      subtitle="Computer Science • Freshman"
      navItems={navItems}
    >
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-value text-gradient">6</div>
          <div className="stat-label mono-label">MATCHES FOUND</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value" style={{color: '#ffb347'}}>2</div>
          <div className="stat-label mono-label">APPLICATIONS SENT</div>
        </Card>
        <Card className="stat-card">
          <div className="stat-value" style={{color: '#a395b3'}}>1</div>
          <div className="stat-label mono-label">RESPONSES</div>
        </Card>
      </div>

      <div className="dashboard-grid">
        <div className="top-matches">
          <label className="mono-label section-label">TOP MATCHES</label>
          <div className="match-list flex-col">
            <Card hoverable className="match-card">
              <div className="match-avatar">VG</div>
              <div className="match-info">
                <h3>Dr. Forouz Shirvani</h3>
                <span className="match-sub">CGS 3340 &middot; until 3:45 PM</span>
              </div>
              <div className="match-score text-gradient">91%</div>
            </Card>
            
            <Card hoverable className="match-card">
              <div className="match-avatar" style={{backgroundColor: '#3b2359'}}>SN</div>
              <div className="match-info">
                <h3>Dr. Ru Miao</h3>
                <span className="match-sub">STAT 5304 &middot; until 5:00 PM</span>
              </div>
              <div className="match-score" style={{color: '#e83870'}}>65%</div>
            </Card>
          </div>
        </div>

        <div className="live-status">
          <label className="mono-label section-label">LIVE CLASS STATUS</label>
          <Card className="status-card active-class">
            <div className="status-indicator"></div>
            <div className="status-info">
              <h3>Dr. Jason Smith</h3>
              <span className="status-sub">CS 3341 &middot; until 3:45 PM</span>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
