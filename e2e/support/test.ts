/**
 * e2e 一律不出网：只放行本机静态服务（playwright.config.ts 的 webServer），别的请求——页面里 media / static / torappu.prts.wiki 的图、
 * 现网 Widget、Vector 夹具里 https://prts.wiki/… 的图标——在浏览器里就拦下（net::ERR_BLOCKED_BY_CLIENT），测试不访问现网。
 * 各组从这里取 test / expect；自己开的上下文（hosts 一个用例开两个页面）用 offline() 同样拦。
 */
import { test as base, type BrowserContext } from '@playwright/test';

const LOCAL = /^https?:\/\/127\.0\.0\.1[:/]/;

export async function offline(context: BrowserContext) {
  await context.route(url => !LOCAL.test(url.href), route => route.abort('blockedbyclient'));
}

export const test = base.extend({
  context: async ({ context }, use) => {
    await offline(context);
    await use(context);
  },
});

export { expect } from '@playwright/test';
