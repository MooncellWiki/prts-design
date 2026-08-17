#!/usr/bin/env python3
"""Fetch the self-hosted web fonts into src/fonts/ and generate src/fonts.css.

两类来源，都只用标准库、不需要 npm：
  · 官网静态资源（SITE_FONTS）：Novecento Sans Wide / Bender —— 明日方舟官网（ak.hypergryph.com）自托管的 woff2 原文件，
    PRTS.wiki 为官方赞助站点，按与鹰角同一组织下共用授权使用（项目方决定）。URL 钉住当前 hash；官网重新部署后 hash 会变，
    脚本会自动从首页 CSS 里重新发现；再失败就保留已落盘的文件并告警。注意官网给的是 ASCII 子集（各 101 字形），
    非 ASCII 字符（· » — × ° 等）由 tokens.css 链里后面的自托管 OFL 字体逐字接住。
  · Fontsource npm 包（PKG_FONTS）：Noto Sans SC / Oswald / Chakra Petch / JetBrains Mono —— = Google Fonts 同一批 woff2 切片 +
    unicode-range，随包带 OFL 全文，版本钉死。

    python3 scripts/fetch-fonts.py                     # 默认走 registry.npmjs.org
    python3 scripts/fetch-fonts.py --registry https://registry.npmmirror.com   # 国内镜像
    python3 scripts/fetch-fonts.py --offline           # 不下载，只用 src/fonts/ 里已有的文件重新生成 fonts.css

生成物：
    src/fonts/<dir>/*.woff2 + LICENSE | NOTICE.md   字体文件（按族分目录）+ 授权全文 / 来源说明
    src/fonts.css                                  @font-face 声明（url 相对 src/，皮肤侧 resources/fonts → ../../src/fonts 符号链接同样成立）
"""
import argparse, gzip, io, json, pathlib, re, sys, tarfile, urllib.error, urllib.request

ROOT = pathlib.Path(__file__).resolve().parent.parent
FONT_DIR = ROOT / 'src' / 'fonts'
CSS_OUT = ROOT / 'src' / 'fonts.css'
SITE_HOME = 'https://ak.hypergryph.com/'
SITE_CDN = 'https://web.hycdn.cn/arknights/official/_next/static/media/'

# ── 官网静态资源：文件名（去 hash）→ 字重 / 字形；url 为抓取时钉住的完整地址（hash 变了会自动重新发现）
SITE_FONTS = [
    {
        'dir': 'novecento-sans-wide', 'family': 'Novecento Sans Wide', 'license': '商用（Synthview）· 官网同源文件',
        'role': '拉丁展示字（--ak-font-display）',
        'faces': [
            {'file': 'Novecentosanswide-Medium.woff2',    'weight': '500', 'style': 'normal', 'url': SITE_CDN + 'Novecentosanswide-Medium.7a5c757a.woff2'},
            {'file': 'Novecentosanswide-DemiBold.woff2',  'weight': '600', 'style': 'normal', 'url': SITE_CDN + 'Novecentosanswide-DemiBold.e7b6abe4.woff2'},
            {'file': 'Novecentosanswide-Bold.woff2',      'weight': '700', 'style': 'normal', 'url': SITE_CDN + 'Novecentosanswide-Bold.9c78a9fd.woff2'},
            {'file': 'Novecentosanswide-UltraBold.woff2', 'weight': '800', 'style': 'normal', 'url': SITE_CDN + 'Novecentosanswide-UltraBold.e5e00ac9.woff2'},
        ],
    },
    {
        'dir': 'bender', 'family': 'Bender', 'license': 'Jovanny Lemonad · 官网同源文件',
        'role': 'HUD 标签 / 数值（--ak-font-label），也是 --ak-font-display 的第二位',
        'faces': [
            {'file': 'Bender-Regular.woff2', 'weight': '400', 'style': 'normal', 'url': SITE_CDN + 'Bender-Regular.6950ba72.woff2'},
            {'file': 'Bender-Bold.woff2',    'weight': '700', 'style': 'normal', 'url': SITE_CDN + 'Bender-Bold.b4c7998a.woff2'},
        ],
    },
]

