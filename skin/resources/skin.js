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

	/* 页面滚动锁（侧栏抽屉 / 目录浮层开着时页面不动；参考 VitePress useBodyScrollLock，与 preview.js 相同）：
	 * 首选 html.ak-scroll-lock（overflow:hidden，不改滚动位置）；有实体滚动条占宽时再写 scrollbar-gutter:stable 占住那条位置，页面不会左右抖；
	 * 不认 scrollbar-gutter 又有实体滚动条的老桌面浏览器退回拦事件（wheel / touchmove / 翻页键），浮层里真正可滚的元素放行；
	 * iOS 上 overflow:hidden 拦不住触摸滚动，额外拦 touchmove。抽屉与浮层共用一把锁，按持有者计数。 */
	const scrollLock = ( () => {
		const html = document.documentElement, owners = new Set(), opts = { capture: true, passive: false };
		const isIOS = /iP(?:ad|hone|od)/.test( navigator.userAgent ) || ( navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1 );
		const KEYS = new Set( [ ' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight' ] );
		const scrollable = ( t ) => {
			for ( let el = t instanceof Element ? t : null; el && el !== document.body; el = el.parentElement ) {
				const cs = getComputedStyle( el );
				if ( ( /auto|scroll/.test( cs.overflowY ) && el.scrollHeight > el.clientHeight ) || ( /auto|scroll/.test( cs.overflowX ) && el.scrollWidth > el.clientWidth ) ) { return true; }
			}
			return false;
		};
		const block = ( e ) => { if ( e.touches && e.touches.length > 1 ) { return; } if ( !scrollable( e.target ) ) { e.preventDefault(); } };
		const blockKeys = ( e ) => { if ( e.metaKey || e.ctrlKey || e.altKey || !KEYS.has( e.key ) ) { return; } const t = e.target; if ( t instanceof HTMLElement && ( t.isContentEditable || t.matches( 'input, textarea, select' ) ) ) { return; } block( e ); };
		let mode = '', gutter = null;
		function lock() {
			const hasBar = window.innerWidth > html.clientWidth;   // 实体滚动条占宽（覆盖式滚动条 / 手机为 0）
			if ( hasBar && !( window.CSS && CSS.supports( 'scrollbar-gutter', 'stable' ) ) ) { mode = 'events'; document.addEventListener( 'wheel', block, opts ); document.addEventListener( 'touchmove', block, opts ); document.addEventListener( 'keydown', blockKeys, opts ); return; }
			mode = 'overflow';
			if ( hasBar && !getComputedStyle( html ).scrollbarGutter.includes( 'stable' ) ) { gutter = html.style.scrollbarGutter; html.style.scrollbarGutter = 'stable'; }
			html.classList.add( 'ak-scroll-lock' );
			if ( isIOS ) { document.addEventListener( 'touchmove', block, opts ); }
		}
		function unlock() {
			if ( mode === 'events' ) { document.removeEventListener( 'wheel', block, opts ); document.removeEventListener( 'touchmove', block, opts ); document.removeEventListener( 'keydown', blockKeys, opts ); }
			else { if ( isIOS ) { document.removeEventListener( 'touchmove', block, opts ); } html.classList.remove( 'ak-scroll-lock' ); if ( gutter !== null ) { html.style.scrollbarGutter = gutter; gutter = null; } }
			mode = '';
		}
		return ( owner, on ) => { const had = owners.size > 0; if ( on ) { owners.add( owner ); } else { owners.delete( owner ); } if ( !had && owners.size ) { lock(); } else if ( had && !owners.size ) { unlock(); } };
	} )();
	window.akdsScrollLock = scrollLock;

	/* Sidebar drawer：开 = .is-open + 遮罩 + 滚动锁；关 = ✕ / 遮罩 / Esc（焦点回「菜单」）/ 回到 ≥1120（侧栏回左列，抽屉态、遮罩、锁都得撤） */
	const sidebar = $( '.ak-sidebar' ), menuBtn = $( '.ak-local-nav__menu' );
	function setSidebar( open ) {
		if ( !sidebar ) { return; }
		sidebar.classList.toggle( 'is-open', open );
		if ( menuBtn ) { menuBtn.setAttribute( 'aria-expanded', open ? 'true' : 'false' ); }
		let o = $( '.ak-overlay--sidebar' );
		if ( open && !o ) { o = document.createElement( 'div' ); o.className = 'ak-overlay ak-overlay--sidebar'; document.body.appendChild( o ); }
		if ( !open && o ) { o.remove(); }
		scrollLock( 'sidebar', open );
	}
	document.addEventListener( 'click', ( e ) => {
		if ( !sidebar ) { return; }
		if ( e.target.closest( '.ak-local-nav__menu' ) ) { setSidebar( !sidebar.classList.contains( 'is-open' ) ); }
		else if ( e.target.closest( '.ak-sidebar__close, .ak-overlay--sidebar' ) ) { setSidebar( false ); }
	} );
	document.addEventListener( 'keydown', ( e ) => { if ( e.key === 'Escape' && sidebar && sidebar.classList.contains( 'is-open' ) ) { setSidebar( false ); if ( menuBtn ) { menuBtn.focus(); } } } );
	window.matchMedia( '(max-width: 1119px)' ).addEventListener( 'change', ( e ) => { if ( !e.matches ) { setSidebar( false ); } } );

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

	/* 目录浮层收尾（开合本身是纯 CSS 的 .ak-toc-cb）：
	 *  · 把 checkbox 状态镜像到 html.ak-toc-open —— 浮层显示的主路径（skin.css 不再只靠 body:has() 桥接，没有 :has() 的旧内核也是真浮层）；
	 *  · 开着时锁页面滚动（VitePress 的 outline dropdown 同样锁）；跳转后 / 点浮层外 / Esc / 回到 ≥1400（目录回右侧导轨，锁必须撤）收起 */
	const tocCb = $( '.ak-toc-cb' );
	if ( tocCb ) {
		const tocMq = window.matchMedia( '(max-width: 1400px)' );
		const syncToc = () => { const on = tocCb.checked && tocMq.matches; document.documentElement.classList.toggle( 'ak-toc-open', on ); scrollLock( 'toc', on ); };
		const closeToc = () => { if ( tocCb.checked ) { tocCb.checked = false; syncToc(); } };
		tocCb.addEventListener( 'change', syncToc ); syncToc();   // 点 label / 键盘空格切换走 change；程序收起（closeToc）自己同步
		tocMq.addEventListener( 'change', ( e ) => { if ( !e.matches ) { closeToc(); } } );
		document.addEventListener( 'click', ( e ) => {
			if ( !tocCb.checked ) { return; }
			if ( e.target.closest( '.ak-toc a' ) ) { closeToc(); return; }
			// 放行 .ak-toc-cb：点 label 会再向 checkbox 派发一次 click，那次不算「外部」
			if ( !e.target.closest( '.ak-toc, .ak-local-nav__toc, .ak-toc-cb' ) ) { closeToc(); }
		} );
		document.addEventListener( 'keydown', ( e ) => { if ( e.key === 'Escape' ) { closeToc(); } } );
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
