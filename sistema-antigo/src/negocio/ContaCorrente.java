package negocio;

/**
 * Classe {@link ContaCorrente} que representa uma conta corrente real
 * e que podera ser associada a um cliente.
 *
 * Invariante: o saldo e sempre um numero finito (nunca Infinity ou
 * NaN). Isso vale na criacao, no setSaldo e apos uma transferencia.
 */
public class ContaCorrente implements EntidadeBancaria {

	private final int id;

	private double saldo;

	private SituacaoConta situacao;

	public ContaCorrente(int id, double saldo, boolean ativo) {
		validarSaldo(saldo);

		this.id = id;
		this.saldo = saldo;
		this.situacao = ativo ? SituacaoConta.ATIVA : SituacaoConta.INATIVA;
	}

	public int getId() {
		return id;
	}

	public double getSaldo() {
		return saldo;
	}

	public void setSaldo(double saldo) {
		validarSaldo(saldo);

		this.saldo = saldo;
	}

	private static void validarSaldo(double saldo) {
		if (!Double.isFinite(saldo))
			throw new IllegalArgumentException("O saldo precisa ser um numero finito: " + saldo);
	}

	public SituacaoConta getSituacao() {
		return situacao;
	}

	public void ativar() {
		this.situacao = SituacaoConta.ATIVA;
	}

	public void desativar() {
		this.situacao = SituacaoConta.INATIVA;
	}

	public boolean estaAtiva() {
		return situacao == SituacaoConta.ATIVA;
	}

	@Override
	public boolean isAtivo() {
		return estaAtiva();
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

	/**
	 * Transfere um valor desta conta (origem) para a conta destino:
	 * debita a origem e credita o destino. Todas as condicoes sao
	 * verificadas ANTES de qualquer alteracao; se alguma falhar, a
	 * operacao e rejeitada e nenhum saldo e alterado.
	 *
	 * @return true se a transferencia foi realizada
	 */
	public boolean transferir(ContaCorrente destino, double valor) {
		if (!transferenciaPermitida(destino, valor))
			return false;

		this.debitar(valor);
		destino.creditar(valor);
		return true;
	}

	private boolean transferenciaPermitida(ContaCorrente destino, double valor) {
		return destino != null
				&& valorPositivo(valor)
				&& possuiSaldoSuficiente(valor)
				&& destino.podeReceberCredito(valor);
	}

	private static boolean valorPositivo(double valor) {
		return valor > 0;
	}

	/**
	 * O saldo e um double: um credito que resultasse em saldo infinito
	 * (overflow) deixaria a conta inconsistente, por isso e recusado.
	 */
	private boolean podeReceberCredito(double valor) {
		return Double.isFinite(saldo + valor);
	}

	public boolean possuiSaldoSuficiente(double valor) {
		return saldo >= valor;
	}

	private void debitar(double valor) {
		saldo -= valor;
	}

	private void creditar(double valor) {
		saldo += valor;
	}

	@Override
	public String toString() {

		String str = "=========================\n"
					+ "Id: " + this.id + "\n"
					+ "Saldo: " + this.saldo + "\n"
					+ "Status: " + situacao.getDescricao() + "\n"
					+ "=========================";
		return str;
	}

}
