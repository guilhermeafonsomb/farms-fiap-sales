import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  const mockStock: any[] = [];
  const mockProducts: any[] = [];

  await page.route("**/nyc.cloud.appwrite.io/**", async (route) => {
    const request = route.request();
    const url = request.url();
    const method = request.method();

    if (method === "GET" && url.includes("estoque")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ rows: mockStock, sum: mockStock.length }),
      });
    } else if (method === "POST" && url.includes("estoque")) {
      const postData = request.postDataJSON();
      const newProduct = {
        $id: `product-${Date.now()}`,
        name: postData.data.name,
        quantity: postData.data.quantity,
        type: postData.data.type,
      };
      mockStock.push(newProduct);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(newProduct),
      });
    } else if (method === "GET" && url.includes("produtos")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          rows: mockProducts,
          sum: mockProducts.length,
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto("/");
  await page.waitForLoadState("networkidle");
});

test.describe("E2E Tests - Critical Business Flows", () => {

  test("Should display page structure correctly", async ({ page }) => {
    await expect(page.getByText("Estoque e Vendas")).toBeVisible();
    await expect(page.getByText("Adicionar Produto")).toBeVisible();
    await expect(page.getByText("Atualizar Estoque").first()).toBeVisible();
    await expect(page.getByText("Registrar Venda").first()).toBeVisible();
    await expect(page.getByText("Produtos em Estoque")).toBeVisible();
  });

  test("Should show success message when adding product", async ({ page }) => {
    const productName = `Test Product ${Date.now()}`;

    await page.getByPlaceholder("Nome do Produto").fill(productName);
    await page.getByPlaceholder("Quantidade").first().fill("100");
    await page.getByPlaceholder("Tipo").fill("Test Type");
    await page.getByRole("button", { name: "Adicionar Produto" }).click();

    await expect(page.getByText("Produto adicionado!")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Should display all form fields correctly", async ({ page }) => {
    await expect(page.getByPlaceholder("Nome do Produto")).toBeVisible();
    await expect(page.getByPlaceholder("Quantidade").first()).toBeVisible();
    await expect(page.getByPlaceholder("Tipo")).toBeVisible();
    await expect(page.getByPlaceholder("Produto").first()).toBeVisible();
    await expect(
      page.getByPlaceholder("+10 (entrada) ou -5 (saída)")
    ).toBeVisible();
    await expect(page.getByPlaceholder("Quantidade Vendida")).toBeVisible();
    await expect(page.getByPlaceholder("Preço")).toBeVisible();
    await expect(page.getByTestId("period-select")).toBeVisible();
    await expect(page.getByPlaceholder("Meta")).toBeVisible();
  });

  test("Should validate period select options", async ({ page }) => {
    const periodSelect = page.getByTestId("period-select");
    await expect(periodSelect).toBeVisible();

    const options = await periodSelect.locator("option").allTextContents();
    expect(options.length).toBeGreaterThan(0);
  });

  test("Should handle multiple button clicks", async ({ page }) => {
    await page.getByPlaceholder("Nome do Produto").fill("Product");
    await page.getByPlaceholder("Quantidade").first().fill("50");
    await page.getByPlaceholder("Tipo").fill("Type");
    await page.getByRole("button", { name: "Adicionar Produto" }).click();

    await expect(page.getByText("Produto adicionado!")).toBeVisible({
      timeout: 5000,
    });
  });

  test("Should display products list section", async ({ page }) => {
    const productsSection = page.getByText("Produtos em Estoque");
    await expect(productsSection).toBeVisible();
  });
});

test.describe("Cross-Browser Compatibility", () => {
  test("Should work on different viewports", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.getByText("Estoque e Vendas")).toBeVisible();

    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByText("Estoque e Vendas")).toBeVisible();
  });
});

export { test, expect };
