import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StatusChip } from "./StatusChip.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";
import { Button } from "./Button.jsx";

describe("componentes base", () => {
  it("expõe situação com ícone e texto", () => {
    render(<StatusChip situacao="Ativa" />);
    expect(screen.getByText("Ativa")).toBeInTheDocument();
    expect(screen.getByLabelText("Ativa")).toBeInTheDocument();
  });

  it("alterna o tema", async () => {
    const user = userEvent.setup();
    render(<ThemeToggle />);
    const botao = screen.getByRole("button", { name: /tema/i });
    await user.click(botao);
    expect(document.documentElement.dataset.theme).toBe("dark");
  });

  it("expõe a variante primária com token de contraste", () => {
    render(<Button>Primário</Button>);
    const botao = screen.getByRole("button", { name: "Primário" });
    expect(botao).toHaveClass("button--primary");
    expect(botao.className).toContain("button");
  });
});
