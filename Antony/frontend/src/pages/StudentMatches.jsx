import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Stepper from '@/components/Stepper';
import ToggleGroup from '@/components/ToggleGroup';
import InputField from '@/components/ui/input-field';
import { getNebulaMatches } from '@/api/client';
import ColdEmailChatbot from '@/components/ColdEmailChatbot';

const YEAR_OPTIONS = [
  { label: 'Freshman', value: 'Freshman' },
  { label: 'Sophomore', value: 'Sophomore' },
  { label: 'Junior', value: 'Junior' },
  { label: 'Senior', value: 'Senior' },
  { label: 'Graduate', value: 'Graduate' },
];

const DEGREE_OPTIONS = [
  { label: 'BS Computer Science', value: 'BS Computer Science' },
  { label: 'BS Software Engineering', value: 'BS Software Engineering' },
  { label: 'BS Data Science', value: 'BS Data Science' },
  { label: 'BS Electrical Engineering', value: 'BS Electrical Engineering' },
  { label: 'BS Mathematics', value: 'BS Mathematics' },
  { label: 'Other', value: 'Other' },
];

const SKILL_OPTIONS = [
  { label: 'Python', value: 'Python' },
  { label: 'Machine Learning', value: 'Machine Learning' },
  { label: 'NLP', value: 'NLP' },
  { label: 'Computer Vision', value: 'Computer Vision' },
  { label: 'Data Analysis', value: 'Data Analysis' },
  { label: 'Statistics', value: 'Statistics' },
  { label: 'Deep Learning', value: 'Deep Learning' },
];

const LAB_OPTIONS = [
  { label: 'AI / ML Research', value: 'AI machine learning research' },
  { label: 'Systems & Networks', value: 'systems networks distributed' },
  { label: 'HCI / UX', value: 'HCI human computer interaction UX' },
  { label: 'Data Science', value: 'data science analytics' },
  { label: 'Theory', value: 'theory algorithms' },
  { label: 'Healthcare / Bio', value: 'healthcare biology medical' },
];

