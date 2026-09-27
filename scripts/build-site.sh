#!/usr/bin/env bash
# 组装 GitHub Pages 站点（CI 与本地同一脚本；需要先 pnpm install）：
#   /             文档站（VitePress，site/；site/public 里链着 preview/ 与 src/，构建时一并拷进来）
#   /preview/     预览站：整页样例 home / operator（按 ../src/ 引样式 → /src/，素材在 /preview/assets/）
#   /src/         CSS / 字体 / 皮肤共用脚本
#   /storybook/   Storybook
#   /dist/        单文件打包版（按 ../src/fonts/ 引思源黑体 → /src/fonts/）
# 旧地址留跳转页：预览站原来在站点根目录（/components.html …），后来在 /preview/；5 张展示页（index / chrome / mediawiki / components / arknights）已退役，内容在文档站。
# 用法：bash scripts/build-site.sh [输出目录]   （默认 _site；站点 base 默认 /prts-design/，本地根目录自查用 AKDS_BASE=/）
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="${1:-_site}"
[[ "$out" = /* ]] || out="$PWD/$out"
base="${AKDS_BASE:-/prts-design/}"

cd "$root"
node scripts/css-order.ts                      # skin.json 与 index.css 同序，否则失败
node scripts/sprite-sync.ts                    # 图标：骨架 sprite / 皮肤模板 sprite / icons.ts 三处一致，否则失败
AKDS_BASE="$base" pnpm build:docs
pnpm build:storybook

rm -rf "$out"
mkdir -p "$out"
cp -R site/.vitepress/dist/. "$out/"
rm -rf "$out/preview/_src"                      # 页面源（scripts/build-preview.py 的输入），不上站
cp -R _build/storybook "$out/storybook"
cp -R dist "$out/dist"

# 跳转页：redirect <输出文件> <目标> <站点首页>（目标、首页都相对输出文件）
redirect() {
  printf '<!DOCTYPE html>\n<meta charset="utf-8">\n<title>已移至 %s</title>\n<meta http-equiv="refresh" content="0; url=%s">\n<link rel="canonical" href="%s">\n<p>已移到 <a href="%s">%s</a>；设计系统文档在 <a href="%s">站点首页</a>。</p>\n' \
    "$2" "$2" "$2" "$2" "$2" "$3" > "$1"
}
for p in home operator; do redirect "$out/$p.html" "preview/$p.html" "./"; done
# 退役的展示页 → 文档站（根目录旧地址与 /preview/ 下的地址都留；根目录的 index.html 就是文档站首页，不覆盖）
for pair in index: chrome:chrome/ mediawiki:content/ components:components/ arknights:components/; do
  p="${pair%%:*}"; to="${pair#*:}"
  [[ "$p" = index ]] || redirect "$out/$p.html" "./$to" "./"
  redirect "$out/preview/$p.html" "../$to" "../"
done

# 保险：预览页里不应有指向站点外的父级路径（../src/ 从 /preview/ 出发正好是 /src/）
if grep -ln '"\.\./\.\./' "$out"/preview/*.html; then
  echo "build-site: 预览页里有越出站点根的 ../../ 引用，见上方" >&2
  exit 1
fi

echo "build-site: 已生成 $out"
