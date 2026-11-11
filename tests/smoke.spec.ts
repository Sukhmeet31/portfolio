import { test, expect } from "@playwright/test";

test("portfolio routes, project discovery and resume work", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Sukhmeet Singh", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "View my work" }).click();
  await expect(page.locator("#work")).toBeInViewport();
  for (const [slug, name] of [
    ["legal-document-simplifier", "Legal Document Simplifier"],
    ["codemate-x", "CodeMate-X"],
    ["event-services-marketplace", "Event Services Marketplace"],
  ]) {
    await page.goto(`/projects/${slug}`);
    await expect(
      page.getByRole("heading", { name, exact: true }),
    ).toBeVisible();
  }
  expect((await request.get("/sukhmeet-singh-resume.pdf")).status()).toBe(200);
  await page.goto("/not-a-project");
  await expect(
    page.getByRole("heading", { name: /Off the map/ }),
  ).toBeVisible();
});

test("mobile menu closes on navigation and restores focus on Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Open menu" });
  await menu.click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();
  await menu.click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About" })
    .click();
  await expect(page.locator("#about")).toBeInViewport();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});

test("copy email reports actual clipboard success", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toContainText("Email copied");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    "31sukhmeet@gmail.com",
  );
});

test("workshop HTML controls remain useful without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      type: string,
      ...args: unknown[]
    ) {
      if (type.startsWith("webgl")) return null;
      return original.apply(this, [type, ...args] as never);
    } as typeof original;
  });
  await page.goto("/explore");
  await expect(page.getByText("A quieter way to explore.")).toBeVisible();
  await expect(page.getByRole("button", { name: "Start coastal lap", exact: true })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Visit bowling lane", exact: true })).toBeDisabled();
  await page
    .getByRole("button", { name: "01 Legal Document Simplifier" })
    .click();
  const panel = page.getByRole("region", { name: "Selected project" });
  await expect(
    panel.getByRole("heading", { name: "Legal Document Simplifier" }),
  ).toBeVisible();
  await panel.getByRole("link", { name: "Read case study" }).click();
  await expect(page).toHaveURL(/projects\/legal-document-simplifier/);
});

test("reduced motion leaves essential content visible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Sukhmeet Singh", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Enter the workshop", exact: true }),
  ).toBeVisible();
});

test("rover moves only with scene focus, resets, and scene stations open accessible panels", async ({
  page,
}) => {
  await page.goto("/explore");
  const scene = page.getByRole("region", { name: /Interactive workshop/ });
  const coordinates = page.getByLabel("Rover coordinates");
  await expect(scene).toHaveAttribute("data-ready", "true");
  await scene.focus();
  await page.keyboard.down("ArrowLeft");
  await expect(coordinates).not.toHaveText("X 0.0 / Z 2.8");
  await page.keyboard.up("ArrowLeft");
  await page.getByRole("button", { name: "Zoom in", exact: true }).focus();
  const stopped = await coordinates.textContent();
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(300);
  await page.keyboard.up("ArrowRight");
  await expect(coordinates).toHaveText(stopped!);
  await page.getByRole("button", { name: "Reset rover", exact: true }).click();
  await expect(coordinates).toHaveText("X 0.0 / Z 2.8");
  const station = page.getByRole("button", {
    name: "Select CodeMate-X station",
    exact: true,
  });
  await station.click();
  const heading = page
    .getByRole("region", { name: "Selected project" })
    .getByRole("heading", { name: "CodeMate-X" });
  await expect(heading).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("region", { name: "Selected project" }),
  ).toHaveCount(0);
  await expect(station).toBeFocused();
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect(page).toHaveURL("/");
});

test("context loss switches to the static project experience", async ({
  page,
}) => {
  await page.goto("/explore");
  await expect(
    page.getByRole("region", { name: /Interactive workshop/ }),
  ).toHaveAttribute("data-ready", "true");
  await page
    .locator("canvas")
    .evaluate((canvas) =>
      canvas.dispatchEvent(new Event("webglcontextlost", { cancelable: true })),
    );
  await expect(page.getByText("A quieter way to explore.")).toBeVisible();
  await page
    .getByRole("button", { name: "03 Event Services Marketplace" })
    .click();
  await expect(
    page
      .getByRole("region", { name: "Selected project" })
      .getByRole("link", { name: "Read case study" }),
  ).toHaveAttribute("href", "/projects/event-services-marketplace");
});

test("clipboard denial gives useful feedback without claiming success", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: async () => {
          throw new Error("Permission denied");
        },
      },
    }),
  );
  await page.goto("/#contact");
  await page.getByRole("button", { name: "Copy email address" }).click();
  await expect(page.getByRole("status")).toContainText("Copy unavailable");
  await expect(
    page.getByRole("link", { name: "31sukhmeet@gmail.com", exact: true }),
  ).toHaveAttribute("href", "mailto:31sukhmeet@gmail.com");
});

test("rover resumes when one opposing direction is released", async ({
  page,
}) => {
  await page.goto("/explore");
  const scene = page.getByRole("region", { name: /Interactive workshop/ });
  const coordinates = page.getByLabel("Rover coordinates");
  await expect(scene).toHaveAttribute("data-ready", "true");
  await scene.focus();
  await page.keyboard.down("a");
  await page.keyboard.down("d");
  await page.waitForTimeout(300);
  const cancelled = await coordinates.textContent();
  await page.keyboard.up("d");
  await expect(coordinates).not.toHaveText(cancelled!);
  await page.keyboard.up("a");
});

test("mobile navigation can scroll to its last item on short screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 667, height: 375 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await menu.getByRole("link", { name: "Résumé" }).scrollIntoViewIfNeeded();
  await expect(menu.getByRole("link", { name: "Résumé" })).toBeInViewport();
});

test("repeated explicit selection does not steal focus on later proximity", async ({
  page,
}) => {
  await page.goto("/explore");
  const scene = page.getByRole("region", { name: /Interactive workshop/ });
  await expect(scene).toHaveAttribute("data-ready", "true");
  const first = page.getByRole("button", {
    name: "01 Legal Document Simplifier",
  });
  await first.click();
  await first.click();
  await scene.focus();
  await page.keyboard.down("w");
  await expect(
    page
      .getByRole("region", { name: "Selected project" })
      .getByRole("heading", { name: "CodeMate-X" }),
  ).toBeVisible();
  await expect(scene).toBeFocused();
  await page.keyboard.up("w");
});

test("workshop mounts and exits without runtime console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/explore");
  await expect(
    page.getByRole("button", { name: "Select CodeMate-X station" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Sukhmeet Singh", exact: true }),
  ).toBeVisible();
  expect(errors).toEqual([]);
});
