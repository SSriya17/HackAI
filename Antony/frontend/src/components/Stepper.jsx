import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Stepper({ steps = 3, currentStep }) {
  const stepsArray = Array.from({ length: steps }, (_, i) => i + 1);

  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {stepsArray.map((step, index) => {
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;

          return (
            <div key={step} className="flex items-center flex-1">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all',
                  isCompleted && 'bg-primary text-primary-foreground',
                  isActive && 'bg-primary text-primary-foreground ring-2 ring-primary/30',
                  !isCompleted && !isActive && 'bg-muted text-muted-foreground'
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : step}
              </div>
              {index < stepsArray.length - 1 && (
                <div className={cn('flex-1 h-0.5 mx-2 transition-colors', isCompleted ? 'bg-primary' : 'bg-muted')} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
