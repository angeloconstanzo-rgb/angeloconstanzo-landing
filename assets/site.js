document.addEventListener('DOMContentLoaded',()=>{

/* ── Cursor dorado (solo desktop) ── */
const isMobile=window.matchMedia('(max-width:760px)').matches;
if(!isMobile){
  const cur=document.createElement('div');cur.id='cursor';
  const ring=document.createElement('div');ring.id='cursor-ring';
  document.body.appendChild(ring);document.body.appendChild(cur);
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cur.style.left=mx+'px';cur.style.top=my+'px'});
  (function tick(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;ring.style.left=Math.round(rx)+'px';ring.style.top=Math.round(ry)+'px';requestAnimationFrame(tick)})();
  document.querySelectorAll('a,button,.btn,.card,.social-link').forEach(el=>{
    el.addEventListener('mouseenter',()=>{cur.classList.add('hover');ring.classList.add('hover')});
    el.addEventListener('mouseleave',()=>{cur.classList.remove('hover');ring.classList.remove('hover')});
  });
}

/* ── Nav scroll ── */
const n=document.querySelector('.nav');
const onScroll=()=>{if(n){if(window.scrollY>20)n.classList.add('scrolled');else n.classList.remove('scrolled')}};
onScroll();window.addEventListener('scroll',onScroll,{passive:true});

/* ── Reveal ── */
const r=document.querySelectorAll('.reveal');
const ro=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('visible')})},{threshold:.1,rootMargin:'0px 0px -40px 0px'});
r.forEach(el=>ro.observe(el));

/* ── Counters con easing suave ── */
const c=document.querySelectorAll('.counter');
const co=new IntersectionObserver(e=>{e.forEach(x=>{if(!x.isIntersecting)return;const el=x.target;const t=parseInt(el.dataset.target||'0',10);const dur=1400;const start=performance.now();const ease=p=>1-Math.pow(1-p,3);(function tick(now){const p=Math.min((now-start)/dur,1);el.textContent=Math.floor(ease(p)*t)+'+';if(p<1)requestAnimationFrame(tick);else el.textContent=t+'+';})(start);co.unobserve(el)})},{threshold:.5});
c.forEach(el=>co.observe(el));

/* ── Parallax cards ── */
document.querySelectorAll('[data-parallax]').forEach(card=>{
  card.addEventListener('mousemove',e=>{const rect=card.getBoundingClientRect();const x=(e.clientX-rect.left)/rect.width;const y=(e.clientY-rect.top)/rect.height;const rx=(0.5-y)*8;const ry=(x-0.5)*8;card.style.transform=`perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-2px)`});
  card.addEventListener('mouseleave',()=>{card.style.transform=''});
});

/* ── Carousels ── */
document.querySelectorAll('[data-carousel]').forEach(carousel=>{
  const track=carousel.querySelector('.authority-track');if(!track)return;
  const step=()=>Math.min(track.clientWidth*.86,360);
  carousel.parentElement?.querySelector('[data-prev]')?.addEventListener('click',()=>track.scrollBy({left:-step(),behavior:'smooth'}));
  carousel.parentElement?.querySelector('[data-next]')?.addEventListener('click',()=>track.scrollBy({left:step(),behavior:'smooth'}));
});

});