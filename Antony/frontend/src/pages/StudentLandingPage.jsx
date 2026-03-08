import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] max-w-[1000px] m-auto">
      <div className="text-center max-w-[600px] mb-8 flex flex-col items-center">
        <div className="font-mono text-xs tracking-widest text-primary border border-border p-2 rounded-full mb-8 bg-accent/10">
          FOR STUDENTS
        </div>
        <h1 className="font-serif text-4xl mb-6 text-primary">Find research that fits you</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          RAlign matches you with professors based on your courses, skills, and interests. 
          Discover labs, get personalized cold email drafts, and practice interviews with AI.
        </p>

        <Button
          variant="primary"
          size="lg"
          className="min-w-[220px] p-5 text-xl transition-all hover:scale-[1.02]"
          onClick={() => navigate('/login?role=student')}
        >
          Get started as a Student →
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">CATALOG INTEGRATION</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Find professors in your classes</h3>
            <p className="text-muted-foreground mt-2">Get matched with faculty teaching courses you&apos;re taking.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#e83870' }}>SCORING ENGINE</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Compatibility Matching</h3>
            <p className="text-muted-foreground mt-2">We surface professors whose research aligns with your interests.</p>
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
            <h3 className="font-serif text-2xl text-primary mt-2">Mock Interview Prep</h3>
            <p className="text-muted-foreground mt-2">Practice with AI trained on your matched professors&apos; research.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
