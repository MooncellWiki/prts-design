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
		const links = $$( 'a', toc );
		const heads = links.map( ( a ) => document.getElementById( decodeURIComponent( a.getAttribute( 'href' ).slice( 1 ) ) ) ).filter( Boolean );
		const io = new IntersectionObserver( ( entries ) => entries.forEach( ( en ) => { if ( en.isIntersecting ) { links.forEach( ( l ) => l.parentElement.classList.toggle( 'is-active', decodeURIComponent( l.getAttribute( 'href' ) ) === '#' + en.target.id ) ); } } ), { rootMargin: '-80px 0px -70% 0px' } );
		heads.forEach( ( h ) => io.observe( h ) );
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

	/* 页眉收起：向下滚动只留二级吸顶栏，向上滚 / 回到顶部再展开（无 JS 则始终两行） */
	let lastY = window.scrollY, ticking = false;
	function onScroll() {
		const y = Math.max( 0, window.scrollY ), root = document.documentElement;
		if ( !( tocCb && tocCb.checked ) ) {
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
