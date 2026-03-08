import DashboardLayout from '../components/DashboardLayout';
import './DashboardViews.css';

export default function StudentApplications() {
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Application Pipeline', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  // Mock data for the pipeline cards based on actual matches
  const pipelineData = {
    matched: [
      { id: 1, prof: 'Dr. Forouz Shirvani', dept: 'Computer Science', score: '91%' }
    ],
    contacted: [],
    interviewing: [
      { id: 4, prof: 'Dr. Jason Smith', dept: 'Computer Science', score: '91%' },
      { id: 5, prof: 'Dr. Ru Miao', dept: 'Computer Science', score: '65%' }
    ],
    accepted: [],
    rejected: []
  };

  const renderCard = (app) => (
    <div key={app.id} className="pipeline-card">
      <div className="pipeline-card-header">
        <div>
          <h4>{app.prof}</h4>
          <span className="pipeline-card-sub">{app.dept}</span>
        </div>
        <div className="pipeline-card-score" style={{
          color: parseInt(app.score) >= 90 ? 'var(--accent-color)' : 
                 parseInt(app.score) >= 70 ? '#ffb347' : 
                 parseInt(app.score) >= 50 ? '#a395b3' : 'var(--text-muted)'
        }}>
          {app.score}
        </div>
      </div>
      <div className="match-progress-bar" style={{height: '3px', background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem'}}>
        <div className="progress-fill" style={{
          width: app.score, 
          background: parseInt(app.score) >= 90 ? 'var(--accent-gradient)' : 
                     parseInt(app.score) >= 70 ? '#ffb347' : 
                     parseInt(app.score) >= 50 ? '#a395b3' : 'var(--text-muted)'
        }}></div>
      </div>
    </div>
  );

  return (
    <DashboardLayout navItems={navItems} title="Application Pipeline">
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Track the status of your research applications and upcoming interviews.</p>
      
      <div className="pipeline-board">
        {/* Matched Column */}
        <div className="pipeline-column">
          <div className="column-header">
            <h3>Matched</h3>
            <span className="column-count">{pipelineData.matched.length}</span>
          </div>
          {pipelineData.matched.map(renderCard)}
        </div>

        {/* Contacted Column */}
        <div className="pipeline-column">
          <div className="column-header">
            <h3>Contacted</h3>
            <span className="column-count">{pipelineData.contacted.length}</span>
          </div>
          {pipelineData.contacted.map(renderCard)}
        </div>

        {/* Interviewing Column */}
        <div className="pipeline-column" style={{borderColor: '#ffb347'}}>
          <div className="column-header">
            <h3 style={{color: '#ffb347'}}>Interviewing</h3>
            <span className="column-count">{pipelineData.interviewing.length}</span>
          </div>
          {pipelineData.interviewing.map(renderCard)}
        </div>

        {/* Accepted Column */}
        <div className="pipeline-column" style={{borderColor: '#4caf50'}}>
          <div className="column-header">
            <h3 style={{color: '#4caf50'}}>Accepted</h3>
            <span className="column-count">{pipelineData.accepted.length}</span>
          </div>
          {pipelineData.accepted.map(renderCard)}
        </div>

        {/* Rejected Column */}
        <div className="pipeline-column" style={{opacity: 0.7}}>
          <div className="column-header">
            <h3 style={{color: 'var(--text-muted)'}}>Rejected</h3>
            <span className="column-count">{pipelineData.rejected.length}</span>
          </div>
          {pipelineData.rejected.map(renderCard)}
        </div>
      </div>
    </DashboardLayout>
  );
}
