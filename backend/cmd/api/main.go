package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	httpadapter "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/http"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/sqlite"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/seed"
)

func main() {
	path, port := os.Getenv("DB_PATH"), os.Getenv("PORT")
	if path == "" {
		path = "banco.db"
	}
	if port == "" {
		port = "8080"
	}
	banco, err := sqlite.Abrir(path)
	if err != nil {
		log.Fatal(err)
	}
	defer banco.Fechar()
	if err = banco.Migrar(); err != nil {
		log.Fatal(err)
	}
	clientes, contas := sqlite.NovoClienteRepositorio(banco), sqlite.NovoContaRepositorio(banco)
	if os.Getenv("SEED") == "true" {
		if err := seed.Aplicar(clientes, contas); err != nil {
			log.Fatal(err)
		}
	}
	srv := &http.Server{
		Addr:              ":" + port,
		Handler:           httpadapter.NovoRouter(clienteapp.NovoServico(clientes), contaapp.NovoServico(contas)),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGINT, syscall.SIGTERM)
	<-sig
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
}
