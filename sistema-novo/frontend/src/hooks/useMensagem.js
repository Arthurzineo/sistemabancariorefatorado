import { useState } from "react";

export function useMensagem() {
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState(false);

  function avisar(texto, falhou = false) {
    setMensagem(texto);
    setErro(falhou);
  }

  return { mensagem, erro, avisar };
}
