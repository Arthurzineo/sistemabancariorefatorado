package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

import negocio.Cliente;
import negocio.IdadeNaoPermitidaException;

/**
 * TDD - Requisito 3: Validar idade do cliente.
 *
 * Regra encontrada no projeto: a idade precisa estar entre
 * Cliente.IDADE_MINIMA (18) e Cliente.IDADE_MAXIMA (65), inclusive.
 * Os casos usam Analise de Valor Limite: 17, 18, 65 e 66.
 */
public class ValidacaoIdadeClienteTest {

	private Cliente criarClienteComIdade(int idade) throws IdadeNaoPermitidaException {
		return new Cliente(1, "Ana", idade, "ana@gmail.com", 1, true);
	}

	@Test
	public void deveAceitarIdadeExatamenteNoLimiteInferior() throws Exception {
		Cliente cliente = criarClienteComIdade(18);

		assertEquals(18, cliente.getIdade());
	}

	@Test
	public void deveAceitarIdadeExatamenteNoLimiteSuperior() throws Exception {
		Cliente cliente = criarClienteComIdade(65);

		assertEquals(65, cliente.getIdade());
	}

	@Test
	public void naoDeveCadastrarClienteComIdadeAbaixoDoLimite() {
		IdadeNaoPermitidaException erro = assertThrows(IdadeNaoPermitidaException.class,
				() -> criarClienteComIdade(17));

		assertEquals(IdadeNaoPermitidaException.MSG_IDADE_INVALIDA, erro.getMessage());
	}

	@Test
	public void naoDeveCadastrarClienteComIdadeAcimaDoLimite() {
		assertThrows(IdadeNaoPermitidaException.class, () -> criarClienteComIdade(66));
	}

	@Test
	public void naoDevePermitirAlterarIdadeParaForaDaFaixa() throws Exception {

		// Arrange
		Cliente cliente = criarClienteComIdade(30);

		// Act + Assert
		assertThrows(IdadeNaoPermitidaException.class, () -> cliente.setIdade(17));
		assertEquals(30, cliente.getIdade());
	}

	@Test
	public void devePermitirAlterarIdadeDentroDaFaixa() throws Exception {
		Cliente cliente = criarClienteComIdade(30);

		cliente.setIdade(65);

		assertEquals(65, cliente.getIdade());
	}

	@Test
	public void idadePermitidaDeveSeguirOsMesmosLimitesDoCadastro() {
		assertFalse(Cliente.idadePermitida(17));
		assertTrue(Cliente.idadePermitida(18));
		assertTrue(Cliente.idadePermitida(65));
		assertFalse(Cliente.idadePermitida(66));
	}

}
