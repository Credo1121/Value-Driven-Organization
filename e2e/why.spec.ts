import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// "Why this matters" (E31, SCQA entry page before the big picture). No REQ yet.

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'commit' })
  await page.waitForLoadState('load')
  await page.waitForLoadState('networkidle')
}

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
const serious = (r: Awaited<ReturnType<typeof axe>>) =>
  r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length}`)

test.describe('Why this matters', () => {
  test.beforeEach(async ({ page }) => open(page, '/why/'))

  test('loads with heading and is the first, current item in the main navigation', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toContainText('One steering system')
    const nav = page.getByRole('navigation', { name: 'Main' })
    const items = nav.getByRole('link')
    await expect(items.first()).toHaveText(/Why this matters/)
    await expect(items.first()).toHaveAttribute('aria-current', 'page')
  })

  test('shows all seven breaks', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Seven typical breaks' })).toBeVisible()
    await expect(page.locator('ol > li')).toHaveCount(7)
  })

  test('shows the four discipline paragraphs, marked as our synthesis', async ({ page }) => {
    for (const name of ['Finance & controlling', 'EPM', 'EA', 'LPM']) await expect(page.getByText(name, { exact: true })).toBeVisible()
    await expect(page.getByText('Our synthesis')).toBeVisible()
  })

  test('the answer links on to the steering cycle', async ({ page }) => {
    await page.getByRole('link', { name: 'See the steering cycle →' }).click()
    await expect(page).toHaveURL(/\/big-picture\/$/)
  })

  test('no horizontal scrolling at 1280px, 1440px and 1920px', async ({ page }) => {
    for (const width of [1280, 1440, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width}px`).toBeLessThanOrEqual(0)
    }
  })

  test('no serious or critical axe violations', async ({ page }) => {
    expect(serious(await axe(page))).toEqual([])
  })
})
