import { StatusChip } from "../../components/StatusChip.jsx";

export default function ListaClientes({ clientes, renderAcoes }) {
  return (
    <section>
      <h3>Lista de clientes</h3>
      <div className="table-wrap">
      <table>
        <thead><tr><th>Nome</th><th>E-mail</th><th>Idade</th><th>Situação</th><th>Ações</th></tr></thead>
        <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id}><td><strong>{cliente.nome}</strong><br /><small>Conta {cliente.idContaCorrente || "—"}</small></td><td>{cliente.email || "—"}</td><td>{cliente.idade || "—"}</td><td><StatusChip situacao={cliente.situacao} /></td><td>{renderAcoes(cliente)}</td></tr>
        ))}
        </tbody>
      </table>
      </div>
    </section>
  );
}
