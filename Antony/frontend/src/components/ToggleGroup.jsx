import { cn } from '@/lib/utils';

export default function ToggleGroup({ options = [], selected = [], onChange, multiSelect = false, className = '' }) {
  const handleToggle = (value) => {
    if (multiSelect) {
      if (selected.includes(value)) {
        onChange(selected.filter((item) => item !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => handleToggle(option.value)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-all border',
              isSelected
                ? 'bg-primary/10 border-primary text-foreground'
                : 'bg-transparent border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
            {multiSelect && isSelected && <span className="ml-1">✓</span>}
          </button>
        );
      })}
    </div>
  );
}
