import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STORAGE_MATCHES = 'lastStudentMatches';
const STORAGE_APPS = 'studentApplicationsSent';

function getStoredMatches() {
  try {
    const raw = localStorage.getItem(STORAGE_MATCHES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function getStoredApps() {
  try {
    const n = parseInt(localStorage.getItem(STORAGE_APPS) || '0', 10);
    return isNaN(n) ? 0 : Math.max(0, n);
  } catch {
    return 0;
  }
}

export default function StudentDashboard() {
  const { displayName, major, year } = useUser();
  const [matches, setMatches] = useState([]);
  const [applicationsSent, setApplicationsSent] = useState(0);

  useEffect(() => {
    setMatches(getStoredMatches());
    setApplicationsSent(getStoredApps());
  }, []);

  const handleAppsChange = (delta) => {
    const next = Math.max(0, applicationsSent + delta);
    setApplicationsSent(next);
    try { localStorage.setItem(STORAGE_APPS, String(next)); } catch (_) {}
  };

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  const topMatches = matches.slice(0, 5);

  return (
    <DashboardLayout title={`Welcome back, ${displayName}`} subtitle={[major, year].filter(Boolean).join(' • ') || ''} navItems={navItems}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent">{matches.length}</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">MATCHES FOUND</div>
            <p className="font-mono text-xs text-muted-foreground mt-2">From your last search</p>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0 flex flex-col">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0" onClick={() => handleAppsChange(-1)} aria-label="Decrease">−</Button>
              <div className="font-serif text-4xl leading-tight mb-1 text-[#ffb347] tabular-nums min-w-[3ch] text-center">{applicationsSent}</div>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-full shrink-0" onClick={() => handleAppsChange(1)} aria-label="Increase">+</Button>
            </div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">APPLICATIONS SENT</div>
            <p className="font-mono text-xs text-muted-foreground mt-2">Update as you apply</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between mb-4">
          <label className="font-mono text-xs uppercase tracking-widest">TOP MATCHES</label>
          {matches.length === 0 && (
            <Link to="/student/matches">
              <Button variant="outline" size="sm">Find Matches</Button>
            </Link>
          )}
        </div>
        <div className="flex flex-col gap-4">
          {topMatches.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <p>No matches yet. Complete the questionnaire to find professors.</p>
                <Link to="/student/matches">
                  <Button variant="primary" className="mt-4">Find My Matches</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            topMatches.map((m, idx) => {
              const initials = m.professor_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
              const pct = Math.round(m.match_percent || 0);
              const isHigh = pct >= 70;
              const courseStr = m.courses?.slice(0, 2).join(' · ') || '';
              return (
                <Link key={m.professor_id || idx} to="/student/matches">
                  <Card className="flex items-center p-5 gap-6 hover:border-ring transition-colors cursor-pointer">
                    <CardContent className="p-0 flex items-center gap-6 w-full">
                      <div className="min-w-12 h-12 rounded flex items-center justify-center font-serif text-lg text-primary bg-[#2e1a47]">{initials}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-primary truncate">{m.professor_name}</h3>
                        <span className="font-mono text-xs text-muted-foreground">{courseStr || '—'}</span>
                      </div>
                      <div className={`font-mono text-xl shrink-0 ${isHigh ? 'bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent' : 'text-[#e83870]'}`}>{pct}%</div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
