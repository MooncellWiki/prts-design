/*! ═══════════════════════════════════════════════════════════════════════════
 *  AKDS · sidebar-tree.js — 侧栏多层导航（树形展开 + 桌面悬停飞出）
 *  皮肤（skins.akds.js 通过 require 引入）与 preview 共用；无依赖，ES5。
 *
 *  适配对象：.ak-sidebar 内的任意嵌套列表 ——
 *    · MediaWiki:Sidebar 门户（.ak-portlet > h3 + ul）
 *    · PRTS #MenuSidebar 的原始 wikitext 输出（p 分组标题 / ul / li > b|a + ul，任意深度）
 *    · 模板或小工具生成的 ul
 *
 *  增强后的结构（类名由本脚本添加，CSS 见 skin.css「Sidebar tree」段）：
 *    li.ak-tree__branch[.is-open][.is-current-path]
 *      > (a|b|span).ak-tree__label            ← 原有标签元素（非链接时点击整行也可切换）
 *      > button.ak-tree__toggle[aria-expanded][aria-controls][aria-labelledby]
 *      > ul.ak-tree__list
 *
 *  状态：localStorage['akds-sidebar-tree'] = { "<分组>/<标签路径>": 1|0, "portlet:<id|标题>": 1|0 }
 *        当前页所在分支（a.selflink / .mw-selflink / li.is-active / li.selected / [aria-current] / href==location）总是自动展开。
 *  飞出：hover + fine pointer 且 ≥1120px 时，悬停「折叠中」的分支 → 右侧飞出预览（position:fixed，不受侧栏 overflow 裁切）；
 *        点击 / 键盘 → 行内展开并记忆。关闭方式：<aside class="ak-sidebar" data-flyout="off"> 或 <html data-akds-flyout="off">。
 * ═══════════════════════════════════════════════════════════════════════════ */
