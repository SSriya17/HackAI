import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfessorDashboard() {
  const { displayName, labName } = useUser();

  const navItems = [
    { label: 'Dashboard', path: '/professor/dashboard' },
    { label: 'Applicants', path: '/professor/applicants' },
    { label: 'My Courses', path: '/professor/courses' },
    { label: 'Lab Profile', path: '/professor/profile' }
  ];

  return (
    <DashboardLayout title={`Welcome back, ${displayName}`} subtitle={labName || ''} navItems={navItems}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent">8</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">TOTAL APPLICANTS</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 text-[#ffb347]">2</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">SPOTS OPEN</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 text-[#a395b3]">84%</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">AVG MATCH SCORE</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-12">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest block mb-4">MATCHED APPLICANTS</label>
          <div className="flex flex-col gap-4">
            <Card className="flex items-center p-5 gap-6 hover:border-ring transition-colors cursor-pointer">
              <CardContent className="p-0 flex items-center gap-6 w-full">
                <div className="min-w-12 h-12 rounded flex items-center justify-center font-serif text-lg text-primary bg-[#2e1a47]">AV</div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-primary">Applicant</h3>
                  <span className="font-mono text-xs text-muted-foreground">Freshman · Computer Science</span>
                </div>
                <div className="font-mono text-xl text-[#ffb347]">88%</div>
              </CardContent>
            </Card>
            <Card className="flex items-center p-5 gap-6 hover:border-ring transition-colors cursor-pointer">
              <CardContent className="p-0 flex items-center gap-6 w-full">
                <div className="min-w-12 h-12 rounded flex items-center justify-center font-serif text-lg text-primary bg-[#3b2359]">SG</div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-primary">Applicant</h3>
                  <span className="font-mono text-xs text-muted-foreground">Sophomore · Cognitive Science</span>
                </div>
                <div className="font-mono text-xl text-[#e83870]">74%</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest block mb-4">MY COURSE SECTIONS</label>
          <Card className="flex p-6 gap-4">
            <CardContent className="p-0">
              <label className="font-mono text-xs block mb-1 text-[#ffb347]">CS 3341 · TR 2:30-3:45</label>
              <h3 className="text-lg text-primary">Probability and Statistics for CS</h3>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
