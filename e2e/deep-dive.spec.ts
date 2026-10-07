import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// REQ-004 capability deep dives in a real browser (Chromium, Firefox, WebKit).

async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'commit' })
  await page.waitForLoadState('load')
}

const sections = [
  'Purpose & key decision question',
  'Roles involved',
  'Inputs & outputs',
  'Data objects',
  'Decision rights',
  'Interfaces',
  'Typical breaks',
  'Sources & conditions of use',
]

test.describe('Capability deep dive C2 (REQ-004)', () => {
  test.beforeEach(async ({ page }) => open(page, '/capabilities/c2/'))

  test('AC-004-1: all eight template sections are present and filled', async ({ page }) => {
    for (const s of sections) await expect(page.getByRole('heading', { level: 2, name: s })).toBeVisible()
    await expect(page.getByText('Open – to be defined.')).toHaveCount(0)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Investment & funding')
    await expect(page.getByText('EPM → LPM').first()).toBeVisible()
  })

  test('AC-004-2: decision rights show enterprise and compact variant', async ({ page }) => {
    const table = page.locator('#decisionRights table')
    await expect(table.getByRole('columnheader', { name: 'Enterprise variant' })).toBeVisible()
    await expect(table.getByRole('columnheader', { name: 'Compact variant' })).toBeVisible()
    await expect(table.locator('tbody tr')).toHaveCount(6)
  })

  test('AC-004-3: data objects link to the glossary', async ({ page }) => {
    const link = page.locator('#dataObjects').getByRole('link', { name: 'Forecast' })
    await expect(link).toHaveAttribute('href', '/glossary/#forecast')
    await link.click()
    await expect(page).toHaveURL(/\/glossary\/#forecast$/)
  })

  test('AC-004-4: interfaces link to the target capability and name the link type', async ({ page }) => {
    const row = page.locator('#interfaces tbody tr').filter({ hasText: 'C3 Prioritisation & dependencies' })
    await expect(row).toContainText('Funding')
    await expect(row.getByRole('link')).toHaveAttribute('href', '/capabilities/c3/')
  })

  test('AC-004-6: typical breaks name the overarching break they belong to', async ({ page }) => {
    await expect(page.locator('#breaks li').first()).toContainText(/Break \d:/)
  })

  test('AC-004-8: value types target, budget, forecast and actual are explained with the finance interface', async ({ page }) => {
    const vt = page.locator('#valueTypes')
    for (const v of ['Target', 'Budget', 'Forecast', 'Actual']) await expect(vt.getByRole('rowheader', { name: v })).toBeVisible()
    await expect(vt).toContainText('remain finance processes')
  })

  test('statement types are visible as text, framework statements cite their source', async ({ page }) => {
    const src = page.locator('#sources')
    await expect(src.getByText('Framework-based').first()).toBeVisible()
    await expect(src.getByText('Our synthesis').first()).toBeVisible()
    await expect(src).toContainText('Lean Budgets')
  })

  test('section navigation follows the page order (value types after decision rights)', async ({ page }) => {
    const items = page.getByRole('navigation', { name: 'Sections on this page' }).getByRole('link')
    const labels = await items.allTextContents()
    expect(labels.indexOf('Financial value types')).toBe(labels.indexOf('Decision rights') + 1)
  })

  test('typical breaks are listed in the order of the seven breaks', async ({ page }) => {
    const refs = await page.locator('#breaks li').evaluateAll((li) => li.map((x) => Number(x.textContent!.match(/Break (\d)/)![1])))
    expect(refs).toEqual([...refs].sort((a, b) => a - b))
  })

  test('section navigation jumps to the section', async ({ page }) => {
    await page.getByRole('navigation', { name: 'Sections on this page' }).getByRole('link', { name: 'Decision rights' }).click()
    await expect(page).toHaveURL(/#decisionRights$/)
  })

  test('no serious or critical axe violations', async ({ page }) => {
    const r = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
    expect(r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id)).toEqual([])
  })

  test('no horizontal scrolling at 1280px and 768px', async ({ page }) => {
    for (const width of [1280, 768]) {
      await page.setViewportSize({ width, height: 900 })
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth), `${width}px`).toBeLessThanOrEqual(0)
    }
  })
})

test.describe('Capability templates (REQ-004, E26)', () => {
  test('AC-004-1: an unwritten capability shows every section as "open – to be defined"', async ({ page }) => {
    await open(page, '/capabilities/c5/')
    for (const s of sections) await expect(page.getByRole('heading', { level: 2, name: s })).toBeVisible()
    await expect(page.getByText('Open – to be defined.')).toHaveCount(8)
  })

  test('AC-003-5 → REQ-004: the Fund phase in the big picture opens the C2 deep dive', async ({ page }) => {
    await open(page, '/big-picture/')
    // vorübergehend über die Kreis-Übersicht statt der entkoppelten SwimlaneMatrix, siehe REQ-003 Rev. 3
    await page.getByTestId('cycle-card').getByRole('link', { name: 'Open Investment & funding' }).click()
    await expect(page.getByRole('heading', { level: 2, name: 'Decision rights' })).toBeVisible()
  })
})
