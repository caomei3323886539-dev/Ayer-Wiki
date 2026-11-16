/* Ayer Wiki v0.3.6 — illustrated traveler center, no new database tables */
(function(){
'use strict';
const cloud=window.ayerCloud;
if(!cloud||typeof minePage!=='function')return;
const safe=v=>escapePortal(String(v==null?'':v));
const svg=(name)=>({
book:'<path d="M4 5.5c3-1.2 5.5-.9 8 1v13c-2.5-1.9-5-2.2-8-1V5.5Zm16 0c-3-1.2-5.5-.9-8 1v13c2.5-1.9 5-2.2 8-1V5.5Z"/>',
map:'<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Zm6-3v15m6-12v15"/>',
spark:'<path d="m12 2 2.3 7.7L22 12l-7.7 2.3L12 22l-2.3-7.7L2 12l7.7-2.3L12 2Z"/>',
heart:'<path d="M20.8 8.2c0 5-8.8 11-8.8 11s-8.8-6-8.8-11a4.8 4.8 0 0 1 8.8-2.4 4.8 4.8 0 0 1 8.8 2.4Z"/>',
pen:'<path d="m4 20 4.5-1 11-11-3.5-3.5-11 11L4 20Zm10-13 3.5 3.5"/>',
scroll:'<path d="M7 4h12v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 6 0v10a3 3 0 0 1-6 0m6-10h6m-6 4h6"/>'
})[name]||'';
const icon=n=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+svg(n)+'</svg>';
const previous=minePage;
minePage=function(){
 const p=mineRead(),user=cloud.getUser?.(),posts=cloud.getPosts?.()||[],likes=cloud.getLikes?.()||[];
 const own=user?posts.filter(post=>post.user_id===user.id):[];
 const received=own.reduce((sum,post)=>sum+likes.filter(l=>l.post_id===post.id).length,0);
 const saved=records.filter(e=>isWikiWorldEntry(e)&&favorites.has(e.id));
 const name=safe(p.name||'星界旅人'),note=safe(p.note||'记录艾耶尔大陆的每一段旅程。');
 const avatar='<svg viewBox="0 0 110 110" role="img" aria-label="旅人默认头像"><defs><linearGradient id="ayerAvatarSky" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#d5edff"/></linearGradient></defs><circle cx="55" cy="55" r="53" fill="url(#ayerAvatarSky)"/><path d="M16 96Q20 68 55 68T94 96" fill="#91b9dd"/><path d="M31 100V82l12-11 12 8 12-8 12 11v18" fill="#f7fbff"/><ellipse cx="55" cy="52" rx="23" ry="27" fill="#f9e4da"/><path d="M29 53Q24 14 55 17q34-3 27 39l-10-21-29-6z" fill="#a6bddd"/><path d="m43 17 12-13 12 13-12 7Z" fill="#f4dca1"/><path d="M45 53h4m12 0h4" stroke="#6b7d9c" stroke-width="2" stroke-linecap="round"/><path d="M51 63q4 3 8 0" fill="none" stroke="#d28f99" stroke-width="2" stroke-linecap="round"/></svg>';
 const stats=[{n:own.length,t:'我的帖子',i:'scroll',a:"mineSwitch('我的帖子')"},{n:received,t:'收到点赞',i:'heart',a:"mineSwitch('我的帖子')"},{n:saved.length,t:'百科收藏',i:'book',a:"mineSwitch('收藏')"}];
 const tabs=['我的帖子','收藏','最近阅读','我的档案'];
 let list='';
 if(mineTab==='我的帖子'){
  list=user?(own.length?own.map(post=>'<button class="mine-saved mine-v36-entry" onclick="communityOpen();ayerCloud.show(\''+post.id+'\')"><span class="mine-entry-icon">'+icon('scroll')+'</span><strong>'+safe(post.title)+'</strong><small>'+new Date(post.created_at).toLocaleDateString('zh-CN')+'</small><span>›</span></button>').join(''):'<div class="mine-v36-empty">'+icon('pen')+'<strong>还没有发布的帖子</strong><p>在社区分享你对艾耶尔大陆的探索和创作。</p><button onclick="communityOpen()">去社区发帖</button></div>'):'<div class="mine-v36-empty">'+icon('spark')+'<strong>登录后查看个人动态</strong><p>注册或登录旅人账号，即可查看你的云端帖子。</p><button onclick="communityOpen();ayerCloud.login()">登录 / 注册</button></div>';
 }else if(mineTab==='收藏'){
  list=saved.length?saved.map(e=>'<button class="mine-saved mine-v36-entry" onclick="openRecord('+e.id+')"><span class="mine-entry-icon">'+icon('book')+'</span><strong>'+safe(e.title)+'</strong><small>'+safe(e.category)+'</small><span>›</span></button>').join(''):'<div class="mine-v36-empty">'+icon('book')+'<strong>收藏夹还是空的</strong><p>将喜欢的百科条目加入收藏，随时重温。</p><button onclick="portalOpen(\'全部档案\')">探索百科</button></div>';
 }else if(mineTab==='最近阅读'){
  list='<div class="mine-v36-empty">'+icon('scroll')+'<strong>阅读记录暂未启用</strong><p>目前不会记录你的浏览历史。</p></div>';
 }else{
  list='<div class="mine-v36-empty">'+icon('pen')+'<strong>编辑旅人档案</strong><p>昵称和签名暂时仅保存在本设备；社区登录账号由 Supabase 管理。</p><button onclick="mineEdit()">编辑昵称与签名</button></div>';
 }
 const panel='<section class="mine-page mine-v36">'+
 '<div class="mine-v36-hero"><div class="mine-v36-sky"><span class="mine-v36-ring ring-a"></span><span class="mine-v36-ring ring-b"></span><span class="mine-v36-star star-a">✧</span><span class="mine-v36-star star-b">✦</span><span class="mine-v36-star star-c">✧</span></div>'+
 '<div class="mine-v36-overline"><span>✧ AIYER CONTINENT</span><span>TRAVELER CARD · 036</span></div>'+
 '<div class="mine-v36-identity"><div class="mine-v36-avatar">'+avatar+'<span class="mine-v36-avatar-star">✦</span></div><div class="mine-v36-user"><div class="mine-v36-label">旅人档案 <span>· TRAVELER</span></div><div class="mine-v36-name"><h2>'+name+'</h2><button onclick="mineEdit()" aria-label="编辑旅人资料">'+icon('pen')+'</button></div><div class="mine-v36-status"><span class="'+(user?'online':'')+'">'+(user?'● 云端已登录':'○ 尚未登录')+'</span></div></div></div>'+
 '<p class="mine-v36-signature">'+note+'</p><div class="mine-v36-tags"><span>✦ 世界探索者</span><span>◇ 艾耶尔旅人</span></div><div class="mine-profile-edit" hidden></div>'+
 '<div class="mine-v36-cloud"><span>'+icon('spark')+' 旅人账号</span><strong>'+(user?safe(user.email):'登录后开启云端旅程')+'</strong><button onclick="'+(user?'ayerCloud.logout();render()':'communityOpen();ayerCloud.login()')+'">'+(user?'退出登录':'登录 / 注册')+' ›</button></div></div>'+
 '<div class="mine-v36-main"><div class="mine-v36-section-title"><div><span>TRAVELER RECORDS</span><h3>旅人足迹</h3></div><span>✦</span></div>'+
 '<div class="mine-v36-stats">'+stats.map(x=>'<button onclick="'+x.a+'"><span class="mine-v36-stat-icon">'+icon(x.i)+'</span><strong>'+x.n+'</strong><small>'+x.t+'</small></button>').join('')+'</div>'+
 '<div class="mine-v36-section-title"><div><span>QUICK ACCESS</span><h3>探索入口</h3></div></div>'+
 '<div class="mine-v36-shortcuts"><button onclick="portalOpen(\'全部档案\')"><span class="blue">'+icon('book')+'</span><strong>百科目录</strong><small>查看世界档案</small></button><button onclick="portalOpen(\'世界设定\')"><span class="gold">'+icon('spark')+'</span><strong>世界设定</strong><small>探索大陆起源</small></button><button onclick="portalOpen(\'地区地图\')"><span class="teal">'+icon('map')+'</span><strong>地区地图</strong><small>发现未知地区</small></button></div>'+
 '<div class="mine-v36-section-title mine-v36-content-heading"><div><span>PERSONAL ARCHIVE</span><h3>个人内容</h3></div></div>'+
 '<div class="mine-v36-tabs" role="tablist" aria-label="个人内容分类">'+tabs.map(t=>'<button role="tab" aria-selected="'+(mineTab===t)+'" class="'+(mineTab===t?'active':'')+'" onclick="mineSwitch(\''+t+'\')">'+t+'</button>').join('')+'</div>'+
 '<div class="mine-v36-list">'+list+'</div><p class="mine-v36-note">帖子与点赞来自已加载的最近 100 篇社区帖子；百科收藏、昵称和签名仅保存在本设备。</p></div></section>';
 return panel;
};
const oldEdit=mineEdit;
mineEdit=function(){oldEdit();const b=document.querySelector('.mine-edit-actions button');if(b)b.textContent='保存本机资料'};
render();
})();
