import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] max-w-[1000px] m-auto">
      <div className="text-center max-w-[600px] mb-8 flex flex-col items-center">
        <div className="font-mono text-xs tracking-widest text-primary border border-border p-2 rounded-full mb-8 bg-accent/10">
          UNIVERSITY RESEARCH MATCHMAKER
        </div>
        <h1 className="font-serif text-4xl mb-6 text-primary">From lecture to lab</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          RAlign uses live course catalog data and publication matching to connect
          undergrads with the faculty doing exactly the work they care about.
        </p>

        <div className="flex gap-6">
          <Button
            variant="primary"
            size="lg"
            className="min-w-[180px] p-4 text-lg transition-all hover:scale-[1.02]"
            onClick={() => navigate('/login?role=student')}
          >
            I'm a Student →
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="min-w-[180px] p-4 text-lg transition-all"
            onClick={() => navigate('/login?role=professor')}
          >
            I'm a Professor →
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">CATALOG INTEGRATION</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Live Class Schedules</h3>
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#e83870' }}>SCORING ENGINE</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Compatibility Matching</h3>
          </CardContent>
        </Card>

        <Card
          className="flex flex-col gap-4 p-6 cursor-pointer hover:border-ring transition-colors"
          onClick={() => navigate('/interview-prep')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/interview-prep')}
        >
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#ffb347' }}>OUTREACH ASSISTANT</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Ghost-Twin Interview Prep</h3>
          </CardContent>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-6 opacity-60 border-dashed bg-transparent border-border">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest text-muted-foreground">COMING SOON</div>
            <h3 className="font-serif text-2xl text-muted-foreground mt-2">More Features</h3>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
