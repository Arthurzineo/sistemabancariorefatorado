package conta

import (
	"errors"
	"math"
	"testing"
)

func TestNovaRecusaSaldoNaoFinito(t *testing.T) {
	for _, saldo := range []float64{math.NaN(), math.Inf(1), math.Inf(-1)} {
		if _, err := Nova(1, saldo, true); !errors.Is(err, ErrSaldoNaoFinito) {
			t.Fatalf("saldo %v deveria ser recusado: %v", saldo, err)
		}
	}
}

func TestDefinirSaldoMantemEstadoQuandoInvalido(t *testing.T) {
	conta, err := Nova(1, 100, true)
	if err != nil {
		t.Fatal(err)
	}
	if err := conta.DefinirSaldo(math.Inf(1)); !errors.Is(err, ErrSaldoNaoFinito) {
		t.Fatal(err)
	}
	if conta.Saldo() != 100 {
		t.Fatalf("saldo alterado: %v", conta.Saldo())
	}
}

func TestSituacaoDaContaEIdempotente(t *testing.T) {
	conta, _ := Nova(1, 0, false)
	conta.Desativar()
	if conta.Situacao() != Inativa {
		t.Fatal("conta deveria permanecer inativa")
	}
	conta.Ativar()
	if conta.Situacao() != Ativa {
		t.Fatal("conta deveria estar ativa")
	}
}
