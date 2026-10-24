import { formatarMoeda } from "../../lib/formato.js";
import { Button } from "../../components/Button.jsx";
import { StatusChip } from "../../components/StatusChip.jsx";

export default function ListaContas({ contas, onAcao }) {
  return (
    <section>
      <h3>Suas contas</h3>
      <ul className="account-grid">
        {contas.map((conta) => (
          <li className="card account-card" key={conta.id}>
            <div className="account-card__top">
              <span className="eyebrow">Conta corrente</span>
              <StatusChip situacao={conta.situacao} />
            </div>
            <strong className="account-card__number">Conta {conta.id}</strong>
            <strong className="account-card__balance">
              {formatarMoeda(conta.saldo)}
            </strong>
            <div className="account-card__actions">
              <Button
                variant="ghost"
                onClick={() =>
                  onAcao(
                    conta.id,
                    conta.situacao === "ATIVA" ? "desativar" : "ativar",
                  )
                }
              >
                {conta.situacao === "ATIVA" ? "Desativar" : "Ativar"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => onAcao(conta.id, "situacao")}
              >
                Situação
              </Button>
              <Button
                variant="danger"
                onClick={() => onAcao(conta.id, "remover")}
              >
                Remover
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
