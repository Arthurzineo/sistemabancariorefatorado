package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Before;
import org.junit.Test;

import negocio.ContaCorrente;

/**
 * TDD - Requisito 12: Transferir valores entre contas.
 */
public class TransferenciaTest {

	private static final double DELTA = 0.001;

	private ContaCorrente origem;
	private ContaCorrente destino;

	@Before
	public void criarContas() {
		origem = new ContaCorrente(1, 100.0, true);
		destino = new ContaCorrente(2, 0.0, true);
	}

	@Test
	public void deveTransferirQuandoExisteSaldoSuficiente() {

		// Act
		boolean transferiu = origem.transferir(destino, 40.0);

		// Assert
		assertTrue(transferiu);
		assertEquals(60.0, origem.getSaldo(), DELTA);
		assertEquals(40.0, destino.getSaldo(), DELTA);
	}

	@Test
	public void naoDeveTransferirQuandoSaldoForInsuficiente() {

		// Act
		boolean transferiu = origem.transferir(destino, 150.0);

		// Assert
		assertFalse(transferiu);
		assertSaldosInalterados();
	}

	@Test
	public void naoDeveTransferirValorNegativo() {

		// Act
		boolean transferiu = origem.transferir(destino, -50.0);

		// Assert
		assertFalse(transferiu);
		assertSaldosInalterados();
	}

	@Test
	public void naoDeveTransferirValorZero() {

		// Act
		boolean transferiu = origem.transferir(destino, 0.0);

		// Assert
		assertFalse(transferiu);
		assertSaldosInalterados();
	}

	@Test
	public void naoDeveTransferirParaDestinoNulo() {

		// Act
		boolean transferiu = origem.transferir(null, 40.0);

		// Assert
		assertFalse(transferiu);
		assertEquals(100.0, origem.getSaldo(), DELTA);
	}

	@Test
	public void naoDeveTransferirQuandoSaldoDoDestinoDeixariaDeSerFinito() {

		// Arrange
		ContaCorrente origemComSaldoMaximo = new ContaCorrente(3, Double.MAX_VALUE, true);
		ContaCorrente destinoComSaldoMaximo = new ContaCorrente(4, Double.MAX_VALUE, true);

		// Act
		boolean transferiu = origemComSaldoMaximo.transferir(destinoComSaldoMaximo, Double.MAX_VALUE);

		// Assert
		assertFalse(transferiu);
		assertEquals(Double.MAX_VALUE, origemComSaldoMaximo.getSaldo(), DELTA);
		assertEquals(Double.MAX_VALUE, destinoComSaldoMaximo.getSaldo(), DELTA);
	}

	@Test
	public void naoDeveTransferirValorNaoNumerico() {

		// Act
		boolean transferiu = origem.transferir(destino, Double.NaN);

		// Assert
		assertFalse(transferiu);
		assertSaldosInalterados();
	}

	private void assertSaldosInalterados() {
		assertEquals(100.0, origem.getSaldo(), DELTA);
		assertEquals(0.0, destino.getSaldo(), DELTA);
	}

}
