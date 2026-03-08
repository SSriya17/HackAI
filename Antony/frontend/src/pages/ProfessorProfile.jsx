import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';

export default function ProfessorProfile() {
  const { labName, labSpots, labHours } = useUser();

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Lab Profile">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 max-w-[500px]">
            <div>
              <h3 className="font-serif text-xl mb-4 text-primary">Lab Details</h3>
              <p className="text-muted-foreground text-sm mb-6">This information is visible to students looking for research opportunities.</p>
            </div>
            <InputField label="LAB / RESEARCH GROUP NAME" id="profile-labname" value={labName || ''} readOnly />
            <div className="flex gap-4">
              <InputField label="SPOTS OPEN" id="profile-spots" value={labSpots || ''} readOnly />
              <InputField label="EXPECTED HOURS / WEEK" id="profile-hours" value={labHours || ''} readOnly />
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
