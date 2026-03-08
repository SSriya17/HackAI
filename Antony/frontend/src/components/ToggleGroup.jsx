import './ToggleGroup.css';

export default function ToggleGroup({ 
  options = [], 
  selected = [], 
  onChange, 
  multiSelect = false,
  className = ''
}) {
  const handleToggle = (value) => {
    if (multiSelect) {
      if (selected.includes(value)) {
        onChange(selected.filter(item => item !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange([value]);
    }
  };

  return (
    <div className={`toggle-group ${className}`}>
      {options.map((option) => {
        const isSelected = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            className={`toggle-btn ${isSelected ? 'selected' : ''}`}
            onClick={() => handleToggle(option.value)}
          >
            {option.label}
            {multiSelect && isSelected && <span className="toggle-check">[x]</span>}
          </button>
        );
      })}
    </div>
  );
}
