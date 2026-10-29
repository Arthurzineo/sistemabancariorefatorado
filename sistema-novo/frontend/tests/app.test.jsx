import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
import App from "../src/App.jsx";
import { server } from "./server.js";

async function abrirTransferencia() {
  const user = userEvent.setup();
  server.use(
    http.get("/api/contas", () =>
      HttpResponse.json([
        { id: 1, saldo: 100, situacao: "Ativa" },
        { id: 2, saldo: 50, situacao: "Ativa" },
      ]),
    ),
  );
  render(<App />);
  await user.click(screen.getByRole("button", { name: "Transferir" }));
  await user.selectOptions(screen.getByLabelText("Conta de origem"), "1");
  await user.selectOptions(screen.getByLabelText("Conta de destino"), "2");
  await user.type(screen.getByLabelText("Valor"), "10");
  return { user };
}

describe("Sistema Bancário", () => {
  it("navega entre clientes, contas e transferência", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByText("Ana")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Contas" }));
    expect(screen.getByRole("heading", { name: "Contas" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Clientes" }));
    expect(
      screen.getByRole("heading", { name: "Clientes" }),
    ).toBeInTheDocument();
  });

  it("mostra a mensagem devolvida pela API ao falhar transferência", async () => {
    server.use(
      http.post("/api/transferencias", () =>
        HttpResponse.json(
          {
            erro: "saldo_insuficiente",
            mensagem: "Saldo insuficiente na conta de origem.",
          },
          { status: 422 },
        ),
      ),
    );
    const { user } = await abrirTransferencia();
    await user.click(
      screen.getByRole("button", { name: "Revisar antes de transferir" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirmar transferência" }),
    );
    expect((await screen.findAllByRole("alert"))[0]).toHaveTextContent(
      "Saldo insuficiente",
    );
  });

  it.each([
    ["saldo_insuficiente", "Saldo insuficiente na conta de origem."],
    ["valor_invalido", "Valor de transferência inválido."],
    ["conta_origem_nao_encontrada", "Conta de origem não encontrada."],
    ["conta_destino_nao_encontrada", "Conta de destino não encontrada."],
    ["conta_origem_inativa", "Conta de origem inativa."],
    ["conta_destino_inativa", "Conta de destino inativa."],
  ])("exibe a mensagem de erro %s da API", async (_codigo, mensagem) => {
    server.use(
      http.post("/api/transferencias", () =>
        HttpResponse.json({ erro: _codigo, mensagem }, { status: 422 }),
      ),
    );
    const { user } = await abrirTransferencia();
    await user.click(
      screen.getByRole("button", { name: "Revisar antes de transferir" }),
    );
    await user.click(
      screen.getByRole("button", { name: "Confirmar transferência" }),
    );
    expect((await screen.findAllByRole("alert"))[0]).toHaveTextContent(
      mensagem,
    );
  });
});