# ── Fontsource：npm 包、版本、包内 css（决定 unicode-range 与文件清单）、落盘目录、对外 font-family 名（= tokens.css 链里的名字）、挑选规则
PKG_FONTS = [
    {   # 正文 —— 思源黑体的 Google 构建（Noto Sans CJK SC = Source Han Sans SC），可变字重 100–900，Google 的 101 片切分：页面只下载用到的片
        'pkg': '@fontsource-variable/noto-sans-sc', 'version': '5.3.0', 'css': ['wght.css'],
        'dir': 'noto-sans-sc', 'family': 'Noto Sans SC', 'role': '正文（--ak-font-body）',
        'keep': lambda f: True,
    },
    {   # 压缩字 —— 官网也自托管 Oswald；--ak-font-condensed 的首选、--ak-font-display 在 Novecento / Bender 之后的接字（含非 ASCII）；可变字重 200–700
        'pkg': '@fontsource-variable/oswald', 'version': '5.3.0', 'css': ['wght.css'],
        'dir': 'oswald', 'family': 'Oswald', 'role': '压缩字（--ak-font-condensed）· 展示字缺字接住',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-', f) is not None,
    },
    {   # HUD 标签 / 数值 —— 官网 Bender 只有 ASCII，· » — 等非 ASCII 由同为切角方形的 Chakra Petch 逐字接住；只要 400–700 正体
        'pkg': '@fontsource/chakra-petch', 'version': '5.3.0', 'css': ['latin.css', 'latin-ext.css'],
        'dir': 'chakra-petch', 'family': 'Chakra Petch', 'role': 'HUD 标签 / 数值缺字接住（--ak-font-label 第二位）',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-(400|500|600|700)-normal\.woff2$', f) is not None,
    },
    {   # 等宽 —— 可变字重 100–800，正体 + 斜体（语法高亮的注释用斜体）
        'pkg': '@fontsource-variable/jetbrains-mono', 'version': '5.3.0', 'css': ['wght.css', 'wght-italic.css'],
        'dir': 'jetbrains-mono', 'family': 'JetBrains Mono', 'role': '等宽（--ak-font-mono）',
        'keep': lambda f: re.search(r'-(latin|latin-ext)-', f) is not None,
    },
]

