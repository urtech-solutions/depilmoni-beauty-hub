import { expect, test } from "@playwright/test";

test("homepage renderiza blocos principais e checkout fica acessivel", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Beleza profissional com calor/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Destaques com margem e desejo/i })).toBeVisible();

  await page.goto("/checkout");
  await expect(page.getByRole("heading", { name: /Frete, cupom, pagamento e XP/i })).toBeVisible();
});
