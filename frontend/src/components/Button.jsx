export function Button({ children, variant = "primary", ...props }) {
  const className = props.className
    ? `button button--${variant} ${props.className}`
    : `button button--${variant}`;
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
