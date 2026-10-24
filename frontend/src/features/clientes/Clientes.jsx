import { useEffect, useState } from "react";
import {
  acaoCliente,
  cadastrarCliente,
  consultarCliente,
  listarClientes,
  removerCliente,
  situacaoCliente,
  validarIdade,
} from "../../api/clientes.js";
import Mensagem from "../../components/Mensagem.jsx";
import { useMensagem } from "../../hooks/useMensagem.js";
import AcoesCliente from "./AcoesCliente.jsx";
import CadastroCliente from "./CadastroCliente.jsx";
import ConsultaCliente from "./ConsultaCliente.jsx";
import ListaClientes from "./ListaClientes.jsx";
import ValidacaoIdade from "./ValidacaoIdade.jsx";
import { ConfirmDialog } from "../../components/ConfirmDialog.jsx";
import { Button } from "../../components/Button.jsx";
import { Dialog } from "../../components/Dialog.jsx";
import { EmptyState } from "../../components/EmptyState.jsx";
import { Skeleton } from "../../components/Skeleton.jsx";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [removerId, setRemoverId] = useState(null);
  const [novoAberto, setNovoAberto] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const { mensagem, erro, avisar } = useMensagem();

  async function carregar() {
    try {
      setCarregando(true);
      setClientes(await listarClientes());
    } catch (e) {
      avisar(e.message, true);
    } finally {
      setCarregando(false);
    }
  }
  useEffect(() => {
    carregar();
  }, []);
  async function cadastrar(dados) {
    try {
      await cadastrarCliente(dados);
      avisar("Cliente cadastrado.");
      setNovoAberto(false);
      await carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function consultar(id) {
    try {
      const cliente = await consultarCliente(id);
      avisar(`Cliente: ${cliente.nome} — ${cliente.situacao}`);
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function validar(idade) {
    try {
      const resultado = await validarIdade(idade);
      avisar(resultado.mensagem, !resultado.permitida);
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function executar(id, acao) {
    try {
      if (acao === "remover") {
        setRemoverId(id);
        return;
      } else if (acao === "situacao") {
        const resultado = await situacaoCliente(id);
        avisar(`Situação: ${resultado.situacao}`);
        return;
      } else await acaoCliente(id, acao);
      avisar("Operação concluída.");
      carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }

  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Relacionamento</p>
          <h2>Clientes</h2>
        </div>
        <Button onClick={() => setNovoAberto(true)}>Novo cliente</Button>
      </div>
      <Mensagem texto={mensagem} erro={erro} />
      <ConsultaCliente onConsultar={consultar} />
      <ValidacaoIdade onValidar={validar} />
      <Dialog
        open={novoAberto}
        onClose={() => setNovoAberto(false)}
        title="Novo cliente"
      >
        <CadastroCliente onCadastrar={cadastrar} />
      </Dialog>
      {carregando ? (
        <Skeleton />
      ) : clientes.length === 0 ? (
        <EmptyState>Nenhum cliente cadastrado.</EmptyState>
      ) : (
        <ListaClientes
          clientes={clientes}
          renderAcoes={(cliente) => (
            <AcoesCliente
              situacao={cliente.situacao}
              onAcao={(acao) => executar(cliente.id, acao)}
            />
          )}
        />
      )}
      <ConfirmDialog
        open={removerId !== null}
        onClose={() => setRemoverId(null)}
        onConfirm={async () => {
          await removerCliente(removerId);
          setRemoverId(null);
          avisar("Cliente removido.");
          carregar();
        }}
      >
        Remover este cliente?
      </ConfirmDialog>
    </section>
  );
}
