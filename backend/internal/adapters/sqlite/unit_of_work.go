package sqlite

func (b *Banco) Executar(fn func() error) error {
	tx, err := b.db.Begin()
	if err != nil {
		return err
	}
	if err = fn(); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}
