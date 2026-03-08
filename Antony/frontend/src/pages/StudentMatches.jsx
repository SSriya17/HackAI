import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import './DashboardViews.css';

export default function StudentMatches() {
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout navItems={navItems}>
      <div className="matches-header">
        <label className="mono-label rounded-label">MATCHES FOUND</label>
        <h1 className="dashboard-title">6 Compatible Professors</h1>
        <p className="dashboard-subtitle mono-label mt-2" style={{textTransform: 'none', color: 'var(--text-secondary)'}}>
          Matched for Computer Science &middot; Python, Machine Learning
        </p>
      </div>

      <div className="matches-list flex-col mt-4">
        <Card hoverable className="match-card-large">
          <div className="match-card-header">
            <div className="match-avatar large">VG</div>
            <div className="match-info">
              <span className="live-indicator"><span className="dot"></span> IN CLASS NOW</span>
              <h2>Dr. Jason Smith</h2>
              <span className="match-dept">Computer Science</span>
            </div>
            <div className="match-score-circle">
              <span className="text-gradient score-number">91</span>
              <span className="mono-label" style={{fontSize: '0.5rem'}}>MATCH</span>
            </div>
          </div>
          <div className="match-tags">
            <span className="tag outline">Machine Learning</span>
            <span className="tag outline">AI Planning</span>
          </div>
          <div className="match-progress-bar">
            <div className="progress-fill" style={{width: '91%'}}></div>
          </div>
        </Card>

        <Card hoverable className="match-card-large">
          <div className="match-card-header">
            <div className="match-avatar large" style={{backgroundColor: '#3b2359'}}>SN</div>
            <div className="match-info">
              <span className="live-indicator offline"><span className="dot offline"></span> AVAILABLE</span>
              <h2>Dr. Ru Miao</h2>
              <span className="match-dept">Computer Science</span>
            </div>
            <div className="match-score-circle" style={{borderColor: '#e83870'}}>
              <span className="score-number" style={{color: '#e83870'}}>65</span>
              <span className="mono-label" style={{fontSize: '0.5rem'}}>MATCH</span>
            </div>
          </div>
          <div className="match-tags">
            <span className="tag outline" style={{borderColor: '#e83870', color: '#e83870'}}>Deep Learning</span>
            <span className="tag outline" style={{borderColor: '#e83870', color: '#e83870'}}>Healthcare AI</span>
          </div>
          <div className="match-progress-bar">
            <div className="progress-fill" style={{width: '65%', background: '#e83870'}}></div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
