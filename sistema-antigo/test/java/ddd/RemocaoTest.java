package ddd;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import org.junit.Before;
import org.junit.Test;

import negocio.Cliente;
import negocio.ContaCorrente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;

/**
 * DDD - Requisitos 7 (Remover cliente) e 11 (Remover conta corrente).
 *
 * A remocao e uma operacao sobre a colecao (repositorio), e nao sobre
 * a entidade: um Cliente nao "remove a si mesmo" do banco.
 */
public class RemocaoTest {

	private SistemaBancario sistema;

	@Before
	public void prepararClienteComConta() throws Exception {
		sistema = new SistemaBancario(
				new GerenciadoraClientes(new ArrayList<>()),
				new GerenciadoraContas(new ArrayList<>()));
		sistema.cadastrarConta(new ContaCorrente(1, 100.0, true));
		sistema.cadastrarCliente(new Cliente(1, "Maria Silva", 31, "maria@gmail.com", 1, true));
	}

	// ---------- Requisito 7 - Remover cliente ----------

	@Test
	public void deveRemoverClienteCadastrado() {
		boolean removido = sistema.removerCliente(1);

		assertTrue(removido);
		assertNull(sistema.consultarCliente(1));
	}

	@Test
	public void naoDeveRemoverClienteInexistente() {
		assertFalse(sistema.removerCliente(99));
	}

	@Test
	public void removerClienteNaoRemoveAContaCorrenteAssociada() {
		sistema.removerCliente(1);

		assertNotNull(sistema.consultarConta(1));
	}

	// ---------- Requisito 11 - Remover conta corrente ----------

	@Test
	public void deveRemoverContaCorrenteCadastrada() {
		boolean removida = sistema.removerConta(1);

		assertTrue(removida);
		assertNull(sistema.consultarConta(1));
	}

	@Test
	public void naoDeveRemoverContaCorrenteInexistente() {
		assertFalse(sistema.removerConta(99));
	}

}
