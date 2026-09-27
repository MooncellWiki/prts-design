<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
</script>

# 缩略图与图库

`base/media.css`：`[[文件:x.png|thumb]]` 和 `<gallery>` 的输出。图片本身是内容，框只做托底：浅底 + 1px 细框、直角，图注与图片之间一道更淡的细线。

## 缩略图

MW 1.40+ 的媒体 DOM 是 `figure[typeof="mw:File/Thumb"] > a > img + figcaption`（旧版 `.thumb` / `.thumbinner` / `.thumbcaption` 同样适配）。`|right` / `|left` / `|center` 输出 `.mw-halign-*`，左右浮动时靠内侧留 20px；放大镜图标 `.magnify` 不显示。手机（≤639）上浮动取消、图片独占一行（规则在[皮肤骨架 · 响应式](/chrome/responsive)）。

## 图库

`<gallery>` 改成弹性布局：卡片间距 12px，不再用 MW 默认给每格写死的内联宽度（`!important` 压过去）；卡片 = 浅底细框 + 12px 灰色图注。`mode="packed"` 的格子按图片自身宽度排。

```html demo
<figure typeof="mw:File/Thumb" class="mw-halign-right" style="width:160px"><a href="#"><img src="assets/avatar/char_003_kalts_2.png" width="150" alt=""></a><figcaption>凯尔希 · 干员头像（示例图注）</figcaption></figure>
<p>浮动缩略图为白/深底 + 1px 边框，图注以细分隔线与图片隔开。图库使用弹性布局，卡片间距 12px，不再使用 MW 默认的固定宽度。</p>
<ul class="gallery mw-gallery-traditional">
  <li class="gallerybox"><div><div class="thumb"><div><img src="assets/skill/chen_1.png" width="72" alt=""></div></div><div class="gallerytext"><p>鞘击</p></div></div></li>
  <li class="gallerybox"><div><div class="thumb"><div><img src="assets/skill/chen_2.png" width="72" alt=""></div></div><div class="gallerytext"><p>赤霄·拔刀</p></div></div></li>
  <li class="gallerybox"><div><div class="thumb"><div><img src="assets/skill/chen_3.png" width="72" alt=""></div></div><div class="gallerytext"><p>赤霄·绝影</p></div></div></li>
</ul>
<div style="clear:both"></div>
```

## 图片

- `img { max-width: 100%; height: auto }`：正文里的大图不会撑破栏宽。⚠ 这条会把只靠 `height="30"` 属性定尺寸的图（Widget 里的 HUD 图标）放回原图高度——干员页的 CharinfoV2 舞台就单独排除了它，见[参考 · 03 §3.6](/reference/mediawiki-integration)。
- `img.ak-pixel`：像素图（小尺寸游戏图标放大）用 `image-rendering: pixelated`，不糊。
- 游戏的白色线稿图标（职业 / 精英 / 势力）加 `.ak-glyph`，亮色主题下自动反相，见[装饰语言](/foundations/decoration#白色线稿图标-ak-glyph)。

## CSS

<CssSelectors :files="['base/media.css']" />
