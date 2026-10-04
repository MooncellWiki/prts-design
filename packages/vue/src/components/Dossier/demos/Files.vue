<script setup lang="ts">
import AkAttr from "../../Attrs/AkAttr.vue";
import AkAttrs from "../../Attrs/AkAttrs.vue";
import AkKv from "../../Kv/AkKv.vue";
import AkKvItem from "../../Kv/AkKvItem.vue";
import AkTabPane from "../../Tabs/AkTabPane.vue";
import AkTabs from "../../Tabs/AkTabs.vue";
import AkDossier from "../AkDossier.vue";
import AkRedacted from "../AkRedacted.vue";

/** 陈 · 人员档案 9 段（现网 Template:人员档案）：前两段是键值表 / 属性表，其余是文本 */
interface DossierFile {
  name: string;
  /** 页签文字 + 第二行小字（解锁条件的短写） */
  tab: string;
  short: string;
  unlock: string;
  /** 首段加粗的小标题（【源石技艺概览】） */
  lead?: string;
  /** 涂黑的一段 */
  redacted?: string;
  paras: string[];
  /** 灰字落款 */
  sign?: string;
}

const profile = [
  ["代号", "陈"],
  ["性别", "女"],
  ["战斗经验", "四年"],
  ["出身地", "龙门"],
  ["生日", "7月7日"],
  ["种族", "龙"],
  ["身高", "168cm"],
  ["矿石病感染情况", "未公开"],
] as const;

const files: DossierFile[] = [
  {
    name: "record",
    tab: "客观履历",
    short: "初始开放",
    unlock: "初始开放",
    paras: [
      "陈，龙门高级警司，龙门近卫局特别督察组组长，毕业于维多利亚皇家近卫学校，成绩优异，表现突出。在龙门近卫局供职期间，力主取缔龙门境内非法活动，对抗暴力犯罪和有组织犯罪，追缉武装逃犯与国际重犯等行动，并取得多项重大成果。",
      "现作为特别人员协助罗德岛行动，并为现场提供战术指挥支援。",
    ],
  },
  {
    name: "clinical",
    tab: "临床诊断分析",
    short: "信赖 25%",
    unlock: "提升信赖至25%以查看更多信息",
    redacted: "【应龙门近卫局要求，不予公开】",
    paras: [
      "她是有来做体检啦，只是档案被拿走了，我这里可没留底。嗯？是龙门方面的要求啊。",
    ],
    sign: "——医疗干员R.T.",
  },
  {
    name: "archive1",
    tab: "档案资料一",
    short: "信赖 50%",
    unlock: "提升信赖至50%以查看更多信息",
    lead: "【源石技艺概览】",
    paras: [
      "陈从来不在人前使用源石技艺，这使得大多数人都认为陈不善此道。事实上，她确实在掌控源石技艺方面表现得相当糟糕，包括且不限于造成法杖的突然损坏、防爆墙的粉碎、气浪吹飞所有纸质档案，以及一系列对实验外对象的不必要的损害。施放源石技艺后，似乎是一次性动用了太多体力的缘故，陈长官本人也会陷入疲劳状态。至少术师干员们在讨论之后都认为，陈缺乏一个良好的媒介以掌控自己的源石技艺：在缺乏可利用装备的情况下，她就是没法将自己的源石技艺凝聚成型。",
      "我看了测试结果，法杖的形状越薄越锐，她越能适应；比起塑造新的客体，她更擅长催化法杖蕴含的源石本身。没用啊！如果能有把剑形法杖的话，可能会很适合她吧。不过谁会用那种东西啊，束手束脚的......剑不就是用来砍人的！多此一举啦。",
    ],
    sign: "——术师干员D",
  },
  {
    name: "archive2",
    tab: "档案资料二",
    short: "信赖 100%",
    unlock: "提升信赖至100%以查看更多信息",
    paras: [
      "陈以全常规科目A和全教官推荐的优秀成绩自维多利亚皇家近卫学校毕业。回到龙门之后，她几乎立刻就加入了龙门近卫局。",
      "没人知道她考入皇家近卫学校之前的经历，正如没人怀疑她的能力、她的恪尽职守、以及她的嫉恶如仇。针对陈的行事风格，配合过近卫局工作的警员曾是一片怨声载道——太严厉了，也太苛刻了。几乎所有人都认为，陈一定会在权力斗争中销声匿迹，她的锐气很快就会被无尽的事端打磨干净。",
      "出乎所有人意料，犯罪率和伤亡率在两年内连续下降，年轻世代警员的岗位提拔越来越快、越来越实质性。陈步步高升，并加入了近卫局最重要的队伍之一，特别督察组。",
      "特别督察组成员的任期一般不超过两年——出于对警员生命的保护，或是为了减少他们累积压力造成失误的可能性。也许这个岗位本身就不适合久待：在任务中壮烈牺牲几乎是所有老督察组成员一贯的结局。",
      "陈没有任何退缩。她不曾退缩，不会退缩，也不懂退缩。",
      "她成了龙门警史中升职最快的警官，同时也是最年轻的近卫局特别督察组组长。原本嘲笑或是背地里阴损她的人，无不为她的气魄和坚毅折服，毕竟对未来有规划是一回事，每一天都在执行规划是另一回事。",
      "她为何那么卖力？为何投入自己的生命至如斯地步？没人懂，也没人能懂。",
      "陈的废纸篓里，常有撕得粉碎或揉成一团的残页，写满了莫名的怒意。",
    ],
  },
  {
    name: "archive3",
    tab: "档案资料三",
    short: "信赖 150%",
    unlock: "提升信赖至150%以查看更多信息",
    paras: [
      "当然，陈并不是一个完全的工作狂人或警务机器。",
      "认识她的警员与干员们表示，她更像是个完美的人。合理地分配所有时间，饮食与个人爱好也从不落下，用有意义的事情填满一天中的每一分每一秒。",
      "这反而更让人为她担忧。假期的突然取消和假期内的完全失踪都是正常的，加班到深夜、堆积如山的卷宗第二天消弭无踪、欣赏完新电影后立刻出现在紧急会议上，也是正常的。",
      "陈对待自己的方式就是如此高效，仿佛一台没法停下来的机器，这让人总会想要询问她一个问题。",
      "“你不要紧吧？”",
      "“没事。”",
      "尚未有人得到过其他的答案，所有受访者的回答都是一致的。",
      "陈日复一日地重复着自己的生活，不断地解决龙门内的问题；同时，她的身手愈加利落，思维也越来越明晰。她在不断成为一个更好的人，且未见极限。",
      "可她究竟在追求什么？",
      "就连她的那些好友也不敢说自己理解陈。她有太多只留给自己的事情。",
    ],
  },
  {
    name: "archive4",
    tab: "档案资料四",
    short: "信赖 200%",
    unlock: "提升信赖至200%以查看更多信息",
    lead: "【权限记录】",
    paras: [
      "“你的父亲已经和你断绝关系。他同样也和我再无瓜葛，我不会在乎，他也不会。\n你想离开这里？\n可以。不过在那之前，我要说些事情给你听。\n——其实我知道那个老人是谁。\n但我很健忘，我会忘掉许多事——比如说那天晚上你和你朋友小小的冒险。忘掉这件事简直轻而易举。\n这的确是我的错，没错。我犯下了不可饶恕的错误。\n可我会忘记。\n如果你想离开，我会把你送到很安全的城市，又富饶又安稳。你在那里会平静地度过一生，很幸福。\n而你将告别这里的一切。你厌恶的家，你讨厌的街道，你嫌弃的人。\n只是，你将失去了解任何真相的机会，因为这些事实既隐秘又危险，我不能让无关的人被卷入其中。\n生气？你生气了？你讨厌我？\n嗯，当然可以。换作是我，也一定会讨厌这样一个无能的人。",
      "另一个选择，听好了。\n你选择留下。\n从今往后，我会锻炼你。你可以讨厌我，恨我，甚至可以尝试攻击我，刺杀我。\n怎么不可以？当然可以。如果你能的话，就这么做；如果你能做到，你自然可以这么做。\n你的身体属于你自己，你的思想也是。我会教你对错，但好歹究竟，以后你该自己琢磨。\n不想忘记，就去做。\n正确行事值得你努力一生；纠正错误却值得人押上性命。\n就连我也不清楚有什么会在这座城市的前方等着我们。这是一座充满机遇的城市，什么都可能发生。\n听不懂也没关系，你会懂的。\n趁我还记得那件事。趁我还记得你们最后说的那些话。\n是放弃，还是坚持？\n选吧。”",
    ],
    sign: "......模拟结束......\n......正在回到主界面......",
  },
  {
    name: "promotion",
    tab: "晋升记录",
    short: "精英二",
    unlock: "提升至精英阶段2以查看更多信息",
    paras: [
      "她一定会回来。",
    ],
  },
];
</script>

