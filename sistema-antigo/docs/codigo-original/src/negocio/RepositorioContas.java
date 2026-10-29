package negocio;

/**
 * Especializacao de Repositorio para contas correntes, acrescentando
 * a operacao de transferencia de valor que nao faz sentido para
 * outras entidades bancarias.
 */
public interface RepositorioContas extends Repositorio<ContaCorrente> {

	boolean transfereValor(int idContaOrigem, double valor, int idContaDestino);

}
