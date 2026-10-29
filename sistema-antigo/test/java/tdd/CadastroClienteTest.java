package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertSame;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

import negocio.Cliente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;

/**
 * TDD - Requisito 2: Cadastrar cliente.
 */
public class CadastroClienteTest {

	private SistemaBancario sistema;

	@Before
	public void criarSistemaVazio() {
		sistema = new SistemaBancario(
				new GerenciadoraClientes(new ArrayList<>()),
				new GerenciadoraContas(new ArrayList<>()));
	}

	@Test
	public void deveCadastrarClienteValido() throws Exception {

		// Arrange
		Cliente cliente = new Cliente(1, "Maria Silva", 31, "maria@gmail.com", 1, true);

		// Act
		boolean cadastrado = sistema.cadastrarCliente(cliente);

		// Assert
		assertTrue(cadastrado);
		assertSame(cliente, sistema.consultarCliente(1));
	}

	@Test
	public void naoDeveCadastrarClienteComIdentificadorDuplicado() throws Exception {

		// Arrange
		Cliente original = new Cliente(1, "Maria Silva", 31, "maria@gmail.com", 1, true);
		Cliente duplicado = new Cliente(1, "Outro Nome", 40, "outro@gmail.com", 2, true);
		sistema.cadastrarCliente(original);

		// Act
		boolean cadastrado = sistema.cadastrarCliente(duplicado);

		// Assert
		assertFalse(cadastrado);
		assertSame(original, sistema.consultarCliente(1));
		assertEquals("Maria Silva", sistema.consultarCliente(1).getNome());
	}

}
