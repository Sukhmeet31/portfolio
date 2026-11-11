import { test, expect, type Page } from "@playwright/test";

async function driveTo(page: Page, key: string, axis: number, target: number, sign: number) {
  await page.keyboard.down(key);
  try {
    await expect.poll(async () => {
      const text = await page.getByLabel("Rover coordinates").textContent();
      return Number(text!.match(/-?\d+\.\d+/g)![axis]) * sign;
    }, { timeout: 12000, intervals: [60] }).toBeGreaterThanOrEqual(target * sign);
  } finally { await page.keyboard.up(key); }
}

test("coastal circuit completes a real driven lap and restarts", async ({ page }) => {
  test.setTimeout(60000);
  await page.goto("/explore");
  await page.getByRole("button", { name: "Start coastal lap", exact: true }).click();
  const progress = page.getByLabel("Race progress");
  await expect(progress).toContainText("0 / 6");
  await driveTo(page, "a", 0, -27, -1);
  await driveTo(page, "w", 1, 8, -1);
  await expect(progress).toContainText("1 / 6");
  await driveTo(page, "w", 1, -17, -1);
  await driveTo(page, "d", 0, -15, 1);
  await driveTo(page, "s", 1, 13, 1);
  await driveTo(page, "a", 0, -21, -1);
  await expect(progress).toContainText("Lap complete");
  await page.getByRole("button", { name: "Restart coastal lap", exact: true }).click();
  await expect(progress).toContainText("0 / 6");
  await driveTo(page, "w", 1, 8, -1);
  await expect(progress).toContainText("Off track");
});

test("bowling is driven by rover collisions and can be re-racked", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("button", { name: "Visit bowling lane", exact: true }).click();
  await page.keyboard.down("w");
  try { await expect(page.getByLabel("Bowling score")).not.toHaveText("0 / 10 pins", { timeout: 8000 }); }
  finally { await page.keyboard.up("w"); }
  await page.getByRole("button", { name: "Reset bowling pins", exact: true }).click();
  await expect(page.getByLabel("Bowling score")).toHaveText("0 / 10 pins");
});

test("coast, night mode and free driving controls work on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explore");
  await page.getByRole("button", { name: "Visit ocean pier", exact: true }).click();
  await expect(page.getByLabel("Rover coordinates")).toHaveText("X 22.0 / Z 21.0");
  await expect(page.getByRole("button", { name: "Drive forward", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Make waves", exact: true }).click();
  await expect(page.getByLabel("Coast feedback")).toContainText("wave");
  await page.getByRole("button", { name: "Night mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-workshop-night", "true");
  await expect(page.getByRole("region", { name: /Interactive workshop/ })).toHaveAttribute("data-lighting", "night");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Back to portfolio", exact: true }).click();
  await expect(page.locator("html")).not.toHaveAttribute("data-workshop-night", "true");
});

test("quick travel cancels a lap and releases held movement without hitting pins", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("button", { name: "Start coastal lap", exact: true }).click();
  await page.keyboard.down("a");
  await expect(page.getByLabel("Rover coordinates")).not.toHaveText("X -21.0 / Z 13.0");
  await page.getByRole("button", { name: "Visit bowling lane", exact: true }).click();
  await page.keyboard.up("a");
  await expect(page.getByLabel("Rover coordinates")).toHaveText("X 21.0 / Z 3.0");
  await expect(page.getByLabel("Race progress")).toHaveText("Your starting grid is ready.");
  await page.waitForTimeout(400);
  await expect(page.getByLabel("Rover coordinates")).toHaveText("X 21.0 / Z 3.0");
  await expect(page.getByLabel("Bowling score")).toHaveText("0 / 10 pins");
});

test("race time pauses while hidden and resumes without counting the absence", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explore");
  await page.getByRole("button", { name: "Start coastal lap", exact: true }).click();
  const progress = page.getByLabel("Race progress");
  await expect(progress).toContainText(/0 \/ 6 gates · [1-9]/);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const paused = await progress.textContent();
  await page.waitForTimeout(800);
  await expect(progress).toHaveText(paused!);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const before = Number(paused!.match(/([\d.]+)s/)![1]);
  await expect(progress).not.toHaveText(paused!);
  const after = Number((await progress.textContent())!.match(/([\d.]+)s/)![1]);
  expect(after - before).toBeLessThan(0.6);
});

test("a slow renderer does not shorten the visible lap time", async ({ page }) => {
  await page.addInitScript(() => {
    window.requestAnimationFrame = (callback) => window.setTimeout(() => callback(performance.now()), 100);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explore");
  await page.getByRole("button", { name: "Start coastal lap", exact: true }).click();
  const started = await page.evaluate(() => performance.now());
  await page.waitForTimeout(1800);
  const real = await page.evaluate((start) => (performance.now() - start) / 1000, started);
  const elapsed = Number((await page.getByLabel("Race progress").textContent())!.match(/([\d.]+)s/)![1]);
  expect(elapsed).toBeGreaterThan(real * 0.75);
  expect(elapsed).toBeLessThan(real + 0.5);
});
