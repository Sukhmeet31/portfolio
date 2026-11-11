import { test, expect, type Page } from "@playwright/test";

test("project pages use abstract covers instead of original product screenshots", async ({
  page,
}) => {
  const screenshots: string[] = [];
  page.on("request", (request) => {
    if (/legal-live|codemate-live/.test(request.url()))
      screenshots.push(request.url());
  });
  for (const slug of ["legal-document-simplifier", "codemate-x"]) {
    await page.goto(`/projects/${slug}`);
    await expect(
      page.getByRole("img", { name: /Abstract illustration/ }),
    ).toBeVisible();
  }
  expect(screenshots).toEqual([]);
});

async function drive(
  page: Page,
  key: string,
  axis: "x" | "z",
  target: number,
  sign: number,
) {
  await page.keyboard.down(key);
  try {
    await expect
      .poll(
        async () => {
          const text = await page.getByLabel("Rover coordinates").textContent();
          const values = text!.match(/-?\d+\.\d+/g)!.map(Number);
          return values[axis === "x" ? 0 : 1] * sign;
        },
        { timeout: 12000, intervals: [100] },
      )
      .toBeGreaterThanOrEqual(target * sign);
  } finally {
    await page.keyboard.up(key);
  }
}

test("Signal Run can be completed with real rover movement and replayed", async ({
  page,
}) => {
  test.setTimeout(60000);
  await page.goto("/explore");
  await page
    .getByRole("button", { name: "Start Signal Run", exact: true })
    .click();
  const progress = page.getByLabel("Signal Run progress");
  await expect(progress).toContainText("0 / 5");
  await drive(page, "d", "x", 3, 1);
  await expect(progress).toContainText("1 / 5");
  await drive(page, "w", "z", 0, -1);
  await drive(page, "d", "x", 7, 1);
  await expect(progress).toContainText("2 / 5");
  await drive(page, "a", "x", -7, -1);
  await expect(progress).toContainText("3 / 5");
  await drive(page, "d", "x", -3, 1);
  await drive(page, "s", "z", 2.8, 1);
  await expect(progress).toContainText("4 / 5");
  await page.keyboard.down("d");
  await expect(progress).toContainText("5 / 5");
  await page.keyboard.up("d");
  await expect(progress).toContainText("Circuit complete");
  await page
    .getByRole("button", { name: "Play Signal Run again", exact: true })
    .click();
  await expect(progress).toContainText("0 / 5");
  await expect(page.getByLabel("Rover coordinates")).toHaveText(
    "X 0.0 / Z 2.8",
  );
  await page
    .getByRole("button", { name: "End Signal Run", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Start Signal Run", exact: true }),
  ).toBeVisible();
});

test("mobile directional pad stops when released", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/explore");
  await page
    .getByRole("button", { name: "Start Signal Run", exact: true })
    .click();
  const right = page.getByRole("button", { name: "Drive right", exact: true });
  const bounds = await right.boundingBox();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2,
    bounds!.y + bounds!.height / 2,
  );
  await page.mouse.down();
  await expect(page.getByLabel("Rover coordinates")).not.toHaveText(
    "X 0.0 / Z 2.8",
  );
  await page.mouse.up();
  const stopped = await page.getByLabel("Rover coordinates").textContent();
  await page.waitForTimeout(350);
  await expect(page.getByLabel("Rover coordinates")).toHaveText(stopped!);
});

for (const input of ["keyboard", "pointer"] as const) {
  test(`finishing Signal Run releases held ${input} directional input`, async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/explore");
    await page.getByRole("button", { name: "Start Signal Run", exact: true }).click();
    await drive(page, "d", "x", 3, 1);
    await drive(page, "w", "z", 0, -1);
    await drive(page, "d", "x", 7, 1);
    await drive(page, "a", "x", -7, -1);
    await drive(page, "d", "x", -3, 1);
    await drive(page, "s", "z", 2.8, 1);
    await expect(page.getByLabel("Signal Run progress")).toContainText("4 / 5");
    const right = page.getByRole("button", { name: "Drive right", exact: true });
    if (input === "keyboard") {
      await right.focus();
      await page.keyboard.down("Enter");
    } else {
      await right.scrollIntoViewIfNeeded();
      const bounds = await right.boundingBox();
      await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
      await page.mouse.down();
    }
    await expect(page.getByLabel("Signal Run progress")).toContainText("Circuit complete");
    if (input === "keyboard") await page.keyboard.up("Enter");
    else await page.mouse.up();
    const stopped = await page.getByLabel("Rover coordinates").textContent();
    await page.waitForTimeout(500);
    await expect(page.getByLabel("Rover coordinates")).toHaveText(stopped!, { timeout: 1000 });
    await expect(right).toBeVisible();
    await right.focus();
    await page.keyboard.down("Enter");
    await expect(page.getByLabel("Rover coordinates")).not.toHaveText(stopped!);
    await page.keyboard.up("Enter");
  });
}

