---
title: 语音 Voice
component: voice
---

同现网的语音记录（<code v-pre>{{:干员/语音记录}}</code> 的 VoiceTable）：一条一行——播放钮 + 标题行（语种徽标 / 游戏内解锁条件 / 语音编号）+ 台词。列表外框 + 悬停行底色。

## 语种切换

`AkVoiceList` 给了 `languages`（`{ value, label, badge?, cv? }`，同 Naive 的 options）就在上方出一排语种（带 CV 名），`v-model` 是当前语种。`AkVoice` 的 `text` / `src` 写成按语种的对象（`{ cn, yue, jp, en, kr }`），跟着列表切换，缺某个语种时退回第一项。切语种只换台词、徽标和音频地址。

音频地址由调用方给（示例用的是现网 torappu.prts.wiki 的同源地址）。播放用原生 `Audio`，**全页同时只放一条**：点另一条先停掉正在放的，再点同一条停止；播放中的条目播放钮变成暂停、标题行出现跳动的声波。

@demo Voice/Languages

## 单一语种

不给 `languages`：没有切换条，`text` / `src` 直接写串，`lang` 只用来出徽标。没有音频地址的条目播放钮压暗、禁用。

@demo Voice/Basic

## 下载

`download` 给了地址（同 `src`，一个串或按语种的对象）就在播放钮旁出一枚同款的下载钮（黑方块 + 线稿图标 `#i-download`），是原生 `<a download>`；`download-name` 是存下来的文件名。模板里写 `<a class="ak-voice__download" href="…" download="…" aria-label="下载 任命助理"><svg class="ak-icon"><use href="#i-download"/></svg></a>`，紧跟在播放钮后面。现网 `/语音记录` 页给的是 torappu 的 wav 地址（`?filename=` 由服务端写进 Content-Disposition），干员页里嵌入的那份不给。

## 键盘与可访问性

- 播放钮是 `<button>`，读作「播放 + 标题」，`aria-pressed` 表示正在播放；下载是 `<a download>`，读作「下载 + 标题」。
- 语种切换是一组 `aria-pressed` 的切换按钮（`role="group"`，以「语种」小标为组名）。
- 台词带 HTML `lang`（cn → zh-Hans、yue → yue、jp → ja、en → en、kr → ko），读屏按语种发音。
- 语种切换条与播放钮都带 `data-no-toggle`：皮肤脚本会在 document 上替模板输出的纯 CSS 芯片 / 播放钮翻 `is-active` / `is-playing`（给[CSS 实现](#css-实现)的演示用），Vue 版的状态归自己管，要退出那层委托，否则两边各翻一次。自己用 `.ak-voice` 结构 + 脚本管状态时也照此标。

## Vue API

### AkVoiceList

<PropsTable of="AkVoiceList" />

### AkVoice

<PropsTable of="AkVoice" />

## CSS 实现

语种切换条 `.ak-voice-langs`（原是干员页私有的 `.op-voice-langs`）和禁用的播放钮 `.ak-voice__play:disabled` 随 Vue 版一起收进了 voice.css。皮肤脚本（document 级委托）会替模板输出的芯片翻 `is-active` / `aria-pressed`、替播放钮翻 `is-playing`（只是演示态，不会真的放音频）；状态自己管的容器标 `data-no-toggle`。

<CssClasses :files="['arknights/voice.css']" />
