/* Ayer Wiki v0.2.3 - portal-style home navigation */
const portalSections=[
{name:'世界设定',icon:'✦',color:'#d7eafa',sub:'世界起源、历史与神明',cats:['世界观','历史','元素','神明']},
{name:'地区地图',icon:'◈',color:'#d4e9e0',sub:'大陆与浮空岛',cats:['地理']},
{name:'人物图鉴',icon:'♧',color:'#f2dce9',sub:'冒险者与契约者',cats:['角色']},
{name:'灾潮图鉴',icon:'◆',color:'#e7ddec',sub:'灾潮与黑蚀现象',cats:['灾潮与侵蚀']},
{name:'主线剧情',icon:'▤',color:'#f5e8d5',sub:'故事与章节',cats:['剧情']},
{name:'冒险者系统',icon:'⚔',color:'#d9e7fa',sub:'等级、进阶与天赋',cats:['系统']},
{name:'全部档案',icon:'☷',color:'#e6ecf1',sub:'浏览所有资料',cats:[]}
];
let portalTab='观测板';
const $p=id=>document.getElementById(id);
const escapePortal=s=>esc(s);
function portalOpen(section){if(section==='全部档案'){activeGroup='全部档案';current='全部';favoritesOnly=false}else{activeGroup=section;current='全部';favoritesOnly=false}render();window.scrollTo(0,0)}
function portalHome(){activeGroup='首页';portalTab='观测板';favoritesOnly=false;current='全部';query='';$p('search').value='';render();window.scrollTo(0,0)}
function portalTabSelect(tab){portalTab=tab;if(tab==='观测板'){activeGroup='首页';render()}else{const target={'发现':'全部档案','世界':'世界设定','人物':'人物图鉴','灾潮':'灾潮图鉴'}[tab];portalOpen(target)}}
const portalIconFiles=['world','map','characters','calamity','story','adventurer','archive'];
const hiddenWikiTitles=new Set(['伊芙琳·诺维雅','薇洛妮卡·绯月','米露可·帕菲娜','维妮娅·卡洛薇尔']);
function isWikiWorldEntry(e){return e.category!=='游戏'&&!hiddenWikiTitles.has(e.title)&&!/(星界契约|星野生活)/.test(e.title+' '+e.body)}
function portalCategoryTile(g){const index=portalSections.findIndex(s=>s.name===g.name);const icon=portalIconFiles[index]||'archive';return `<button class="portal-icon-tile" onclick="portalOpen('${g.name}')"><img class="portal-art-icon" src="./icons/${icon}.svg?v=027" width="76" height="76" alt="" loading="lazy"><strong>${g.name}</strong></button>`}
function portalCard(e){return '<button class="portal-recommend-card" onclick="openRecord('+e.id+')"><span>'+escapePortal(e.title)+'</span><small>›</small></button>'}
function portalLanding(){const featured=records.filter(e=>isWikiWorldEntry(e)&&['灾潮','黑蚀现象','神之谷','斯蕾缇娅·优·艾耶格尔特'].includes(e.title));return '<nav class="portal-tabs" aria-label="首页频道">'+['观测板','发现','世界','人物','灾潮'].map(t=>'<button class="'+(portalTab===t?'active':'')+'" onclick="portalTabSelect(\''+t+'\')">'+t+'</button>').join('')+'</nav><div class="portal-search-row"><label for="search">⌕ 搜索艾耶尔大陆百科</label><button onclick="portalOpen(\'全部档案\')">目录 ▤</button></div><section class="portal-announcement"><span>资讯</span><p>灾潮专题资料已收录 · 8份原始设定文档</p><button onclick="portalOpen(\'灾潮图鉴\')">查看 ›</button></section><div class="portal-banner"><span>WORLD ARCHIVE</span><strong>神之谷 · 浮空岛群</strong><small>探索高空一万米之上的二十个岛屿区域</small><button onclick="openRecord('+((records.find(x=>x.title==='神之谷')||{}).id||1)+')">阅读地区档案 ›</button></div><section class="portal-shortcuts">'+portalSections.map(portalCategoryTile).join('')+'</section><section class="portal-hot"><h3>✦ 热门档案</h3><div class="portal-recommend-grid">'+featured.map(portalCard).join('')+'</div></section>'}
function portalList(){let section=portalSections.find(x=>x.name===activeGroup);let term=query.trim().toLowerCase();let list=records.filter(e=>isWikiWorldEntry(e)&&(favoritesOnly?favorites.has(e.id):(!section||!section.cats.length||section.cats.includes(e.category)))&&(!term||(e.title+e.body+e.category).toLowerCase().includes(term)));const label=favoritesOnly?'我的收藏':term?'搜索结果':section?section.name:'全部档案';return '<div class="portal-list-title"><button onclick="portalHome()">‹ 首页</button><h2>'+escapePortal(label)+'</h2><small>'+list.length+' 条</small></div>'+(section&&section.cats.length>1?'<div class="portal-subcats">'+section.cats.map(c=>'<button onclick="portalFilter(\''+c+'\')" class="'+(current===c?'active':'')+'">'+c+'</button>').join('')+'<button onclick="portalFilter(\'全部\')">全部</button></div>':'')+(list.length?'<div class="portal-list">'+list.map(e=>'<button onclick="openRecord('+e.id+')"><span class="portal-list-symbol">✧</span><span><strong>'+escapePortal(e.title)+'</strong><small>'+escapePortal(e.category)+'</small></span><span class="portal-arrow">›</span></button>').join('')+'</div>':'<p class="empty">暂无相关条目</p>')}
function portalFilter(c){current=c;render()}
render=function(){const term=query.trim();const home=activeGroup==='首页'&&!favoritesOnly&&!term;$p('categories').style.display='none';$p('content').innerHTML=home?portalLanding():portalList();document.body.classList.toggle('portal-home',home);document.body.classList.add('portal-v023');};
selectGroup=function(g){activeGroup=g==='首页'?'首页':g;favoritesOnly=false;current='全部';query='';$p('search').value='';render()};
selectCategory=function(c){const g=portalSections.find(s=>s.cats.includes(c));activeGroup=g?g.name:'全部档案';current=c;favoritesOnly=false;render()};
showFavorites=function(){activeGroup='收藏';favoritesOnly=true;render()};
const oldOpenPortal=openRecord;
openRecord=function(id){oldOpenPortal(id);document.body.classList.remove('portal-home');const article=$p('content').querySelector('.article');if(article){const back=article.querySelector('.action');if(back&&back.textContent.includes('返回'))back.onclick=()=>render()}};
const oldSearch=$p('search');oldSearch.placeholder='搜索艾耶尔大陆 Wiki';oldSearch.setAttribute('aria-label','搜索百科条目');
const bottom=document.querySelector('.bottom');
const bottomItems=[
{id:'home',label:'首页',action:"portalHome()",icon:"<svg class=\"nav-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z\"/><path d=\"m9 21 0-7h6v7\"/></svg>"},
{id:'wiki',label:'百科',action:"portalOpen('全部档案')",icon:"<svg class=\"nav-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1 3-2 6-2 9-1V5c-3-1-6-1-9 1z\"/><path d=\"M12 6v14M6 9h3M15 9h3M6 13h3M15 13h3\"/></svg>"},
{id:'map',label:'地图',action:"portalOpen('地区地图')",icon:"<svg class=\"nav-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z\"/><path d=\"M9 3v15M15 6v15\"/><path d=\"m12 9 2-2 2 2-2 4z\"/></svg>"},
{id:'favorites',label:'收藏',action:"showFavorites()",icon:"<svg class=\"nav-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.7\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"m12 2 3.1 6.3 7 1-5 4.9 1.2 7-6.3-3.3-6.3 3.3 1.2-7-5-4.9 7-1z\"/></svg>"}
];
bottom.innerHTML=bottomItems.map(item=>'<button type="button" data-nav="'+item.id+'" aria-label="'+item.label+'" onclick="'+item.action+'"><span class="nav-emblem">'+item.icon+'</span><span class="nav-label">'+item.label+'</span></button>').join('');
function syncBottomNavigation(){const selected=favoritesOnly?'favorites':activeGroup==='地区地图'?'map':activeGroup==='首页'?'home':'wiki';bottom.querySelectorAll('button[data-nav]').forEach(button=>{const active=button.dataset.nav===selected;button.classList.toggle('is-active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')})}
const renderWithBottom=render;render=function(){renderWithBottom();syncBottomNavigation()};
syncBottomNavigation();
document.querySelector('footer').textContent='艾耶尔大陆 · 世界百科 v0.2.8 · 底部导航精绘';
render();
