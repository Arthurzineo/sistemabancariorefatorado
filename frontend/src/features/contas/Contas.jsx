import { useEffect, useState } from "react";
import {
  acaoConta,
  cadastrarConta,
  consultarConta,
  listarContas,
  removerConta,
  situacaoConta,
  transferir,
} from "../../api/contas.js";
import Mensagem from "../../components/Mensagem.jsx";
import { useMensagem } from "../../hooks/useMensagem.js";
import CadastroConta from "./CadastroConta.jsx";
import ConsultaConta from "./ConsultaConta.jsx";
import ListaContas from "./ListaContas.jsx";
import Transferencia from "./Transferencia.jsx";

export default function Contas() {
  const [contas, setContas] = useState([]);
  const { mensagem, erro, avisar } = useMensagem();
  async function carregar() {
    try {
      setContas(await listarContas());
    } catch (e) {
      avisar(e.message, true);
    }
  }
  useEffect(() => {
    carregar();
  }, []);
  async function cadastrar(dados) {
    try {
      await cadastrarConta(dados);
      avisar("Conta cadastrada.");
      carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function consultar(id) {
    try {
      const conta = await consultarConta(id);
      avisar(`Conta ${conta.id}: ${conta.saldo} — ${conta.situacao}`);
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function executar(id, acao) {
    try {
      if (acao === "remover") await removerConta(id);
      else if (acao === "situacao") {
        const resultado = await situacaoConta(id);
        avisar(`Situação: ${resultado.situacao}`);
        return;
      } else await acaoConta(id, acao);
      avisar("Operação concluída.");
      carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }
  async function mover(dados) {
    try {
      await transferir(dados);
      avisar("Transferência realizada.");
      carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }
  return (
    <section>
      <h2>Contas correntes</h2>
      <Mensagem texto={mensagem} erro={erro} />
      <ConsultaConta onConsultar={consultar} />
      <CadastroConta onCadastrar={cadastrar} />
      <ListaContas contas={contas} onAcao={executar} />
      <Transferencia onTransferir={mover} />
    </section>
  );
}
