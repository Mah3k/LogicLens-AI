import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  hint,
  icon: Icon,
  required = false,
  id,
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="field">
      {label && (
        <label htmlFor={fieldId} className="field-label">
          {label} {required && <span className="field-required">*</span>}
        </label>
      )}
      <div className={`field-wrap ${error ? 'field-error' : ''}`}>
        {Icon && <Icon size={17} className="field-icon" />}
        <input
          id={fieldId}
          type={isPassword ? (show ? 'text' : 'password') : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={!!error}
          aria-describedby={error ? `${fieldId}-error` : undefined}
        />
        {isPassword && (
          <button
            type="button"
            className="field-toggle"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <p id={`${fieldId}-error`} className="field-msg field-msg-error">{error}</p>}
      {hint && !error && <p className="field-msg">{hint}</p>}
    </div>
  );
}
