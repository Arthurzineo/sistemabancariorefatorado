package bdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;

import io.cucumber.java.pt.Dado;
import io.cucumber.java.pt.Então;
import io.cucumber.java.pt.Quando;
import negocio.ContaCorrente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.SistemaBancario;

/**
 * Step definitions dos cenarios de conta corrente:
 * consultar_conta.feature (requisito 8) e
 * transferir_valores.feature (requisito 12, analise integrada).
 */
public class ContaSteps {

	private static final double DELTA = 0.001;

	private final SistemaBancario sistema = new SistemaBancario(
			new GerenciadoraClientes(new ArrayList<>()),
			new GerenciadoraContas(new ArrayList<>()));

	private ContaCorrente contaConsultada;

	private boolean transferenciaRealizada;

	// ---------- Dado (preparacao) ----------

	@Dado("que existe uma conta corrente cadastrada com id {int} e saldo {double}")
	public void queExisteUmaContaCadastrada(int id, double saldo) {
		sistema.cadastrarConta(new ContaCorrente(id, saldo, true));
	}

	@Dado("que a conta de id {int} está inativa")
	public void queAContaEstaInativa(int id) {
		sistema.consultarConta(id).desativar();
	}

	@Dado("que não existe conta corrente cadastrada com id {int}")
	public void queNaoExisteContaCadastrada(int id) {
		assertNull(sistema.consultarConta(id));
	}

	// ---------- Quando (acao) ----------

	@Quando("o operador consultar a conta de id {int}")
	public void oOperadorConsultarAConta(int id) {
		contaConsultada = sistema.consultarConta(id);
	}

	@Quando("for solicitada a transferência de {double} da conta {int} para a conta {int}")
	public void forSolicitadaATransferencia(double valor, int idOrigem, int idDestino) {
		transferenciaRealizada = sistema.transferir(idOrigem, idDestino, valor);
	}

	// ---------- Entao (validacao) ----------

	@Então("o sistema deverá retornar a conta de id {int}")
	public void oSistemaDeveraRetornarAConta(int id) {
		assertNotNull(contaConsultada);
		assertEquals(id, contaConsultada.getId());
	}

	@Então("o saldo exibido deverá ser {double}")
	public void oSaldoExibidoDeveraSer(double saldo) {
		assertEquals(saldo, contaConsultada.getSaldo(), DELTA);
	}

	@Então("a situação exibida deverá ser {string}")
	public void aSituacaoExibidaDeveraSer(String situacao) {
		assertEquals(situacao, contaConsultada.getSituacao().getDescricao());
	}

	@Então("o sistema deverá informar que a conta não foi encontrada")
	public void oSistemaDeveraInformarContaNaoEncontrada() {
		assertNull(contaConsultada);
	}

	@Então("a transferência deverá ser realizada")
	public void aTransferenciaDeveraSerRealizada() {
		assertTrue(transferenciaRealizada);
	}

	@Então("a transferência deverá ser rejeitada")
	public void aTransferenciaDeveraSerRejeitada() {
		assertFalse(transferenciaRealizada);
	}

	@Então("o saldo da conta {int} deverá ser {double}")
	public void oSaldoDaContaDeveraSer(int id, double saldoEsperado) {
		assertEquals(saldoEsperado, sistema.consultarConta(id).getSaldo(), DELTA);
	}

}
