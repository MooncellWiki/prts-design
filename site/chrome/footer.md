<script setup>
import CssSelectors from "../.vitepress/theme/components/CssSelectors.vue";
import SkinFrame from "../.vitepress/theme/components/SkinFrame.vue";
</script>

# 页脚

页脚和页眉一样是「框」：两套主题下都是黑的，读 `--ak-chrome-*`（不读 `--ak-bg-inverse`——那是给反白组件用的，暗色下是白）。顶边一条 4px 的活动主色斜纹，右下角一个几乎看不见的 PRTS 水印。

<SkinFrame :height="560" state="bottom" highlight=".ak-footer" />

## 结构

品牌 + 三列链接（浏览 / 参与 / 关于），底栏左文字、右徽章。≤639 链接列两两并排、品牌独占一行，底栏竖排。底栏右内边距给「回到顶部」`.ak-fab` 让位，滚到底时不压住徽章。

```html demo bare
<footer class="ak-footer">
  <div class="ak-footer__inner">
    <div class="ak-footer__brand"><span class="ak-header__wordmark">PRTS<small>ARKNIGHTS WIKI</small></span><p>玩家自建的明日方舟中文维基。本站与上海鹰角网络科技有限公司无隶属关系。游戏内素材版权归鹰角网络所有。</p></div>
    <div class="ak-footer__col"><h4>浏览</h4><ul><li><a href="#">干员</a></li><li><a href="#">敌人</a></li><li><a href="#">关卡</a></li><li><a href="#">道具</a></li></ul></div>
    <div class="ak-footer__col"><h4>参与</h4><ul><li><a href="#">编辑指南</a></li><li><a href="#">模板文档</a></li><li><a href="#">最近更改</a></li><li><a href="#">社区门户</a></li></ul></div>
    <div class="ak-footer__col"><h4>关于</h4><ul><li><a href="#">关于 PRTS</a></li><li><a href="#">免责声明</a></li><li><a href="#">隐私政策</a></li><li><a href="#">API</a></li></ul></div>
  </div>
  <div class="ak-footer__bottom">
    <div class="ak-footer__bottom-text"><span>© 2019–2026 PRTS.wiki · 文本 CC BY-NC-SA 4.0</span><span class="ak-en">Skin AKDS · MediaWiki 1.43</span></div>
    <ul class="ak-footer__icons noprint" id="footer-icons">
      <li id="footer-sponsorsico"><a href="https://project.mooncell.wiki" class="cdx-button cdx-button--fake-button cdx-button--size-large cdx-button--fake-button--enabled" target="_blank" rel="noopener"><img src="assets/badge/mooncell.png" alt="a Mooncell project" height="31" width="88" loading="lazy"></a><a href="https://www.horain.net/" class="cdx-button cdx-button--fake-button cdx-button--size-large cdx-button--fake-button--enabled" target="_blank" rel="noopener"><img src="assets/badge/horain.png" alt="horain" style="margin-left: 5px" width="88" height="31" loading="lazy"></a></li>
      <li id="footer-poweredbyico"><a href="https://www.mediawiki.org/" class="cdx-button cdx-button--fake-button cdx-button--size-large cdx-button--fake-button--enabled" target="_blank" rel="noopener"><img src="assets/badge/mono/mediawiki.svg" alt="Powered by MediaWiki" width="88" height="31" loading="lazy"></a></li>
      <li id="footer-poweredbysmwico"><a href="https://www.semantic-mediawiki.org/wiki/Semantic_MediaWiki" class="cdx-button cdx-button--fake-button cdx-button--size-large cdx-button--fake-button--enabled" target="_blank" rel="noopener"><img src="assets/badge/mono/smw.svg" alt="Powered by Semantic MediaWiki" class="smw-footer" width="88" height="31" loading="lazy"></a></li>
      <li id="footer-copyrightico"><a href="https://creativecommons.org/licenses/by-nc-sa/4.0/" class="cdx-button cdx-button--fake-button cdx-button--size-large cdx-button--fake-button--enabled" target="_blank" rel="noopener"><img src="assets/badge/mono/cc-by-nc-sa.svg" alt="知识共享署名-非商业性使用-相同方式共享" width="88" height="31" loading="lazy"></a></li>
    </ul>
  </div>
  <span class="ak-watermark">PRTS</span>
</footer>
```

