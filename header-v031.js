/* v0.3.1 - display the global Wiki header on the homepage only */
(function(){
const globalHeader=document.querySelector('body > header');
if(!globalHeader)return;
function updateHeader(){
 const isHome=activeGroup==='首页'&&!favoritesOnly&&!query.trim()&&!document.querySelector('#content .article');
 globalHeader.hidden=!isHome;
 document.body.classList.toggle('wiki-inner-page',!isHome);
}
const renderBeforeHeader=render;
render=function(){renderBeforeHeader();updateHeader()};
const openBeforeHeader=openRecord;
openRecord=function(id){openBeforeHeader(id);updateHeader()};
const search=document.getElementById('search');
if(search)search.addEventListener('input',()=>requestAnimationFrame(updateHeader));
updateHeader();
})();