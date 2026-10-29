package contract

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"testing"
)

func executarContratoConta(t *testing.T, novoRepo func(*testing.T) ports.ContaRepository) {
	t.Helper()
	repo := novoRepo(t)
	executarContratoContaNoRepo(t, repo)
}

func executarContratoCliente(t *testing.T, novoRepo func(*testing.T) ports.ClienteRepository) {
	t.Helper()
	repo := novoRepo(t)
	executarContratoClienteNoRepo(t, repo)
}
