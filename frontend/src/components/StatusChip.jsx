import { Icon } from "./Icon.jsx";

export function StatusChip({ situacao }) {
  const ativa = /^(ativa|ativo)$/i.test(situacao);
  return (
    <span
      className={`status-chip ${ativa ? "status-chip--active" : "status-chip--inactive"}`}
    >
      <span className="status-chip__icon" aria-label={situacao}>
        <Icon name={ativa ? "check" : "alert"} />
      </span>
      <span>{situacao}</span>
    </span>
  );
}
