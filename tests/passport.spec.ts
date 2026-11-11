import { test, expect } from "@playwright/test";

test("passport collects unique station stamps and remembers a complete visit", async ({ page }) => {
  await page.goto("/explore");
  const progress = page.getByLabel("Passport progress");
  await expect(progress).toHaveText("0 / 3 stamps");
  await page.getByRole("button", { name: "Select Legal Document Simplifier station", exact: true }).click();
  await expect(progress).toHaveText("1 / 3 stamps");
  await page.getByRole("button", { name: "01 Legal Document Simplifier", exact: true }).click();
  await expect(progress).toHaveText("1 / 3 stamps");
  await page.getByRole("link", { name: "Read case study", exact: true }).click();
  await page.getByRole("link", { name: "Find it in the workshop", exact: true }).click();
  await expect(progress).toHaveText("1 / 3 stamps");
  await page.getByRole("button", { name: "02 CodeMate-X", exact: true }).click();
  await page.getByRole("button", { name: "03 Event Services Marketplace", exact: true }).click();
  await expect(progress).toHaveText("3 / 3 stamps");
  await expect(page.getByText("Every station, a story. Passport complete.")).toBeVisible();
  await page.getByRole("button", { name: "Reset rover", exact: true }).click();
  await expect(progress).toHaveText("3 / 3 stamps");
  await page.reload();
  await expect(progress).toHaveText("3 / 3 stamps");
});

test("driving close to a station collects its stamp without taking focus", async ({ page }) => {
  await page.goto("/explore");
  const scene = page.getByRole("region", { name: /Interactive workshop/ });
  await expect(scene).toHaveAttribute("data-ready", "true");
  await scene.focus();
  await page.keyboard.down("w");
  try {
    await expect(page.getByLabel("Passport progress")).toHaveText("1 / 3 stamps", { timeout: 10000 });
  } finally {
    await page.keyboard.up("w");
  }
  await expect(page.getByRole("img", { name: "CodeMate-X: stamp collected", exact: true })).toBeVisible();
  await expect(scene).toBeFocused();
});

for (const [stored, count] of [["{broken", 0], ['["fake","codemate-x","codemate-x",7]', 1]] as const) {
  test(`passport tolerates stored value ${stored}`, async ({ page }) => {
    await page.addInitScript((value) => localStorage.setItem("workshop-passport-v1", value), stored);
    await page.goto("/explore");
    await expect(page.getByLabel("Passport progress")).toHaveText(`${count} / 3 stamps`);
    await page.getByRole("button", { name: "01 Legal Document Simplifier", exact: true }).click();
    await expect(page.getByLabel("Passport progress")).toHaveText(`${count + 1} / 3 stamps`);
  });
}

test("passport still collects when storage and WebGL are unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException("Denied", "SecurityError"); };
    Storage.prototype.setItem = () => { throw new DOMException("Denied", "SecurityError"); };
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      return type.startsWith("webgl") ? null : getContext.apply(this, [type, ...args] as never);
    } as typeof getContext;
  });
  await page.goto("/explore");
  await expect(page.getByText("A quieter way to explore.")).toBeVisible();
  await page.getByRole("button", { name: "01 Legal Document Simplifier", exact: true }).click();
  await expect(page.getByLabel("Passport progress")).toHaveText("1 / 3 stamps");
  await page.getByRole("button", { name: "02 CodeMate-X", exact: true }).click();
  await expect(page.getByLabel("Passport progress")).toHaveText("2 / 3 stamps");
});

test("blocked autoplay starts on exploration and a manual pause stays paused", async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    window.AudioContext = class extends Original {
      resume() {
        return navigator.userActivation.isActive ? super.resume() : new Promise<void>(() => {});
      }
    };
  });
  await page.goto("/explore");
  await expect(page.getByRole("slider", { name: "Music volume" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Pause workshop music", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "01 Legal Document Simplifier", exact: true }).click();
  await expect(page.getByText("Soft Circuit · playing in the background")).toBeVisible();
  await page.getByRole("button", { name: "Pause workshop music", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play workshop music", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "02 CodeMate-X", exact: true }).click();
  await expect(page.getByRole("button", { name: "Play workshop music", exact: true })).toBeVisible();
});

test("leaving while autoplay is pending closes every audio context", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const state = window as typeof window & { pendingContexts: AudioContext[] };
    state.pendingContexts = [];
    window.AudioContext = class extends Original {
      constructor(options?: AudioContextOptions) {
        super(options);
        state.pendingContexts.push(this);
      }
      resume() { return new Promise<void>(() => {}); }
    };
  });
  await page.goto("/explore");
  await expect.poll(() => page.evaluate(() => (window as unknown as { pendingContexts: AudioContext[] }).pendingContexts.length)).toBeGreaterThan(0);
  await expect(page.getByRole("button", { name: "Pause workshop music", exact: true })).toBeEnabled();
  await page.getByRole("link", { name: "Back to portfolio", exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { pendingContexts: AudioContext[] }).pendingContexts.every((context) => context.state === "closed"))).toBe(true);
  expect(errors).toEqual([]);
});

test("background music starts on entry without a click when permitted", async ({ playwright, baseURL }) => {
  const browser = await playwright.chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "msedge", args: ["--autoplay-policy=no-user-gesture-required"] });
  try {
    const page = await browser.newPage();
    await page.goto(`${baseURL}/explore`);
    await expect(page.getByRole("button", { name: "Pause workshop music", exact: true })).toBeVisible();
    await expect(page.getByText("Soft Circuit · playing in the background")).toBeVisible();
  } finally {
    await browser.close();
  }
});

test("pausing a pending music start prevents late playback", async ({ page }) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const state = window as typeof window & { deferredAudio: { context: AudioContext; release: () => Promise<void> }[] };
    state.deferredAudio = [];
    window.AudioContext = class extends Original {
      resume() {
        return new Promise<void>((resolve, reject) => {
          state.deferredAudio.push({ context: this, release: () => super.resume().then(resolve, reject) });
        });
      }
    };
  });
  await page.goto("/explore");
  await expect.poll(() => page.evaluate(() => (window as unknown as { deferredAudio: unknown[] }).deferredAudio.length)).toBeGreaterThan(0);
  await page.getByRole("button", { name: "Pause workshop music", exact: true }).click({ timeout: 3000 });
  await expect(page.getByRole("button", { name: "Play workshop music", exact: true })).toBeVisible();
  await page.evaluate(() => (window as unknown as { deferredAudio: { release: () => Promise<void> }[] }).deferredAudio.at(-1)!.release());
  await expect.poll(() => page.evaluate(() => (window as unknown as { deferredAudio: { context: AudioContext }[] }).deferredAudio.at(-1)!.context.state)).toBe("suspended");
  await expect(page.getByRole("button", { name: "Play workshop music", exact: true })).toBeVisible();
});