export default function StudentMatches() {
  const { major } = useUser();
  const [step, setStep] = useState(1);
  const [year, setYear] = useState('');
  const [degree, setDegree] = useState('');
  const [otherDegree, setOtherDegree] = useState('');
  const [skills, setSkills] = useState([]);
  const [labPrefs, setLabPrefs] = useState([]);
  const [customSkills, setCustomSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);

  const handleFindMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const skillsStr = [...skills, ...customSkills.split(/[,;]/).map((s) => s.trim()).filter(Boolean)].join(', ');
      const labStr = labPrefs.join(' ');
      const degreeToSend = degree === 'Other' ? otherDegree : (degree || major || '');
      const res = await getNebulaMatches({
        year,
        degree: degreeToSend,
        skills: skillsStr,
        lab_preferences: labStr,
      });
      const list = Array.isArray(res) ? res : [];
      setMatches(list);
      try { localStorage.setItem('lastStudentMatches', JSON.stringify(list)); } catch (_) {}
      if (list.length === 0) {
        setError('No professors returned from Nebula API. Set NEBULA_API_KEY in backend/.env (request from https://discord.utdnebula.com).');
      }
      setStep(4);
    } catch (err) {
      setError(err?.message || 'Backend not reachable. Is it running on port 8000?');
      setMatches([]);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { label: 'Dashboard', path: '/student/dashboard' },
    { label: 'Find Matches', path: '/student/matches' },
    { label: 'Interview Prep', path: '/interview-prep' },
    { label: 'Applications', path: '/student/applications' },
    { label: 'Settings', path: '/student/settings' },
  ];

  if (step <= 3) {
    return (
      <DashboardLayout navItems={navItems} title="Find Your Research Matches" subtitle="Complete the questionnaire to see recommended professors">
      <div className="max-w-[600px] m-auto pb-8">
        <Stepper steps={3} currentStep={step} />
        <div className="mt-4">
          <div className="inline-block border border-border px-3 py-1 rounded-full mb-6 font-mono text-xs uppercase tracking-widest text-primary">
            QUESTIONNAIRE STEP 0{step}
          </div>

          {step === 1 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-3xl mb-2 text-primary">Your background</h2>
              <p className="text-muted-foreground mb-8 text-lg">We use this to match you with professors teaching relevant courses.</p>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <Label className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">YEAR</Label>
                    <div className="flex flex-wrap gap-2">
                      {YEAR_OPTIONS.map((o) => (
                        <Button
                          key={o.value}
                          type="button"
                          variant={year === o.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setYear(o.value)}
                        >
                          {o.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">DEGREE</Label>
                    <div className="flex flex-wrap gap-2">
                      {DEGREE_OPTIONS.map((o) => (
                        <Button
                          key={o.value}
                          type="button"
                          variant={degree === o.value ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setDegree(o.value)}
                        >
                          {o.label}
                        </Button>
                      ))}
                    </div>
                    {degree === 'Other' && (
                      <Input className="mt-3" placeholder="Enter your degree" value={otherDegree} onChange={(e) => setOtherDegree(e.target.value)} />
                    )}
                  </div>
                  <Button variant="primary" className="w-full" onClick={() => setStep(2)}>Continue →</Button>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-3xl mb-2 text-primary">Your skills</h2>
              <p className="text-muted-foreground mb-8 text-lg">Select skills you have or are learning.</p>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ToggleGroup
                    multiSelect
                    options={SKILL_OPTIONS}
                    selected={skills}
                    onChange={setSkills}
                  />
                  <InputField
                    label="ADDITIONAL SKILLS (comma-separated)"
                    id="custom-skills"
                    placeholder="e.g. TensorFlow, pandas, R"
                    value={customSkills}
                    onChange={(e) => setCustomSkills(e.target.value)}
                  />
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={() => setStep(1)}>← Back</Button>
                    <Button variant="primary" onClick={() => setStep(3)}>Continue →</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 className="font-serif text-3xl mb-2 text-primary">Lab preferences</h2>
              <p className="text-muted-foreground mb-8 text-lg">What kind of research lab interests you?</p>
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <ToggleGroup
                    multiSelect
                    options={LAB_OPTIONS}
                    selected={labPrefs}
                    onChange={setLabPrefs}
                  />
                  <div className="flex justify-between gap-4">
                    <Button variant="outline" onClick={() => setStep(2)}>← Back</Button>
                    <Button variant="primary" className="flex-1" onClick={handleFindMatches} disabled={loading}>
                      {loading ? 'Finding matches...' : 'Find My Matches'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      </DashboardLayout>
    );
  }

  const skillsStr = [...skills, ...customSkills.split(/[,;]/).map((s) => s.trim()).filter(Boolean)].join(', ');
  const labStr = labPrefs.join(' ');

  return (
    <DashboardLayout navItems={navItems} title="Recommended Professors for Research" subtitle={`${matches.length} professors matched with your interests`}>
      <div className="mb-8 flex justify-between items-start">
        <div>
          <label className="font-mono text-xs uppercase tracking-widest inline-block border border-border px-4 py-1 rounded-full mb-6 text-primary">
            RECOMMENDED FOR RESEARCH
          </label>
          <h1 className="font-serif text-3xl text-primary mb-2">{matches.length} Professors Recommended for You</h1>
          <p className="font-mono text-xs normal-case text-muted-foreground mt-2">
            {degree || major ? `Matched for ${degree || major}` : 'Based on your skills and lab preferences'}
          </p>
        </div>
        <Button variant="outline" onClick={() => setStep(1)}>Retake Questionnaire</Button>
      </div>

      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-6 mt-8">
        {matches.length === 0 && !error && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">No professors found. Try broadening your skills or lab preferences, then click Retake Questionnaire to search again.</p>
            </CardContent>
          </Card>
        )}
        {matches.map((m, idx) => {
          const initials = m.professor_name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
          const pct = Math.round(m.match_percent || 0);
          const isHigh = pct >= 70;
          return (
            <Card key={m.professor_id || idx} className="flex flex-col gap-6 p-8 hover:border-ring transition-colors cursor-pointer">
              <CardContent className="p-0 flex flex-col gap-6">
                <div className="flex items-center gap-6">
                  <div className="min-w-14 h-14 rounded flex items-center justify-center font-serif text-2xl text-primary bg-[#2e1a47]">
                    {initials}
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif text-2xl text-primary">{m.professor_name}</h2>
                    {m.email && <span className="font-mono text-xs text-muted-foreground block">{m.email}</span>}
                  </div>
                  <div
                    className={`w-16 h-16 rounded flex flex-col items-center justify-center border ${
                      isHigh ? 'border-primary bg-primary/10' : 'border-[#e83870]'
                    }`}
                  >
                    <span
                      className={`font-mono text-2xl leading-tight ${isHigh ? 'bg-gradient-to-r from-primary to-[#e83870] bg-clip-text text-transparent' : 'text-[#e83870]'}`}
                    >
                      {pct}
                    </span>
                    <span className="font-mono text-[0.5rem] uppercase tracking-widest text-primary">MATCH</span>
                  </div>
                </div>
                {m.courses && m.courses.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.courses.map((c, i) => (
                      <span key={i} className="font-mono text-xs px-3 py-1 rounded border border-border bg-muted">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isHigh ? 'bg-gradient-to-r from-primary to-[#e83870]' : 'bg-[#e83870]'}`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <ColdEmailChatbot
        matches={matches}
        skillsStr={skillsStr}
        labStr={labStr}
        visible={step === 4 && matches.length > 0}
      />
    </DashboardLayout>
  );
}
