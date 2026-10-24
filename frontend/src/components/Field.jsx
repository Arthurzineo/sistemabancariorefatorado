export function Field({ label, error, hint, children }) {
  const id = children.props.id || children.props.name;
  return <div className="field"><label htmlFor={id}>{label}</label>{children}{hint && <small id={`${id}-hint`}>{hint}</small>}{error && <small className="field-error" id={`${id}-error`} role="alert">{error}</small>}</div>;
}
