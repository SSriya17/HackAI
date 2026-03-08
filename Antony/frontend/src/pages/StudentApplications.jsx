import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function StudentApplications() {
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Applications">
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">Track your applications and matches on the Dashboard.</p>
          <Link to="/student/dashboard">
            <Button variant="primary">Go to Dashboard</Button>
          </Link>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
