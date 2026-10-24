import { useState } from "react";
import { Button } from "../../components/Button.jsx";
const inicial = { id: "", saldo: "", ativo: true };
export default function CadastroConta({ onCadastrar }) {
  const [formulario, setFormulario] = useState(inicial);
  function alterar(evento) {
    const { name, value, checked, type } = evento.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  }
  async function enviar(evento) {
    evento.preventDefault();
    await onCadastrar({
      ...formulario,
      id: Number(formulario.id),
      saldo: Number(formulario.saldo),
    });
    setFormulario(inicial);
  }
  return (
    <form onSubmit={enviar}>
      <h3>Cadastrar conta</h3>
      <label>
        ID
        <input
          name="id"
          aria-label="ID da conta"
          type="number"
          value={formulario.id}
          onChange={alterar}
          required
        />
      </label>
      <label>
        Saldo
        <input
          name="saldo"
          type="number"
          step="0.01"
          value={formulario.saldo}
          onChange={alterar}
          required
        />
      </label>
      <label>
        Ativa
        <input
          name="ativo"
          type="checkbox"
          checked={formulario.ativo}
          onChange={alterar}
        />
      </label>
      <Button type="submit">Cadastrar conta</Button>
    </form>
  );
}
