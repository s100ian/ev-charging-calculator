import { test, expect } from "@playwright/test";

test.describe("EV Charging Calculator", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("default state renders correctly", async ({ page }) => {
    await expect(page.locator("h1")).toHaveText("⚡EV Charging Calculator");

    const resultValues = page.locator(".result-value");
    await expect(resultValues).toHaveCount(15);
    const planningResultValues = page.locator(
      ".planning-results-section .result-value"
    );
    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(resultValues.nth(0)).toHaveText("76 %"); // SoC after charging
    await expect(resultValues.nth(1)).toHaveText("2.30 kW"); // Charging power
    await expect(resultValues.nth(2)).toHaveText("3.2 %/h"); // Charging speed %
    await expect(resultValues.nth(3)).toHaveText("12.8 km/h"); // Charging speed km
    await expect(resultValues.nth(4)).toHaveText("102 km"); // Range per session
    await expect(resultValues.nth(5)).toHaveText("400 km"); // Total range
    await expect(planningResultValues.nth(0)).toHaveText("9h 23m");
    await expect(planningResultValues.nth(2)).toHaveText("21.6 kWh");
    await expect(planningResultValues.nth(3)).toHaveText("21.6 kWh");
    await expect(planningResultValues.nth(4)).toHaveText("320 km");
    await expect(planningResultValues.nth(1)).toHaveText(/\d{2}:\d{2}/);
    await expect(costResultValues.nth(0)).toHaveText("—");
    await expect(costResultValues.nth(1)).toHaveText("—");
    await expect(costResultValues.nth(2)).toHaveText("—");
    await expect(costResultValues.nth(3)).toHaveText("—");
  });

  test("entering a tariff shows charging cost results", async ({ page }) => {
    await page.locator("#price-per-kwh-input").fill("0.25");
    await page.getByRole("button", { name: "€" }).click();

    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(costResultValues.nth(0)).toHaveText("€4.60");
    await expect(costResultValues.nth(1)).toHaveText("€5.40");
    await expect(costResultValues.nth(2)).toHaveText("€9.00");
    await expect(costResultValues.nth(3)).toHaveText("€4.50 / 100 km");
  });

  test("currency buttons update displayed charging costs", async ({ page }) => {
    await page.locator("#price-per-kwh-input").fill("0.25");
    await page.getByRole("button", { name: "$" }).click();

    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(page.getByRole("button", { name: "$" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(costResultValues.nth(0)).toHaveText("$4.60");
    await expect(costResultValues.nth(1)).toHaveText("$5.40");
    await expect(costResultValues.nth(2)).toHaveText("$9.00");
    await expect(costResultValues.nth(3)).toHaveText("$4.50 / 100 km");
  });

  test("cost to full updates from the current SoC", async ({ page }) => {
    await page.locator("#price-per-kwh-input").fill("0.25");
    await page.getByRole("button", { name: "€" }).click();
    await page.locator('[data-testid="current-soc-slider"]').fill("80");

    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(costResultValues.nth(2)).toHaveText("€3.60");
  });

  test("charging cost settings persist after reload", async ({ page }) => {
    await page.locator("#price-per-kwh-input").fill("0.25");
    await page.getByRole("button", { name: "£" }).click();

    await page.reload();

    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(page.locator("#price-per-kwh-input")).toHaveValue("0.25");
    await expect(page.getByRole("button", { name: "£" })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
    await expect(costResultValues.nth(0)).toHaveText("£4.60");
  });

  test("planner inputs update planning results", async ({ page }) => {
    await page.locator('[data-testid="target-soc-slider"]').fill("90");

    const planningResultValues = page.locator(
      ".planning-results-section .result-value"
    );

    await expect(planningResultValues.nth(0)).toHaveText("12h 31m");
    await expect(planningResultValues.nth(2)).toHaveText("28.8 kWh");
    await expect(planningResultValues.nth(3)).toHaveText("28.8 kWh");
    await expect(planningResultValues.nth(4)).toHaveText("360 km");
  });

  test("planner cost to target updates from target SoC", async ({ page }) => {
    await page.locator("#price-per-kwh-input").fill("0.25");
    await page.getByRole("button", { name: "€" }).click();
    await page.locator('[data-testid="target-soc-slider"]').fill("90");

    const costResultValues = page.locator(".cost-results-section .result-value");

    await expect(costResultValues.nth(1)).toHaveText("€7.20");
  });

  test("departure time shows readiness and planner settings persist after reload", async ({ page }) => {
    const departureTime = await page.evaluate(() => {
      const future = new Date(Date.now() + 60 * 60 * 1000);
      const hours = String(future.getHours()).padStart(2, "0");
      const minutes = String(future.getMinutes()).padStart(2, "0");

      return `${hours}:${minutes}`;
    });

    await page.locator('[data-testid="target-soc-slider"]').fill("90");
    await page.locator("#departure-time-input").fill(departureTime);

    const planningResultValues = page.locator(
      ".planning-results-section .result-value"
    );

    await expect(planningResultValues.nth(5)).toHaveText("No");
    await expect(planningResultValues.nth(6)).toHaveText(/\d+ %/);
    await expect(planningResultValues.nth(7)).toHaveText(/\d+ %/);

    await page.reload();

    await expect(page.locator('[data-testid="target-soc-slider"]')).toHaveValue(
      "90"
    );
    await expect(page.locator("#departure-time-input")).toHaveValue(departureTime);
    await expect(planningResultValues.nth(5)).toHaveText("No");
  });

  test("raw planner target persists when current SoC rises above it", async ({ page }) => {
    const currentSoCSlider = page.locator('[data-testid="current-soc-slider"]');
    const targetSoCSlider = page.locator('[data-testid="target-soc-slider"]');

    await currentSoCSlider.fill("85");
    await expect(targetSoCSlider).toHaveValue("85");

    await page.reload();

    await expect(targetSoCSlider).toHaveValue("85");

    await currentSoCSlider.fill("50");

    await expect(targetSoCSlider).toHaveValue("80");
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
    // After +0.1h: 2.3 * 8.1 = 18.629999... kWh (float) → 103.499... → 103 km
    const durationPlusButton = page
      .locator('[data-testid="duration-group"]')
      .locator("button", { hasText: "+" });
    await durationPlusButton.click();

    const rangePerSession = page.locator(".result-value").nth(4);
    await expect(rangePerSession).toHaveText("103 km");
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
