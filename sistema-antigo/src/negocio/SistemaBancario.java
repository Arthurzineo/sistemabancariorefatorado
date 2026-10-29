package negocio;

import java.util.Optional;

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

	/**
	 * Cadastra um novo cliente. O id identifica o cliente, portanto
	 * nao e permitido cadastrar dois clientes com o mesmo id (regra
	 * garantida pelo repositorio). A idade ja foi validada na criacao
	 * do proprio Cliente.
	 *
	 * @return true se cadastrou; false se ja existia cliente com o id
	 */
	public boolean cadastrarCliente(Cliente cliente) {
		return gerClientes.adiciona(cliente);
	}

	/**
	 * Cadastra uma nova conta corrente. O id e o numero da conta,
	 * portanto nao e permitido cadastrar duas contas com o mesmo id
	 * (regra garantida pelo repositorio).
	 *
	 * @return true se cadastrou; false se ja existia conta com o id
	 */
	public boolean cadastrarConta(ContaCorrente conta) {
		return gerContas.adiciona(conta);
	}

	public boolean ativarCliente(int idCliente) {
		Cliente cliente = gerClientes.pesquisa(idCliente);

		if (cliente == null)
			return false;

		cliente.ativar();
		return true;
	}

	public boolean desativarCliente(int idCliente) {
		Cliente cliente = gerClientes.pesquisa(idCliente);

		if (cliente == null)
			return false;

		cliente.desativar();
		return true;
	}

	/**
	 * Transfere um valor entre duas contas cadastradas. A coordenacao
	 * (localizar as contas) fica no repositorio; as regras (valor
	 * positivo, saldo suficiente, debito e credito) ficam em
	 * ContaCorrente.transferir().
	 *
	 * @return true se a transferencia foi realizada
	 */
	public boolean transferir(int idContaOrigem, int idContaDestino, double valor) {
		return gerContas.transfereValor(idContaOrigem, valor, idContaDestino);
	}

	/**
	 * Verifica a situacao do cliente. Optional vazio indica cliente
	 * inexistente, que e diferente de um cliente INATIVO.
	 */
	public Optional<SituacaoCliente> verificarSituacaoCliente(int idCliente) {
		return Optional.ofNullable(gerClientes.pesquisa(idCliente))
				.map(Cliente::getSituacao);
	}

	/**
	 * Verifica a situacao da conta. Optional vazio indica conta
	 * inexistente, que e diferente de uma conta INATIVA.
	 */
	public Optional<SituacaoConta> verificarSituacaoConta(int idConta) {
		return Optional.ofNullable(gerContas.pesquisa(idConta))
				.map(ContaCorrente::getSituacao);
	}

	/**
	 * Remove o cliente do banco. Remover e uma operacao sobre a colecao
	 * de clientes, por isso e delegada ao repositorio. Nao ha regra no
	 * projeto que restrinja a remocao.
	 *
	 * @return true se removeu; false se o cliente nao existia
	 */
	public boolean removerCliente(int idCliente) {
		return gerClientes.remove(idCliente);
	}

	/**
	 * Remove a conta corrente do banco, delegando ao repositorio de
	 * contas. Nao ha regra no projeto que restrinja a remocao.
	 *
	 * @return true se removeu; false se a conta nao existia
	 */
	public boolean removerConta(int idConta) {
		return gerContas.remove(idConta);
	}

}