( function () {
	'use strict';
	var ROOT = '.ak-sidebar';
	var STORE = 'akds-sidebar-tree';
	var uid = 0;
	var state = load();

	function load() { try { return JSON.parse( localStorage.getItem( STORE ) ) || {}; } catch ( e ) { return {}; } }
	function save() { try { localStorage.setItem( STORE, JSON.stringify( state ) ); } catch ( e ) { /* private mode */ } }
	function txt( el ) { return el ? ( el.textContent || '' ).replace( /\s+/g, ' ' ).trim() : ''; }
	function each( list, fn ) { Array.prototype.forEach.call( list, fn ); }
	function child( el, sel ) { return el ? el.querySelector( ':scope > ' + sel ) : null; }

	/* ── 标签元素：li 中位于子 ul 之前的内容；多节点或裸文本时包一层 span ── */
	function ensureLabel( li, ul ) {
		var nodes = [], n;
		for ( n = li.firstChild; n && n !== ul; n = n.nextSibling ) { nodes.push( n ); }
		var els = nodes.filter( function ( x ) { return x.nodeType === 1 && x.tagName !== 'BUTTON' && x.tagName !== 'SCRIPT'; } );
		var text = nodes.filter( function ( x ) { return x.nodeType === 3 && x.nodeValue.trim(); } );
		if ( els.length === 1 && !text.length ) { return els[ 0 ]; }
		var span = document.createElement( 'span' );
		li.insertBefore( span, ul );
		nodes.forEach( function ( x ) { if ( x.nodeType !== 1 || x.tagName !== 'BUTTON' ) { span.appendChild( x ); } } );
		return span;
	}
	function labelOf( li ) { return child( li, '.ak-tree__label' ); }

	/* ── 持久化键：分组标题 + 分支标签路径 ── */
	function groupOf( li ) {
		var top = li, root = li.closest( ROOT );
		while ( top.parentElement && top.parentElement !== root && top.parentElement.tagName !== 'DIV' && top.parentElement.tagName !== 'NAV' && top.parentElement.tagName !== 'ASIDE' ) { top = top.parentElement; }
		var h = top.previousElementSibling;
		while ( h && !/^(P|H[1-6])$/.test( h.tagName ) ) { h = h.previousElementSibling; }
		if ( h ) { return txt( h ); }
		var box = top.parentElement;
		var t = box && ( child( box, '.ak-portlet__title' ) || child( box, 'h3' ) || child( box, 'h2' ) );
		return t ? txt( t ) : ( box && box.id ) || '';
	}
	function keyOf( li ) {
		if ( li.dataset.akKey ) { return li.dataset.akKey; }
		var parts = [], n = li;
		while ( n && !n.matches( ROOT ) ) { if ( n.tagName === 'LI' && n.classList.contains( 'ak-tree__branch' ) ) { parts.unshift( txt( labelOf( n ) ) ); } n = n.parentElement; }
		return groupOf( li ) + '/' + parts.join( '/' );
	}

	function setOpen( li, open, persist ) {
		li.classList.toggle( 'is-open', open );
		var b = child( li, '.ak-tree__toggle' );
		if ( b ) { b.setAttribute( 'aria-expanded', open ? 'true' : 'false' ); }
		if ( persist !== false && li.dataset.akKey ) { state[ li.dataset.akKey ] = open ? 1 : 0; save(); }
		hideFlyout();
	}

	/* ── 增强（幂等；可对同一 root 反复调用，例如站点脚本晚于皮肤注入 #MenuSidebar） ── */
	function enhance( root ) {
		each( root.querySelectorAll( 'li > ul' ), function ( ul ) {
			var li = ul.parentElement;
			if ( !ul.id ) { ul.id = 'ak-tree-' + ( ++uid ); }
			ul.classList.add( 'ak-tree__list' );
			var label = ensureLabel( li, ul );
			label.classList.add( 'ak-tree__label' );
			if ( !label.id ) { label.id = ul.id + '-label'; }
			var fresh = !li.classList.contains( 'ak-tree__branch' );
			li.classList.add( 'ak-tree__branch' );
			var btn = child( li, '.ak-tree__toggle' );
			if ( !btn ) {
				btn = document.createElement( 'button' ); btn.type = 'button'; btn.className = 'ak-tree__toggle';
				btn.setAttribute( 'aria-controls', ul.id ); btn.setAttribute( 'aria-labelledby', label.id );
				li.insertBefore( btn, ul );
			}
			if ( fresh ) {
				var k = keyOf( li ); li.dataset.akKey = k;
				if ( Object.prototype.hasOwnProperty.call( state, k ) ) { li.classList.toggle( 'is-open', !!state[ k ] ); }   /* 用户记忆 > 作者默认(is-open) */
			}
			btn.setAttribute( 'aria-expanded', li.classList.contains( 'is-open' ) ? 'true' : 'false' );
		} );
		/* 当前页所在路径：自动展开 + 高亮（不写入记忆） */
		var cur = root.querySelectorAll( 'a.selflink, a.mw-selflink, li.is-active > a, li.selected > a, a[aria-current="page"]' );
		if ( !cur.length ) {
			cur = Array.prototype.filter.call( root.querySelectorAll( 'li > a[href]' ), function ( a ) {
				try { var u = new URL( a.href, location.href ); return u.origin === location.origin && u.pathname === location.pathname && u.search === location.search && !u.hash; } catch ( e ) { return false; }
			} );
		}
		each( cur, function ( a ) {
			var li = a.closest( 'li' ); if ( li ) { li.classList.add( 'is-current' ); }
			for ( var n = a.parentElement; n && n !== root; n = n.parentElement ) {
				if ( n.tagName === 'LI' && n.classList.contains( 'ak-tree__branch' ) ) { n.classList.add( 'is-open', 'is-current-path' ); var b = child( n, '.ak-tree__toggle' ); if ( b ) { b.setAttribute( 'aria-expanded', 'true' ); } }
			}
		} );
		/* 可折叠门户（.ak-portlet--collapsible）恢复记忆 */
		each( root.querySelectorAll( '.ak-portlet--collapsible' ), function ( p ) {
			var k = 'portlet:' + ( p.id || txt( child( p, '.ak-portlet__title' ) || child( p, 'h3' ) ) );
			p.dataset.akKey = k;
			if ( Object.prototype.hasOwnProperty.call( state, k ) ) { p.classList.toggle( 'is-collapsed', !state[ k ] ); }
			var t = child( p, '.ak-portlet__title' ) || child( p, 'h3' );
			if ( t ) { t.setAttribute( 'role', 'button' ); t.tabIndex = 0; t.setAttribute( 'aria-expanded', p.classList.contains( 'is-collapsed' ) ? 'false' : 'true' ); }
		} );
	}

	/* ── 点击 / 键盘 ── */
	document.addEventListener( 'click', function ( e ) {
		var root = e.target.closest( ROOT );
		if ( !root ) { if ( !fly || !fly.contains( e.target ) ) { hideFlyout(); } return; }
		var li = null, t = e.target.closest( '.ak-tree__toggle' );
		if ( t ) { li = t.parentElement; }
		else {
			var lab = e.target.closest( '.ak-tree__branch > .ak-tree__label' );
			if ( lab && lab.tagName !== 'A' && !e.target.closest( 'a' ) ) { li = lab.parentElement; }   /* 非链接标签：整行可切换 */
		}
		if ( li ) { e.preventDefault(); setOpen( li, !li.classList.contains( 'is-open' ) ); return; }
		var pt = e.target.closest( '.ak-portlet--collapsible > .ak-portlet__title, .ak-portlet--collapsible > h3' );
		if ( pt ) {
			var p = pt.parentElement, collapsed = p.classList.toggle( 'is-collapsed' );
			pt.setAttribute( 'aria-expanded', collapsed ? 'false' : 'true' );
			if ( p.dataset.akKey ) { state[ p.dataset.akKey ] = collapsed ? 0 : 1; save(); }
		}
	} );
	document.addEventListener( 'keydown', function ( e ) {
		if ( e.key === 'Escape' ) { hideFlyout(); return; }
		var root = e.target.closest && e.target.closest( ROOT ); if ( !root ) { return; }
		var pt = e.target.closest( '.ak-portlet--collapsible > .ak-portlet__title[role="button"]' );
		if ( pt && ( e.key === 'Enter' || e.key === ' ' ) ) { e.preventDefault(); pt.click(); return; }
		var li = e.target.closest( '.ak-tree__branch' ); if ( !li ) { return; }
		var mine = e.target.parentElement === li;   /* 焦点在本分支自己的标签/切换钮上 */
		if ( e.key === 'ArrowRight' ) {
			if ( mine && !li.classList.contains( 'is-open' ) ) { e.preventDefault(); setOpen( li, true ); }
		} else if ( e.key === 'ArrowLeft' ) {
			/* 自己已展开 → 收起自己；否则收起最近的已展开祖先分支并聚焦其切换钮 */
			var target = ( mine && li.classList.contains( 'is-open' ) ) ? li : ( mine ? li.parentElement.closest( '.ak-tree__branch.is-open' ) : li );
			if ( target ) { e.preventDefault(); setOpen( target, false ); var b = child( target, '.ak-tree__toggle' ); if ( b ) { b.focus(); } }
		}
	} );

	/* ── 桌面悬停飞出（peek） ── */
	var fly = null, flyLi = null, showTimer = 0, hideTimer = 0;
	var mq = window.matchMedia ? window.matchMedia( '(hover: hover) and (pointer: fine) and (min-width: 1120px)' ) : { matches: false };
	function flyoutEnabled( root ) { return mq.matches && root.getAttribute( 'data-flyout' ) !== 'off' && document.documentElement.getAttribute( 'data-akds-flyout' ) !== 'off'; }
	function hideFlyout() {
		clearTimeout( showTimer ); clearTimeout( hideTimer ); showTimer = 0;
		if ( fly ) { fly.parentNode.removeChild( fly ); fly = null; }   /* 每次重建，不复用（避免残留状态） */
		if ( flyLi ) { flyLi.classList.remove( 'is-peek' ); flyLi = null; }
	}
	function scheduleHide() { clearTimeout( hideTimer ); hideTimer = setTimeout( hideFlyout, 180 ); }
	function showFlyout( li ) {
		var ul = child( li, 'ul' ); if ( !ul ) { return; }
		hideFlyout();
		fly = document.createElement( 'div' ); fly.className = 'ak-flyout'; fly.setAttribute( 'aria-hidden', 'true' );
		fly.addEventListener( 'mouseenter', function () { clearTimeout( hideTimer ); } );
		fly.addEventListener( 'mouseleave', scheduleHide );
		var title = document.createElement( 'div' ); title.className = 'ak-flyout__title'; title.textContent = txt( labelOf( li ) ); fly.appendChild( title );
		var clone = ul.cloneNode( true );
		each( clone.querySelectorAll( '[id]' ), function ( n ) { n.removeAttribute( 'id' ); } );
		each( clone.querySelectorAll( '.ak-tree__toggle, script' ), function ( n ) { n.parentNode.removeChild( n ); } );
		fly.appendChild( clone );
		var r = li.getBoundingClientRect();
		fly.style.maxHeight = ( window.innerHeight - 16 ) + 'px';
		fly.style.left = Math.round( r.right + 6 ) + 'px';
		fly.style.top = '0px';
		document.body.appendChild( fly );
		var top = Math.max( 8, Math.min( r.top, window.innerHeight - 8 - fly.offsetHeight ) );
		fly.style.top = Math.round( top ) + 'px';
		li.classList.add( 'is-peek' ); flyLi = li;
	}
	document.addEventListener( 'mouseover', function ( e ) {
		var root = e.target.closest ? e.target.closest( ROOT ) : null;
		if ( !root ) { return; }
		if ( !flyoutEnabled( root ) ) { return; }
		var row = e.target.closest( '.ak-tree__label, .ak-tree__toggle' );
		var li = row && row.parentElement;
		if ( li && li.classList.contains( 'ak-tree__branch' ) && !li.classList.contains( 'is-open' ) ) {
			if ( flyLi === li ) { clearTimeout( hideTimer ); return; }
			clearTimeout( showTimer ); clearTimeout( hideTimer );
			showTimer = setTimeout( function () { showFlyout( li ); }, 120 );
		} else if ( flyLi || showTimer ) { clearTimeout( showTimer ); showTimer = 0; scheduleHide(); }
	} );
	document.addEventListener( 'mouseout', function ( e ) {
		if ( !flyLi && !showTimer ) { return; }
		var to = e.relatedTarget;
		if ( !to || ( !to.closest( ROOT ) && !( fly && fly.contains( to ) ) ) ) { clearTimeout( showTimer ); showTimer = 0; scheduleHide(); }
	} );
	document.addEventListener( 'scroll', function () { if ( flyLi ) { hideFlyout(); } }, true );
	window.addEventListener( 'resize', hideFlyout );

	/* ── 初始化：立即增强 + 监听后续注入（如 PRTS 站点脚本把 #MenuSidebar 移入 #mw-panel） ── */
	function init( scope ) {
		scope = scope || document;
		var roots = scope.matches && scope.matches( ROOT ) ? [ scope ] : scope.querySelectorAll( ROOT );
		each( roots, function ( root ) {
			enhance( root );
			if ( !root.__akTree && window.MutationObserver ) {
				var raf = 0;
				var mo = new MutationObserver( function () { if ( raf ) { return; } raf = requestAnimationFrame( function () { raf = 0; enhance( root ); } ); } );
				mo.observe( root, { childList: true, subtree: true } );
				root.__akTree = mo;
			}
		} );
	}
	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', function () { init(); } ); } else { init(); }
	window.akdsSidebarTree = { init: init, refresh: enhance, setOpen: setOpen, hideFlyout: hideFlyout };
}() );