test("background music plays at fixed maximum and cleans up on pause and route exit", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    const state = window as typeof window & {
      audioChecks: { context: AudioContext; analyser: AnalyserNode; output?: GainNode }[];
    };
    state.audioChecks = [];
    window.AudioContext = class extends Original {
      constructor(options?: AudioContextOptions) {
        super(options);
        const analyser = this.createAnalyser();
        const connect = AudioNode.prototype.connect;
        const destination = this.destination;
        const check: { context: AudioContext; analyser: AnalyserNode; output?: GainNode } = { context: this, analyser };
        const master = this.createGain();
        master.connect(analyser);
        analyser.connect(destination);
        const originalCreateGain = this.createGain.bind(this);
        this.createGain = () => {
          const gain = originalCreateGain();
          gain.connect = function (
            this: GainNode,
            target: AudioNode | AudioParam,
            ...args: number[]
          ) {
            if (target === destination) check.output = this;
            return connect.apply(this, [
              target === destination ? master : target,
              ...args,
            ] as never);
          } as typeof gain.connect;
          return gain;
        };
        state.audioChecks.push(check);
      }
    };
  });
  await page.goto("/explore");
  await expect.poll(() => page.evaluate(() =>
    (window as unknown as { audioChecks: { context: AudioContext }[] }).audioChecks.filter(({ context }) => context.state !== "closed").length,
  )).toBe(1);
  await expect(page.getByRole("slider", { name: "Music volume" })).toHaveCount(0);
  await page
    .getByRole("button", { name: "01 Legal Document Simplifier", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Pause workshop music", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page.evaluate(() => {
        const { analyser } = (
          window as unknown as { audioChecks: { analyser: AnalyserNode }[] }
        ).audioChecks.at(-1)!;
        const data = new Float32Array(analyser.fftSize);
        analyser.getFloatTimeDomainData(data);
        return Math.max(...data.map(Math.abs));
      }),
    )
    .toBeGreaterThan(0.0001);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioChecks: { context: AudioContext }[] })
            .audioChecks.at(-1)!.context.state,
      ),
    )
    .toBe("suspended");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioChecks: { context: AudioContext }[] })
            .audioChecks.at(-1)!.context.state,
      ),
    )
    .toBe("running");
  await expect
    .poll(() =>
      page.evaluate(() => {
        return (window as unknown as { audioChecks: { output: GainNode }[] }).audioChecks.at(-1)!.output.gain.value;
      }),
    )
    .toBeCloseTo(0.3, 2);
  await page
    .getByRole("button", { name: "Pause workshop music", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioChecks: { context: AudioContext }[] })
            .audioChecks.at(-1)!.context.state,
      ),
    )
    .toBe("suspended");
  await page
    .getByRole("button", { name: "Play workshop music", exact: true })
    .click();
  await page
    .getByRole("link", { name: "Back to portfolio", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as unknown as { audioChecks: { context: AudioContext }[] })
            .audioChecks.at(-1)!.context.state,
      ),
    )
    .toBe("closed");
});

test("an unavailable audio device leaves a usable workshop", async ({
  page,
}) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, "AudioContext", { value: undefined }),
  );
  await page.goto("/explore");
  await page
    .getByRole("button", { name: "Play workshop music", exact: true })
    .click();
  await expect(
    page.getByText("Audio unavailable here. You can still explore."),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Play workshop music", exact: true }),
  ).toBeEnabled();
  await page
    .getByRole("button", { name: "01 Legal Document Simplifier", exact: true })
    .click();
  await expect(
    page.getByRole("link", { name: "Read case study" }),
  ).toBeVisible();
});
