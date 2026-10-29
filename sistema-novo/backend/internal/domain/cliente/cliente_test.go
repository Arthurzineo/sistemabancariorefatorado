package cliente

import (
	"errors"
	"testing"
)

func TestNovoValidaLimitesDeIdade(t *testing.T) {
	for _, idade := range []int{18, 65} {
		cliente, err := Novo(1, "Ana", idade, "ana@example.com", 1, true)
		if err != nil || cliente.Idade() != idade {
			t.Fatalf("idade %d deveria ser aceita: cliente=%v err=%v", idade, cliente, err)
		}
	}

	for _, idade := range []int{17, 66} {
		_, err := Novo(1, "Ana", idade, "ana@example.com", 1, true)
		if !errors.Is(err, ErrIdadeNaoPermitida) {
			t.Fatalf("idade %d deveria ser recusada: %v", idade, err)
		}
	}
}

func TestDefinirIdadeMantemEstadoQuandoInvalida(t *testing.T) {
	cliente, err := Novo(1, "Ana", 30, "ana@example.com", 1, true)
	if err != nil {
		t.Fatal(err)
	}
	if err := cliente.DefinirIdade(17); !errors.Is(err, ErrIdadeNaoPermitida) {
		t.Fatalf("erro inesperado: %v", err)
	}
	if cliente.Idade() != 30 {
		t.Fatalf("idade foi alterada após erro: %d", cliente.Idade())
	}
}

func TestIdadePermitidaSegueMesmosLimites(t *testing.T) {
	if IdadePermitida(17) || !IdadePermitida(18) || !IdadePermitida(65) || IdadePermitida(66) {
		t.Fatal("limites de idade incorretos")
	}
}
