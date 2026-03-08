import { Check } from 'lucide-react';
import './Stepper.css';

export default function Stepper({ steps = 3, currentStep }) {
  const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);
  
  return (
    <div className="stepper-container">
      <div className="stepper-wrapper">
        {stepsArray.map((step, index) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;
          
          return (
            <div key={step} className="step-item">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                {isCompleted ? <Check size={12} className="check-icon" /> : step}
              </div>
              
              {index < stepsArray.length - 1 && (
                <div className={`step-line-container`}>
                  <div className={`step-line ${currentStep > index + 1 ? 'completed' : ''} ${isActive ? 'active-gradient' : ''}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
