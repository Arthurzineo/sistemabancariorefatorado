package negocio;

/**
 * Classe que representa o sistema bancario como um todo, orquestrando
 * as operacoes disponiveis sobre clientes e contas correntes.
 *
 * Os repositorios sao recebidos via construtor (injecao de
 * dependencia) e referenciados pelas interfaces Repositorio/
 * RepositorioContas, nao pelas classes concretas. Isso permite montar
 * um SistemaBancario com qualquer fonte de dados - inclusive, no
 * futuro, com dublês de teste - sem alterar esta classe.
 */
public class SistemaBancario {

	private final Repositorio<Cliente> gerClientes;

	private final RepositorioContas gerContas;

	public SistemaBancario(Repositorio<Cliente> gerClientes, RepositorioContas gerContas) {
		this.gerClientes = gerClientes;
		this.gerContas = gerContas;
	}

	public Cliente consultarCliente(int idCliente) {
		return gerClientes.pesquisa(idCliente);
	}

	public ContaCorrente consultarConta(int idConta) {
		return gerContas.pesquisa(idConta);
	}

	public boolean ativarCliente(int idCliente) {
		Cliente cliente = gerClientes.pesquisa(idCliente);

		if (cliente == null)
			return false;

		cliente.setAtivo(true);
		return true;
	}

	public boolean desativarCliente(int idCliente) {
		Cliente cliente = gerClientes.pesquisa(idCliente);

		if (cliente == null)
			return false;

		cliente.setAtivo(false);
		return true;
	}

}
