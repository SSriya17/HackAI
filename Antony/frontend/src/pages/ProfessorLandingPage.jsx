import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ProfessorLandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)] max-w-[1000px] m-auto">
      <div className="text-center max-w-[600px] mb-8 flex flex-col items-center">
        <div className="font-mono text-xs tracking-widest text-primary border border-border p-2 rounded-full mb-8 bg-accent/10">
          FOR PROFESSORS
        </div>
        <h1 className="font-serif text-4xl mb-6 text-primary">Recruit students who fit your lab</h1>
        <p className="text-lg text-muted-foreground mb-12 leading-relaxed">
          RAlign connects you with undergrads taking your courses and interested in your research. 
          Manage applicants, build your lab profile, and find motivated students.
        </p>

        <Button
          variant="primary"
          size="lg"
          className="min-w-[220px] p-5 text-xl transition-all hover:scale-[1.02]"
          onClick={() => navigate('/login?role=professor')}
        >
          Get started as a Professor →
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest text-primary">CATALOG INTEGRATION</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Students from your courses</h3>
            <p className="text-muted-foreground mt-2">See students enrolled in your classes who are looking for research.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#e83870' }}>SCORING ENGINE</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Compatibility Matching</h3>
            <p className="text-muted-foreground mt-2">Get ranked matches based on student skills and lab preferences.</p>
          </CardContent>
        </Card>

        <Card className="flex flex-col gap-4 p-6 hover:border-ring transition-colors">
          <CardContent className="p-0">
            <div className="font-mono text-xs uppercase tracking-widest" style={{ color: '#ffb347' }}>LAB PROFILE</div>
            <h3 className="font-serif text-2xl text-primary mt-2">Showcase your research</h3>
            <p className="text-muted-foreground mt-2">Build a profile so students can find and apply to your lab.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
