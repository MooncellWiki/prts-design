/**
 * e2e（Playwright Test，只跑 Chromium：交互态比对走 CDP）。浏览器用 Playwright 的 headless shell：pnpm exec playwright install --only-shell chromium
 * 测试一律不出网（e2e/support/test.ts）：只测本机静态服务上的预览页 / 对照页 / 组装好的 _site，不访问 prts.wiki 现网。
 *
 *   pnpm e2e                                   全部（snapshots 没有基准、stories / docs 没有 _site 时自动跳过）
 *   pnpm e2e --project=hosts                   跨宿主：对照页在 AKDS 皮肤 / Vector 2022 / 站外上的计算样式必须一样（CI：e2e.yml，不挡部署）
 *   pnpm e2e --project=snapshots -u            重构前：拍整页计算样式基准 → _verify/snapshots/（不入库）
 *   pnpm e2e --project=snapshots               重构后：逐项比对
 *   pnpm e2e --project=stories -g chip         Storybook 每个 story 渲染成功、控制台干净（先 bash scripts/build-site.sh _site）
 *   pnpm e2e --project=docs                    文档站每页不 404、示例 iframe 不空白、控制台干净（同上）
 *   pnpm exec playwright show-report           看 HTML 报告（失败的差异 / 截图 / trace 都在附件里）
 */
import { defineConfig } from '@playwright/test';

const PORT = Number(process.env.E2E_PORT ?? 4180);
const CI = !!process.env.CI;

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results',
  fullyParallel: true,
  forbidOnly: CI,
  retries: CI ? 1 : 0,
  globalTimeout: CI ? 15 * 60_000 : undefined,   // 整次运行的上限；e2e.yml 的 timeout-minutes 比它宽，超时也能写出报告
  failOnFlakyTests: CI,   // 重试只为了在 CI 上留 trace：重试后才过（flaky）照样算失败，不把不稳定藏起来
  reporter: CI ? [['github'], ['list'], ['html', { open: 'never' }]] : [['list'], ['html', { open: 'never' }]],
  webServer: {
    command: 'node e2e/support/server.ts',
    env: { PORT: String(PORT) },
    url: `http://127.0.0.1:${PORT}/preview/gallery.html`,
    reuseExistingServer: !CI,
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    browserName: 'chromium',
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',   // 动画直接落到终态、首页轮播不自动播，快照才稳定
    colorScheme: 'light',
    launchOptions: { args: ['--hide-scrollbars', '--font-render-hinting=none'] },
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'hosts', testMatch: 'hosts.spec.ts' },
    { name: 'snapshots', testMatch: 'snapshots.spec.ts' },
    { name: 'stories', testMatch: 'stories.spec.ts' },
    { name: 'docs', testMatch: 'docs.spec.ts' },
  ],
});
