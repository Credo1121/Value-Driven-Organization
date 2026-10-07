import { defineConfig, devices } from '@playwright/test'

// E2E and accessibility checks against the static export (ADR-001), served offline.
const PORT = 4190

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } }],
  webServer: {
    command: `node scripts/serve-out.mjs`,
    env: { PORT: String(PORT) },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
  },
})
