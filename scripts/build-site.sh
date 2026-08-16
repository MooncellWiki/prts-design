#!/usr/bin/env bash
# 组装 GitHub Pages 站点：preview/ 提到站点根目录，src/ 与 dist/ 原样带上。
# preview 的 HTML 里只有 ../src/ 一种父级相对路径，提根后改写成 src/ 即可。
# 用法：bash scripts/build-site.sh [输出目录]  （默认 _site）
set -euo pipefail

root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
out="${1:-_site}"
[[ "$out" = /* ]] || out="$PWD/$out"

rm -rf "$out"
mkdir -p "$out"

# preview/* → 站点根（index.html / operator.html / preview.js / search-mock.js / assets/）
cp -R "$root/preview/." "$out/"
# 源码目录（CSS/JS 由 HTML 直接引用）
cp -R "$root/src" "$out/src"
# 单文件打包版，用于分享/离线
cp -R "$root/dist" "$out/dist"

# 提根后修正样式/脚本引用
for f in "$out"/*.html; do
  perl -pi -e 's{(?<=")\.\./src/}{src/}g' "$f"
done

# 示例活动主题样式（preview/demo-theme.css）：接口变量里的相对 url() Chromium 按「使用处」(src/skin.css) 解析、Firefox 按「声明处」解析，
# 两者要一致只能让它和 skin.css 同目录 —— 搬进 src/，图片路径 ../preview/assets/ → ../assets/（assets 已随 preview 提到根），HTML 引用改成 src/demo-theme.css
if [[ -f "$out/demo-theme.css" ]]; then
  mv "$out/demo-theme.css" "$out/src/demo-theme.css"
  perl -pi -e 's{\.\./preview/assets/}{../assets/}g' "$out/src/demo-theme.css"
  for f in "$out"/*.html; do
    perl -pi -e 's{(?<=href=")demo-theme\.css}{src/demo-theme.css}g' "$f"
  done
fi

# 保险：不应再有指向站点外的父级相对路径
if grep -rn '"\.\./' "$out"/*.html; then
  echo "build-site: 站点根 HTML 仍存在 ../ 引用，见上方" >&2
  exit 1
fi

echo "build-site: 已生成 $out"
