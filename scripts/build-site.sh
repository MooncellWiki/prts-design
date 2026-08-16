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

# 保险：不应再有指向站点外的父级相对路径
if grep -rn '"\.\./' "$out"/*.html; then
  echo "build-site: 站点根 HTML 仍存在 ../ 引用，见上方" >&2
  exit 1
fi

echo "build-site: 已生成 $out"
