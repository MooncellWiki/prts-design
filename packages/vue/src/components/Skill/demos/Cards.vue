<script setup lang="ts">
import { asset } from "../../../demo/asset";
import AkRichText from "../../RichText/AkRichText.vue";
import AkSkill from "../AkSkill.vue";

/** 陈的三个技能，7 级数据 */
const terms = { "ba.stun": "晕眩：无法移动、阻挡、攻击及使用技能" };
</script>

<template>
  <div class="ak-flex-col ak-gap-3">
    <AkSkill name="赤霄·绝影" :icon="asset('skill/chen_3.png')" sp-type="attack" trigger="manual" :cost="36" :init="10" duration="—" selected>
      <AkRichText
        text="向周围寻找最近的敌方目标，对其发动<@ba.vup>10</>次连续斩击，每次造成相当于攻击力<@ba.vup>260%</>的物理伤害，并在最后一击时使目标<$ba.stun>晕眩</><@ba.vup>3</>秒"
        :terms="terms"
      />
    </AkSkill>
    <AkSkill name="赤霄·拔刀" :icon="asset('skill/chen_2.png')" sp-type="attack" trigger="manual" :cost="25" :init="14">
      <AkRichText
        text="对前方范围内最多<@ba.vup>6</>名敌人造成相当于攻击力<@ba.vup>410%</>的<@ba.rem>物理</>和相当于攻击力<@ba.vup>410%</>的<@ba.rem>法术</>伤害"
      />
    </AkSkill>
    <AkSkill name="鞘击" :icon="asset('skill/chen_1.png')" sp-type="attack" trigger="auto" :cost="5" :init="0">
      <AkRichText text="下次攻击使用刀鞘砸向敌人，造成相当于攻击力<@ba.vup>260%</>的物理伤害，令命中目标<$ba.stun>晕眩</><@ba.vup>1.5</>秒" :terms="terms" />
    </AkSkill>
  </div>
</template>
