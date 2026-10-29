package negocio;

/**
 * Situacao de um cliente no banco. E um conceito explicito do dominio
 * bancario, em vez de um boolean generico ("ativo = true/false").
 */
public enum SituacaoCliente {

	ATIVO("Ativo"),

	INATIVO("Inativo");

	private final String descricao;

	SituacaoCliente(String descricao) {
		this.descricao = descricao;
	}

	public String getDescricao() {
		return descricao;
	}

}
