import { useState } from "react";
const inicial = { origem: "", destino: "", valor: "" };
export default function Transferencia({ onTransferir }) {
  const [formulario, setFormulario] = useState(inicial);
  function enviar(e) {
    e.preventDefault();
    onTransferir({
      origem: Number(formulario.origem),
      destino: Number(formulario.destino),
      valor: Number(formulario.valor),
    });
  }
  return (
    <form onSubmit={enviar}>
      <h3>Transferir valores</h3>
      <label>
        Conta de origem
        <input
          name="origem"
          type="number"
          value={formulario.origem}
          onChange={(e) =>
            setFormulario({ ...formulario, origem: e.target.value })
          }
          required
        />
      </label>
      <label>
        Conta de destino
        <input
          name="destino"
          type="number"
          value={formulario.destino}
          onChange={(e) =>
            setFormulario({ ...formulario, destino: e.target.value })
          }
          required
        />
      </label>
      <label>
        Valor
        <input
          name="valor"
          type="number"
          step="0.01"
          value={formulario.valor}
          onChange={(e) =>
            setFormulario({ ...formulario, valor: e.target.value })
          }
          required
        />
      </label>
      <button>Transferir</button>
    </form>
  );
}
