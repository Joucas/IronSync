import { expect, test } from "@playwright/test";

// Runs unchanged in mock mode and against the real API.
test("home shows the API health", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "IronSync" })).toBeVisible();
  await expect(page.getByText("ok", { exact: true })).toBeVisible();
  await expect(page.getByText("up", { exact: true })).toBeVisible();
});
