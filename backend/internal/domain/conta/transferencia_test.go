package conta

import (
	"errors"
	"math"
	"testing"
)

func TestTransferirMoveSaldoEntreContasAtivas(t *testing.T) {
	origem, _ := Nova(1, 100, true)
	destino, _ := Nova(2, 0, true)
	if err := Transferir(origem, destino, 40); err != nil {
		t.Fatal(err)
	}
	if origem.Saldo() != 60 || destino.Saldo() != 40 {
		t.Fatalf("saldos: %v/%v", origem.Saldo(), destino.Saldo())
	}
}

func TestTransferirRecusaSemAlterarSaldos(t *testing.T) {
	casos := []struct {
		nome            string
		origem, destino *ContaCorrente
		valor           float64
		erro            error
	}{
		{"origem ausente", nil, novaConta(t, 2, 0, true), 1, ErrContaOrigemNaoEncontrada},
		{"destino ausente", novaConta(t, 1, 100, true), nil, 1, ErrContaDestinoNaoEncontrada},
		{"valor invalido", novaConta(t, 1, 100, true), novaConta(t, 2, 0, true), math.NaN(), ErrValorInvalido},
		{"saldo insuficiente", novaConta(t, 1, 1, true), novaConta(t, 2, 0, true), 2, ErrSaldoInsuficiente},
		{"origem inativa", novaConta(t, 1, 100, false), novaConta(t, 2, 0, true), 1, ErrContaOrigemInativa},
		{"destino inativo", novaConta(t, 1, 100, true), novaConta(t, 2, 0, false), 1, ErrContaDestinoInativa},
	}
	for _, tc := range casos {
		t.Run(tc.nome, func(t *testing.T) {
			origemSaldo, destinoSaldo := saldo(tc.origem), saldo(tc.destino)
			if err := Transferir(tc.origem, tc.destino, tc.valor); !errors.Is(err, tc.erro) {
				t.Fatalf("erro: %v", err)
			}
			if saldo(tc.origem) != origemSaldo || saldo(tc.destino) != destinoSaldo {
				t.Fatal("transferencia parcial")
			}
		})
	}
}

func novaConta(t *testing.T, id int, saldo float64, ativa bool) *ContaCorrente {
	t.Helper()
	c, err := Nova(id, saldo, ativa)
	if err != nil {
		t.Fatal(err)
	}
	return c
}
func saldo(c *ContaCorrente) float64 {
	if c == nil {
		return 0
	}
	return c.Saldo()
}

func TestTransferirRecusaMesmaConta(t *testing.T) {
	conta := novaConta(t, 1, 100, true)
	if err := Transferir(conta, conta, 10); !errors.Is(err, ErrContaOrigemEDestinoIguais) {
		t.Fatalf("erro: %v", err)
	}
	if conta.Saldo() != 100 {
		t.Fatalf("saldo alterado: %v", conta.Saldo())
	}
}
