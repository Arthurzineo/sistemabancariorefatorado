package negocio;

/**
 * Classe {@link Cliente} que representa um cliente real do banco.
 *
 * A validacao de idade acontece no proprio construtor: um Cliente
 * nunca existe em estado invalido (fail fast). Antes, essa regra
 * vivia isolada em GerenciadoraClientes.validaIdade() e nunca era
 * chamada por ninguem - um sintoma tipico de logica de negocio
 * desacoplada da entidade que ela deveria proteger.
 */
public class Cliente implements EntidadeBancaria {

	public static final int IDADE_MINIMA = 18;

	public static final int IDADE_MAXIMA = 65;

	private final int id;

	private String nome;

	private int idade;

	private String email;

	private SituacaoCliente situacao;

	private int idContaCorrente;

	public Cliente(int id, String nome, int idade, String email, int idContaCorrente, boolean ativo)
			throws IdadeNaoPermitidaException {

		validarIdade(idade);

		this.id = id;
		this.nome = nome;
		this.idade = idade;
		this.email = email;
		this.idContaCorrente = idContaCorrente;
		this.situacao = ativo ? SituacaoCliente.ATIVO : SituacaoCliente.INATIVO;
	}

	/**
	 * Regra de negocio "Validar idade do cliente": a idade deve estar
	 * entre IDADE_MINIMA e IDADE_MAXIMA (inclusive). Usada tanto na
	 * criacao quanto na alteracao da idade, para que o Cliente nunca
	 * fique em estado invalido.
	 */
	private static void validarIdade(int idade) throws IdadeNaoPermitidaException {
		if (!idadePermitida(idade))
			throw new IdadeNaoPermitidaException(IdadeNaoPermitidaException.MSG_IDADE_INVALIDA);
	}

	/**
	 * Consulta a regra de idade sem criar um Cliente (usada pela opcao
	 * "Validar idade do cliente" do menu).
	 *
	 * @return true se a idade esta entre IDADE_MINIMA e IDADE_MAXIMA
	 */
	public static boolean idadePermitida(int idade) {
		return idade >= IDADE_MINIMA && idade <= IDADE_MAXIMA;
	}

	public int getId() {
		return id;
	}

	public String getNome() {
		return nome;
	}

	public void setNome(String nome) {
		this.nome = nome;
	}

	public int getIdade() {
		return idade;
	}

	public void setIdade(int idade) throws IdadeNaoPermitidaException {
		validarIdade(idade);

		this.idade = idade;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public SituacaoCliente getSituacao() {
		return situacao;
	}

	public void ativar() {
		this.situacao = SituacaoCliente.ATIVO;
	}

	public void desativar() {
		this.situacao = SituacaoCliente.INATIVO;
	}

	public boolean estaAtivo() {
		return situacao == SituacaoCliente.ATIVO;
	}

	@Override
	public boolean isAtivo() {
		return estaAtivo();
	}

	/**
	 * Mantido por compatibilidade com o codigo existente
	 * (TesteUnitarioManual). Prefira ativar() e desativar().
	 */
	public void setAtivo(boolean ativo) {
		if (ativo)
			ativar();
		else
			desativar();
	}

	public int getIdContaCorrente() {
		return this.idContaCorrente;
	}

	public void setIdContaCorrente(int idContaCorrente) {
		this.idContaCorrente = idContaCorrente;
	}

	@Override
	public String toString() {

		String str = "=========================\n"
					+ "Id: " + this.id + "\n"
					+ "Nome: " + this.nome + "\n"
					+ "Email: " + this.email + "\n"
					+ "Idade: " + this.idade + "\n"
					+ "Status: " + situacao.getDescricao() + "\n"
					+ "=========================";
		return str;
	}

}
