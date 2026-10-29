package ddd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Optional;

import org.junit.Before;
import org.junit.Test;

import negocio.ContaCorrente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;
import negocio.SituacaoConta;

/**
 * DDD - Requisito 10: Verificar situacao da conta corrente.
 */
public class SituacaoContaCorrenteTest {

	private SistemaBancario sistema;
	private ContaCorrente conta;

	@Before
	public void prepararContaAtiva() {
		sistema = new SistemaBancario(
				new GerenciadoraClientes(new ArrayList<>()),
				new GerenciadoraContas(new ArrayList<>()));
		conta = new ContaCorrente(1, 100.0, true);
		sistema.cadastrarConta(conta);
	}

	@Test
	public void contaCriadaAtivaDeveEstarNaSituacaoAtiva() {
		assertEquals(SituacaoConta.ATIVA, conta.getSituacao());
		assertTrue(conta.estaAtiva());
	}

	@Test
	public void contaCriadaInativaDeveEstarNaSituacaoInativa() {
		ContaCorrente contaInativa = new ContaCorrente(2, 0.0, false);

		assertEquals(SituacaoConta.INATIVA, contaInativa.getSituacao());
		assertFalse(contaInativa.estaAtiva());
	}

	@Test
	public void contaDesativadaDeveEstarNaSituacaoInativa() {
		conta.desativar();

		assertEquals(SituacaoConta.INATIVA, conta.getSituacao());
	}

	@Test
	public void deveVerificarSituacaoDeContaCadastrada() {
		Optional<SituacaoConta> situacao = sistema.verificarSituacaoConta(1);

		assertEquals(Optional.of(SituacaoConta.ATIVA), situacao);
	}

	@Test
	public void naoDeveConfundirContaInexistenteComContaInativa() {
		Optional<SituacaoConta> situacao = sistema.verificarSituacaoConta(99);

		assertFalse(situacao.isPresent());
	}

}
