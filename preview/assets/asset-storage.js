/* preview/assets/asset-storage.js — ak-asset-storage 设计稿的少量交互：主题三态、页签、折叠面板、树展开、对话框 / 搜索面板开合。
 * 只为看稿，不是实现；实现时这些都在 Vue 组件（@mooncellwiki/prts-design-vue）里。 */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

  /* ── 主题：os / light / dark（同 prts-design preview.js；首帧由 skeleton 里的内联脚本打好） ── */
  const KEY = 'akas-theme';
  function applyTheme(mode) {
    const h = document.documentElement;
    h.removeAttribute('data-theme');
    h.classList.remove('skin-theme-clientpref-os', 'skin-theme-clientpref-day', 'skin-theme-clientpref-night');
    if (mode === 'light') { h.setAttribute('data-theme', 'light'); h.classList.add('skin-theme-clientpref-day'); }
    else if (mode === 'dark') { h.setAttribute('data-theme', 'dark'); h.classList.add('skin-theme-clientpref-night'); }
    else { mode = 'os'; h.classList.add('skin-theme-clientpref-os'); }
    h.dataset.akasTheme = mode;
    $$('.ak-theme-toggle > button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.theme === mode)));
    try { localStorage.setItem(KEY, mode); } catch (e) { /* ignore */ }
  }
  applyTheme(document.documentElement.dataset.akasTheme || 'os');
  $$('.ak-theme-toggle > button').forEach(b => b.addEventListener('click', () => applyTheme(b.dataset.theme)));

  /* ── 页眉当前项：按文件名对上 ── */
  const here = location.pathname.split('/').pop() || 'akas-versions.html';
  $$('.as-nav a').forEach(a => { const h = a.getAttribute('href'); const on = h === here || (here === 'akas-file.html' && h === 'akas-files.html') || (/^akas-(search|states)\.html$/.test(here) && h === 'akas-versions.html'); a.classList.toggle('is-active', on); if (on) a.setAttribute('aria-current', 'page'); });

  /* ── 页签（role=tablist > [role=tab]），面板按 aria-controls ── */
  $$('[role="tablist"]').forEach(list => {
    const tabs = $$('[role="tab"]', list);
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => { t.setAttribute('aria-selected', String(t === tab)); t.classList.toggle('is-active', t === tab); const p = t.getAttribute('aria-controls') && document.getElementById(t.getAttribute('aria-controls')); if (p) p.hidden = t !== tab; });
    }));
  });

  /* ── 分段开关 / 按钮组 / 芯片：aria-pressed 互斥 ── */
  $$('.ak-seg, .ak-btn-group[data-exclusive]').forEach(g => $$('[aria-pressed]', g).forEach(b => b.addEventListener('click', () => {
    $$('[aria-pressed]', g).forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('is-active', x === b); });
    if (b.dataset.view) { const pane = g.closest('.as-pane') || document; $$('[data-view-panel]', pane).forEach(el => { el.hidden = el.dataset.viewPanel !== b.dataset.view; }); }
  })));
  $$('.ak-chip[aria-pressed], .as-kind[aria-pressed]').forEach(c => c.addEventListener('click', () => c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true'))));

  /* ── 可折叠面板 ── */
  $$('.ak-panel--collapsible > .ak-panel__head').forEach(h => h.addEventListener('click', () => h.parentElement.classList.toggle('is-collapsed')));

  /* ── 树：点目录行开合、点任意行选中 ── */
  $$('.as-tree').forEach(tree => tree.addEventListener('click', e => {
    const row = e.target.closest('.as-tree__row'); if (!row) return;
    const li = row.parentElement;
    if (e.target.closest('.as-tree__caret')) { li.classList.toggle('is-open'); row.setAttribute('aria-expanded', String(li.classList.contains('is-open'))); return; }
    $$('.as-tree__row.is-selected', tree).forEach(r => r.classList.remove('is-selected'));
    row.classList.add('is-selected');
    if (li.querySelector(':scope > ul') && !li.classList.contains('is-open')) { li.classList.add('is-open'); row.setAttribute('aria-expanded', 'true'); }
  }));

  /* ── 对话框 / 抽屉 / 搜索面板：[data-open="#id"] 打开，[data-close] 关闭 ── */
  $$('[data-open]').forEach(b => b.addEventListener('click', () => {
    const t = $(b.dataset.open); if (!t) return;
    if (t.tagName === 'DIALOG') { t.showModal(); } else { t.hidden = false; t.classList.add('is-open'); }
  }));
  $$('[data-close]').forEach(b => b.addEventListener('click', () => {
    const t = b.closest('dialog, .ak-palette, .ak-drawer, .as-layer'); if (!t) return;
    if (t.tagName === 'DIALOG') t.close(); else { t.hidden = true; t.classList.remove('is-open'); const bd = $('.ak-palette-backdrop'); if (bd) bd.hidden = true; }
  }));
  $$('.ak-palette-backdrop').forEach(bd => bd.addEventListener('click', () => { bd.hidden = true; const p = $('.ak-palette'); if (p) p.hidden = true; }));

  /* 页眉搜索触发器：本稿里跳到 search.html（面板打开态）；实现里是就地打开面板 */
  const trig = $('#as-search-trigger');
  if (trig) trig.addEventListener('click', () => { if (!$('.ak-palette')) location.href = 'akas-search.html'; else { $('.ak-palette').hidden = false; $('.ak-palette-backdrop').hidden = false; } });
  document.addEventListener('keydown', e => {
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !/input|textarea|select/i.test(e.target.tagName))) { e.preventDefault(); trig && trig.click(); }
    if (e.key === 'Escape') { const p = $('.ak-palette'); if (p && !p.hidden) { p.hidden = true; $('.ak-palette-backdrop').hidden = true; } }
  });

  /* 复制按钮：真的复制 data-copy 的内容，并弹一条 toast */
  function toast(text, kind) {
    let box = $('.ak-toasts'); if (!box) { box = document.createElement('div'); box.className = 'ak-toasts'; document.body.appendChild(box); }
    const t = document.createElement('div'); t.className = 'ak-toast' + (kind ? ' ak-toast--' + kind : ''); t.setAttribute('role', 'status');
    t.innerHTML = '<svg class="ak-message__icon" style="width:18px;height:18px;color:var(--_c)"><use href="#i-check"/></svg><div class="ak-toast__body">' + text + '</div><i class="ak-toast__progress" style="--_dur:3s"></i>';
    box.appendChild(t); setTimeout(() => t.remove(), 3000);
  }
  $$('[data-copy]').forEach(b => b.addEventListener('click', () => { const s = b.dataset.copy; (navigator.clipboard ? navigator.clipboard.writeText(s) : Promise.resolve()).then(() => toast('已复制：<code>' + s.replace(/</g, '&lt;') + '</code>', 'success')); }));
})();
