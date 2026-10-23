package http

import (
	"bytes"
	"encoding/json"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHealth(t *testing.T) {
	r := NovoRouter(nil, nil)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, "/api/health", nil))
	if w.Code != http.StatusOK {
		t.Fatalf("status: %d", w.Code)
	}
}

func TestRotasDeClientesEContas(t *testing.T) {
	clientes := clienteapp.NovoServico(memory.NovoClienteRepositorio())
	contas := contaapp.NovoServico(memory.NovoContaRepositorio())
	r := NovoRouter(clientes, contas)

	for _, tc := range []struct {
		method, path, body string
		want               int
	}{
		{"POST", "/api/clientes", `{"id":1,"nome":"Ana","idade":25,"email":"ana@ex.com","idContaCorrente":1,"ativo":true}`, 201},
		{"GET", "/api/clientes/validacao-idade?idade=17", "", 200},
		{"POST", "/api/clientes/1/desativar", "", 200},
		{"GET", "/api/clientes/1/situacao", "", 200},
		{"POST", "/api/clientes/1/ativar", "", 200},
		{"POST", "/api/contas", `{"id":1,"saldo":100,"ativo":true}`, 201},
		{"POST", "/api/contas/1/desativar", "", 200},
		{"POST", "/api/contas/1/ativar", "", 200},
		{"GET", "/api/contas/1/situacao", "", 200},
	} {
		t.Run(tc.method+tc.path, func(t *testing.T) {
			w := httptest.NewRecorder()
			r.ServeHTTP(w, httptest.NewRequest(tc.method, tc.path, bytes.NewBufferString(tc.body)))
			if w.Code != tc.want {
				t.Fatalf("status: %d, body: %s", w.Code, w.Body.String())
			}
		})
	}
	for _, path := range []string{"/api/clientes/1", "/api/contas/1"} {
		w := httptest.NewRecorder()
		r.ServeHTTP(w, httptest.NewRequest(http.MethodDelete, path, nil))
		if w.Code != http.StatusNoContent {
			t.Fatalf("delete %s: %d", path, w.Code)
		}
	}
}

func TestTransferenciaEMapeamentoDeErros(t *testing.T) {
	clientes := clienteapp.NovoServico(memory.NovoClienteRepositorio())
	contas := contaapp.NovoServico(memory.NovoContaRepositorio())
	_, _ = contas.Cadastrar(1, 100, false)
	_, _ = contas.Cadastrar(2, 0, true)
	r := NovoRouter(clientes, contas)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/api/transferencias", bytes.NewBufferString(`{"origem":1,"destino":2,"valor":10}`)))
	if w.Code != http.StatusUnprocessableEntity {
		t.Fatalf("status: %d body: %s", w.Code, w.Body.String())
	}
	var resposta map[string]string
	if err := json.Unmarshal(w.Body.Bytes(), &resposta); err != nil || resposta["erro"] != "conta_origem_inativa" {
		t.Fatalf("resposta: %s", w.Body.String())
	}
}
