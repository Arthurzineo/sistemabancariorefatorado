import { Button } from "../../components/Button.jsx";

export default function AcoesCliente({ onAcao, situacao }) {
  const ativa = /^(ativa|ativo)$/i.test(situacao);
  return (
    <>
      <Button
        variant="ghost"
        onClick={() => onAcao(ativa ? "desativar" : "ativar")}
      >
        {ativa ? "Desativar" : "Ativar"}
      </Button>
      <Button variant="ghost" onClick={() => onAcao("situacao")}>
        Ver situação
      </Button>
      <Button variant="danger" onClick={() => onAcao("remover")}>
        Remover
      </Button>
    </>
  );
}
