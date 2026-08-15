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

  /* ── Sidebar drawer (mobile) ───────────────────────────────── */
  document.addEventListener('click', e => {
    if (e.target.closest('.ak-header__menu')) { $('.ak-sidebar').classList.toggle('is-open'); toggleOverlay($('.ak-sidebar').classList.contains('is-open')); }
    if (e.target.closest('.ak-sidebar__close') || e.target.closest('.ak-overlay')) { $('.ak-sidebar').classList.remove('is-open'); toggleOverlay(false); }
    if (e.target.closest('.ak-header__search-toggle')) { $('.ak-header__search').classList.toggle('is-open'); }
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
    const links = $$('a', tocList);
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { links.forEach(l => l.parentElement.classList.toggle('is-active', l.getAttribute('href') === '#' + en.target.id)); } });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    heads.forEach(h => io.observe(h));
  }
  const prog = $('.ak-toc__progress > i');
  if (prog) window.addEventListener('scroll', () => { const d = document.documentElement; prog.style.setProperty('--_p', (d.scrollTop / (d.scrollHeight - d.clientHeight) * 100) + '%'); }, { passive: true });

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

  /* ── Collapsible panels / portlets ─────────────────────────── */
  document.addEventListener('click', e => {
    const h = e.target.closest('.ak-panel--collapsible > .ak-panel__head'); if (h) h.parentElement.classList.toggle('is-collapsed');
    const t = e.target.closest('.ak-portlet--collapsible > .ak-portlet__title'); if (t) t.parentElement.classList.toggle('is-collapsed');
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
