package http

import (
	"bytes"
	"encoding/json"
	"errors"
	"github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/adapters/memory"
	clienteapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/cliente"
	contaapp "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/application/conta"
	clientedomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/cliente"
	contadomain "github.com/Arthurzineo/sistemabancariorefatorado/backend/internal/domain/conta"
	"net/http"
	"net/http/httptest"
	"strings"
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
	for _, path := range []string{"/api/clientes", "/api/clientes/1", "/api/contas", "/api/contas/1"} {
		w := httptest.NewRecorder()
		r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, path, nil))
		if w.Code != http.StatusOK {
			t.Fatalf("get %s: %d", path, w.Code)
		}
	}
	for _, path := range []string{"/api/clientes/1", "/api/contas/1"} {
		w := httptest.NewRecorder()
		r.ServeHTTP(w, httptest.NewRequest(http.MethodDelete, path, nil))
		if w.Code != http.StatusNoContent {
			t.Fatalf("delete %s: %d", path, w.Code)
		}
	}
}

func TestMapearTodosOsErrosDoDominio(t *testing.T) {
	for _, tc := range []struct {
		erro   error
		codigo string
		status int
	}{
		{clienteapp.ErrClienteNaoEncontrado, "cliente_nao_encontrado", 404}, {contaapp.ErrContaNaoEncontrada, "conta_nao_encontrada", 404},
		{contadomain.ErrContaOrigemNaoEncontrada, "conta_origem_nao_encontrada", 404}, {contadomain.ErrContaDestinoNaoEncontrada, "conta_destino_nao_encontrada", 404},
		{clienteapp.ErrIDDuplicado, "id_duplicado", 409}, {contaapp.ErrIDDuplicado, "id_duplicado", 409}, {clientedomain.ErrIdadeNaoPermitida, "idade_nao_permitida", 422},
		{contadomain.ErrSaldoNaoFinito, "saldo_nao_finito", 422}, {contadomain.ErrValorInvalido, "valor_invalido", 422}, {contadomain.ErrSaldoInsuficiente, "saldo_insuficiente", 422},
		{contadomain.ErrCreditoNaoFinito, "credito_nao_finito", 422}, {contadomain.ErrContaOrigemInativa, "conta_origem_inativa", 422}, {contadomain.ErrContaDestinoInativa, "conta_destino_inativa", 422},
	} {
		w := httptest.NewRecorder()
		mapearErro(w, errors.Join(tc.erro))
		var body map[string]string
		_ = json.Unmarshal(w.Body.Bytes(), &body)
		if w.Code != tc.status || body["erro"] != tc.codigo {
			t.Fatalf("%v: status=%d codigo=%q", tc.erro, w.Code, body["erro"])
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

func TestRouterRecusaIDsNaoPositivosECorpoGrande(t *testing.T) {
	clientes := clienteapp.NovoServico(memory.NovoClienteRepositorio())
	contas := contaapp.NovoServico(memory.NovoContaRepositorio())
	r := NovoRouter(clientes, contas)
	for _, path := range []string{"/api/clientes/0", "/api/clientes/-1", "/api/contas/0"} {
		w := httptest.NewRecorder()
		r.ServeHTTP(w, httptest.NewRequest(http.MethodGet, path, nil))
		if w.Code != http.StatusBadRequest {
			t.Fatalf("%s: status %d", path, w.Code)
		}
	}
	body := bytes.NewBufferString(`{"id":1,"nome":"` + strings.Repeat("a", 2<<20) + `","idade":25,"email":"a@b.com","idContaCorrente":1,"ativo":true}`)
	w := httptest.NewRecorder()
	r.ServeHTTP(w, httptest.NewRequest(http.MethodPost, "/api/clientes", body))
	if w.Code != http.StatusBadRequest {
		t.Fatalf("corpo grande: status %d", w.Code)
	}
}
