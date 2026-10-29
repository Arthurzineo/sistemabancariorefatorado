package negocio;

import java.util.Optional;
import java.util.Scanner;

/**
 * Ponto de entrada da aplicacao. Responsavel apenas pela interacao
 * via console (menu, leitura de opcoes, exibicao de resultados),
 * delegando toda a logica de negocio para o SistemaBancario.
 *
 * A leitura e feita linha a linha: uma entrada invalida (letra no
 * lugar de numero, linha vazia) apenas pede o valor de novo, em vez
 * de derrubar o programa.
 */
public class Main {

	private static final int OPCAO_SAIR = 0;

	private SistemaBancario sistemaBancario;
	private Scanner sc;

	public static void main(String[] args) {
		try {
			new Main().executar();
		} catch (IdadeNaoPermitidaException e) {
			System.out.println("Erro ao inicializar o sistema: " + e.getMessage());
		}
	}

	public Main() throws IdadeNaoPermitidaException {
		this.sistemaBancario = CargaInicialFactory.criarComDadosDeExemplo();
		this.sc = new Scanner(System.in);
	}

	private void executar() {

		boolean continua = true;

		while (continua) {

			printMenu();

			Integer opcao = lerOpcao();

			if (opcao == null) {
				encerrar();
				return;
			}

			switch (opcao) {
			case 1:
				consultarCliente();
				break;

			case 2:
				cadastrarCliente();
				break;

			case 3:
				validarIdadeCliente();
				break;

			case 4:
				ativarCliente();
				break;

			case 5:
				desativarCliente();
				break;

			case 6:
				verificarSituacaoCliente();
				break;

			case 7:
				removerCliente();
				break;

			case 8:
				consultarConta();
				break;

			case 9:
				cadastrarConta();
				break;

			case 10:
				verificarSituacaoConta();
				break;

			case 11:
				removerConta();
				break;

			case 12:
				transferir();
				break;

			case OPCAO_SAIR:
				continua = false;
				encerrar();
				break;

			default:
				System.out.println("Opcao invalida! Escolha um numero do menu.");
				pulalinha();
				break;
			}
		}
	}

	private void encerrar() {
		System.out.println("################# Sistema encerrado #################");
	}

	// ----------------------------------------------------------------
	// Clientes
	// ----------------------------------------------------------------

