package conta_test

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	app "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"testing"
)

func TestCadastroContaETransferencia(t *testing.T) {
	repo := memory.NovoContaRepositorio()
	s := app.NovoServico(repo)
	if _, e := s.Cadastrar(1, 100, true); e != nil {
		t.Fatal(e)
	}
	if _, e := s.Cadastrar(2, 0, true); e != nil {
		t.Fatal(e)
	}
	if e := s.Transferir(1, 2, 30); e != nil {
		t.Fatal(e)
	}
	c, _ := s.Consultar(1)
	if c.Saldo() != 70 {
		t.Fatal(c.Saldo())
	}
	if _, e := s.Cadastrar(1, 0, true); !errors.Is(e, app.ErrIDDuplicado) {
		t.Fatal(e)
	}
}

func TestTransferenciaMesmaContaNaoAlteraSaldo(t *testing.T) {
	repo := memory.NovoContaRepositorio()
	s := app.NovoServico(repo)
	if _, err := s.Cadastrar(1, 100, true); err != nil {
		t.Fatal(err)
	}

	err := s.Transferir(1, 1, 10)
	if !errors.Is(err, domain.ErrMesmaConta) {
		t.Fatalf("erro: %v", err)
	}

	conta, err := s.Consultar(1)
	if err != nil {
		t.Fatal(err)
	}
	if conta.Saldo() != 100 {
		t.Fatalf("saldo alterado: %v", conta.Saldo())
	}
}
