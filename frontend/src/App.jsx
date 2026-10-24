import { useState } from "react";
import { ThemeToggle } from "./components/ThemeToggle.jsx";
import Clientes from "./features/clientes/Clientes.jsx";
import Contas from "./features/contas/Contas.jsx";
import VisaoGeral from "./features/visao/VisaoGeral.jsx";
import "./styles/app.css";

const secoes = [
  ["visao", "⌂", "Visão geral"],
  ["contas", "▣", "Contas"],
  ["clientes", "♙", "Clientes"],
  ["transferir", "↗", "Transferir"],
];

export default function App() {
  const [secao, setSecao] = useState("visao");
  const titulo = secoes.find(([id]) => id === secao)?.[2] || "Visão geral";
  function navegar(id) { setSecao(id); }
  function item([id, icone, label]) {
    const props = { className: "nav-item", key: id, "aria-current": secao === id ? "page" : undefined };
    if (id === "transferir") return <a {...props} href="#transferir" onClick={(event) => { event.preventDefault(); navegar(id); }}><span aria-hidden="true">{icone}</span>{label}</a>;
    return <button {...props} onClick={() => navegar(id)}><span aria-hidden="true">{icone}</span>{label}</button>;
  }
  return <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <div className="app-shell">
      <aside className="sidebar"><a className="brand" href="#conteudo"><span className="brand-mark">₿</span><span>Sistema Bancário</span></a><nav className="nav-list" aria-label="Navegação principal">{secoes.map(item)}</nav></aside>
      <div className="content"><header className="topbar"><h1>Sistema Bancário <span className="muted">/ {titulo}</span></h1><div className="topbar-actions"><ThemeToggle /></div></header><main id="conteudo">{secao === "visao" && <VisaoGeral onNavigate={navegar} />}{secao === "clientes" && <Clientes />}{secao === "contas" && <Contas />}{secao === "transferir" && <Contas moderno />}</main></div>
    </div>
  </>;
}
