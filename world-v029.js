/* v0.2.9 · world-setting illustrated index */
const worldCategories=[
{key:'世界观',title:'世界起源',english:'ORIGIN',description:'因艾耶尔星与世界诞生的不同学说',glyph:'✦',theme:'origin'},
{key:'历史',title:'历史与文明',english:'CHRONICLE',description:'星舟纪、创世纪与古代文明',glyph:'⌛',theme:'history'},
{key:'元素',title:'十元素体系',english:'ELEMENTS',description:'火、水、风、地、雷、冰、草、暗、光、空数',glyph:'◇',theme:'elements'},
{key:'神明',title:'神明体系',english:'DIVINITY',description:'初代十二神明与神明相关记载',glyph:'✧',theme:'divinity'}
];
let worldSelected='全部';
function worldCount(cat){return records.filter(e=>isWikiWorldEntry(e)&&e.category===cat).length}
function worldSettingPage(){
const entries=records.filter(e=>isWikiWorldEntry(e)&&worldCategories.some(c=>c.key===e.category)&&(worldSelected==='全部'||e.category===worldSelected));
const active=worldCategories.find(c=>c.key===worldSelected);
const cards=worldCategories.map(c=>'<button class="world-chapter '+c.theme+(worldSelected===c.key?' selected':'')+'" onclick="worldSelect(\''+c.key+'\')"><span class="world-chapter-glyph" aria-hidden="true">'+c.glyph+'</span><span class="world-chapter-copy"><small>'+c.english+' · '+worldCount(c.key)+' 条</small><strong>'+c.title+'</strong><span>'+c.description+'</span></span><span class="world-chapter-arrow" aria-hidden="true">↗</span></button>').join('');
const entryCards=entries.map(e=>'<button class="world-entry" onclick="openRecord('+e.id+')"><span class="world-entry-icon" aria-hidden="true">'+(worldCategories.find(c=>c.key===e.category)||{}).glyph+'</span><span class="world-entry-copy"><strong>'+escapePortal(e.title)+'</strong><small>'+escapePortal(e.category)+' · '+escapePortal(e.body.slice(0,45))+(e.body.length>45?'…':'')+'</small></span><span class="world-entry-chevron">›</span></button>').join('');
return '<section class="world-page"><div class="world-breadcrumb"><button onclick="portalHome()">首页</button><span>›</span><span>世界设定</span></div><div class="world-cover"><div class="world-cover-stars" aria-hidden="true">✧ · ✦ · ✧</div><span class="world-eyebrow">AIYER CONTINENT / WORLD LORE</span><h2>世界设定</h2><p>追溯因艾耶尔星的起源，探索历史文明、十元素与神明体系。</p><div class="world-cover-footer"><span>WORLD ARCHIVE</span><span>'+worldCategories.reduce((n,c)=>n+worldCount(c.key),0)+' 条已收录资料</span></div></div><div class="world-heading"><div><small>CHAPTER INDEX</small><h3>探索世界篇章</h3></div><button onclick="worldSelect(\'全部\')">查看全部 ›</button></div><div class="world-chapters">'+cards+'</div><div class="world-heading world-entries-heading"><div><small>ENCYCLOPEDIA</small><h3>'+(active?active.title:'世界档案')+'</h3></div><span class="world-total">'+entries.length+' 条</span></div><div class="world-filter"><button class="'+(worldSelected==='全部'?'active':'')+'" onclick="worldSelect(\'全部\')">全部</button>'+worldCategories.map(c=>'<button class="'+(worldSelected===c.key?'active':'')+'" onclick="worldSelect(\''+c.key+'\')">'+c.title+'</button>').join('')+'</div><div class="world-entries">'+(entryCards||'<p class="empty">当前分类尚无已收录条目</p>')+'</div><p class="world-source-note">百科资料按已收录设定展示。尚未核验的历史细节及神明名单不会自行补写。</p></section>'
}
function worldSelect(category){worldSelected=category;current='全部';activeGroup='世界设定';favoritesOnly=false;render();const target=document.querySelector('.world-entries-heading');if(target&&category!=='全部')target.scrollIntoView({block:'start',behavior:'smooth'})}
const previousPortalRender=render;
render=function(){if(activeGroup==='世界设定'&&!favoritesOnly&&!query.trim()){$p('categories').style.display='none';$p('content').innerHTML=worldSettingPage();document.body.classList.add('portal-v023');document.body.classList.remove('portal-home');syncBottomNavigation()}else previousPortalRender()};
const previousPortalOpen=portalOpen;
portalOpen=function(section){if(section==='世界设定')worldSelected='全部';previousPortalOpen(section)};
document.querySelector('footer').textContent='艾耶尔大陆 · 世界百科 v0.2.9 · 世界设定专题';
render();
