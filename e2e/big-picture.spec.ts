import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'

// REQ-003 Rev. 2 (swimlane matrix) in a real browser against the static export.

// Next.js calls history.replaceState on start-up; Firefox reports that as a second navigation to the
// same URL, which interrupts page.goto(…, { waitUntil: 'load' }). Wait for commit, then for load.
async function open(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'commit' })
  await page.waitForLoadState('load')
  await page.waitForLoadState('networkidle')
}

const axe = (page: Page) =>
  new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze()
const serious = (r: Awaited<ReturnType<typeof axe>>) =>
  r.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => `${v.id}: ${v.nodes.length}`)

test.describe('Big picture swimlanes (REQ-003)', () => {
  test.beforeEach(async ({ page }) => {
    await open(page, '/big-picture/')
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

  test('E22/E24: Fund, Prioritise and Realise value show the lead sequence EPM → LPM', async ({ page }) => {
    const heads = page.locator('th[scope="col"]')
    for (const i of [1, 2, 5]) await expect(heads.nth(i)).toContainText('EPM → LPM')
  })

  test('layout integrity: box content never spills out and boxes never overlap (all widths)', async ({ page }) => {
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    for (const width of [1280, 1480, 1920]) {
      await page.setViewportSize({ width, height: 900 })
      const result = await page.evaluate(() => {
        const boxes = [...document.querySelectorAll<HTMLElement>('[data-box]')]
        const spill = boxes
          .filter((td) => {
            const c = td.querySelector('button')!.getBoundingClientRect()
            const b = td.getBoundingClientRect()
            return c.bottom > b.bottom + 1 || c.right > b.right + 1
          })
          .map((td) => td.dataset.box)
        const rects = boxes.map((td) => td.getBoundingClientRect())
        let overlaps = 0
        for (let i = 0; i < rects.length; i++)
          for (let j = i + 1; j < rects.length; j++) {
            const a = rects[i]!, b = rects[j]!
            if (a.left < b.right - 1 && b.left < a.right - 1 && a.top < b.bottom - 1 && b.top < a.bottom - 1) overlaps++
          }
        return { count: boxes.length, spill, overlaps }
      })
      expect(result.count, `${width}px`).toBe(32)
      expect(result.spill, `${width}px spill`).toEqual([])
      expect(result.overlaps, `${width}px overlaps`).toBe(0)
    }
  })

  test('AC-003-5: phase and parallel-lane heads open the capability page', async ({ page }) => {
    await page.getByRole('link', { name: 'Operate' }).click()
    await expect(page).toHaveURL(/\/capabilities\/c7\/$/)
    await open(page, '/big-picture/')
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
      await open(page, '/big-picture/')
      expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0)
      await expect(page.getByTestId('swimlane-matrix')).toBeVisible()
    })
  }

  test('at 768px usable; below that the text view replaces the matrix', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1000 })
    await open(page, '/big-picture/')
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
      await open(page, path)
      expect(serious(await axe(page))).toEqual([])
    })
  }
})

test.describe('Cycle overview (E27, entry picture)', () => {
  test.beforeEach(async ({ page }) => open(page, '/big-picture/'))

  test('shows six phases as a ring and Fund selected by default, with levels named in the card', async ({ page }) => {
    await expect(page.getByTestId('cycle')).toBeVisible()
    await expect(page.getByRole('button', { name: /2\s*Fund/ })).toHaveAttribute('aria-pressed', 'true')
    const card = page.getByTestId('cycle-card')
    await expect(card.getByRole('heading', { level: 3 })).toContainText('Fund')
    for (const level of ['Enterprise level', 'Portfolio level', 'Delivery & operations level'])
      await expect(card.getByText(level)).toBeVisible()
    await expect(card).toContainText('handed down to Portfolio')
    await expect(card).toContainText('Next: Prioritise')
  })

  test('selecting another phase updates the card; levels without a step say so', async ({ page }) => {
    await page.getByRole('button', { name: /1\s*Direct/ }).click()
    const card = page.getByTestId('cycle-card')
    await expect(card.getByRole('heading', { level: 3 })).toContainText('Direct')
    await expect(card.locator('[data-level="delivery"]')).toContainText('No dedicated step on this level')
    await page.getByRole('button', { name: /6\s*Realise value/ }).click()
    await expect(card).toContainText('the evidence starts the next cycle')
    await expect(card).toContainText('reported up to Enterprise')
  })

  test('the card links to the capability and to the phase in the detailed view', async ({ page }) => {
    const card = page.getByTestId('cycle-card')
    await expect(card.getByRole('link', { name: 'Open Investment & funding' })).toHaveAttribute('href', '/capabilities/c2/')
    await card.getByRole('link', { name: 'Show in the detailed view' }).click()
    await expect(page).toHaveURL(/#detail-fund$/)
  })
})

test.describe('Influence lines in the detailed view (E27)', () => {
  test.beforeEach(async ({ page }) => open(page, '/big-picture/'))

  test('walking to Fund draws dotted lines down through the levels and on to the next phase', async ({ page }) => {
    await expect(page.locator('[data-wire]')).toHaveCount(0)
    for (let i = 0; i < 2; i++) await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.locator('[data-wire="down"]')).toHaveCount(2)
    await expect(page.locator('[data-wire="next"]')).toHaveCount(3)
  })

  test('the beam under the phases grows with each phase', async ({ page }) => {
    const fill = page.getByTestId('swimlane-matrix').locator('[style*="width"]')
    await expect(fill).toHaveAttribute('style', /width:\s*0%/)
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(fill).toHaveAttribute('style', /width:\s*16\.6/)
    await page.getByRole('button', { name: 'Show complete picture' }).click()
    await expect(fill).toHaveAttribute('style', /width:\s*100%/)
  })

  test('no hydration or console errors on the big picture page', async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(e.message))
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
    await open(page, '/big-picture/')
    await page.waitForTimeout(500)
    expect(errors).toEqual([])
  })
})
