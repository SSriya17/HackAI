import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ToggleGroup from '../components/ToggleGroup';
import './Setup.css';

export default function ProfessorSetup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const [reqSkills, setReqSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save elements to localStorage
      localStorage.setItem('labName', document.getElementById('lab-name')?.value || '');
      localStorage.setItem('labSpots', document.getElementById('spots')?.value || '');
      localStorage.setItem('labHours', document.getElementById('hours')?.value || '');
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
    <div className="setup-container">
      <Stepper steps={3} currentStep={step} />
      
      <div className="step-content">
        <div className="step-badge mono-label" style={{ color: '#ffb347' }}>PROFESSOR STEP 0{step}</div>
        
        {step === 1 && (
          <div className="step-pane">
            <h2 className="step-title">Create your profile</h2>
            <p className="step-subtitle">Basic information to help students identify your department and role.</p>
            
            <Card className="setup-card">
              <div className="form-row">
                <TextInput label="FIRST NAME" id="fname" placeholder="First Name" />
                <TextInput label="LAST NAME" id="lname" placeholder="Last Name" />
              </div>
              <TextInput label="UNIVERSITY" id="university" placeholder="University" />
              <div className="form-row">
                <TextInput label="DEPARTMENT" id="department" placeholder="Department" />
                <TextInput label="TITLE" id="title" placeholder="e.g. Associate Professor" />
              </div>
              <TextInput label="UNIVERSITY EMAIL" id="email" placeholder="email@university.edu" />
              
              <div className="form-actions right-align">
                <Button className="w-full" onClick={handleNext}>Continue &rarr;</Button>
              </div>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="step-pane">
            <h2 className="step-title">Your Teaching Schedule</h2>
            <p className="step-subtitle">Importing your courses allows students in your classes to find your research more easily.</p>
            
            <Card className="setup-card">
              <div className="input-group">
                <label className="mono-label">COURSES YOU ARE TEACHING</label>
                <textarea 
                  className="text-input" 
                  rows="4"
                  placeholder="Enter your courses here (e.g. CS 4375, CS 3341)..."
                />
              </div>

              <div className="form-actions split">
                <Button variant="outline" onClick={handleBack}>&larr; Back</Button>
                <Button onClick={handleNext}>Continue &rarr;</Button>
              </div>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="step-pane">
            <h2 className="step-title">Lab &amp; Research Requirements</h2>
            
            <Card className="setup-card">
              <TextInput label="LAB / RESEARCH GROUP NAME" id="lab-name" placeholder="Lab Name" />
              
              <div className="input-group">
                <label className="mono-label">RESEARCH BIO</label>
                <textarea 
                  className="text-input" 
                  rows="3"
                  placeholder="Tell us about your research focus..."
                />
              </div>

              <div className="form-row">
                <TextInput label="SPOTS OPEN" id="spots" placeholder="# of Spots" />
                <TextInput label="EXPECTED HOURS / WEEK" id="hours" placeholder="Hours" />
              </div>

              <div className="skills-section mt-4">
                <label className="mono-label">REQUIRED SKILLS</label>
                <ToggleGroup 
                  multiSelect
                  options={reqSkills}
                  selected={selectedSkills}
                  onChange={setSelectedSkills}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="text-input" 
                    style={{ flex: 1, padding: '0.5rem' }} 
                    placeholder="Enter required skill..." 
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button variant="outline" className="btn-sm" onClick={addSkill}>Add Skill</Button>
                </div>
              </div>

              <div className="form-actions split">
                <Button variant="outline" onClick={handleBack}>&larr; Back</Button>
                <Button onClick={handleNext}>Publish Profile &rarr;</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
