package contract

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/sqlite"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"path/filepath"
	"testing"
)

func TestContratoSQLite(t *testing.T) {
	novoBanco := func(t *testing.T) *sqlite.Banco {
		t.Helper()
		b, e := sqlite.Abrir(filepath.Join(t.TempDir(), "banco.db"))
		if e != nil {
			t.Fatal(e)
		}
		if e = b.Migrar(); e != nil {
			t.Fatal(e)
		}
		t.Cleanup(func() { _ = b.Fechar() })
		return b
	}
	executarContratoConta(t, func(t *testing.T) ports.ContaRepository { return sqlite.NovoContaRepositorio(novoBanco(t)) })
	executarContratoCliente(t, func(t *testing.T) ports.ClienteRepository { return sqlite.NovoClienteRepositorio(novoBanco(t)) })
}
