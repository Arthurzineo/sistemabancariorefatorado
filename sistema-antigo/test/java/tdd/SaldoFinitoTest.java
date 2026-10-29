package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import org.junit.Test;

import negocio.ContaCorrente;

/**
 * TDD - Requisitos 9 e 12 (complemento apos a 2a auditoria): o saldo
 * de uma conta e sempre um numero finito. Com essa invariante, nenhuma
 * transferencia pode partir de (ou chegar a) um saldo infinito ou NaN.
 */
public class SaldoFinitoTest {

	@Test
	public void naoDeveCriarContaComSaldoInfinito() {
		assertThrows(IllegalArgumentException.class,
				() -> new ContaCorrente(1, Double.POSITIVE_INFINITY, true));
	}

	@Test
	public void naoDeveCriarContaComSaldoNaoNumerico() {
		assertThrows(IllegalArgumentException.class,
				() -> new ContaCorrente(1, Double.NaN, true));
	}

	@Test
	public void naoDevePermitirDefinirSaldoNaoFinito() {

		// Arrange
		ContaCorrente conta = new ContaCorrente(1, 100.0, true);

		// Act + Assert
		assertThrows(IllegalArgumentException.class, () -> conta.setSaldo(Double.NEGATIVE_INFINITY));
		assertEquals(100.0, conta.getSaldo(), 0.001);
	}

}