# ───────────────────────────── helpers ─────────────────────────────
def fetch(url, timeout=120):
    req = urllib.request.Request(url, headers={'User-Agent': 'prts-design fetch-fonts', 'Accept-Encoding': 'gzip, identity'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        b = r.read()
        return gzip.decompress(b) if r.headers.get('Content-Encoding') == 'gzip' else b

FACE_RE = re.compile(r'@font-face\s*\{([^}]*)\}', re.S)
def parse_faces(css):
    """Fontsource css → [{style, weight, file, range}]"""
    out = []
    for m in FACE_RE.finditer(css):
        body = m.group(1)
        d = {k.strip(): v.strip() for k, v in re.findall(r'([\w-]+)\s*:\s*([^;]+);', body)}
        f = re.search(r'url\(([^)]+?)\)', d.get('src', ''))
        if not f: continue
        out.append({
            'style': d.get('font-style', 'normal'),
            'weight': d.get('font-weight', '400'),
            'file': pathlib.PurePosixPath(f.group(1).strip('\'"')).name,
            'range': re.sub(r'\s*,\s*', ', ', d.get('unicode-range', '')).upper(),
        })
    return out

_site_index = None
def site_font_urls():
    """官网首页 → 其 CSS → 所有 @font-face 里的 woff2 地址，按去 hash 的文件名索引：{'Bender-Bold.woff2': 'https://…/Bender-Bold.<hash>.woff2'}"""
    global _site_index
    if _site_index is not None: return _site_index
    _site_index = {}
    try:
        html = fetch(SITE_HOME).decode('utf-8', 'ignore')
        for css_url in re.findall(r'href="(https://web\.hycdn\.cn/[^"]+\.css)"', html):
            css = fetch(css_url).decode('utf-8', 'ignore')
            for u in re.findall(r'url\((https://[^)]+?\.woff2)\)', css):
                m = re.match(r'^(.+?)\.[0-9a-f]{8}\.woff2$', pathlib.PurePosixPath(u).name)
                if m: _site_index[m.group(1) + '.woff2'] = u
    except Exception as e:   # noqa
        print('   ! 官网字体重新发现失败：%s' % e)
    return _site_index

def tarball_url(registry, pkg, version):
    return '%s/%s/-/%s-%s.tgz' % (registry.rstrip('/'), pkg, pkg.split('/')[-1], version)

def face_css(family, face, d):
    rng = ' unicode-range: %s;' % face['range'] if face.get('range') else ''
    return ('@font-face { font-family: "%s"; font-style: %s; font-weight: %s; font-display: swap; '
            'src: url("fonts/%s/%s") format("woff2");%s }' % (family, face['style'], face['weight'], d, face['file'], rng))

# ───────────────────────────── main ─────────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--registry', default='https://registry.npmjs.org')
    ap.add_argument('--offline', action='store_true', help='不下载，用 src/fonts/<dir>/_faces.json 重新生成 fonts.css')
    args = ap.parse_args()

    css = ['/*! AKDS — 自托管 Web 字体（scripts/fetch-fonts.py 生成，勿手改；重跑：python3 scripts/fetch-fonts.py）',
           ' *  各族链见 tokens.css「Typography」。url() 相对本文件（src/）；MW 皮肤侧 resources/fonts.css + resources/fonts/ 是指向 src/ 的符号链接，ResourceLoader 按 resources/ 重写路径。',
           ' *  · 官网同源（ak.hypergryph.com 静态资源，ASCII 子集；PRTS 为官方赞助站点，与鹰角同一组织下共用授权）：']
    for s in SITE_FONTS:
        css.append(' *      %-24s → fonts/%s/  · %s' % (s['family'], s['dir'], s['role']))
    css.append(' *  · Fontsource npm 包（= Google Fonts 同批 woff2 切片 + unicode-range，OFL-1.1，版本钉死）：')
    for s in PKG_FONTS:
        css.append(' *      %-45s → fonts/%s/  · %s' % (s['pkg'] + '@' + s['version'], s['dir'], s['role']))
    css.append(' */')
    total = 0

    # 1. 官网静态资源
    for spec in SITE_FONTS:
        d = FONT_DIR / spec['dir']; d.mkdir(parents=True, exist_ok=True)
        meta_path = d / '_faces.json'
        if args.offline:
            faces = json.loads(meta_path.read_text(encoding='utf-8'))
            print('%-40s offline · %d faces' % (spec['family'], len(faces)))
        else:
            print('%-40s ← %s…' % (spec['family'], SITE_CDN)); sys.stdout.flush()
            faces = []
            for face in spec['faces']:
                face = dict(face); target = d / face['file']
                try:
                    data = fetch(face['url'])
                except urllib.error.URLError as e:
                    alt = site_font_urls().get(face['file'])
                    if alt and alt != face['url']:
                        print('   ~ %s 钉住的 hash 已失效，改用官网当前 %s' % (face['file'], alt)); face['url'] = alt
                        data = fetch(alt)
                    elif target.exists():
                        print('   ! %s 下载失败（%s），保留已落盘文件' % (face['file'], e)); data = None
                    else:
                        raise SystemExit('   ✗ %s 下载失败且本地没有：%s' % (face['file'], e))
                if data is not None:
                    assert data[:4] == b'wOF2', face['file'] + ' 不是 woff2'
                    target.write_bytes(data)
                faces.append(face)
            (d / 'NOTICE.md').write_text(
                '# %s\n\n来源：明日方舟官网（%s）自托管的 woff2 原文件（web.hycdn.cn，Next.js 静态资源），未做任何修改。\n'
                '授权：%s。PRTS.wiki 为明日方舟官方赞助站点，按与鹰角网络同一组织下共用授权使用（项目方决定，见 docs/01-design-system.md §2.8）。\n'
                '注意：官网发布的是 ASCII 子集（各 101 字形），非 ASCII 字符由 tokens.css 字体链后段接住。\n\n'
                '| 文件 | 字重 | 抓取地址 |\n|---|---|---|\n%s\n'
                % (spec['family'], SITE_HOME, spec['license'], '\n'.join('| %s | %s | %s |' % (f['file'], f['weight'], f['url']) for f in faces)),
                encoding='utf-8')
            meta_path.write_text(json.dumps(faces, ensure_ascii=False, indent=0), encoding='utf-8')
        size = sum((d / f['file']).stat().st_size for f in faces); total += size
        print('   %d faces · %.0f KB · family "%s"' % (len(faces), size / 1024, spec['family']))
        css += ['', '/* ── %s · 官网同源 · %s */' % (spec['family'], spec['role'])]
        css += [face_css(spec['family'], f, spec['dir']) for f in faces]

    # 2. Fontsource npm 包
    for spec in PKG_FONTS:
        d = FONT_DIR / spec['dir']; d.mkdir(parents=True, exist_ok=True)
        meta_path = d / '_faces.json'
        if args.offline:
            faces = json.loads(meta_path.read_text(encoding='utf-8'))
            print('%-40s offline · %d faces' % (spec['pkg'], len(faces)))
        else:
            url = tarball_url(args.registry, spec['pkg'], spec['version'])
            print('%-40s ← %s' % (spec['pkg'], url)); sys.stdout.flush()
            tgz = fetch(url)
            faces = []
            with tarfile.open(fileobj=io.BytesIO(tgz), mode='r:gz') as tf:
                members = {m.name: m for m in tf.getmembers()}
                def read(name):
                    fh = tf.extractfile(members['package/' + name])
                    assert fh is not None, name
                    return fh.read()
                (d / 'LICENSE').write_bytes(read('LICENSE'))     # 授权全文随族落盘
                # 包内 css → 面清单，按 keep 过滤；静态包（@fontsource/*）的 latin.css 等按子集拆的 css 不写 unicode-range，从包内 unicode.json 按文件名里的子集补上
                unicode_map = json.loads(read('unicode.json').decode('utf-8'))
                seen = set()
                for css_name in spec['css']:
                    for face in parse_faces(read(css_name).decode('utf-8')):
                        if not spec['keep'](face['file']) or face['file'] in seen: continue
                        if not face['range']:
                            sub = re.match(r'^%s-(.+?)-(?:\d+|wght)-(?:normal|italic)\.woff2$' % re.escape(spec['pkg'].split('/')[-1]), face['file'])
                            face['range'] = re.sub(r'\s*,\s*', ', ', unicode_map[sub.group(1)]).upper() if sub and sub.group(1) in unicode_map else ''
                            assert face['range'], 'no unicode-range for ' + face['file']
                        seen.add(face['file'])
                        (d / face['file']).write_bytes(read('files/' + face['file']))
                        faces.append(face)
                for old in d.glob('*.woff2'):     # 清掉本次没选中的旧文件（换字重 / 子集时不留垃圾）
                    if old.name not in seen: old.unlink(); print('   - removed stale', old.name)
            meta_path.write_text(json.dumps(faces, ensure_ascii=False, indent=0), encoding='utf-8')
        size = sum((d / f['file']).stat().st_size for f in faces); total += size
        print('   %d faces · %.0f KB · family "%s"' % (len(faces), size / 1024, spec['family']))
        css += ['', '/* ── %s · %s@%s · OFL · %s */' % (spec['family'], spec['pkg'], spec['version'], spec['role'])]
        css += [face_css(spec['family'], f, spec['dir']) for f in faces]

    CSS_OUT.write_text('\n'.join(css) + '\n', encoding='utf-8')
    print('→ %s (%d faces, %.2f MB of woff2)' % (CSS_OUT.relative_to(ROOT), sum(1 for l in css if l.startswith('@font-face')), total / 1e6))

if __name__ == '__main__':
    main()
