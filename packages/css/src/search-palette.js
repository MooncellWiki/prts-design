/*! ═══════════════════════════════════════════════════════════════════════════
 *  AKDS · search-palette.js — 悬浮搜索面板（Command Palette）
 *  皮肤（skins.akds.js 通过 require 引入）与 preview 共用；无依赖，不带任何数据源 ——
 *  数据由调用方以 providers 注入（MW：skin/resources/search-providers.js；预览：preview/search-mock.js）。
 *
 *  交互模型（参考 Citizen 的 Command Palette，视觉换成 AKDS）：
 *    · 页眉里的 form.ak-header__search 被换成 button.ak-search-trigger（长得像输入框）；真表单被搬进面板顶部，
 *      #searchInput / action / hidden title 都还在 → Gadget 与无 JS 提交不受影响。
 *    · 开：点触发器 / .ak-header__search-toggle / 键 "/"、Ctrl(⌘)K、accesskey F。
 *      关：Esc（有字先清空，再按退出模式，再按关闭）/ 点遮罩 / 关闭按钮 / 选中结果。
 *    · 空查询：最近访问（localStorage）+ 提示 + 快捷入口；有字：providers.search() 分组结果 + 末尾固定「全文搜索」行；
 *      "/" 开头：命令列表；命中触发符（>、#、@、~）或选中命令：进入模式（斜切 chip），退格空输入 / ← 退出。
 *    · ↑↓ 循环高亮，回车打开（⌘/Ctrl 回车新标签），⇧回车全文搜索；结果还没到就回车 → urls.go(q)（MW 原生 Go：精确跳转，无则全文）。
 *    · 输入框始终持有焦点（列表 mousedown 阻止夺焦），aria-activedescendant 播报高亮项；Tab 在面板内循环。
 *
 *  API：window.akdsSearchPalette.init( options ) → { open, close, toggle, refresh, isOpen }
 *    options = {
 *      trigger:  'form.ak-header__search',      // 会被换成按钮并搬进面板；缺省时面板自建输入框
 *      toggles:  '.ak-header__search-toggle',   // 其它打开按钮（手机图标等）
 *      placeholder, messages: {…},              // 文案（默认中文；MW 侧用 mw.msg 覆盖）
 *      urls: { go(q), fulltext(q) },            // 回车兜底 / 全文搜索
 *      providers: {
 *        search(q, signal, ctx) → Promise<Group[]> | Group[]     // Group = { id, label, en?, items: Item[] }
 *        empty(ctx)  → Promise<Group[]> | Group[]                 // 空查询时最近访问之后的分组（可选）
 *        shortcuts() → [{ label, url }]                           // 空态快捷入口（可选）
 *      },
 *      modes: [ { id, trigger: '/action', alias: '>', label, desc, placeholder, fulltext:false,
 *                 search(q, signal, ctx) → Group[] } ],
 *      recent: { key: 'akds-recent', max: 8 } | false,
 *      onSelect(item, event) → false 阻止默认导航
 *    }
 *    Item = { id?, type: 'page'|'operator'|'item'|'category'|'action'|…, label, url?, desc?, thumb?(url), icon?(svg id: 'page'|'search'|'category'|'user'|'file'|'action'|'clock'),
 *             glyph?(单字，深底), meta?: [{ text?, html?, kbd? }], match?: boolean(默认 true：高亮已输入部分), en?, keepOpen?, noRecent?, onSelect?() ,
 *             actions?: [{ id, label, icon: 'edit'|'close'|'external', url?, onClick?(item) }] }   ← 行内动作始终占位、高亮时可见；设计上只给最近访问用「移除」，搜索结果不放额外点击动作
 * ═══════════════════════════════════════════════════════════════════════════ */
