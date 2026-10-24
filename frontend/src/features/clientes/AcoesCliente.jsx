import { Button } from "../../components/Button.jsx";

export default function AcoesCliente({ onAcao }) {
  return (
    <>
      <Button variant="ghost" onClick={() => onAcao("ativar")}>
        Ativar
      </Button>
      <Button variant="ghost" onClick={() => onAcao("desativar")}>
        Desativar
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
