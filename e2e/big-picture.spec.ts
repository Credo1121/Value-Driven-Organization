import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Locator } from '@playwright/test'

// Horizontal or vertical SVG lines have a zero-height or zero-width box, which Playwright treats
// as "hidden". A link counts as drawn when it is rendered with a non-zero length and not dimmed.
async function expectDrawn(link: Locator) {
  await expect(link).toBeAttached()
  const box = await link.boundingBox()
  expect(box, 'link has no bounding box').not.toBeNull()
  expect(Math.max(box!.width, box!.height)).toBeGreaterThan(10)
  await expect(link).toHaveCSS('opacity', '1')
}

// REQ-003 user journey in a real browser against the static export.

test.describe('Big picture (REQ-003)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/big-picture/')
  })

  test('AC-003-1: eight capabilities and the adjacent finance environment are visible', async ({ page }) => {
    const canvas = page.getByTestId('big-picture-canvas')
    for (const code of ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8'])
      await expect(canvas.locator('[data-capability]').filter({ hasText: code })).toBeVisible()
    await expect(canvas.getByText('Corporate finance processes')).toBeVisible()
  })

  test('AC-003-4: guided steps reveal disciplines, then link types one by one', async ({ page }) => {
    const links = page.locator('[data-link]')
    await expect(page.getByText('Step 1 of 9')).toBeVisible()
    await expect(links).toHaveCount(0)
    await expect(page.getByText('Leads:').first()).toBeHidden()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('Step 2 of 9')).toBeVisible()
    await expect(page.getByText('Leads:').first()).toBeVisible()
    await expect(links).toHaveCount(0)

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByText('Step 3 of 9')).toBeVisible()
    await expectDrawn(page.locator('[data-type="strategic-contribution"]').first())
    await expect(page.locator('[data-type="funding"]')).toHaveCount(0)

    await page.keyboard.press('PageDown')
    await expect(page.locator('[data-type="funding"]').first()).toBeAttached()

    await page.getByRole('button', { name: 'Show complete picture' }).click()
    await expect(page.getByText('Step 9 of 9')).toBeVisible()
    await expect(links).toHaveCount(15)

    await page.keyboard.press('ArrowLeft')
    await expect(page.getByText('Step 8 of 9')).toBeVisible()
  })

  test('AC-003-3: focusing "Funding" highlights only funding links and names the focus in text', async ({ page }) => {
    const funding = page.getByRole('button', { name: /^Funding/ })
    await funding.click()
    await expect(funding).toHaveAttribute('aria-pressed', 'true')
    await expect(page.getByText('Focus:')).toContainText('Funding')

    const all = page.locator('[data-link]')
    await expect(all).toHaveCount(15)
    const fundingLinks = page.locator('[data-type="funding"]')
    const n = await fundingLinks.count()
    expect(n).toBeGreaterThan(0)
    for (let i = 0; i < n; i++) await expect(fundingLinks.nth(i)).not.toHaveClass(/dim/)
    const others = page.locator('[data-link]:not([data-type="funding"])')
    for (let i = 0; i < (await others.count()); i++) await expect(others.nth(i)).toHaveClass(/dim/)

    await expect(page.getByRole('heading', { name: 'Funding: what flows' })).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(funding).toHaveAttribute('aria-pressed', 'false')
  })

  test('AC-003-5: a capability opens its page via keyboard (Enter)', async ({ page }) => {
    await page.locator('[data-capability="c2"]').focus()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/capabilities\/c2\/$/)
    await expect(page.getByRole('heading', { level: 1, name: 'Investment & funding' })).toBeVisible()
  })

  test('E22: C2 shows the lead sequence EPM → LPM in diagram and text view', async ({ page }) => {
    await page.keyboard.press('ArrowRight')
    await expect(page.locator('[data-capability="c2"]')).toContainText('Leads: EPM → LPM')
    await page.getByText('Text view: all capabilities and links').click()
    await expect(page.locator('#text-view')).toContainText('LPM then takes the lead within each portfolio')
  })

  test('AC-003-6: the text view lists every capability and every link', async ({ page }) => {
    await page.getByText('Text view: all capabilities and links').click()
    const text = page.locator('#text-view')
    await expect(text.locator('tbody tr')).toHaveCount(8)
    await expect(text.locator('li')).toHaveCount(15)
  })

  test('the SVG diagram is hidden from assistive tech; capabilities stay reachable as links', async ({ page }) => {
    await expect(page.locator('svg[viewBox="0 0 1200 740"]')).toHaveAttribute('aria-hidden', 'true')
    await expect(page.getByRole('link', { name: /C4.*Cost transparency/ })).toBeVisible()
  })

  test('AC-009-7: no serious or critical axe violations (complete picture with focus)', async ({ page }) => {
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    await page.getByRole('button', { name: /^Funding/ }).click()
    await page.getByText('Text view: all capabilities and links').click()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
    expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([])
  })
})

test.describe('Viewports (AC-009-4)', () => {
  for (const width of [1280, 1440, 1920]) {
    test(`no horizontal scrolling at ${width}px, diagram visible`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/big-picture/')
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow).toBeLessThanOrEqual(0)
      await expect(page.getByTestId('big-picture-canvas')).toBeVisible()
    })
  }

  test('at 768px the page is usable; below that the diagram falls back to the text view', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 })
    await page.goto('/big-picture/')
    await expect(page.getByTestId('big-picture-canvas')).toBeVisible()
    await page.setViewportSize({ width: 600, height: 1000 })
    await expect(page.getByTestId('big-picture-canvas')).toBeHidden()
    await expect(page.getByText('The diagram needs a wider screen.')).toBeVisible()
  })
})

test.describe('Other routes (AC-009-7 smoke)', () => {
  for (const path of ['/', '/glossary/', '/capabilities/', '/capabilities/c5/']) {
    test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
      const serious = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(serious.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([])
    })
  }
})
