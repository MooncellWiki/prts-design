<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkItem from "../../Item/AkItem.vue";
import AkItemList from "../../Item/AkItemList.vue";
import AkTag from "../../Tag/AkTag.vue";
import AkModule from "../AkModule.vue";
import AkModuleStage from "../AkModuleStage.vue";
import AkModuleUnlock from "../AkModuleUnlock.vue";

const f = (id: string) => asset(`item/framed/${id}.png`);

const story = [
  "七月七，晴。生辰，她激动地想要为魏彦吾展示拔刀，却找不到魏彦吾的踪影。等了三天，没有等到。",
  "五月十三，多云。以泪锋斩断了庭中的三十年老树，砸坏了屋顶。魏彦吾没有出现，只是差人植了一棵新的。她不再期待魏彦吾的认可。",
  "一月一，大雨。贺年，倾盆大雨，去贫民区的途中路见不平，愤而出手，以一敌十五。生死攸关之际，以随身佩剑递出奔夜，伤七人，退八人。闹到了上面，魏彦吾难得出现，看了剑痕后，只看她一眼就走了。她忘了自己当时为何出手，却永远不会忘记那一眼中的失望。",
  "十二月二十五，晴。从近卫学院返乡路上见义勇为，浑然无惧，扬眉之剑，当放则放。她意气风发，以为自己可以荡平天下不平事。",
  "七月三十，多云。以昏迷五天为代价，递出绝影，最终斩了重大通缉犯，龙门陈晖洁，崭露头角。醒来之后，赤霄放在她的床头，魏彦吾没有来看过她。",
  "八月十三，阴。追捕感染者罪犯途中，欲以赤霄出手，赤霄纹丝未动。而后，生死攸关之际，福至心灵，赤霄拔刀，斩塌了半个地下车库。她去找魏彦吾想知道赤霄究竟为何，魏彦吾没有见她。",
  "九月三十，晴。赤霄二度出鞘，斩开一扇金库大门，救出其中人质。她开始理解，赤霄乃意志之剑。她以为她一直以来做得够多，其实是她做得太少。她必须更快，她必须更有力。",
  "七月七，多云。生辰，十几年来，魏彦吾第一次提出要看一看她的剑，她凝聚一路所学，以未完成的云裂作为答卷，魏彦吾不置可否。",
  "一月十一，晴。与罗德岛一同离开龙门。之后一路，赤霄鲜少出鞘。",
];

const unlock = [
  { stage: 1, trust: "0%", items: [["mod_unlock_token", "模组数据块", 4], ["30135", "D32钢", 2], ["4001", "龙门币", "8万"]] },
  { stage: 2, trust: "50%", items: [["mod_unlock_token", "模组数据块", 4], ["mod_update_token_1", "数据增补条", 60], ["30145", "晶体电子单元", 3], ["4001", "龙门币", "10万"]] },
  { stage: 3, trust: "100%", items: [["mod_unlock_token", "模组数据块", 4], ["mod_update_token_2", "数据增补仪", 20], ["30115", "聚合剂", 4], ["4001", "龙门币", "12万"]] },
] as const;
</script>

<template>
  <AkModule
    name="罗德岛制式剑"
    :src="asset('module/uniequip_002_chen.png')"
    type-name="SWO-X"
    :type-icon="asset('module/type_swo-x.png')"
    color="red"
    hint="调整效果含特性调整与天赋调整。所有效果调整先于潜能提升生效，此处只显示潜能提升前的调整效果，实际变化请参照游戏内表述。"
  >
    <p>
      <template v-for="(line, i) in story" :key="i"><br v-if="i" />{{ line }}</template>
    </p>
    <template #stages>
      <AkModuleStage :stage="1" :stats="{ 攻击: '+50', 攻击速度: '+5' }" kicker="特性追加">技能期间造成的伤害提升<span class="ak-rt-vup">10%</span></AkModuleStage>
      <AkModuleStage :stage="2" :stats="{ 攻击: '+65', 攻击速度: '+6' }" kicker="天赋更新">天赋【呵斥】更新：在场时每<span class="ak-rt-vup">3</span>秒回复全场友方角色1点攻击/受击技力</AkModuleStage>
      <AkModuleStage :stage="3" :stats="{ 攻击: '+80', 攻击速度: '+7' }" kicker="天赋更新">天赋【呵斥】更新：在场时每3秒回复全场友方角色1点攻击/受击技力，<span class="ak-rt-rem">自身额外回复1点技力</span></AkModuleStage>
    </template>
    <template #tasks>
      <li>完成5次战斗；必须编入非助战陈并上场，且每次战斗至少释放一次赤霄·拔刀或赤霄·绝影</li>
      <li>3星通关主题曲 <a class="ak-stage-code" href="#">5-8</a>；必须编入非助战陈并上场，且使用陈至少歼灭16名敌人</li>
    </template>
    <template #unlock>
      <AkModuleUnlock v-for="u in unlock" :key="u.stage" :stage="u.stage">
        <template #requirement>
          <span class="ak-trust">{{ u.trust }}</span>
          <template v-if="u.stage === 1">
            <span class="ak-elite"><img :src="asset('elite/elite_2.png')" alt="" />精英二 Lv60</span>
            <AkTag size="sm" variant="outline" title="完成本模组所有模组解锁任务">✓ 全部解锁任务</AkTag>
          </template>
        </template>
        <AkItemList>
          <AkItem v-for="[id, name, count] in u.items" :key="id" :src="f(id)" :name="name" :count="count" size="sm" />
        </AkItemList>
      </AkModuleUnlock>
    </template>
  </AkModule>
</template>
