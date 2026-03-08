import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';

export default function StudentSettings() {
  const { fullName, email } = useUser();

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="Settings">
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6 max-w-[500px]">
            <div>
              <h3 className="font-serif text-xl mb-4 text-primary">Account Details</h3>
              <p className="text-muted-foreground text-sm mb-6">This information was saved during your signup or login.</p>
            </div>
            <InputField label="FULL NAME" id="settings-name" value={fullName || ''} readOnly />
            <InputField label="EMAIL ADDRESS" id="settings-email" value={email || ''} readOnly />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
