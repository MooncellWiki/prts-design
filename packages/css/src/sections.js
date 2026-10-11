/*! ═══════════════════════════════════════════════════════════════════════════
 *  PRTS Design · sections.js — 章节折叠（顶层 h2 一节一开关）
 *  皮肤（skins.akds.js 通过 require 引入）与 preview 共用；无依赖，ES5。
 *
 *  做法同 MobileFrontend 在 Minerva 上的 sectionCollapsing（prts 并成 Arknights 单皮肤、m. 域名回主域之后，手机端那套「点标题收起章节」就没了，这里补回来）：
 *    .mw-parser-output 的直接子元素里，每个 .mw-heading.mw-heading2 之后、下一个 .mw-heading2 之前的所有兄弟包进 <section class="ak-section" id="ak-section-N">
 *    （h3 以下的小节连同内容都在里面——Minerva 也只折顶层）；标题 div 加 .ak-section-head，h2 文字前插一枚 button.ak-section__toggle（+ / −，aria-expanded / aria-controls；同 Minerva 把箭头放在标题前）。
 *    MW 1.43 的 legacy 解析器不输出 <section>（Parsoid 才有），所以在客户端包；Skin:Arknights 想在服务端包也行（MF 的 MakeSectionsTransform），只要结构一样，这里会认出已包好的 section 直接接管。
 *  收起 = section[hidden="until-found"]（内容仍可被 Ctrl+F / 锚点找到，命中时浏览器派发 beforematch → 这里展开）；展开 = 去掉 hidden。
 *  开合：点标题整行（编辑链接 / 行内链接除外，拖选文字不算）或那枚按钮。
 *  锚点：跳到收起节里的标题 / 引用（点目录、点页内链接、地址栏带 #、hashchange）先展开再滚过去；跳到收起的 h2 本身也展开它（同 Minerva）。
 *  两项阅读设置（client-prefs.js）：ak-sections-on = 折叠在哪开——mobile（默认：只在 ≤639 的窄屏，桌面 / 平板不出开关，Minerva 的范围）/ all / off；
 *  ak-sections = 开着时的初始状态——expand（默认）/ collapse。改了设置、或视口跨过 639，立刻重新套用到当前页：关掉时全部展开、.mw-parser-output 加 .ak-sections--off 藏起开关。
 *  不记忆每一节的开合（Minerva 也不记）；打印样式全部展开（base/sections.css）。
 *  跳过：没有顶层 h2 的页面（首页）、.mw-parser-output[data-ak-sections="off"]、body.ak-no-sections、MW 首页（wgIsMainPage）。
 *  再渲染（VE 保存 / 编辑预览）：皮肤在 wikipage.content 钩子里再调 init(root)。
 * ═══════════════════════════════════════════════════════════════════════════ */
