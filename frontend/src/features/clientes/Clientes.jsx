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

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const { mensagem, erro, avisar } = useMensagem();

  async function carregar() {
    try {
      setClientes(await listarClientes());
    } catch (e) {
      avisar(e.message, true);
    }
  }
  useEffect(() => {
    carregar();
  }, []);
  async function cadastrar(dados) {
    try {
      await cadastrarCliente(dados);
      avisar("Cliente cadastrado.");
      carregar();
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
      if (acao === "remover") await removerCliente(id);
      else if (acao === "situacao") {
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
      <h2>Clientes</h2>
      <Mensagem texto={mensagem} erro={erro} />
      <ConsultaCliente onConsultar={consultar} />
      <ValidacaoIdade onValidar={validar} />
      <CadastroCliente onCadastrar={cadastrar} />
      <ListaClientes
        clientes={clientes}
        renderAcoes={(cliente) => (
          <AcoesCliente onAcao={(acao) => executar(cliente.id, acao)} />
        )}
      />
    </section>
  );
}
