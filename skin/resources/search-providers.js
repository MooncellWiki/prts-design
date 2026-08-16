/* skins.akds.js · search-providers.js — 搜索面板的 MediaWiki 数据源（核心在 search-palette.js，与预览共用）
 *
 *  数据源分层（详见 docs/03 §搜索）：
 *    1. 标题搜索  REST /rest.php/v1/search/title（同 Vector 2022 / Citizen；有 PageImages 给缩略图、ShortDescription/Description2 给描述）
 *    2. 模式      > 动作（本页菜单 #p-views #p-cactions #p-tb #p-personal + 常用特殊页面）· # 分类 · @ 用户 · ~ 文件（Action API）
 *    3. 可选：本地即时索引（干员/道具 JSON，拼音首字母 / 别名 / 结构化元数据）—— 预留 hook：mw.hook('akds.search.local').fire(fn)
 *  未来可加：/ns: 命名空间、Related（RelatedArticles）、Cargo 查询模式。
 */
( function () {
	'use strict';
	const palette = require( './search-palette.js' );
	const scriptPath = mw.config.get( 'wgScriptPath' ) || '';
	const api = new mw.Api();
	const NS_CAT = 14, NS_FILE = 6;
	let localIndex = null;   // 站点可注入：mw.hook( 'akds.search.local' ).fire( ( q ) => Group[] )
	mw.hook( 'akds.search.local' ).add( ( fn ) => { localIndex = fn; } );

	function pageUrl( title, params ) { return mw.util.getUrl( title, params ); }
	function isRedirectUseful( title, matched ) {   // 与 Citizen 相同：别名式重定向才值得显示，"XX（简称）→XX" 不显示
		const c = ( s ) => s.toLowerCase().replace( /-|\s|_/g, '' );
		return !( c( title ).includes( c( matched ) ) || c( matched ).includes( c( title ) ) );
	}

	/* 1. REST 标题搜索 */
	function restSearch( q, signal, limit ) {
		const url = scriptPath + '/rest.php/v1/search/title?' + new URLSearchParams( { q: q, limit: String( limit || 10 ) } );
		return fetch( url, { headers: { accept: 'application/json' }, signal: signal } ).then( ( r ) => { if ( !r.ok ) { throw new Error( 'HTTP ' + r.status ); } return r.json(); } ).then( ( data ) => ( data.pages || [] ).map( ( p ) => {
			const redirect = p.matched_title && isRedirectUseful( p.title, p.matched_title ) ? mw.msg( 'akds-search-redirect', p.matched_title ) : null;
			return { type: 'page', label: p.title, url: pageUrl( p.matched_title || p.title ), desc: p.description || '', thumb: p.thumbnail && p.thumbnail.url ? p.thumbnail.url : '', redirect: redirect,
				actions: [ { id: 'edit', label: mw.msg( 'akds-search-edit' ), icon: 'edit', url: pageUrl( p.title, { action: 'edit' } ) } ] };
		} ) );
	}
	function search( q, signal ) {
		const local = localIndex ? Promise.resolve( localIndex( q ) ).catch( () => [] ) : Promise.resolve( [] );
		return Promise.all( [ local, restSearch( q, signal, 10 ) ] ).then( ( r ) => {
			const groups = ( r[ 0 ] || [] ).slice();
			const seen = new Set(); groups.forEach( ( g ) => g.items.forEach( ( it ) => seen.add( it.url ) ) );
			const pages = r[ 1 ].filter( ( it ) => !seen.has( it.url ) );
			if ( pages.length ) { groups.push( { id: 'pages', label: mw.msg( 'akds-search-pages' ), en: 'Pages', items: pages } ); }
			return groups;
		} );
	}

	/* 2. 模式 */
	function menuActions() {
		const items = [];
		const seen = new Set();
		document.querySelectorAll( '#p-views li a, #p-cactions li a, #p-tb li a, #p-personal li a, .ak-page-tabs a' ).forEach( ( a ) => {
			const label = ( a.textContent || '' ).trim(), href = a.getAttribute( 'href' );
			if ( !label || !href || href === '#' || seen.has( href ) ) { return; }
			seen.add( href );
			items.push( { type: 'action', label: label, url: a.href, desc: a.title || '', noRecent: true, dark: true, icon: /edit|veaction/.test( href ) ? 'edit' : /history/.test( href ) ? 'clock' : /Upload|File/.test( href ) ? 'file' : /User|Contributions|Preferences|Watchlist/.test( href ) ? 'user' : 'action' } );
		} );
		[ 'Special:RecentChanges', 'Special:Random', 'Special:SpecialPages', 'Special:AllPages', 'Special:Categories', 'Special:Statistics' ].forEach( ( t ) => {
			const url = pageUrl( t ); if ( seen.has( url ) ) { return; }
			items.push( { type: 'action', label: t.replace( /^Special:/, '' ), desc: t, url: url, noRecent: true, dark: true } );
		} );
		return items;
	}
	function filterBy( q ) { q = ( q || '' ).toLowerCase(); return ( it ) => !q || it.label.toLowerCase().includes( q ) || ( it.desc || '' ).toLowerCase().includes( q ); }
	function prefixSearch( ns, q, extra ) {
		return api.get( Object.assign( { action: 'query', list: 'prefixsearch', pssearch: q, psnamespace: ns, pslimit: 10, format: 'json', formatversion: 2 }, extra || {} ) )
			.then( ( d ) => ( d.query && d.query.prefixsearch ) || [] );
	}
	const modes = [
		{ id: 'action', trigger: '/action', alias: '>', label: mw.msg( 'akds-search-mode-action' ), desc: mw.msg( 'akds-search-mode-action-desc' ), placeholder: mw.msg( 'akds-search-mode-action-placeholder' ), fulltext: false,
			search: ( q ) => [ { id: 'acts', label: mw.msg( 'akds-search-mode-action' ), en: 'Actions', items: menuActions().filter( filterBy( q ) ) } ] },
		{ id: 'category', trigger: '/cat', alias: '#', label: mw.msg( 'akds-search-mode-category' ), desc: mw.msg( 'akds-search-mode-category-desc' ), placeholder: mw.msg( 'akds-search-mode-category-placeholder' ),
			search: ( q ) => ( q ? prefixSearch( NS_CAT, q ) : api.get( { action: 'query', prop: 'categories', titles: mw.config.get( 'wgPageName' ), cllimit: 20, clshow: '!hidden', format: 'json', formatversion: 2 } ).then( ( d ) => { const p = d.query && d.query.pages && d.query.pages[ 0 ]; return ( p && p.categories || [] ).map( ( c ) => ( { title: c.title } ) ); } ) )
				.then( ( rows ) => [ { id: 'cats', label: mw.msg( 'akds-search-mode-category' ), en: 'Categories', hint: q ? '' : mw.msg( 'akds-search-mode-category-thispage' ), items: rows.map( ( r ) => ( { type: 'category', label: r.title, url: pageUrl( r.title ) } ) ) } ] ) },
		{ id: 'user', trigger: '/user', alias: '@', label: mw.msg( 'akds-search-mode-user' ), desc: mw.msg( 'akds-search-mode-user-desc' ), placeholder: mw.msg( 'akds-search-mode-user-placeholder' ),
			search: ( q ) => api.get( { action: 'query', list: 'allusers', auprefix: q, aulimit: 10, format: 'json', formatversion: 2 } ).then( ( d ) => [ { id: 'users', label: mw.msg( 'akds-search-mode-user' ), en: 'Users', items: ( d.query && d.query.allusers || [] ).map( ( u ) => ( { type: 'user', label: u.name, url: pageUrl( 'User:' + u.name ), desc: mw.msg( 'akds-search-mode-user-row' ) } ) ) } ] ) },
		{ id: 'file', trigger: '/file', alias: '~', label: mw.msg( 'akds-search-mode-file' ), desc: mw.msg( 'akds-search-mode-file-desc' ), placeholder: mw.msg( 'akds-search-mode-file-placeholder' ),
			search: ( q ) => api.get( { action: 'query', generator: 'prefixsearch', gpssearch: q, gpsnamespace: NS_FILE, gpslimit: 10, prop: 'pageimages', piprop: 'thumbnail', pithumbsize: 80, format: 'json', formatversion: 2 } ).then( ( d ) => [ { id: 'files', label: mw.msg( 'akds-search-mode-file' ), en: 'Files', items: ( d.query && d.query.pages || [] ).sort( ( a, b ) => a.index - b.index ).map( ( p ) => ( { type: 'file', label: p.title, url: pageUrl( p.title ), thumb: p.thumbnail && p.thumbnail.source } ) ) } ] ) }
	];

	function shortcuts() {
		return Array.from( document.querySelectorAll( '.ak-header__nav a' ) ).slice( 0, 8 ).map( ( a ) => ( { label: ( a.textContent || '' ).trim(), url: a.href } ) ).filter( ( s ) => s.label );
	}

	const M = {
		label: mw.msg( 'akds-search-label' ), placeholder: mw.msg( 'akds-search-placeholder' ),
		recent: mw.msg( 'akds-search-recent' ), modes: mw.msg( 'akds-search-modes' ),
		fulltext: mw.msg( 'akds-search-fulltext' ), fulltextDesc: mw.msg( 'akds-search-fulltext-desc' ),
		emptyTitle: mw.msg( 'akds-search-empty-title' ), emptyDesc: mw.msg( 'akds-search-empty-desc' ),
		shortcuts: mw.msg( 'akds-search-shortcuts' ), noResults: mw.msg( 'akds-search-noresults' ), noResultsDesc: mw.msg( 'akds-search-noresults-desc' ),
		error: mw.msg( 'akds-search-error' ), results: mw.msg( 'akds-search-results' ),
		hintNavigate: mw.msg( 'akds-search-hint-navigate' ), hintOpen: mw.msg( 'akds-search-hint-open' ), hintFulltext: mw.msg( 'akds-search-hint-fulltext' ), hintClose: mw.msg( 'akds-search-hint-close' ), hintClear: mw.msg( 'akds-search-hint-clear' ), hintBack: mw.msg( 'akds-search-hint-back' ), hintCommands: mw.msg( 'akds-search-hint-commands' ),
		close: mw.msg( 'akds-search-close' ), clear: mw.msg( 'akds-search-clear' ), back: mw.msg( 'akds-search-back' ), remove: mw.msg( 'akds-search-remove' ), edit: mw.msg( 'akds-search-edit' ),
		brand: mw.config.get( 'wgSiteName' ) + ' · Search'
	};

	module.exports = palette.init( {
		trigger: 'form.ak-header__search',
		toggles: '.ak-header__search-toggle',
		messages: M,
		urls: {
			go: ( q ) => pageUrl( 'Special:Search', { search: q, go: 'Go' } ),          // MW 原生 Go：精确标题直达，否则落到全文结果页
			fulltext: ( q ) => pageUrl( 'Special:Search', { search: q, fulltext: '1' } )
		},
		providers: { search: search, shortcuts: shortcuts },
		modes: modes,
		recent: { key: 'akds-recent', max: 8 }
	} );
}() );