( function () {
	'use strict';
	var PHONE = '(max-width: 639px)';
	var seq = 0;
	function pref( k, d ) { return window.akdsClientPrefs ? akdsClientPrefs.get( k ) : d; }
	function enabled() { var on = pref( 'ak-sections-on', 'mobile' ); return on === 'all' || ( on === 'mobile' && window.matchMedia( PHONE ).matches ); }
	function collapsedByDefault() { return enabled() && pref( 'ak-sections', 'expand' ) === 'collapse'; }
	function heads( root ) { return Array.prototype.slice.call( root.querySelectorAll( ':scope > .mw-heading.mw-heading2' ) ); }

	function setState( head, collapsed ) {
		var sec = document.getElementById( head.getAttribute( 'data-ak-section' ) ), btn = head.querySelector( '.ak-section__toggle' );
		if ( !sec ) { return; }
		if ( collapsed ) { sec.setAttribute( 'hidden', 'until-found' ); } else { sec.removeAttribute( 'hidden' ); }
		head.classList.toggle( 'is-collapsed', collapsed );
		if ( btn ) { btn.setAttribute( 'aria-expanded', collapsed ? 'false' : 'true' ); btn.setAttribute( 'title', collapsed ? '展开本节' : '收起本节' ); }
	}
	function toggle( head ) { setState( head, !head.classList.contains( 'is-collapsed' ) ); }
	function allHeads() { return Array.prototype.slice.call( document.querySelectorAll( '.mw-parser-output.ak-sections > .ak-section-head' ) ); }
	function setAll( collapsed ) { allHeads().forEach( function ( h ) { setState( h, collapsed ); } ); }
		/* 把 el 所在的收起节展开（el 是节里的任何东西，或收起的 h2 本身）；返回是否展开了什么 */
	function reveal( el ) {
		if ( !el ) { return false; }
		var head = el.closest( '.ak-section-head' ) || ( function () { var s = el.closest( '.ak-section' ); return s ? s.previousElementSibling : null; }() );
		if ( head && head.classList.contains( 'is-collapsed' ) ) { setState( head, false ); return true; }
		return false;
	}
	function targetOf( hash ) {
		if ( !hash || hash.length < 2 ) { return null; }
		var id; try { id = decodeURIComponent( hash.slice( 1 ) ); } catch ( e ) { id = hash.slice( 1 ); }
		return document.getElementById( id ) || document.querySelector( 'a[name="' + id.replace( /"/g, '\\"' ) + '"]' );
	}

	function wrap( root ) {
		var hs = heads( root ), collapsed = collapsedByDefault();
		if ( !hs.length ) { return; }
		hs.forEach( function ( head ) {
			var sec = head.nextElementSibling, n;
			if ( !( sec && sec.classList.contains( 'ak-section' ) ) ) {   // 服务端没包：把到下一个 h2 为止的兄弟搬进来
				sec = document.createElement( 'section' ); sec.className = 'ak-section';
				head.parentNode.insertBefore( sec, head.nextSibling );
				for ( n = sec.nextSibling; n && !( n.nodeType === 1 && n.classList.contains( 'mw-heading2' ) ); n = sec.nextSibling ) { sec.appendChild( n ); }
			}
			if ( !sec.id ) { sec.id = 'ak-section-' + ( ++seq ); }
			head.classList.add( 'ak-section-head' ); head.setAttribute( 'data-ak-section', sec.id );
			if ( !head.querySelector( '.ak-section__toggle' ) ) {
				var h = head.querySelector( 'h2' ), btn = document.createElement( 'button' );
				btn.type = 'button'; btn.className = 'ak-section__toggle'; btn.setAttribute( 'aria-controls', sec.id );
				if ( h && h.id ) { btn.setAttribute( 'aria-labelledby', h.id ); }   // 读屏念「技能，按钮，已展开」；没有 id 时退回 title
				if ( h ) { h.insertBefore( btn, h.firstChild ); } else { head.insertBefore( btn, head.firstChild ); }   // 标题文字前（按钮没有文字，不污染 h2.textContent——目录 / 搜索还照常读标题）
			}
			setState( head, collapsed );
		} );
		root.classList.add( 'ak-sections' ); root.classList.toggle( 'ak-sections--off', !enabled() );
		// 地址栏带着 # 进来：目标在收起的节里就展开再滚过去（首帧时浏览器已经试过一次、没滚到）
		var t = targetOf( location.hash );
		if ( t && root.contains( t ) && reveal( t ) ) { t.scrollIntoView(); }
	}

	function init( root ) {
		var outs = root && root.classList && root.classList.contains( 'mw-parser-output' ) ? [ root ] : Array.prototype.slice.call( ( root || document ).querySelectorAll( '.mw-parser-output' ) );
		if ( document.body.classList.contains( 'ak-no-sections' ) || ( window.mw && mw.config && mw.config.get( 'wgIsMainPage' ) ) ) { return; }
		outs.forEach( function ( out ) {
			if ( out.classList.contains( 'ak-sections' ) || out.getAttribute( 'data-ak-sections' ) === 'off' || out.closest( '.ak-no-sections' ) ) { return; }
			wrap( out );
		} );
	}

	/* 点标题整行开合：按钮本身、或行里不是链接 / 控件的地方；拖选了文字不算点 */
	document.addEventListener( 'click', function ( e ) {
		var t = e.target;
		if ( !t.closest ) { return; }
		var head = t.closest( '.ak-section-head' );
		if ( !head || head.closest( '.ak-sections--off' ) ) { return; }
		if ( !t.closest( '.ak-section__toggle' ) ) {
			if ( t.closest( 'a, button, input, select, textarea, label, summary, .mw-editsection' ) ) { return; }
			var sel = window.getSelection && window.getSelection();
			if ( sel && sel.type === 'Range' && String( sel ).trim() ) { return; }
		}
		e.preventDefault(); toggle( head );
	} );
	/* Ctrl+F / 滚动到文本片段命中了收起节里的内容：浏览器派发 beforematch，展开它 */
	document.addEventListener( 'beforematch', function ( e ) { var s = e.target.closest && e.target.closest( '.ak-section' ); if ( s ) { reveal( s ); } } );
	/* 页内锚点：点链接时先把目标所在的节展开（默认动作随后滚动，内容已经可见就滚得到）；hashchange 兜底（键盘 / 脚本改 hash） */
	document.addEventListener( 'click', function ( e ) {
		var a = e.target.closest && e.target.closest( 'a[href*="#"]' );
		if ( !a || a.closest( '.ak-section-head' ) ) { return; }
		var href = a.getAttribute( 'href' ), i = href.indexOf( '#' );
		if ( i < 0 || ( i > 0 && a.pathname !== location.pathname ) ) { return; }
		reveal( targetOf( href.slice( i ) ) );
	} );
	window.addEventListener( 'hashchange', function () { var t = targetOf( location.hash ); if ( reveal( t ) ) { t.scrollIntoView(); } } );
	/* 阅读设置改了「章节」：立刻套用到当前页（同 Minerva：改偏好即刷新） */
	/* 阅读设置改了、或视口跨过 639：重新套用——关掉时全部展开并藏起开关 */
	function reapply() {
		var on = enabled();
		Array.prototype.forEach.call( document.querySelectorAll( '.mw-parser-output.ak-sections' ), function ( out ) { out.classList.toggle( 'ak-sections--off', !on ); } );
		setAll( collapsedByDefault() );
	}
	document.addEventListener( 'akds:pref', function ( e ) { if ( e.detail && ( e.detail.feature === 'ak-sections' || e.detail.feature === 'ak-sections-on' ) ) { reapply(); } } );
	window.matchMedia( PHONE ).addEventListener( 'change', reapply );

	if ( document.readyState === 'loading' ) { document.addEventListener( 'DOMContentLoaded', function () { init(); } ); } else { init(); }
	window.akdsSections = { init: init, setAll: setAll, reveal: reveal, toggle: toggle };
}() );
