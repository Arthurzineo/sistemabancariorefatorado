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
import negocio.Cliente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.IdadeNaoPermitidaException;
import negocio.SistemaBancario;
import negocio.SituacaoCliente;

/**
 * Step definitions dos cenarios de cliente:
 * consultar_cliente.feature, ativar_cliente.feature e
 * desativar_cliente.feature (requisitos 1, 4 e 5).
 *
 * Cucumber cria uma nova instancia desta classe para cada cenario,
 * portanto cada cenario comeca com um SistemaBancario vazio.
 */
public class ClienteSteps {

	private final SistemaBancario sistema = new SistemaBancario(
			new GerenciadoraClientes(new ArrayList<>()),
			new GerenciadoraContas(new ArrayList<>()));

	private Cliente clienteConsultado;

	private boolean resultadoOperacao;

	// ---------- Dado (preparacao) ----------

	@Dado("que existe um cliente cadastrado com id {int} e nome {string}")
	public void queExisteUmClienteCadastrado(int id, String nome) throws IdadeNaoPermitidaException {
		sistema.cadastrarCliente(new Cliente(id, nome, 30, "cliente@gmail.com", id, true));
	}

	@Dado("que não existe cliente cadastrado com id {int}")
	public void queNaoExisteClienteCadastrado(int id) {
		assertNull(sistema.consultarCliente(id));
	}

	@Dado("que o cliente de id {int} está ativo")
	public void queOClienteEstaAtivo(int id) {
		sistema.consultarCliente(id).ativar();
	}

	@Dado("que o cliente de id {int} está inativo")
	public void queOClienteEstaInativo(int id) {
		sistema.consultarCliente(id).desativar();
	}

	// ---------- Quando (acao) ----------

	@Quando("o operador consultar o cliente de id {int}")
	public void oOperadorConsultarOCliente(int id) {
		clienteConsultado = sistema.consultarCliente(id);
	}

	@Quando("for solicitada a ativação do cliente de id {int}")
	public void forSolicitadaAAtivacao(int id) {
		resultadoOperacao = sistema.ativarCliente(id);
	}

	@Quando("for solicitada a desativação do cliente de id {int}")
	public void forSolicitadaADesativacao(int id) {
		resultadoOperacao = sistema.desativarCliente(id);
	}

	// ---------- Entao (validacao) ----------

	@Então("o sistema deverá retornar o cliente {string}")
	public void oSistemaDeveraRetornarOCliente(String nome) {
		assertNotNull(clienteConsultado);
		assertEquals(nome, clienteConsultado.getNome());
	}

	@Então("o sistema deverá informar que o cliente não foi encontrado")
	public void oSistemaDeveraInformarClienteNaoEncontrado() {
		assertNull(clienteConsultado);
	}

	@Então("a operação deverá ser concluída com sucesso")
	public void aOperacaoDeveraSerConcluidaComSucesso() {
		assertTrue(resultadoOperacao);
	}

	@Então("a operação deverá ser rejeitada")
	public void aOperacaoDeveraSerRejeitada() {
		assertFalse(resultadoOperacao);
	}

	@Então("o cliente de id {int} deverá ficar ativo")
	public void oClienteDeveraFicarAtivo(int id) {
		assertEquals(SituacaoCliente.ATIVO, sistema.consultarCliente(id).getSituacao());
	}

	@Então("o cliente de id {int} deverá ficar inativo")
	public void oClienteDeveraFicarInativo(int id) {
		assertEquals(SituacaoCliente.INATIVO, sistema.consultarCliente(id).getSituacao());
	}

}
