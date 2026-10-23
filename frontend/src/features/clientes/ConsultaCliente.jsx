import { useState } from "react";
export default function ConsultaCliente({ onConsultar }) {
  const [id, setId] = useState("");
  function enviar(e) {
    e.preventDefault();
    onConsultar(id);
  }
  return (
    <form onSubmit={enviar}>
      <h3>Consultar cliente</h3>
      <label>
        ID do cliente
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </label>
      <button>Consultar cliente</button>
    </form>
  );
}
