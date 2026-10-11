/*! ═══════════════════════════════════════════════════════════════════════════
 *  PRTS Design · client-prefs.js — 阅读设置（客户端偏好）：读写 + 卡片里的分段开关
 *  皮肤（skins.akds.js 通过 require 引入）与 preview 共用；无依赖，ES5。
 *
 *  偏好的载体与 MediaWiki 核心的 clientPrefs 相同：<html class="<feature>-clientpref-<value>">，CSS 只认这个类；
 *  持久化是一条 "feature-clientpref-value,…" 字符串——核心存 cookie（mwclientpreferences），Skin:Arknights 的 inline.js 存 localStorage 同名键、
 *  首帧前就打到 <html> 上。这里：有 mw.user.clientPrefs（皮肤在 skin.json 的 ClientPreferences 登记过）就交给核心；没有（预览 / 站外）就自己改类 + localStorage。
 *
 *  目前五项（值即 CSS 类后缀；主题见 tokens.css，其余见 base/sections.css · base/typography.css）：
 *    skin-theme    os（默认）/ day / night                            外观：MW 1.43 核心的 skin-theme（预览里 preview.js 听 akds:pref 再套用自己的 data-theme）
 *    ak-sections-on  mobile（默认）/ all / off                       章节折叠在哪开：只在 ≤639 窄屏 / 所有宽度 / 关（sections.js 读它）
 *    ak-sections   expand（默认）/ collapse                        开着时打开页面是展开还是收起
 *    ak-font-size  xsmall / small / regular（默认）/ large          正文字号 12 / 14 / 16 / 20（.mw-body-content 内的字号令牌整体换档）
 *    ak-table-font-size  auto（默认）/ xsmall                       表格字号：跟正文 / 12（base/tables.css；现网手机版「正文 13、表格 12」那种搭配）
 *
 *  开关（特殊页面 Special:ReadingPreferences 的表单，见 chrome/prefs.css）：.ak-seg[data-pref=<feature>] > button[data-value] 点一下 = set，
 *  或 label > input[type=radio][value] 改了 = set（无 JS 时是真表单）；is-active / aria-pressed / checked 由这里同步；
 *  改动后在 document 上派发 akds:pref（detail: { feature, value }），sections.js 听它。
 * ═══════════════════════════════════════════════════════════════════════════ */
