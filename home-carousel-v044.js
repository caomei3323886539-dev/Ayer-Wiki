/* Ayer Wiki v0.4.5 - rotating homepage features */
(function(){
const slides=[
{eyebrow:'SKY VALLEY · 神之谷',title:'神之谷 · 浮空岛群',detail:'高空一万米 · 二十座浮空岛',type:'sky',action:()=>{const r=records.find(x=>x.title==='神之谷');if(r)openRecord(r.id);else portalOpen('地区地图')}},
{eyebrow:'WORLD ARCHIVE · 世界设定',title:'探索艾耶尔大陆',detail:'世界起源、历史文明与十元素体系',type:'world',action:()=>portalOpen('世界设定')},
{eyebrow:'CALAMITY RECORD · 灾潮图鉴',title:'灾潮与黑蚀现象',detail:'查阅灾潮、虚骸与侵蚀相关档案',type:'calamity',action:()=>portalOpen('灾潮图鉴')}
];
const notices=[
{label:'资讯',text:'神之谷 · 二十座浮空岛资料导览',action:()=>portalOpen('地区地图')},
{label:'资讯',text:'世界设定 · 十元素与文明档案',action:()=>portalOpen('世界设定')},
{label:'资讯',text:'灾潮专题 · 黑蚀现象与灾兽档案',action:()=>portalOpen('灾潮图鉴')}
];
let index=0,noticeIndex=0,paused=false,startX=null,lastInteraction=0,noticeBusy=false;
window.ayerCarouselGo=function(i){
const next=(i+slides.length)%slides.length;
const root=document.getElementById('ayer-feature-carousel');
if(!root){index=next;return}
if(next===index)return;
const direction=(i>index?1:-1);
const oldSlide=root.querySelectorAll('.ayer-feature-slide')[index];
const newSlide=root.querySelectorAll('.ayer-feature-slide')[next];
root.querySelectorAll('.ayer-feature-slide').forEach((el,n)=>{if(n!==index&&n!==next){el.classList.remove('is-active','is-exiting','is-entering');el.style.removeProperty('--slide-offset')}});
newSlide.style.setProperty('--slide-offset',direction*100+'%');
newSlide.classList.add('is-entering');
newSlide.setAttribute('aria-hidden','false');
newSlide.getBoundingClientRect();
requestAnimationFrame(()=>{oldSlide.classList.remove('is-active');oldSlide.classList.add('is-exiting');oldSlide.style.setProperty('--slide-offset',-direction*100+'%');newSlide.classList.remove('is-entering');newSlide.classList.add('is-active')});
oldSlide.setAttribute('aria-hidden','true');
index=next;
root.querySelectorAll('.ayer-carousel-dot').forEach((el,n)=>el.classList.toggle('is-active',n===index));
lastInteraction=Date.now();
};
window.ayerCarouselStep=function(delta){ayerCarouselGo(index+delta)};
window.ayerCarouselOpen=function(i){slides[i].action()};
window.ayerNoticeOpen=function(i){notices[i].action()};
const oldLanding=portalLanding;
portalLanding=function(){
let html=oldLanding();
const slidesHtml=slides.map((s,i)=>'<div class="ayer-feature-slide ayer-slide-'+s.type+(i===index?' is-active':'')+'" aria-hidden="'+(i!==index)+'"><div class="ayer-slide-art" aria-hidden="true"><span class="ayer-art-ring"></span><span class="ayer-art-symbol">'+(s.type==='sky'?'✧':s.type==='world'?'✦':'◇')+'</span></div><div class="ayer-slide-copy"><span>'+s.eyebrow+'</span><strong>'+s.title+'</strong><small>'+s.detail+'</small><button type="button" onclick="ayerCarouselOpen('+i+')">探索专题　›</button></div></div>').join('');
const banner='<section id="ayer-feature-carousel" class="ayer-feature-carousel" aria-label="首页专题轮播"><div class="ayer-feature-stage">'+slidesHtml+'</div><button class="ayer-carousel-arrow prev" type="button" aria-label="上一张" onclick="ayerCarouselStep(-1)">‹</button><button class="ayer-carousel-arrow next" type="button" aria-label="下一张" onclick="ayerCarouselStep(1)">›</button><div class="ayer-carousel-dots">'+slides.map((_,i)=>'<button class="ayer-carousel-dot'+(i===index?' is-active':'')+'" type="button" aria-label="显示第'+(i+1)+'张专题" onclick="ayerCarouselGo('+i+')"></button>').join('')+'</div></section>';
html=html.replace(/<div class="portal-banner">[\s\S]*?<\/div>/,banner);
html=html.replace(/<section class="portal-announcement">[\s\S]*?<\/section>/,'<section class="portal-announcement ayer-rotating-notice"><span>资讯</span><p id="ayer-notice-text">'+notices[noticeIndex].text+'</p><button type="button" onclick="ayerNoticeOpen(window.ayerNoticeIndex||0)">查看 ›</button></section>');
return html;
};
window.ayerNoticeIndex=noticeIndex;
document.addEventListener('touchstart',e=>{if(e.target.closest('#ayer-feature-carousel')){startX=e.touches[0].clientX;paused=true}},{passive:true});
document.addEventListener('touchend',e=>{if(startX===null)return;const root=e.target.closest('#ayer-feature-carousel');if(root){const diff=e.changedTouches[0].clientX-startX;if(Math.abs(diff)>40)ayerCarouselStep(diff<0?1:-1)}startX=null;paused=false;lastInteraction=Date.now()},{passive:true});
document.addEventListener('touchcancel',()=>{startX=null;paused=false},{passive:true});
document.addEventListener('pointerenter',e=>{if(e.target.closest('#ayer-feature-carousel'))paused=true},true);
document.addEventListener('pointerleave',e=>{if(e.target.closest('#ayer-feature-carousel'))paused=false},true);
document.addEventListener('visibilitychange',()=>{paused=document.hidden});
setInterval(()=>{if(paused||document.hidden||Date.now()-lastInteraction<4500||!document.getElementById('ayer-feature-carousel')||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;ayerCarouselStep(1)},4800);
setInterval(()=>{const el=document.getElementById('ayer-notice-text');if(document.hidden||!el||noticeBusy||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;noticeBusy=true;el.classList.add('ayer-notice-leaving');setTimeout(()=>{noticeIndex=(noticeIndex+1)%notices.length;window.ayerNoticeIndex=noticeIndex;el.textContent=notices[noticeIndex].text;el.classList.remove('ayer-notice-leaving');el.classList.add('ayer-notice-entering');requestAnimationFrame(()=>requestAnimationFrame(()=>el.classList.remove('ayer-notice-entering')));setTimeout(()=>{noticeBusy=false},380)},220)},6500);
if(typeof render==='function')render();
})();
