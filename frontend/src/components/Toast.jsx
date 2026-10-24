export function Toast({ texto, erro = false }) {
  if (!texto) return null;
  return <div className={`toast ${erro ? "toast--error" : "toast--success"}`} role={erro ? "alert" : "status"}>{erro ? "!" : "✓"} {texto}</div>;
}
