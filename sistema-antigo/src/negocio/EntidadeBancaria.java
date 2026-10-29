package negocio;

/**
 * Contrato comum as entidades do dominio bancario que podem ser
 * identificadas por um id e possuem um status ativo/inativo.
 * Permite que Cliente e ContaCorrente sejam manipulados de forma
 * generica pelo Repositorio, eliminando duplicacao de codigo.
 */
public interface EntidadeBancaria {

	int getId();

	boolean isAtivo();

}
