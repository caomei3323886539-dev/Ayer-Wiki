const records=[
["世界观","因艾耶尔星","艾耶尔大陆所在的星球。其起源存在不同理论，包括神创论与元素物质论。"],
["世界观","神创论","关于世界起源的一种理论。"],
["世界观","元素物质论","关于世界起源的另一种理论。"],
["历史","星舟纪","世界观记录中出现的历史纪元，具体时间线待补充。"],
["历史","前创世纪","世界观记录中出现的历史纪元，具体时间线待补充。"],
["历史","创世纪","世界观记录中出现的历史纪元，具体时间线待补充。"],
["历史","坎比亚文明","世界观文档提及的文明。"],
["历史","古阿里修斯文明","世界观文档提及的文明。"],
["历史","艾耶尔文明","世界观文档提及的文明。"],
["地理","艾耶尔大陆","本系列故事的主要世界与地理舞台。"],
["地理","萨德尔地区","包含北方边境、荒古沙域、无垣砂、大砂暴和石化森林等地。"],
["地理","神之谷","位于约一万米高空，由二十个浮空岛区域组成，天空中有巨大的光环。"],
["地理","十六翼庭","神之谷的神庭圣域正式名称。"],
["地理","北方边境","萨德尔地区的地理区域。"],
["地理","荒古沙域","萨德尔地区的地理区域。"],
["地理","无垣砂","萨德尔地区的地理区域。"],
["地理","大砂暴","萨德尔地区的地理区域。"],
["地理","石化森林","萨德尔地区的地理区域。"],
["角色","斯蕾缇娅·优·艾耶格尔特","天翼族女性，神之谷出身，隶属神谕联合，五星冒险者。外表约16岁，实际约800岁；伴生物为空之翼。四项天赋包括天羽谐律、虹羽织幕、空枢行迹与裂镰回响。"],
["角色","菲莉娅","已有人物立绘与 SD 动态角色制作记录；完整人物资料待导入。"],
["角色","克莱尔","人物设定资料中出现的角色；详细档案待导入。"],
["角色","伊芙琳·诺维雅","《星界契约》的主要契约者之一，拥有一至六级卡牌。"],
["角色","薇洛妮卡·绯月","《星界契约》的主要契约者之一，拥有一至六级卡牌。"],
["角色","米露可·帕菲娜","《星界契约》的主要契约者之一，拥有专属协奏魔法卡。"],
["角色","维妮娅·卡洛薇尔","《星界契约》的主要契约者之一，拥有一至六级卡牌。"],
["元素","火元素","十元素体系之一。"],
["元素","水元素","十元素体系之一。"],
["元素","风元素","十元素体系之一。"],
["元素","地元素","十元素体系之一。"],
["元素","雷元素","十元素体系之一。"],
["元素","冰元素","十元素体系之一。"],
["元素","草元素","十元素体系之一。"],
["元素","暗元素","第八元素，采用月亮形象的圆形图标。"],
["元素","光元素","十元素体系之一。"],
["元素","空数元素","第十元素，采用方块作为图标的主要元素。"],
["神明","初代十二神明","世界观中有十二位初代神明，完整名单待复核。"],
["剧情","无名勇者的圣歌","主线剧情第一章，已有独立互动图鉴项目。"],
["剧情","为了终将逝去的明日","主线第一章第三幕，涉及虫潮后的爱秘城废墟、旧信与通讯魔石。"],
["系统","冒险者档案","角色资料包含个人信息、战斗数据、装备详情、天赋、契约物、背包等模块。"],
["系统","五星冒险者","冒险者档案使用一至五星的评级体系。"],
["系统","四天赋系统","四项天赋包含属性加成、固定效果及激活状态。"],
["游戏","星界契约","艾耶尔大陆卡牌游戏，包含契约者、进阶、支援及卡牌图鉴。"],
["游戏","星野生活","以像素地图与高清角色立绘结合的生活模拟 RPG。"]
].map((a,i)=>({id:i+1,category:a[0],title:a[1],body:a[2]}));
let current='全部',query='',favoritesOnly=false;const $=id=>document.getElementById(id);let favorites=new Set(JSON.parse(localStorage.getItem('ayerWikiFavorites')||'[]'));
function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function selectCategory(c){current=c;favoritesOnly=false;render()}
function showFavorites(){favoritesOnly=true;render()}
function toggleFavorite(id){favorites.has(id)?favorites.delete(id):favorites.add(id);localStorage.setItem('ayerWikiFavorites',JSON.stringify([...favorites]));openRecord(id)}
function openRecord(id){const e=records.find(x=>x.id===id);$('categories').innerHTML='<button onclick="render()">← 返回目录</button>';$('content').innerHTML='<article class="article"><span class="pill">'+esc(e.category)+'</span><h2>'+esc(e.title)+'</h2><p>'+esc(e.body)+'</p><p class="note">资料状态：初步收录，待逐条对照原始文档复核。</p><button class="action" onclick="toggleFavorite('+id+')">'+(favorites.has(id)?'★ 取消收藏':'☆ 加入收藏')+'</button></article>';window.scrollTo(0,0)}
function render(){const cats=['全部',...new Set(records.map(x=>x.category))];$('categories').innerHTML=cats.map(c=>'<button class="'+(!favoritesOnly&&current===c?'selected':'')+'" onclick="selectCategory(\''+c+'\')">'+c+'</button>').join('');let list=records.filter(e=>(favoritesOnly?favorites.has(e.id):(current==='全部'||current===e.category))&&(e.title+e.body+e.category).toLowerCase().includes(query.toLowerCase()));$('content').innerHTML='<h2>'+(favoritesOnly?'我的收藏':current==='全部'?'探索星界档案':esc(current)+'图鉴')+' <small>· '+list.length+' 条</small></h2>'+(list.length?'<section class="grid">'+list.map(e=>'<button class="card" onclick="openRecord('+e.id+')"><span class="pill">'+esc(e.category)+'</span><strong>'+esc(e.title)+'</strong><span>'+esc(e.body.slice(0,65))+'</span></button>').join('')+'</section>':'<p class="empty">没有找到相关条目</p>')}
$('search').addEventListener('input',e=>{query=e.target.value;render()});render();if('serviceWorker'in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});