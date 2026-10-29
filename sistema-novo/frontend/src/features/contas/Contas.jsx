import { useEffect, useState } from "react";
import {
  acaoConta,
  cadastrarConta,
  listarContas,
  removerConta,
  situacaoConta,
} from "../../api/contas.js";
import { Button } from "../../components/Button.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog.jsx";
import { Dialog } from "../../components/Dialog.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import Mensagem from "../../components/Mensagem.jsx";
import { Skeleton } from "../../components/Skeleton.jsx";
import { useMensagem } from "../../hooks/useMensagem.js";
import CadastroConta from "./CadastroConta.jsx";
import ListaContas from "./ListaContas.jsx";

export default function Contas() {
  const [contas, setContas] = useState([]);
  const [busca, setBusca] = useState("");
  const [novoAberto, setNovoAberto] = useState(false);
  const [removerId, setRemoverId] = useState(null);
  const { mensagem, erro, avisar } = useMensagem();

  async function carregar() {
    try {
      setContas(await listarContas());
    } catch (error) {
      avisar(error.message, true);
    }
  }
  useEffect(() => {
    carregar();
  }, []);

  async function cadastrar(dados) {
    try {
      await cadastrarConta(dados);
      setNovoAberto(false);
      avisar("Conta cadastrada.");
      await carregar();
    } catch (error) {
      avisar(error.message, true);
    }
  }
  async function executar(id, acao) {
    if (acao === "remover") {
      setRemoverId(id);
      return;
    }
    try {
      if (acao === "situacao") {
        const resultado = await situacaoConta(id);
        avisar(`Situação: ${resultado.situacao}`);
      } else {
        await acaoConta(id, acao);
        avisar("Operação concluída.");
        await carregar();
      }
    } catch (error) {
      avisar(error.message, true);
    }
  }
  const filtradas = contas.filter((conta) => String(conta.id).includes(busca));

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Carteira</p>
          <h2>Contas</h2>
        </div>
        <Button onClick={() => setNovoAberto(true)}>Nova conta</Button>
      </div>
      <Mensagem texto={mensagem} erro={erro} />
      <form className="toolbar" onSubmit={(event) => event.preventDefault()}>
        <label className="field">
          <span>Buscar conta por ID</span>
          <input
            value={busca}
            onChange={(event) => setBusca(event.target.value)}
            inputMode="numeric"
          />
        </label>
      </form>
      <Dialog
        open={novoAberto}
        onClose={() => setNovoAberto(false)}
        title="Nova conta"
      >
        <CadastroConta onCadastrar={cadastrar} />
      </Dialog>
      {contas.length === 0 ? (
        <Skeleton />
      ) : filtradas.length === 0 ? (
        <EmptyState>Nenhuma conta encontrada.</EmptyState>
      ) : (
        <ListaContas contas={filtradas} onAcao={executar} />
      )}
      <ConfirmDialog
        open={removerId !== null}
        onClose={() => setRemoverId(null)}
        onConfirm={async () => {
          await removerConta(removerId);
          setRemoverId(null);
          avisar("Conta removida.");
          await carregar();
        }}
      >
        Remover esta conta?
      </ConfirmDialog>
    </section>
  );
}
