import { useEffect, useState } from "react";

function temaInicial() {
  try {
    return localStorage.getItem("tema") || "light";
  } catch {
    return "light";
  }
}

export function ThemeToggle() {
  const [tema, setTema] = useState(temaInicial);

  useEffect(() => {
    const armazenado = temaInicial();
    if (armazenado !== tema) {
      setTema(armazenado);
      return;
    }
    document.documentElement.dataset.theme = tema;
  }, [tema]);

  function alternar() {
    const proximo = tema === "dark" ? "light" : "dark";
    setTema(proximo);
    document.documentElement.dataset.theme = proximo;
    try {
      localStorage.setItem("tema", proximo);
    } catch {
      // armazenamento indisponível não impede a alternância nesta sessão
    }
  }

  return (
    <button
      className="icon-button"
      type="button"
      onClick={alternar}
      aria-label="Alternar tema"
    >
      {tema === "dark" ? "☀" : "☾"}
    </button>
  );
}
