/* skins.akds.js — 皮肤运行时（对应 preview/preview.js，改用 mw.user.clientPrefs） */
( function () {
	'use strict';
	const $ = ( s, r = document ) => r.querySelector( s );
	const $$ = ( s, r = document ) => Array.from( r.querySelectorAll( s ) );

	/* 侧栏多层导航（树形展开 / 记忆 / 桌面悬停飞出 / 可折叠门户）：与 preview 共用 src/sidebar-tree.js */
	require( './sidebar-tree.js' );
	/* 悬浮搜索面板：核心 src/search-palette.js（共用）+ MW 数据源 search-providers.js（REST 标题搜索 / 动作 / 分类 / 用户 / 文件） */
	if ( mw.config.get( 'wgAKDSSearchPalette', true ) !== false ) { require( './search-providers.js' ); }

	/* Theme: 使用 MW clientPrefs（html.skin-theme-clientpref-*），未登录亦持久化 */
	function currentTheme() {
		const c = document.documentElement.className.match( /skin-theme-clientpref-(os|day|night)/ );
		return c ? c[ 1 ] : 'os';
	}
	function syncToggle() { $$( '.ak-theme-toggle > button' ).forEach( ( b ) => b.classList.toggle( 'is-active', b.dataset.theme === currentTheme() ) ); }
	document.addEventListener( 'click', ( e ) => {
		const b = e.target.closest( '.ak-theme-toggle > button' );
		if ( !b ) { return; }
		if ( mw.user && mw.user.clientPrefs ) { mw.user.clientPrefs.set( 'skin-theme', b.dataset.theme ); }
		else { document.documentElement.className = document.documentElement.className.replace( /skin-theme-clientpref-\w+/, 'skin-theme-clientpref-' + b.dataset.theme ); }
		syncToggle();
	} );
	syncToggle();

	/* Catlinks tidy：去掉核心输出的 colon-separator 文本节点，把「隐藏分类」文字标签包成 span.ak-catlinks__label（CSS 已能无 JS 吞掉冒号） */
	function tidyCatlinks( root ) {
		$$( '.catlinks > div', root || document ).forEach( ( div ) => {
			Array.from( div.childNodes ).forEach( ( n ) => {
				if ( n.nodeType !== Node.TEXT_NODE ) { return; }
				const t = n.nodeValue.replace( /[\s\u200b\u200e\u200f\ufeff:：]+$/, '' ).trim();
				if ( !t ) { n.remove(); return; }
				const span = document.createElement( 'span' ); span.className = 'ak-catlinks__label'; span.textContent = t; div.replaceChild( span, n );
			} );
		} );
	}
	tidyCatlinks();
	if ( window.mw && mw.hook ) { mw.hook( 'wikipage.categories' ).add( ( $c ) => tidyCatlinks( $c && $c[ 0 ] ? $c[ 0 ] : document ) ); }   /* 预览 / VE 保存后重渲染 */

	/* Sidebar drawer */
	document.addEventListener( 'click', ( e ) => {
		const sb = $( '.ak-sidebar' );
		if ( e.target.closest( '.ak-local-nav__menu' ) ) { sb.classList.toggle( 'is-open' ); overlay( sb.classList.contains( 'is-open' ) ); }
		if ( e.target.closest( '.ak-sidebar__close, .ak-overlay--sidebar' ) ) { sb.classList.remove( 'is-open' ); overlay( false ); }
	} );
	function overlay( on ) {
		let o = $( '.ak-overlay--sidebar' );
		if ( on && !o ) { o = document.createElement( 'div' ); o.className = 'ak-overlay ak-overlay--sidebar'; document.body.appendChild( o ); }
		if ( !on && o ) { o.remove(); }
	}

	/* TOC scrollspy + progress（data-toc 已由服务端渲染；无则从 h2/h3 生成） */
	const toc = $( '.ak-toc ul[data-auto-toc]' );
	if ( toc ) {
		if ( !toc.children.length ) {
			$$( '.mw-parser-output h2, .mw-parser-output h3' ).forEach( ( h ) => { if ( !h.id ) { return; } const li = document.createElement( 'li' ); li.className = h.tagName === 'H2' ? 'toclevel-1' : 'toclevel-2'; li.innerHTML = '<a href="#' + h.id + '">' + h.textContent + '</a>'; toc.appendChild( li ); } );
		}
		/* scrollspy —— 参考 VitePress useActiveAnchor / Docusaurus useTOCHighlight：滚动驱动、按 DOM 顺序取「基准线以上最后一个标题」（与 preview.js 相同）。
		 * 不用 IntersectionObserver：锚点跳转后目标标题与紧随其后的标题同批进观察带、回调里排后者赢，高亮会跳到下一项。
		 *  · 基准线 = 标题自己的 scroll-margin-top（锚点跳转后标题恰好停在这里）+ 4px 容差，点目录跳到哪项就亮哪项；
		 *  · 点击目录时立即高亮并忽略随之而来的那一次 scroll（页底几节滚不到基准线）；页顶不高亮，页底亮最后一项；
		 *  · display:none 的标题（收起的折叠块 / tab）跳过；active 项保持在目录自身滚动区可见（只滚目录，不动窗口）。 */
		const byId = new Map();
		$$( 'a[href^="#"]', toc ).forEach( ( a ) => byId.set( decodeURIComponent( a.getAttribute( 'href' ).slice( 1 ) ), a ) );
		const heads = Array.from( byId.keys(), ( id ) => document.getElementById( id ) ).filter( Boolean );
		const box = toc.closest( '.ak-toc__inner' ) || toc.parentElement;
		const shown = ( h ) => { const r = h.getBoundingClientRect(); return r.width > 0 || r.height > 0; };
		let prev = null, ignoreOnce = false, raf = 0;
		function activate( h ) {
			const a = ( h && byId.get( h.id ) ) || null; if ( a === prev ) { return; }
			if ( prev ) { prev.parentElement.classList.remove( 'is-active' ); }
			prev = a; if ( !a ) { return; }
			a.parentElement.classList.add( 'is-active' );
			const rb = box.getBoundingClientRect(), ra = a.getBoundingClientRect();
			if ( ra.top < rb.top ) { box.scrollTop -= rb.top - ra.top; } else if ( ra.bottom > rb.bottom ) { box.scrollTop += ra.bottom - rb.bottom; }
		}
		function update() {
			raf = 0;
			if ( ignoreOnce ) { ignoreOnce = false; return; }
			const y = window.scrollY, d = document.documentElement;
			if ( y < 1 ) { activate( null ); return; }
			if ( y + window.innerHeight >= d.scrollHeight - 1 ) { activate( heads.slice().reverse().find( shown ) ); return; }
			let cur = null;
			for ( const h of heads ) {
				if ( !shown( h ) ) { continue; }
				if ( h.getBoundingClientRect().top > ( parseFloat( getComputedStyle( h ).scrollMarginTop ) || 0 ) + 4 ) { break; }
				cur = h;
			}
			activate( cur );
		}
		const schedule = () => { if ( !raf ) { raf = requestAnimationFrame( update ); } };
		window.addEventListener( 'scroll', schedule, { passive: true } );
		window.addEventListener( 'resize', schedule );
		toc.addEventListener( 'click', ( e ) => {
			const a = e.target.closest( 'a[href^="#"]' ); if ( !a ) { return; }
			const h = document.getElementById( decodeURIComponent( a.getAttribute( 'href' ).slice( 1 ) ) );
			if ( h ) { ignoreOnce = true; activate( h ); }
		} );
		update();
		const prog = $( '.ak-toc__progress > i' );
		if ( prog ) { window.addEventListener( 'scroll', () => { const d = document.documentElement; prog.style.setProperty( '--_p', ( d.scrollTop / ( d.scrollHeight - d.clientHeight ) * 100 ) + '%' ); }, { passive: true } ); }
	}

	/* 目录浮层收尾（开合本身是纯 CSS 的 .ak-toc-cb）：跳转后 / 点击浮层外 / Esc 收起 */
	const tocCb = $( '.ak-toc-cb' );
	if ( tocCb ) {
		document.addEventListener( 'click', ( e ) => {
			if ( !tocCb.checked ) { return; }
			if ( e.target.closest( '.ak-toc a' ) ) { tocCb.checked = false; return; }
			// 放行 .ak-toc-cb：点 label 会再向 checkbox 派发一次 click，那次不算「外部」
			if ( !e.target.closest( '.ak-toc, .ak-local-nav__toc, .ak-toc-cb' ) ) { tocCb.checked = false; }
		} );
		document.addEventListener( 'keydown', ( e ) => { if ( e.key === 'Escape' ) { tocCb.checked = false; } } );
	}

	/* 工具卡片（<1120 页眉 ≡ 拉下的 外观 / 通知 / 用户菜单 卡片；开合本身是纯 CSS 的 .ak-nav-cb）：Esc / 选中锚点 / 点卡片外 / 回到桌面宽度时收起 */
	const navCb = $( '.ak-nav-cb' );
	if ( navCb ) {
		const closeNav = () => { if ( navCb.checked ) { navCb.checked = false; } };
		document.addEventListener( 'keydown', ( e ) => { if ( e.key === 'Escape' && navCb.checked ) { closeNav(); navCb.focus(); } } );
		document.addEventListener( 'click', ( e ) => {
			if ( !navCb.checked ) { return; }
			if ( e.target.closest( '.ak-header__screen a[href^="#"], .ak-header__search-toggle' ) ) { closeNav(); return; }   // 页内锚点不会整页刷新；去开搜索面板了
			// 点卡片外收起。放行 .ak-nav-cb：点 label 会再向 checkbox 派发一次 click，那次不算「外部」
			if ( !e.target.closest( '.ak-header__screen, .ak-header__burger, .ak-nav-cb' ) ) { closeNav(); }
		} );
		const mq = window.matchMedia( '(min-width: 1120px)' );
		mq.addEventListener( 'change', ( e ) => { if ( e.matches ) { closeNav(); } } );
	}

	/* 页眉收起：向下滚动只留二级吸顶栏，向上滚 / 回到顶部再展开（无 JS 则始终两行） */
	let lastY = window.scrollY, ticking = false;
	function onScroll() {
		const y = Math.max( 0, window.scrollY ), root = document.documentElement;
		if ( !( tocCb && tocCb.checked ) && !( navCb && navCb.checked ) ) {
			if ( y < 120 ) { root.classList.remove( 'ak-condensed' ); }
			else if ( y > lastY + 4 ) { root.classList.add( 'ak-condensed' ); }
			else if ( y < lastY - 4 ) { root.classList.remove( 'ak-condensed' ); }
		}
		lastY = y; ticking = false;
	}
	window.addEventListener( 'scroll', () => { if ( !ticking ) { ticking = true; requestAnimationFrame( onScroll ); } }, { passive: true } );

	/* Tabs / panels / phase & level selectors / data-bind（与 preview.js 相同约定） */
	document.addEventListener( 'click', ( e ) => {
		const tab = e.target.closest( '.ak-tabs[data-tabs] .ak-tab' );
		if ( tab ) { e.preventDefault(); const tabs = tab.closest( '.ak-tabs' ); $$( '.ak-tab', tabs ).forEach( ( t ) => { t.classList.toggle( 'is-active', t === tab ); t.setAttribute( 'aria-selected', t === tab ); } ); $$( '.ak-tabpanel[data-tabs="' + tabs.dataset.tabs + '"]' ).forEach( ( p ) => { p.hidden = p.dataset.tab !== tab.dataset.tab; } ); }
		const ph = e.target.closest( '.ak-panel--collapsible > .ak-panel__head' ); if ( ph ) { ph.parentElement.classList.toggle( 'is-collapsed' ); }
		const chip = e.target.closest( '.ak-chip' ); if ( chip && !chip.closest( '[data-no-toggle]' ) ) { chip.classList.toggle( 'is-active' ); chip.setAttribute( 'aria-pressed', chip.classList.contains( 'is-active' ) ); }
		const grp = e.target.closest( '.ak-btn-group > .ak-btn, .ak-phase-tabs > button, .ak-skill-levels > button' );
		if ( grp ) { const parent = grp.parentElement; $$( ':scope > *', parent ).forEach( ( b ) => b.classList.toggle( 'is-active', b === grp ) ); parent.dispatchEvent( new CustomEvent( 'akds:select', { bubbles: true, detail: { value: grp.dataset.value, el: grp } } ) ); }
		const o = e.target.closest( '[data-dialog-open]' ); if ( o ) { const d = $( o.dataset.dialogOpen ); if ( d && d.showModal ) { d.showModal(); } }
		const c = e.target.closest( '[data-dialog-close]' ); if ( c ) { const d = c.closest( 'dialog' ); if ( d ) { d.close(); } }
		const vp = e.target.closest( '.ak-voice__play' ); if ( vp ) { vp.classList.toggle( 'is-playing' ); }
	} );
	document.addEventListener( 'akds:select', ( e ) => {
		const scope = e.detail.el.closest( '[data-scope]' ) || document; const key = e.detail.value; const sel = e.target.dataset.bind; if ( !key || !sel ) { return; }
		$$( '[data-bind-' + sel + ']', scope ).forEach( ( el ) => { try { const m = JSON.parse( el.getAttribute( 'data-bind-' + sel ) ); if ( m[ key ] != null ) { el.textContent = m[ key ]; } } catch ( err ) { /* ignore */ } } );
		$$( '[data-show-' + sel + ']', scope ).forEach( ( el ) => { el.hidden = el.getAttribute( 'data-show-' + sel ) !== key; } );
	} );

	/* Toast helper: mw.notify 已由 base.css 主题化；这里提供 AKDS 样式的 toast */
	window.akdsToast = function ( msg, type, title ) {
		let wrap = $( '.ak-toasts' ); if ( !wrap ) { wrap = document.createElement( 'div' ); wrap.className = 'ak-toasts'; document.body.appendChild( wrap ); }
		const el = document.createElement( 'div' ); el.className = 'ak-toast' + ( type ? ' ak-toast--' + type : '' ); el.style.position = 'relative'; el.style.overflow = 'hidden';
		el.innerHTML = '<div>' + ( title ? '<div class="ak-toast__title"></div>' : '' ) + '<div class="ak-toast__msg"></div></div><i class="ak-toast__progress"></i>';
		if ( title ) { $( '.ak-toast__title', el ).textContent = title; } $( '.ak-toast__msg', el ).textContent = msg;
		wrap.appendChild( el ); setTimeout( () => el.remove(), 5000 );
	};

	/* Back to top */
	const fab = $( '.ak-fab' );
	if ( fab ) { window.addEventListener( 'scroll', () => fab.classList.toggle( 'is-visible', window.scrollY > 600 ), { passive: true } ); fab.addEventListener( 'click', () => window.scrollTo( { top: 0, behavior: 'smooth' } ) ); }
	// 目录浮层里的「回到顶部」（<1400 时替代 .ak-fab）：同样平滑滚动，且不往 URL 里塞 #
	document.addEventListener( 'click', ( e ) => { if ( e.target.closest( '.ak-toc__top' ) ) { e.preventDefault(); window.scrollTo( { top: 0, behavior: 'smooth' } ); } } );

	/* 搜索快捷键（/、Ctrl/⌘K、accesskey F）由 search-palette.js 接管 */
}() );
