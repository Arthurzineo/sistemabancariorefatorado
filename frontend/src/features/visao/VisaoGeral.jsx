import { useEffect, useState } from "react";
import { listarClientes } from "../../api/clientes.js";
import { listarContas } from "../../api/contas.js";
import { formatarMoeda } from "../../lib/formato.js";
import { Card } from "../../components/Card.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Skeleton } from "../../components/Skeleton.jsx";
import { StatCard } from "../../components/StatCard.jsx";
import { StatusChip } from "../../components/StatusChip.jsx";

export default function VisaoGeral({ onNavigate }) {
  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState("");
  useEffect(() => {
    Promise.all([listarClientes(), listarContas()])
      .then(([clientes, contas]) => setDados({ clientes, contas }))
      .catch((e) => setErro(e.message));
  }, []);
  if (erro) return <p role="alert">{erro}</p>;
  if (!dados) return <Skeleton label="Carregando visão geral" />;
  const ativas = dados.contas.filter((conta) =>
    /^(ativa|ativo)$/i.test(conta.situacao),
  );
  const clientesAtivos = dados.clientes.filter((cliente) =>
    /^(ativa|ativo)$/i.test(cliente.situacao),
  );
  const total = ativas.reduce((soma, conta) => soma + Number(conta.saldo), 0);
  return (
    <>
      <section className="dashboard-hero" aria-labelledby="saldo-total">
        <span className="eyebrow">Saldo total em contas ativas</span>
        <strong id="saldo-total">{formatarMoeda(total)}</strong>
        <span className="muted">
          Atualizado agora · {ativas.length} contas ativas
        </span>
      </section>
      <div className="stat-grid">
        <StatCard
          label="Clientes ativos"
          value={clientesAtivos.length}
          detail={`${dados.clientes.length - clientesAtivos.length} inativos`}
        />
        <StatCard
          label="Contas ativas"
          value={ativas.length}
          detail={`${dados.contas.length - ativas.length} inativas`}
        />
      </div>
      <div className="quick-actions">
        <button
          className="button button--primary"
          onClick={() => onNavigate("transferir")}
        >
          ＋ Nova transferência
        </button>
        <button
          className="button button--primary"
          onClick={() => onNavigate("contas")}
        >
          ＋ Nova conta
        </button>
        <button
          className="button button--primary"
          onClick={() => onNavigate("clientes")}
        >
          ＋ Novo cliente
        </button>
      </div>
      <div className="section-heading">
        <h2>Contas em destaque</h2>
        <button
          className="button button--ghost"
          onClick={() => onNavigate("contas")}
        >
          Ver todas
        </button>
      </div>
      {dados.contas.length ? (
        <div className="data-list">
          {[...dados.contas]
            .sort((a, b) => b.saldo - a.saldo)
            .slice(0, 3)
            .map((conta) => (
              <Card key={conta.id}>
                <div className="data-list">
                  <span>Conta {conta.id}</span>
                  <strong>{formatarMoeda(conta.saldo)}</strong>
                  <StatusChip situacao={conta.situacao} />
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <EmptyState>Nenhuma conta cadastrada.</EmptyState>
      )}
      <div className="section-heading">
        <h2>Clientes recentes</h2>
      </div>
      <div className="data-list">
        {dados.clientes.slice(0, 3).map((cliente) => (
          <Card key={cliente.id}>
            <strong>{cliente.nome}</strong>
            <span className="muted"> · {cliente.email}</span>
          </Card>
        ))}
      </div>
    </>
  );
}
