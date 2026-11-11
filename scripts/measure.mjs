import { chromium } from "@playwright/test";
import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";

const baseURL = process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001";
const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
const threeChunks = [];
for (const file of await readdir(".next/static/chunks")) {
  if (
    file.endsWith(".js") &&
    (await readFile(`.next/static/chunks/${file}`, "utf8")).includes(
      "WebGLRenderer",
    )
  )
    threeChunks.push(file);
}
const results = [];
try {
  for (const route of ["/", "/explore"]) {
    for (let run = 1; run <= 3; run++) {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1000 },
      });
      const page = await context.newPage();
      const consoleErrors = [];
      page.on("console", (message) => {
        if (message.type() === "error") consoleErrors.push(message.text());
      });
      await page.addInitScript(() => {
        window.__measure = { lcp: 0, cls: 0 };
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            window.__measure.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries())
            if (!entry.hadRecentInput) window.__measure.cls += entry.value;
        }).observe({ type: "layout-shift", buffered: true });
      });
      await page.goto(`${baseURL}${route}`, { waitUntil: "load" });
      let sceneReadyMs = null;
      if (route === "/explore") {
        await page.locator('[data-ready="true"]').waitFor();
        sceneReadyMs = await page.evaluate(() => performance.now());
      }
      await page.waitForTimeout(2000);
      const metrics = await page.evaluate(() => {
        const navigation = performance.getEntriesByType("navigation")[0];
        const resources = performance.getEntriesByType("resource");
        return {
          ttfbMs: navigation.responseStart,
          domContentLoadedMs: navigation.domContentLoadedEventEnd,
          loadMs: navigation.loadEventEnd,
          fcpMs: performance.getEntriesByName("first-contentful-paint")[0]
            ?.startTime,
          lcpMs: window.__measure.lcp,
          cls: window.__measure.cls,
          transferredBytes:
            navigation.transferSize +
            resources.reduce((total, r) => total + r.transferSize, 0),
          javascriptBytes: resources
            .filter((r) => r.name.includes(".js"))
            .reduce((total, r) => total + r.transferSize, 0),
          scripts: resources
            .filter((r) => r.name.includes(".js"))
            .map((r) => r.name),
        };
      });
      results.push({
        route,
        run,
        ...metrics,
        sceneReadyMs,
        threeRendererLoaded: metrics.scripts.some((url) =>
          threeChunks.some((name) => url.includes(name)),
        ),
        consoleErrors,
      });
      await context.close();
    }
  }
  await mkdir("docs", { recursive: true });
  await writeFile(
    "docs/performance.json",
    JSON.stringify(
      {
        environment:
          "Local production server, Edge headless, 1440x1000, unthrottled, new browser context per run. Warm server and OS cache. Not a Lighthouse score or real-user measurement.",
        threeChunks,
        results,
      },
      null,
      2,
    ),
  );
  console.log(results.map(row => Object.fromEntries(Object.entries(row).filter(([key]) => key !== 'scripts'))));
} finally {
  await browser.close();
}
