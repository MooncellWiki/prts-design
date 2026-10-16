<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 阅读设置

prts 并成 Arknights 单皮肤、`m.` 域名回主域之后，手机版（Minerva + MobileFrontend）的两样读者偏好没了：**章节折叠**（`Special:MobileOptions` 的「展开章节」）和**字号**（「文本」三档）。皮肤把它们连同**外观三态**（原来页眉上常驻的三格开关）一起做成页眉上的一张面板，同 Vector 2022 的「外观」菜单；另有一页 `Special:ReadingPreferences` 兜底（无 JS、可直链）。

- **入口**：页眉一枚眼镜图标 `a.ak-header__prefs`（`i-glasses`，同 `.ak-btn--icon` 的 36px 图标钮；眼镜 = 外观 / 阅读，同 Vector 2022「外观」菜单的图标，不用齿轮——用户菜单里「参数设置」已经是齿轮）。它在工具区铃铛左边，<1120 随工具进 ⋮ 卡片的第一行（眼镜 · 通知）；点开面板时卡片收起。
- **面板**：`<dialog class="ak-menu ak-menu--right ak-prefs-panel">`，配色同用户菜单——页眉配色，两套主题下都是黑的（`chrome/header.css` 的令牌重映射把 `.ak-prefs-panel` 列在 `.ak-header` 旁边）：同一排工具拉下来的卡片不该一张黑一张白，面板里切外观时面板自己也不跟着翻色。它仍放在 `</header>` 之后、不在页眉子树里——<1120 眼镜在 ⋮ 卡片里，开面板时卡片收起，面板若在卡片子树里会被一起藏掉；活动主题给页眉开了毛玻璃时，页眉还会成为 `position: fixed` 子元素的包含块。DOM 只此一份、两种开法——≥640 `show()`，非模态、`position: fixed` 贴页眉下沿、右缘对齐工具区的 `.ak-menu` 卡片（同用户菜单的卡片：1px 框 + 大阴影，不画顶部亮线，顶边贴着页眉底线挂下来；点外面 / Esc 收起）；≤639 `showModal()`，页面正中（同 `.ak-dialog`：遮罩 + 轻微毛玻璃，锁页面滚动，点遮罩 / Esc 收起）。抬头 `a.ak-menu__head` = 眼镜 + 「阅读设置」+ 右端箭头，整块链到特殊页面——同用户菜单抬头链到用户页，没有另外的「整页打开」和 ×。
- **无 JS**：眼镜就是一条链接，去 `Special:ReadingPreferences`——`form.ak-prefs` 真表单（`fieldset.ak-pref` = 标签 + label + radio 的分段开关，不放说明灰字；选中态由 `label:has(input:checked)` 画），POST 回特殊页面，服务端存下后 302 回 `returnto`（同 `MobileOptions::submitSettingsForm`；Skin:Arknights 只能为登录用户存成用户选项，见[下文](#skin-arknights-的做法)）；有 JS 时同一页上改一下立刻生效，「保存」藏起，留「恢复默认设置」（各项设回默认）与「返回」（同源来路时 `history.back()`，还原阅读位置；否则照 `returnto` 链接走）。无 JS 时「恢复默认设置」是 `name=reset` 的提交，服务端清掉偏好。曾试过把偏好塞进 ⋮ 卡片、也试过只做特殊页面：前者 <1120 占了半张卡，后者改个字号要离开当前页、回来丢阅读位置。
- **外观**：跟随系统 / 亮 / 暗 = `skin-theme` 的 `os` / `day` / `night`，MW 1.43 核心的那项（`skin.json` 里早已登记）；与原来页眉三格开关同一套值，`chrome/theme-toggle.css` 仍保留给别处用。
- **章节折叠**：开启 / 关闭 = `ak-sections-on` 的 `on` / `off`。没设过是 `auto`：只在 ≤639 开，桌面 / 平板不出开关（Minerva 的范围，宽屏有目录不缺导航）；`auto` 没有自己的格，面板按当前视口亮「开启」或「关闭」，点了才存成 `on` / `off`。只有两格而不是「窄屏 / 全部 / 关闭」三档，是因为设置[存本机、不跟账号](#为什么存本机、不跟账号)：手机上开、电脑上关各点各的，用不着一个值去分设备。**章节默认**：展开（默认）/ 收起 = `ak-sections` 的 `expand` / `collapse`，开着时打开页面的初始状态（窄屏 + 收起 = 原 Minerva 的行为）。改了、或 `auto` 时视口跨过 639，立刻重新套用，见[章节折叠](/content/toc#章节折叠)。
- **字号**：极小 / 小 / 中 / 大 = `xsmall` 12px / `small` 14 / `regular` 16（默认，就是现在的大小）/ `large` 20。「大」照 prts 老皮肤 Minerva（MobileFrontend `mf-font-size` 的 large 20px，只缩放 `p`、行高 1.5）；「极小」= 现网 `MediaWiki:Mobile.css` 在手机（≤640）上给 `.wikitable` / `.infobox` 的 `x-small`（关键字本是 10px，Chrome 中文环境的最小字号 12 把它托到 12，devtools 里看到的就是 12px；`body` 那条 `small` 是 13）——老手机版读者看惯的表格大小；「小」14 = Vector 现网的正文。MF 自己没有 x-small 档；它那档 18px「中等」有了 16 的「中」就不要了。这里换的是 `.mw-body-content` 里的字号令牌（`base/typography.css`），正文 / 组件 / 模板整体换档，标题跟着走，极小档的小字令牌托底 11px；页眉 / 侧栏 / 目录 / 页面标题不动。格子里的字就是那一档的大小。
- **表格字号**：跟随正文 / 极小 = `auto`（默认）/ `xsmall` 12px，`base/tables.css` 作用于 wikitext 表格、Cargo / 数据表、`.ak-table`、infobox（`.ak-dense` 紧凑表不动）。单独一项，是因为现网手机版就是「正文 13、表格 12」的搭配——有人要的是正文正常、表格更小，不是整体缩。

去[干员页样例](https://mooncellwiki.github.io/prts-design/preview/operator.html)点页眉的眼镜，或看[阅读设置页样例](https://mooncellwiki.github.io/prts-design/preview/prefs.html)。

<SkinFrame :height="420" state="prefs" caption="≥640：眼镜拉下的面板，贴页眉右下沿" />

<SkinFrame :width="390" :height="640" state="prefs" caption="≤639：页面正中的弹层，仍是页眉配色" />

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
    <legend class="ak-pref__label">章节折叠</legend>
    <div class="ak-seg ak-seg--lg" role="radiogroup" aria-label="章节折叠">
      <label><input type="radio" name="demo-sections-on" value="on" checked><span>开启</span></label>
      <label><input type="radio" name="demo-sections-on" value="off"><span>关闭</span></label>
    </div>
  </fieldset>
  <fieldset class="ak-pref">
    <legend class="ak-pref__label">章节默认</legend>
    <div class="ak-seg ak-seg--lg" role="radiogroup" aria-label="章节默认">
      <label><input type="radio" name="demo-sections" value="expand" checked><span>展开</span></label>
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

与 MW 核心的 clientPrefs 同一种类名：`<html class="skin-theme-clientpref-os ak-sections-on-clientpref-auto ak-sections-clientpref-expand ak-font-size-clientpref-regular ak-table-font-size-clientpref-auto">`，CSS 只认这个类（`base/sections.css` · `base/typography.css`）。值存在哪、首帧前谁把它打到 `<html>` 上由宿主决定：`client-prefs.js` 在 `<html>` 上已有这一项的类、又有 `mw.user.clientPrefs` 时交给它，否则（预览 / 站外）自己改类 + localStorage（`mwclientpreferences`，"feature-clientpref-value,…" 一条，与 Skin:Arknights 的 `inline.js` 同一格式）。

MW 1.43 核心那套只管**匿名用户**：`mw.user.clientPrefs.set()` 写 cookie，皮肤开了 `clientPrefEnabled` 才有核心的内联脚本首帧前读回，而且只替换 `<html>` 上已经有的同名类（新偏好的默认类要先由服务端输出）；登录用户调用直接抛错，核心也不会替登录用户读用户选项、打到 `<html>` 上；`skin.json` 里写 `ClientPreferences` 1.43 不认。所以真要存，宿主得自己接——Skin:Arknights 的做法见下。

主题的默认值是 `os`；站点默认不是跟随系统时，宿主在 `<html data-akds-theme-default="day | night">` 上给（同侧栏的 `data-akds-flyout`），「恢复默认设置」按它。章节折叠的默认值是 `auto`（窄屏开、宽屏关），表单里没有对应的格：服务端不预勾，`client-prefs.js` 按当前视口亮 `on` / `off`，`auto` 时视口跨过 639 也跟着换格；老值 `mobile` / `all` 读成 `auto` / `on`。改动后在 `document` 上派发 `akds:pref`，`sections.js` 听它、立刻套用到当前页。

## 为什么存本机、不跟账号

阅读设置全部存本机，登录了也不跟账号走、不跨设备同步。这里的几项都是**跟着这块屏幕**的：字号在 6 寸手机和 27 寸显示器上要的不是同一档，表格字号更是只在手机上才想缩；章节折叠在窄屏是导航、在宽屏是多余；「跟随系统」本身就只对当前设备有意义。同步过去只会让人在电脑上调大了字号、手机上突然撑爆表格。知名产品的做法也是这样：

| 产品 | 做法 |
|---|---|
| MediaWiki 手机版（Minerva + MobileFrontend） | 我们要补回的那两项——`Special:MobileOptions` 的「展开章节」与字号——本来就存 `localStorage`（`expandSections` · `userFontSize`，`mw.storage`），不是用户选项，API 里读不到（[T281296](https://phabricator.wikimedia.org/T281296)、[支持台讨论](https://www.mediawiki.org/wiki/Topic:W2t1mon04m4n29hr)） |
| Wikipedia 桌面版（Vector 2022「外观」菜单） | 登录用户存成用户选项、跨设备；匿名存 cookie（clientPrefs）。但桌面与手机是两套皮肤各存各的，字号档本就不共用，所以「同步」只在桌面之间发生 |
| X（Twitter）「显示」 | 字号 / 颜色 / 背景按浏览器存，设置页写明「影响这个浏览器上的所有账号」；手机 App 另存 |
| YouTube 外观 | 亮 / 暗 / 跟随设备存在当前浏览器的 cookie 里，不跟 Google 账号；手机 App 也是每台设备各设 |
| Discord 外观 | 主题默认按设备存，桌面端有一个「Sync across clients」开关要自己打开才同步；文字大小 / 缩放按设备 |
| 浏览器 / 系统 | Chrome 开了同步也不同步页面缩放与字号；iOS / macOS 的「文字大小」是每台设备各自的 |

所以有 JS 时所有访客都写本机 `localStorage`；无 JS 时登录用户存 **cookie**（仍是本机；登录用户的页面本来不进 CDN 缓存，服务端读它没有代价），不写用户选项——写了就成了唯一一条会跨设备的路，电脑上无 JS 存的字号会出现在手机上。匿名无 JS 无处可存，只给说明。

## Skin:Arknights 的做法

| 项 | 做法 |
|---|---|
| 偏好存哪 | 不开 `clientPrefEnabled`：**所有访客**（登录与否）的偏好都存本机 `localStorage['mwclientpreferences']`，`inline.js` 首帧前打到 `<html>` 上（主题本来就这么存），不跟账号、不跨设备（[为什么](#为什么存本机、不跟账号)）。`clientPrefs.js` 把 `mw.user.clientPrefs.set` 换成写这一处的实现，`client-prefs.js` 与小工具调用都落到这里——否则匿名用户的值进了核心不读回的 cookie、刷新就丢，登录用户直接抛错 |
| 服务端出类 | `getHtmlElementAttributes()` 输出五项的类：默认值（章节折叠是 `auto`），登录用户有 `mwclientpreferences` cookie（无 JS 时在特殊页面存的）的用 cookie 里的；本机 `localStorage` 有值时由 `inline.js` 换掉。匿名访客不读 cookie，页面永远是默认类，照常进 CDN 缓存。`$wgArknightsThemeDefault` 不是 `os` 时再写 `<html data-akds-theme-default>` |
| 特殊页面 | `SpecialReadingPreferences extends UnlistedSpecialPage`（`skin.json` → `SpecialPages`，别名「阅读设置」）：GET 输出上面的表单（服务端只知道默认值与登录用户的 cookie，章节折叠没设过时不勾格，选中态再由 `client-prefs.js` 按 `<html>` 上的类同步）；POST 校验 token，**登录用户**把表单值写进本机的 `mwclientpreferences` cookie（与 `localStorage` 同一条 "feature-clientpref-value,…" 字符串，`name=reset` 清掉），302 回 `returnto` / `returntoquery`，同 `SpecialMobileOptions`。不写用户选项——那会跨设备。匿名访客无处可存——服务端读匿名的 cookie 出类会把每个页面的 CDN 缓存按 cookie 拆开——只给一句说明 |
| 入口 | `getTemplateData` 里给页眉模板眼镜的链接（`SpecialPage::getTitleFor( 'ReadingPreferences' )`，带 `SkinComponentUtils::getReturnToParam()` 的 `returnto` / `returntoquery`，同登录链接），Header.mustache 输出 `a.ak-header__prefs` + `dialog.ak-prefs-panel`（面板里的表单 = 特殊页面那份的紧凑版 `.ak-prefs--panel`，同一个 PHP 组件 + `ReadingPreferences.mustache` 渲染两次） |
| 不迁移 `mf-font-size` | 老手机版的字号不搬过来：它的 small 是 MF 的「标准」档（默认），三档都只改 `<p>` 的字号、只在手机版生效；`ak-font-size` 换的是整块正文的字号令牌、桌面也生效，几档对不上，迁过来会让在手机上调过字号的人桌面突然变样 |
| 脚本 | `scripts/sync-design-system.sh` 的 `FILES` 加 `client-prefs.js sections.js`，`skin.js` 里 require；`wikipage.content` 钩子后 `akdsSections.init`；`window.akdsScrollLock` 指向皮肤的滚动锁（手机上的模态面板用） |

## CSS

<CssClasses :files="['chrome/prefs.css', 'components/seg.css']" />

<CssSelectors :files="['chrome/prefs.css', 'components/seg.css']" />
