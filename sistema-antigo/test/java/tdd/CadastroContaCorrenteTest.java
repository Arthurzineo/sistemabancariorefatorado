package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

import negocio.ContaCorrente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;

/**
 * TDD - Requisito 9: Cadastrar conta corrente.
 */
public class CadastroContaCorrenteTest {

	private SistemaBancario sistema;

	@Before
	public void criarSistemaVazio() {
		sistema = new SistemaBancario(
				new GerenciadoraClientes(new ArrayList<>()),
				new GerenciadoraContas(new ArrayList<>()));
	}

	@Test
	public void deveCadastrarContaCorrenteValida() {

		// Arrange
		ContaCorrente conta = new ContaCorrente(10, 100.0, true);

		// Act
		boolean cadastrada = sistema.cadastrarConta(conta);

		// Assert
		assertTrue(cadastrada);
		assertSame(conta, sistema.consultarConta(10));
	}

	@Test
	public void naoDeveCadastrarNumeroDeContaDuplicado() {

		// Arrange
		ContaCorrente original = new ContaCorrente(10, 100.0, true);
		ContaCorrente duplicada = new ContaCorrente(10, 999.0, true);
		sistema.cadastrarConta(original);

		// Act
		boolean cadastrada = sistema.cadastrarConta(duplicada);

		// Assert
		assertFalse(cadastrada);
		assertSame(original, sistema.consultarConta(10));
		assertEquals(100.0, sistema.consultarConta(10).getSaldo(), 0.001);
	}

}
