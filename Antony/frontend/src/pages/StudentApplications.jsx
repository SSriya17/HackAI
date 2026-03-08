import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentApplications() {
  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Application Pipeline', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' }
  ];

  const pipelineData = {
    matched: [{ id: 1, prof: 'Dr. Forouz Shirvani', dept: 'Computer Science', score: '91%' }],
    contacted: [],
    interviewing: [
      { id: 4, prof: 'Dr. Jason Smith', dept: 'Computer Science', score: '91%' },
      { id: 5, prof: 'Dr. Ru Miao', dept: 'Computer Science', score: '65%' }
    ],
    accepted: [],
    rejected: []
  };

  const getScoreColor = (score) => {
    const num = parseInt(score);
    if (num >= 90) return 'var(--primary)';
    if (num >= 70) return '#ffb347';
    if (num >= 50) return '#a395b3';
    return 'var(--muted-foreground)';
  };

  const renderCard = (app) => (
    <Card key={app.id} className="p-4 cursor-grab hover:border-primary transition-colors">
      <CardContent className="p-0">
        <div className="flex justify-between items-start gap-2 mb-2">
          <div>
            <h4 className="font-serif text-base leading-tight mb-1 text-primary">{app.prof}</h4>
            <span className="font-mono text-[0.7rem] text-muted-foreground">{app.dept}</span>
          </div>
          <span className="font-mono text-sm font-medium px-2 py-0.5 rounded bg-muted" style={{ color: getScoreColor(app.score) }}>
            {app.score}
          </span>
        </div>
        <div className="h-[3px] bg-muted rounded-full overflow-hidden mt-2">
          <div className="h-full rounded-full bg-primary" style={{ width: app.score }} />
        </div>
      </CardContent>
    </Card>
  );

  const renderColumn = (title, items, accent = false) => (
    <div className={`flex-1 min-w-[200px] rounded-lg border p-4 flex flex-col gap-4 ${accent ? 'border-[#ffb347]' : 'border-border'} bg-card`}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <h3 className={`font-serif text-base ${accent ? 'text-[#ffb347]' : 'text-primary'}`}>{title}</h3>
        <span className="px-2 py-0.5 rounded-full font-mono text-xs text-muted-foreground bg-muted">{items.length}</span>
      </div>
      {items.map(renderCard)}
    </div>
  );

  return (
    <DashboardLayout navItems={navItems} title="Application Pipeline">
      <p className="text-muted-foreground mb-8">Track the status of your research applications and upcoming interviews.</p>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[500px]">
        {renderColumn('Matched', pipelineData.matched)}
        {renderColumn('Contacted', pipelineData.contacted)}
        {renderColumn('Interviewing', pipelineData.interviewing, true)}
        {renderColumn('Accepted', pipelineData.accepted)}
        <div className="opacity-70">{renderColumn('Rejected', pipelineData.rejected)}</div>
      </div>
    </DashboardLayout>
  );
}
