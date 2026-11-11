import { test, expect } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

test("responsive homepage, project page, and workshop captures", async ({
  page,
}) => {
  test.setTimeout(120000);
  await mkdir("screenshots", { recursive: true });
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await page
      .getByRole("heading", { name: "Sukhmeet Singh", exact: true })
      .waitFor();
    await page.waitForTimeout(1200); // Entrance choreography must finish before visual QA.
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `screenshots/homepage-${width}.png`,
      fullPage: true,
    });
    if (width === 390)
      await page.screenshot({ path: "screenshots/homepage-mobile.png" });
    if (width === 1440)
      await page.screenshot({ path: "screenshots/homepage-desktop.png" });
    await page.goto("/projects/legal-document-simplifier");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `screenshots/project-${width}.png`,
      fullPage: true,
    });
    await page.goto("/explore");
    await expect(
      page.getByRole("region", { name: /Interactive workshop/ }),
    ).toHaveAttribute("data-ready", "true");
    await expect(
      page.getByRole("button", {
        name: "Select Legal Document Simplifier station",
      }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `screenshots/workshop-${width}.png`,
      fullPage: true,
    });
    if (width === 1440) {
      await page.getByRole("button", { name: "Night mode", exact: true }).click();
      await page.screenshot({ path: "screenshots/workshop-night.png", fullPage: true });
      await page.getByRole("button", { name: "Night mode", exact: true }).click();
    }
    if (width === 390 || width === 1440) {
      await page.getByRole("button", { name: "Start Signal Run", exact: true }).click();
      await expect(page.getByLabel("Signal Run progress")).toContainText("0 / 5");
      // Capture from the page top so fixed offscreen UI stays outside the image.
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: `screenshots/workshop-signal-run-${width}.png`, fullPage: true });
      await page.getByRole("button", { name: "End Signal Run", exact: true }).click();
      for (const name of ["01 Legal Document Simplifier", "02 CodeMate-X", "03 Event Services Marketplace"]) {
        await page.getByRole("button", { name, exact: true }).click();
      }
      await expect(page.getByLabel("Passport progress")).toHaveText("3 / 3 stamps");
      await page.getByRole("button", { name: "Close project panel", exact: true }).click();
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.screenshot({ path: `screenshots/workshop-passport-${width}.png`, fullPage: true });
    }
  }
  await writeFile(
    "screenshots/runtime-errors.json",
    JSON.stringify(errors, null, 2),
  );
  expect(errors).toEqual([]);
});

test("very narrow layouts keep content and navigation in reach", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Contact" })
    .click();
  await expect(
    page.getByRole("button", { name: "Copy email address" }),
  ).toBeInViewport();
  await page.screenshot({ path: "screenshots/contact-320.png" });
});
