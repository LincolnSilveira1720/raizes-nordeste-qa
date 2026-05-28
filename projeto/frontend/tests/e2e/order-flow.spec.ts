import { expect, test } from "@playwright/test";

test("creates an approved pickup order from the UI", async ({ page }) => {
  await page.route(/.*\/api\/unidades$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: "U-01",
          nome: "Recife Centro",
          tipo: "COZINHA_COMPLETA",
          ativa: true,
        },
      ]),
    });
  });

  await page.route(/.*\/api\/unidades\/U-01\/cardapio$/, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        unidadeId: "U-01",
        unidadeNome: "Recife Centro",
        produtos: [
          {
            id: "P-01",
            nome: "Tapioca de queijo coalho",
            descricao: "Tapioca tradicional",
            preco: 12.9,
            disponivel: true,
          },
        ],
      }),
    });
  });

  await page.route(/.*\/api\/pedidos$/, async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({
        pedidoId: "PED-001",
        status: "CONFIRMADO",
        valorTotal: 12.9,
        mensagem: "Pedido confirmado para retirada.",
        unidadeId: "U-01",
      }),
    });
  });

  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Escolha a unidade/i })).toBeVisible();
  await page.getByRole("button", { name: /Recife Centro/i }).click();

  await expect(page.getByText(/Tapioca de queijo coalho/i)).toBeVisible();
  await page.getByRole("button", { name: /Adicionar/i }).click();

  await page.getByRole("button", { name: /Revisar pedido/i }).click();
  await page.getByRole("button", { name: /Confirmar pedido/i }).click();

  await expect(page.getByRole("heading", { name: /CONFIRMADO/i })).toBeVisible();
  await expect(page.getByText(/Pedido confirmado para retirada/i)).toBeVisible();
});
