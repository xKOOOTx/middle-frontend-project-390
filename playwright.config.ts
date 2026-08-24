import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests', // Папка, где будут лежать тесты
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: process.env.APP_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});