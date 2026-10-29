package cliente_test

import (
	"errors"
	"testing"

	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	app "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
)

func TestCadastrarClienteRecusaIdentificadorDuplicado(t *testing.T) {
	repositorio := memory.NovoClienteRepositorio()
	servico := app.NovoServico(repositorio)
	if _, err := servico.Cadastrar(1, "Ana", 25, "ana@example.com", 10, true); err != nil {
		t.Fatal(err)
	}
	if _, err := servico.Cadastrar(1, "Bia", 30, "bia@example.com", 11, true); !errors.Is(err, app.ErrIDDuplicado) {
		t.Fatalf("erro: %v", err)
	}
}

func TestRemoverClienteNaoRemoveContaAssociada(t *testing.T) {
	clientes := memory.NovoClienteRepositorio()
	contas := memory.NovoContaRepositorio()
	conta, err := app.NovoServico(clientes).Cadastrar(1, "Ana", 25, "ana@example.com", 10, true)
	if err != nil {
		t.Fatal(err)
	}
	_ = conta
	if err := contas.AdicionarComSaldo(10, 100, true); err != nil {
		t.Fatal(err)
	}
	if err := app.NovoServico(clientes).Remover(1); err != nil {
		t.Fatal(err)
	}
	if _, ok := contas.Buscar(10); !ok {
		t.Fatal("conta associada foi removida")
	}
}
