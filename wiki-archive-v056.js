/* Ayer Wiki v0.5.6 — independent encyclopedia archive */
(function(){
const chapters=[
{key:'world',title:'世界设定',en:'WORLD LORE',desc:'起源 · 历史 · 元素 · 神明',cats:['世界观','历史','元素','神明'],icon:'world'},
{key:'region',title:'地区地图',en:'REGIONS',desc:'大陆 · 神之谷 · 萨德尔',cats:['地理'],icon:'map'},
{key:'people',title:'人物图鉴',en:'CHARACTERS',desc:'冒险者与重要人物',cats:['角色'],icon:'characters'},
{key:'calamity',title:'灾潮档案',en:'CALAMITY',desc:'灾潮 · 黑蚀 · 虚骸',cats:['灾潮与侵蚀'],icon:'calamity'},
{key:'story',title:'主线剧情',en:'STORY',desc:'篇章与故事记录',cats:['剧情'],icon:'story'},
{key:'system',title:'冒险者系统',en:'ADVENTURER',desc:'档案 · 进阶 · 天赋',cats:['系统'],icon:'adventurer'}
];
let selected='all',sort='category';
const filtered=()=>records.filter(e=>isWikiWorldEntry(e));
const count=c=>filtered().filter(e=>c.cats.includes(e.category)).length;
function wikiSelect(key){selected=key;activeGroup='全部档案';favoritesOnly=false;query='';const s=document.getElementById('search');if(s)s.value='';render();const el=document.getElementById('wiki-entry-heading');if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}
function wikiSort(){sort=sort==='category'?'name':'category';render()}
window.wikiSelect=wikiSelect;window.wikiSort=wikiSort;
function page(){
const term=query.trim().toLocaleLowerCase();
const category=chapters.find(c=>c.key===selected);
let entries=filtered().filter(e=>(!category||category.cats.includes(e.category))&&(!term||(e.title+' '+e.body+' '+e.category).toLocaleLowerCase().includes(term)));
if(sort==='name')entries.sort((a,b)=>a.title.localeCompare(b.title,'zh-CN'));
else entries.sort((a,b)=>chapters.findIndex(c=>c.cats.includes(a.category))-chapters.findIndex(c=>c.cats.includes(b.category))||a.title.localeCompare(b.title,'zh-CN'));
const chaptersHTML=chapters.map(c=>'<button type="button" class="wiki-archive-chapter '+(selected===c.key?'selected':'')+'" onclick="wikiSelect(\''+c.key+'\')" aria-label="浏览'+c.title+'"><img src="./icons/home/'+c.icon+'.webp" alt="" loading="lazy"><span><small>'+c.en+'</small><strong>'+c.title+'</strong><em>'+c.desc+'</em></span><b>'+count(c)+' 条</b></button>').join('');
const entryHTML=entries.map(e=>'<button type="button" class="wiki-archive-entry" onclick="openRecord('+e.id+')"><span class="wiki-entry-glyph" aria-hidden="true">✧</span><span class="wiki-entry-text"><small>'+escapePortal(e.category)+' · ARCHIVE</small><strong>'+escapePortal(e.title)+'</strong><span>'+escapePortal(e.body.replace(/\\s+/g,' ').slice(0,88))+(e.body.length>88?'…':'')+'</span></span><span class="wiki-entry-arrow" aria-hidden="true">›</span></button>').join('');
return '<section class="wiki-archive-page"><div class="wiki-archive-cover"><span class="wiki-cover-eyebrow">AIYER CONTINENT / ENCYCLOPEDIA</span><div class="wiki-cover-ornament" aria-hidden="true">✧</div><h2>星界百科</h2><p>循着星辉与古老的记载，探索艾耶尔大陆的世界、人物与故事。</p><div class="wiki-cover-bottom"><span>WORLD ARCHIVE · 档案馆</span><strong>'+filtered().length+' <small>条已收录</small></strong></div></div><div class="wiki-archive-heading"><div><small>ARCHIVE COLLECTION</small><h3>档案分类</h3></div><span>六大资料体系</span></div><div class="wiki-archive-chapters">'+chaptersHTML+'</div><div class="wiki-archive-heading wiki-entry-heading" id="wiki-entry-heading"><div><small>ENCYCLOPEDIA INDEX</small><h3>'+(category?category.title:'全部档案')+'</h3></div><button type="button" onclick="wikiSort()" aria-label="切换条目排序">排序：'+(sort==='category'?'分类':'名称')+' ↕</button></div><div class="wiki-archive-filter"><button class="'+(selected==='all'?'active':'')+'" onclick="wikiSelect(\'all\')">全部 <span>'+filtered().length+'</span></button>'+chapters.map(c=>'<button class="'+(selected===c.key?'active':'')+'" onclick="wikiSelect(\''+c.key+'\')">'+c.title+'</button>').join('')+'</div><div class="wiki-archive-results"><span>共 '+entries.length+' 条档案'+(term?' · 搜索“'+escapePortal(query.trim())+'”':'')+'</span><button onclick="portalHome()">返回首页 ›</button></div><div class="wiki-archive-entries">'+(entryHTML||'<div class="wiki-archive-empty">✧ 暂无符合条件的档案<br><small>请尝试其他分类或搜索词</small></div>')+'</div><p class="wiki-archive-note">档案内容以现有世界观资料为依据，未核验的设定不会自动补写。</p></section>';
}
const previous=render;
render=function(){if(activeGroup==='全部档案'&&!favoritesOnly){document.getElementById('categories').style.display='none';document.getElementById('content').innerHTML=page();document.body.classList.add('portal-v023');document.body.classList.remove('portal-home');if(typeof syncBottomNavigation==='function')syncBottomNavigation();document.body.classList.add('wiki-inner-page');const h=document.querySelector('body > header');if(h)h.hidden=true;}else previous()};
const prevOpen=portalOpen;
portalOpen=function(section){if(section==='全部档案')selected='all';prevOpen(section)};
render();
})();
