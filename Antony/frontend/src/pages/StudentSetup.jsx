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

  // State for interactivity
  const [courses, setCourses] = useState([]);
  const [courseInput, setCourseInput] = useState('');
  
  const [techSkills, setTechSkills] = useState([]);
  const [techInput, setTechInput] = useState('');
  const [selectedTech, setSelectedTech] = useState([]);

  const [researchExp, setResearchExp] = useState([]);
  const [interests, setInterests] = useState([]);

  const handleNext = () => {
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
                <TextInput label="FIRST NAME" id="fname" placeholder="First Name" />
                <TextInput label="LAST NAME" id="lname" placeholder="Last Name" />
              </div>
              <TextInput label="UNIVERSITY" id="university" placeholder="Your University" />
              <TextInput label="UNIVERSITY EMAIL" id="email" placeholder="email@university.edu" />
              <div className="form-row">
                <TextInput label="MAJOR" id="major" placeholder="Major" />
                <TextInput label="YEAR" id="year" placeholder="Year" />
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
                <TextInput 
                  label="SEARCH CATALOG TO ADD COURSES" 
                  id="search" 
                  placeholder="Type course code and click Add..." 
                  value={courseInput}
                  onChange={(e) => setCourseInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCourse()}
                />
                <Button className="search-btn" onClick={addCourse}>Add</Button>
              </div>
              
              <div className="course-list">
                <label className="mono-label">YOUR ENROLLED COURSES ({courses.length} selected)</label>
                
                {courses.length === 0 && <p className="text-secondary" style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>No courses added yet.</p>}
                
                {courses.map((c, idx) => (
                  <div key={idx} className="course-item">
                    <div className="course-info">
                      <span className="course-code">{c.code}</span>
                    </div>
                    <button className="remove-btn" onClick={() => removeCourse(idx)}>[Remove]</button>
                  </div>
                ))}
              </div>

              <TextInput label="HOURS AVAILABLE PER WEEK" id="hours" placeholder="e.g. 10 Hours" />

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
                  options={techSkills}
                  selected={selectedTech}
                  onChange={setSelectedTech}
                />
                
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <input 
                    type="text" 
                    className="text-input" 
                    style={{ flex: 1, padding: '0.5rem' }} 
                    placeholder="Enter new skill..." 
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTechSkill()}
                  />
                  <Button variant="outline" className="btn-sm" onClick={addTechSkill}>Add Skill</Button>
                </div>
              </div>
              
              <div className="skills-section">
                <label className="mono-label">RESEARCH EXPERIENCE LEVEL</label>
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
                  selected={interests}
                  onChange={setInterests}
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
