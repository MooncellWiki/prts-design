# Bender

来源：明日方舟官网（https://ak.hypergryph.com/）自托管的 woff2 原文件（web.hycdn.cn，Next.js 静态资源）。
改动：只补了一张 gasp 表（version 1，全字号 0x000F = 含 symmetric smoothing，同 Fontsource 各族），字形 / 度量 / 其它表未动——原文件没有 gasp，Windows 上的 Chrome 对 ≤ 20px 的 Bender Bold 只做横向抗锯齿，曲线出锯齿（scripts/fetch-fonts.py · with_gasp）。
注意：官网发布的是 ASCII 子集（各 101 字形），非 ASCII 字符由 tokens.css 字体链后段接住。

| 文件 | 字重 | 抓取地址 |
|---|---|---|
| Bender-Regular.woff2 | 400 | https://web.hycdn.cn/arknights/official/_next/static/media/Bender-Regular.6950ba72.woff2 |
| Bender-Bold.woff2 | 700 | https://web.hycdn.cn/arknights/official/_next/static/media/Bender-Bold.b4c7998a.woff2 |
