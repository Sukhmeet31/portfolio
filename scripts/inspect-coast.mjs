import { chromium } from '@playwright/test';
const browser = await chromium.launch({ channel: 'msedge' });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3001'}/explore`);
  await page.locator('[data-ready="true"]').waitFor();
  await page.getByRole('button', { name: 'Island overview', exact: true }).click();
  await page.getByRole('button', { name: 'Select Legal Document Simplifier station', exact: true }).waitFor();
  await page.locator('.scene-container').screenshot({ path: 'screenshots/coastal-day-scene.png' });
  await page.getByRole('button', { name: 'Night mode', exact: true }).click();
  await page.locator('.scene-container').screenshot({ path: 'screenshots/coastal-night-scene.png' });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'screenshots/coastal-night-desktop.png', fullPage: true });
  await page.getByRole('button', { name: 'Visit bowling lane', exact: true }).click();
  await page.keyboard.down('w');
  await page.getByLabel('Bowling score').filter({ hasNotText: '0 / 10 pins' }).waitFor({ timeout: 10000 });
  await page.keyboard.up('w');
  await page.waitForTimeout(800);
  await page.locator('.scene-container').screenshot({ path: 'screenshots/coastal-bowling.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('button', { name: 'Island overview', exact: true }).click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.screenshot({ path: 'screenshots/coastal-night-mobile.png', fullPage: true });
  console.log(JSON.stringify({ errors, pins: await page.getByLabel('Bowling score').textContent() }));
} finally { await browser.close(); }
