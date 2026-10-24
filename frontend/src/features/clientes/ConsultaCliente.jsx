import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Field } from "../../components/Field.jsx";
export default function ConsultaCliente({ onConsultar }) {
  const [id, setId] = useState("");
  function enviar(e) {
    e.preventDefault();
    onConsultar(id);
  }
  return (
    <form onSubmit={enviar}>
      <h3>Consultar cliente</h3>
      <Field
        label="ID do cliente"
        name="id-cliente"
        type="number"
        value={id}
        onChange={(e) => setId(e.target.value)}
        required
      />
      <Button>Consultar cliente</Button>
    </form>
  );
}
