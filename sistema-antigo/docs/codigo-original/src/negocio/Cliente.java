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

	private int id;

	private String nome;

	private int idade;

	private String email;

	private boolean ativo;

	private int idContaCorrente;

	public Cliente(int id, String nome, int idade, String email, int idContaCorrente, boolean ativo)
			throws IdadeNaoPermitidaException {

		if (idade < IDADE_MINIMA || idade > IDADE_MAXIMA)
			throw new IdadeNaoPermitidaException(IdadeNaoPermitidaException.MSG_IDADE_INVALIDA);

		this.id = id;
		this.nome = nome;
		this.idade = idade;
		this.email = email;
		this.idContaCorrente = idContaCorrente;
		this.ativo = ativo;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
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

	public void setIdade(int idade) {
		this.idade = idade;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Override
	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
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
					+ "Status: " + (ativo ? "Ativo" : "Inativo") + "\n"
					+ "=========================";
		return str;
	}

}
