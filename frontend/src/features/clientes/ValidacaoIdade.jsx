import { useState } from "react";
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
      <label>
        Idade para validar
        <input
          type="number"
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
          required
        />
      </label>
      <button>Validar idade</button>
    </form>
  );
}
