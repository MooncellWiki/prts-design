# vendor/charinfo — prts.wiki 现网 Widget:CharinfoV2 的静态文件快照

由 `scripts/fetch-charinfo.py` 于 2026-08-29 抓取（版本：CSS 20250518 · JS 20260322_2 · charId 20260604 · charVoice 20260604 · 字体 20260604 · crypto-js@3.1.9）。
预览页 `preview/operator.html` 的「干员信息」舞台直接跑这套现网 CSS / JS，DOM 与模板参数取自现网「陈」页面的渲染结果，脚本一字不改。

| 远端 | 本地 | 改动 |
|---|---|---|
| static.prts.wiki/charinfo/charinfo_20250518.min.css | charinfo_20250518.min.css | url() 里 4 处 static.prts.wiki/charinfo/img/ui/ → img/ui/ |
| static.prts.wiki/charinfo/charinfom_20250518.min.css | charinfom_20250518.min.css | url() 里 5 处 static.prts.wiki/charinfo/img/ui/ → img/ui/ |
| static.prts.wiki/charinfo/charinfo_20260322_2.min.js | charinfo_20260322_2.min.js | 原样 |
| static.prts.wiki/charinfo/charId20260604.js | charId20260604.js | 原样 |
| static.prts.wiki/charinfo/charVoice20260604.js | charVoice20260604.js | 只留 char_010_chen（476 个干员 → 2 个键） |
| static.prts.wiki/charinfo/Charname_min_20260604.TTF | Charname_min_20260604.TTF | 原样 |
| static.prts.wiki/npm/crypto-js@3.1.9/core.min.js | crypto-js/core.min.js | 原样 |
| static.prts.wiki/npm/crypto-js@3.1.9/md5.min.js | crypto-js/md5.min.js | 原样 |
| static.prts.wiki/charinfo/img/ui/back.png | img/ui/back.png | 原样 |
| static.prts.wiki/charinfo/img/ui/back_switch.png | img/ui/back_switch.png | 原样 |
| static.prts.wiki/charinfo/img/ui/check.png | img/ui/check.png | 原样 |
| static.prts.wiki/charinfo/img/ui/close.png | img/ui/close.png | 原样 |
| static.prts.wiki/charinfo/img/ui/cv.png | img/ui/cv.png | 原样 |
| static.prts.wiki/charinfo/img/ui/download.png | img/ui/download.png | 原样 |
| static.prts.wiki/charinfo/img/ui/dynOff.png | img/ui/dynOff.png | 原样 |
| static.prts.wiki/charinfo/img/ui/dynOn.png | img/ui/dynOn.png | 原样 |
| static.prts.wiki/charinfo/img/ui/eyeOff.png | img/ui/eyeOff.png | 原样 |
| static.prts.wiki/charinfo/img/ui/eyeOn.png | img/ui/eyeOn.png | 原样 |
| static.prts.wiki/charinfo/img/ui/fullscreen.png | img/ui/fullscreen.png | 原样 |
| static.prts.wiki/charinfo/img/ui/musicOff.png | img/ui/musicOff.png | 原样 |
| static.prts.wiki/charinfo/img/ui/musicOn.png | img/ui/musicOn.png | 原样 |
| static.prts.wiki/charinfo/img/ui/painter.png | img/ui/painter.png | 原样 |
| static.prts.wiki/charinfo/img/ui/plus.png | img/ui/plus.png | 原样 |
| static.prts.wiki/charinfo/img/ui/refullscreen.png | img/ui/refullscreen.png | 原样 |
| static.prts.wiki/charinfo/img/ui/skin.png | img/ui/skin.png | 原样 |
| static.prts.wiki/charinfo/img/ui/skinSelect.png | img/ui/skinSelect.png | 原样 |
| static.prts.wiki/charinfo/img/ui/skin_blue.png | img/ui/skin_blue.png | 原样 |
| static.prts.wiki/charinfo/img/ui/sub.png | img/ui/sub.png | 原样 |
| static.prts.wiki/charinfo/img/ui/switch.png | img/ui/switch.png | 原样 |
| static.prts.wiki/charinfo/img/ui/voice.png | img/ui/voice.png | 原样 |
| static.prts.wiki/charinfo/img/ui/watch.png | img/ui/watch.png | 原样 |
| static.prts.wiki/charinfo/img/ui/headmask2.png | img/ui/headmask2.png | 原样 |
| https://code.jquery.com/jquery-3.7.1.min.js | ../jquery/jquery-3.7.1.min.js | 原样（MIT；MediaWiki 1.43 自带同版本，生产环境由 ResourceLoader 提供） |

运行时仍从现网加载的：media.prts.wiki 的立绘 / 头像 / logo / 场景图（URL 由 JS 用文件名 md5 算出），static.prts.wiki/charinfo/img/ 的职业 / 星级 / 分支图标，static.prts.wiki/music/ 的 BGM，torappu.prts.wiki/assets/audio/ 的语音。

charinfo 的 CSS / JS / 字体 / 图标是 PRTS（Mooncell）站点自有资源，仅供本设计稿预览对照；crypto-js MIT；jQuery MIT。
