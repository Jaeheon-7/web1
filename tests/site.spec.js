const { test, expect } = require('@playwright/test');

const PAGES = ['/index.html', '/1.html', '/2.html', '/3.html'];

// Shared structure present on every page
test.describe('Common structure', () => {
  for (const path of PAGES) {
    test(`${path} — loads and has correct title`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response.status()).toBe(200);
      await expect(page).toHaveTitle('WEB1 - html');
    });

    test(`${path} — h1 "WEB" links back to index`, async ({ page }) => {
      await page.goto(path);
      const h1Link = page.locator('h1 a');
      await expect(h1Link).toHaveText('WEB');
      await expect(h1Link).toHaveAttribute('href', 'index.html');
    });

    test(`${path} — topic list has three items (HTML, CSS, JavaScript)`, async ({ page }) => {
      await page.goto(path);
      const items = page.locator('ol li');
      await expect(items).toHaveCount(3);
      await expect(items.nth(0)).toContainText('HTML');
      await expect(items.nth(1)).toContainText('CSS');
      await expect(items.nth(2)).toContainText('JavaScript');
    });

    test(`${path} — user list has three names`, async ({ page }) => {
      await page.goto(path);
      const items = page.locator('ul li');
      await expect(items).toHaveCount(3);
      await expect(items.nth(0)).toHaveText('jhlee9229');
      await expect(items.nth(1)).toHaveText('jaeheon');
      await expect(items.nth(2)).toHaveText('Jay');
    });

    test(`${path} — image is present`, async ({ page }) => {
      await page.goto(path);
      const img = page.locator('img');
      await expect(img).toBeVisible();
      await expect(img).toHaveAttribute('src', 'coding.jpg');
    });

    test(`${path} — image file loads (no 404)`, async ({ page }) => {
      await page.goto(path);
      const imgSrc = await page.locator('img').getAttribute('src');
      const imgResponse = await page.request.get(imgSrc);
      expect(imgResponse.status()).toBe(200);
    });

    test(`${path} — Wikipedia link opens in new tab with title`, async ({ page }) => {
      await page.goto(path);
      const wikiLink = page.locator('a[href*="wikipedia.org"]');
      await expect(wikiLink).toHaveAttribute('target', '_blank');
      await expect(wikiLink).toHaveAttribute('title', 'Harry Potter(film series)');
    });
  }
});

// Page-specific heading content
test.describe('Page headings', () => {
  test('index.html — h2 is about Harry Potter', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('h2')).toContainText('Harry Potter');
  });

  test('1.html — h2 is about Harry Potter', async ({ page }) => {
    await page.goto('/1.html');
    await expect(page.locator('h2')).toContainText('Harry Potter');
  });

  test('2.html — h2 is about Ronald Weasley', async ({ page }) => {
    await page.goto('/2.html');
    await expect(page.locator('h2')).toContainText('Ronald');
  });

  test('3.html — h2 is about Harry Potter', async ({ page }) => {
    await page.goto('/3.html');
    await expect(page.locator('h2')).toContainText('Harry Potter');
  });
});

// Navigation links — only 1.html has clickable ol links
test.describe('Navigation links on 1.html', () => {
  test('ol links navigate to the correct pages', async ({ page }) => {
    await page.goto('/1.html');
    const links = page.locator('ol a');
    await expect(links).toHaveCount(3);
    await expect(links.nth(0)).toHaveAttribute('href', '1.html');
    await expect(links.nth(1)).toHaveAttribute('href', '2.html');
    await expect(links.nth(2)).toHaveAttribute('href', '3.html');
  });

  test('clicking HTML link navigates to 1.html', async ({ page }) => {
    await page.goto('/1.html');
    await page.locator('ol a', { hasText: 'HTML' }).click();
    await expect(page).toHaveURL(/1\.html/);
  });

  test('clicking CSS link navigates to 2.html', async ({ page }) => {
    await page.goto('/1.html');
    await page.locator('ol a', { hasText: 'CSS' }).click();
    await expect(page).toHaveURL(/2\.html/);
  });

  test('clicking JavaScript link navigates to 3.html', async ({ page }) => {
    await page.goto('/1.html');
    await page.locator('ol a', { hasText: 'JavaScript' }).click();
    await expect(page).toHaveURL(/3\.html/);
  });
});

// H1 back-link navigation
test.describe('H1 home link navigation', () => {
  for (const path of ['/1.html', '/2.html', '/3.html']) {
    test(`clicking WEB on ${path} returns to index`, async ({ page }) => {
      await page.goto(path);
      await page.locator('h1 a').click();
      await expect(page).toHaveURL(/index\.html|\/$/);
    });
  }
});
