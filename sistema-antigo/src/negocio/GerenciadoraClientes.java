package negocio;

import java.util.List;

/**
 * Repositorio de clientes do banco. Toda a logica de busca, insercao,
 * remocao e verificacao de status ja esta implementada em
 * RepositorioBase; esta classe existe apenas para dar um nome de
 * dominio explicito ao repositorio de Cliente.
 */
public class GerenciadoraClientes extends RepositorioBase<Cliente> {

	public GerenciadoraClientes(List<Cliente> clientesDoBanco) {
		super(clientesDoBanco);
	}

}
