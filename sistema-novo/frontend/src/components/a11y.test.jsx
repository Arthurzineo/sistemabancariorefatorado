import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Button } from "./Button.jsx";
import { Dialog } from "./Dialog.jsx";
import { Field } from "./Field.jsx";
import { Select } from "./Select.jsx";
import { StatusChip } from "./StatusChip.jsx";
import { Toast } from "./Toast.jsx";

describe("componentes acessíveis", () => {
  it("renderiza Button, Field e Select com nomes", () => {
    render(
      <>
        <Button>Salvar</Button>
        <Field label="Nome" name="nome" />
        <Select
          label="Tipo"
          name="tipo"
          options={[{ value: "a", label: "A" }]}
        />
      </>,
    );
    expect(screen.getByRole("button", { name: "Salvar" })).toBeInTheDocument();
    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
    expect(screen.getByLabelText("Tipo")).toBeInTheDocument();
  });
  it("prende foco no Dialog e devolve ao fechar", async () => {
    const user = userEvent.setup();
    function Harness() {
      const [open, setOpen] = React.useState(false);
      return (
        <>
          <button onClick={() => setOpen(true)}>Abrir</button>
          <Dialog open={open} title="Teste" onClose={() => setOpen(false)}>
            <button onClick={() => setOpen(false)}>Fechar</button>
          </Dialog>
        </>
      );
    }
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir" }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
  it("StatusChip usa texto e Toast usa status", () => {
    render(
      <>
        <StatusChip situacao="Ativa" />
        <Toast texto="Tudo certo" />
      </>,
    );
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Tudo certo");
  });
});
import React from "react";
