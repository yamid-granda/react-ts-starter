import { defineConfig, devices } from '@playwright/test'

const port = 5173
const baseURL = `http://localhost:${port}/playwright/gallery/index.html`

export default defineConfig({
  testDir: './tests/components',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'components',
      use: {
        ...devices['Desktop Chrome'],
        baseURL,
        serviceWorkers: 'block',
        reuseContext: true,
      },
    },
  ],
  webServer: {
    command: `pnpm dev --port ${port} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
})
