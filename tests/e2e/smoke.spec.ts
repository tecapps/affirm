import { expect, test } from "@playwright/test";

test("home page renders the hero with the server-fetched ping message", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1, name: "Welcome to Affirm" })).toBeVisible();
  await expect(page.getByText("pong", { exact: true })).toBeVisible();
});

test("login form labels are associated with their own inputs", async ({ page }) => {
  await page.goto("/login");

  const emailInput = page.getByLabel("Email");
  const passwordInput = page.getByLabel("Password");

  await expect(emailInput).toHaveAttribute("type", "text");
  await expect(passwordInput).toHaveAttribute("type", "password");
  expect(await emailInput.getAttribute("id")).not.toBe(await passwordInput.getAttribute("id"));
});

test("GET /api/ping answers with pong", async ({ request }) => {
  const response = await request.get("/api/ping");

  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ error: false, message: "pong" });
});

test("POST /api/login queries the D1 database and rejects an unknown user", async ({ request }) => {
  const unknownEmail = "e2e-unknown-user@example.invalid";

  const response = await request.post("/api/login", {
    data: { email: unknownEmail, password: "not-a-real-password" },
  });

  // A broken DB binding makes useDB() throw, which surfaces as a 500 rather than this response.
  expect(response.ok()).toBe(true);
  expect(await response.json()).toEqual({ error: true, message: `${unknownEmail} failed login` });
});
