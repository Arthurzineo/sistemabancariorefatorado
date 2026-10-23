export default function AcoesCliente({ onAcao }) {
  return (
    <>
      <button onClick={() => onAcao("ativar")}>Ativar</button>
      <button onClick={() => onAcao("desativar")}>Desativar</button>
      <button onClick={() => onAcao("situacao")}>Ver situação</button>
      <button onClick={() => onAcao("remover")}>Remover</button>
    </>
  );
}
