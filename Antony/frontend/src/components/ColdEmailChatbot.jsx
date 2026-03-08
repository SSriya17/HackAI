import { useState } from 'react';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { generateColdEmail } from '@/api/client';

/**
 * Floating AI chatbot - bottom right. Appears after matches.
 * Helps students write cold emails to professors using API (Semantic Scholar + professor courses).
 * No hardcoded pipeline - all data from matches/API.
 */
export default function ColdEmailChatbot({ matches = [], skillsStr = '', labStr = '', visible }) {
  const { fullName } = useUser();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [studentName, setStudentName] = useState(fullName || '');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!visible || matches.length === 0) return null;

  const handleGenerate = async () => {
    if (!selected) return;
    setLoading(true);
    setError(null);
    try {
      const res = await generateColdEmail({
        professor_name: selected.professor_name,
        professor_id: selected.professor_id,
        student_name: studentName || 'Student',
        student_lab_preferences: labStr,
        student_skills: skillsStr,
        professor_courses: selected.courses || [],
      });
      setEmail(res?.email_text || res?.detail || 'Could not generate email.');
    } catch (err) {
      setError(err?.message || 'Failed to generate email. Ensure backend is running.');
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSelected(null);
    setEmail('');
    setError(null);
  };

  const close = () => {
    setOpen(false);
    reset();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        title="AI Cold Email Helper"
        aria-label="Open cold email helper"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:p-6">
          <div className="absolute inset-0 bg-black/30" onClick={close} aria-hidden="true" />
          <Card className="relative w-full max-w-md max-h-[85vh] flex flex-col shadow-xl animate-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="font-serif text-lg">AI Cold Email Helper</h3>
              <Button variant="ghost" size="sm" onClick={close}>✕</Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 overflow-y-auto flex-1">
              <p className="text-sm text-muted-foreground">
                Select a professor and we&apos;ll generate a personalized cold email referencing their research/courses.
              </p>

              <div>
                <Label className="text-xs uppercase tracking-wider">Your name</Label>
                <Input
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-xs uppercase tracking-wider">Select professor</Label>
                <select
                  value={selected?.professor_id || ''}
                  onChange={(e) => {
                    const m = matches.find((x) => x.professor_id === e.target.value);
                    setSelected(m || null);
                    setEmail('');
                    setError(null);
                  }}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Choose...</option>
                  {matches.map((m) => (
                    <option key={m.professor_id} value={m.professor_id}>
                      {m.professor_name} ({m.courses?.slice(0, 2).join(', ') || '—'})
                    </option>
                  ))}
                </select>
              </div>

              <Button onClick={handleGenerate} disabled={!selected || loading}>
                {loading ? 'Generating...' : 'Generate cold email'}
              </Button>

              {error && <p className="text-sm text-destructive">{error}</p>}

              {email && (
                <div>
                  <Label className="text-xs uppercase tracking-wider">Draft email</Label>
                  <textarea
                    readOnly
                    value={email}
                    className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm min-h-[160px] text-black"
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Copy and edit as needed before sending.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
