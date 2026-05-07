import "./InputField.css";

export default function InputField({
  label, name, type = "text", placeholder,
  value, onChange, onBlur, error, touched, icon, hint,
}) {
  const hasError = touched && error;
  return (
    <div className={`input-group ${hasError ? "has-error" : ""}`}>
      <label className="input-label" htmlFor={name}>{label}</label>
      <div className="input-wrap">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          id={name} name={name} type={type}
          placeholder={placeholder} value={value}
          onChange={onChange} onBlur={onBlur}
          className={`input-field ${icon ? "has-icon" : ""} ${hasError ? "error" : ""}`}
        />
      </div>
      {hint && !hasError && <p className="input-hint">{hint}</p>}
      {hasError && <p className="input-error">⚠ {error}</p>}
    </div>
  );
}