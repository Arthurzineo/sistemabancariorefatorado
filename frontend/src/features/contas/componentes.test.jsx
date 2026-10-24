import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "../../../tests/server.js";
import CadastroConta from "./CadastroConta.jsx";
import ConsultaConta from "./ConsultaConta.jsx";
import ListaContas from "./ListaContas.jsx";
import Transferencia from "./Transferencia.jsx";
import Contas from "./Contas.jsx";

describe("componentes de contas", () => {
  it("oferece formulários e ações acessíveis", () => {
    render(
      <>
        <CadastroConta onCadastrar={() => {}} />
        <ConsultaConta onConsultar={() => {}} />
        <ListaContas
          contas={[{ id: 1, saldo: 100, situacao: "Ativa" }]}
          onAcao={() => {}}
        />
        <Transferencia contas={[]} onTransferir={() => {}} />
      </>,
    );
    expect(screen.getByLabelText("Saldo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Desativar" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Revisar antes de transferir" }),
    ).toBeInTheDocument();
  });

  it("usa somente a ação aplicável para ativar ou desativar", async () => {
    const user = userEvent.setup();
    const acao = vi.fn();
    render(
      <ListaContas
        contas={[
          { id: 1, saldo: 100, situacao: "Ativa" },
          { id: 2, saldo: 20, situacao: "Inativa" },
        ]}
        onAcao={acao}
      />,
    );
    expect(
      screen.getByRole("button", { name: "Desativar" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ativar" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Desativar" }));
    expect(acao).toHaveBeenCalledWith(1, "desativar");
  });

  it("carrega a lista e executa ação da conta", async () => {
    const user = userEvent.setup();
    render(<Contas />);
    expect(await screen.findByText("Conta 1")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Desativar" }));
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Operação concluída",
    );
  });

  it("cadastra conta e envia id e saldo numéricos", async () => {
    let corpo;
    server.use(
      http.post("/api/contas", async ({ request }) => {
        corpo = await request.json();
        return HttpResponse.json(
          { ...corpo, situacao: "Ativa" },
          { status: 201 },
        );
      }),
    );
    render(<Contas />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nova conta" }));
    const f = screen
      .getByRole("heading", { name: "Cadastrar conta" })
      .closest("form");
    await user.type(within(f).getByLabelText("ID da conta"), "2");
    await user.type(within(f).getByLabelText("Saldo"), "50");
    await user.click(
      within(f).getByRole("button", { name: "Cadastrar conta" }),
    );
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Conta cadastrada",
    );
    expect(corpo).toMatchObject({ id: 2, saldo: 50 });
  });

  it("mostra id_duplicado ao cadastrar conta repetida", async () => {
    server.use(
      http.post("/api/contas", () =>
        HttpResponse.json(
          { erro: "id_duplicado", mensagem: "id_duplicado" },
          { status: 409 },
        ),
      ),
    );
    render(<Contas />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Nova conta" }));
    const f = screen
      .getByRole("heading", { name: "Cadastrar conta" })
      .closest("form");
    await user.type(within(f).getByLabelText("ID da conta"), "1");
    await user.type(within(f).getByLabelText("Saldo"), "20");
    await user.click(
      within(f).getByRole("button", { name: "Cadastrar conta" }),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent("id_duplicado");
  });

  it("consulta conta e exibe saldo e situação", async () => {
    server.use(
      http.get("/api/contas/2", () =>
        HttpResponse.json({ id: 2, saldo: 55, situacao: "Ativa" }),
      ),
    );
    render(<ConsultaConta onConsultar={async () => {}} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("ID para consulta"), "2");
    await user.click(screen.getByRole("button", { name: "Consultar conta" }));
    expect(
      screen.getByRole("button", { name: "Consultar conta" }),
    ).toBeInTheDocument();
  });

  it("mostra conta_nao_encontrada ao consultar id inexistente", async () => {
    const consultar = vi.fn();
    render(<ConsultaConta onConsultar={consultar} />);
    const user = userEvent.setup();
    await user.type(screen.getByLabelText("ID para consulta"), "99");
    await user.click(screen.getByRole("button", { name: "Consultar conta" }));
    expect(consultar).toHaveBeenCalledWith("99");
  });

  it("transfere em formulário, revisão e recibo", async () => {
    server.use(
      http.post("/api/transferencias", () =>
        HttpResponse.json({ origem: { saldo: 60 }, destino: { saldo: 40 } }),
      ),
    );
    render(
      <Transferencia
        contas={[
          { id: 1, saldo: 100 },
          { id: 2, saldo: 0 },
        ]}
        onTransferir={vi.fn(async () => ({
          origem: { saldo: 60 },
          destino: { saldo: 40 },
        }))}
      />,
    );
    const user = userEvent.setup();
    await user.selectOptions(screen.getByLabelText("Conta de origem"), "1");
    await user.selectOptions(screen.getByLabelText("Conta de destino"), "2");
    await user.type(screen.getByLabelText("Valor"), "40");
    await user.click(
      screen.getByRole("button", { name: "Revisar antes de transferir" }),
    );
    expect(screen.getByText("Passo 2 de 3")).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Confirmar transferência" }),
    );
    expect(await screen.findByText("Passo 3 de 3")).toBeInTheDocument();
  });
});
