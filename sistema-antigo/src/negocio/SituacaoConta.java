package negocio;

/**
 * Situacao de uma conta corrente. Conceito explicito do dominio
 * bancario, no feminino como se fala da conta ("conta ativa").
 */
public enum SituacaoConta {

	ATIVA("Ativa"),

	INATIVA("Inativa");

	private final String descricao;

	SituacaoConta(String descricao) {
		this.descricao = descricao;
	}

	public String getDescricao() {
		return descricao;
	}

}
