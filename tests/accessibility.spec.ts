import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('accessibility basics', () => {
  test('has no automated accessibility violations', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });

  test('provides one main landmark, a labelled navigation landmark, and ordered headings', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toHaveCount(1);
    await expect(page.getByRole('navigation')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);

    const headingLevels = await page.locator('h1, h2, h3, h4, h5, h6').evaluateAll((headings) =>
      headings.map((heading) => Number(heading.tagName.slice(1))),
    );
    expect(headingLevels).toContain(1);
    for (let index = 1; index < headingLevels.length; index += 1) {
      expect(headingLevels[index]).toBeLessThanOrEqual(headingLevels[index - 1] + 1);
    }
  });

  test('keyboard focus is visible and navigation links can be activated', async ({ page }) => {
    await page.goto('/');

    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();

    const focusedElement = page.locator(':focus');
    const tagName = await focusedElement.evaluate((element) => element.tagName);
    expect(['A', 'BUTTON']).toContain(tagName);

    const navigationLink = page.locator('nav a[href^="#"]').first();
    await navigationLink.focus();
    const target = await navigationLink.getAttribute('href');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${target}$`));
  });
});
