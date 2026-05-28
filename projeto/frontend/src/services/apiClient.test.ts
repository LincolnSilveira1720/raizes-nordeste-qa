import { afterEach, describe, expect, it, vi } from "vitest";

import { apiRequest } from "./apiClient";

describe("apiRequest", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("keeps the API error payload visible to the UI", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            codigo: "PEDIDO_VAZIO",
            mensagem: "Adicione pelo menos um item para continuar.",
          }),
          { status: 400 },
        ),
      ),
    );

    await expect(apiRequest("/api/pedidos")).rejects.toMatchObject({
      problem: {
        codigo: "PEDIDO_VAZIO",
      },
      status: 400,
    });
  });
});
