import { expect, test, type Page } from "@playwright/test";

async function drive(page: Page, key: string, axis: number, target: number, sign = 1) {
  await page.keyboard.down(key);
  try {
    await expect.poll(async () => {
      const coordinates = await page.getByLabel("Rover coordinates").textContent();
      return Number(coordinates?.match(/-?\d+\.\d+/g)?.[axis]) * sign;
    }, { timeout: 12000, intervals: [70] }).toBeGreaterThanOrEqual(target * sign);
  } finally {
    await page.keyboard.up(key);
  }
}

test("drive to a clue and keep a garage reward across reloads", async ({ page }) => {
  await page.goto("/explore");
  const coral = page.getByRole("button", { name: "Coral paint", exact: true });
  await expect(coral).toBeDisabled();
  await page.getByRole("button", { name: "Visit project courtyard", exact: true }).click();
  await drive(page, "a", 0, -3.3, -1);
  await drive(page, "s", 1, 16);
  await drive(page, "a", 0, -4.4, -1);
  await expect(page.getByLabel("Treasure progress")).toHaveText("1 / 4 found");
  await coral.click();
  await page.reload();
  await expect(coral).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("button", { name: "Sunset paint", exact: true })).toBeDisabled();
});

test("mobile ferry reaches secret cove, where the bottle unlocks headlights", async ({ page }) => {
  test.setTimeout(45000);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explore");
  await page.getByRole("button", { name: "Night mode", exact: true }).click();
  await page.getByRole("button", { name: "Ferry to Secret Cove", exact: true }).click();
  await expect(page.getByRole("button", { name: "Ferry crossing…" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Drive forward" })).toHaveCount(0);
  await checkCrossingProgress(page);
  await expect(page.getByRole("button", { name: "Return to mainland" })).toBeEnabled({ timeout: 12000 });
  await expect(page.getByLabel("Rover coordinates")).toHaveText("X 44.0 / Z 4.0");
  await page.locator(".scene-container").screenshot({ path: "screenshots/secret-cove-night.png" });
  await drive(page, "d", 0, 50.5);
  await drive(page, "w", 1, -1.5, -1);
  await page.getByRole("button", { name: "Read the bottle message" }).click();
  const puzzle = page.getByRole("group", { name: /Which project puts/ });
  await puzzle.getByRole("button", { name: "Legal Document Simplifier" }).click();
  await expect(puzzle).toContainText("Try again");
  await puzzle.getByRole("button", { name: "CodeMate-X" }).click();
  await expect(page.getByText("The story in the bottle")).toBeVisible();
  const headlights = page.getByRole("button", { name: "Headlights", exact: true });
  await headlights.click();
  await expect(headlights).toHaveAttribute("aria-pressed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.getByRole("button", { name: "Return to mainland" }).click();
  await expect(page.getByLabel("Rover coordinates")).toHaveText("X 30.0 / Z 0.0");
  await expect(page.getByRole("button", { name: "Ferry to Secret Cove" })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

async function checkCrossingProgress(page: Page) {
  const coordinates = page.getByLabel("Rover coordinates");
  await expect.poll(async () => Number((await coordinates.textContent())?.match(/-?\d+\.\d+/)?.[0]))
    .toBeGreaterThan(33);
  await page.locator(".scene-container").screenshot({ path: "screenshots/secret-cove-ferry.png" });
  const visibility = (hidden: boolean) => {
    Object.defineProperty(document, "hidden", { configurable: true, value: hidden });
    document.dispatchEvent(new Event("visibilitychange"));
  };
  await page.evaluate(visibility, true);
  const paused = await coordinates.textContent();
  await page.waitForTimeout(500);
  await expect(coordinates).toHaveText(paused!);
  await page.evaluate(visibility, false);
  await expect(coordinates).not.toHaveText(paused!, { timeout: 900 });
}

test("recruiter tour supports pause, manual stops, links and driving interruption", async ({ page }) => {
  await page.goto("/explore");
  await page.getByRole("button", { name: "Recruiter tour", exact: true }).click();
  const tour = page.getByRole("region", { name: "Recruiter tour" });
  await expect(tour.getByRole("heading")).toHaveText("Legal Document Simplifier");
  await expect(page.getByRole("button", { name: "01 Legal Document Simplifier" })).toHaveAttribute("aria-pressed", "true");
  await tour.getByRole("button", { name: "Pause tour" }).click();
  await expect(tour.getByRole("button", { name: "Resume tour" })).toBeVisible();
  for (const name of ["CodeMate-X", "Event Services Marketplace", "Meet Sukhmeet Singh"]) {
    await tour.getByRole("button", { name: "Next stop" }).click();
    await expect(tour.getByRole("heading")).toHaveText(name);
    await expect(tour.getByRole("button", { name: "Resume tour" })).toBeVisible();
  }
  await expect(tour.getByRole("link", { name: "Download résumé" })).toHaveAttribute("href", "/sukhmeet-singh-resume.pdf");
  await expect(tour.getByRole("link", { name: "Email Sukhmeet" })).toHaveAttribute("href", /^mailto:/);
  await page.locator(".scene-container").focus();
  await page.keyboard.press("d");
  await expect(tour).toHaveCount(0);
});

test("recruiter tour works without a 3D renderer", async ({ page }) => {
  await page.clock.install();
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      return kind.startsWith("webgl") ? null : getContext.apply(this, [kind, ...args] as never);
    } as typeof getContext;
  });
  await page.goto("/explore");
  await expect(page.getByText("A quieter way to explore.")).toBeVisible();
  await page.getByRole("button", { name: "Recruiter tour", exact: true }).click();
  const tour = page.getByRole("region", { name: "Recruiter tour" });
  await expect(tour.getByRole("heading")).toHaveText("Legal Document Simplifier");
  await page.clock.fastForward(15100);
  await expect(tour.getByRole("heading")).toHaveText("CodeMate-X");
  await page.clock.fastForward(15100);
  await expect(tour.getByRole("heading")).toHaveText("Event Services Marketplace");
  await page.clock.fastForward(15100);
  await expect(tour.getByRole("heading")).toHaveText("Meet Sukhmeet Singh");
  await page.clock.fastForward(15100);
  await expect(tour).toContainText("TOUR COMPLETE");
});
