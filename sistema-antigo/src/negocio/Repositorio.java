package negocio;

import java.util.List;

/**
 * Abstracao para acesso a uma colecao de entidades bancarias.
 * Depender desta interface (e nao de uma classe concreta) permite
 * substituir a implementacao por um dublê de teste (test double)
 * em testes automatizados futuros, sem alterar quem a utiliza.
 */
public interface Repositorio<T extends EntidadeBancaria> {

	List<T> listarTodos();

	T pesquisa(int id);

	boolean existe(int id);

	boolean adiciona(T item);

	boolean remove(int id);

	/**
	 * Limitacao conhecida (mantida por compatibilidade): devolve false
	 * tanto para entidade INATIVA quanto para entidade INEXISTENTE.
	 * Para distinguir os dois casos use
	 * SistemaBancario.verificarSituacaoCliente/verificarSituacaoConta.
	 */
	boolean estaAtivo(int id);

	void limpa();

}
