package negocio;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Implementacao unica das operacoes de CRUD sobre uma lista de
 * entidades bancarias. Antes desta classe, GerenciadoraClientes e
 * GerenciadoraContas repetiam o mesmo codigo de busca/insercao/remocao
 * (violacao do principio DRY). Padrao Template Method (Refactoring
 * Guru): o comportamento comum fica aqui; cada subclasse acrescenta
 * apenas o que lhe e especifico (ex.: transfereValor em ContaCorrente).
 *
 * O repositorio e o dono da colecao, por isso e ele que garante a
 * regra "nao existem duas entidades com o mesmo id": a lista recebida
 * e copiada, a lista devolvida e somente leitura e toda insercao
 * passa pela verificacao de duplicidade.
 */
public abstract class RepositorioBase<T extends EntidadeBancaria> implements Repositorio<T> {

	private final List<T> itens;

	protected RepositorioBase(List<T> itensIniciais) {
		this.itens = new ArrayList<>();
		for (T item : itensIniciais) {
			if (!adicionaSeNovo(item))
				throw new IllegalArgumentException("Id duplicado na carga inicial: " + item.getId());
		}
	}

	@Override
	public List<T> listarTodos() {
		return Collections.unmodifiableList(itens);
	}

	@Override
	public T pesquisa(int id) {
		for (T item : itens) {
			if (item.getId() == id)
				return item;
		}
		return null;
	}

	@Override
	public boolean existe(int id) {
		return pesquisa(id) != null;
	}

	/**
	 * @return true se adicionou; false se ja existia item com o mesmo id
	 */
	@Override
	public boolean adiciona(T item) {
		return adicionaSeNovo(item);
	}

	private boolean adicionaSeNovo(T item) {
		if (existe(item.getId()))
			return false;

		itens.add(item);
		return true;
	}

	@Override
	public boolean remove(int id) {
		for (int i = 0; i < itens.size(); i++) {
			if (itens.get(i).getId() == id) {
				itens.remove(i);
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean estaAtivo(int id) {
		T item = pesquisa(id);
		return item != null && item.isAtivo();
	}

	@Override
	public void limpa() {
		itens.clear();
	}

}
