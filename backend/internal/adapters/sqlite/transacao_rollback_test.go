package sqlite_test

import (
	"errors"
	"testing"

	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/sqlite"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	domain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

type repositorioComFalhaNoSegundoAtualizar struct {
	ports.ContaRepository
	chamadasAtualizar int
}

func (r *repositorioComFalhaNoSegundoAtualizar) Atualizar(c *domain.ContaCorrente) error {
	r.chamadasAtualizar++
	if r.chamadasAtualizar == 2 {
		return errors.New("falha simulada no segundo Atualizar")
	}
	return r.ContaRepository.Atualizar(c)
}

func TestTransferirRollbackEmFalhaNoSegundoAtualizarSQLite(t *testing.T) {
	banco, err := sqlite.Abrir(":memory:")
	if err != nil {
		t.Fatal(err)
	}
	defer banco.Fechar()
	if err := banco.Migrar(); err != nil {
		t.Fatal(err)
	}

	repo := sqlite.NovoContaRepositorio(banco)
	c1, _ := domain.Nova(1, 100, true)
	c2, _ := domain.Nova(2, 50, true)
	if err := repo.Adicionar(c1); err != nil {
		t.Fatal(err)
	}
	if err := repo.Adicionar(c2); err != nil {
		t.Fatal(err)
	}

	// Executa uma transacao onde o segundo Atualizar falha
	err = repo.Executar(func(txRepo ports.ContaRepository) error {
		wrapper := &repositorioComFalhaNoSegundoAtualizar{ContaRepository: txRepo}
		origem, _ := wrapper.Buscar(1)
		destino, _ := wrapper.Buscar(2)
		if err := domain.Transferir(origem, destino, 30); err != nil {
			return err
		}
		if err := wrapper.Atualizar(origem); err != nil {
			return err
		}
		return wrapper.Atualizar(destino)
	})

	if err == nil {
		t.Fatal("esperava erro na transacao com falha simulada, mas foi nil")
	}

	// Verifica se os saldos originais permaneceram inalterados (rollback garantido no SQLite)
	c1Pos, _ := repo.Buscar(1)
	c2Pos, _ := repo.Buscar(2)
	if c1Pos.Saldo() != 100 || c2Pos.Saldo() != 50 {
		t.Fatalf("rollback falhou! Saldos alterados: c1=%v (esperado 100), c2=%v (esperado 50)", c1Pos.Saldo(), c2Pos.Saldo())
	}
}
