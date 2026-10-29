import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Field } from "../../components/Field.jsx";
export default function ValidacaoIdade({ onValidar }) {
  const [idade, setIdade] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onValidar(idade);
      }}
    >
      <h3>Validar idade</h3>
      <Field
        label="Idade para validar"
        name="idade-validacao"
        type="number"
        value={idade}
        onChange={(e) => setIdade(e.target.value)}
        required
      />
      <Button>Validar idade</Button>
    </form>
  );
}
