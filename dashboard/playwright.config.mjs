import { defineConfig, devices } from '@playwright/test';
export default defineConfig({
 testDir: './e2e',
 timeout: 30000,
 retries: process.env.CI ? 2 : 0,
 use: {baseURL:'http://127.0.0.1:3000', trace:'retain-on-failure', screenshot:'on', video:'retain-on-failure'},
 reporter: [['html',{open:'never'}], ['list']],
 projects: [{name:'chromium-desktop',use:{...devices['Desktop Chrome']}},{name:'chromium-mobile',use:{...devices['Pixel 7']}}],
 webServer:{command:'npm run dev -- --hostname 127.0.0.1',url:'http://127.0.0.1:3000',reuseExistingServer:!process.env.CI,timeout:120000}
});
