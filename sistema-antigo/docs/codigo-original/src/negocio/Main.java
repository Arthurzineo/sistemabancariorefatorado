package negocio;

import java.util.Scanner;

/**
 * Ponto de entrada da aplicacao. Responsavel apenas pela interacao
 * via console (menu, leitura de opcoes, exibicao de resultados),
 * delegando toda a logica de negocio para o SistemaBancario.
 */
public class Main {

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

			int opcao = sc.nextInt();

			switch (opcao) {
			case 1:
				consultarCliente();
				break;

			case 2:
				consultarConta();
				break;

			case 3:
				ativarCliente();
				break;

			case 4:
				desativarCliente();
				break;

			case 5:
				continua = false;
				System.out.println("################# Sistema encerrado #################");
				break;

			default:
				System.out.println();
				System.out.println();
				System.out.println();
				System.out.println();
				System.out.println();
				break;
			}
		}
	}

	private void consultarCliente() {
		System.out.print("Digite o ID do cliente: ");
		int idCliente = sc.nextInt();
		Cliente cliente = sistemaBancario.consultarCliente(idCliente);

		if (cliente != null)
			System.out.println(cliente.toString());
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void consultarConta() {
		System.out.print("Digite o ID da conta: ");
		int idConta = sc.nextInt();
		ContaCorrente conta = sistemaBancario.consultarConta(idConta);

		if (conta != null)
			System.out.println(conta.toString());
		else
			System.out.println("Conta nao encontrada!");

		pulalinha();
	}

	private void ativarCliente() {
		System.out.print("Digite o ID do cliente: ");
		int idCliente = sc.nextInt();

		if (sistemaBancario.ativarCliente(idCliente))
			System.out.println("Cliente ativado com sucesso!");
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void desativarCliente() {
		System.out.print("Digite o ID do cliente: ");
		int idCliente = sc.nextInt();

		if (sistemaBancario.desativarCliente(idCliente))
			System.out.println("Cliente desativado com sucesso!");
		else
			System.out.println("Cliente nao encontrado!");

		pulalinha();
	}

	private void pulalinha() {
		System.out.println("\n");
	}

	private void printMenu() {
		System.out.println("O que voce deseja fazer? \n");
		System.out.println("1) Consultar por um cliente");
		System.out.println("2) Consultar por uma conta corrente");
		System.out.println("3) Ativar um cliente");
		System.out.println("4) Desativar um cliente");
		System.out.println("5) Sair");
		System.out.println();
	}

}
