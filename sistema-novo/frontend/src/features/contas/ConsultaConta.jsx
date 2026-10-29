import { useState } from "react";
export default function ConsultaConta({ onConsultar }) {
  const [id, setId] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onConsultar(id);
      }}
    >
      <h3>Consultar conta</h3>
      <label>
        ID para consulta
        <input
          type="number"
          value={id}
          onChange={(e) => setId(e.target.value)}
          required
        />
      </label>
      <button>Consultar conta</button>
    </form>
  );
}
