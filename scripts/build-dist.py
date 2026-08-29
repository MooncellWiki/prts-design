#!/usr/bin/env python3
"""Bundle preview/*.html into self-contained single files (inline CSS/JS, images → data URIs) under dist/.
Images are downscaled (max 256px) to keep the bundle small."""
import re, base64, io, pathlib, sys, json
from PIL import Image
root = pathlib.Path(__file__).resolve().parent.parent
prev = root / 'preview'
dist = root / 'dist'; dist.mkdir(exist_ok=True)
MAX = 256
cache = {}
def img_uri(rel):
    if rel in cache: return cache[rel]
    p = (prev / rel).resolve()
    if not p.exists(): print('  missing', rel); return rel
    if p.suffix == '.svg':   # 页脚徽章等矢量图：原样内联
        uri = 'data:image/svg+xml;base64,' + base64.b64encode(p.read_bytes()).decode()
        cache[rel] = uri; return uri
    if rel.startswith('assets/keyart/') or p.suffix in ('.jpg', '.jpeg'):   # 示例活动主题的头图 / 站标、首页横幅（assets/mainpage/banner-*.jpg，已压到 960 宽）：整幅内联，不缩到 256（jpg 保持 jpg）
        mime = 'image/jpeg' if p.suffix in ('.jpg', '.jpeg') else 'image/png'
        uri = 'data:%s;base64,' % mime + base64.b64encode(p.read_bytes()).decode()
        cache[rel] = uri; return uri
    im = Image.open(p).convert('RGBA')
    # 按显示尺寸定上限：小图标（道具 ≤ 56px / 潜能 · 精英 · 专精 · 稀有度 · 分支 ≤ 28px）128 够 2x，同一枚道具在干员页里会重复内联十几次，256 会把包撑到 15MB；
    # 干员页舞台素材（立绘 / 势力 logo，透明 png）256 在 1024×576 的舞台上会糊，压到 720；场景图是 jpg，走上面那条原样内联
    cap = 720 if rel.startswith('assets/charinfo/') else 128 if rel.startswith(('assets/item/', 'assets/potential/', 'assets/elite/', 'assets/specialized/', 'assets/rarity/', 'assets/subprofession/')) else MAX
    if max(im.size) > cap: im.thumbnail((cap, cap), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    uri = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
    cache[rel] = uri; return uri
FONT_LINK_ONLY = ('fonts/noto-sans-sc/',)   # 思源黑体 101 片共 4.4MB 不内联，指回 ../src/fonts/；拉丁字体（Oswald / Chakra Petch / JetBrains Mono，合计 ≈ 240KB）内联进单文件
font_stats = {'inline': 0, 'linked': 0}
def font_uri(css_path, rel):
    p = (css_path.parent / rel).resolve()
    if not p.exists(): print('  missing font', rel); return rel
    if not rel.startswith(FONT_LINK_ONLY):
        font_stats['inline'] += 1
        return 'data:font/woff2;base64,' + base64.b64encode(p.read_bytes()).decode()
    font_stats['linked'] += 1
    return '../src/' + rel     # dist/ 与 src/ 同级（仓库里、Pages 站点里都是）；另存离线时退到 tokens.css 链后段的装机 / 系统字
def css_inline(path):
    css = path.read_text(encoding='utf-8')
    # demo-theme.css 里的 url("../preview/assets/…")（见该文件头注释：Chromium 按使用处解析自定义属性里的相对 url）与其余 css 的 url("assets/…") 都内联
    css = re.sub(r'url\("(?:\.\./preview/)?assets/([^"]+)"\)', lambda m: 'url("%s")' % img_uri('assets/' + m.group(1)), css)
    # fonts.css 的 url("fonts/…")：小的内联、大的指回 src/
    css = re.sub(r'url\("(fonts/[^"]+)"\)', lambda m: 'url("%s")' % font_uri(path, m.group(1)), css)
    # vendor/ 下第三方 css 里相对自身的 url(img/…)（现网 charinfo 样式表引的 HUD 图标）
    if path.is_relative_to(prev / 'vendor'):
        css = re.sub(r'url\((img/[^)"\']+)\)', lambda m: 'url(%s)' % img_uri(str((path.parent / m.group(1)).relative_to(prev))), css)
    return css
for name in sorted(f.name for f in prev.glob('*.html')):   # preview/*.html 全部打包（_src/ 是页面源，不在此列）
    html = (prev / name).read_text(encoding='utf-8')
    # css links（干员页里现网 Widget:CharinfoV2 的两条 <link> 带 media=…（桌面 / 手机各一份），保留到 <style media> 上）
    def repl_css(m):
        href = m.group(1); p = (prev / href).resolve()
        return '<style%s>\n%s\n</style>' % (m.group(2) or '', css_inline(p))
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)"( media="[^"]*")?\s*/?>', repl_css, html)   # 现网 Widget 那两条是 XHTML 写法 " />"
    # js（preview.js、共用的 src/sidebar-tree.js / src/search-palette.js、search-mock.js 都内联）
    def repl_js(m):
        js = (prev / m.group(1)).resolve().read_text(encoding='utf-8')
        if m.group(1) == 'search-mock.js':   # 演示数据里动态拼接的图片：注入 data URI 表（见 search-mock.js 的 asset()）
            rels = set('avatar/%s.png' % a for a in re.findall(r"char_\d+_[a-z0-9]+_(?:1p|2)", js))
            rels |= set('item/%s.png' % i for i in re.findall(r"\[ '[^']*', '([0-9a-z_]+)', [1-6],", js))
            rels |= set('profession/%s.png' % c for c in ['warrior','sniper','caster','medic','pioneer','tank','support','special'])
            amap = {r: img_uri('assets/' + r) for r in sorted(rels) if (prev / 'assets' / r).exists()}
            js = 'window.AKDS_ASSET_MAP = %s;\n%s' % (json.dumps(amap), js)
        return '<script>\n%s\n</script>' % js
    html = re.sub(r'<script src="((?:\.\./src/|vendor/[\w./-]+/|)[\w.-]+\.js)"></script>', repl_js, html)   # vendor/：首页的 Swiper（preview/vendor/swiper/）、干员页的 jQuery + 现网 charinfo 脚本（preview/vendor/jquery/ charinfo/）也内联
    html = re.sub(r"url\('(vendor/[^']+\.(?:TTF|ttf))'\)", lambda m: "url('data:font/ttf;base64,%s')" % base64.b64encode((prev / m.group(1)).read_bytes()).decode(), html)   # 干员页舞台 Widget 自带的 @font-face 'charname'（vendor/charinfo/Charname_min_*.TTF，200KB）
    # images
    html = re.sub(r'(src|href|data-img)="((?:assets|vendor)/[^"]+\.(?:png|jpg|jpeg|svg))"', lambda m: '%s="%s"' % (m.group(1), img_uri(m.group(2))), html)   # data-img：首页 Hero 候选列表里给脚本换图用的横幅；vendor/：干员页舞台的 HUD 图标
    html = re.sub(r'url\((assets/[^)"]+\.(?:png|jpg|jpeg|svg))\)', lambda m: 'url(%s)' % img_uri(m.group(1)), html)   # 行内 style 里的 url()：首页入口图标（mask-image 走自定义属性 --i）
    # cross links between the two pages → keep relative (both in dist)
    # theme default note: artifacts render in viewer theme; keep script default
    # artifact skeleton strips <html>/<body> tags → restore body class + set a product-like title
    html = html.replace('<body class="skin-akds">', '<body class="skin-akds"><script>document.body.classList.add("skin-akds");</script>')
    html = html.replace('<title>AKDS · 明日方舟网页设计系统</title>', '<title>明日方舟网页设计系统 AKDS</title>').replace('<title>陈 - PRTS · 干员页样例</title>', '<title>干员页样例 · 陈</title>').replace('<title>首页 - PRTS · 首页设计稿</title>', '<title>首页设计稿 · PRTS</title>')
    # cross-links between the two published artifacts
    html = html.replace('href="home.html"', 'href="https://claude.ai/code/artifact/4c4b164a-8459-43e4-8e81-a3df7d566618"').replace('href="operator.html"', 'href="https://claude.ai/code/artifact/0b7e2137-5569-416d-8f3a-620b12ce81a2"').replace('href="index.html', 'href="https://claude.ai/code/artifact/f04aa56e-c8bb-4491-ae2c-7711f330d396')
    (dist / name).write_text(html, encoding='utf-8')
    print(name, '->', round((dist / name).stat().st_size / 1e6, 2), 'MB', 'images', len(cache), 'fonts inline/linked', font_stats['inline'], font_stats['linked'])
    font_stats['inline'] = font_stats['linked'] = 0
