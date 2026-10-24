import { formatarMoeda } from "../../lib/formato.js";
import { StatusChip } from "../../components/StatusChip.jsx";

export default function ListaContas({ contas, onAcao }) {
  return (
    <section>
      <h3>Lista de contas</h3>
      <ul className="data-list">
        {contas.map((conta) => (
          <li className="card" key={conta.id}>
            <strong>Conta {conta.id}</strong>
            <strong>{formatarMoeda(conta.saldo)}</strong>
            <span className="muted">Conta {conta.id}: {conta.saldo}</span>
            <StatusChip situacao={conta.situacao} />
            <button onClick={() => onAcao(conta.id, "ativar")}>
              Ativar conta
            </button>
            <button onClick={() => onAcao(conta.id, "desativar")}>
              Desativar conta
            </button>
            <button onClick={() => onAcao(conta.id, "situacao")}>
              Ver situação da conta
            </button>
            <button onClick={() => onAcao(conta.id, "remover")}>
              Remover conta
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
