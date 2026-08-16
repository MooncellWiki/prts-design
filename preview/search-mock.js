/* AKDS preview — 搜索面板的演示数据源（模拟 MW 侧 skin/resources/search-providers.js 的接口）
 * 演示两级数据源的设想：本地即时索引（干员 / 道具，支持拼音首字母与别名，0 网络等待，带结构化元数据）
 * + 站内标题搜索（REST v1/search/title，这里用假数据 + 150ms 延迟模拟）。 */
( function () {
	'use strict';
	if ( !window.akdsSearchPalette ) { return; }
	// 图片路径：dist 单文件打包时 build-dist.py 会注入 window.AKDS_ASSET_MAP = { 'avatar/x.png': 'data:…' }
	const asset = ( rel ) => ( window.AKDS_ASSET_MAP && window.AKDS_ASSET_MAP[ rel ] ) || ( 'assets/' + rel );
	const PROF = { warrior: '近卫', sniper: '狙击', caster: '术师', medic: '医疗', pioneer: '先锋', tank: '重装', support: '辅助', special: '特种' };
	// name, en, class, rarity, avatar, sub-branch, faction, pinyin-initials, aliases
	const OPS = [
		[ '阿米娅', 'Amiya', 'caster', 5, 'char_002_amiya_1p', '中坚术师', '罗德岛', 'amy', '兔兔' ],
		[ '凯尔希', "Kal'tsit", 'medic', 6, 'char_003_kalts_2', '咒愈师', '罗德岛', 'kex', 'k' ],
		[ '陈', "Ch'en", 'warrior', 6, 'char_010_chen_2', '剑豪', '龙门近卫局', 'c', 'chen' ],
		[ '煌', 'Blaze', 'warrior', 6, 'char_017_huang_2', '强攻手', '罗德岛', 'h', 'huang' ],
		[ '浊心斯卡蒂', 'Skadi the Corrupting Heart', 'support', 6, 'char_1012_skadi2_2', '吟游者', '深海猎人', 'zxskd', '浊蒂' ],
		[ '假日威龙陈', "Ch'en the Holungday", 'sniper', 6, 'char_1013_chen2_2', '散射手', '龙门近卫局', 'jrwlc', '水陈' ],
		[ '耀骑士临光', 'Nearl the Radiant Knight', 'warrior', 6, 'char_1014_nearl2_2', '无畏者', '卡西米尔', 'yqslg', '耀光' ],
		[ '空', 'Sora', 'support', 5, 'char_101_sora_2', '吟游者', '企鹅物流', 'k', 'sora' ],
		[ '德克萨斯', 'Texas', 'pioneer', 5, 'char_102_texas_2', '尖兵', '企鹅物流', 'dkss', '德狗' ],
		[ '阿米娅（医疗）', 'Amiya (Medic)', 'medic', 5, 'char_1037_amiya3_2', '咒愈师', '罗德岛', 'amy', '医疗兔' ],
		[ '能天使', 'Exusiai', 'sniper', 6, 'char_103_angel_2', '速射手', '企鹅物流', 'nts', '苹果派' ],
		[ '推进之王', 'Siege', 'pioneer', 6, 'char_112_siege_2', '尖兵', '维多利亚', 'tjzw', '推王' ],
		[ 'W', 'W', 'sniper', 6, 'char_113_cqbw_2', '炮手', '巴别塔', 'w', '' ],
		[ '白雪', 'ShiraYuki', 'sniper', 4, 'char_118_yuki_2', '散射手', '东国', 'bx', '' ],
		[ '白面鸮', 'Ptilopsis', 'medic', 5, 'char_128_plosis_2', '群愈师', '莱茵生命', 'bmx', '' ],
		[ '蓝毒', 'Blue Poison', 'sniper', 5, 'char_129_bluep_2', '速射手', '罗德岛', 'ld', '' ],
		[ '梅', 'May', 'sniper', 4, 'char_133_mm_2', '速射手', '罗德岛', 'm', '' ],
		[ '伊芙利特', 'Ifrit', 'caster', 6, 'char_134_ifrit_2', '轰击术师', '莱茵生命', 'yflt', '' ],
		[ '星熊', 'Hoshiguma', 'tank', 6, 'char_136_hsguma_2', '铁卫', '龙门近卫局', 'xx', '' ],
		[ '夜莺', 'Nightingale', 'medic', 6, 'char_141_nights_2', '群愈师', '罗德岛', 'yy', '' ],
		[ '幽灵鲨', 'Specter', 'warrior', 5, 'char_143_ghost_2', '斗士', '深海猎人', 'yls', '' ],
		[ '红', 'Projekt Red', 'special', 5, 'char_144_red_2', '处决者', '罗德岛', 'h', 'red' ],
		[ '闪灵', 'Shining', 'medic', 6, 'char_147_shining_2', '咒愈师', '罗德岛', 'sl', '' ],
		[ '临光', 'Nearl', 'tank', 5, 'char_148_nearl_2', '守护者', '卡西米尔', 'lg', '' ],
		[ '蛇屠箱', 'Cuora', 'tank', 4, 'char_150_snakek_2', '铁卫', '罗德岛', 'stx', '' ],
		[ '桃金娘', 'Myrtle', 'pioneer', 4, 'char_151_myrtle_2', '执旗手', '罗德岛', 'tjn', '' ],
		[ '银灰', 'SilverAsh', 'warrior', 6, 'char_172_svrash_2', '领主', '喀兰贸易', 'yh', '' ],
		[ '艾雅法拉', 'Eyjafjalla', 'caster', 6, 'char_180_amgoat_2', '中坚术师', '罗德岛', 'ayfl', '羊' ],
		[ '年', 'Nian', 'tank', 6, 'char_2014_nian_2', '驭法铁卫', '岁', 'n', 'nian' ],
		[ '黍', 'Shu', 'tank', 6, 'char_2025_shu_2', '守护者', '岁', 's', 'shu' ],
		[ '重岳', 'Chongyue', 'warrior', 6, 'char_2027_wang_2', '斗士', '岁', 'zy', '' ]
	].map( ( r ) => ( { name: r[ 0 ], en: r[ 1 ], cls: r[ 2 ], rarity: r[ 3 ], avatar: r[ 4 ], branch: r[ 5 ], faction: r[ 6 ], py: r[ 7 ], alias: r[ 8 ] } ) );

	const ITEMS = [
		[ '龙门币', '4001', 4, 'lmb' ], [ '至纯源石', '4002', 6, 'zcys' ], [ '采购凭证', '4006', 3, 'cgpz' ],
		[ '固源岩', '30012', 2, 'gyy' ], [ '固源岩组', '30013', 3, 'gyyz' ], [ '提纯源岩', '30014', 4, 'tcyy' ],
		[ '代糖', '30021', 1, 'dt' ], [ '糖', '30022', 2, 't' ], [ '糖组', '30023', 3, 'tz' ], [ '糖聚块', '30024', 4, 'tjk' ],
		[ '聚酸酯组', '30033', 3, 'jszz' ], [ '异铁块', '30044', 4, 'ytk' ], [ '扭转醇', '30073', 3, 'nzc' ], [ '白马醇', '30074', 4, 'bmc' ],
		[ '三水锰矿', '30084', 4, 'ssmk' ], [ '五水研磨石', '30094', 4, 'wsyms' ], [ 'RMA70-24', '30104', 4, 'rma' ], [ '聚合剂', '30115', 5, 'jhj' ],
		[ '技巧概要·卷1', '3301', 2, 'jqgy' ], [ '技巧概要·卷2', '3302', 3, 'jqgy' ], [ '技巧概要·卷3', '3303', 4, 'jqgy' ],
		[ '基础作战记录', '2001', 2, 'jczzjl' ], [ '高级作战记录', '2004', 5, 'gjzzjl' ], [ '模组数据块', 'mod_unlock_token', 5, 'mzsjk' ]
	].map( ( r ) => ( { name: r[ 0 ], id: r[ 1 ], rarity: r[ 2 ], py: r[ 3 ] } ) );

	const PAGES = [
		[ '1-7', '关卡 · 主线第一章「黑暗时代·上」', 'stage' ], [ 'CE-5', '关卡 · 货物运送（龙门币）', 'stage' ], [ 'LS-6', '关卡 · 战术演习（作战记录）', 'stage' ],
		[ '源石虫', '敌人 · 感染生物', 'enemy' ], [ '源石虫·α', '敌人 · 感染生物', 'enemy' ], [ '大喷蛛', '敌人 · 感染生物', 'enemy' ], [ '碎骨', '敌人 · 领袖', 'enemy' ],
		[ '危机合约', '活动 · 长期玩法', 'event' ], [ '集成战略', '活动 · 长期玩法', 'event' ], [ '保全派驻', '活动 · 长期玩法', 'event' ],
		[ '干员一览', '一览表', 'list' ], [ '敌人一览', '一览表', 'list' ], [ '道具一览', '一览表', 'list' ], [ '关卡一览', '一览表', 'list' ],
		[ '公开招募工具', '工具', 'tool' ], [ '基建技能一览', '一览表', 'list' ], [ '信赖', '机制', 'wiki' ], [ '精英化', '机制 · 干员养成', 'wiki' ], [ '专精', '机制 · 技能养成', 'wiki' ],
		[ '模组', '机制 · 干员养成', 'wiki' ], [ '罗德岛', '势力', 'wiki' ], [ '龙门', '地区', 'wiki' ], [ '企鹅物流', '势力', 'wiki' ], [ '莱茵生命', '势力', 'wiki' ]
	].map( ( r ) => ( { name: r[ 0 ], desc: r[ 1 ], kind: r[ 2 ] } ) );

	const CATS = [ '六星干员', '五星干员', '四星干员', '近卫干员', '狙击干员', '术师干员', '医疗干员', '罗德岛干员', '企鹅物流', '主线关卡', '资源收集关卡', '感染生物', '活动', '限定干员' ];
	const USERS = [ 'StarHeart', 'Doctor', 'Amiya_bot', 'Kaltsit', 'PRTS-Admin', 'Closure' ];
	const FILES = [ '头像 陈.png', '立绘 陈 1.png', '立绘 陈 2.png', '技能 陈 1.png', '头像 银灰.png', '道具 龙门币.png', 'Logo 罗德岛.png' ];

	function stars( n ) { let s = '<span class="ak-rarity ak-rarity--r' + n + '" aria-label="' + n + '星">'; for ( let i = 0; i < n; i++ ) { s += '<i></i>'; } return s + '</span>'; }
	function prof( c ) { return '<span class="ak-prof" title="' + PROF[ c ] + '"><img src="' + asset( 'profession/' + c + '.png' ) + '" alt="' + PROF[ c ] + '"></span>'; }
	function score( q, fields ) {
		// 精确 > 前缀 > 包含；拼音首字母 / 别名 只算前缀与精确
		q = q.toLowerCase();
		let best = 0;
		fields.forEach( ( f, i ) => {
			if ( !f ) { return; }
			f = String( f ).toLowerCase();
			if ( f === q ) { best = Math.max( best, 100 - i ); }
			else if ( f.indexOf( q ) === 0 ) { best = Math.max( best, 60 - i ); }
			else if ( i < 2 && f.indexOf( q ) > 0 ) { best = Math.max( best, 30 - i ); }
		} );
		return best;
	}
	function delay( ms, signal ) { return new Promise( ( res, rej ) => { const t = setTimeout( res, ms ); if ( signal ) { signal.addEventListener( 'abort', () => { clearTimeout( t ); rej( Object.assign( new Error( 'aborted' ), { name: 'AbortError' } ) ); } ); } } ); }

	function opItem( o ) {
		return { type: 'operator', label: o.name, en: o.en, url: '#op-' + o.avatar, thumb: asset( 'avatar/' + o.avatar + '.png' ), desc: PROF[ o.cls ] + ' · ' + o.branch + ' · ' + o.faction,
			meta: [ { html: prof( o.cls ) }, { html: stars( o.rarity ) } ] };
	}
	function itemItem( it ) {
		return { type: 'item', label: it.name, url: '#item-' + it.id, thumb: asset( 'item/' + it.id + '.png' ), desc: '道具 · T' + it.rarity, meta: [ { text: 'T' + it.rarity, cls: 'ak-tag ak-tag--sm ak-tag--label' } ] };
	}
	function pageItem( p ) { return { type: 'page', label: p.name, url: '#page-' + encodeURIComponent( p.name ), desc: p.desc }; }

	function search( q, signal ) {
		const ql = q.toLowerCase();
		const ops = OPS.map( ( o ) => [ score( ql, [ o.name, o.en, o.py, o.alias ] ), o ] ).filter( ( x ) => x[ 0 ] > 0 ).sort( ( a, b ) => b[ 0 ] - a[ 0 ] || b[ 1 ].rarity - a[ 1 ].rarity ).slice( 0, 5 ).map( ( x ) => opItem( x[ 1 ] ) );
		const its = ITEMS.map( ( it ) => [ score( ql, [ it.name, it.id, it.py ] ), it ] ).filter( ( x ) => x[ 0 ] > 0 ).sort( ( a, b ) => b[ 0 ] - a[ 0 ] ).slice( 0, 4 ).map( ( x ) => itemItem( x[ 1 ] ) );
		const groups = [];
		if ( ops.length ) { groups.push( { id: 'ops', label: '干员', en: 'Operators', items: ops } ); }
		if ( its.length ) { groups.push( { id: 'items', label: '道具', en: 'Items', items: its } ); }
		// 「站内标题搜索」用延迟模拟网络；本地索引结果先出，页面结果后到（keepStale 会保留列表并显示进度条）
		return delay( 150 + Math.random() * 120, signal ).then( () => {
			const pages = PAGES.map( ( p ) => [ score( ql, [ p.name, p.desc ] ), p ] ).filter( ( x ) => x[ 0 ] > 0 ).sort( ( a, b ) => b[ 0 ] - a[ 0 ] ).slice( 0, 6 ).map( ( x ) => pageItem( x[ 1 ] ) );
			if ( ql === '陈' ) { pages.unshift( { type: 'page', label: '陈', desc: '消歧义 · 可能指：干员「陈」、假日威龙陈、陈晖洁', url: '#page-chen-disambig' } ); }
			if ( ql === 'chen' ) { pages.unshift( { type: 'page', label: '陈', redirect: '重定向自 Chen', desc: '龙门近卫局特别督察组组长', url: '#page-chen', match: false } ); }
			if ( pages.length ) { groups.push( { id: 'pages', label: '页面', en: 'Pages', items: pages } ); }
			return groups;
		} );
	}

	const modes = [
		{ id: 'action', trigger: '/action', alias: '>', label: '动作', desc: '本页操作、特殊页面与工具', placeholder: '搜索动作…', fulltext: false,
			search: ( q ) => {
				const acts = [ [ '编辑本页', '打开可视化编辑器', 'edit' ], [ '查看历史', '本页修订记录', 'clock' ], [ '上传文件', 'Special:Upload', 'file' ], [ '随机页面', 'Special:Random', 'action' ], [ '最近更改', 'Special:RecentChanges', 'action' ], [ '偏好设置', 'Special:Preferences', 'user' ], [ '我的贡献', 'Special:Contributions', 'user' ], [ '切换主题', '终端 / 档案 / 跟随系统', 'action' ], [ '复制短链接', 'prts.wiki/w/…', 'external' ] ];
				const items = acts.filter( ( a ) => !q || a[ 0 ].includes( q ) || a[ 1 ].toLowerCase().includes( q.toLowerCase() ) ).map( ( a ) => ( { type: 'action', label: a[ 0 ], desc: a[ 1 ], icon: a[ 2 ], url: '#action-' + a[ 0 ], noRecent: true, dark: true } ) );
				return [ { id: 'acts', label: '动作', en: 'Actions', items: items } ];
			} },
		{ id: 'category', trigger: '/cat', alias: '#', label: '分类', desc: '查找并浏览分类', placeholder: '搜索分类…',
			search: ( q, signal ) => delay( 100, signal ).then( () => [ { id: 'cats', label: '分类', en: 'Categories', items: CATS.filter( ( c ) => !q || c.includes( q ) ).map( ( c ) => ( { type: 'category', label: '分类:' + c, url: '#cat-' + c, desc: Math.floor( 20 + Math.random() * 400 ) + ' 个页面' } ) ) } ] ) },
		{ id: 'user', trigger: '/user', alias: '@', label: '用户', desc: '查找用户页 / 贡献', placeholder: '搜索用户…',
			search: ( q, signal ) => delay( 100, signal ).then( () => [ { id: 'users', label: '用户', en: 'Users', items: USERS.filter( ( u ) => !q || u.toLowerCase().includes( q.toLowerCase() ) ).map( ( u ) => ( { type: 'user', label: u, url: '#user-' + u, desc: '用户页 · 贡献 · 讨论' } ) ) } ] ) },
		{ id: 'file', trigger: '/file', alias: '~', label: '文件', desc: '查找图片与媒体文件', placeholder: '搜索文件…',
			search: ( q, signal ) => delay( 100, signal ).then( () => [ { id: 'files', label: '文件', en: 'Files', items: FILES.filter( ( f ) => !q || f.includes( q ) ).map( ( f ) => ( { type: 'file', label: '文件:' + f, url: '#file-' + f, desc: 'PNG · 512×512' } ) ) } ] ) }
	];

	/* 快捷入口：页眉没有主导航，取侧栏「菜单 › 通用」组的前 6 项（sidebar-tree.js 增强后 ul 仍是 li 的直接子级） */
	function shortcuts() {
		const group = Array.from( document.querySelectorAll( '#MenuSidebar > ul > li' ) ).find( ( li ) => /^通用/.test( ( li.firstElementChild && li.firstElementChild.textContent || '' ).trim() ) );
		const links = group ? Array.from( group.querySelectorAll( ':scope > ul a' ) ) : Array.from( document.querySelectorAll( '#MenuSidebar a[href]' ) );
		const nav = links.slice( 0, 6 ).map( ( a ) => ( { label: a.textContent.trim(), url: a.getAttribute( 'href' ) || '#' } ) );
		return nav.concat( [ { label: '随机页面', url: '#random' } ] );
	}

	const api = window.akdsSearchPalette.init( {
		trigger: 'form.ak-header__search',
		toggles: '.ak-header__search-toggle',
		placeholder: '搜索 PRTS…',
		urls: { go: ( q ) => '#go-' + encodeURIComponent( q ), fulltext: ( q ) => '#fulltext-' + encodeURIComponent( q ) },
		providers: { search: search, shortcuts: shortcuts },
		modes: modes,
		// 预览里没有真实页面：选中后弹 toast 代替跳转
		onSelect: ( item, ev ) => {
			if ( window.akdsToast ) { window.akdsToast( item.type === 'search' ? '→ Special:Search（全文）' : ( item.url || '' ), '', ( item.type === 'action' ? '执行：' : '打开：' ) + item.label ); }
			api.close();
			return false;
		}
	} );
	// 演示：预览页里模拟 MW 的 Go —— 直接前往
	document.addEventListener( 'akds:palette-open', () => { /* hook for demos */ } );
	window.addEventListener( 'hashchange', () => {
		const m = location.hash.match( /^#(go|fulltext)-(.+)$/ );
		if ( m && window.akdsToast ) { window.akdsToast( decodeURIComponent( m[ 2 ] ), '', m[ 1 ] === 'go' ? 'Special:Search · Go（精确跳转，无则全文）' : 'Special:Search · 全文' ); history.replaceState( null, '', location.pathname + location.search ); }
	} );
}() );
