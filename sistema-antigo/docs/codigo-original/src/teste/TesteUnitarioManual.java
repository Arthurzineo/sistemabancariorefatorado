package teste;

import java.util.ArrayList;
import java.util.List;

import negocio.Cliente;
import negocio.ContaCorrente;
import negocio.GerenciadoraClientes;
import negocio.GerenciadoraContas;
import negocio.IdadeNaoPermitidaException;

/**
 * Testes de unidade escritos manualmente, sem uso de framework de
 * testes (JUnit ou similar), apenas verificacoes simples via System.out.
 *
 * Cobrem Cliente, ContaCorrente, GerenciadoraClientes e
 * GerenciadoraContas de forma isolada, incluindo Analise de Valor
 * Limite (Boundary Value Analysis) para a faixa de idade permitida
 * [18, 65], tecnica classica descrita na bibliografia de teste de
 * software para reduzir o numero de casos necessarios concentrando-os
 * nas fronteiras onde erros sao mais provaveis.
 */
public class TesteUnitarioManual {

	private static int total = 0;
	private static int falhas = 0;

	public static void main(String[] args) {

		testesCliente();
		testesContaCorrente();
		testesGerenciadoraClientes();
		testesGerenciadoraContas();

		System.out.println();
		System.out.println("========================================");
		System.out.println("Total de testes: " + total);
		System.out.println("Falharam: " + falhas);
		System.out.println("Passaram: " + (total - falhas));
		System.out.println("========================================");
	}

	// ---------- Cliente ----------

	private static void testesCliente() {

		System.out.println("--- Cliente ---");

		// valores validos, incluindo os limites da faixa (18 e 65)
		try {
			Cliente c = new Cliente(1, "Ana", 18, "ana@x.com", 1, true);
			verifica("idade no limite inferior (18) e aceita", c.getIdade() == 18);
		} catch (IdadeNaoPermitidaException e) {
			verifica("idade no limite inferior (18) e aceita", false);
		}

		try {
			Cliente c = new Cliente(2, "Beto", 65, "beto@x.com", 2, true);
			verifica("idade no limite superior (65) e aceita", c.getIdade() == 65);
		} catch (IdadeNaoPermitidaException e) {
			verifica("idade no limite superior (65) e aceita", false);
		}

		// valores logo fora da faixa (17 e 66) devem ser rejeitados
		try {
			new Cliente(3, "Carla", 17, "carla@x.com", 3, true);
			verifica("idade 17 (abaixo do limite) deve ser rejeitada", false);
		} catch (IdadeNaoPermitidaException e) {
			verifica("idade 17 (abaixo do limite) deve ser rejeitada", true);
		}

		try {
			new Cliente(4, "Davi", 66, "davi@x.com", 4, true);
			verifica("idade 66 (acima do limite) deve ser rejeitada", false);
		} catch (IdadeNaoPermitidaException e) {
			verifica("idade 66 (acima do limite) deve ser rejeitada", true);
		}

		// status ativo/inativo e demais atributos
		try {
			Cliente c = new Cliente(5, "Elis", 30, "elis@x.com", 9, false);
			verifica("cliente criado inativo mantem isAtivo() = false", !c.isAtivo());
			c.setAtivo(true);
			verifica("setAtivo(true) reflete em isAtivo()", c.isAtivo());
			verifica("getIdContaCorrente() retorna o id informado", c.getIdContaCorrente() == 9);
		} catch (IdadeNaoPermitidaException e) {
			verifica("setup do teste de status do cliente", false);
		}
	}

	// ---------- ContaCorrente ----------

	private static void testesContaCorrente() {

		System.out.println("--- ContaCorrente ---");

		ContaCorrente conta = new ContaCorrente(1, 100.0, true);
		verifica("saldo inicial e o informado no construtor", conta.getSaldo() == 100.0);
		verifica("conta criada ativa mantem isAtivo() = true", conta.isAtivo());

		conta.setSaldo(150.0);
		verifica("setSaldo atualiza o saldo corretamente", conta.getSaldo() == 150.0);

		conta.setAtivo(false);
		verifica("setAtivo(false) reflete em isAtivo()", !conta.isAtivo());

		String texto = conta.toString();
		verifica("toString contem o saldo formatado", texto.contains("150.0"));
	}

	// ---------- GerenciadoraClientes ----------

	private static void testesGerenciadoraClientes() {

		System.out.println("--- GerenciadoraClientes ---");

		try {
			List<Cliente> lista = new ArrayList<>();
			lista.add(new Cliente(1, "Fabio", 40, "fabio@x.com", 1, true));
			GerenciadoraClientes ger = new GerenciadoraClientes(lista);

			verifica("pesquisa encontra cliente existente", ger.pesquisa(1) != null);
			verifica("pesquisa retorna null para id inexistente", ger.pesquisa(999) == null);

			ger.adiciona(new Cliente(2, "Gina", 22, "gina@x.com", 2, true));
			verifica("adiciona incrementa a lista de clientes", ger.listarTodos().size() == 2);

			boolean removeuExistente = ger.remove(1);
			verifica("remove retorna true ao remover cliente existente", removeuExistente);
			verifica("cliente removido nao e mais encontrado", ger.pesquisa(1) == null);

			boolean removeuInexistente = ger.remove(999);
			verifica("remove retorna false para id inexistente", !removeuInexistente);

			verifica("estaAtivo retorna true para cliente ativo", ger.estaAtivo(2));

		} catch (IdadeNaoPermitidaException e) {
			verifica("setup do teste de GerenciadoraClientes", false);
		}
	}

	// ---------- GerenciadoraContas ----------

	private static void testesGerenciadoraContas() {

		System.out.println("--- GerenciadoraContas ---");

		List<ContaCorrente> lista = new ArrayList<>();
		lista.add(new ContaCorrente(1, 100.0, true));
		lista.add(new ContaCorrente(2, 0.0, true));
		GerenciadoraContas ger = new GerenciadoraContas(lista);

		// transferencia com saldo suficiente deve ter sucesso e mover o valor
		boolean sucesso = ger.transfereValor(1, 40.0, 2);
		verifica("transferencia com saldo suficiente retorna true", sucesso);
		verifica("saldo da conta origem foi debitado", ger.pesquisa(1).getSaldo() == 60.0);
		verifica("saldo da conta destino foi creditado", ger.pesquisa(2).getSaldo() == 40.0);

		// transferencia sem saldo suficiente nao deve alterar nada
		boolean falhaSaldo = ger.transfereValor(1, 1000.0, 2);
		verifica("transferencia sem saldo suficiente retorna false", !falhaSaldo);
		verifica("saldo da conta origem nao foi alterado apos falha", ger.pesquisa(1).getSaldo() == 60.0);

		// transferencia envolvendo conta inexistente nao deve lancar excecao
		boolean falhaContaInexistente = ger.transfereValor(1, 10.0, 999);
		verifica("transferencia para conta inexistente retorna false (sem NullPointerException)", !falhaContaInexistente);
	}

	// ---------- utilitario de verificacao ----------

	private static void verifica(String nomeTeste, boolean condicao) {
		total++;
		if (condicao) {
			System.out.println("[OK]     " + nomeTeste);
		} else {
			falhas++;
			System.out.println("[FALHOU] " + nomeTeste);
		}
	}

}
