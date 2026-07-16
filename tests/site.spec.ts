import { expect, test } from '@playwright/test';

const requiredRoles = [
  'Attester',
  'Verifier',
  'Relying Party',
  'Endorser',
  'Reference Value Provider',
  'Policy Owner',
  'Intel PCS',
  'PCCS',
];
const requiredFlows = [
  '패스포트: 증명서 전달',
  '백그라운드 체크: 결과 조회',
  'TDX 키 릴리스',
];
const comparisonAxes = ['경계 아티팩트', 'Attestation Result 경로', '검증·정책 소유자', '신선성', '결과 재사용'];

test.describe('Intel Attestation explainer', () => {
  test('presents the explainer sections, RATS roles, and both model flows', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('main')).toBeVisible();
    for (const sectionId of ['terms', 'roles', 'flows', 'tdx', 'checklist']) {
      await expect(page.locator(`#${sectionId}`)).toBeVisible();
    }

    for (const role of requiredRoles) {
      await expect(page.getByText(role, { exact: true }).first()).toBeVisible();
    }

    for (const flow of requiredFlows) {
      await expect(page.getByRole('heading', { name: flow, exact: true })).toBeVisible();
    }

    for (const axis of comparisonAxes) {
      await expect(page.getByRole('rowheader', { name: axis })).toBeVisible();
    }
  });

  test('shows an allow and deny result for every attestation model', async ({ page }) => {
    await page.goto('/');

    for (const model of requiredFlows) {
      const flow = page.locator('article').filter({ hasText: model }).first();
      await expect(flow).toBeVisible();
      await expect(flow.getByText(/허용|Allow/i).first()).toBeVisible();
      await expect(flow.getByText(/거부|Deny/i).first()).toBeVisible();
    }
  });

  test('every primary navigation link resolves to a visible in-page section', async ({ page }) => {
    await page.goto('/');

    const links = page.locator('nav a[href^="#"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);

    for (let index = 0; index < count; index += 1) {
      const link = links.nth(index);
      const target = await link.getAttribute('href');
      expect(target).toMatch(/^#[A-Za-z][\w-]*$/);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${target}$`));
      await expect(page.locator(target!)).toBeVisible();
    }
  });

  test('desktop and explicit mobile viewports do not horizontally overflow', async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 900 },
      { width: 390, height: 844 },
      { width: 320, height: 568 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      const dimensions = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
    }
  });

  test('captures a non-empty full-page visual record', async ({ page }, testInfo) => {
    await page.goto('/');

    const screenshot = await page.screenshot({
      path: testInfo.outputPath('intel-attestation.png'),
      fullPage: true,
      animations: 'disabled',
    });
    expect(screenshot.byteLength).toBeGreaterThan(1_000);
  });
});
