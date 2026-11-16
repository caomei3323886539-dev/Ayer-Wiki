/* v0.2.2 - streamlined information architecture; underlying records remain unchanged */
const wikiGroups=[
{name:'世界设定',icon:'✧',desc:'世界观、历史、元素与神明',cats:['世界观','历史','元素','神明']},
{name:'地区地图',icon:'◇',desc:'大陆地区、浮空岛与地点',cats:['地理']},
{name:'人物档案',icon:'♧',desc:'角色、冒险者与契约者',cats:['角色']},
{name:'灾潮档案',icon:'◈',desc:'灾潮、黑蚀与灾害生物',cats:['灾潮与侵蚀']},
{name:'故事与系统',icon:'▤',desc:'主线剧情、冒险者系统与游戏',cats:['剧情','系统','游戏']}
];
let activeGroup='首页';
function selectGroup(name){activeGroup=name;current='全部';favoritesOnly=false;history.replaceState(null,'',location.pathname+location.search);render();window.scrollTo(0,0)}
function selectCategory(c){const g=wikiGroups.find(x=>x.cats.includes(c));activeGroup=g?g.name:'首页';current=c;favoritesOnly=false;history.replaceState(null,'',location.pathname+location.search);render()}
function showFavorites(){activeGroup='收藏';favoritesOnly=true;render()}
function compactCard(e){return '<button class="compact-card" onclick="openRecord('+e.id+')"><strong>'+esc(e.title)+'</strong><span>'+esc(e.category)+'</span></button>'}
function groupPanel(g){const items=records.filter(e=>g.cats.includes(e.category));return '<button class="group-tile" onclick="selectGroup(\''+g.name+'\')"><span class="group-icon">'+g.icon+'</span><strong>'+g.name+'</strong><small>'+g.desc+'</small><span class="group-count">'+items.length+' 条资料</span></button>'}
render=function(){
 const searchText=query.trim().toLowerCase();
 const nav=[{name:'首页',icon:'⌂'},...wikiGroups.map(g=>({name:g.name,icon:g.icon})),{name:'收藏',icon:'☆'}];
 $('categories').innerHTML=nav.map(n=>'<button class="'+(activeGroup===n.name?'selected':'')+'" onclick="'+(n.name==='收藏'?'showFavorites()':'selectGroup(\''+n.name+'\')')+'">'+n.icon+' '+n.name+'</button>').join('');
 const group=wikiGroups.find(g=>g.name===activeGroup);
 const filtered=records.filter(e=>(favoritesOnly?favorites.has(e.id):(!group||group.cats.includes(e.category))&&(current==='全部'||current===e.category))&&(!searchText||(e.title+' '+e.body+' '+e.category).toLowerCase().includes(searchText)));
 if(activeGroup==='首页'&&!searchText&&!favoritesOnly){
  $('content').innerHTML='<section class="intro"><h2>探索艾耶尔大陆</h2><p>从五个主要档案入口开始阅读。全部资料仍可通过搜索查找。</p></section><section class="group-grid">'+wikiGroups.map(groupPanel).join('')+'</section><section class="recent"><h3>灾潮专题 · 最近收录</h3><div class="compact-grid">'+records.filter(e=>e.category==='灾潮与侵蚀').slice(0,4).map(compactCard).join('')+'</div></section>';
  return;
 }
 let subnav='';
 if(group&&group.cats.length>1&&!favoritesOnly&&!searchText){subnav='<div class="subnav"><button class="'+(current==='全部'?'active':'')+'" onclick="selectCategory(\'全部\')">全部</button>'+group.cats.map(c=>'<button class="'+(current===c?'active':'')+'" onclick="selectCategory(\''+c+'\')">'+c+'</button>').join('')+'</div>'}
 $('content').innerHTML='<div class="list-heading"><h2>'+(favoritesOnly?'我的收藏':searchText?'搜索结果':group?group.name:'全部档案')+'</h2><span>'+filtered.length+' 条</span></div>'+subnav+(filtered.length?'<section class="compact-grid">'+filtered.map(compactCard).join('')+'</section>':'<p class="empty">暂无符合条件的条目</p>');
};
const originalOpenRecord=openRecord;
openRecord=function(id){originalOpenRecord(id);const back=document.createElement('button');back.className='action';back.textContent='← 返回目录';back.onclick=()=>{history.replaceState(null,'',location.pathname+location.search);render()};const article=document.querySelector('#content .article');if(article)article.insertBefore(back,article.firstChild);$('categories').innerHTML='';};
document.querySelectorAll('.bottom button')[0].setAttribute('onclick',"selectGroup('首页')");
document.querySelectorAll('.bottom button')[1].setAttribute('onclick',"selectGroup('地区地图')");
document.querySelectorAll('.bottom button')[2].setAttribute('onclick',"selectGroup('人物档案')");
document.querySelector('footer').textContent='艾耶尔大陆 · 星界档案 v0.2.2 · 精简导航版';
render();
