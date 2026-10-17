/*! 敌人页设计稿的脚本：评级阈值弹窗。生产环境 = 微件:EnemyDataController 那一侧；preview/enemy*.html 五张样例共用。
   悬停说明（问号、表头术语、评级字母…）都是 .mc-tooltips，由现网 Tooltip.js 的快照 vendor/tooltip/Tooltip.js 负责，这里不管 */
/* 评级阈值弹窗：阈值同现网 微件:EnemyDataController；生产环境这段进微件，点击代理照皮肤 interactive.js 的 data-dialog-open */
(function () {
  var RANK = {
    hp: ['生命值', '最大生命值。越高越不容易被击倒。', 'atLeast', [[0,'E'],[1000,'D'],[3500,'C'],[5000,'B'],[8000,'B+'],[12000,'A'],[25000,'A+'],[100000,'S'],[250000,'S+'],[500000,'SS']]],
    atk: ['攻击力', '越高直接威胁越大。', 'atLeast', [[0,'E'],[200,'D'],[300,'C'],[500,'B'],[700,'B+'],[1000,'A'],[1500,'A+'],[2000,'S'],[3000,'S+'],[5000,'SS']]],
    def: ['防御力', '越高越能接下物理伤害。', 'atLeast', [[0,'E'],[100,'D'],[200,'C'],[500,'B'],[800,'B+'],[1000,'A'],[1200,'A+'],[2000,'S'],[3000,'S+'],[5000,'SS']]],
    res: ['法术抗性', '越高越能接下法术伤害。', 'atLeast', [[0,'E'],[1,'D'],[10,'C'],[20,'B'],[30,'B+'],[50,'A'],[60,'A+'],[70,'S'],[80,'S+'],[90,'SS']]],
    movespeed: ['移动速度', '格 / 秒。实际移速受地图倍率（通常 0.5）影响。', 'atLeast', [[0,'E'],[0.3,'D'],[0.5,'C'],[0.7,'B'],[0.9,'B+'],[1.0,'A'],[1.2,'A+'],[1.5,'S'],[1.8,'S+'],[2.0,'SS']]],
    atkspeed: ['攻击间隔', '秒。越短单位时间攻击次数越多，评级越高。', 'atMost', [[0.5,'SS'],[0.8,'S+'],[1.0,'S'],[1.2,'A+'],[1.7,'A'],[2.6,'B+'],[3.5,'B'],[5.0,'C'],[6.9,'D'],[Infinity,'E']]],
    eres: ['元素抗性', '越高越能接下元素伤害。', 'atLeast', [[0,'E'],[1,'D'],[10,'C'],[20,'B'],[30,'B+'],[50,'A'],[60,'A+'],[70,'S'],[80,'S+'],[90,'SS']]],
    epres: ['损伤抵抗', '越高受到的元素损伤衰减越多，越难进入元素爆发。', 'atLeast', [[0,'E'],[1,'D'],[10,'C'],[20,'B'],[30,'B+'],[50,'A'],[60,'A+'],[70,'S'],[80,'S+'],[90,'SS']]]
  };
  var fmt = function (n) { return n === Infinity ? '∞' : String(n); };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.en-grade'); if (!b) return;
    var d = RANK[b.dataset.stat]; if (!d) return;
    var dlg = document.getElementById('en-grade-dialog');
    document.getElementById('en-grade-dialog-title').textContent = '属性评级：' + d[0];
    document.getElementById('en-grade-dialog-desc').textContent = d[1];
    document.getElementById('en-grade-dialog-th').textContent = d[2] === 'atLeast' ? '不低于' : '低于';
    var cur = b.textContent.trim();
    document.getElementById('en-grade-dialog-rows').innerHTML = d[3].map(function (r) { return '<tr' + (r[1] === cur ? ' class="is-selected"' : '') + '><td>' + r[1] + '</td><td>' + fmt(r[0]) + '</td></tr>'; }).join('');
    dlg.showModal();
  });
})();
