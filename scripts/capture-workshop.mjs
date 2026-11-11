import { chromium } from "@playwright/test";

const browser = await chromium.launch({
  channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
});
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  await page.goto(
    `${process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3001"}/explore`,
  );
  await page.locator('[data-ready="true"]').waitFor();
  await page.getByRole("button", { name: "Island overview", exact: true }).click();
  await page
    .getByRole("button", { name: "Select CodeMate-X station", exact: true })
    .waitFor();
  // Capture the implemented world at a deliberate artwork aspect ratio.
  await page.addStyleTag({
    content:
      ".scene-column{display:block}.scene-container{height:570px!important;min-height:570px!important;flex:none}.scene-hint,.workshop-minimap,.directional-pad{visibility:hidden}.station-labels,nextjs-portal{display:none}",
  });
  await page.waitForTimeout(500); // Allow ResizeObserver and the demand frame to settle.
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page
    .locator(".scene-container")
    .screenshot({
      path: "public/images/workshop-expanded.jpg",
      type: "jpeg",
      quality: 92,
    });
  console.log("Captured expanded scene preview.");
} finally {
  await browser.close();
}
