import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import Card from '../components/Card';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import ToggleGroup from '../components/ToggleGroup';
import './Setup.css';

export default function StudentSetup() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/student/dashboard');
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
    else navigate('/');
  };

  return (
    <div className="setup-container">
      <Stepper steps={3} currentStep={step} />
      
      <div className="step-content">
        <div className="step-badge mono-label">STUDENT STEP 0{step}</div>
        
        {step === 1 && (
          <div className="step-pane">
            <h2 className="step-title">Tell us about yourself</h2>
            <p className="step-subtitle">We use this to find professors whose lab needs align with your background.</p>
            
            <Card className="setup-card">
              <div className="form-row">
                <TextInput label="FIRST NAME" id="fname" placeholder="Antony" />
                <TextInput label="LAST NAME" id="lname" placeholder="Varkey" />
              </div>
              <TextInput label="UNIVERSITY" id="university" placeholder="University of Texas at Dallas" />
              <TextInput label="UNIVERSITY EMAIL" id="email" placeholder="dal331242@utdallas.edu" />
              <div className="form-row">
                <TextInput label="MAJOR" id="major" placeholder="Computer Science" />
                <TextInput label="YEAR" id="year" placeholder="Freshman" />
              </div>
              
              <div className="form-actions right-align">
                <Button className="w-full" onClick={handleNext}>Continue &rarr;</Button>
              </div>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="step-pane">
            <h2 className="step-title">Import your schedule</h2>
            <p className="step-subtitle">We match you with professors currently teaching your courses.</p>
            
            <Card className="setup-card">
              <div className="course-search">
                <TextInput label="SEARCH CATALOG TO ADD COURSES" id="search" placeholder="Search by course name or professor..." />
                <Button className="search-btn">Search</Button>
              </div>
              
              <div className="course-list">
                <label className="mono-label">YOUR ENROLLED COURSES (3 selected)</label>
                
                <div className="course-item">
                  <div className="course-info">
                    <span className="course-code">CS 3345</span>
                    <span className="course-name">Data Structures</span>
                  </div>
                  <button className="remove-btn">[Remove]</button>
                </div>
                
                <div className="course-item">
                  <div className="course-info">
                    <span className="course-code">CS 4375</span>
                    <span className="course-name">Intro to Machine Learning</span>
                  </div>
                  <button className="remove-btn">[Remove]</button>
                </div>
              </div>

              <TextInput label="HOURS AVAILABLE PER WEEK" id="hours" placeholder="10 Hours" />

              <div className="form-actions split">
                <Button variant="outline" onClick={handleBack}>&larr; Back</Button>
                <Button onClick={handleNext}>Continue &rarr;</Button>
              </div>
            </Card>
          </div>
        )}

        {step === 3 && (
          <div className="step-pane">
            <h2 className="step-title">What can you bring?</h2>
            
            <Card className="setup-card">
              <div className="skills-section">
                <label className="mono-label">TECHNICAL SKILLS</label>
                <ToggleGroup 
                  multiSelect
                  options={[
                    { label: 'Python', value: 'python' },
                    { label: 'Machine Learning', value: 'ml' },
                    { label: 'PyTorch', value: 'pytorch' }
                  ]}
                  selected={['python', 'ml', 'pytorch']}
                  onChange={() => {}}
                />
                <button className="add-more-btn">Add more...</button>
              </div>
              
              <div className="skills-section">
                <label className="mono-label">RESEARCH EXPERIENCE LEVEL</label>
                <ToggleGroup 
                  options={[
                    { label: 'No Prior Research', value: 'none' },
                    { label: 'Coursework Only', value: 'coursework' },
                    { label: 'Lab Assistant', value: 'lab' }
                  ]}
                  selected={['coursework']}
                  onChange={() => {}}
                />
              </div>

              <div className="skills-section">
                <label className="mono-label">RESEARCH INTERESTS</label>
                <ToggleGroup 
                  multiSelect
                  options={[
                    { label: 'Machine Learning', value: 'ml_int' },
                    { label: 'NLP', value: 'nlp' },
                    { label: 'Computer Vision', value: 'cv' },
                    { label: 'Data Analysis', value: 'data' }
                  ]}
                  selected={['ml_int']}
                  onChange={() => {}}
                />
              </div>

              <div className="form-actions split">
                <Button variant="outline" onClick={handleBack}>&larr; Back</Button>
                <Button onClick={handleNext}>Finish Setup &rarr;</Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
