export function Field({ label, error, hint, prefix, children, ...props }) {
  const id = props.id || props.name;
  const described =
    [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") ||
    undefined;
  const input = children || (
    <input
      {...props}
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={described}
    />
  );
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="field-control">
        {prefix && <span>{prefix}</span>}
        {input}
      </div>
      {hint && <small id={`${id}-hint`}>{hint}</small>}
      {error && (
        <small id={`${id}-error`} className="field-error" role="alert">
          {error}
        </small>
      )}
    </div>
  );
}