## 徽章

`$wgFooterIcons` 的输出结构原样保留（`ul#footer-icons > li#footer-*ico > a.cdx-button.cdx-button--fake-button > img`，一个 `li` 里可以有好几枚）：徽章**原样显示**——26px 高、无底板、不灰度、不降透明、无悬停效果（只保留键盘焦点描边）；`cdx-button` 假按钮的圆角 / 最小高度 / 内边距归零，站点配置里的内联 `margin-left` 用 `!important` 压掉。顺序 = `$wgFooterIcons` 的键序。

- 通用徽章（MediaWiki / SMW / CC BY-NC-SA）建议换成**白描版**（白色单色、透明底，`preview/assets/badge/mono/`，由官方矢量重着色）：1.43 自带的 `poweredby_mediawiki.svg` 是透明底黑字，放在黑页脚上看不见。站点自己的徽章（Mooncell / HoRain）用原图。
- 某枚通用徽章仍是原彩色时，给 `#footer-icons` 加 `.ak-footer__icons--plate`，恢复 31px 高的浅色底板（`#f5f5f5`，不随暗色翻转——Vector / Citizen 给透明底黑字徽章垫的也是这种固定浅底）。

prts.wiki 现网页脚有 5 枚 88×31 徽章：CC BY-NC-SA（`copyright`）、Powered by MediaWiki + HoRain + a Mooncell project（`poweredby`，后两枚由 LocalSettings 追加）、Semantic MediaWiki（扩展自己加的 `poweredbysmw`）。换成白描版是站点层的事，皮肤不用改——在 LocalSettings 里改 `src`（starcitizen.tools 就是这么换成自绘单色徽章的），例如：

```php
$wgFooterIcons = [
  'sponsors'  => [ 'mooncell' => [ 'src' => '//static.prts.wiki/…/mooncell.png', 'url' => 'https://project.mooncell.wiki', 'alt' => 'a Mooncell project' ],
                   'horain'   => [ 'src' => '//static.prts.wiki/…/horain.png',   'url' => 'https://www.horain.net/',        'alt' => 'HoRain' ] ],
  'poweredby' => [ 'mediawiki' => [ 'src' => '/skins/Arknights/resources/badge/mediawiki.svg', 'url' => 'https://www.mediawiki.org/', 'alt' => 'Powered by MediaWiki' ] ],
  // SMW 会自己追加 poweredbysmw；换 src 用 $smwgFooterIcon 或 SkinTemplateNavigation::Universal 钩子
  'copyright' => [ 'copyright' => [ 'src' => '/skins/Arknights/resources/badge/cc-by-nc-sa.svg', 'url' => 'https://creativecommons.org/licenses/by-nc-sa/4.0/', 'alt' => 'CC BY-NC-SA 4.0' ] ],
];
```

（生产皮肤 Skin:Arknights 已自带 `resources/badge/`（MediaWiki / SMW / CC BY-NC-SA 三枚白描版），其 README「页脚徽章」一节有整份 `$wgFooterIcons` 的写法与三条注意——必须整份赋值、`poweredbysmw` 抢在 SMW 注册之前占位、`copyright` 写了 `src` 后核心不再用 `$wgRightsIcon`。本仓库的 `skin/` 里没有这个目录：白描版在 `preview/assets/badge/mono/`。）

::: warning mustache 里的 data-footer
核心会把 `data-footer.*` 的 `html-items` 剥掉，只留 `array-items[{id, html}]`，页脚三处必须像 Vector 那样写成 <code v-pre>{{#array-items}}&lt;li id="{{id}}"&gt;{{{html}}}&lt;/li&gt;{{/array-items}}</code>，用 <code v-pre>{{{html-items}}}</code> 会渲染成空。
:::

## CSS

<CssClasses :files="['chrome/footer.css']" />

<CssSelectors :files="['chrome/footer.css']" />
