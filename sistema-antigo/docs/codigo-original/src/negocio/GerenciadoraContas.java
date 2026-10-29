package negocio;

import java.util.List;

/**
 * Repositorio de contas correntes do banco. Reaproveita a logica de
 * CRUD de RepositorioBase e acrescenta apenas a operacao especifica
 * de transferencia de valor entre contas.
 */
public class GerenciadoraContas extends RepositorioBase<ContaCorrente> implements RepositorioContas {

	public GerenciadoraContas(List<ContaCorrente> contasDoBanco) {
		super(contasDoBanco);
	}

	/**
	 * Transfere um valor da conta origem para a conta destino.
	 * So realiza a transferencia se ambas as contas existirem e a
	 * conta origem tiver saldo suficiente.
	 */
	@Override
	public boolean transfereValor(int idContaOrigem, double valor, int idContaDestino) {

		ContaCorrente contaOrigem = pesquisa(idContaOrigem);
		ContaCorrente contaDestino = pesquisa(idContaDestino);

		if (contaOrigem == null || contaDestino == null)
			return false;

		if (contaOrigem.getSaldo() < valor)
			return false;

		contaOrigem.setSaldo(contaOrigem.getSaldo() - valor);
		contaDestino.setSaldo(contaDestino.getSaldo() + valor);

		return true;
	}

}
