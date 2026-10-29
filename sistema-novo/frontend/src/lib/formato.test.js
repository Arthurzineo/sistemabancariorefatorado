import { describe, expect, it } from "vitest";
import { formatarMoeda } from "./formato.js";

describe("formatação financeira", () => {
  it("formata valores em real brasileiro", () => {
    expect(formatarMoeda(1234.5)).toBe("R$ 1.234,50");
  });
});
