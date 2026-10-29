package negocio;

/**
 * Classe {@link ContaCorrente} que representa uma conta corrente real
 * e que podera ser associada a um cliente.
 */
public class ContaCorrente implements EntidadeBancaria {

	private int id;

	private double saldo;

	private boolean ativo;

	public ContaCorrente(int id, double saldo, boolean ativo) {
		this.id = id;
		this.saldo = saldo;
		this.ativo = ativo;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public double getSaldo() {
		return saldo;
	}

	public void setSaldo(double saldo) {
		this.saldo = saldo;
	}

	@Override
	public boolean isAtivo() {
		return ativo;
	}

	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}

	@Override
	public String toString() {

		String str = "=========================\n"
					+ "Id: " + this.id + "\n"
					+ "Saldo: " + this.saldo + "\n"
					+ "Status: " + (ativo ? "Ativa" : "Inativa") + "\n"
					+ "=========================";
		return str;
	}

}
