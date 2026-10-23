package sqlite

import (
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"path/filepath"
	"testing"
)

func TestUnitOfWorkFazRollbackNoSQLite(t *testing.T) {
	b, e := Abrir(filepath.Join(t.TempDir(), "b.db"))
	if e != nil {
		t.Fatal(e)
	}
	defer b.Fechar()
	if e = b.Migrar(); e != nil {
		t.Fatal(e)
	}
	r := NovoContaRepositorio(b)
	c, _ := conta.Nova(1, 100, true)
	_ = r.Adicionar(c)
	e = r.Executar(func(tx ports.ContaRepository) error {
		c, _ := tx.Buscar(1)
		_ = c.DefinirSaldo(0)
		_ = tx.Atualizar(c)
		return errors.New("falha")
	})
	if e == nil {
		t.Fatal("erro esperado")
	}
	c, _ = r.Buscar(1)
	if c.Saldo() != 100 {
		t.Fatal("rollback falhou")
	}
}
