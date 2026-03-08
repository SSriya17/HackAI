import DashboardLayout from '../components/DashboardLayout';
import Card from '../components/Card';

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
        <p style={{ color: 'var(--text-secondary)' }}>You have no pending applicants to review at this time.</p>
      </Card>
    </DashboardLayout>
  );
}
