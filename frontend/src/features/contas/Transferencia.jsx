import { useState } from "react";
import { formatarMoeda } from "../../lib/formato.js";

const inicial = { origem: "", destino: "", valor: "" };

export default function Transferencia({ onTransferir, contas = [], moderno = false }) {
  const [formulario, setFormulario] = useState(inicial);
  const [etapa, setEtapa] = useState("formulario");
  const [erro, setErro] = useState("");
  const [recibo, setRecibo] = useState(null);
  const origem = contas.find((conta) => conta.id === Number(formulario.origem));
  const destino = contas.find((conta) => conta.id === Number(formulario.destino));
  const alterar = (event) => setFormulario({ ...formulario, [event.target.name]: event.target.value });

  function revisar(event) {
    event.preventDefault();
    setErro("");
    if (Number(formulario.valor) <= 0) { setErro("Informe um valor maior que zero."); return; }
    if (formulario.origem === formulario.destino) { setErro("A conta de origem e destino devem ser diferentes."); return; }
    if (origem && Number(formulario.valor) > Number(origem.saldo)) { setErro("O saldo da conta de origem é insuficiente."); return; }
    setEtapa("revisao");
  }

  async function confirmar() {
    setErro("");
    try {
      const resultado = await onTransferir({ origem: Number(formulario.origem), destino: Number(formulario.destino), valor: Number(formulario.valor) });
      setRecibo(resultado || { origem, destino });
      setEtapa("recibo");
    } catch (error) { setErro(error.message); }
  }

  async function enviarLegado(event) {
    event.preventDefault();
    try { await onTransferir({ origem: Number(formulario.origem), destino: Number(formulario.destino), valor: Number(formulario.valor) }); } catch (error) { if (moderno) setErro(error.message); }
  }

  if (etapa === "revisao") return <section className="card" aria-labelledby="titulo-revisao"><h3 id="titulo-revisao">Revisar transferência</h3><p>De <strong>Conta {formulario.origem}</strong> para <strong>Conta {formulario.destino}</strong></p><p>Valor: <strong>{formatarMoeda(formulario.valor)}</strong></p><p>Saldo da origem depois: <strong>{formatarMoeda(Number(origem?.saldo || 0) - Number(formulario.valor))}</strong></p>{erro && <p role="alert">{erro}</p>}<div className="dialog__actions"><button className="button button--ghost" onClick={() => setEtapa("formulario")}>Voltar</button><button className="button button--primary" onClick={confirmar}>Confirmar transferência</button></div></section>;
  if (etapa === "recibo") return <section className="card" aria-labelledby="titulo-recibo"><h3 id="titulo-recibo">Transferência concluída</h3><p role="status">Seu recibo foi registrado agora.</p>{recibo?.origem && <p>Saldo da origem: <strong>{formatarMoeda(recibo.origem.saldo)}</strong></p>}<button className="button button--primary" onClick={() => { setFormulario(inicial); setRecibo(null); setEtapa("formulario"); }}>Nova transferência</button></section>;
  const opcoes = Array.from({ length: 20 }, (_, indice) => indice + 1);
  return <form onSubmit={enviarLegado} aria-labelledby="titulo-transferencia"><h3 id="titulo-transferencia">Transferir valores</h3><label>Conta de origem{moderno ? <select name="origem" value={formulario.origem} onChange={alterar} required><option value="">Selecione</option>{opcoes.map((id) => { const conta = contas.find((item) => item.id === id); return <option key={id} value={id}>Conta {id}{conta ? ` · ${formatarMoeda(conta.saldo)}` : ""}</option>; })}</select> : <input name="origem" type="number" value={formulario.origem} onChange={alterar} required />}</label><label>Conta de destino{moderno ? <select name="destino" value={formulario.destino} onChange={alterar} required><option value="">Selecione</option>{opcoes.map((id) => { const conta = contas.find((item) => item.id === id); return <option key={id} value={id}>Conta {id}{conta ? ` · ${formatarMoeda(conta.saldo)}` : ""}</option>; })}</select> : <input name="destino" type="number" value={formulario.destino} onChange={alterar} required />}</label><label>Valor<input name="valor" type="number" step="0.01" min="0.01" value={formulario.valor} onChange={alterar} required /></label>{erro && <p role="alert">{erro}</p>}<button type="submit" className="button button--primary">Transferir</button>{moderno && <button type="button" className="button button--ghost" onClick={revisar}>Revisar antes de transferir</button>}</form>;
}
