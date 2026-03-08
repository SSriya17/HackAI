import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentDashboard() {
  const { displayName, major, year } = useUser();

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  return (
    <DashboardLayout title={`Welcome back, ${displayName}`} subtitle={[major, year].filter(Boolean).join(' • ') || ''} navItems={navItems}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent">6</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">MATCHES FOUND</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 text-[#ffb347]">2</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">APPLICATIONS SENT</div>
          </CardContent>
        </Card>
        <Card className="flex flex-col justify-center p-8">
          <CardContent className="p-0">
            <div className="font-serif text-4xl leading-tight mb-4 text-[#a395b3]">1</div>
            <div className="font-mono text-xs uppercase tracking-widest text-primary">RESPONSES</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 mt-12">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest block mb-4">TOP MATCHES</label>
          <div className="flex flex-col gap-4">
            <Card className="flex items-center p-5 gap-6 hover:border-ring transition-colors cursor-pointer">
              <CardContent className="p-0 flex items-center gap-6 w-full">
                <div className="min-w-12 h-12 rounded flex items-center justify-center font-serif text-lg text-primary bg-[#2e1a47]">VG</div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-primary">Dr. Forouz Shirvani</h3>
                  <span className="font-mono text-xs text-muted-foreground">CGS 3340 · until 3:45 PM</span>
                </div>
                <div className="font-mono text-xl bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent">91%</div>
              </CardContent>
            </Card>
            <Card className="flex items-center p-5 gap-6 hover:border-ring transition-colors cursor-pointer">
              <CardContent className="p-0 flex items-center gap-6 w-full">
                <div className="min-w-12 h-12 rounded flex items-center justify-center font-serif text-lg text-primary bg-[#3b2359]">SN</div>
                <div className="flex-1">
                  <h3 className="font-serif text-lg text-primary">Dr. Ru Miao</h3>
                  <span className="font-mono text-xs text-muted-foreground">STAT 5304 · until 5:00 PM</span>
                </div>
                <div className="font-mono text-xl text-[#e83870]">65%</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <label className="font-mono text-xs uppercase tracking-widest block mb-4">LIVE CLASS STATUS</label>
          <Card className="flex p-6 gap-4 border-l-2 border-l-primary">
            <CardContent className="p-0 flex gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <div>
                <h3 className="text-lg text-primary">Dr. Jason Smith</h3>
                <span className="font-mono text-xs text-muted-foreground block mt-2">CS 3341 · until 3:45 PM</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
