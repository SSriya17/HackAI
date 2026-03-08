import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfessorApplicants() {
  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Applicants">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">You have no pending applicants to review at this time.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
