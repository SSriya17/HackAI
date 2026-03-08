import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@/components/Stepper';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import ToggleGroup from '@/components/ToggleGroup';
import { Input } from '@/components/ui/input';
import { useUser, saveUser } from '@/hooks/useUser';

export default function StudentSetup() {
  const user = useUser();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');

  const [courses, setCourses] = useState([]);
  const [courseInput, setCourseInput] = useState('');
  const [hours, setHours] = useState('');

  const [techSkills, setTechSkills] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const [researchExp, setResearchExp] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setUniversity(user.university || '');
    setEmail(user.email || '');
    setMajor(user.major || '');
    setYear(user.year || '');
  }, [user.firstName, user.lastName, user.university, user.email, user.major, user.year]);

  const handleNext = () => {
    if (step === 1) {
      saveUser({ firstName, lastName, university, email, major, year });
    }
    if (step < 3) setStep(step + 1);
    else navigate('/student/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const addCourse = () => {
    if (courseInput.trim()) {
      setCourses([...courses, { code: courseInput.trim(), name: 'Custom Course' }]);
      setCourseInput('');
    }
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const addTechSkill = () => {
    if (techInput.trim()) {
      const newSkill = { label: techInput.trim(), value: techInput.trim().toLowerCase() };
      setTechSkills([...techSkills, newSkill]);
      setSelectedTech([...selectedTech, newSkill.value]);
      setTechInput('');
    }
  };

  return (
    <div className="max-w-[600px] m-auto pb-8">
      <Stepper steps={3} currentStep={step} />

      <div className="mt-4">
        <div className="inline-block border border-border px-3 py-1 rounded-full mb-6 font-mono text-xs uppercase tracking-widest text-primary">
          STUDENT STEP 0{step}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl mb-2 text-primary">Tell us about yourself</h2>
            <p className="text-muted-foreground mb-8 text-lg">We use this to find professors whose lab needs align with your background.</p>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-4">
                  <InputField label="FIRST NAME" id="fname" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <InputField label="LAST NAME" id="lname" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <InputField label="UNIVERSITY" id="university" placeholder="Your university" value={university} onChange={(e) => setUniversity(e.target.value)} />
                <InputField label="UNIVERSITY EMAIL" id="email" type="email" placeholder="email@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <div className="flex gap-4">
                  <InputField label="MAJOR" id="major" placeholder="e.g. Computer Science" value={major} onChange={(e) => setMajor(e.target.value)} />
                  <InputField label="YEAR" id="year" placeholder="e.g. Freshman, Sophomore" value={year} onChange={(e) => setYear(e.target.value)} />
                </div>
                <Button variant="primary" className="w-full" onClick={handleNext}>Continue →</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl mb-2 text-primary">Import your schedule</h2>
            <p className="text-muted-foreground mb-8 text-lg">We match you with professors currently teaching your courses.</p>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-end gap-4">
                  <InputField
                    label="SEARCH CATALOG TO ADD COURSES"
                    id="search"
                    placeholder="Type course code and click Add..."
                    value={courseInput}
                    onChange={(e) => setCourseInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addCourse()}
                  />
                  <Button className="h-11 px-6" onClick={addCourse}>Add</Button>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-xs uppercase tracking-widest text-primary">YOUR ENROLLED COURSES ({courses.length} selected)</label>
                  {courses.length === 0 && <p className="text-muted-foreground text-sm mt-2">No courses added yet.</p>}
                  {courses.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 border border-border rounded bg-muted">
                      <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
                      <button type="button" className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors" onClick={() => removeCourse(idx)}>[Remove]</button>
                    </div>
                  ))}
                </div>

                <InputField label="HOURS AVAILABLE PER WEEK" id="hours" placeholder="e.g. 10" value={hours} onChange={(e) => setHours(e.target.value)} />

                <div className="flex justify-between gap-4">
                  <Button variant="outline" className="flex-[0_0_30%]" onClick={handleBack}>← Back</Button>
                  <Button variant="primary" className="flex-1" onClick={handleNext}>Continue →</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl mb-2 text-primary">What can you bring?</h2>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex flex-col gap-3">
                  <label className="font-mono text-xs uppercase tracking-widest text-primary">TECHNICAL SKILLS</label>
                  <ToggleGroup multiSelect options={techSkills} selected={selectedTech} onChange={setSelectedTech} />
                  <div className="flex gap-2 mt-2">
                    <Input className="flex-1 h-10" placeholder="Enter new skill..." value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTechSkill()} />
                    <Button variant="outline" onClick={addTechSkill}>Add Skill</Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-xs uppercase tracking-widest text-primary">RESEARCH EXPERIENCE LEVEL</label>
                  <ToggleGroup
                    options={[
                      { label: 'No Prior Research', value: 'none' },
                      { label: 'Coursework Only', value: 'coursework' },
                      { label: 'Lab Assistant', value: 'lab' }
                    ]}
                    selected={researchExp}
                    onChange={setResearchExp}
                  />
                </div>

                <div className="flex flex-col gap-3">
                  <label className="font-mono text-xs uppercase tracking-widest text-primary">RESEARCH INTERESTS</label>
                  <ToggleGroup
                    multiSelect
                    options={[
                      { label: 'Machine Learning', value: 'ml_int' },
                      { label: 'NLP', value: 'nlp' },
                      { label: 'Computer Vision', value: 'cv' },
                      { label: 'Data Analysis', value: 'data' }
                    ]}
                    selected={interests}
                    onChange={setInterests}
                  />
                </div>

                <div className="flex justify-between gap-4">
                  <Button variant="outline" className="flex-[0_0_30%]" onClick={handleBack}>← Back</Button>
                  <Button variant="primary" className="flex-1" onClick={handleNext}>Finish Setup →</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
