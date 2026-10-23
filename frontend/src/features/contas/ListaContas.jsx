export default function ListaContas({ contas, onAcao }) {
  return (
    <section>
      <h3>Lista de contas</h3>
      <ul>
        {contas.map((conta) => (
          <li key={conta.id}>
            Conta {conta.id}: {conta.saldo} — {conta.situacao}{" "}
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
