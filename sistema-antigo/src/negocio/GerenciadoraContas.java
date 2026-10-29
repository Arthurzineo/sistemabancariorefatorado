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
	 * O repositorio apenas localiza as contas; as regras da
	 * transferencia (valor positivo, saldo suficiente, debito e
	 * credito) pertencem a ContaCorrente.transferir().
	 */
	@Override
	public boolean transfereValor(int idContaOrigem, double valor, int idContaDestino) {

		ContaCorrente contaOrigem = pesquisa(idContaOrigem);
		ContaCorrente contaDestino = pesquisa(idContaDestino);

		if (contaOrigem == null || contaDestino == null)
			return false;

		return contaOrigem.transferir(contaDestino, valor);
	}

}
