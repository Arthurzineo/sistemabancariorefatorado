import { useEffect, useState } from "react";
import { listarContas, transferir } from "../../api/contas.js";
import Mensagem from "../../components/Mensagem.jsx";
import { useMensagem } from "../../hooks/useMensagem.js";
import Transferencia from "./Transferencia.jsx";

export default function TransferenciaPage() {
  const [contas, setContas] = useState([]);
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
  async function realizar(dados) {
    try {
      const resultado = await transferir(dados);
      await carregar();
      return resultado;
    } catch (error) {
      avisar(error.message, true);
      throw error;
    }
  }
  return (
    <section>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Movimentação</p>
          <h2>Transferir</h2>
        </div>
      </div>
      <Mensagem texto={mensagem} erro={erro} />
      <Transferencia contas={contas} onTransferir={realizar} moderno />
    </section>
  );
}
