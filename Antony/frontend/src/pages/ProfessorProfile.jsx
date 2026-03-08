import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import TextInput from '../components/TextInput';

export default function ProfessorProfile() {
  const [labName, setLabName] = useState('');
  const [spots, setSpots] = useState('');
  const [hours, setHours] = useState('');

  useEffect(() => {
    setLabName(localStorage.getItem('labName') || 'Intelligent Systems Lab');
    setSpots(localStorage.getItem('labSpots') || '2');
    setHours(localStorage.getItem('labHours') || '10');
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Lab Profile">
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Lab Details</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This information is visible to students looking for research opportunities.</p>
          </div>
          
          <TextInput 
            label="LAB / RESEARCH GROUP NAME" 
            id="profile-labname" 
            value={labName}
            readOnly
          />

          <div style={{ display: 'flex', gap: '1rem' }}>
            <TextInput 
              label="SPOTS OPEN" 
              id="profile-spots" 
              value={spots}
              readOnly
            />
            <TextInput 
              label="EXPECTED HOURS / WEEK" 
              id="profile-hours" 
              value={hours}
              readOnly
            />
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
}
