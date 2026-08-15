/* skins.akds.js — 皮肤运行时（对应 preview/preview.js，改用 mw.user.clientPrefs） */
( function () {
	'use strict';
	const $ = ( s, r = document ) => r.querySelector( s );
	const $$ = ( s, r = document ) => Array.from( r.querySelectorAll( s ) );

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

	/* Sidebar drawer */
	document.addEventListener( 'click', ( e ) => {
		const sb = $( '.ak-sidebar' );
		if ( e.target.closest( '.ak-header__menu' ) ) { sb.classList.toggle( 'is-open' ); overlay( sb.classList.contains( 'is-open' ) ); }
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

	/* Tabs / panels / phase & level selectors / data-bind（与 preview.js 相同约定） */
	document.addEventListener( 'click', ( e ) => {
		const tab = e.target.closest( '.ak-tabs[data-tabs] .ak-tab' );
		if ( tab ) { e.preventDefault(); const tabs = tab.closest( '.ak-tabs' ); $$( '.ak-tab', tabs ).forEach( ( t ) => { t.classList.toggle( 'is-active', t === tab ); t.setAttribute( 'aria-selected', t === tab ); } ); $$( '.ak-tabpanel[data-tabs="' + tabs.dataset.tabs + '"]' ).forEach( ( p ) => { p.hidden = p.dataset.tab !== tab.dataset.tab; } ); }
		const ph = e.target.closest( '.ak-panel--collapsible > .ak-panel__head' ); if ( ph ) { ph.parentElement.classList.toggle( 'is-collapsed' ); }
		const pt = e.target.closest( '.ak-portlet--collapsible > .ak-portlet__title' ); if ( pt ) { pt.parentElement.classList.toggle( 'is-collapsed' ); }
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

	/* Search shortcut "/" */
	document.addEventListener( 'keydown', ( e ) => { if ( e.key === '/' && !/input|textarea|select/i.test( document.activeElement.tagName ) && !document.activeElement.isContentEditable ) { const i = $( '#searchInput, .ak-header__search input' ); if ( i ) { e.preventDefault(); i.focus(); } } } );
}() );
