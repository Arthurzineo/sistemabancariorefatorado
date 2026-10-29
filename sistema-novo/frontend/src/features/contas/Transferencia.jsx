import { useState } from "react";
import { Button } from "../../components/Button.jsx";
import { Field } from "../../components/Field.jsx";
import { Select } from "../../components/Select.jsx";
import { formatarMoeda } from "../../lib/formato.js";

const inicial = { origem: "", destino: "", valor: "" };

export default function Transferencia({ onTransferir, contas = [] }) {
  const [formulario, setFormulario] = useState(inicial);
  const [etapa, setEtapa] = useState("formulario");
  const [erro, setErro] = useState("");
  const [recibo, setRecibo] = useState(null);
  const origem = contas.find((conta) => conta.id === Number(formulario.origem));
  const destino = contas.find(
    (conta) => conta.id === Number(formulario.destino),
  );

  function alterar(event) {
    setFormulario({ ...formulario, [event.target.name]: event.target.value });
  }
  function revisar(event) {
    event.preventDefault();
    if (!formulario.origem || !formulario.destino) {
      setErro("Selecione as contas.");
      return;
    }
    if (formulario.origem === formulario.destino) {
      setErro("A conta de origem e destino devem ser diferentes.");
      return;
    }
    if (Number(formulario.valor) <= 0) {
      setErro("Informe um valor maior que zero.");
      return;
    }
    if (origem && Number(formulario.valor) > Number(origem.saldo)) {
      setErro("O saldo da conta de origem é insuficiente.");
      return;
    }
    setErro("");
    setEtapa("revisao");
  }
  async function confirmar() {
    try {
      const resultado = await onTransferir({
        origem: Number(formulario.origem),
        destino: Number(formulario.destino),
        valor: Number(formulario.valor),
      });
      setRecibo(resultado || { origem, destino });
      setEtapa("recibo");
    } catch (error) {
      setErro(error.message);
    }
  }
  if (etapa === "revisao")
    return (
      <section className="card transfer-step">
        <p className="eyebrow">Passo 2 de 3</p>
        <h3>Revise sua transferência</h3>
        <dl>
          <dt>De</dt>
          <dd>Conta {formulario.origem}</dd>
          <dt>Para</dt>
          <dd>Conta {formulario.destino}</dd>
          <dt>Valor</dt>
          <dd>{formatarMoeda(formulario.valor)}</dd>
          <dt>Saldo da origem depois</dt>
          <dd>
            {formatarMoeda(
              Number(origem?.saldo || 0) - Number(formulario.valor),
            )}
          </dd>
        </dl>
        {erro && <p role="alert">{erro}</p>}
        <div className="dialog__actions">
          <Button variant="ghost" onClick={() => setEtapa("formulario")}>
            Voltar
          </Button>
          <Button onClick={confirmar}>Confirmar transferência</Button>
        </div>
      </section>
    );
  if (etapa === "recibo")
    return (
      <section className="card transfer-step">
        <p className="eyebrow">Passo 3 de 3</p>
        <h3>Transferência concluída</h3>
        <p role="status">
          Seu recibo foi registrado em {new Date().toLocaleString("pt-BR")}.
        </p>
        <p>
          Saldo da origem:{" "}
          <strong>{formatarMoeda(recibo?.origem?.saldo)}</strong>
        </p>
        <p>
          Saldo do destino:{" "}
          <strong>{formatarMoeda(recibo?.destino?.saldo)}</strong>
        </p>
        <Button
          onClick={() => {
            setFormulario(inicial);
            setRecibo(null);
            setEtapa("formulario");
          }}
        >
          Nova transferência
        </Button>
      </section>
    );
  return (
    <form onSubmit={revisar} className="transfer-step">
      <p className="eyebrow">Passo 1 de 3</p>
      <h3>Para quem você quer transferir?</h3>
      <Select
        label="Conta de origem"
        name="origem"
        value={formulario.origem}
        onChange={alterar}
        options={contas.map((conta) => ({
          value: conta.id,
          label: `Conta ${conta.id} · ${formatarMoeda(conta.saldo)}`,
        }))}
        required
      />
      <Select
        label="Conta de destino"
        name="destino"
        value={formulario.destino}
        onChange={alterar}
        options={contas.map((conta) => ({
          value: conta.id,
          label: `Conta ${conta.id} · ${formatarMoeda(conta.saldo)}`,
        }))}
        required
      />
      <Field
        label="Valor"
        name="valor"
        type="number"
        min="0.01"
        step="0.01"
        prefix="R$"
        value={formulario.valor}
        onChange={alterar}
        required
      />
      {erro && <p role="alert">{erro}</p>}
      <Button type="submit">Revisar antes de transferir</Button>
    </form>
  );
}
