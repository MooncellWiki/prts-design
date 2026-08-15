#!/usr/bin/env python3
"""Bundle preview/*.html into self-contained single files (inline CSS/JS, images → data URIs) under dist/.
Images are downscaled (max 256px) to keep the bundle small."""
import re, base64, io, pathlib, sys
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
    im = Image.open(p).convert('RGBA')
    if max(im.size) > MAX: im.thumbnail((MAX, MAX), Image.LANCZOS)
    buf = io.BytesIO(); im.save(buf, 'PNG', optimize=True)
    uri = 'data:image/png;base64,' + base64.b64encode(buf.getvalue()).decode()
    cache[rel] = uri; return uri
def css_inline(path):
    css = path.read_text(encoding='utf-8')
    return re.sub(r'url\("assets/([^"]+)"\)', lambda m: 'url("%s")' % img_uri('assets/' + m.group(1)), css)
for name in ['index.html', 'operator.html']:
    html = (prev / name).read_text(encoding='utf-8')
    # css links
    def repl_css(m):
        href = m.group(1); p = (prev / href).resolve()
        return '<style>\n%s\n</style>' % css_inline(p)
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', repl_css, html)
    # js（preview.js 与共用的 src/sidebar-tree.js 都内联）
    html = re.sub(r'<script src="((?:\.\./src/|)[\w.-]+\.js)"></script>', lambda m: '<script>\n%s\n</script>' % (prev / m.group(1)).resolve().read_text(encoding='utf-8'), html)
    # images
    html = re.sub(r'(src|href)="(assets/[^"]+\.png)"', lambda m: '%s="%s"' % (m.group(1), img_uri(m.group(2))), html)
    # cross links between the two pages → keep relative (both in dist)
    # theme default note: artifacts render in viewer theme; keep script default
    # artifact skeleton strips <html>/<body> tags → restore body class + set a product-like title
    html = html.replace('<body class="skin-akds">', '<body class="skin-akds"><script>document.body.classList.add("skin-akds");</script>')
    html = html.replace('<title>AKDS · 明日方舟网页设计系统</title>', '<title>明日方舟网页设计系统 AKDS</title>').replace('<title>陈 - PRTS · 干员页样例</title>', '<title>干员页样例 · 陈</title>')
    # cross-links between the two published artifacts
    html = html.replace('href="operator.html"', 'href="https://claude.ai/code/artifact/0b7e2137-5569-416d-8f3a-620b12ce81a2"').replace('href="index.html', 'href="https://claude.ai/code/artifact/f04aa56e-c8bb-4491-ae2c-7711f330d396')
    (dist / name).write_text(html, encoding='utf-8')
    print(name, '->', round((dist / name).stat().st_size / 1e6, 2), 'MB', 'images', len(cache))
