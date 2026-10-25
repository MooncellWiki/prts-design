#!/usr/bin/env python3
"""把游戏的后勤技能数据整理成快照 preview/vendor/riic/data.js，给整页样例 preview/riic.html（后勤技能一览）用。

    python3 scripts/build-riic-data.py --gamedata <torappu 解包出的 gamedata 目录>     （目录下有 excel/building_data.json 等）

现网「后勤技能一览」是 {{后勤技能信息/store}} 的 Cargo 输出（10 个设施各一张 wikitable：图标 / 名称 / 描述 / 持有干员），
没有可读的结构化数据可抓；游戏数据（building_data）本来就是这页的源头，而且带着现网没有的字段——设施 roomType、
游戏里的次序 sortId、类别 buffCategory（产出 / 功能 / 恢复，几乎跟设施走，页面没用它）、效率 efficiency 与作用对象 targets（进驻面板按效率排序用）、
技能名条的底色 buffColor / 字色 textColor。所以这页直接从 gamedata 出快照，取三张表：
  excel/building_data.json   buffs（每条技能）· chars（每位干员的技能槽：buffChar[i].buffData = 这一槽按精英阶段依次替换的技能链，cond 是解锁条件）·
                             rooms（设施名）· buffSortData（制造站 / 加工站 / 训练室的作用对象分组）
  excel/character_table.json 干员名 / 稀有度 / 职业 / 分支
  excel/gamedata_const.json  termDescriptionDict（描述里 <$cc.xxx> 术语的名字与解释）· richTextStyles（<@cc.vup> 这几种富文本标签）
描述的富文本在这里就转成 HTML（<@cc.vup> → .ak-rt-vup，<$cc.x> → .ak-rt-term + data-ak-tip 术语解释），页面脚本不再解析。
图标不入库：技能图标按 skillIcon 从 torappu.prts.wiki 取（同现网），头像按 charId 从 torappu.prts.wiki 取。
"""
import argparse, datetime, json, pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / 'preview' / 'vendor' / 'riic'

# 设施：游戏 rooms 表的次序（CONTROL … MEETING；活动室 / 电梯 / 走廊没有技能，不收），同现网页面各章节的次序。
# halo = 游戏进驻面板技能图标的光环色（arts/building/buffs/buff_image_config，按 RoomType），给暗色主题当设施色；
# 亮色主题的设施色取这一设施技能名条的底色 buffColor（building_data 里每个设施只有一种）。
ROOMS = [
    ('CONTROL', 'control', '#00E4D7'), ('POWER', 'power', '#8FC31F'), ('MANUFACTURE', 'manufacture', '#FFCC00'), ('TRADING', 'trading', '#2ABDFF'),
    ('DORMITORY', 'dormitory', '#2AFFED'), ('WORKSHOP', 'workshop', '#E3EB00'), ('HIRE', 'hire', '#DCDCDC'), ('TRAINING', 'training', '#D20039'),
    ('RECYCLE', 'recycle', '#6CCBCB'), ('MEETING', 'meeting', '#FF6534'),
]
# 作用对象（buffSortData.efficiencyTargetDict）在游戏里的叫法：制造站 / 加工站是产物，训练室是职业
TARGET_LABELS = {
    'gold': '贵金属', 'exp': '作战记录', 'diamond': '源石碎片',
    'building': '基建材料', 'evolve': '精英材料', 'skill': '技巧概要', 'asc': '芯片',
    'pioneer': '先锋', 'warrior': '近卫', 'tank': '重装', 'sniper': '狙击', 'caster': '术师', 'medic': '医疗', 'support': '辅助', 'special': '特种',
}
RICH = {'cc.vup': 'ak-rt-vup', 'cc.vdown': 'ak-rt-vdown', 'cc.kw': 'ak-rt-kw', 'cc.rem': 'ak-rt-rem'}
RARITY = {'TIER_1': 0, 'TIER_2': 1, 'TIER_3': 2, 'TIER_4': 3, 'TIER_5': 4, 'TIER_6': 5}
PHASE = {'PHASE_0': 0, 'PHASE_1': 1, 'PHASE_2': 2}
TAG = re.compile(r'<(@[\w.]+|\$[\w.]+)>|</>')


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def parse(s):
    """游戏富文本 → 树：[('text', str) | ('tag', name, children)]；<@x> / <$x> 开标签，</> 关标签。"""
    root, stack = [], []
    pos = 0
    for m in TAG.finditer(s):
        text = s[pos:m.start()]
        if text:
            (stack[-1][2] if stack else root).append(('text', text))
        if m.group(0) == '</>':
            if not stack:
                raise ValueError(f'多出的 </>：{s!r}')
            node = stack.pop()
            (stack[-1][2] if stack else root).append(node)
        else:
            stack.append(('tag', m.group(1), []))
        pos = m.end()
    if s[pos:]:
        (stack[-1][2] if stack else root).append(('text', s[pos:]))
    if stack:
        raise ValueError(f'没关上的标签 {stack[-1][1]}：{s!r}')
    return root


