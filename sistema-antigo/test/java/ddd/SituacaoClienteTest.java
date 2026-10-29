package ddd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;

import negocio.Cliente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;
import negocio.SituacaoCliente;

/**
 * DDD - Requisito 6: Verificar situacao do cliente.
 */
public class SituacaoClienteTest {

	private SistemaBancario sistema;
	private Cliente cliente;

	@Before
	public void prepararClienteAtivo() throws Exception {
		sistema = new SistemaBancario(
				new GerenciadoraClientes(new ArrayList<>()),
				new GerenciadoraContas(new ArrayList<>()));
		cliente = new Cliente(1, "Maria Silva", 31, "maria@gmail.com", 1, true);
		sistema.cadastrarCliente(cliente);
	}

	@Test
	public void clienteCriadoAtivoDeveEstarNaSituacaoAtivo() {
		assertEquals(SituacaoCliente.ATIVO, cliente.getSituacao());
		assertTrue(cliente.estaAtivo());
	}

	@Test
	public void clienteDesativadoDeveEstarNaSituacaoInativo() {
		cliente.desativar();

		assertEquals(SituacaoCliente.INATIVO, cliente.getSituacao());
		assertFalse(cliente.estaAtivo());
	}

	@Test
	public void clienteReativadoDeveVoltarParaSituacaoAtivo() {
		cliente.desativar();

		cliente.ativar();

		assertEquals(SituacaoCliente.ATIVO, cliente.getSituacao());
	}

	@Test
	public void deveVerificarSituacaoDeClienteCadastrado() {
		sistema.desativarCliente(1);

		Optional<SituacaoCliente> situacao = sistema.verificarSituacaoCliente(1);

		assertEquals(Optional.of(SituacaoCliente.INATIVO), situacao);
	}

	@Test
	public void naoDeveConfundirClienteInexistenteComClienteInativo() {
		Optional<SituacaoCliente> situacao = sistema.verificarSituacaoCliente(99);

		assertFalse(situacao.isPresent());
	}

}
