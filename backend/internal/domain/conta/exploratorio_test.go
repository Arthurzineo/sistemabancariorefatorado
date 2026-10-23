package conta_test

import (
	"math"
	"testing"

	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

func TestTransferirMaxFloat64NaoGeraInfinito(t *testing.T) {
	origem, err := domain.Nova(1, math.MaxFloat64, true)
	if err != nil {
		t.Fatal(err)
	}
	destino, err := domain.Nova(2, math.MaxFloat64, true)
	if err != nil {
		t.Fatal(err)
	}

	err = domain.Transferir(origem, destino, math.MaxFloat64)
	if err != domain.ErrCreditoNaoFinito {
		t.Fatalf("esperava ErrCreditoNaoFinito, obteve %v", err)
	}
	if math.IsInf(destino.Saldo(), 1) {
		t.Fatalf("saldo do destino virou Inf: %v", destino.Saldo())
	}
}
