/* AKDS preview — 交互脚本（演示用；MW 中对应 ResourceLoader 模块 skins.akds.js） */
(function () {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  /* ── Theme (os / light / dark) ─────────────────────────────── */
  const THEME_KEY = 'akds-theme';
  function applyTheme(mode) {
    const html = document.documentElement;
    html.removeAttribute('data-theme');
    html.classList.remove('skin-theme-clientpref-os', 'skin-theme-clientpref-day', 'skin-theme-clientpref-night');
    if (mode === 'light') { html.setAttribute('data-theme', 'light'); html.classList.add('skin-theme-clientpref-day'); }
    else if (mode === 'dark') { html.setAttribute('data-theme', 'dark'); html.classList.add('skin-theme-clientpref-night'); }
    else { html.classList.add('skin-theme-clientpref-os'); }
    $$('.ak-theme-toggle > button').forEach(b => b.classList.toggle('is-active', b.dataset.theme === mode));
    try { localStorage.setItem(THEME_KEY, mode); } catch (e) {}
  }
  window.akdsSetTheme = applyTheme;
  /* 初始主题：URL ?theme= > localStorage > 页面默认(data-default-theme) > 宿主已打的 data-theme > 跟随系统 */
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) {}
  const q = new URLSearchParams(location.search).get('theme'); if (q) saved = q;
  if (!saved) saved = document.documentElement.dataset.defaultTheme || document.documentElement.getAttribute('data-theme') || 'os';
  applyTheme(saved);
  document.addEventListener('click', e => {
    const b = e.target.closest('.ak-theme-toggle > button');
    if (b) applyTheme(b.dataset.theme);
  });

  /* ── 示例活动主题（demo-theme.css：只覆盖 tokens.css §2d 的接口变量）：html.ak-theme-demo 开关，记忆到 localStorage；MW 上对应 Gadget 加载/卸载 ── */
  const DEMO_KEY = 'akds-demo-theme';
  function applyDemoTheme(on) {
    document.documentElement.classList.toggle('ak-theme-demo', on);
    $$('.ak-demo-theme-toggle').forEach(b => { b.setAttribute('aria-pressed', on); const st = $('[data-demo-state]', b); if (st) st.textContent = on ? '开' : '关'; });
    try { localStorage.setItem(DEMO_KEY, on ? '1' : '0'); } catch (e) {}
  }
  window.akdsSetDemoTheme = applyDemoTheme;
  let demoSaved = null;
  try { demoSaved = localStorage.getItem(DEMO_KEY); } catch (e) {}
  const dq = new URLSearchParams(location.search).get('demo'); if (dq != null) demoSaved = dq === '1' || dq === 'on' ? '1' : '0';
  applyDemoTheme(demoSaved === '1');
  document.addEventListener('click', e => {
    const b = e.target.closest('.ak-demo-theme-toggle');
    if (b) { e.preventDefault(); applyDemoTheme(!document.documentElement.classList.contains('ak-theme-demo')); }
  });

  /* ── Catlinks tidy：去掉 MW 输出的「：」文本节点，把「隐藏分类」文字标签包成 span（CSS 已能无 JS 吞掉冒号，这里做归一） ── */
  function tidyCatlinks(root) {
    $$('.catlinks > div', root || document).forEach(div => {
      Array.from(div.childNodes).forEach(n => {
        if (n.nodeType !== 3) return;
        const t = n.nodeValue.replace(/[\s\u200b\u200e\u200f\ufeff:：]+$/, '').trim();
        if (!t) { n.remove(); return; }
        const span = document.createElement('span'); span.className = 'ak-catlinks__label'; span.textContent = t; div.replaceChild(span, n);
      });
    });
  }
  window.akdsTidyCatlinks = tidyCatlinks; tidyCatlinks();

  /* ── Sidebar drawer (mobile)（搜索面板 → ../src/search-palette.js + search-mock.js，皮肤与预览共用核心）── */
  document.addEventListener('click', e => {
    if (e.target.closest('.ak-local-nav__menu')) { $('.ak-sidebar').classList.toggle('is-open'); toggleOverlay($('.ak-sidebar').classList.contains('is-open')); }
    if (e.target.closest('.ak-sidebar__close') || e.target.closest('.ak-overlay')) { $('.ak-sidebar').classList.remove('is-open'); toggleOverlay(false); }
  });
  function toggleOverlay(on) {
    let o = $('.ak-overlay.ak-overlay--sidebar');
    if (on && !o) { o = document.createElement('div'); o.className = 'ak-overlay ak-overlay--sidebar'; document.body.appendChild(o); }
    if (!on && o) o.remove();
  }

  /* ── TOC generation + scrollspy + progress ─────────────────── */
  const tocList = $('.ak-toc ul[data-auto-toc]');
  const content = $('.mw-body-content');
  if (tocList && content) {
    const heads = $$('h2, h3', content).filter(h => h.id || h.textContent.trim());
    let cur2 = null;
    heads.forEach(h => {
      if (!h.id) h.id = h.textContent.trim().replace(/\s+/g, '_').replace(/[^\w一-龥_-]/g, '');
      const li = document.createElement('li'); const a = document.createElement('a'); a.href = '#' + h.id; a.textContent = h.textContent.replace(/\[.*?\]/g, '').trim(); li.appendChild(a);
      if (h.tagName === 'H2') { tocList.appendChild(li); cur2 = li; }
      else if (cur2) { let ul = cur2.querySelector('ul'); if (!ul) { ul = document.createElement('ul'); cur2.appendChild(ul); } ul.appendChild(li); }
    });
    tocScrollspy(tocList, heads);
  }
  /* scrollspy —— 参考 VitePress useActiveAnchor / Docusaurus useTOCHighlight：滚动驱动、按 DOM 顺序取「基准线以上最后一个标题」，确定性算法。
   * 此前用 IntersectionObserver（rootMargin -80px / -70%）「谁进观察带谁 active」：锚点跳转后目标标题与紧随其后的标题同批进带，回调里排后者赢，
   * 高亮就跳到下一项（点「MediaWiki 内容样式」亮「链接与行内」，点「链接与行内」亮「引用与代码」），是否同批又取决于跳转前的位置 → 时好时坏。
   *  · 基准线 = 每个标题自己的 scroll-margin-top（浏览器锚点跳转后标题恰好停在这里）+ 4px 容差，所以点目录跳到哪项就一定亮哪项；
   *  · 点击目录时立即高亮并忽略随之而来的那一次 scroll（页底几节滚不到基准线，否则会被「页底 → 最后一项」规则盖掉）；
   *  · 页顶不高亮，页底高亮最后一项；display:none 的标题（收起的 tab / 折叠块）跳过；active 项保持在目录自身滚动区可见（只滚目录，不动窗口）。 */
  function tocScrollspy(list, heads) {
    const byId = new Map($$('a[href^="#"]', list).map(a => [decodeURIComponent(a.getAttribute('href').slice(1)), a]));
    const box = list.closest('.ak-toc__inner') || list.parentElement;
    const shown = h => { const r = h.getBoundingClientRect(); return r.width > 0 || r.height > 0; };
    let prev = null, ignoreOnce = false, raf = 0;
    function activate(h) {
      const a = (h && byId.get(h.id)) || null; if (a === prev) return;
      if (prev) prev.parentElement.classList.remove('is-active');
      prev = a; if (!a) return;
      a.parentElement.classList.add('is-active');
      const rb = box.getBoundingClientRect(), ra = a.getBoundingClientRect();
      if (ra.top < rb.top) box.scrollTop -= rb.top - ra.top; else if (ra.bottom > rb.bottom) box.scrollTop += ra.bottom - rb.bottom;
    }
    function update() {
      raf = 0;
      if (ignoreOnce) { ignoreOnce = false; return; }
      const y = window.scrollY, d = document.documentElement;
      if (y < 1) { activate(null); return; }
      if (y + window.innerHeight >= d.scrollHeight - 1) { activate(heads.slice().reverse().find(shown)); return; }
      let cur = null;
      for (const h of heads) {
        if (!shown(h)) continue;
        if (h.getBoundingClientRect().top > (parseFloat(getComputedStyle(h).scrollMarginTop) || 0) + 4) break;
        cur = h;
      }
      activate(cur);
    }
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    list.addEventListener('click', e => {
      const a = e.target.closest('a[href^="#"]'); if (!a) return;
      const h = document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));
      if (h) { ignoreOnce = true; activate(h); }
    });
    update();
  }
  const prog = $('.ak-toc__progress > i');
  if (prog) window.addEventListener('scroll', () => { const d = document.documentElement; prog.style.setProperty('--_p', (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%'); }, { passive: true });

  /* ── 目录浮层收尾（开合本身是纯 CSS 的 .ak-toc-cb）───────────── */
  const tocCb = $('.ak-toc-cb');
  if (tocCb) {
    const closeToc = () => { tocCb.checked = false; };
    document.addEventListener('click', e => {
      if (!tocCb.checked) return;
      if (e.target.closest('.ak-toc a')) { closeToc(); return; }             // 跳转后收起
      // 点击浮层外收起。放行 .ak-toc-cb：点 label 会再向 checkbox 派发一次 click，那次不算「外部」
      if (!e.target.closest('.ak-toc, .ak-local-nav__toc, .ak-toc-cb')) closeToc();
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeToc(); });
  }

  /* ── 工具卡片（<1120 页眉 ≡ 拉下的 外观 / 通知 / 用户 卡片；开合本身是纯 CSS 的 .ak-nav-cb）：Esc / 选了链接 / 点卡片外 / 回到桌面宽度时收起 ── */
  const navCb = $('.ak-nav-cb');
  if (navCb) {
    const closeNav = () => { if (navCb.checked) navCb.checked = false; };
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && navCb.checked) { closeNav(); navCb.focus(); } });
    document.addEventListener('click', e => {
      if (!navCb.checked) return;
      if (e.target.closest('.ak-header__screen a[href]')) { closeNav(); return; }   // 演示页链接都是 #，不会整页刷新，主动收起
      if (e.target.closest('.ak-header__search-toggle')) { closeNav(); return; }   // 去开搜索面板了
      // 点卡片外收起。放行 .ak-nav-cb：点 label 会再向 checkbox 派发一次 click，那次不算「外部」
      if (!e.target.closest('.ak-header__screen, .ak-header__burger, .ak-nav-cb')) closeNav();
    });
    const mq = window.matchMedia('(min-width: 1120px)');
    (mq.addEventListener ? mq.addEventListener('change', e => { if (e.matches) closeNav(); }) : mq.addListener(e => { if (e.matches) closeNav(); }));
  }

  /* ── 页眉收起：向下滚动只留二级吸顶栏，向上滚 / 回到顶部再展开 ── */
  let lastY = window.scrollY, ticking = false;
  function onScroll() {
    const y = Math.max(0, window.scrollY), root = document.documentElement;
    if (!(tocCb && tocCb.checked) && !(navCb && navCb.checked)) {   // 目录浮层 / 工具卡片开着时不动，免得浮层跟着跳
      if (y < 120) root.classList.remove('ak-condensed');
      else if (y > lastY + 4) root.classList.add('ak-condensed');
      else if (y < lastY - 4) root.classList.remove('ak-condensed');
    }
    lastY = y; ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ── Tabs (.ak-tabs[data-tabs]) ────────────────────────────── */
  document.addEventListener('click', e => {
    const tab = e.target.closest('.ak-tabs[data-tabs] .ak-tab, .ak-tabs[data-tabs] .ak-tab');
    if (!tab) return;
    e.preventDefault();
    const tabs = tab.closest('.ak-tabs'); const group = tabs.dataset.tabs;
    $$('.ak-tab', tabs).forEach(t => { t.classList.toggle('is-active', t === tab); t.setAttribute('aria-selected', t === tab); });
    $$(`.ak-tabpanel[data-tabs="${group}"]`).forEach(p => { p.hidden = p.dataset.tab !== tab.dataset.tab; });
  });
  /* TabberNeue mock */
  document.addEventListener('click', e => {
    const tab = e.target.closest('.tabber__tab');
    if (!tab) return; e.preventDefault();
    const tabber = tab.closest('.tabber');
    $$('.tabber__tab', tabber).forEach(t => t.setAttribute('aria-selected', t === tab));
    const id = tab.getAttribute('href').slice(1);
    $$('.tabber__panel', tabber).forEach(p => { p.hidden = p.id !== id; });
  });
  $$('.tabber').forEach(tb => { const sel = $('.tabber__tab[aria-selected="true"]', tb); if (sel) { const id = sel.getAttribute('href').slice(1); $$('.tabber__panel', tb).forEach(p => p.hidden = p.id !== id); } });

  /* ── Collapsible panels（侧栏门户折叠 / 多层树 / 悬停飞出 → 见 ../src/sidebar-tree.js，皮肤与预览共用） ── */
  document.addEventListener('click', e => {
    const h = e.target.closest('.ak-panel--collapsible > .ak-panel__head'); if (h) h.parentElement.classList.toggle('is-collapsed');
    const mwt = e.target.closest('.mw-collapsible-toggle'); if (mwt) { const c = mwt.closest('.mw-collapsible'); c.classList.toggle('mw-collapsed'); const a = $('a', mwt); if (a) a.textContent = c.classList.contains('mw-collapsed') ? '展开' : '折叠'; }
  });

  /* ── Chips / button groups / phase & level selectors ───────── */
  document.addEventListener('click', e => {
    const chip = e.target.closest('.ak-chip'); if (chip && !chip.closest('[data-no-toggle]')) { chip.classList.toggle('is-active'); chip.setAttribute('aria-pressed', chip.classList.contains('is-active')); }
    const grp = e.target.closest('.ak-btn-group > .ak-btn, .ak-phase-tabs > button, .ak-skill-levels > button');
    if (grp) { const parent = grp.parentElement; $$(':scope > *', parent).forEach(b => b.classList.toggle('is-active', b === grp)); parent.dispatchEvent(new CustomEvent('akds:select', { bubbles: true, detail: { value: grp.dataset.value, el: grp } })); }
  });
  /* data-bind: 元素上 data-values='{"e0":"1684",...}' 根据选择器 change 更新文本 */
  document.addEventListener('akds:select', e => {
    const scope = e.detail.el.closest('[data-scope]') || document; const key = e.detail.value; if (!key) return;
    const sel = e.target.dataset.bind; if (!sel) return;
    $$(`[data-bind-${sel}]`, scope).forEach(el => { try { const m = JSON.parse(el.getAttribute(`data-bind-${sel}`)); if (m[key] != null) el.textContent = m[key]; } catch (err) {} });
    $$(`[data-show-${sel}]`, scope).forEach(el => { el.hidden = el.getAttribute(`data-show-${sel}`) !== key; });
  });

  /* data-toggle-class: 复选框勾选 → 给最近的 data-toggle-target（默认 table）加/去一个类（天赋表的「潜能加成」开关） */
  document.addEventListener('change', e => {
    const t = e.target.closest('[data-toggle-class]'); if (!t) return;
    const host = t.closest(t.dataset.toggleTarget || 'table'); if (host) host.classList.toggle(t.dataset.toggleClass, t.checked);
  });

  /* 技能参数矩阵 .ak-skill-matrix：悬停 / 点某一列 → 整列高亮，描述里的 .ak-var[data-var] 换成该级数值；离开还原区间（无 JS 时就是一张静态矩阵） */
  $$('.ak-skill-matrix').forEach(tb => {
    const sheet = tb.closest('.ak-skill-sheet') || tb.parentElement; const vars = $$('.ak-var[data-var]', sheet); vars.forEach(v => { v.dataset.range = v.textContent; });
    const cols = $$('thead th', tb); let pinned = -1;
    const paint = i => { cols.forEach((th, k) => th.classList.toggle('is-hl', k === i)); $$('tbody tr', tb).forEach(tr => { [...tr.children].forEach((c, k) => c.classList.toggle('is-hl', k === i)); const v = tr.dataset.var; if (v) vars.filter(x => x.dataset.var === v).forEach(x => { x.textContent = i > 0 && tr.children[i] ? tr.children[i].textContent : x.dataset.range; }); }); };
    tb.addEventListener('mouseover', e => { const c = e.target.closest('th, td'); if (!c || !tb.contains(c)) return; const i = [...c.parentElement.children].indexOf(c); if (i > 0) paint(i); });
    tb.addEventListener('mouseleave', () => paint(pinned));
    tb.addEventListener('click', e => { const c = e.target.closest('th, td'); if (!c) return; const i = [...c.parentElement.children].indexOf(c); pinned = (i > 0 && pinned !== i) ? i : -1; paint(pinned); });
  });

  /* ── Dialog / Toast / Dropdown ─────────────────────────────── */
  document.addEventListener('click', e => {
    const o = e.target.closest('[data-dialog-open]'); if (o) { const d = $(o.dataset.dialogOpen); if (d && d.showModal) d.showModal(); }
    const c = e.target.closest('[data-dialog-close]'); if (c) { const d = c.closest('dialog'); if (d) d.close(); }
    const t = e.target.closest('[data-toast]'); if (t) toast(t.dataset.toast, t.dataset.toastType || '', t.dataset.toastTitle || '');
  });
  function toast(msg, type, title) {
    let wrap = $('.ak-toasts'); if (!wrap) { wrap = document.createElement('div'); wrap.className = 'ak-toasts'; document.body.appendChild(wrap); }
    const el = document.createElement('div'); el.className = 'ak-toast' + (type ? ' ak-toast--' + type : ''); el.style.position = 'relative'; el.style.overflow = 'hidden';
    el.innerHTML = `<div>${title ? `<div class="ak-toast__title">${title}</div>` : ''}<div>${msg}</div></div><button class="ak-message__close" aria-label="关闭">✕</button><i class="ak-toast__progress"></i>`;
    $('.ak-message__close', el).onclick = () => el.remove(); wrap.appendChild(el); setTimeout(() => el.remove(), 5000);
  }
  window.akdsToast = toast;

  /* ── Voice play mock ───────────────────────────────────────── */
  document.addEventListener('click', e => { const p = e.target.closest('.ak-voice__play'); if (p) p.classList.toggle('is-playing'); });

  /* ── Back to top ───────────────────────────────────────────── */
  const fab = $('.ak-fab');
  if (fab) { window.addEventListener('scroll', () => fab.classList.toggle('is-visible', window.scrollY > 600), { passive: true }); fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' })); }
  // 目录浮层里的「回到顶部」（<1400 时替代 .ak-fab）：同样平滑滚动，且不往 URL 里塞 #
  document.addEventListener('click', e => { if (e.target.closest('.ak-toc__top')) { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } });

  /* ── Copy token on click (swatches) ────────────────────────── */
  document.addEventListener('click', e => {
    const sw = e.target.closest('[data-copy]'); if (!sw) return;
    navigator.clipboard && navigator.clipboard.writeText(sw.dataset.copy).then(() => toast('已复制 ' + sw.dataset.copy, 'success'));
  });

  /* ── Auto-generate palette swatch computed values ──────────── */
  $$('[data-token]').forEach(el => {
    const v = getComputedStyle(document.documentElement).getPropertyValue(el.dataset.token).trim();
    const out = $('.ak-swatch__value', el); if (out && v) out.textContent = v.startsWith('var(') ? '' : v;
  });
  const mo = new MutationObserver(() => $$('[data-token]').forEach(el => { const v = getComputedStyle(document.documentElement).getPropertyValue(el.dataset.token).trim(); const out = $('.ak-swatch__value', el); if (out) out.textContent = v; }));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'class'] });
})();
