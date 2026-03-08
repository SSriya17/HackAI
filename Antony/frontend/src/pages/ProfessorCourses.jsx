import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function ProfessorCourses() {
  const { labName, labSpots } = useUser();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout navItems={navItems} title="My Courses" subtitle="Manage courses and assign lab recruitment">
      <div className="flex flex-col gap-6 max-w-[800px]">
        <Card className="hover:border-ring transition-colors">
          <CardContent className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <label className="font-mono text-xs block mb-1 text-[#ffb347]">CS 3341 · TR 2:30-3:45</label>
              <h3 className="text-xl text-primary font-serif">Probability and Statistics for CS</h3>
              <p className="text-sm text-muted-foreground mt-2">120 Students Enrolled</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2 text-left md:text-right">
              {labName ? (
                <div className="bg-primary/10 border border-primary px-4 py-3 rounded-md min-w-[200px]">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#e83870] block mb-1">ACTIVELY RECRUITING FOR</span>
                  <span className="font-serif text-primary text-base font-medium">{labName}</span>
                  {labSpots && <span className="text-xs text-muted-foreground block mt-1">{labSpots} spots open</span>}
                </div>
              ) : (
                <div className="flex flex-col items-start md:items-end gap-2">
                  <span className="text-sm text-muted-foreground">Not recruiting from this course</span>
                  <Button variant="outline" size="sm" onClick={() => navigate('/professor/profile')}>Enable Lab Recruitment</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
