package tdd;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThrows;

import java.util.ArrayList;
import java.util.List;

import org.junit.Test;

import negocio.ContaCorrente;
import negocio.GerenciadoraContas;

/**
 * TDD - Requisitos 2 e 9 (complemento apos auditoria): a regra
 * "nao existem dois cadastros com o mesmo id" deve valer para qualquer
 * caminho de escrita no repositorio, e nao apenas para o
 * SistemaBancario. Os exemplos usam contas; clientes compartilham o
 * mesmo RepositorioBase.
 */
public class UnicidadeIdentificadorTest {

	private static List<ContaCorrente> listaComConta(int id) {
		List<ContaCorrente> lista = new ArrayList<>();
		lista.add(new ContaCorrente(id, 100.0, true));
		return lista;
	}

	@Test
	public void naoDeveAdicionarDiretamenteNoRepositorioComIdDuplicado() {

		// Arrange
		GerenciadoraContas repositorio = new GerenciadoraContas(listaComConta(1));

		// Act
		repositorio.adiciona(new ContaCorrente(1, 999.0, true));

		// Assert
		assertEquals(1, repositorio.listarTodos().size());
		assertEquals(100.0, repositorio.pesquisa(1).getSaldo(), 0.001);
	}

	@Test
	public void naoDevePermitirAlterarAListaDoRepositorioPorFora() {

		// Arrange
		GerenciadoraContas repositorio = new GerenciadoraContas(listaComConta(1));

		// Act + Assert
		assertThrows(UnsupportedOperationException.class,
				() -> repositorio.listarTodos().add(new ContaCorrente(1, 999.0, true)));
		assertEquals(1, repositorio.listarTodos().size());
	}

	@Test
	public void alterarAListaOriginalNaoDeveAfetarORepositorio() {

		// Arrange
		List<ContaCorrente> listaOriginal = listaComConta(1);
		GerenciadoraContas repositorio = new GerenciadoraContas(listaOriginal);

		// Act
		listaOriginal.add(new ContaCorrente(1, 999.0, true));

		// Assert
		assertEquals(1, repositorio.listarTodos().size());
	}

	@Test
	public void naoDeveCriarRepositorioComIdsDuplicados() {

		// Arrange
		List<ContaCorrente> listaComDuplicata = listaComConta(1);
		listaComDuplicata.add(new ContaCorrente(1, 999.0, true));

		// Act + Assert
		assertThrows(IllegalArgumentException.class, () -> new GerenciadoraContas(listaComDuplicata));
	}

}
