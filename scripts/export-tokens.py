#!/usr/bin/env python3
"""Export src/tokens.css → tokens/tokens.json (primitive + semantic light/dark)."""
import re, json, pathlib
root = pathlib.Path(__file__).resolve().parent.parent
css = (root / 'src' / 'tokens.css').read_text(encoding='utf-8')
css = re.sub(r'/\*.*?\*/', '', css, flags=re.S)
blocks = re.findall(r'([^{}]+)\{([^{}]*)\}', css)
def decls(body):
    out = {}
    for m in re.finditer(r'(--ak-[\w-]+)\s*:\s*([^;]+);', body):
        out[m.group(1)] = re.sub(r'\s+', ' ', m.group(2).strip())
    return out
prim, light, dark = {}, {}, {}
for sel, body in blocks:
    sel = sel.strip()
    d = decls(body)
    if not d: continue
    if sel == ':root' and 'color-scheme' not in body: prim.update(d)
    elif sel == ':root': light.update(d)
    elif 'data-theme="dark"' in sel or 'clientpref-night' in sel: dark.update(d)
groups = {}
for k, v in prim.items():
    g = k[5:].split('-')[0]
    groups.setdefault(g, {})[k] = v
out = {
  '$name': 'AKDS · Arknights Web Design System tokens',
  '$version': '0.1.0',
  '$sources': {
    'site': 'https://ak.hypergryph.com/ (Next.js CSS: #18D1FF, greys, Bender/Novecento/Oswald/SourceHanSans)',
    'game-sprites': 'torappu unpacked UI sprites (ui/pages/home_page, ui/character/*, arts/*_hub)',
    'gamedata': 'gamedata_const.richTextStyles, sandbox_table.charRarityColorList'
  },
  'primitive': groups,
  'semantic': {'light (archive)': light, 'dark (terminal)': dark}
}
(root / 'tokens' / 'tokens.json').write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding='utf-8')
print('primitive', sum(len(v) for v in groups.values()), 'light', len(light), 'dark', len(dark))
