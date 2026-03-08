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

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/professor/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
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
                <TextInput label="FIRST NAME" id="fname" placeholder="Antony" />
                <TextInput label="LAST NAME" id="lname" placeholder="Varkey" />
              </div>
              <TextInput label="UNIVERSITY" id="university" placeholder="University of Texas at Dallas" />
              <div className="form-row">
                <TextInput label="DEPARTMENT" id="department" placeholder="Computer Science" />
                <TextInput label="TITLE" id="title" placeholder="Associate Professor" />
              </div>
              <TextInput label="UNIVERSITY EMAIL" id="email" placeholder="sxc@utdallas.edu" />
              
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
              <div className="course-search">
                <TextInput label="SEARCH CATALOG TO ADD COURSES" id="search" placeholder="Search course code..." />
                <Button className="search-btn">Add</Button>
              </div>
              
              <div className="course-list">
                <label className="mono-label">COURSES YOU ARE TEACHING</label>
                
                <div className="course-item">
                  <div className="course-info">
                    <span className="course-code">CS 4375 &middot; TR 2:30-3:45</span>
                    <span className="course-name">Intro to Machine Learning</span>
                  </div>
                  <button className="remove-btn">[Remove]</button>
                </div>
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
              <TextInput label="LAB / RESEARCH GROUP NAME" id="lab-name" defaultValue="Intelligent Systems Lab" />
              
              <div className="input-group">
                <label className="mono-label">RESEARCH BIO</label>
                <textarea 
                  className="text-input" 
                  rows="3"
                  defaultValue="Researching adaptive AI systems with focus on real-world deployment in healthcare and robotics. Seeking motivated undergrads."
                />
              </div>

              <div className="form-row">
                <TextInput label="SPOTS OPEN" id="spots" defaultValue="2" />
                <TextInput label="EXPECTED HOURS / WEEK" id="hours" defaultValue="10" />
              </div>

              <div className="skills-section mt-4">
                <label className="mono-label">REQUIRED SKILLS</label>
                <ToggleGroup 
                  multiSelect
                  options={[
                    { label: 'Python', value: 'python' },
                    { label: 'PyTorch', value: 'pytorch' }
                  ]}
                  selected={['python', 'pytorch']}
                  onChange={() => {}}
                />
                <button className="add-more-btn">Add more...</button>
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
