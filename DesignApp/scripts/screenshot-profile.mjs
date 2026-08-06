import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const outDir = '/opt/cursor/artifacts/screenshots';
mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

await page.goto('http://127.0.0.1:5173/design/app/profile', { waitUntil: 'networkidle' });
await page.waitForTimeout(2000);

await page.screenshot({ path: `${outDir}/profile-before.png`, fullPage: true });

const brokenImages = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('img')).map((img) => ({
    src: img.src,
    alt: img.alt,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete,
    visible: img.offsetParent !== null || img.getBoundingClientRect().width > 0,
  })).filter((img) => img.naturalWidth === 0 || !img.complete);
});

console.log('Broken images:', JSON.stringify(brokenImages, null, 2));

await browser.close();
