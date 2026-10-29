package conta_test

import (
	"errors"
	"testing"

	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	app "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
)

func TestSituacaoEDesativacaoDaConta(t *testing.T) {
	s := app.NovoServico(memory.NovoContaRepositorio())
	if _, err := s.Situacao(99); !errors.Is(err, app.ErrContaNaoEncontrada) {
		t.Fatal(err)
	}
	if _, err := s.Cadastrar(1, 100, true); err != nil {
		t.Fatal(err)
	}
	if err := s.Desativar(1); err != nil {
		t.Fatal(err)
	}
	situacao, err := s.Situacao(1)
	if err != nil || situacao != "Inativa" {
		t.Fatalf("%q %v", situacao, err)
	}
}

func TestRemoverContaInexistenteRetornaErro(t *testing.T) {
	s := app.NovoServico(memory.NovoContaRepositorio())
	if err := s.Remover(99); !errors.Is(err, app.ErrContaNaoEncontrada) {
		t.Fatal(err)
	}
}
