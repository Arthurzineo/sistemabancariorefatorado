package sqlite

import "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/ports"

func (r *ContaRepositorio) Executar(fn func(ports.ContaRepository) error) error {
	b := r.banco
	tx, err := b.db.Begin()
	if err != nil {
		return err
	}
	if err = fn(&ContaRepositorio{banco: b, db: tx}); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}
