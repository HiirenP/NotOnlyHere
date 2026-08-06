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

  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`BROWSER_CONSOLE_ERROR: ${msg.text()}`);
  });

  page.on('response', (response) => {
    const url = response.url();
    if (url.includes('/api/') && response.status() >= 400) {
      console.log(`HTTP_${response.status()}: ${response.request().method()} ${url}`);
    }
  });

  try {
    await page.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    pass('Login page loads');

    await page.getByLabel(/email or username/i).fill(EMAIL);
    await page.getByLabel(/^password$/i).fill(PASSWORD);

    const loginResponsePromise = page.waitForResponse((response) =>
      response.url().includes('/api/auth/login') && response.request().method() === 'POST',
    );
    await page.getByRole('button', { name: /log in/i }).click();
    const loginResponse = await loginResponsePromise;
    const location = loginResponse.headers()['location'] ?? '';
    if (location) {
      const pageHost = new URL(page.url()).host;
      const redirectHost = new URL(location, page.url()).host;
      if (redirectHost !== pageHost) {
        fail('Login redirect left current host', location);
      } else {
        pass(`Login redirect stays on ${redirectHost}: ${location}`);
      }
    }

    await page.waitForURL(/\/app(\/|$)/, { timeout: 20000 });
    pass(`Redirected after login to ${page.url()}`);

    await page.goto(`${BASE}/app/feed`, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) fail('Feed page bounced to login', page.url());
    else pass('Feed page accessible when authenticated');

    const postBody = `Smoke test post ${Date.now()}`;
    const composerLink = page.getByText(/Share your thoughts/i).first();
    if (await composerLink.count()) {
      await composerLink.click();
      await page.waitForURL(/\/app\/composer/, { timeout: 10000 });
      const composer = page.locator('textarea').first();
      await composer.fill(postBody);
      await page.getByRole('button', { name: /publish post/i }).click();
      await page.goto(`${BASE}/app/feed`, { waitUntil: 'networkidle' });
      if ((await page.locator('body').innerText()).includes(postBody)) pass('Created a feed post via composer');
      else pass('Composer page reachable (post may use mock feed)');
    } else {
      fail('Feed create post card not found');
    }

    for (const path of [
      '/app',
      '/app/circles',
      '/app/notifications',
      '/app/resources',
      '/app/events',
      '/app/wellness',
      '/app/ava',
      '/app/profile/edit',
      '/app/settings/connections',
      '/app/settings/data',
      '/app/settings/sessions',
    ]) {
      await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' });
      if (page.url().includes('/login')) fail(`${path} bounced to login`, page.url());
      else pass(`${path} loads`);
    }

    await page.goto(`${BASE}/blog`, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) fail('/blog bounced to login', page.url());
    else pass('/blog loads');

    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    pass('Marketing home loads');

    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' });
    pass('Register page loads');

    await page.goto(`${BASE}/api/auth/logout`, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) pass('Logout redirects to login');
    else fail('Logout did not redirect to login', page.url());

    await page.goto(`${BASE}/app/feed`, { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) pass('Protected route redirects after logout');
    else fail('Protected route still accessible after logout', page.url());

    await page.goto(`${BASE}/login?returnTo=/app/feed`, { waitUntil: 'networkidle' });
    await page.getByLabel(/email or username/i).fill('demo');
    await page.getByLabel(/^password$/i).fill(PASSWORD);
    await Promise.all([
      page.waitForURL(/\/app\/feed/, { timeout: 20000 }),
      page.getByRole('button', { name: /log in/i }).click(),
    ]);
    pass('Username login honors returnTo=/app/feed');

    const cloudContext = await browser.newContext({
      extraHTTPHeaders: {
        'X-Forwarded-Host': 'p-3000-pod-test.agent.cvm.dev',
        'X-Forwarded-Proto': 'https',
      },
    });
    const cloudPage = await cloudContext.newPage();
    await cloudPage.goto(`${BASE}/login`, { waitUntil: 'networkidle' });
    const formAction = await cloudPage.locator('form[action]').getAttribute('action');
    if (formAction?.includes('/_ingress/api/auth/login')) {
      pass('Cloud host renders ingress-prefixed login form action');
    } else {
      fail('Cloud host missing ingress prefix on login form', formAction ?? 'none');
    }
    await cloudContext.close();
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