( function () {
	'use strict';
	var SUFFIX = '-clientpref-';
	var KEY = 'mwclientpreferences';
	var DEFAULTS = { 'skin-theme': 'os', 'ak-sections-on': 'mobile', 'ak-sections': 'expand', 'ak-font-size': 'regular', 'ak-table-font-size': 'auto' };
	var html = document.documentElement;

	function get( feature ) {
		var m = html.className.match( new RegExp( '(?:^| )' + feature + SUFFIX + '([a-zA-Z0-9]+)(?: |$)' ) );
		return m ? m[ 1 ] : ( DEFAULTS[ feature ] || null );
	}
	function store( feature, value ) {
		var data = {}, raw = '';
		try { raw = localStorage.getItem( KEY ) || ''; } catch ( e ) { return; }
		raw.split( ',' ).forEach( function ( pair ) { var m = /^([\w-]+)-clientpref-(\w+)$/.exec( pair ); if ( m ) { data[ m[ 1 ] ] = m[ 2 ]; } } );
		data[ feature ] = value;
		try { localStorage.setItem( KEY, Object.keys( data ).map( function ( k ) { return k + SUFFIX + data[ k ]; } ).join( ',' ) ); } catch ( e ) { /* private mode */ }
	}
	function set( feature, value ) {
		if ( window.mw && mw.user && mw.user.clientPrefs && mw.user.clientPrefs.get( feature ) !== false ) {
			mw.user.clientPrefs.set( feature, value );   // 核心：改类 + 持久化（匿名 cookie / 登录用户 API）
		} else {
			var cur = html.className.match( new RegExp( '(?:^| )' + feature + SUFFIX + '[a-zA-Z0-9]+(?: |$)' ) );
			if ( cur ) { html.classList.remove( cur[ 0 ].trim() ); }
			html.classList.add( feature + SUFFIX + value );
			store( feature, value );
		}
		sync();
		document.dispatchEvent( new CustomEvent( 'akds:pref', { detail: { feature: feature, value: value } } ) );
	}
	/* 分段开关的选中态跟着 <html> 上的类走（多处开关、多标签页都一致） */
	function sync() {
		Array.prototype.forEach.call( document.querySelectorAll( '.ak-seg[data-pref]' ), function ( seg ) {
			var v = get( seg.getAttribute( 'data-pref' ) );
			Array.prototype.forEach.call( seg.querySelectorAll( 'button[data-value]' ), function ( b ) {
				var on = b.getAttribute( 'data-value' ) === v;
				b.classList.toggle( 'is-active', on ); b.setAttribute( 'aria-pressed', on ? 'true' : 'false' );
			} );
			Array.prototype.forEach.call( seg.querySelectorAll( 'label > input[type="radio"]' ), function ( r ) {
				var on = r.value === v; r.checked = on; r.parentNode.classList.toggle( 'is-active', on );
			} );
		} );
	}
	document.addEventListener( 'click', function ( e ) {
		var b = e.target.closest ? e.target.closest( '.ak-seg[data-pref] > button[data-value]' ) : null;
		if ( !b ) { return; }
		e.preventDefault();
		set( b.parentNode.getAttribute( 'data-pref' ), b.getAttribute( 'data-value' ) );
	} );
	document.addEventListener( 'change', function ( e ) {
		var r = e.target, seg = r && r.matches && r.matches( '.ak-seg[data-pref] > label > input[type="radio"]' ) ? r.closest( '.ak-seg' ) : null;
		if ( seg && r.checked ) { set( seg.getAttribute( 'data-pref' ), r.value ); }
	} );
	/* 别的标签页改了偏好（预览 / 站外的 localStorage 形态）：跟着换类 */
	window.addEventListener( 'storage', function ( e ) {
		if ( e.key !== KEY || !e.newValue ) { return; }
		e.newValue.split( ',' ).forEach( function ( pair ) {
			var m = /^([\w-]+)-clientpref-(\w+)$/.exec( pair );
			if ( !m || !( m[ 1 ] in DEFAULTS ) || get( m[ 1 ] ) === m[ 2 ] ) { return; }
			var cur = html.className.match( new RegExp( '(?:^| )' + m[ 1 ] + SUFFIX + '[a-zA-Z0-9]+(?: |$)' ) );
			if ( cur ) { html.classList.remove( cur[ 0 ].trim() ); }
			html.classList.add( pair );
			document.dispatchEvent( new CustomEvent( 'akds:pref', { detail: { feature: m[ 1 ], value: m[ 2 ] } } ) );
		} );
		sync();
	} );
	/* 特殊页面的「恢复默认设置」/「返回」：有 JS 时前者把各项设回默认（无 JS 是 name=reset 的提交，服务端清掉），后者同源来路时走 history.back()（还原滚动位置），否则照链接去 returnto */
	document.addEventListener( 'click', function ( e ) {
		var t = e.target.closest ? e.target.closest( '.ak-prefs__reset, .ak-prefs__back' ) : null;
		if ( !t ) { return; }
		if ( t.classList.contains( 'ak-prefs__reset' ) ) { e.preventDefault(); Object.keys( DEFAULTS ).forEach( function ( f ) { if ( get( f ) !== DEFAULTS[ f ] ) { set( f, DEFAULTS[ f ] ); } } ); return; }
		if ( window.history.length > 1 && document.referrer && document.referrer.indexOf( location.origin + '/' ) === 0 ) { e.preventDefault(); window.history.back(); }
	} );
	/* 页眉眼镜图标 → 面板 <dialog.ak-prefs-panel>（同 Vector 2022 的「外观」菜单）：≥640 非模态下拉（贴页眉右下沿），≤639 模态、页面正中（锁页面滚动）；
	 * 无 JS 时眼镜图标是去特殊页面的链接。收起：Esc / 点面板外（模态时点遮罩）/ 跨过 639 换形态；抬头是去特殊页面的链接。 */
	function panelInit() {
		var gear = document.getElementById( 'ak-prefs-toggle' ), panel = document.getElementById( 'ak-prefs-panel' );
		if ( !gear || !panel || typeof panel.showModal !== 'function' ) { return; }
		var mq = window.matchMedia( '(max-width: 639px)' ), modal = false;
		function lock( on ) { if ( window.akdsScrollLock ) { akdsScrollLock( 'prefs', on ); } }
		function reflect() { var on = panel.open; gear.setAttribute( 'aria-expanded', on ? 'true' : 'false' ); gear.classList.toggle( 'is-open', on ); if ( !on ) { lock( false ); } }
		function open() {
			if ( panel.open ) { return; }
			var cb = document.querySelector( '.ak-nav-cb' ); if ( cb && cb.checked ) { cb.checked = false; }   // 眼镜在 <1120 的 ⋮ 卡片里：开面板时把卡片收起
			modal = mq.matches; if ( modal ) { panel.showModal(); lock( true ); } else { panel.show(); }
			sync(); reflect();
			var first = panel.querySelector( 'input:checked' ) || panel.querySelector( 'input, button' ); if ( first ) { first.focus( { preventScroll: true } ); }
		}
		function close( refocus ) { if ( !panel.open ) { return; } panel.close(); reflect(); if ( refocus ) { gear.focus(); } }
		gear.addEventListener( 'click', function ( e ) { e.preventDefault(); if ( panel.open ) { close( true ); } else { open(); } } );
		panel.addEventListener( 'close', reflect );
		panel.addEventListener( 'click', function ( e ) {
			if ( modal && e.target === panel ) { close( false ); }   // 模态：点到 dialog 自己 = 点在遮罩上（内容区的点击目标都是子元素）
		} );
		panel.addEventListener( 'submit', function ( e ) { e.preventDefault(); } );   // 有 JS 时改了就生效，不提交
		document.addEventListener( 'click', function ( e ) { if ( panel.open && !modal && !panel.contains( e.target ) && !gear.contains( e.target ) ) { close( false ); } } );
		document.addEventListener( 'keydown', function ( e ) { if ( e.key === 'Escape' && panel.open && !modal ) { close( true ); } } );   // 模态的 Esc 由浏览器处理（cancel → close 事件）
		mq.addEventListener( 'change', function () { close( false ); } );
	}
	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', function () { sync(); panelInit(); } ); } else { sync(); panelInit(); }
	window.akdsClientPrefs = { get: get, set: set, sync: sync, defaults: DEFAULTS };
}() );
