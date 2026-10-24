import { useState } from "react";
import { Button } from "../../components/Button.jsx";

const inicial = {
  id: "",
  nome: "",
  idade: "",
  email: "",
  idContaCorrente: "",
  ativo: true,
};

export default function CadastroCliente({ onCadastrar }) {
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
      idade: Number(formulario.idade),
      idContaCorrente: Number(formulario.idContaCorrente),
    });
    setFormulario(inicial);
  }

  return (
    <form onSubmit={enviar}>
      <h3>Cadastrar cliente</h3>
      <label>
        ID
        <input
          name="id"
          type="number"
          value={formulario.id}
          onChange={alterar}
          required
        />
      </label>
      <label>
        Nome
        <input
          name="nome"
          value={formulario.nome}
          onChange={alterar}
          required
        />
      </label>
      <label>
        Idade
        <input
          name="idade"
          type="number"
          value={formulario.idade}
          onChange={alterar}
          required
        />
      </label>
      <label>
        E-mail
        <input
          name="email"
          value={formulario.email}
          onChange={alterar}
          required
        />
      </label>
      <label>
        ID da conta corrente
        <input
          name="idContaCorrente"
          type="number"
          value={formulario.idContaCorrente}
          onChange={alterar}
          required
        />
      </label>
      <label>
        Ativo
        <input
          name="ativo"
          type="checkbox"
          checked={formulario.ativo}
          onChange={alterar}
        />
      </label>
      <Button type="submit">Cadastrar cliente</Button>
    </form>
  );
}
