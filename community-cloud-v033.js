/* Ayer Wiki v0.3.3: cloud community. Requires SQL schema and publishable key. */
(function(){
'use strict';
const configUrl=window.AYER_SUPABASE_URL||'';
const configKey=window.AYER_SUPABASE_PUBLISHABLE_KEY||'';
const ready=/^https:\/\/[a-z0-9-]+\.supabase\.co$/.test(configUrl)&&/^(sb_publishable_|eyJ)/.test(configKey)&&!!window.supabase;
let client=ready?window.supabase.createClient(configUrl,configKey):null;
let user=null,feed=[],comments={},likes=[],cloudError='',loaded=false,busy=false,authOpen=false,detailId=null;
const $=id=>document.getElementById(id);
const escText=v=>communityEscape(v==null?'':v);
const categories=['全部','世界讨论','人物交流','创作分享','建议反馈'];
const author=()=>String((mineRead().name||'星界旅人')).slice(0,24);
function fmt(date){return new Date(date).toLocaleString('zh-CN')}
function alertError(e){alert(e?.message||String(e))}
async function init(){
 if(!client)return;
 const {data}=await client.auth.getUser();user=data?.user||null;
 client.auth.onAuthStateChange((_event,session)=>{user=session?.user||null;if(activeGroup==='社区')render()});
 await load();
}
async function load(){
 if(!client)return;loaded=false;cloudError='';
 const {data,error}=await client.from('community_posts').select('id,user_id,author_name,title,body,category,created_at,updated_at').order('created_at',{ascending:false}).limit(100);
 if(error){cloudError=error.message}else{feed=data||[];const ids=feed.map(p=>p.id);comments={};likes=[];
 if(ids.length){const [cr,lr]=await Promise.all([client.from('community_comments').select('id,post_id,user_id,author_name,body,created_at').in('post_id',ids).order('created_at',{ascending:true}).limit(1000),client.from('community_likes').select('post_id,user_id').in('post_id',ids).limit(5000)]);if(cr.error)cloudError=cr.error.message;else for(const c of cr.data||[])(comments[c.post_id]??=[]).push(c);if(lr.error)cloudError=lr.error.message;else likes=lr.data||[]}}
 loaded=true;if(activeGroup==='社区')render();
}
function loginDialog(){authOpen=true;render();setTimeout(()=>{$('cloud-email')?.focus()},0)}
async function authSubmit(e){e.preventDefault();if(!client)return;const email=$('cloud-email').value.trim(),password=$('cloud-password').value,mode=$('cloud-auth-mode').value;if(!email||password.length<6){alert('请输入邮箱及至少 6 位密码');return}
 busy=true;const result=mode==='register'?await client.auth.signUp({email,password,options:{emailRedirectTo:location.origin+location.pathname}}):await client.auth.signInWithPassword({email,password});busy=false;
 if(result.error)return alertError(result.error);if(mode==='register'&&!result.data.session)alert('注册成功，请前往邮箱完成验证后再登录。');else{user=result.data.user;authOpen=false}render();
}
async function logout(){await client.auth.signOut();user=null;render()}
function compose(){if(!user)return loginDialog();communityCompose()}
async function publish(e){e.preventDefault();if(!user)return loginDialog();const title=$('community-title').value.trim(),body=$('community-body').value.trim(),category=$('community-category').value;
 if(title.length<2||body.length<2||title.length>70||body.length>3000)return alert('请检查标题和正文长度');
 const editId=$('community-edit-id')?.value||'';const payload={title,body,category,author_name:author()};busy=true;
 const result=editId?await client.from('community_posts').update(payload).eq('id',editId).eq('user_id',user.id):await client.from('community_posts').insert({...payload,user_id:user.id});
 busy=false;if(result.error)return alertError(result.error);await load();render();
}
async function removePost(id){if(!user||!confirm('确定删除自己的帖子吗？'))return;const r=await client.from('community_posts').delete().eq('id',id).eq('user_id',user.id);if(r.error)return alertError(r.error);detailId=null;await load()}
function editPost(id){const p=feed.find(x=>x.id===id);if(!p||p.user_id!==user?.id)return;communityCompose();$('community-title').value=p.title;$('community-body').value=p.body;$('community-category').value=p.category;$('community-edit-id').value=p.id}
async function likePost(id){if(!user)return loginDialog();const liked=likes.some(l=>l.post_id===id&&l.user_id===user.id);const r=liked?await client.from('community_likes').delete().eq('post_id',id).eq('user_id',user.id):await client.from('community_likes').insert({post_id:id,user_id:user.id});if(r.error)return alertError(r.error);await load()}
async function commentPost(e,id){e.preventDefault();if(!user)return loginDialog();const el=$('cloud-comment-'+id);const body=el.value.trim();if(!body||body.length>1000)return;const r=await client.from('community_comments').insert({post_id:id,user_id:user.id,author_name:author(),body});if(r.error)return alertError(r.error);await load()}
async function removeComment(id){if(!user||!confirm('删除自己的评论？'))return;const r=await client.from('community_comments').delete().eq('id',id).eq('user_id',user.id);if(r.error)return alertError(r.error);await load()}
function showPost(id){detailId=detailId===id?null:id;render()}
function postCard(p){const own=p.user_id===user?.id;const liked=likes.some(l=>l.post_id===p.id&&l.user_id===user?.id);const count=likes.filter(l=>l.post_id===p.id).length;const cs=comments[p.id]||[];
 return '<article class="community-post"><div class="community-post-meta"><span class="community-post-avatar">✦</span><div><strong>'+escText(p.author_name)+'</strong><small>'+fmt(p.created_at)+'</small></div><span class="community-post-category">'+escText(p.category)+'</span></div><h4>'+escText(p.title)+'</h4><p>'+escText(p.body).replace(/\n/g,'<br>')+'</p><div class="community-post-footer"><button onclick="ayerCloud.like(\''+p.id+'\')">'+(liked?'♥':'♡')+' '+count+'</button><button onclick="ayerCloud.show(\''+p.id+'\')">评论 '+cs.length+'</button>'+(own?'<button onclick="ayerCloud.edit(\''+p.id+'\')">编辑</button><button onclick="ayerCloud.remove(\''+p.id+'\')">删除</button>':'')+'</div>'+(detailId===p.id?'<section class="cloud-comments">'+cs.map(c=>'<div class="cloud-comment"><strong>'+escText(c.author_name)+'</strong><small>'+fmt(c.created_at)+'</small><p>'+escText(c.body).replace(/\n/g,'<br>')+'</p>'+(c.user_id===user?.id?'<button onclick="ayerCloud.removeComment(\''+c.id+'\')">删除</button>':'')+'</div>').join('')+(user?'<form onsubmit="ayerCloud.comment(event,\''+p.id+'\')"><label for="cloud-comment-'+p.id+'">发表评论</label><textarea id="cloud-comment-'+p.id+'" required maxlength="1000" rows="3" placeholder="文明交流，分享你的想法"></textarea><button type="submit">发送评论</button></form>':'<button onclick="ayerCloud.login()">登录后评论</button>')+'</section>':'')+'</article>'
}
function authModal(){return authOpen?'<div class="cloud-auth-overlay"><div class="cloud-auth"><button class="cloud-close" onclick="ayerCloud.closeLogin()" aria-label="关闭">×</button><h3>星界旅人账号</h3><p>使用邮箱注册或登录，帖子与评论将同步到云端。</p><form onsubmit="ayerCloud.auth(event)"><label>登录方式<select id="cloud-auth-mode"><option value="login">登录</option><option value="register">注册</option></select></label><label>邮箱<input type="email" id="cloud-email" required autocomplete="email"></label><label>密码<input type="password" id="cloud-password" required minlength="6" autocomplete="current-password"></label><button type="submit">继续</button></form></div></div>':''}
function page(){
 const selected=feed.filter(p=>communityTab==='全部'||p.category===communityTab);
 return '<section class="community-page"><div class="community-cover"><span>AIYER · COMMUNITY</span><h2>星界社区</h2><p>记录探索见闻，分享艾耶尔大陆的故事与创作。</p><div class="community-cover-bottom"><span>✦ 多人在线社区</span><span>公开帖子 · '+feed.length+' 篇</span></div></div><div class="community-toolbar"><div><small>COMMUNITY FEED</small><h3>旅人动态</h3></div><button onclick="ayerCloud.compose()">＋ 发布帖子</button></div><div class="cloud-account">'+(user?'已登录：'+escText(user.email)+' <button onclick="ayerCloud.logout()">退出登录</button>':'<span>浏览公开帖子无需登录</span><button onclick="ayerCloud.login()">登录 / 注册</button>')+'</div>'+(cloudError?'<div class="community-notice">云端读取失败：'+escText(cloudError)+'</div>':'')+'<div class="community-tabs">'+categories.map(t=>'<button class="'+(communityTab===t?'active':'')+'" onclick="communitySwitch(\''+t+'\')">'+t+'</button>').join('')+'</div><div class="community-feed">'+(!loaded?'<div class="community-empty">正在加载云端帖子……</div>':selected.length?selected.map(postCard).join(''):'<div class="community-empty"><h4>还没有公开帖子</h4><p>登录后发布第一篇吧。</p></div>')+'</div><div class="cloud-refresh"><button onclick="ayerCloud.refresh()">刷新动态</button></div><section class="community-compose" id="community-compose" hidden><div class="community-compose-head"><h3>发布 / 编辑帖子</h3><button type="button" onclick="communityCancel()" aria-label="关闭">×</button></div><form onsubmit="ayerCloud.publish(event)"><input id="community-edit-id" type="hidden"><label>帖子标题<input id="community-title" maxlength="70" required placeholder="给帖子起个标题"></label><label>讨论分类<select id="community-category"><option>世界讨论</option><option>人物交流</option><option>创作分享</option><option>建议反馈</option></select></label><label>帖子正文<textarea id="community-body" rows="7" maxlength="3000" required placeholder="分享你的想法……"></textarea></label><button class="community-submit" type="submit">保存到云端</button></form></section></section>'+authModal()
}
window.ayerCloud={login:loginDialog,closeLogin(){authOpen=false;render()},auth:authSubmit,logout,compose,publish,remove:removePost,edit:editPost,like:likePost,comment:commentPost,removeComment,show:showPost,refresh:load,enabled:ready,page,getUser:()=>user,getPosts:()=>feed.slice(),getLikes:()=>likes.slice(),getComments:()=>comments};
if(!ready)return;
const previous=render;render=function(){if(activeGroup==='社区'){$p('categories').style.display='none';$p('content').innerHTML=page();document.body.classList.add('portal-v023','wiki-inner-page');document.body.classList.remove('portal-home');const h=document.querySelector('body>header');if(h)h.hidden=true;syncBottomNavigation()}else previous()};
const previousSwitch=communitySwitch;communitySwitch=function(tab){communityTab=tab;render()};
init();
})();
