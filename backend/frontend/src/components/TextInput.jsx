import './TextInput.css';

export default function TextInput({ 
  label, 
  id, 
  error,
  className = '',
  ...props 
}) {
  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={id} className="mono-label">{label}</label>}
      <input 
        id={id} 
        className={`text-input ${error ? 'has-error' : ''}`} 
        {...props} 
      />
      {error && <span className="error-text">{error}</span>}
    </div>
  );
}
