<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 阅读设置

prts 并成 Arknights 单皮肤、`m.` 域名回主域之后，手机版（Minerva + MobileFrontend）的两样读者偏好没了：**章节折叠**（`Special:MobileOptions` 的「展开章节」）和**字号**（「文本」三档）。皮肤把它们连同**外观三态**（原来页眉上常驻的三格开关）一起做成页眉上的一张面板，同 Vector 2022 的「外观」菜单；另有一页 `Special:ReadingPreferences` 兜底（无 JS、可直链）。

- **入口**：页眉一枚眼镜图标 `a.ak-header__prefs`（`i-glasses`，同 `.ak-btn--icon` 的 36px 图标钮；眼镜 = 外观 / 阅读，同 Vector 2022「外观」菜单的图标，不用齿轮——用户菜单里「参数设置」已经是齿轮）。它在工具区铃铛左边，<1120 随工具进 ⋮ 卡片的第一行（眼镜 · 通知）；点开面板时卡片收起。
- **面板**：`<dialog class="ak-menu ak-menu--right ak-prefs-panel">`，放在 `</header>` 之后、不在页眉子树里（页眉里语义令牌被重映射成黑页眉配色，面板要跟亮 / 暗主题走，同正文），DOM 只此一份、两种开法——≥640 `show()`，非模态、`position: fixed` 贴页眉下沿、右缘对齐工具区的 `.ak-menu` 卡片（同用户菜单的卡片：1px 框 + 大阴影 + 6px 间距，不画顶部亮线；点外面 / Esc 收起）；≤639 `showModal()`，页面正中（同 `.ak-dialog`：遮罩 + 轻微毛玻璃，锁页面滚动，点遮罩 / Esc 收起）。抬头 `a.ak-menu__head` = 眼镜 + 「阅读设置」+ 右端箭头，整块链到特殊页面——同用户菜单抬头链到用户页，没有另外的「整页打开」和 ×。
- **无 JS**：眼镜就是一条链接，去 `Special:ReadingPreferences`——`form.ak-prefs` 真表单（`fieldset.ak-pref` = 标签 + label + radio 的分段开关，不放说明灰字；选中态由 `label:has(input:checked)` 画），POST 回特殊页面，服务端写 cookie / 用户选项后 302 回 `returnto`（同 `MobileOptions::submitSettingsForm`）；有 JS 时同一页上改一下立刻生效，「保存」藏起，留「恢复默认设置」（各项设回默认）与「返回」（同源来路时 `history.back()`，还原阅读位置；否则照 `returnto` 链接走）。无 JS 时「恢复默认设置」是 `name=reset` 的提交，服务端清掉偏好。曾试过把偏好塞进 ⋮ 卡片、也试过只做特殊页面：前者 <1120 占了半张卡，后者改个字号要离开当前页、回来丢阅读位置。
- **外观**：跟随系统 / 亮 / 暗 = `skin-theme` 的 `os` / `day` / `night`，MW 1.43 核心的那项（`skin.json` 里早已登记）；与原来页眉三格开关同一套值，`chrome/theme-toggle.css` 仍保留给别处用。
- **章节折叠默认模式**：展开 / 窄屏收起（≤639，= 原 Minerva）/ 收起——见[章节折叠](/content/toc#章节折叠)。
- **字号**：极小 / 小 / 中 / 大 = `xsmall` 12px / `small` 14 / `regular` 16（默认，就是现在的大小）/ `large` 20。「大」照 prts 老皮肤 Minerva（MobileFrontend `mf-font-size` 的 large 20px，只缩放 `p`、行高 1.5）；「极小」= 现网 `MediaWiki:Mobile.css` 在手机（≤640）上给 `.wikitable` / `.infobox` 的 `x-small`（关键字本是 10px，Chrome 中文环境的最小字号 12 把它托到 12，devtools 里看到的就是 12px；`body` 那条 `small` 是 13）——老手机版读者看惯的表格大小；「小」14 = Vector 现网的正文。MF 自己没有 x-small 档；它那档 18px「中等」有了 16 的「中」就不要了。这里换的是 `.mw-body-content` 里的字号令牌（`base/typography.css`），正文 / 组件 / 模板整体换档，标题跟着走，极小档的小字令牌托底 11px；页眉 / 侧栏 / 目录 / 页面标题不动。格子里的字就是那一档的大小。
- **表格字号**：跟随正文 / 极小 = `auto`（默认）/ `xsmall` 12px，`base/tables.css` 作用于 wikitext 表格、Cargo / 数据表、`.ak-table`、infobox（`.ak-dense` 紧凑表不动）。单独一项，是因为现网手机版就是「正文 13、表格 12」的搭配——有人要的是正文正常、表格更小，不是整体缩。

去[干员页样例](https://mooncellwiki.github.io/prts-design/preview/operator.html)点页眉的眼镜，或看[阅读设置页样例](https://mooncellwiki.github.io/prts-design/preview/prefs.html)。

<SkinFrame :height="420" state="prefs" caption="≥640：眼镜拉下的面板，贴页眉右下沿" />

<SkinFrame :width="390" :height="640" state="prefs" caption="≤639：页面正中的弹层，跟着亮 / 暗主题" />

## 表单

```html demo
<form class="ak-prefs" onsubmit="return false">
  <fieldset class="ak-pref">
    <legend class="ak-pref__label">外观</legend>
    <div class="ak-seg ak-seg--lg" role="radiogroup" aria-label="外观">
      <label><input type="radio" name="demo-theme" value="os" checked><span>跟随系统</span></label>
      <label><input type="radio" name="demo-theme" value="day"><span>亮</span></label>
      <label><input type="radio" name="demo-theme" value="night"><span>暗</span></label>
    </div>
  </fieldset>
  <fieldset class="ak-pref">
    <legend class="ak-pref__label">章节折叠默认模式</legend>
    <div class="ak-seg ak-seg--lg" role="radiogroup" aria-label="章节折叠默认模式">
      <label><input type="radio" name="demo-sections" value="expand" checked><span>展开</span></label>
      <label><input type="radio" name="demo-sections" value="mobile"><span>窄屏收起</span></label>
      <label><input type="radio" name="demo-sections" value="collapse"><span>收起</span></label>
    </div>
  </fieldset>
  <fieldset class="ak-pref">
    <legend class="ak-pref__label">字号</legend>
    <div class="ak-seg ak-seg--lg ak-seg--font" role="radiogroup" aria-label="字号">
      <label><input type="radio" name="demo-font" value="xsmall"><span>极小</span></label>
      <label><input type="radio" name="demo-font" value="small"><span>小</span></label>
      <label><input type="radio" name="demo-font" value="regular" checked><span>中</span></label>
      <label><input type="radio" name="demo-font" value="large"><span>大</span></label>
    </div>
  </fieldset>
  <fieldset class="ak-pref">
    <legend class="ak-pref__label">表格字号</legend>
    <div class="ak-seg ak-seg--lg" role="radiogroup" aria-label="表格字号">
      <label><input type="radio" name="demo-table" value="auto" checked><span>跟随正文</span></label>
      <label><input type="radio" name="demo-table" value="xsmall"><span>极小</span></label>
    </div>
  </fieldset>
  <div class="ak-prefs__actions"><button type="submit" class="ak-btn ak-btn--primary">保存</button><button type="button" class="ak-btn">恢复默认设置</button><a class="ak-btn" href="#">返回</a></div>
</form>
```

示例里没挂 `data-pref`，点了只换选中态、不改文档站自己的设置；「保存」钮在真页面上有 JS 时是藏起的。

## 偏好的载体

与 MW 核心的 clientPrefs 相同：`<html class="skin-theme-clientpref-os ak-sections-clientpref-expand ak-font-size-clientpref-regular ak-table-font-size-clientpref-auto">`，CSS 只认这个类（`base/sections.css` · `base/typography.css`）。皮肤在 `skin.json` 的 `ClientPreferences` 登记这两项（`options` / `default` / `callback`），核心的内联脚本首帧前就把 cookie 里的值打到 `<html>` 上；`client-prefs.js` 有 `mw.user.clientPrefs` 就交给核心，没有（预览 / 站外）就自己改类 + localStorage（`mwclientpreferences`，"feature-clientpref-value,…" 一条，与 Skin:Arknights 的 `inline.js` 同一格式）。改动后在 `document` 上派发 `akds:pref`，`sections.js` 听它、立刻套用到当前页。

## Skin:Arknights 要做的

| 项 | 做法 |
|---|---|
| 特殊页面 | `SpecialReadingPreferences extends SpecialPage`（`skin.json` → `SpecialPages`）：GET 输出上面的表单（当前值从 cookie / 用户选项读）；POST 校验 token、写 `mwclientpreferences` cookie（匿名）/ `userOptionsManager->setOption`（登录；键 = 偏好名），302 回 `returnto` / `returntoquery`，同 `SpecialMobileOptions` |
| 入口 | `getTemplateData` 里给页眉模板 `href-akds-prefs`（`SpecialPage::getTitleFor( 'ReadingPreferences' )->getLocalURL( [ 'returnto' => 当前页 ] )`），Header.mustache 输出 `a.ak-header__prefs` + `dialog.ak-prefs-panel`（面板里的表单 = 特殊页面那份的紧凑版 `.ak-prefs--panel`，同一个 PHP 组件渲染两次） |
| 偏好 | `ClientPreferences` 登记 `ak-sections` / `ak-font-size` / `ak-table-font-size`；登录用户的值由核心的 clientPrefs 机制读用户选项、打到 `<html>` 上 |
| 迁移 | 老手机版用户的 `mf-font-size` 用户选项：small（现网实际 13）→ `small`、regular（18）/ large（20）→ `large`，首次打开时若 `ak-font-size` 未设就按这张表写 |
| 脚本 | `scripts/sync-design-system.sh` 的 `FILES` 加 `client-prefs.js sections.js`，`skin.js` 里 require；`wikipage.content` 钩子后 `akdsSections.init` |

## CSS

<CssClasses :files="['chrome/prefs.css', 'components/seg.css']" />

<CssSelectors :files="['chrome/prefs.css', 'components/seg.css']" />
