package memory

import (
	"errors"
	"testing"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

func TestUnitOfWorkDescartaAlteracoesEmErro(t *testing.T) {
	r := NovoContaRepositorio(); c, _ := conta.Nova(1, 100, true); _ = r.Adicionar(c)
	uow := NovaUnitOfWork(r)
	if err := uow.Executar(func(tx *ContaRepositorio) error { c, _ := tx.Buscar(1); _ = c.DefinirSaldo(0); _ = tx.Atualizar(c); return errors.New("falhou") }); err == nil { t.Fatal("erro esperado") }
	persistida, _ := r.Buscar(1); if persistida.Saldo() != 100 { t.Fatal("transacao parcial") }
}
