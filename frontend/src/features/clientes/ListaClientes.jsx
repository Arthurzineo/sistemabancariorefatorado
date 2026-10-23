export default function ListaClientes({ clientes, renderAcoes }) {
  return (
    <section>
      <h3>Lista de clientes</h3>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            <strong>{cliente.nome}</strong> — {cliente.situacao}{" "}
            {renderAcoes(cliente)}
          </li>
        ))}
      </ul>
    </section>
  );
}
