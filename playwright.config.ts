import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,  
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,            
  timeout: 60000,         
  reporter:[['html'],['allure-playwright']],
  use: {
    browserName: 'chromium',
    channel: 'msedge',
    headless: false,
    trace: 'on-first-retry',
    actionTimeout: 15000, 
  },
  projects: [
    {
      name: 'msedge',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'msedge',
      },
    },
  ],
});