/*! ═══════════════════════════════════════════════════════════════════════════
 *  PRTS Design · sidebar-tree.js — 侧栏多层导航（树形展开 + 桌面悬停飞出）
 *  皮肤（skins.akds.js 通过 require 引入）与 preview 共用；无依赖，ES5。
 *
 *  适配对象：.ak-sidebar 内的任意嵌套列表 ——
 *    · MediaWiki:Sidebar 门户（.ak-portlet > h3 + ul）
 *    · PRTS #MenuSidebar 的原始 wikitext 输出（p 分组标题 / ul / li > b|a + ul，任意深度）
 *    · 模板或小工具生成的 ul
 *
 *  增强后的结构（类名由本脚本添加，CSS 见 chrome/sidebar-tree.css）：
 *    li.ak-tree__branch[.is-open][.is-current-path]
 *      > (a|b|span).ak-tree__label            ← 原有标签元素（非链接时点击整行也可切换）
 *      > button.ak-tree__toggle[aria-expanded][aria-controls][aria-labelledby]
 *      > ul.ak-tree__list
 *
 *  两种形态，同一份 DOM：
 *  飞出（桌面：hover + fine pointer 且 ≥1120px，侧栏带 .is-flyout）：分支不就地展开——侧栏的高度不随点开的分支变，矮窗口里也只滚这一小段。
 *        悬停分支 → 右侧飞出它的子项（position:fixed，不受侧栏 overflow 裁切），移开即收；点击分支（切换钮 / 非链接标签）→ 钉住，再点 / Esc / 点别处收起。
 *        飞出层不拦滚轮（内滚到头 / 没有内滚时照常带动页面）；页面 / 侧栏滚动时它跟着自己那一行走，行滚出侧栏的可见范围才收起。
 *        键盘：切换钮上 Enter / Space / → 打开并把焦点移进飞出层，↑ ↓ Home End 在其中移动，Esc / ← 回到切换钮，Tab 收起后接着往下走。
 *        当前页所在分支只高亮（.is-current-path），不展开。
 *  树（抽屉 <1120 / 触屏 / 关掉飞出时）：点击 / 键盘 → 行内展开并记忆，当前页所在分支自动展开。
 *        关掉飞出：<aside class="ak-sidebar" data-flyout="off"> 或 <html data-akds-flyout="off">。
 *  状态：localStorage['akds-sidebar-tree'] = { "<分组>/<标签路径>": 1|0, "portlet:<id|标题>": 1|0 }（只在树形态下读写展开；.is-open 一直留在 DOM 上，飞出形态由 CSS 不显示）
 *        当前页 = a.selflink / .mw-selflink / li.is-active / li.selected / [aria-current] / href==location。
 *  导轨限高：侧栏还没吸顶时（首屏）比吸顶位置低出的那一截写进 .ak-sidebar 的 --_y，限高减掉它，导轨底边不探出视口（CSS 见 chrome/sidebar.css）。
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
		if ( persist !== false && li.dataset.akKey ) { state[ li.dataset.akKey ] = open ? 1 : 0; save(); }
		hideFlyout();
		syncExpanded( li );
	}
	/* aria-expanded：树形态 = 行内是否展开；飞出形态 = 它的飞出层是否开着 */
	function syncExpanded( li ) {
		var b = child( li, '.ak-tree__toggle' ); if ( !b ) { return; }
		var root = li.closest( ROOT );
		var open = root && root.classList.contains( 'is-flyout' ) ? flyLi === li : li.classList.contains( 'is-open' );
		b.setAttribute( 'aria-expanded', open ? 'true' : 'false' );
	}
	/* 形态：.is-flyout 由这里按媒体查询 / data-flyout 开关加减，CSS 据此不显示行内的子级 */
	function syncMode( root ) {
		root.classList.toggle( 'is-flyout', flyoutEnabled( root ) );
		each( root.querySelectorAll( '.ak-tree__branch' ), syncExpanded );
	}

	/* ── 增强（幂等；可对同一 root 反复调用，例如站点脚本晚于皮肤注入 #MenuSidebar） ── */
	function enhance( root ) {
		root.classList.toggle( 'is-flyout', flyoutEnabled( root ) );
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
		} );
		/* 当前页所在路径：高亮 + （树形态下）自动展开，不写入记忆 */
		var cur = root.querySelectorAll( 'a.selflink, a.mw-selflink, li.is-active > a, li.selected > a, a[aria-current="page"]' );
		if ( !cur.length ) {
			cur = Array.prototype.filter.call( root.querySelectorAll( 'li > a[href]' ), function ( a ) {
				try { var u = new URL( a.href, location.href ); return u.origin === location.origin && u.pathname === location.pathname && u.search === location.search && !u.hash; } catch ( e ) { return false; }
			} );
		}
		each( cur, function ( a ) {
			var li = a.closest( 'li' ); if ( li ) { li.classList.add( 'is-current' ); }
			for ( var n = a.parentElement; n && n !== root; n = n.parentElement ) {
				if ( n.tagName === 'LI' && n.classList.contains( 'ak-tree__branch' ) ) { n.classList.add( 'is-open', 'is-current-path' ); }
			}
		} );
		each( root.querySelectorAll( '.ak-tree__branch' ), syncExpanded );
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
		if ( li ) {
			e.preventDefault();
			if ( !flyoutEnabled( root ) ) { setOpen( li, !li.classList.contains( 'is-open' ) ); return; }
			/* 飞出形态：点一下钉住（悬停出来的那一个原地钉住，不重建），再点收起；键盘触发的点击（detail 0）把焦点移进去 */
			if ( flyLi === li && flyPinned ) { hideFlyout(); } else { showFlyout( li, true ); if ( e.detail === 0 ) { focusFlyout( 0 ); } }
			return;
		}
		if ( flyPinned ) { hideFlyout(); }   /* 钉住的飞出层：点侧栏里别的地方也收起 */
		var pt = e.target.closest( '.ak-portlet--collapsible > .ak-portlet__title, .ak-portlet--collapsible > h3' );
		if ( pt ) {
			var p = pt.parentElement, collapsed = p.classList.toggle( 'is-collapsed' );
			pt.setAttribute( 'aria-expanded', collapsed ? 'false' : 'true' );
			if ( p.dataset.akKey ) { state[ p.dataset.akKey ] = collapsed ? 0 : 1; save(); }
		}
	} );
	document.addEventListener( 'keydown', function ( e ) {
		var inFly = fly && e.target.closest && fly.contains( e.target );
		if ( inFly ) {
			/* 飞出层挂在 body 末尾，Tab 序不挨着侧栏：Tab / Esc / ← 先把焦点还给切换钮再收起（Tab 不拦，浏览器从切换钮接着往下 / 往上走） */
			if ( e.key === 'ArrowDown' || e.key === 'ArrowUp' ) { e.preventDefault(); focusFlyout( e.target, e.key === 'ArrowDown' ? 1 : -1 ); }
			else if ( e.key === 'Home' || e.key === 'End' ) { e.preventDefault(); focusFlyout( e.key === 'Home' ? 0 : -1 ); }
			else if ( e.key === 'Escape' || e.key === 'ArrowLeft' || e.key === 'Tab' ) { if ( e.key !== 'Tab' ) { e.preventDefault(); } closeFlyoutToToggle(); }
			return;
		}
		if ( e.key === 'Escape' ) { hideFlyout(); return; }
		var root = e.target.closest && e.target.closest( ROOT ); if ( !root ) { return; }
		var pt = e.target.closest( '.ak-portlet--collapsible > .ak-portlet__title[role="button"]' );
		if ( pt && ( e.key === 'Enter' || e.key === ' ' ) ) { e.preventDefault(); pt.click(); return; }
		var li = e.target.closest( '.ak-tree__branch' ); if ( !li ) { return; }
		var mine = e.target.parentElement === li;   /* 焦点在本分支自己的标签/切换钮上 */
		if ( flyoutEnabled( root ) ) {
			if ( mine && e.key === 'ArrowRight' ) { e.preventDefault(); showFlyout( li, true ); focusFlyout( 0 ); }
			return;
		}
		if ( e.key === 'ArrowRight' ) {
			if ( mine && !li.classList.contains( 'is-open' ) ) { e.preventDefault(); setOpen( li, true ); }
		} else if ( e.key === 'ArrowLeft' ) {
			/* 自己已展开 → 收起自己；否则收起最近的已展开祖先分支并聚焦其切换钮 */
			var target = ( mine && li.classList.contains( 'is-open' ) ) ? li : ( mine ? li.parentElement.closest( '.ak-tree__branch.is-open' ) : li );
			if ( target ) { e.preventDefault(); setOpen( target, false ); var b = child( target, '.ak-tree__toggle' ); if ( b ) { b.focus(); } }
		}
	} );

	/* ── 桌面飞出：悬停出现、移开即收；点击 / 键盘打开的钉住（flyPinned），不随指针移开收起 ── */
	var fly = null, flyLi = null, flyPinned = false, showTimer = 0, hideTimer = 0;
	var mq = window.matchMedia ? window.matchMedia( '(hover: hover) and (pointer: fine) and (min-width: 1120px)' ) : { matches: false };
	function flyoutEnabled( root ) { return mq.matches && root.getAttribute( 'data-flyout' ) !== 'off' && document.documentElement.getAttribute( 'data-akds-flyout' ) !== 'off'; }
	function hideFlyout() {
		clearTimeout( showTimer ); clearTimeout( hideTimer ); showTimer = 0;
		if ( fly ) { fly.parentNode.removeChild( fly ); fly = null; }   /* 每次重建，不复用（避免残留状态） */
		flyPinned = false;
		if ( flyLi ) { var was = flyLi; flyLi = null; was.classList.remove( 'is-peek' ); syncExpanded( was ); }
	}
	function scheduleHide() { if ( flyPinned ) { return; } clearTimeout( hideTimer ); hideTimer = setTimeout( hideFlyout, 180 ); }
	function showFlyout( li, pin ) {
		var ul = child( li, 'ul' ); if ( !ul ) { return; }
		if ( flyLi === li ) { clearTimeout( hideTimer ); flyPinned = flyPinned || !!pin; return; }
		hideFlyout();
		fly = document.createElement( 'div' ); fly.className = 'ak-flyout'; fly.setAttribute( 'role', 'group' ); fly.setAttribute( 'aria-label', txt( labelOf( li ) ) );
		fly.addEventListener( 'mouseenter', function () { clearTimeout( hideTimer ); } );
		fly.addEventListener( 'mouseleave', scheduleHide );
		var title = document.createElement( 'div' ); title.className = 'ak-flyout__title'; title.setAttribute( 'aria-hidden', 'true' ); title.textContent = txt( labelOf( li ) ); fly.appendChild( title );   /* 名字已在 aria-label 里 */
		var clone = ul.cloneNode( true );
		each( clone.querySelectorAll( '[id]' ), function ( n ) { n.removeAttribute( 'id' ); } );
		each( clone.querySelectorAll( '.ak-tree__toggle, script' ), function ( n ) { n.parentNode.removeChild( n ); } );
		fly.appendChild( clone );
		fly.style.top = '0px';
		document.body.appendChild( fly );
		placeFlyout( li );
		li.classList.add( 'is-peek' ); flyLi = li; flyPinned = !!pin;
		syncExpanded( li );
	}
	/* 把飞出层摆到分支那一行的右边（打开时、页面 / 侧栏滚动时）。返回这一行是否还在侧栏的可见范围里（滚出去了、钻到页眉底下了 → false） */
	function placeFlyout( li ) {
		var root = li.closest( ROOT ); if ( !root ) { return false; }
		var r = li.getBoundingClientRect(), box = root.getBoundingClientRect();
		var header = document.querySelector( '.ak-header' );   /* 粘性页眉压在飞出层之上：长的飞出层从页眉下沿起，不钻到它底下 */
		var headerBottom = header ? Math.max( 0, header.getBoundingClientRect().bottom ) : 0, minTop = headerBottom + 8;
		fly.style.maxHeight = ( window.innerHeight - minTop - 8 ) + 'px';
		fly.style.left = Math.round( r.right + 6 ) + 'px';
		fly.style.top = Math.round( Math.max( minTop, Math.min( r.top, window.innerHeight - 8 - fly.offsetHeight ) ) ) + 'px';
		return r.bottom > Math.max( box.top, headerBottom ) && r.top < Math.min( box.bottom, window.innerHeight );
	}
	/* 焦点移进飞出层：focusFlyout( 0 | -1 ) 首 / 末项；focusFlyout( 当前项, ±1 ) 上 / 下一项，首尾相接 */
	function focusFlyout( from, step ) {
		if ( !fly ) { return; }
		var items = fly.querySelectorAll( 'a[href]' ); if ( !items.length ) { return; }
		var i = typeof from === 'number' ? from : Array.prototype.indexOf.call( items, from ) + step;
		items[ ( i + items.length ) % items.length ].focus();
	}
	function closeFlyoutToToggle() {
		var b = flyLi && child( flyLi, '.ak-tree__toggle' );
		if ( b ) { b.focus(); }
		hideFlyout();
	}
	document.addEventListener( 'mouseover', function ( e ) {
		var root = e.target.closest ? e.target.closest( ROOT ) : null;
		if ( !root ) { return; }
		if ( !flyoutEnabled( root ) ) { return; }
		var row = e.target.closest( '.ak-tree__label, .ak-tree__toggle' );
		var li = row && row.parentElement;
		if ( li && li.classList.contains( 'ak-tree__branch' ) ) {
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
	/* 页面 / 侧栏滚动：飞出层跟着它那一行走（侧栏吸住后页面再滚，行不动、它也不动——指针停在飞出层上滚页面，它不会被滚没）；行滚出侧栏的可见范围才收起。它自己的内滚不算 */
	document.addEventListener( 'scroll', function ( e ) { if ( flyLi && fly && !fly.contains( e.target ) && !placeFlyout( flyLi ) ) { hideFlyout(); } }, true );
	window.addEventListener( 'resize', hideFlyout );
	function onModeChange() { hideFlyout(); each( document.querySelectorAll( ROOT ), syncMode ); }
	if ( mq.addEventListener ) { mq.addEventListener( 'change', onModeChange ); } else if ( mq.addListener ) { mq.addListener( onModeChange ); }

	/* ── 导轨限高：侧栏还没吸到页眉下时（首屏被头图露出段往下推了一截）比吸顶位置低，把这一截写进 --_y（CSS 从 max-height 里减掉），
	 *  导轨底边才不探出视口——首屏也看得到整条滚动条、只滚侧栏就能到底。随滚动 / 缩放更新、只在值变了时写；吸住之后、抽屉态（fixed，top 0）都是 0 ── */
	var fitRaf = 0;
	function fitRail() {
		fitRaf = 0;
		each( document.querySelectorAll( ROOT ), function ( root ) {
			var y = Math.max( 0, Math.round( root.getBoundingClientRect().top - ( parseFloat( getComputedStyle( root ).top ) || 0 ) ) ) + 'px';
			if ( root.style.getPropertyValue( '--_y' ) !== y ) { root.style.setProperty( '--_y', y ); }
		} );
	}
	function scheduleFit() { if ( !fitRaf ) { fitRaf = requestAnimationFrame( fitRail ); } }
	window.addEventListener( 'scroll', scheduleFit, { passive: true } );
	window.addEventListener( 'resize', scheduleFit );

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
		scheduleFit();
	}
	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', function () { init(); } ); } else { init(); }
	window.akdsSidebarTree = { init: init, refresh: enhance, setOpen: setOpen, hideFlyout: hideFlyout };
}() );
