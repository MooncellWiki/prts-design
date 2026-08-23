#!/usr/bin/env python3
"""preview/_src/{skeleton.html, pages/*.html} → preview/*.html

预览分成多页（基础 / 皮肤骨架 / MediaWiki 内容 / 通用组件 / 方舟组件 / 干员页样例），都跑在同一副皮肤骨架里。
骨架只写一份（_src/skeleton.html，{{占位}}），每页只写 front matter + 正文：

    <!--page
    order: 4                      侧栏「AKDS 预览 · DEMO」里的顺序
    nav: 通用组件                  侧栏文案
    title: AKDS · 通用组件          <title>
    crumb: 首页 > PRTS:皮肤 > 设计系统 > 通用组件    面包屑（最后一项 = 当前页）
    h1: 通用组件 / h1en: Core components              页面标题 + 英文副题
    indicators: <span …>          （可选）页头右上角指示器 HTML
    actions: <li>…</li>           （可选）动作簇 #p-views 里追加的项（如 li#ca-watch ★ 监视）
    lastmod: 2026年8月19日 (三) 22:30
    cats: PRTS 皮肤, 设计系统       底部分类（逗号分隔）；hiddencats: …（可选）隐藏分类
    -->
    <!--head
    <style>…本页私有样式…</style>    （可选）塞进 <head>
    -->
    …正文（放进 .mw-body-content）…

用法：python3 scripts/build-preview.py   （之后 build-dist.py / build-site.sh 照旧处理 preview/*.html）
"""
import re, pathlib, html
root = pathlib.Path(__file__).resolve().parent.parent
src = root / 'preview' / '_src'
out = root / 'preview'
skeleton = (src / 'skeleton.html').read_text(encoding='utf-8')

def parse(text):
    m = re.match(r'\s*<!--page\n(.*?)\n-->\n', text, re.S)
    if not m: raise SystemExit('缺 <!--page … --> front matter')
    meta = {}
    for line in m.group(1).split('\n'):
        k, _, v = line.partition(':')
        meta[k.strip()] = v.strip()
    rest = text[m.end():]
    hm = re.match(r'<!--head\n(.*?)\n-->\n', rest, re.S)
    meta['head'] = hm.group(1) if hm else ''
    body = rest[hm.end():] if hm else rest
    return meta, body

pages = []
for f in sorted((src / 'pages').glob('*.html')):
    meta, body = parse(f.read_text(encoding='utf-8'))
    meta['file'] = f.name
    pages.append((meta, body))
pages.sort(key=lambda p: int(p[0].get('order', 99)))

def crumb(s):
    parts = [p.strip() for p in s.split('>')]
    items = ''.join('<li><a href="#">%s</a></li>' % html.escape(p) for p in parts[:-1])
    return '<ul class="ak-breadcrumb ak-m-0">%s<li aria-current="page">%s</li></ul>' % (items, html.escape(parts[-1]))

for meta, body in pages:
    nav = '\n'.join('        <li%s><a href="%s">%s</a></li>' % (' class="is-active"' if m['file'] == meta['file'] else '', m['file'], m['nav']) for m, _ in pages)
    cats = ''.join('<li><a href="#">%s</a></li>' % c.strip() for c in meta.get('cats', '').split(',') if c.strip())
    hidden = ''.join('<li><a href="#">%s</a></li>' % c.strip() for c in meta.get('hiddencats', '').split(',') if c.strip())
    hiddencats = '<div class="mw-hidden-catlinks mw-hidden-cats-hidden">隐藏分类：\u200b<ul>%s</ul></div>' % hidden if hidden else ''
    page = skeleton
    for k, v in {
        'title': meta['title'], 'head': meta['head'], 'nav': nav, 'crumb': crumb(meta['crumb']),
        'indicators': meta.get('indicators', ''), 'h1': meta['h1'], 'h1en': meta.get('h1en', ''),
        'actions': meta.get('actions', ''), 'content': body.rstrip() + '\n', 'lastmod': meta.get('lastmod', ''), 'cats': cats, 'hiddencats': hiddencats,
    }.items():
        page = page.replace('{{%s}}' % k, v)
    left = re.findall(r'\{\{[a-z0-9]+\}\}', page)
    if left: raise SystemExit('%s: 未填的占位 %s' % (meta['file'], left))
    # 去掉骨架文件头那段「这是模板」的注释（生成物里不需要），换成「生成物勿改」提示
    page = re.sub(r'\A<!-- ═+\n.*?═+ -->\n', '', page, flags=re.S)
    page = page.replace('<!DOCTYPE html>', '<!DOCTYPE html>\n<!-- 生成物：由 scripts/build-preview.py 从 preview/_src/skeleton.html + _src/pages/%s 生成，改源文件再重跑 -->' % meta['file'], 1)
    (out / meta['file']).write_text(page, encoding='utf-8')
    print('%-16s ← %s (%d bytes)' % (meta['file'], 'pages/' + meta['file'], len(page)))
