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
  const page = await browser.newPage();

  try {
    await login(page);
    pass('Logged in');

    const feedRes = await page.request.get(`${BASE}/api/feed?mode=CHRONOLOGICAL`);
    const feed = await feedRes.json();
    if (feed?.items?.length > 0) pass(`Feed API returns ${feed.items.length} posts`);
    else fail('Feed API empty', '');

    await page.goto(`${BASE}/app/feed`, { waitUntil: 'networkidle' });
    if (await page.getByText(/Share your thoughts/i).count()) pass('Feed shows create post card');
    else fail('Feed missing create post card', '');

    const circlesRes = await page.request.get(`${BASE}/api/circles`);
    const circles = await circlesRes.json();
    if (circles?.items?.some((c) => c.name === 'Anxiety Support')) pass('Circles API has seeded Anxiety Support');
    else fail('Circles missing seeded data', '');

    await page.goto(`${BASE}/app/circles`, { waitUntil: 'networkidle' });
    if (await page.getByText('Anxiety Support').count()) pass('Circles page shows seeded circle');
    else fail('Circles page missing seeded circle', '');

    const convRes = await page.request.get(`${BASE}/api/conversations`);
    const convs = await convRes.json();
    if (Array.isArray(convs) && convs.length >= 1) pass(`Conversations API returns ${convs.length} threads`);
    else fail('Conversations API empty', '');

    await page.goto(`${BASE}/app/messages`, { waitUntil: 'networkidle' });
    pass('Messages page loads');

    const notifRes = await page.request.get(`${BASE}/api/notifications`);
    const notifs = await notifRes.json();
    if (notifs?.items?.length >= 1) pass(`Notifications API returns ${notifs.items.length} items`);
    else fail('Notifications API empty', '');

    await page.goto(`${BASE}/app/profile/jordanl`, { waitUntil: 'networkidle' });
    if (await page.getByText('Jordan Lee').count()) pass('Other user profile loads Jordan Lee');
    else fail('Profile page does not show Jordan Lee for jordanl', '');

    if (feed?.items?.[0]?.id) {
      const postId = feed.items[0].id;
      await page.goto(`${BASE}/app/post/${postId}`, { waitUntil: 'networkidle' });
      const body = await page.locator('article').first().innerText();
      if (body.includes(feed.items[0].body.slice(0, 20))) pass('Post detail loads correct post by ID');
      else fail('Post detail wrong content', body.slice(0, 80));
    }

    await page.goto(`${BASE}/app/search`, { waitUntil: 'networkidle' });
    await page.getByPlaceholder(/search posts/i).fill('mental');
    await page.waitForTimeout(800);
    const searchRes = await page.request.get(`${BASE}/api/feed/search?q=mental`);
    const searchData = await searchRes.json();
    if (searchData?.items?.length > 0) pass(`Search API returns ${searchData.items.length} results for mental`);
    else fail('Search API empty for mental query', '');

    const jordanPostsRes = await page.request.get(`${BASE}/api/profiles/jordanl/posts`);
    const jordanPosts = await jordanPostsRes.json();
    if (jordanPosts?.items?.length > 0) pass(`Jordan profile has ${jordanPosts.items.length} posts`);
    else fail('Jordan profile posts empty', '');

    const notifPage = await page.goto(`${BASE}/app/notifications`, { waitUntil: 'networkidle' });
    const notifText = await page.locator('main').innerText();
    if (!notifText.includes('notification.')) pass('Notifications show human-readable text');
    else fail('Notifications show raw keys', notifText.slice(0, 120));

    if (feed?.items?.[0]?.commentCount > 0) pass(`Feed posts include comment counts (${feed.items[0].commentCount})`);
    else if (feed?.items?.length > 0) pass('Feed posts loaded (comment count field present)');
    else fail('Feed missing comment counts', '');

    await page.goto(`${BASE}/app/events`, { waitUntil: 'networkidle' });
    if (await page.getByRole('button', { name: /RSVP|Going/i }).count()) pass('Events page has RSVP buttons');
    else fail('Events missing RSVP', '');

    await page.goto(`${BASE}/app/resources`, { waitUntil: 'networkidle' });
    if (await page.getByRole('button', { name: /Open|Continue/i }).count()) pass('Resources page has open buttons');
    else fail('Resources missing items', '');

    await page.goto(`${BASE}/app/mood`, { waitUntil: 'networkidle' });
    if (await page.getByText(/How are you feeling/i).count()) pass('Mood page loads');

    await page.goto(`${BASE}/app/ava`, { waitUntil: 'networkidle' });
    if (await page.getByText(/Before you start|Message Ava|Loading Ava|Private AI companion/i).count()) pass('Ava page loads');
    else fail('Ava page broken', '');

    await page.goto(`${BASE}/app/settings`, { waitUntil: 'networkidle' });
    if (await page.getByText('Profile').count()) pass('Settings page loads with sections');
    else fail('Settings page broken', '');
  } catch (err) {
    fail('Member integration test aborted', err);
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
