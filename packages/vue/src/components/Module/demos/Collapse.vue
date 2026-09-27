<script setup lang="ts">
import { ref } from "vue";

import { asset } from "../../../demo/asset";
import AkButton from "../../Button/AkButton.vue";
import AkModule from "../AkModule.vue";
import AkModuleStage from "../AkModuleStage.vue";

/** 展开态用 v-model 接出来：外面的按钮也能展开 / 收起 */
const open = ref(false);

const story = [
  "大地的伤痕自天际线奔袭而来，精准地击中一片维多利亚式建筑群，楼宇如同遭遇旋风袭击的树林，围绕着同一个点以放射状倒塌。在这片帝国的废墟之中，两个身影正翻过一座倒下的石碑，试图寻找高点。",
  "“这里荒废多久了？”陈站在废墟上远眺，身后的石碑上那些曾经象征着荣誉的名字都被涂抹殆尽。",
  "“这片校舍自从战争爆发那会儿就弃用了，还没完成学业的学弟学妹们被分流到了新的校区，完成了剩下的课程......陈陈，前面是我们以前的老训练场，你还记得吗？”风笛的声音从低处传来。",
  "“我记得特别清楚，感觉自己当学生的时候总是错过一些好事。一到毕业路也修好了，训练场也修好了。”训练场被冲击波挤成了一片片翘起的地块，陈捡起了一块石头，丢进地块夹缝中冒出的灌木丛，躲在其中的羽兽尖叫着扑腾向远处。",
  "“那时候已经足够好啦。”风笛的声音自远而近，停留在了陈的耳畔。",
  "“也是。那可能是我最单纯的一段时间了，不用去思考一些麻烦的问题，只需要专心训练和学习。”",
  "“这就是当时的你每天疯狂训练，全常规科目拿A的动力？”风笛将双手搭在陈的肩上，轻轻地摇晃着。",
  "“回去以后，我发现有太多的事无法用刀剑解决，有些时候会觉得自己过于渺小，即便努力工作，也无法改变很多事——消灭敌人有的时候并不能解决问题。”陈摇了摇头，好像要把过去的庞杂思绪都从脑海中丢出去。",
  "两人走下高坡，记忆中的花圃还在原地。曾经高悬的近卫学校标志一半深深插入泥土，一半斜靠在断裂的石柱上。夕阳西下，阳光倾泻在已有斑驳锈迹的标志上，仅剩的金属光泽诉说着这里曾经的荣光。",
  "“一切都变了，维多利亚不也一样吗？”陈盯着校徽，喃喃自语道。",
  "“还是有人没有变的。知道你要来，我前几天特意去拜访了泰勒教官。当时你走得太匆忙，留在宿舍里的文件啥的都没带走——她这些年一直保管着你这些东西。这是你的学业通过证明。哦对了，还有这个！”风笛从随身的包里掏出了一叠证件，还有一把木剑。",
  "“这是你当年的训练用剑，按道理是要收回的，但是你的成绩太好了，教官本来打算给你个惊喜，想把这把剑送给你......”",
  "“代我向她表示感谢。那会儿我走得太快了......”",
  "“至少你现在回来了。这些年，我们很多同学再也没有回来。”",
  "两人沉默了一会儿。",
  "“十年后，你觉得你会在哪？”",
  "“谁知道呢，应该要回去吧，还有很多事要做。”陈向远方看去，那正是龙门的方向，“那时无论来这上学还是离开，都是他们安排好的。现在，我要自己走回去了。”",
];
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <div class="ak-flex ak-gap-3 ak-items-center">
      <AkButton size="sm" @click="open = !open">{{ open ? "收起故事" : "展开故事" }}</AkButton>
      <span class="ak-fs-xs ak-fg-muted">v-model = {{ open }}</span>
    </div>
    <AkModule
      v-model="open"
      name="往昔时光"
      :src="asset('module/uniequip_003_chen.png')"
      type-name="SWO-Y"
      :type-icon="asset('module/type_swo-y.png')"
      color="red"
    >
      <p>
        <template v-for="(line, i) in story" :key="i"><br v-if="i" />{{ line }}</template>
      </p>
      <template #stages>
        <AkModuleStage :stage="1" :stats="{ 攻击: '+52', 防御: '+28' }" kicker="特性追加">攻击时无视敌人<span class="ak-rt-vup">70</span>点的防御力</AkModuleStage>
        <AkModuleStage :stage="3" :stats="{ 攻击: '+85', 防御: '+42' }" kicker="天赋更新">天赋【持刀格斗术】更新：攻击力<span class="ak-rt-vup">+15%</span>，防御力<span class="ak-rt-vup">+15%</span>，物理闪避<span class="ak-rt-vup">+18%</span></AkModuleStage>
      </template>
    </AkModule>
  </div>
</template>
