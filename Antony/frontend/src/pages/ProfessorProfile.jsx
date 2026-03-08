import { useState, useEffect } from 'react';
import { useUser, saveUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';

export default function ProfessorProfile() {
  const user = useUser();
  const [labName, setLabName] = useState('');
  const [labSpots, setLabSpots] = useState('');
  const [labHours, setLabHours] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLabName(user.labName || '');
    setLabSpots(user.labSpots || '');
    setLabHours(user.labHours || '');
  }, [user.labName, user.labSpots, user.labHours]);

  const handleSave = () => {
    saveUser({ labName, labSpots, labHours });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

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
            <InputField label="LAB / RESEARCH GROUP NAME" id="profile-labname" value={labName} onChange={(e) => setLabName(e.target.value)} />
            <div className="flex gap-4">
              <InputField label="SPOTS OPEN" id="profile-spots" value={labSpots} onChange={(e) => setLabSpots(e.target.value)} />
              <InputField label="EXPECTED HOURS / WEEK" id="profile-hours" value={labHours} onChange={(e) => setLabHours(e.target.value)} />
            </div>
            <Button variant="primary" className="mt-4" onClick={handleSave}>
              {isSaved ? 'Saved!' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
