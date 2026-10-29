package negocio;

import java.util.ArrayList;
import java.util.List;

/**
 * Fabrica responsavel por montar um SistemaBancario com dados de
 * exemplo, usada apenas para permitir testes manuais via console
 * (Main). Antes, esses dados ficcticios eram criados dentro do proprio
 * SistemaBancario, misturando dados de fixture com a classe de
 * dominio (violacao de responsabilidade unica) e impedindo que o
 * SistemaBancario fosse montado com qualquer outra fonte de dados.
 *
 * O metodo abaixo e "static", mas isso nao repete o problema
 * eliminado anteriormente: aqueles static fields guardavam ESTADO
 * COMPARTILHADO e mutavel entre chamadas. Aqui nao ha estado algum -
 * e uma Static Factory Method (Effective Java, item 1): recebe nada,
 * devolve um objeto novo e independente a cada chamada.
 */
public final class CargaInicialFactory {

	private CargaInicialFactory() {
	}

	public static SistemaBancario criarComDadosDeExemplo() throws IdadeNaoPermitidaException {

		List<ContaCorrente> contasDoBanco = new ArrayList<>();
		List<Cliente> clientesDoBanco = new ArrayList<>();

		ContaCorrente conta01 = new ContaCorrente(1, 100, true);
		ContaCorrente conta02 = new ContaCorrente(2, 100, true);
		contasDoBanco.add(conta01);
		contasDoBanco.add(conta02);

		Cliente cliente01 = new Cliente(1, "Maria Silva", 31, "mariasilva@gmail.com", conta01.getId(), true);
		Cliente cliente02 = new Cliente(2, "Felipe Augusto", 34, "felipeaugusto@gmail.com", conta02.getId(), true);
		clientesDoBanco.add(cliente01);
		clientesDoBanco.add(cliente02);

		GerenciadoraClientes gerClientes = new GerenciadoraClientes(clientesDoBanco);
		GerenciadoraContas gerContas = new GerenciadoraContas(contasDoBanco);

		return new SistemaBancario(gerClientes, gerContas);
	}

}
