/* v0.3.5: cloud personal hub and celebratory like animation */
(function(){
'use strict';
const cloud=window.ayerCloud;if(!cloud)return;
const originalLike=cloud.like;
const inflight=new Set();
cloud.like=async function(id){
 const user=cloud.getUser?.();
 if(!user)return originalLike(id);
 if(inflight.has(id))return;
 const already=cloud.getLikes().some(l=>l.post_id===id&&l.user_id===user.id);
 const btn=Array.from(document.querySelectorAll('.community-post-footer button')).find(b=>b.getAttribute('onclick')==="ayerCloud.like('"+id+"')");
 if(btn&&!already){
  btn.classList.remove('ayer-liked-burst');void btn.offsetWidth;btn.classList.add('ayer-liked-burst');
  const rect=btn.getBoundingClientRect();
  const fx=document.createElement('div');fx.className='ayer-like-particles';fx.setAttribute('aria-hidden','true');
  fx.style.left=(rect.left+Math.min(rect.width/2,28))+'px';fx.style.top=(rect.top+rect.height/2)+'px';
  for(let i=0;i<7;i++){const particle=document.createElement('span');particle.textContent=i%2?'✦':'♥';particle.style.setProperty('--angle',String(i*360/7)+'deg');particle.style.setProperty('--dist',(28+(i%3)*9)+'px');fx.appendChild(particle)}
  document.body.appendChild(fx);setTimeout(()=>fx.remove(),850);
 }
 inflight.add(id);
 try{await originalLike(id)}finally{inflight.delete(id)}
};
const originalMine=minePage;
minePage=function(){
 let html=originalMine();
 const user=cloud.getUser?.(),posts=cloud.getPosts?.()||[],likes=cloud.getLikes?.()||[];
 const own=user?posts.filter(p=>p.user_id===user.id):[];
 const totalLikes=own.reduce((n,p)=>n+likes.filter(l=>l.post_id===p.id).length,0);
 const username=user?(user.email||'已登录旅人'):'尚未登录';
 const stats='<div class="mine-cloud-hub"><div class="mine-cloud-title"><span>✦ 云端旅人身份</span><span class="mine-cloud-status '+(user?'connected':'')+'">'+(user?'● 已连接':'○ 未登录')+'</span></div><p class="mine-cloud-email">'+escapePortal(username)+'</p><div class="mine-cloud-numbers"><div><strong>'+own.length+'</strong><span>我的帖子（最近100篇内）</span></div><div><strong>'+totalLikes+'</strong><span>获得点赞（最近100篇内）</span></div></div><div class="mine-cloud-actions">'+(user?'<button onclick="mineSwitch(\'我的帖子\')">查看我的帖子</button><button onclick="ayerCloud.logout();render()">退出登录</button>':'<button onclick="communityOpen();ayerCloud.login()">登录 / 注册</button>')+'</div></div>';
 html=html.replace('<div class="mine-surface">',stats+'<div class="mine-surface">');
 html=html.replace('<div class="mine-tabbar">','<div class="mine-tabbar">');
 html=html.replace(/<div class="mine-tabbar">([\s\S]*?)<\/div><div class="mine-tab-content">/,function(full,inner){return '<div class="mine-tabbar">'+inner.replace('</button>','</button>')+'<button class="'+(mineTab==='我的帖子'?'active':'')+'" onclick="mineSwitch(\'我的帖子\')">我的帖子</button></div><div class="mine-tab-content">'});
 if(mineTab==='我的帖子'){
  const cards=user?(own.length?own.map(p=>'<button class="mine-saved" onclick="communityOpen();ayerCloud.show(\''+p.id+'\')"><span>✎</span><strong>'+escapePortal(p.title)+'</strong><small>'+new Date(p.created_at).toLocaleDateString('zh-CN')+'</small><span>›</span></button>').join(''):'<div class="mine-empty"><strong>暂时没有云端帖子</strong><p>你可以在社区中发布第一篇帖子。</p><button onclick="communityOpen()">前往社区</button></div>'):'<div class="mine-empty"><strong>请先登录</strong><p>登录后可查看自己的公开帖子。</p><button onclick="communityOpen();ayerCloud.login()">前往登录</button></div>';
  html=html.replace(/(<div class="mine-tab-content">)[\s\S]*?(<\/div><p class="mine-privacy">)/,'$1'+cards+'$2');
 }
 html=html.replace('账号登录、云端同步及公开发布尚未开放。','社区账号已经开放；本机昵称与签名暂未同步到云端。');
 html=html.replace('个人资料仅保存在此设备浏览器中，不会上传到 GitHub 或公开展示。','本机昵称和签名仍仅保存在当前设备；社区帖子及评论公开显示，账号邮箱仅用于登录。');
 return html;
};
const previousRender=render;
render=function(){previousRender();if(activeGroup==='我的'){const h=document.querySelector('body>header');if(h)h.hidden=true;document.body.classList.add('wiki-inner-page')}};
const oldRefresh=cloud.refresh;
cloud.refresh=async function(){await oldRefresh();if(activeGroup==='我的')render()};
const oldLogout=cloud.logout;
cloud.logout=async function(){await oldLogout();if(activeGroup==='我的')render()};
const oldAuth=cloud.auth;
cloud.auth=async function(e){await oldAuth(e);if(activeGroup==='我的')render()};
render();
})();