def plain(nodes):
    return ''.join(n[1] if n[0] == 'text' else plain(n[2]) for n in nodes)


def html(nodes, terms, unknown):
    out = []
    for n in nodes:
        if n[0] == 'text':
            out.append(esc(n[1]))
            continue
        name, children = n[1], n[2]
        inner = html(children, terms, unknown)
        if name.startswith('@'):
            cls = RICH.get(name[1:])
            if not cls:
                unknown.add(name); out.append(inner); continue
            out.append(f'<span class="{cls}">{inner}</span>')
        else:
            term = terms.get(name[1:])
            if not term:
                unknown.add(name); out.append(inner); continue
            out.append(f'<span class="ak-rt-term ak-tip--wide" data-ak-tip="{esc(term)}">{inner}</span>')
    return ''.join(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    ap.add_argument('--gamedata', required=True, type=pathlib.Path, help='torappu 解包出的 gamedata 目录（含 excel/）')
    args = ap.parse_args()
    excel = args.gamedata / 'excel'
    load = lambda name: json.loads((excel / name).read_text(encoding='utf-8'))
    bd, ct, gc = load('building_data.json'), load('character_table.json'), load('gamedata_const.json')
    version = args.gamedata.name   # torappu 按资源版本号建目录（26-10-14-13-45-10-…）
    for key, tpl in gc['richTextStyles'].items():
        if key in RICH and '<color=' not in tpl:
            raise SystemExit(f'richTextStyles.{key} 不再是颜色标签：{tpl}')

    # 术语：名字 + 解释（解释里的富文本只留文字，换行改成空格——提示框里是一段话）
    terms = {}
    for tid, t in gc['termDescriptionDict'].items():
        terms[tid] = f"{t['termName']}：{' '.join(plain(parse(t['description'])).split())}"

    room_index = {rid: i for i, (rid, _, _) in enumerate(ROOMS)}
    unknown = set()
    buffs_raw = sorted(bd['buffs'].values(), key=lambda b: (room_index.get(b['roomType'], 99), b['sortId'], b['buffId']))
    bad = [b['buffId'] for b in buffs_raw if b['roomType'] not in room_index]
    if bad:
        raise SystemExit(f'有技能的 roomType 不在 ROOMS 里：{bad[:5]}')
    buff_index = {b['buffId']: i for i, b in enumerate(buffs_raw)}
    buffs = []
    for b in buffs_raw:
        tree = parse(b['description'])
        buffs.append({
            'id': b['buffId'], 'name': b['buffName'], 'room': b['roomType'], 'cat': b['buffCategory'], 'icon': b['skillIcon'],
            'color': b['buffColor'], 'fg': b['textColor'], 'sortId': b['sortId'], 'eff': b['efficiency'], 'targets': b['targets'],
            'desc': html(tree, terms, unknown), 'holders': [],
        })
    if unknown:
        raise SystemExit(f'描述里有不认识的标签：{sorted(unknown)}')

    # 干员：只收 building_data 里有的（= 现网「持有干员」那 432 位；预备干员 / 召唤物没有后勤技能）
    chars = []
    for cid, c in bd['chars'].items():
        info = ct.get(cid)
        if not info:
            raise SystemExit(f'building_data.chars 里的 {cid} 不在 character_table 里')
        chars.append({
            'id': cid, 'name': info['name'], 'rarity': RARITY[info['rarity']], 'prof': info['profession'], 'sub': info['subProfessionId'],
            'slots': [[{'b': buff_index[x['buffId']], 'phase': PHASE[x['cond']['phase']], 'level': x['cond']['level']} for x in slot['buffData']] for slot in c['buffChar']],
        })
    chars.sort(key=lambda c: (-c['rarity'], c['id']))   # 稀有度高的在前，同稀有度按 charId（≈ 实装先后）
    for ci, c in enumerate(chars):
        for si, slot in enumerate(c['slots']):
            for step, x in enumerate(slot):
                buffs[x['b']]['holders'].append({'c': ci, 'slot': si, 'step': step, 'phase': x['phase'], 'level': x['level']})
    empty = [b['name'] for b in buffs if not b['holders']]
    if empty:
        print(f'注意：{len(empty)} 条技能没有持有干员：{empty[:8]}', file=sys.stderr)

    rooms = []
    for rid, glyph, halo in ROOMS:
        mine = [b for b in buffs if b['room'] == rid]
        colors = {b['color'].lower() for b in mine}
        color = max(colors, key=lambda c: sum(1 for b in mine if b['color'].lower() == c))
        sort = bd['buffSortData'].get(rid, {})
        targets = [{'id': k, 'label': TARGET_LABELS[k], 'targets': v['targets']}
                   for k, v in sorted(sort.get('efficiencyTargetDict', {}).items(), key=lambda kv: kv[1]['sortId']) if k != 'all']
        rooms.append({'id': rid, 'name': bd['rooms'][rid]['name'], 'glyph': glyph, 'color': color, 'halo': halo, 'category': bd['rooms'][rid]['category'],
                      'effSort': bool(sort.get('hasEfficiencySort')), 'targets': targets, 'count': len(mine)})

    date = datetime.date.today().isoformat()
    data = {'date': date, 'version': version, 'rooms': rooms, 'buffs': buffs, 'chars': chars}
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / 'data.js').write_text(
        f'/* 后勤技能数据快照（{date} 由 scripts/build-riic-data.py 从游戏数据 {version} 的 building_data / character_table / gamedata_const 生成；'
        f'{len(buffs)} 条技能、{len(chars)} 位干员）。许可见同目录 NOTICE.md。 */\n'
        f'window.PRTS_RIIC = {json.dumps(data, ensure_ascii=False, separators=(",", ":"))};\n', encoding='utf-8')
    (OUT / 'NOTICE.md').write_text(f'''# 后勤技能数据快照

`data.js` 是游戏数据（torappu 解包的 gamedata `{version}`：`excel/building_data.json` 的 buffs / chars / rooms / buffSortData、
`excel/character_table.json` 的干员名 / 稀有度 / 职业、`excel/gamedata_const.json` 的术语表与富文本样式）整理成的快照，
{date} 由 `scripts/build-riic-data.py` 生成，共 {len(buffs)} 条技能、{len(chars)} 位干员。

- 游戏数据版权归鹰角网络所有，不在本仓库 MIT 许可范围内。
- 只给整页样例 `preview/riic.html` 用；技能图标与头像不入库，页面运行时从 `torappu.prts.wiki` 取。
- 重新生成：`python3 scripts/build-riic-data.py --gamedata <gamedata 目录>`。
''', encoding='utf-8')
    print(f'{OUT / "data.js"}：{len(buffs)} 条技能、{len(chars)} 位干员、{len(rooms)} 个设施、{len(terms)} 条术语（gamedata {version}）')


if __name__ == '__main__':
    main()
