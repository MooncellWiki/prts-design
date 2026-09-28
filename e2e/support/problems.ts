import type { Page, TestInfo } from '@playwright/test';

/** 截图进报告：本地每个都截（报告就是一份总览），CI 上只截失败的（每页都截报告有六十多 MB） */
export const shouldShoot = (testInfo: TestInfo) => !process.env.CI || testInfo.errors.length > 0;

/**
 * 收集控制台错误 / 警告、未捕获异常、失败的请求与 HTTP 4xx / 5xx（favicon 404、Vite / DevTools 提示之类的噪声除外）。
 * 不算问题的：net::ERR_BLOCKED_BY_CLIENT（测试不出网，外站请求是 support/test.ts 拦的，只在注解里记个数）；
 * net::ERR_ABORTED（请求被取消：示例 iframe 重新装载、图片换了地址）。
 */
export function collectProblems(page: Page, testInfo: TestInfo) {
  const problems: string[] = [];
  let blocked = 0;
  page.on('console', m => {
    if (m.type() !== 'error' && m.type() !== 'warning') return;
    const t = m.text();
    const url = m.location()?.url ?? '';
    if (/favicon|\[vite\]|Download the Vue Devtools|DevTools/i.test(t + url)) return;
    if (/^Failed to load resource/.test(t)) return;   // 同一个请求 requestfailed / response 里已经报了带地址的
    problems.push(`${m.type()}: ${t.slice(0, 300)}${url ? `  @ ${url}` : ''}`);
  });
  page.on('pageerror', e => problems.push(`pageerror: ${String(e).slice(0, 300)}`));
  page.on('requestfailed', r => {
    const err = r.failure()?.errorText ?? '';
    if (err.startsWith('net::ERR_BLOCKED_BY_CLIENT')) {   // support/test.ts 拦的（Playwright 报成 net::ERR_BLOCKED_BY_CLIENT.Inspector）
      if (!blocked++) testInfo.annotations.push({ type: 'offline', description: '' });
      return;
    }
    if (err !== 'net::ERR_ABORTED' && !/favicon/.test(r.url())) problems.push(`requestfailed（${err}）: ${r.url()}`);
  });
  page.on('response', r => { if (r.status() >= 400 && !/favicon/.test(r.url())) problems.push(`HTTP ${r.status()}: ${r.url()}`); });
  page.on('close', () => { const a = testInfo.annotations.find(x => x.type === 'offline'); if (a) a.description = `拦下 ${blocked} 个外站请求（测试不出网）`; });
  return problems;
}
