package negocio;

import java.util.List;

/**
 * Implementacao unica das operacoes de CRUD sobre uma lista de
 * entidades bancarias. Antes desta classe, GerenciadoraClientes e
 * GerenciadoraContas repetiam o mesmo codigo de busca/insercao/remocao
 * (violacao do principio DRY). Padrao Template Method (Refactoring
 * Guru): o comportamento comum fica aqui; cada subclasse acrescenta
 * apenas o que lhe e especifico (ex.: transfereValor em ContaCorrente).
 */
public abstract class RepositorioBase<T extends EntidadeBancaria> implements Repositorio<T> {

	private final List<T> itens;

	protected RepositorioBase(List<T> itens) {
		this.itens = itens;
	}

	@Override
	public List<T> listarTodos() {
		return itens;
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
	public void adiciona(T item) {
		itens.add(item);
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
