import { test, expect } from "@playwright/test";

test("workshop toys complete, repeat and expose their actual state", async ({
  page,
}) => {
  await page.goto("/explore");
  await expect(
    page.getByRole("region", { name: /Interactive workshop/ }),
  ).toHaveAttribute("data-ready", "true");
  const launch = page.getByRole("button", {
    name: "Launch paper plane",
    exact: true,
  });
  await launch.click();
  await expect(launch).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("in flight");
  await expect(launch).toBeEnabled({ timeout: 10000 });
  await expect(page.getByRole("status")).toContainText("landed");
  await launch.click();
  await expect(launch).toBeDisabled();
  await page
    .getByRole("button", { name: "Spin sculpture", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Spin sculpture", exact: true }),
  ).toBeEnabled({ timeout: 10000 });
  await expect(launch).toBeEnabled({ timeout: 10000 });
  const paint = page.getByRole("button", {
    name: "Repaint rover",
    exact: true,
  });
  const beforePaint = await page.locator("canvas").screenshot();
  await paint.click();
  await expect(paint).toContainText("Sage");
  await expect
    .poll(async () =>
      (await page.locator("canvas").screenshot()).equals(beforePaint),
    )
    .toBe(false);
  await paint.click();
  await expect(paint).toContainText("Ink");
  await paint.click();
  await expect(paint).toContainText("Cobalt");
});

test("map controls work on mobile and reduced-motion toys finish immediately", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/explore");
  await expect(
    page.getByRole("region", { name: /Interactive workshop/ }),
  ).toHaveAttribute("data-ready", "true");
  const dusk = page.getByRole("button", { name: "Night mode", exact: true });
  const sceneBounds = await page
    .getByRole("region", { name: /Interactive workshop/ })
    .boundingBox();
  const canvasBounds = await page.locator("canvas").boundingBox();
  expect(canvasBounds!.height).toBeGreaterThan(sceneBounds!.height * 0.95);
  const daylight = await page.locator("canvas").screenshot();
  await dusk.click();
  await expect(dusk).toHaveAttribute("aria-pressed", "true");
  await expect
    .poll(async () =>
      (await page.locator("canvas").screenshot()).equals(daylight),
    )
    .toBe(false);
  const follow = page.getByRole("button", {
    name: "Follow rover",
    exact: true,
  });
  await expect(follow).toHaveAttribute("aria-pressed", "true");
  const station = page.getByRole("button", { name: "Select CodeMate-X station", exact: true });
  const before = await station.boundingBox();
  await page.getByRole("region", { name: /Interactive workshop/ }).focus();
  await page.keyboard.down("d");
  try {
    await expect.poll(async () => Number((await page.getByLabel("Rover coordinates").textContent())!.match(/-?\d+\.\d+/)![0])).toBeGreaterThan(1);
  } finally { await page.keyboard.up("d"); }
  // A fixed landmark moves across the screen as the camera tracks the car.
  await expect.poll(async () => (await station.boundingBox())!.x).toBeLessThan(before!.x - 8);
  await page.getByRole("button", { name: "Reset camera", exact: true }).click();
  await expect(follow).toHaveAttribute("aria-pressed", "false");
  await follow.click();
  await expect(follow).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("img", { name: /Workshop map/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Launch paper plane", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("landed", {
    timeout: 1500,
  });
  await page
    .getByRole("button", { name: "Spin sculpture", exact: true })
    .click();
  await expect(page.getByRole("status")).toContainText("new angle", {
    timeout: 1500,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
