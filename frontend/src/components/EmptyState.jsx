export function EmptyState({ title = "Nada por aqui", children }) {
  return <div className="empty-state"><span className="empty-state__icon">○</span><h3>{title}</h3>{children && <p>{children}</p>}</div>;
}
