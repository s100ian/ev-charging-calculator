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

  test("theme toggle persists after reload", async ({ page }) => {
    await page.locator(".theme-toggle").click();
    const themeAfterToggle = await page.locator("html").getAttribute("data-theme");

    await page.reload();

    const themeAfterReload = await page.locator("html").getAttribute("data-theme");
    expect(themeAfterReload).toBe(themeAfterToggle);
  });

  test("current SoC slider change causes SoC to reach 100%", async ({ page }) => {
    // 80% SoC + 8h at 2.3 kW on 72 kWh battery crosses the cap
    const socSlider = page.locator('[data-testid="current-soc-slider"]');
    await socSlider.fill("80");

    const socResult = page.locator(".result-value").nth(0);
    await expect(socResult).toHaveText("100 %");
  });

  test("consumption slider change updates total range", async ({ page }) => {
    // totalRange = (72 / 20) * 100 = 360 km
    const consumptionSlider = page.locator('[data-testid="consumption-slider"]');
    await consumptionSlider.fill("20");

    const totalRange = page.locator(".result-value").nth(5);
    await expect(totalRange).toHaveText("360 km");
  });

  test("volts slider change updates charging power", async ({ page }) => {
    // chargingPower = (110 * 10) / 1000 = 1.10 kW
    const voltsSlider = page.locator('[data-testid="volts-slider"]');
    await voltsSlider.fill("110");

    const chargingPower = page.locator(".result-value").nth(1);
    await expect(chargingPower).toHaveText("1.10 kW");
  });

  test("duration + button increases range per session", async ({ page }) => {
    // Default: 8h * 2.3 kW = 18.4 kWh → 102 km
    // After +0.1h: 8.1h * 2.3 kW = 18.63 kWh → 103.5 → 104 km
    const durationPlusButton = page
      .locator('[data-testid="duration-group"]')
      .locator("button", { hasText: "+" });
    await durationPlusButton.click();

    const rangePerSession = page.locator(".result-value").nth(4);
    await expect(rangePerSession).toHaveText("104 km");
  });

  test("capacity - button decreases total range", async ({ page }) => {
    // Default: 400 km; after decrement: (71 / 18) * 100 ≈ 394 km
    const capacityMinusButton = page
      .locator('[data-testid="usable-capacity-group"]')
      .locator("button", { hasText: "-" });
    await capacityMinusButton.click();

    const totalRange = page.locator(".result-value").nth(5);
    await expect(totalRange).toHaveText("394 km");
  });

  test("label value updates when slider changes", async ({ page }) => {
    const ampsSlider = page.locator('[data-testid="amps-slider"]');
    await ampsSlider.fill("20");

    const ampsGroup = page.locator('[data-testid="amps-group"]');
    await expect(ampsGroup).toContainText("20");
  });
});
