import { chromium } from 'playwright';

const BASE = process.env.WEB_URL ?? 'http://localhost:3000';
const EMAIL = 'demo@notonlyhere.local';
const PASSWORD = 'Demo1234!';

const failures = [];
const passes = [];

function pass(msg) {
  passes.push(msg);
  console.log(`PASS: ${msg}`);
}

function fail(msg, err) {
  const detail = err instanceof Error ? err.message : String(err ?? '');
  failures.push({ msg, detail });
  console.error(`FAIL: ${msg}${detail ? ` — ${detail}` : ''}`);
}

async function login(page) {
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel(/email or username/i).fill(EMAIL);
  await page.getByLabel(/^password$/i).fill(PASSWORD);
  await Promise.all([
    page.waitForURL(/\/app(\/|$)/, { timeout: 20000 }),
    page.getByRole('button', { name: /log in/i }).click(),
  ]);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    const hasAuthShell = await page.locator('.font-ui').count();
    if (hasAuthShell > 0) pass('Login page uses Stackbros auth shell');
    else fail('Login page missing Stackbros auth shell');

    await login(page);
    pass(`Logged in to ${page.url()}`);

    const memberRoutes = [
      '/app/feed',
      '/app/composer',
      '/app/post',
      '/app/search',
      '/app/circles',
      '/app/messages',
      '/app/notifications',
      '/app/ava',
      '/app/mood',
      '/app/events',
      '/app/resources',
      '/app/explore',
      '/app/settings',
      '/app/profile',
    ];

    for (const path of memberRoutes) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      if (page.url().includes('/login')) {
        fail(`${path} bounced to login`, page.url());
        continue;
      }
      const body = await page.locator('body').innerText();
      const hasDesignShell = (await page.locator('.bg-\\[\\#eff2f6\\]').count()) > 0;
      if (!hasDesignShell) fail(`${path} missing Stackbros member shell`);
      else pass(`${path} loads with design shell`);
      if (body.includes('Member app')) fail(`${path} still shows old shell`);
    }

    await page.goto(`${BASE}/app/feed`, { waitUntil: 'networkidle' });
    const hasMomentsRail = (await page.getByText(/Share moment/i).count()) > 0;
    const hasCreatePost = (await page.getByText(/Share your thoughts/i).count()) > 0;
    if (hasMomentsRail) pass('Feed has circle moments rail');
    else fail('Feed missing circle moments rail');
    if (hasCreatePost) pass('Feed has create post card');
    else fail('Feed missing create post card');

    await page.goto(`${BASE}/api/auth/logout`, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) pass('Logout works');
    else fail('Logout failed', page.url());

    const adminEmail = 'admin@notonlyhere.local';
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    await page.getByLabel(/email or username/i).fill(adminEmail);
    await page.getByLabel(/^password$/i).fill(PASSWORD);
    await Promise.all([
      page.waitForURL(/\/app/, { timeout: 20000 }),
      page.getByRole('button', { name: /log in/i }).click(),
    ]);

    const adminRoutes = [
      '/admin',
      '/admin/users',
      '/admin/users/detail',
      '/admin/circles',
      '/admin/safety',
      '/admin/content',
      '/admin/donations',
      '/admin/analytics',
      '/admin/audit',
    ];

    for (const path of adminRoutes) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      if (page.url().includes('/login')) {
        fail(`Admin ${path} bounced to login`);
        continue;
      }
      if (page.url().includes('/app') && !page.url().includes('/admin')) {
        fail(`Admin ${path} denied or redirected`, page.url());
        continue;
      }
      const hasAdminShell = (await page.locator('.bg-\\[\\#f0f2f5\\]').count()) > 0;
      if (hasAdminShell) pass(`Admin ${path} loads with design shell`);
      else fail(`Admin ${path} missing admin design shell`);
    }
  } catch (err) {
    fail('Smoke test aborted', err);
  } finally {
    await browser.close();
  }

  console.log('\n=== SUMMARY ===');
  console.log(`Passed: ${passes.length}`);
  console.log(`Failed: ${failures.length}`);
  for (const f of failures) console.log(` - ${f.msg}: ${f.detail}`);
  process.exit(failures.length > 0 ? 1 : 0);
}

run();
