export function Select({
  label,
  hint,
  error,
  options = [],
  children,
  ...props
}) {
  const id = props.id || props.name;
  const described =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        {...props}
        aria-invalid={Boolean(error)}
        aria-describedby={described}
      >
        <option value="">Selecione</option>
        {children ||
          options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
