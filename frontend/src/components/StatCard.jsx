import { Card } from "./Card.jsx";

export function StatCard({ label, value, detail }) {
  return <Card className="stat-card"><span className="eyebrow">{label}</span><strong>{value}</strong>{detail && <span className="muted">{detail}</span>}</Card>;
}
