import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import './DashboardViews.css';

export default function StudentSettings() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    setEmail(localStorage.getItem('userEmail') || 'Not provided');
    setName(localStorage.getItem('userName') || 'Antony Varkey'); // fallback name
  }, []);

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
          <div>
            <h3 style={{ marginBottom: '1rem', fontFamily: 'var(--font-serif)', fontSize: '1.25rem' }}>Account Details</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>This information was saved during your signup or login.</p>
          </div>
          
          <TextInput 
            label="FULL NAME" 
            id="settings-name" 
            value={name}
            readOnly
          />
          <TextInput 
            label="EMAIL ADDRESS" 
            id="settings-email" 
            value={email}
            readOnly
          />
        </div>
      </Card>
    </DashboardLayout>
  );
}
