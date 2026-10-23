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
        <Transferencia onTransferir={() => {}} />
      </>,
    );
    expect(screen.getByLabelText("Saldo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Ativar conta" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Transferir" }),
    ).toBeInTheDocument();
  });

  it("dispara ativar, desativar e remover conta", async () => {
    const user = userEvent.setup();
    const acao = vi.fn();
    render(
      <ListaContas
        contas={[{ id: 1, saldo: 100, situacao: "Ativa" }]}
        onAcao={acao}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Ativar conta" }));
    await user.click(screen.getByRole("button", { name: "Desativar conta" }));
    await user.click(screen.getByRole("button", { name: "Remover conta" }));
    expect(acao).toHaveBeenNthCalledWith(1, 1, "ativar");
    expect(acao).toHaveBeenNthCalledWith(2, 1, "desativar");
    expect(acao).toHaveBeenNthCalledWith(3, 1, "remover");
  });

  it("carrega a lista e executa ações da conta", async () => {
    const user = userEvent.setup();
    render(<Contas />);
    expect(await screen.findByText(/Conta 1: 100/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Ativar conta" }));
    expect(await screen.findByRole("status")).toHaveTextContent("Operação concluída");
    await user.click(screen.getByRole("button", { name: "Desativar conta" }));
    await user.click(screen.getByRole("button", { name: "Ver situação da conta" }));
    await user.click(screen.getByRole("button", { name: "Remover conta" }));
  });

  it("cadastra conta e envia id e saldo numéricos", async () => { let corpo; server.use(http.post("/api/contas",async({request})=>{corpo=await request.json();return HttpResponse.json({...corpo,situacao:"Ativa"},{status:201})})); render(<Contas/>); const user=userEvent.setup(); const f=screen.getByRole("heading",{name:"Cadastrar conta"}).closest("form"); await user.type(within(f).getByLabelText("ID da conta"),"2"); await user.type(within(f).getByLabelText("Saldo"),"50"); await user.click(within(f).getByRole("button",{name:"Cadastrar conta"})); expect(await screen.findByRole("status")).toHaveTextContent("Conta cadastrada"); expect(corpo).toMatchObject({id:2,saldo:50}) });
  it("mostra id_duplicado ao cadastrar conta repetida", async () => { server.use(http.post("/api/contas",()=>HttpResponse.json({erro:"id_duplicado",mensagem:"id_duplicado"},{status:409}))); render(<Contas/>); const user=userEvent.setup(); const f=screen.getByRole("heading",{name:"Cadastrar conta"}).closest("form"); await user.type(within(f).getByLabelText("ID da conta"),"1"); await user.type(within(f).getByLabelText("Saldo"),"20"); await user.click(within(f).getByRole("button",{name:"Cadastrar conta"})); expect(await screen.findByRole("alert")).toHaveTextContent("id_duplicado") });
  it("consulta conta e exibe saldo e situação", async () => { server.use(http.get("/api/contas/2",()=>HttpResponse.json({id:2,saldo:55,situacao:"Ativa"}))); render(<Contas/>); const user=userEvent.setup(); const f=screen.getByRole("heading",{name:"Consultar conta"}).closest("form"); await user.type(within(f).getByLabelText("ID para consulta"),"2"); await user.click(within(f).getByRole("button",{name:"Consultar conta"})); expect(await screen.findByRole("status")).toHaveTextContent("Conta 2: 55 — Ativa") });
  it("mostra conta_nao_encontrada ao consultar id inexistente", async () => { server.use(http.get("/api/contas/99",()=>HttpResponse.json({erro:"conta_nao_encontrada",mensagem:"conta_nao_encontrada"},{status:404}))); render(<Contas/>); const user=userEvent.setup(); const f=screen.getByRole("heading",{name:"Consultar conta"}).closest("form"); await user.type(within(f).getByLabelText("ID para consulta"),"99"); await user.click(within(f).getByRole("button",{name:"Consultar conta"})); expect(await screen.findByRole("alert")).toHaveTextContent("conta_nao_encontrada") });
  it("transfere com sucesso, envia origem/destino/valor numéricos e atualiza os saldos", async () => { let corpo; server.use(http.post("/api/transferencias",async({request})=>{corpo=await request.json();return HttpResponse.json({origem:{id:1,saldo:60,situacao:"Ativa"},destino:{id:2,saldo:40,situacao:"Ativa"}})}),http.get("/api/contas",()=>HttpResponse.json([{id:1,saldo:60,situacao:"Ativa"},{id:2,saldo:40,situacao:"Ativa"}]))); render(<Contas/>); const user=userEvent.setup(); const f=screen.getByRole("heading",{name:"Transferir valores"}).closest("form"); await user.type(within(f).getByLabelText("Conta de origem"),"1"); await user.type(within(f).getByLabelText("Conta de destino"),"2"); await user.type(within(f).getByLabelText("Valor"),"40"); await user.click(within(f).getByRole("button",{name:"Transferir"})); expect(await screen.findByRole("status")).toHaveTextContent("Transferência realizada"); expect(corpo).toMatchObject({origem:1,destino:2,valor:40}); expect(await screen.findByText(/Conta 2: 40/)).toBeInTheDocument() });
});