( function () {
	'use strict';

	const ICONS = {
		search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M10.5 3a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15zM16 16l5 5"/></svg>',
		fulltext: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 4h16v16H4zM8 9h8M8 13h5"/><path fill="none" stroke="currentColor" stroke-width="2" d="M14 14.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zm1.8 4.3L18 21"/></svg>',
		page: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6"/></svg>',
		category: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"/></svg>',
		user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 4a4 4 0 1 1 0 8 4 4 0 0 1 0-8zM4 21c0-4 3.6-7 8-7s8 3 8 7"/></svg>',
		file: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4"/><circle cx="16" cy="9" r="1.5" fill="currentColor"/></svg>',
		action: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M13 3 5 14h6l-1 7 8-11h-6z"/></svg>',
		clock: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="2"/><path fill="none" stroke="currentColor" stroke-width="2" d="M12 7v5l3 2"/></svg>',
		redirect: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 6h9a5 5 0 0 1 0 10H8m3-3-3 3 3 3"/></svg>',
		back: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M15 5l-7 7 7 7"/></svg>',
		close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M6 6l12 12M18 6 6 18"/></svg>',
		edit: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M4 20h4l11-11-4-4L4 16zM13 7l4 4"/></svg>',
		external: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>',
		command: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M9 5 5 12l4 7M15 5l4 7-4 7"/></svg>'
	};

	const MSG = {
		label: '搜索',
		placeholder: '搜索 PRTS…',
		recent: '最近访问', recentEn: 'Recent',
		modes: '命令', modesEn: 'Commands',
		fulltext: '全文搜索 “$1”',
		fulltextDesc: '在全站正文中查找',
		go: '前往 “$1”',
		emptyTitle: '搜索 PRTS',
		emptyDesc: '干员、敌人、道具、关卡或任意页面名；输入 $1 查看命令',
		shortcuts: '快捷入口', shortcutsEn: 'Shortcuts',
		noResults: '没有标题匹配 “$1”',
		noResultsDesc: '检查拼写，或试试全文搜索',
		error: '搜索服务暂时不可用，回车执行全文搜索',
		results: '$1 条结果',
		hintNavigate: '选择', hintOpen: '打开', hintFulltext: '全文', hintClose: '关闭', hintClear: '清空', hintBack: '返回', hintCommands: '命令',
		close: '取消', clear: '清空', back: '返回', remove: '从最近访问中移除', edit: '编辑', newTab: '在新标签页打开',
		brand: 'PRTS · Search'
	};

	function h( tag, cls, attrs ) {
		const el = document.createElement( tag );
		if ( cls ) { el.className = cls; }
		if ( attrs ) { Object.keys( attrs ).forEach( ( k ) => { if ( attrs[ k ] != null ) { el.setAttribute( k, attrs[ k ] ); } } ); }
		return el;
	}
	function svg( name, cls ) {
		const wrap = h( 'span' ); wrap.innerHTML = ICONS[ name ] || ICONS.page;
		const el = wrap.firstChild; if ( cls ) { el.setAttribute( 'class', cls ); }
		return el;
	}
	function fmt( s, a ) { return String( s ).replace( /\$1/g, a == null ? '' : a ); }
	function isMac() { return /Mac|iPhone|iPad/.test( navigator.platform || '' ); }
	function isFormField( el ) {
		if ( !el || el.nodeType !== 1 ) { return false; }
		const n = el.nodeName.toLowerCase(), t = ( el.getAttribute( 'type' ) || '' ).toLowerCase();
		return n === 'select' || n === 'textarea' || ( n === 'input' && ![ 'submit', 'reset', 'checkbox', 'radio', 'button' ].includes( t ) ) || el.isContentEditable;
	}

	/* 标题高亮：已输入部分 <mark>（常规字重），其余加粗 —— Codex SearchResultTitle 的约定 */
	function titleNode( label, query, match ) {
		const bdi = h( 'bdi' );
		const q = ( query || '' ).trim();
		const i = ( match !== false && q ) ? label.toLowerCase().indexOf( q.toLowerCase() ) : -1;
		if ( i < 0 ) { bdi.textContent = label; return bdi; }
		bdi.append( label.slice( 0, i ) );
		const m = h( 'mark' ); m.textContent = label.slice( i, i + q.length ); bdi.append( m );
		bdi.append( label.slice( i + q.length ) );
		return bdi;
	}

	function init( options ) {
		const opt = options || {};
		const M = Object.assign( {}, MSG, opt.messages || {} );
		const providers = opt.providers || {};
		const modes = ( opt.modes || [] ).slice();
		const urls = Object.assign( {
			go: ( q ) => 'Special:Search?search=' + encodeURIComponent( q ) + '&go=Go',
			fulltext: ( q ) => 'Special:Search?search=' + encodeURIComponent( q ) + '&fulltext=1'
		}, opt.urls || {} );
		const recentCfg = opt.recent === false ? null : Object.assign( { key: 'akds-recent', max: 8 }, opt.recent || {} );
		const placeholder = opt.placeholder || M.placeholder;

		/* ── 触发器：把页眉表单换成按钮，表单本身留给面板 ── */
		let form = null, input = null, triggerBtn = null;
		const oldForm = opt.trigger ? document.querySelector( opt.trigger ) : null;
		if ( oldForm ) {
			form = oldForm;
			input = form.querySelector( 'input[type="search"], input[type="text"], input:not([type])' );
			triggerBtn = h( 'button', 'ak-search-trigger ' + ( form.classList.contains( 'ak-header__search' ) ? 'ak-header__search' : '' ), { type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false', 'aria-keyshortcuts': '/ ' + ( isMac() ? 'Meta+K' : 'Control+K' ), 'aria-label': M.label } );
			triggerBtn.append( svg( 'search', 'ak-search-trigger__icon' ) );
			const lab = h( 'span', 'ak-search-trigger__label' ); lab.textContent = ( input && input.placeholder ) || placeholder; triggerBtn.append( lab );
			const kbd = h( 'kbd', 'ak-kbd' ); kbd.textContent = '/'; triggerBtn.append( kbd );
			form.parentNode.replaceChild( triggerBtn, form );
			form.classList.remove( 'ak-header__search', 'ak-search', 'is-open' );
		}
		if ( !form ) {
			form = h( 'form', '', { role: 'search', action: typeof urls.form === 'string' ? urls.form : '' } );
			input = h( 'input', '', { type: 'search', name: 'search', id: 'searchInput' } );
			form.append( input );
		}
		if ( !input ) { input = h( 'input', '', { type: 'search', name: 'search' } ); form.append( input ); }
		form.classList.add( 'ak-palette__form' );
		form.setAttribute( 'autocomplete', 'off' );
		input.setAttribute( 'autocomplete', 'off' ); input.setAttribute( 'autocapitalize', 'off' ); input.setAttribute( 'spellcheck', 'false' );
		input.setAttribute( 'role', 'combobox' ); input.setAttribute( 'aria-autocomplete', 'list' ); input.setAttribute( 'aria-expanded', 'false' ); input.setAttribute( 'aria-controls', 'ak-palette-listbox' );
		input.setAttribute( 'aria-label', M.label );
		input.placeholder = placeholder;
		input.removeAttribute( 'accesskey' );   // MW 给的 accesskey F 由我们接管（否则聚焦到看不见的输入框）

		/* ── 面板 DOM ── */
		const backdrop = h( 'div', 'ak-palette-backdrop', { hidden: '' } );
		const root = h( 'div', 'ak-palette', { role: 'dialog', 'aria-modal': 'true', 'aria-label': M.label, hidden: '' } );
		const head = h( 'div', 'ak-palette__head' );
		const backBtn = h( 'button', 'ak-palette__back', { type: 'button', 'aria-label': M.back, title: M.back } ); backBtn.append( svg( 'back' ) );
		const icon = svg( 'search', 'ak-palette__icon' );
		const chip = h( 'span', 'ak-palette__chip' );
		const clearBtn = h( 'button', 'ak-palette__clear', { type: 'button', 'aria-label': M.clear, title: M.clear } ); clearBtn.append( svg( 'close' ) );
		const closeBtn = h( 'button', 'ak-palette__close', { type: 'button', 'aria-label': M.close } );
		const closeKbd = h( 'kbd', 'ak-kbd' ); closeKbd.textContent = 'Esc'; const closeTxt = h( 'span' ); closeTxt.textContent = M.close; closeBtn.append( closeKbd, closeTxt );
		const loading = h( 'div', 'ak-palette__loading ak-progress ak-progress--indeterminate', { 'aria-hidden': 'true' } );
		head.append( backBtn, icon, chip, form, clearBtn, closeBtn, loading );
		const body = h( 'div', 'ak-palette__body' );
		const viewport = h( 'div', 'ak-palette__viewport' );
		const list = h( 'div', 'ak-palette__list', { role: 'listbox', id: 'ak-palette-listbox', 'aria-label': M.label } );
		const empty = h( 'div', 'ak-palette__empty', { hidden: '' } );
		viewport.append( list, empty ); body.append( viewport );
		const foot = h( 'div', 'ak-palette__foot' );
		const footLeft = h( 'div', 'ak-palette__foot-left' );
		const brand = h( 'span', 'ak-en' ); brand.textContent = M.brand;
		const cmdBtn = h( 'button', 'ak-palette__foot-btn', { type: 'button' } ); const cmdKbd = h( 'kbd', 'ak-kbd' ); cmdKbd.textContent = '/'; cmdBtn.append( cmdKbd, document.createTextNode( M.hintCommands ) );
		footLeft.append( brand ); if ( modes.length ) { footLeft.append( cmdBtn ); }
		const hints = h( 'div', 'ak-palette__hints', { 'aria-hidden': 'true' } );
		foot.append( footLeft, hints );
		const live = h( 'div', 'ak-palette__live', { 'aria-live': 'polite', 'aria-atomic': 'true' } );
		root.append( head, body, foot, live );
		document.body.append( backdrop, root );

		/* ── 状态 ── */
		let isOpen = false, closing = false, closeTimer = 0;
		let query = '', mode = null;
		let items = [];            // 扁平项（与 DOM 顺序一致）
		let active = -1;
		let seq = 0, ctrl = null, debounceTimer = 0, pendingTimer = 0;
		let lastGroups = null;     // keepStale：新结果没到之前保留旧列表
		let lastResizeH = 0;
		const ro = window.ResizeObserver ? new ResizeObserver( () => syncHeight() ) : null;

		function syncHeight() {
			if ( !isOpen ) { return; }
			const hgt = viewport.offsetHeight;
			if ( hgt === lastResizeH ) { return; }
			lastResizeH = hgt;
			body.style.height = hgt + 'px';
		}
		function setLoading( on ) {
			clearTimeout( pendingTimer );
			if ( on ) { pendingTimer = setTimeout( () => root.classList.add( 'is-loading' ), 160 ); }   // 快返回不闪进度条
			else { root.classList.remove( 'is-loading' ); }
		}

		/* ── 最近访问 ── */
		function readRecent() { if ( !recentCfg ) { return []; } try { return JSON.parse( localStorage.getItem( recentCfg.key ) ) || []; } catch ( e ) { return []; } }
		function writeRecent( arr ) { if ( !recentCfg ) { return; } try { localStorage.setItem( recentCfg.key, JSON.stringify( arr.slice( 0, recentCfg.max ) ) ); } catch ( e ) { /* private mode */ } }
		function pushRecent( item ) {
			if ( !recentCfg || !item.url || item.noRecent || item.type === 'search' || item.type === 'mode' ) { return; }
			const rec = { type: item.type || 'page', label: item.label, url: item.url, desc: item.desc || '', thumb: item.thumb || '', icon: item.icon || '', en: item.en || '' };
			writeRecent( [ rec ].concat( readRecent().filter( ( r ) => r.url !== rec.url ) ) );
		}
		function removeRecent( url ) { writeRecent( readRecent().filter( ( r ) => r.url !== url ) ); }

		/* ── 渲染 ── */
		function clearList() { list.textContent = ''; items = []; active = -1; }
		function renderGroups( groups, q, opts ) {
			opts = opts || {};
			clearList();
			empty.hidden = true;
			( groups || [] ).forEach( ( g ) => {
				if ( !g || !g.items || !g.items.length ) { return; }
				const gid = 'ak-palette-g-' + ( g.id || Math.random().toString( 36 ).slice( 2 ) );
				const grp = h( 'div', 'ak-palette__group' + ( g.tail ? ' ak-palette__group--tail' : '' ), { role: 'group', 'aria-labelledby': g.label ? gid : null } );
				if ( g.label ) {
					const lab = h( 'div', 'ak-palette__label', { id: gid } ); lab.textContent = g.label;
					if ( g.en ) { const en = h( 'span', 'ak-en' ); en.textContent = g.en; lab.append( en ); }
					if ( g.hint ) { const sm = h( 'small' ); sm.textContent = g.hint; lab.append( sm ); }
					grp.append( lab );
				}
				g.items.forEach( ( it ) => grp.append( renderItem( it, q ) ) );
				list.append( grp );
			} );
			if ( opts.notice ) { const n = h( 'div', 'ak-palette__notice' + ( opts.error ? ' ak-palette__notice--error' : '' ) ); n.textContent = opts.notice; list.append( n ); }
			input.setAttribute( 'aria-expanded', items.length ? 'true' : 'false' );
			setActive( opts.highlight != null ? opts.highlight : ( q ? 0 : -1 ), false );
			live.textContent = items.length ? fmt( M.results, items.length ) : '';
			syncHeight();
		}
		function renderItem( it, q ) {
			const idx = items.length; items.push( it );
			const row = h( 'div', 'ak-palette__item', { role: 'option', id: 'ak-palette-item-' + idx, 'aria-selected': 'false', 'data-index': idx } );
			const link = it.url ? h( 'a', 'ak-palette__link', { href: it.url } ) : h( 'button', 'ak-palette__link', { type: 'button' } );
			link.tabIndex = -1;
			// 缩略图 / 图标 / 单字
			const th = h( 'span', 'ak-palette__thumb' + ( it.thumb ? '' : ( it.glyph ? ' ak-palette__thumb--dark ak-palette__thumb--mono' : ( it.dark ? ' ak-palette__thumb--dark' : ' ak-palette__thumb--icon' ) ) ) );
			if ( it.thumb ) { const img = h( 'img', '', { src: it.thumb, alt: '', loading: 'lazy' } ); th.append( img ); }
			else if ( it.glyph ) { th.textContent = it.glyph; }
			else { th.append( svg( it.icon || ( it.type === 'category' ? 'category' : it.type === 'user' ? 'user' : it.type === 'file' ? 'file' : it.type === 'action' ? 'action' : it.type === 'search' ? 'fulltext' : it.type === 'recent' ? 'clock' : it.type === 'mode' ? 'command' : 'page' ) ) ); }
			// 文字
			const text = h( 'span', 'ak-palette__text' );
			const title = h( 'span', 'ak-palette__title' ); title.append( titleNode( it.label, q, it.match ) );
			if ( it.en ) { const en = h( 'span', 'ak-en' ); en.textContent = it.en; title.append( en ); }
			text.append( title );
			if ( it.desc || it.redirect ) {
				const d = h( 'span', 'ak-palette__desc' );
				if ( it.redirect ) { d.append( svg( 'redirect', 'ak-icon' ) ); d.append( it.redirect ); if ( it.desc ) { d.append( ' · ' ); } }
				if ( it.desc ) { d.append( it.desc ); }
				text.append( d );
			}
			link.append( th, text );
			// 右侧元数据
			if ( it.meta && it.meta.length ) {
				const meta = h( 'span', 'ak-palette__meta' );
				it.meta.forEach( ( m ) => {
					if ( m.kbd ) { const k = h( 'kbd', 'ak-kbd' ); k.textContent = m.kbd; meta.append( k ); }
					else if ( m.html ) { const s = h( 'span' ); s.innerHTML = m.html; meta.append( s ); }   // 受信任来源（皮肤/预览自己拼的稀有度、职业图标）
					else if ( m.text ) { const s = h( 'span', m.cls || '' ); s.textContent = m.text; meta.append( s ); }
				} );
				link.append( meta );
			}
			row.append( link );
			// 行内动作（高亮 / 聚焦时可见；Tab 可达）
			const acts = ( it.actions || [] ).slice();
			if ( it.type === 'recent' ) { acts.push( { id: 'remove', label: M.remove, icon: 'close', onClick: ( x ) => { removeRecent( x.url ); showEmpty(); } } ); }
			if ( acts.length ) {
				const box = h( 'div', 'ak-palette__actions' );
				acts.forEach( ( a ) => {
					const b = a.url ? h( 'a', 'ak-palette__action', { href: a.url, 'aria-label': a.label, title: a.label } ) : h( 'button', 'ak-palette__action', { type: 'button', 'aria-label': a.label, title: a.label } );
					b.append( svg( a.icon || 'edit' ) );
					b.addEventListener( 'click', ( e ) => { if ( a.onClick ) { e.preventDefault(); a.onClick( it, e ); } else { close(); } e.stopPropagation(); } );
					box.append( b );
				} );
				row.append( box );
			}
			return row;
		}
		function setActive( i, scroll ) {
			const rows = list.querySelectorAll( '.ak-palette__item' );
			if ( !rows.length ) { active = -1; input.removeAttribute( 'aria-activedescendant' ); return; }
			if ( i < 0 ) { i = -1; } else { i = ( ( i % rows.length ) + rows.length ) % rows.length; }
			rows.forEach( ( r, k ) => { r.classList.toggle( 'is-active', k === i ); r.setAttribute( 'aria-selected', k === i ? 'true' : 'false' ); } );
			active = i;
			if ( i >= 0 ) {
				input.setAttribute( 'aria-activedescendant', rows[ i ].id );
				if ( scroll !== false ) { rows[ i ].scrollIntoView( { block: 'nearest' } ); }
			} else { input.removeAttribute( 'aria-activedescendant' ); }
		}
		function renderHints( arr ) {
			hints.textContent = '';
			arr.forEach( ( x ) => { const s = h( 'span' ); const k = h( 'kbd', 'ak-kbd' ); k.textContent = x[ 0 ]; s.append( k, document.createTextNode( x[ 1 ] ) ); hints.append( s ); } );
		}
		/* 页脚提示随状态变：Esc 的含义 = 有字「清空」→ 模式中「返回」→ 否则「关闭」 */
		function updateHints() {
			const q = query.trim();
			const esc = q ? M.hintClear : ( mode ? M.hintBack : M.hintClose );
			const arr = [];
			if ( q && !mode && q[ 0 ] !== '/' ) { arr.push( [ '⇧↵', M.hintFulltext ] ); }
			arr.push( [ '↑↓', M.hintNavigate ], [ '↵', M.hintOpen ], [ 'Esc', esc ] );
			renderHints( arr );
		}

		/* ── 空态 / 模式列表 / 搜索 ── */
		function fulltextItem( q ) { return { type: 'search', label: fmt( M.fulltext, q ), desc: M.fulltextDesc, url: urls.fulltext( q ), match: false, dark: true, icon: 'fulltext', noRecent: true }; }
		function modeItems( filter ) {
			const f = ( filter || '' ).toLowerCase();
			return modes.filter( ( m ) => !f || m.id.includes( f ) || ( m.trigger || '' ).toLowerCase().includes( f ) || ( m.label || '' ).toLowerCase().includes( f ) )
				.map( ( m ) => ( { type: 'mode', label: m.trigger || ( '/' + m.id ), en: m.label, desc: m.desc, glyph: m.alias || '/', match: false, meta: m.alias ? [ { kbd: m.alias } ] : [], onSelect: () => enterMode( m, '' ), mode: m } ) );
		}
		let emptySeq = 0;
		function showEmpty() {
			const my = ++emptySeq;
			const groups = [];
			const rec = readRecent();
			if ( rec.length ) { groups.push( { id: 'recent', label: M.recent, en: M.recentEn, items: rec.map( ( r ) => Object.assign( { match: false }, r, { type: 'recent', icon: r.icon || ( r.type === 'category' ? 'category' : r.type === 'file' ? 'file' : r.type === 'user' ? 'user' : 'clock' ) } ) ) } ); }
			const finish = ( more ) => {
				if ( my !== emptySeq || query || mode ) { return; }
				const all = groups.concat( more || [] );
				renderGroups( all, '', { highlight: -1 } );
				renderEmptyCard( !all.length );
				updateHints();
			};
			if ( providers.empty ) { Promise.resolve( providers.empty( { mode: null } ) ).then( finish, () => finish( [] ) ); } else { finish( [] ); }
		}
		function renderEmptyCard( noList ) {
			empty.textContent = '';
			const t = h( 'p', 'ak-palette__empty-title' ); t.textContent = M.emptyTitle;
			const d = h( 'p', 'ak-palette__empty-desc' );
			const parts = fmt( M.emptyDesc, ' ' ).split( ' ' );
			d.append( parts[ 0 ] ); if ( parts.length > 1 ) { const k = h( 'kbd', 'ak-kbd' ); k.textContent = '/'; d.append( k, parts[ 1 ] ); }
			if ( noList ) { empty.append( t, d ); }   // 有最近访问时只保留快捷入口（更短），没有时显示完整提示
			const sc = providers.shortcuts ? ( providers.shortcuts() || [] ) : [];
			if ( sc.length ) {
				const lab = h( 'div', 'ak-palette__label' ); lab.textContent = M.shortcuts; const en = h( 'span', 'ak-en' ); en.textContent = M.shortcutsEn; lab.append( en );
				const box = h( 'div', 'ak-palette__shortcuts' );
				sc.forEach( ( s ) => { const a = h( 'a', 'ak-palette__shortcut', { href: s.url } ); a.textContent = s.label; a.addEventListener( 'click', () => { close(); } ); box.append( a ); } );
				empty.append( lab, box );
			}
			empty.hidden = !( noList || sc.length );
			empty.classList.toggle( 'ak-palette__empty--compact', !noList );
			syncHeight();
		}
		function showModes( filter ) {
			const its = modeItems( filter );
			renderGroups( [ { id: 'modes', label: M.modes, en: M.modesEn, items: its } ], '', { highlight: 0, notice: its.length ? null : fmt( M.noResults, '/' + filter ) } );
			updateHints();
		}
		function runSearch( q ) {
			const my = ++seq;
			if ( ctrl ) { ctrl.abort(); }
			ctrl = window.AbortController ? new AbortController() : null;
			const fn = mode ? mode.search : providers.search;
			if ( !fn ) { renderGroups( mode || !q ? [] : [ { id: 'ft', tail: true, items: [ fulltextItem( q ) ] } ], q ); return; }
			setLoading( true );
			Promise.resolve().then( () => fn( q, ctrl && ctrl.signal, { mode: mode } ) ).then( ( groups ) => {
				if ( my !== seq ) { return; }
				setLoading( false );
				groups = ( groups || [] ).filter( ( g ) => g && g.items && g.items.length );
				lastGroups = groups;
				const withFt = ( !mode || mode.fulltext !== false ) && q ? groups.concat( [ { id: 'ft', tail: true, items: [ fulltextItem( q ) ] } ] ) : groups;
				const none = !groups.length;
				renderGroups( withFt, q, { highlight: 0, notice: none ? fmt( M.noResults, q ) + ( mode ? '' : ' · ' + M.noResultsDesc ) : null } );
				updateHints();
			}, ( err ) => {
				if ( my !== seq || ( err && err.name === 'AbortError' ) ) { return; }
				setLoading( false );
				renderGroups( q ? [ { id: 'ft', tail: true, items: [ fulltextItem( q ) ] } ] : [], q, { highlight: 0, notice: M.error, error: true } );
			} );
		}
		function refresh( immediate ) {
			clearTimeout( debounceTimer );
			const q = query.trim();
			if ( !mode && !q ) { seq++; setLoading( false ); showEmpty(); return; }
			if ( !mode && q[ 0 ] === '/' ) { seq++; setLoading( false ); showModes( q.slice( 1 ) ); return; }
			empty.hidden = true;
			if ( immediate ) { runSearch( q ); } else { debounceTimer = setTimeout( () => runSearch( q ), 120 ); }
		}

		/* ── 模式 ── */
		function enterMode( m, rest ) {
			mode = m;
			root.classList.add( 'has-mode' );
			chip.textContent = m.label || m.id;
			input.placeholder = m.placeholder || placeholder;
			setQuery( rest || '' );
			refresh( true );
			input.focus();
		}
		function exitMode() {
			mode = null;
			root.classList.remove( 'has-mode' );
			input.placeholder = placeholder;
			setQuery( '' );
			refresh( true );
			input.focus();
		}
		function setQuery( v ) { query = v; input.value = v; root.classList.toggle( 'has-query', !!v ); }
		function detectTrigger( v ) {
			if ( mode || !v ) { return false; }
			// 单字触发符（> # @ ~）：只在开头且只有一个字符时进入，避免误伤正常输入
			const m1 = modes.find( ( m ) => m.alias && v[ 0 ] === m.alias );
			if ( m1 && v.length === 1 ) { enterMode( m1, '' ); return true; }
			// /action: 或 /action␣ → 进入
			const m2 = modes.find( ( m ) => m.trigger && ( v.toLowerCase().indexOf( m.trigger.toLowerCase() + ':' ) === 0 || v.toLowerCase().indexOf( m.trigger.toLowerCase() + ' ' ) === 0 ) );
			if ( m2 ) { enterMode( m2, v.slice( m2.trigger.length + 1 ) ); return true; }
			return false;
		}

		/* ── 选择 ── */
		function selectIndex( i, ev ) {
			const it = items[ i ]; if ( !it ) { return; }
			if ( it.onSelect ) { const r = it.onSelect( it, ev ); if ( r !== 'navigate' ) { return; } }
			if ( opt.onSelect && opt.onSelect( it, ev ) === false ) { pushRecent( it ); return; }
			if ( !it.url ) { return; }
			pushRecent( it );
			const nt = ev && ( ev.metaKey || ev.ctrlKey );
			if ( nt ) { window.open( it.url, '_blank' ); return; }
			close();
			location.href = it.url;
		}
		function goto( url ) { close(); location.href = url; }

		/* ── 开关 ── */
		function open( prefill ) {
			if ( closing ) { clearTimeout( closeTimer ); finishClose(); }
			if ( isOpen ) { input.focus(); if ( typeof prefill === 'string' ) { setQuery( prefill ); refresh( true ); } return; }
			isOpen = true;
			backdrop.hidden = false; root.hidden = false;
			backdrop.classList.remove( 'is-closing' ); root.classList.remove( 'is-closing' );
			if ( triggerBtn ) { triggerBtn.setAttribute( 'aria-expanded', 'true' ); }
			document.documentElement.classList.add( 'ak-palette-open' );
			mode = null; root.classList.remove( 'has-mode' ); input.placeholder = placeholder;
			setQuery( typeof prefill === 'string' ? prefill : '' );
			lastResizeH = 0; body.style.transition = 'none'; body.style.height = '';
			refresh( true );
			requestAnimationFrame( () => { syncHeight(); requestAnimationFrame( () => { body.style.transition = ''; } ); } );
			if ( ro ) { ro.observe( viewport ); }
			input.focus(); input.select();
			document.dispatchEvent( new CustomEvent( 'akds:palette-open' ) );
		}
		function finishClose() {
			closing = false;
			backdrop.hidden = true; root.hidden = true;
			backdrop.classList.remove( 'is-closing' ); root.classList.remove( 'is-closing' );
			if ( ro ) { ro.unobserve( viewport ); }
			body.style.height = '';
		}
		function close( restoreFocus ) {
			if ( !isOpen ) { return; }
			isOpen = false; closing = true;
			seq++; emptySeq++; setLoading( false ); clearTimeout( debounceTimer ); if ( ctrl ) { ctrl.abort(); }
			document.documentElement.classList.remove( 'ak-palette-open' );
			if ( triggerBtn ) { triggerBtn.setAttribute( 'aria-expanded', 'false' ); }
			backdrop.classList.add( 'is-closing' ); root.classList.add( 'is-closing' );
			const reduce = window.matchMedia && matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
			closeTimer = setTimeout( finishClose, reduce ? 0 : 160 );
			if ( restoreFocus !== false && triggerBtn && triggerBtn.offsetParent ) { triggerBtn.focus(); }
			else if ( restoreFocus !== false ) { const t = document.querySelector( opt.toggles || '.ak-header__search-toggle' ); if ( t && t.offsetParent ) { t.focus(); } }
			document.dispatchEvent( new CustomEvent( 'akds:palette-close' ) );
		}
		function toggle() { if ( isOpen ) { close(); } else { open(); } }

		/* ── 事件 ── */
		if ( triggerBtn ) { triggerBtn.addEventListener( 'click', () => open() ); }
		document.addEventListener( 'click', ( e ) => {
			const t = e.target.closest( opt.toggles || '.ak-header__search-toggle' );
			if ( t ) { e.preventDefault(); toggle(); return; }
			const trig = e.target.closest( '.ak-search-trigger[data-prefill], [data-akds-search]' );
			if ( trig && trig !== triggerBtn ) { e.preventDefault(); open( trig.dataset.prefill || trig.dataset.akdsSearch || '' ); }
		} );
		backdrop.addEventListener( 'click', () => close() );
		closeBtn.addEventListener( 'click', () => close() );
		clearBtn.addEventListener( 'click', () => { setQuery( '' ); refresh( true ); input.focus(); } );
		backBtn.addEventListener( 'click', () => exitMode() );
		cmdBtn.addEventListener( 'click', () => { if ( mode ) { exitMode(); } setQuery( '/' ); refresh( true ); input.focus(); } );
		form.addEventListener( 'submit', ( e ) => {
			// 表单原生提交只在「没有高亮项」时才有意义（= MW 的 Go）；有高亮项则由 keydown 处理
			if ( active >= 0 && items[ active ] ) { e.preventDefault(); return; }
			if ( urls.go && query.trim() ) { e.preventDefault(); goto( urls.go( query.trim() ) ); }
		} );
		input.addEventListener( 'input', () => {
			const v = input.value;
			query = v; root.classList.toggle( 'has-query', !!v );
			if ( detectTrigger( v ) ) { return; }
			updateHints();
			refresh( false );
		} );
		list.addEventListener( 'mousedown', ( e ) => { if ( !e.target.closest( '.ak-palette__action' ) ) { e.preventDefault(); } } );   // 保住输入框焦点
		list.addEventListener( 'mousemove', ( e ) => { const row = e.target.closest( '.ak-palette__item' ); if ( row ) { const i = +row.dataset.index; if ( i !== active ) { setActive( i, false ); } } } );
		list.addEventListener( 'click', ( e ) => {
			if ( e.target.closest( '.ak-palette__action' ) ) { return; }
			const row = e.target.closest( '.ak-palette__item' ); if ( !row ) { return; }
			e.preventDefault();
			selectIndex( +row.dataset.index, e );
		} );
		root.addEventListener( 'keydown', ( e ) => {
			if ( e.key === 'ArrowDown' ) { e.preventDefault(); setActive( active + 1 ); return; }
			if ( e.key === 'ArrowUp' ) { e.preventDefault(); setActive( active < 0 ? -1 : active - 1 ); return; }
			if ( e.key === 'Home' && e.target === input && !query ) { e.preventDefault(); setActive( 0 ); return; }
			if ( e.key === 'End' && e.target === input && !query ) { e.preventDefault(); setActive( items.length - 1 ); return; }
			if ( e.key === 'Enter' ) {
				if ( e.target !== input && e.target.closest( '.ak-palette__action, .ak-palette__shortcut, button, a' ) ) { return; }   // 让按钮自己处理
				e.preventDefault();
				const q = query.trim();
				if ( e.shiftKey && q && !mode && q[ 0 ] !== '/' ) { goto( urls.fulltext( q ) ); return; }
				if ( active >= 0 && items[ active ] ) { selectIndex( active, e ); return; }
				if ( q && urls.go && !mode ) { goto( urls.go( q ) ); }
				return;
			}
			if ( e.key === 'Escape' ) {
				e.preventDefault(); e.stopPropagation();
				if ( query ) { setQuery( '' ); refresh( true ); return; }
				if ( mode ) { exitMode(); return; }
				close();
				return;
			}
			if ( e.key === 'Backspace' && mode && !input.value && e.target === input ) { e.preventDefault(); exitMode(); return; }
			if ( e.key === 'ArrowLeft' && mode && !input.value && e.target === input ) { e.preventDefault(); exitMode(); return; }
			if ( e.key === 'Tab' ) {
				// 焦点在面板内循环：输入框 → 清空 → 关闭 → 高亮行的动作 → 快捷入口 → 页脚按钮 → 回到输入框
				const f = Array.from( root.querySelectorAll( 'input, button, a[href], [tabindex="0"]' ) ).filter( ( el ) => el.offsetParent !== null && !el.disabled && el.tabIndex !== -1 && !el.closest( '[hidden]' ) );
				if ( !f.length ) { return; }
				let i = f.indexOf( document.activeElement ); if ( i < 0 ) { i = 0; }
				i = ( i + ( e.shiftKey ? -1 : 1 ) + f.length ) % f.length;
				e.preventDefault(); f[ i ].focus();
			}
		} );
		// 全局快捷键："/"（非表单焦点）、Ctrl/⌘K、accesskey F（Alt(+Shift)+F / Ctrl+Alt+F）
		window.addEventListener( 'keydown', ( e ) => {
			if ( isOpen ) { return; }
			const mac = isMac();
			const slash = e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey;
			const ctrlK = ( e.ctrlKey || e.metaKey ) && !e.altKey && !e.shiftKey && ( e.key === 'k' || e.key === 'K' );
			const accessF = ( e.key === 'f' || e.key === 'F' || e.code === 'KeyF' ) && ( mac ? ( e.ctrlKey && e.altKey ) : ( e.altKey && ( e.shiftKey || !e.ctrlKey ) ) );
			if ( ( slash || ctrlK || accessF ) && !isFormField( e.target ) ) { e.preventDefault(); open(); }
			else if ( ctrlK && isFormField( e.target ) && e.target !== input ) { e.preventDefault(); open(); }
		}, true );

		const api = { open, close, toggle, refresh: () => refresh( true ), isOpen: () => isOpen, root, input, form, trigger: triggerBtn };
		document.dispatchEvent( new CustomEvent( 'akds:palette-ready', { detail: api } ) );
		return api;
	}

	const mod = { init, ICONS, MSG };
	window.akdsSearchPalette = mod;
	if ( typeof module !== 'undefined' && module.exports ) { module.exports = mod; }
}() );
