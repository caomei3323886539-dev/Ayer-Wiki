/* v0.2.0: data enrichment and encyclopedia views, layered over v0.1.0 */
const expanded=[
['地理','神之谷·空中航道','连接神之谷各浮空岛区域的航行路线。航道作为独立地图图层展示，具体线路需以正式地图为准。','地理','神之谷'],
['地理','苍晶矿脉','神之谷互动地图中已有标记的地点，详细地形与建筑资料待核验。','地理','神之谷'],
['地理','祈愿花园','神之谷互动地图中已有标记的地点，详细设定待核验。','地理','神之谷'],
['地理','神之谷·浮空岛群','二十块大小不一的浮空岛区域，以高山、悬崖和荒峭绝壁为主要地貌。尚未逐一确认全部区域正式名称。','地理','神之谷'],
['角色','斯蕾缇娅·天赋','已知四项天赋名称：天羽谐律、虹羽织幕、空枢行迹、裂镰回响。具体数值以正式角色档案为准。','角色','斯蕾缇娅·优·艾耶格尔特'],
['角色','斯蕾缇娅·空之翼','斯蕾缇娅的伴生物。详细能力及外观资料待核验。','角色','斯蕾缇娅·优·艾耶格尔特'],
['剧情','主线剧情·第一章','已制作独立的主线剧情互动图鉴。此处提供章节索引，不替代完整剧情正文。','剧情','无名勇者的圣歌'],
['游戏','星界契约·三卡槽','战斗布局采用中央攻击位、左右支援位；前后列机制已在三卡槽方案中取消。','游戏','星界契约'],
['游戏','星界契约·进阶','契约者逐级进阶，不可越级，使用同名高级卡；每回合进阶次数有限制。','游戏','星界契约'],
['游戏','星界契约·协奏魔法','米露可专属协奏魔法卡包括 Chuochuo 星律旋音、Rue 星之咏唱与 Duo 双星合奏。','游戏','米露可·帕菲娜'],
['系统','冒险者等级与进阶','冒险者角色档案使用等级成长与进阶机制，等级上限90级，进阶最高8阶。','系统','冒险者档案'],
['系统','契约与伴生器','人物设定编辑器区分通用人设与伴生器人设，分别管理契约物、伴生物及武器资料。','系统','冒险者档案']
];
const first=records.length;expanded.forEach((x,i)=>records.push({id:first+i+1,category:x[0],title:x[1],body:x[2],group:x[3],related:x[4]}));
const oldRender=render;const oldOpen=openRecord;
const $v=id=>document.getElementById(id);
function statCard(label,value){return '<div class="stat"><b>'+value+'</b><span>'+label+'</span></div>'}
function homeOverview(){return '<section class="overview" aria-label="百科统计">'+statCard('已收录条目',records.length)+statCard('地理档案',records.filter(x=>x.category==='地理').length)+statCard('角色档案',records.filter(x=>x.category==='角色').length)+statCard('百科分类',new Set(records.map(x=>x.category)).size)+'</section><div class="feature-grid"><button class="feature" onclick="selectCategory(\'地理\')"><span>◈ 地理探索</span><strong>神之谷 · 萨德尔</strong><small>浮空岛群与大陆地区索引</small></button><button class="feature" onclick="selectCategory(\'角色\')"><span>✧ 人物图鉴</span><strong>冒险者 · 契约者</strong><small>档案与相关条目</small></button><button class="feature" onclick="selectCategory(\'剧情\')"><span>▤ 剧情资料</span><strong>主线章节</strong><small>剧情索引持续扩充</small></button></div>'}
render=function(){oldRender();const c=$v('content');if(!favoritesOnly&&current==='全部'&&!query)c.insertAdjacentHTML('afterbegin',homeOverview());c.querySelectorAll('.card').forEach(card=>{const id=Number((card.getAttribute('onclick')||'').match(/\d+/)?.[0]);if(favorites.has(id))card.insertAdjacentHTML('beforeend','<span class="saved-star">★ 已收藏</span>')})};
openRecord=function(id){oldOpen(id);const e=records.find(x=>x.id===id);const a=$v('content').querySelector('.article');if(!a)return;let related=records.filter(x=>x.id!==id&&(x.category===e.category&&(x.title.includes(e.title)||e.title.includes(x.title))||x.related===e.title||e.related===x.title)).slice(0,6);if(!related.length)related=records.filter(x=>x.id!==id&&x.category===e.category).slice(0,4);const links=related.map(x=>'<button class="related" onclick="openRecord('+x.id+')">'+esc(x.title)+' ↗</button>').join('');a.insertAdjacentHTML('beforeend','<section class="relations"><h3>关联档案</h3><div class="related-list">'+links+'</div></section>');const share=document.createElement('button');share.className='action';share.textContent='复制条目链接';share.addEventListener('click',async()=>{const url=location.origin+location.pathname+'#entry-'+id;try{await navigator.clipboard.writeText(url);share.textContent='✓ 已复制链接'}catch{share.textContent='复制失败，请从地址栏复制'}});a.appendChild(share);history.replaceState(null,'','#entry-'+id)};
const baseSelect=selectCategory;selectCategory=function(c){history.replaceState(null,'',location.pathname+location.search);baseSelect(c)};
const baseFav=showFavorites;showFavorites=function(){history.replaceState(null,'',location.pathname+location.search);baseFav()};
function restoreDeepLink(){const m=location.hash.match(/^#entry-(\d+)$/);if(m&&records.some(x=>x.id===Number(m[1])))openRecord(Number(m[1]))}
window.addEventListener('hashchange',restoreDeepLink);
document.querySelector('footer').textContent='艾耶尔大陆 · 星界档案 v0.2.0 · 资料持续核验中';
render();restoreDeepLink();
