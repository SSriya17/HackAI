import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';

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
        <p style={{ color: 'var(--text-secondary)' }}>View and manage your current course sections.</p>
      </Card>
    </DashboardLayout>
  );
}
