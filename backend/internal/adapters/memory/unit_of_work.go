package memory

import (
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
)

type UnitOfWork struct{ contas *ContaRepositorio }

func NovaUnitOfWork(contas *ContaRepositorio) *UnitOfWork { return &UnitOfWork{contas: contas} }

func (u *UnitOfWork) Executar(fn func(ports.ContaRepository) error) error {
	u.contas.mu.RLock()
	copia := make(map[int]*conta.ContaCorrente, len(u.contas.dados))
	for id, c := range u.contas.dados {
		copia[id] = c.Copia()
	}
	u.contas.mu.RUnlock()
	tx := &ContaRepositorio{dados: copia}
	if err := fn(tx); err != nil {
		return err
	}
	u.contas.mu.Lock()
	u.contas.dados = copia
	u.contas.mu.Unlock()
	return nil
}
func (r *ContaRepositorio) Executar(fn func(ports.ContaRepository) error) error {
	return NovaUnitOfWork(r).Executar(fn)
}