	private void consultarCliente() {
		int idCliente = lerInteiro("Digite o ID do cliente: ");
		Cliente cliente = sistemaBancario.consultarCliente(idCliente);

		if (cliente != null)
			System.out.println(cliente.toString());
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void cadastrarCliente() {
		int id = lerInteiro("Digite o ID do novo cliente: ");

		if (sistemaBancario.consultarCliente(id) != null) {
			System.out.println("Ja existe um cliente com o ID " + id + "!");
			pulalinha();
			return;
		}

		String nome = lerTexto("Digite o nome: ");
		int idade = lerInteiro("Digite a idade: ");
		String email = lerTexto("Digite o email: ");
		int idConta = lerInteiro("Digite o ID da conta corrente do cliente: ");
		boolean ativo = lerSimNao("O cliente ja comeca ativo? (s/n): ");

		try {
			Cliente cliente = new Cliente(id, nome, idade, email, idConta, ativo);

			if (sistemaBancario.cadastrarCliente(cliente))
				System.out.println("Cliente cadastrado com sucesso!");
			else
				System.out.println("Ja existe um cliente com o ID " + id + "!");
		} catch (IdadeNaoPermitidaException e) {
			System.out.println("Cliente nao cadastrado: " + e.getMessage());
		}

		pulalinha();
	}

	private void validarIdadeCliente() {
		int idade = lerInteiro("Digite a idade a validar: ");

		if (Cliente.idadePermitida(idade))
			System.out.println("Idade " + idade + " permitida.");
		else
			System.out.println("Idade " + idade + " NAO permitida. " + IdadeNaoPermitidaException.MSG_IDADE_INVALIDA);

		pulalinha();
	}

	private void ativarCliente() {
		int idCliente = lerInteiro("Digite o ID do cliente: ");

		if (sistemaBancario.ativarCliente(idCliente))
			System.out.println("Cliente ativado com sucesso!");
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void desativarCliente() {
		int idCliente = lerInteiro("Digite o ID do cliente: ");

		if (sistemaBancario.desativarCliente(idCliente))
			System.out.println("Cliente desativado com sucesso!");
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void verificarSituacaoCliente() {
		int idCliente = lerInteiro("Digite o ID do cliente: ");
		Optional<SituacaoCliente> situacao = sistemaBancario.verificarSituacaoCliente(idCliente);

		if (situacao.isPresent())
			System.out.println("Situacao do cliente " + idCliente + ": " + situacao.get().getDescricao());
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void removerCliente() {
		int idCliente = lerInteiro("Digite o ID do cliente: ");

		if (sistemaBancario.removerCliente(idCliente))
			System.out.println("Cliente removido com sucesso!");
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	// ----------------------------------------------------------------
	// Contas correntes
	// ----------------------------------------------------------------

	private void consultarConta() {
		int idConta = lerInteiro("Digite o ID da conta: ");
		ContaCorrente conta = sistemaBancario.consultarConta(idConta);

		if (conta != null)
			System.out.println(conta.toString());
		else
			System.out.println("Conta nao encontrada!");

		pulalinha();
	}

	private void cadastrarConta() {
		int id = lerInteiro("Digite o numero (ID) da nova conta: ");

		if (sistemaBancario.consultarConta(id) != null) {
			System.out.println("Ja existe uma conta com o ID " + id + "!");
			pulalinha();
			return;
		}

		double saldo = lerValor("Digite o saldo inicial: ");
		boolean ativa = lerSimNao("A conta ja comeca ativa? (s/n): ");

		if (sistemaBancario.cadastrarConta(new ContaCorrente(id, saldo, ativa)))
			System.out.println("Conta cadastrada com sucesso!");
		else
			System.out.println("Ja existe uma conta com o ID " + id + "!");

		pulalinha();
	}

	private void verificarSituacaoConta() {
		int idConta = lerInteiro("Digite o ID da conta: ");
		Optional<SituacaoConta> situacao = sistemaBancario.verificarSituacaoConta(idConta);

		if (situacao.isPresent())
			System.out.println("Situacao da conta " + idConta + ": " + situacao.get().getDescricao());
		else
			System.out.println("Conta nao encontrada!");

		pulalinha();
	}

	private void removerConta() {
		int idConta = lerInteiro("Digite o ID da conta: ");

		if (sistemaBancario.removerConta(idConta))
			System.out.println("Conta removida com sucesso!");
		else
			System.out.println("Conta nao encontrada!");

		pulalinha();
	}

	/**
	 * As regras da transferencia ficam no dominio. Aqui o Main apenas
	 * consulta as contas antes, para explicar ao usuario POR QUE uma
	 * transferencia recusada nao foi feita.
	 */
	private void transferir() {
		int idOrigem = lerInteiro("Digite o ID da conta de origem: ");
		int idDestino = lerInteiro("Digite o ID da conta de destino: ");
		double valor = lerValor("Digite o valor a transferir: ");

		ContaCorrente origem = sistemaBancario.consultarConta(idOrigem);
		ContaCorrente destino = sistemaBancario.consultarConta(idDestino);

		if (sistemaBancario.transferir(idOrigem, idDestino, valor)) {
			System.out.println("Transferencia realizada com sucesso!");
			System.out.println("Saldo da conta " + idOrigem + ": " + origem.getSaldo());
			System.out.println("Saldo da conta " + idDestino + ": " + destino.getSaldo());
		} else if (origem == null) {
			System.out.println("Transferencia nao realizada: conta de origem nao encontrada!");
		} else if (destino == null) {
			System.out.println("Transferencia nao realizada: conta de destino nao encontrada!");
		} else if (valor <= 0) {
			System.out.println("Transferencia nao realizada: o valor precisa ser maior que zero!");
		} else if (!origem.possuiSaldoSuficiente(valor)) {
			System.out.println("Transferencia nao realizada: saldo insuficiente na conta de origem!");
		} else {
			System.out.println("Transferencia nao realizada!");
		}

		pulalinha();
	}

	// ----------------------------------------------------------------
	// Leitura do console
	// ----------------------------------------------------------------

	/**
	 * @return a opcao escolhida, ou null se a entrada terminou (EOF)
	 */
	private Integer lerOpcao() {
		while (sc.hasNextLine()) {
			String linha = sc.nextLine().trim();
			try {
				return Integer.parseInt(linha);
			} catch (NumberFormatException e) {
				System.out.print("Opcao invalida! Digite o numero da opcao: ");
			}
		}
		return null;
	}

	private int lerInteiro(String mensagem) {
		while (true) {
			String linha = lerLinha(mensagem);
			try {
				return Integer.parseInt(linha);
			} catch (NumberFormatException e) {
				System.out.println("Valor invalido! Digite um numero inteiro.");
			}
		}
	}

	/** Aceita virgula ou ponto como separador decimal (ex.: 10,50). */
	private double lerValor(String mensagem) {
		while (true) {
			String linha = lerLinha(mensagem).replace(',', '.');
			try {
				double valor = Double.parseDouble(linha);
				if (Double.isFinite(valor))
					return valor;
			} catch (NumberFormatException e) {
				// cai na mensagem abaixo
			}
			System.out.println("Valor invalido! Digite um numero (ex.: 50 ou 10,50).");
		}
	}

	private String lerTexto(String mensagem) {
		while (true) {
			String linha = lerLinha(mensagem);
			if (!linha.isEmpty())
				return linha;
			System.out.println("O valor nao pode ficar em branco.");
		}
	}

	private boolean lerSimNao(String mensagem) {
		while (true) {
			String linha = lerLinha(mensagem).toLowerCase();
			if (linha.equals("s") || linha.equals("sim"))
				return true;
			if (linha.equals("n") || linha.equals("nao"))
				return false;
			System.out.println("Responda com s ou n.");
		}
	}

	/**
	 * Le uma linha do console. Se a entrada terminar no meio de uma
	 * operacao (EOF), encerra o programa de forma limpa.
	 */
	private String lerLinha(String mensagem) {
		System.out.print(mensagem);

		if (!sc.hasNextLine()) {
			System.out.println();
			encerrar();
			System.exit(0);
		}

		return sc.nextLine().trim();
	}

	private void pulalinha() {
		System.out.println("\n");
	}

	private void printMenu() {
		System.out.println("O que voce deseja fazer? \n");
		System.out.println("--- Clientes ---");
		System.out.println(" 1) Consultar cliente");
		System.out.println(" 2) Cadastrar cliente");
		System.out.println(" 3) Validar idade do cliente");
		System.out.println(" 4) Ativar cliente");
		System.out.println(" 5) Desativar cliente");
		System.out.println(" 6) Verificar situacao do cliente");
		System.out.println(" 7) Remover cliente");
		System.out.println("--- Contas correntes ---");
		System.out.println(" 8) Consultar conta corrente");
		System.out.println(" 9) Cadastrar conta corrente");
		System.out.println("10) Verificar situacao da conta corrente");
		System.out.println("11) Remover conta corrente");
		System.out.println("12) Transferir valores entre contas");
		System.out.println("----------------------");
		System.out.println(" 0) Sair");
		System.out.println();
	}

}
