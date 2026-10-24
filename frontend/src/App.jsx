import { useState } from "react";
import { Icon } from "./components/Icon.jsx";
import { Button } from "./components/Button.jsx";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import Clientes from "./features/clientes/Clientes.jsx";
import Contas from "./features/contas/Contas.jsx";
import TransferenciaPage from "./features/contas/TransferenciaPage.jsx";
import VisaoGeral from "./features/visao/VisaoGeral.jsx";
import "./styles/app.css";

const secoes = [
  ["visao", "home", "Visão geral"],
  ["contas", "card", "Contas"],
  ["clientes", "users", "Clientes"],
  ["transferir", "transfer", "Transferir"],
];

export default function App() {
  const [secao, setSecao] = useState("visao");
  const titulo = secoes.find(([id]) => id === secao)?.[2] || "Visão geral";
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <div className="app-shell">
        <aside className="sidebar">
          <a className="brand" href="#conteudo">
            <span className="brand-mark">₿</span>
            <span>Sistema Bancário</span>
          </a>
          <nav className="nav-list" aria-label="Navegação principal">
            {secoes.map(([id, icon, label]) => (
              <Button
                key={id}
                variant="ghost"
                className="nav-item"
                aria-current={secao === id ? "page" : undefined}
                onClick={() => setSecao(id)}
              >
                <Icon name={icon} />
                <span>{label}</span>
              </Button>
            ))}
          </nav>
        </aside>
        <div className="content">
          <header className="topbar">
            <h1>
              Sistema Bancário <span className="muted">/ {titulo}</span>
            </h1>
            <ThemeToggle />
          </header>
          <main id="conteudo">
            {secao === "visao" && <VisaoGeral onNavigate={setSecao} />}
            {secao === "clientes" && <Clientes />}
            {secao === "contas" && <Contas />}
            {secao === "transferir" && <TransferenciaPage />}
          </main>
        </div>
      </div>
    </>
  );
}
