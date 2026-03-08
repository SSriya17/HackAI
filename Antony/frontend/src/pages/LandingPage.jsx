import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="badge">UNIVERSITY RESEARCH MATCHMAKER</div>
        <h1 className="hero-title">From lecture to lab</h1>
        <p className="hero-subtitle">
          RAlign uses live course catalog data and publication matching to connect
          undergrads with the faculty doing exactly the work they care about.
        </p>
        
        <div className="hero-actions">
          <Button 
            className="action-btn"
            onClick={() => navigate('/student/setup')}
          >
            I'm a Student &rarr;
          </Button>
          <Button 
            variant="outline" 
            className="action-btn"
            onClick={() => navigate('/professor/setup')}
          >
            I'm a Professor &rarr;
          </Button>
        </div>
      </div>

      <div className="features-section">
        <Card hoverable className="feature-card">
          <div className="feature-label mono-label">CATALOG INTEGRATION</div>
          <h3 className="feature-title">Live Class Schedules</h3>
          <p className="feature-desc">
            Pulled directly from university APIs — see exactly where professors are right now.
          </p>
        </Card>
        
        <Card hoverable className="feature-card">
          <div className="feature-label mono-label" style={{ color: '#e83870' }}>SCORING ENGINE</div>
          <h3 className="feature-title">Compatibility Matching</h3>
          <p className="feature-desc">
            Skills and research interests matched against professor bios and publication history.
          </p>
        </Card>
        
        <Card hoverable className="feature-card">
          <div className="feature-label mono-label" style={{ color: '#ffb347' }}>OUTREACH ASSISTANT</div>
          <h3 className="feature-title">Cold Email Chatbot</h3>
          <p className="feature-desc">
            AI drafts personalized outreach emails using context from recent publications.
          </p>
        </Card>
      </div>
    </div>
  );
}