<template>
  <AkTabs placement="left" label="人员档案">
    <AkTabPane name="profile" display-directive="show:lazy">
      <template #tab>基础档案<small>初始开放</small></template>
      <AkDossier title="基础档案" unlock="初始开放">
        <AkKv>
          <AkKvItem v-for="[k, v] in profile" :key="k" :term="k">{{ v }}</AkKvItem>
        </AkKv>
      </AkDossier>
    </AkTabPane>
    <AkTabPane name="exam" display-directive="show:lazy">
      <template #tab>综合体检测试<small>初始开放</small></template>
      <AkDossier title="综合体检测试" unlock="初始开放">
        <AkAttrs compact>
          <AkAttr name="物理强度" value="优良" />
          <AkAttr name="战场机动" value="标准" />
          <AkAttr name="生理耐受" value="优良" />
          <AkAttr name="战术规划" value="优良" />
          <AkAttr name="战斗技巧"><span class="ak-fg-accent">卓越</span></AkAttr>
          <AkAttr name="源石技艺适应性" value="标准" />
        </AkAttrs>
        <p class="ak-fs-xs ak-fg-muted ak-mt-2">体细胞与源石融合率 / 血液源石结晶密度：未公开</p>
      </AkDossier>
    </AkTabPane>
    <AkTabPane v-for="f in files" :key="f.name" :name="f.name" display-directive="show:lazy">
      <template #tab>{{ f.tab }}<small>{{ f.short }}</small></template>
      <AkDossier :title="f.tab" :unlock="f.unlock">
        <p v-if="f.redacted"><AkRedacted>{{ f.redacted }}</AkRedacted></p>
        <p v-for="(p, i) in f.paras" :key="i"><template v-if="i === 0 && f.lead"><b>{{ f.lead }}</b><br /></template>{{ p }}</p>
        <p v-if="f.sign" class="ak-fg-muted">{{ f.sign }}</p>
      </AkDossier>
    </AkTabPane>
  </AkTabs>
</template>
