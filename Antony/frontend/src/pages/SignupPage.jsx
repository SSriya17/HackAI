import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import './Setup.css';

export default function SignupPage() {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userName', name);
    localStorage.setItem('userRole', role);
    
    if (role === 'student') {
      navigate('/student/setup');
    } else {
      navigate('/professor/setup');
    }
  };

  return (
    <div className="setup-container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '450px' }}>
        <div style={{ textAlign: 'center', marginTop: '4rem', marginBottom: '2rem' }}>
          <h2 className="step-title">Create an account</h2>
          <p className="step-subtitle">Join RAlign to connect with research opportunities</p>
        </div>
        
        <Card className="setup-card">
          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'var(--bg-color)', padding: '0.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <Button 
                type="button"
                variant={role === 'student' ? 'primary' : 'ghost'} 
                className="w-full" 
                onClick={() => setRole('student')}
              >
                Student
              </Button>
              <Button 
                type="button"
                variant={role === 'professor' ? 'primary' : 'ghost'} 
                className="w-full"
                onClick={() => setRole('professor')}
              >
                Professor
              </Button>
            </div>

            <TextInput 
              label="FULL NAME" 
              id="name" 
              placeholder="Antony Varkey" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
            <TextInput 
              label="EMAIL ADDRESS" 
              id="email" 
              type="email" 
              placeholder="name@university.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <TextInput label="PASSWORD" id="password" type="password" placeholder="••••••••" required />
            
            <div className="form-actions mt-4">
              <Button type="submit" className="w-full">Sign Up &rarr;</Button>
            </div>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)', cursor: 'pointer', textDecoration: 'none' }}>Log in</Link>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
