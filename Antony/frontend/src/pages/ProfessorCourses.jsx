import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfessorCourses() {
  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="My Courses">
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">View and manage your current course sections.</p>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
