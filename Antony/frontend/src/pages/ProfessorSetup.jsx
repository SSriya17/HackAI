import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '@/components/Stepper';
import { Card, CardContent } from '@/components/ui/card';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import ToggleGroup from '@/components/ToggleGroup';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useUser, saveUser } from '@/hooks/useUser';

export default function ProfessorSetup() {
  const user = useUser();
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [university, setUniversity] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [title, setTitle] = useState('');
  const [labName, setLabName] = useState('');
  const [spots, setSpots] = useState('');
  const [hours, setHours] = useState('');

  const [reqSkills, setReqSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    setFirstName(user.firstName || '');
    setLastName(user.lastName || '');
    setUniversity(user.university || '');
    setEmail(user.email || '');
    setDepartment(user.department || '');
    setTitle(user.title || '');
    setLabName(user.labName || '');
    setSpots(user.labSpots || '');
    setHours(user.labHours || '');
  }, [user.firstName, user.lastName, user.university, user.email, user.department, user.title, user.labName, user.labSpots, user.labHours]);

  const handleNext = () => {
    if (step === 1) {
      saveUser({ firstName, lastName, university, email, department, title });
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      saveUser({ labName, labSpots: spots, labHours: hours });
      navigate('/professor/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkill = { label: skillInput.trim(), value: skillInput.trim().toLowerCase() };
      setReqSkills([...reqSkills, newSkill]);
      setSelectedSkills([...selectedSkills, newSkill.value]);
      setSkillInput('');
    }
  };

  return (
    <div className="max-w-[600px] m-auto pb-8">
      <Stepper steps={3} currentStep={step} />

      <div className="mt-4">
        <div className="inline-block border border-border px-3 py-1 rounded-full mb-6 font-mono text-xs uppercase tracking-widest" style={{ color: '#ffb347' }}>
          PROFESSOR STEP 0{step}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl mb-2 text-primary">Create your profile</h2>
            <p className="text-muted-foreground mb-8 text-lg">Basic information to help students identify your department and role.</p>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-4">
                  <InputField label="FIRST NAME" id="fname" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                  <InputField label="LAST NAME" id="lname" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                </div>
                <InputField label="UNIVERSITY" id="university" placeholder="University" value={university} onChange={(e) => setUniversity(e.target.value)} />
                <div className="flex gap-4">
                  <InputField label="DEPARTMENT" id="department" placeholder="e.g. Computer Science" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  <InputField label="TITLE" id="title" placeholder="e.g. Associate Professor" value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <InputField label="UNIVERSITY EMAIL" id="email" type="email" placeholder="email@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Button variant="primary" className="w-full" onClick={handleNext}>Continue →</Button>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="font-serif text-3xl mb-2 text-primary">Your Teaching Schedule</h2>
            <p className="text-muted-foreground mb-8 text-lg">Importing your courses allows students in your classes to find your research more easily.</p>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">COURSES YOU ARE TEACHING</Label>
                  <Textarea className="min-h-[100px]" placeholder="Enter your courses here (e.g. CS 4375, CS 3341)..." />
                </div>
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
            <h2 className="font-serif text-3xl mb-2 text-primary">Lab &amp; Research Requirements</h2>

            <Card>
              <CardContent className="pt-6 space-y-6">
                <InputField label="LAB / RESEARCH GROUP NAME" id="lab-name" placeholder="Lab name" value={labName} onChange={(e) => setLabName(e.target.value)} />
                <div>
                  <Label className="font-mono text-xs uppercase tracking-widest text-primary block mb-2">RESEARCH BIO</Label>
                  <Textarea className="min-h-[80px]" placeholder="Tell us about your research focus..." />
                </div>
                <div className="flex gap-4">
                  <InputField label="SPOTS OPEN" id="spots" placeholder="# of spots" value={spots} onChange={(e) => setSpots(e.target.value)} />
                  <InputField label="EXPECTED HOURS / WEEK" id="hours" placeholder="Hours" value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div className="flex flex-col gap-3">
                  <Label className="font-mono text-xs uppercase tracking-widest text-primary">REQUIRED SKILLS</Label>
                  <ToggleGroup multiSelect options={reqSkills} selected={selectedSkills} onChange={setSelectedSkills} />
                  <div className="flex gap-2">
                    <Input className="flex-1 h-10" placeholder="Enter required skill..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addSkill()} />
                    <Button variant="outline" onClick={addSkill}>Add Skill</Button>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <Button variant="outline" className="flex-[0_0_30%]" onClick={handleBack}>← Back</Button>
                  <Button variant="primary" className="flex-1" onClick={handleNext}>Publish Profile →</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
