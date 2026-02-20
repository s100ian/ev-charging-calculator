import { test, expect } from "@playwright/test";

test.describe("EV Charging Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("default state renders correctly", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("EV Charging Calculator");

    const resultValues = page.locator(".result-value");
    await expect(resultValues).toHaveCount(6);

    await expect(resultValues.nth(0)).toHaveText("76 %"); // SoC after charging
    await expect(resultValues.nth(1)).toHaveText("2.30 kW"); // Charging power
    await expect(resultValues.nth(2)).toHaveText("3.2 %/h"); // Charging speed %
    await expect(resultValues.nth(3)).toHaveText("12.8 km/h"); // Charging speed km
    await expect(resultValues.nth(4)).toHaveText("102 km"); // Range per session
    await expect(resultValues.nth(5)).toHaveText("400 km"); // Total range
  });

  test("slider interaction updates results", async ({ page }) => {
    const ampsSlider = page.locator('[data-testid="amps-slider"]');
    await ampsSlider.fill("16");

    // Charging power should update: (230 * 16) / 1000 = 3.68 kW
    const chargingPower = page.locator(".result-value").nth(1);
    await expect(chargingPower).toHaveText("3.68 kW");
  });

  test("button interaction updates results", async ({ page }) => {
    // Click "+" on usable battery capacity (default 72 -> 73)
    const capacityPlusButton = page
      .locator('[data-testid="usable-capacity-group"]')
      .locator("button", { hasText: "+" });
    await capacityPlusButton.click();

    // Total range should update: (73 / 18) * 100 ≈ 406 km
    const totalRange = page.locator(".result-value").nth(5);
    await expect(totalRange).toHaveText("406 km");
  });

  test("localStorage persistence", async ({ page }) => {
    // Change amps via slider
    const ampsSlider = page.locator('[data-testid="amps-slider"]');
    await ampsSlider.fill("20");

    // Verify the value took effect
    const chargingPower = page.locator(".result-value").nth(1);
    await expect(chargingPower).toHaveText("4.60 kW");

    // Reload and verify persistence
    await page.reload();
    await expect(chargingPower).toHaveText("4.60 kW");
  });

  test("theme toggle", async ({ page }) => {
    const html = page.locator("html");

    // Get initial theme
    const initialTheme = await html.getAttribute("data-theme");

    // Click theme toggle
    await page.locator(".theme-toggle").click();

    // Theme should have changed
    const newTheme = await html.getAttribute("data-theme");
    expect(newTheme).not.toBe(initialTheme);
  });
});
