export function Skeleton({ label = "Carregando" }) {
  return <div className="skeleton" role="status" aria-label={label} />;
}
