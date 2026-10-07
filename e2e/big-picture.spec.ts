import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

// REQ-003 Rev. 2 (swimlane matrix) in a real browser against the static export.

const axe = (page: import('@playwright/test').Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
const serious = (r: Awaited<ReturnType<typeof axe>>) =>
  r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length}`)

test.describe('Big picture swimlanes (REQ-003)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/big-picture/')
    await page.waitForLoadState('networkidle')
  })

  test('AC-003-1: phases left to right, levels top to bottom, parallel and adjacent lanes', async ({ page }) => {
    const matrix = page.getByTestId('swimlane-matrix')
    await expect(matrix.getByRole('columnheader')).toHaveText([/Direct/, /Fund/, /Prioritise/, /Deliver/, /Operate/, /Realise value/])
    const rows = matrix.locator('tr[data-lane]')
    await expect(rows).toHaveCount(6)
    expect(await rows.evaluateAll((r) => r.map((x) => x.getAttribute('data-lane')))).toEqual([
      'enterprise', 'portfolio', 'delivery', 'cost', 'architecture', 'finance',
    ])
    await expect(matrix.getByText('Running in parallel across all phases')).toBeAttached()
    await expect(matrix.getByText('Adjacent: corporate finance processes')).toBeAttached()
  })

  test('AC-003-4: guided steps reveal one phase at a time, then parallel lanes, then feedback', async ({ page }) => {
    const card = (k: string) => page.locator(`[data-cell="${k}"]`)
    await expect(page.getByText('Step 1 of 9')).toBeVisible()
    await expect(card('enterprise/direct')).toBeHidden()
    // Step 1 shows the structure: all six lane heads are visible, no cells yet.
    for (const lane of ['Enterprise', 'Portfolio', 'Delivery & operations', 'Cost transparency', 'Architecture & lifecycle', 'Corporate finance'])
      await expect(page.locator('th[scope="row"]').filter({ hasText: lane })).toBeVisible()
    await expect(card('cost/direct')).toBeHidden()

    await page.keyboard.press('ArrowRight')
    await expect(page.getByText('Step 2 of 9')).toBeVisible()
    await expect(card('enterprise/direct')).toBeVisible()
    await expect(card('enterprise/fund')).toBeHidden()

    await page.getByRole('button', { name: 'Next' }).click()
    await expect(card('enterprise/fund')).toBeVisible()
    await expect(card('cost/fund')).toBeHidden()
    await expect(page.locator('th[scope="col"]').nth(1)).toHaveClass(/activeHead/)

    // Layout does not shift when phases are revealed.
    const before = await page.getByTestId('swimlane-matrix').boundingBox()
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    await expect(page.getByText('Step 9 of 9')).toBeVisible()
    const after = await page.getByTestId('swimlane-matrix').boundingBox()
    expect(after!.height).toBeCloseTo(before!.height, 0)

    await expect(card('cost/fund')).toBeVisible()
    await expect(page.getByTestId('feedback')).toBeVisible()
    await page.keyboard.press('ArrowLeft')
    await expect(page.getByTestId('feedback')).toBeHidden()
  })

  test('AC-003-2: hand-offs state direction and content in text; feedback is labelled', async ({ page }) => {
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    const fund = page.locator('[data-cell="enterprise/fund"]')
    await expect(fund).toContainText('Budgets and guardrails')
    await expect(fund).toContainText('handed down to Portfolio')
    await expect(page.locator('[data-cell="portfolio/realise"]')).toContainText('reported up to Enterprise')
    await expect(page.getByTestId('feedback')).toContainText('Outcome feedback')
    await expect(page.getByTestId('feedback')).toContainText('Realise value → Direct and Fund')
  })

  test('AC-003-3: selecting a box shows details without leaving the page; Esc clears', async ({ page }) => {
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    const box = page.locator('[data-cell="portfolio/fund"]')
    await box.focus()
    await page.keyboard.press('Enter')
    await expect(box).toHaveAttribute('aria-pressed', 'true')
    await expect(page).toHaveURL(/\/big-picture\/$/)
    await expect(page.getByRole('heading', { level: 2, name: 'Fund value streams' })).toBeVisible()
    await expect(page.getByText('Portfolio · Fund')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Open capability' })).toHaveAttribute('href', '/capabilities/c2/')
    await page.keyboard.press('Escape')
    await expect(box).toHaveAttribute('aria-pressed', 'false')
  })

  test('E22: the Fund phase shows the lead sequence EPM → LPM', async ({ page }) => {
    await expect(page.locator('th[scope="col"]').nth(1)).toContainText('EPM → LPM')
  })

  test('AC-003-5: phase and parallel-lane heads open the capability page', async ({ page }) => {
    await page.getByRole('link', { name: 'Operate' }).click()
    await expect(page).toHaveURL(/\/capabilities\/c7\/$/)
    await page.goBack()
    await page.getByRole('link', { name: 'Cost transparency' }).click()
    await expect(page).toHaveURL(/\/capabilities\/c4\/$/)
  })

  test('AC-003-6: text view lists every phase, level cell, parallel lane and the feedback', async ({ page }) => {
    await page.getByText('Text view: all phases, levels and hand-offs').click()
    const text = page.locator('#text-view')
    await expect(text.locator('ol > li')).toHaveCount(6)
    await expect(text).toContainText('Enterprise: Portfolio budgets & guardrails.')
    await expect(text).toContainText('Funding to Portfolio: Budgets and guardrails.')
    await expect(text).toContainText('In parallel: C4 Cost transparency (TBM)')
    await expect(text).toContainText('From Realise value to Direct and Fund')
  })

  test('AC-009-7: no serious or critical axe violations in the structure step (muted lanes)', async ({ page }) => {
    await expect(page.getByText('Step 1 of 9')).toBeVisible()
    expect(serious(await axe(page))).toEqual([])
  })

  test('AC-009-7: no serious or critical axe violations (complete picture, selection, text view)', async ({ page }) => {
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    await page.locator('[data-cell="enterprise/fund"]').click()
    await page.getByText('Text view: all phases, levels and hand-offs').click()
    expect(serious(await axe(page))).toEqual([])
  })
})

test.describe('Viewports (AC-009-4)', () => {
  for (const width of [1280, 1440, 1920]) {
    test(`no horizontal scrolling at ${width}px; matrix fits the screen width`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/big-picture/')
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
      await expect(page.getByTestId('swimlane-matrix')).toBeVisible()
    })
  }

  test('at 768px usable; below that the text view replaces the matrix', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 })
    await page.goto('/big-picture/')
    await expect(page.getByTestId('swimlane-matrix')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
    await page.setViewportSize({ width: 600, height: 1000 })
    await expect(page.getByTestId('swimlane-matrix')).toBeHidden()
    await expect(page.getByText('The matrix needs a wider screen.')).toBeVisible()
  })
})

test.describe('Other routes (AC-009-7 smoke)', () => {
  for (const path of ['/', '/glossary/', '/capabilities/', '/capabilities/c2/']) {
    test(`no serious or critical axe violations on ${path}`, async ({ page }) => {
      await page.goto(path)
      expect(serious(await axe(page))).toEqual([])
    })
  }
})
