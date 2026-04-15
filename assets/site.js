const SITE_ROOT=(document.body&&document.body.dataset&&document.body.dataset.root)||'';
const toSite=(p)=>{ if(!p) return SITE_ROOT||'./'; if(/^https?:/.test(p)) return p; if(location.protocol==='file:'){ return SITE_ROOT + p.replace(/^\//,''); } return '/' + p.replace(/^\//,''); };
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
  const hoverSel='a,button,.btn,.card,.social-link,.option-btn,input,textarea,select,label,[role=button],summary';
  document.addEventListener('mouseover',e=>{if(e.target.closest(hoverSel)){cur.classList.add('hover');ring.classList.add('hover')}});
  document.addEventListener('mouseout',e=>{if(e.target.closest(hoverSel)){cur.classList.remove('hover');ring.classList.remove('hover')}});
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

  document.querySelectorAll('.company-toggle').forEach(btn=>btn.addEventListener('click',()=>{
    const target=document.getElementById(btn.dataset.target);
    if(!target) return;
    const isOpen=target.classList.contains('open');
    document.querySelectorAll('.company-expand.open').forEach(el=>el.classList.remove('open'));
    document.querySelectorAll('.company-toggle.active').forEach(el=>el.classList.remove('active'));
    if(!isOpen){ target.classList.add('open'); btn.classList.add('active'); }
  }));

});

/* --- v12 interactions --- */
(function(){
  const openModal=(id)=>{const modal=document.getElementById(id);if(modal){modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';}};
  const closeModal=(modal)=>{if(modal){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';}};
  document.querySelectorAll('[data-modal-target]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.getAttribute('data-modal-target'))));
  document.querySelectorAll('[data-modal-close]').forEach(el=>el.addEventListener('click',()=>closeModal(el.closest('.modal-shell'))));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-shell.open').forEach(closeModal);}});

  const doneField=document.getElementById('bg-done');
  const fields=document.getElementById('betagymFormFields');
  const gate=document.getElementById('betagymGateMessage');
  const syncGate=()=>{if(!doneField||!fields||!gate)return; if(doneField.value==='no'){fields.classList.add('hidden'); gate.classList.add('active');} else {fields.classList.remove('hidden'); gate.classList.remove('active');}};
  if(doneField){doneField.addEventListener('change',()=>{if(doneField.value==='no'){window.location.href=toSite('betascan/?next=betagym');return;} syncGate();});syncGate();}

  const appForm=document.getElementById('betagymApplicationForm');
  if(appForm){const stored = localStorage.getItem('betascan_result'); if(stored){try{const parsed=JSON.parse(stored); const resultField=document.getElementById('bg-betascan'); if(resultField && parsed.profile){resultField.value=`${parsed.profile} · Índice ${parsed.index}%`; } if(doneField && parsed.completed){doneField.value='si'; syncGate();}}catch(e){}} appForm.addEventListener('submit',function(e){e.preventDefault(); if(doneField && doneField.value==='no'){window.location.href=toSite('betascan/?next=betagym'); return;} const existing=appForm.querySelector('.form-success'); if(existing) existing.remove(); const success=document.createElement('div'); success.className='form-success'; success.innerHTML='Tu postulación quedó montada en esta versión de revisión. El siguiente paso será conectar el envío real al sistema que definas, sin exponer credenciales en el front.'; appForm.appendChild(success);});}

  const betascanShell=document.getElementById('betascanShell');
  const launchIntroBtn=document.getElementById('launchIntroBtn');
  const backToHeroBtn=document.getElementById('backToHeroBtn');
  const startLeadForm=document.getElementById('betascanLeadStart');
  if(betascanShell && launchIntroBtn){
    const openFlow=()=>{
      document.body.classList.add('betascan-flow-mode');
      betascanShell.classList.add('flow-open');
      document.querySelectorAll('#betascanShell .betascan-stage').forEach(el=>el.classList.remove('active'));
      const intro=document.getElementById('stageIntro');
      if(intro) intro.classList.add('active');
      history.replaceState(null,'',location.pathname+'#diagnostico');
      requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}));
    };
    launchIntroBtn.addEventListener('click',e=>{e.preventDefault(); openFlow();});
    backToHeroBtn?.addEventListener('click',()=>{
      document.body.classList.remove('betascan-flow-mode');
      betascanShell.classList.remove('flow-open');
      history.replaceState(null,'',location.pathname);
      requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'auto'}));
    });
    if(location.hash==='#diagnostico'){ openFlow(); }
  }
})();

(function(){const rot=document.querySelector('.home-photo-rotator'); if(!rot) return; const imgs=[...rot.querySelectorAll('img')]; let i=0; setInterval(()=>{imgs[i].classList.remove('active'); i=(i+1)%imgs.length; imgs[i].classList.add('active');}, 2600);})();

/* v37 dialog support */
(function(){
  document.querySelectorAll('[data-dialog-target]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const dlg=document.getElementById(btn.dataset.dialogTarget);
      if(dlg && typeof dlg.showModal==='function') dlg.showModal();
    });
  });
  document.querySelectorAll('[data-dialog-close]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const dlg=btn.closest('dialog'); if(dlg) dlg.close();
    });
  });
  document.querySelectorAll('dialog.case-dialog').forEach(dlg=>{
    dlg.addEventListener('click',e=>{ const rect=dlg.getBoundingClientRect(); const inside=e.clientX>=rect.left&&e.clientX<=rect.right&&e.clientY>=rect.top&&e.clientY<=rect.bottom; if(!inside) dlg.close(); });
  });
})();

/* FIX dialogs */
document.querySelectorAll('dialog.case-dialog').forEach(dlg=>{
  dlg.addEventListener('click',e=>{
    const rect = dlg.getBoundingClientRect();
    const inside = (e.clientX >= rect.left && e.clientX <= rect.right &&
                    e.clientY >= rect.top && e.clientY <= rect.bottom);
    if(!inside) dlg.close();
  });
});
document.querySelectorAll('.case-dialog-close').forEach(btn=>{
  btn.addEventListener('click', e=>{
    const dlg = btn.closest('dialog');
    if(dlg) dlg.close();
  });
});


/* Company case slider */
document.querySelectorAll('[data-case-slider]').forEach(slider=>{
  const slides = Array.from(slider.querySelectorAll('[data-slide]'));
  const dotsWrap = slider.parentElement.querySelector('[data-case-dots]');
  const dots = dotsWrap ? Array.from(dotsWrap.querySelectorAll('button')) : [];
  const prev = slider.querySelector('.case-slider-nav.prev');
  const next = slider.querySelector('.case-slider-nav.next');
  if(!slides.length) return;
  let current = 0;
  const render = ()=>{
    slides.forEach((s,i)=>s.classList.toggle('is-active', i===current));
    dots.forEach((d,i)=>d.classList.toggle('is-active', i===current));
  };
  prev && prev.addEventListener('click', ()=>{ current = (current-1+slides.length)%slides.length; render(); });
  next && next.addEventListener('click', ()=>{ current = (current+1)%slides.length; render(); });
  dots.forEach((d,i)=>d.addEventListener('click', ()=>{ current=i; render(); }));
  render();
});

/* ===== v42 mobile UX ===== */

/* ── Hamburger nav ── */
(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return;

  /* Inject hamburger button */
  const ham = document.createElement('button');
  ham.className = 'nav-hamburger';
  ham.setAttribute('aria-label','Abrir menú');
  ham.setAttribute('aria-expanded','false');
  ham.innerHTML = '<span></span><span></span><span></span>';
  nav.querySelector('.nav-inner').appendChild(ham);

  /* Build drawer */
  const drawer = document.createElement('div');
  drawer.className = 'nav-drawer';
  drawer.setAttribute('aria-hidden','true');
  drawer.innerHTML = `
    <div class="nav-drawer-backdrop"></div>
    <nav class="nav-drawer-panel" role="dialog" aria-modal="true" aria-label="Menú de navegación">
      <div class="nav-drawer-cta">
        <a class="btn btn-gold" href="https://wa.link/zyw1c4" target="_blank" rel="noopener noreferrer">Hablemos</a>
      </div>
    </nav>`;
  document.body.appendChild(drawer);

  /* Clone nav links into drawer */
  const links = document.querySelectorAll('.nav-links a');
  const panel = drawer.querySelector('.nav-drawer-panel');
  const ctaBlock = drawer.querySelector('.nav-drawer-cta');
  links.forEach(link => {
    const a = link.cloneNode(true);
    panel.insertBefore(a, ctaBlock);
  });

  const open = () => {
    ham.classList.add('open');
    ham.setAttribute('aria-expanded','true');
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    ham.classList.remove('open');
    ham.setAttribute('aria-expanded','false');
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  };

  ham.addEventListener('click', () => ham.classList.contains('open') ? close() : open());
  drawer.querySelector('.nav-drawer-backdrop').addEventListener('click', close);
  drawer.querySelectorAll('.nav-drawer-panel a').forEach(a => a.addEventListener('click', close));
  document.addEventListener('keydown', e => { if(e.key === 'Escape') close(); });
})();

/* ── Carousel dots ── */
(function(){
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('.authority-track');
    if(!track) return;

    /* Build dots container */
    const dotsWrap = document.createElement('div');
    dotsWrap.className = 'carousel-dots';
    const slides = carousel.querySelectorAll('.authority-slide');
    const dots = [];
    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Slide ${i+1}`);
      dotsWrap.appendChild(d);
      dots.push(d);
    });
    carousel.parentElement.appendChild(dotsWrap);

    /* Update dots on scroll */
    let ticking = false;
    track.addEventListener('scroll', () => {
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const slideWidth = track.querySelector('.authority-slide')?.offsetWidth || 1;
        const idx = Math.round(track.scrollLeft / (slideWidth + 12));
        dots.forEach((d,i) => d.classList.toggle('active', i === idx));
        ticking = false;
      });
    }, {passive: true});

    /* Click dots to scroll */
    dots.forEach((d, i) => {
      d.addEventListener('click', () => {
        const slideWidth = track.querySelector('.authority-slide')?.offsetWidth || 0;
        track.scrollTo({left: i * (slideWidth + 12), behavior: 'smooth'});
      });
    });
  });
})();

/* ── WhatsApp FAB ── */
(function(){
  if(window.matchMedia('(min-width:761px)').matches) return;

  const waUrl = (document.body.dataset.waPersonal || 'https://wa.link/zyw1c4');

  const fab = document.createElement('a');
  fab.className = 'wa-fab';
  fab.href = waUrl;
  fab.target = '_blank';
  fab.rel = 'noopener noreferrer';
  fab.setAttribute('aria-label','Abrir WhatsApp');
  fab.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>Hablemos`;
  document.body.appendChild(fab);

  /* Hide FAB when user is inside a form */
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach(el => {
    el.addEventListener('focus', () => fab.classList.add('hidden'));
    el.addEventListener('blur', () => fab.classList.remove('hidden'));
  });

  /* Hide FAB when nav drawer is open */
  const drawer = document.querySelector('.nav-drawer');
  if(drawer) {
    const obs = new MutationObserver(() => {
      fab.classList.toggle('hidden', drawer.classList.contains('open'));
    });
    obs.observe(drawer, {attributes: true, attributeFilter: ['class']});
  }
})();

/* ── Swipe para sliders de casos en mobile ── */
(function(){
  if(window.matchMedia('(min-width:769px)').matches) return;
  document.querySelectorAll('[data-case-slider]').forEach(slider => {
    let startX = 0;
    slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      if(Math.abs(dx) < 40) return;
      const btn = dx < 0
        ? slider.querySelector('.case-slider-nav.next')
        : slider.querySelector('.case-slider-nav.prev');
      btn && btn.click();
    }, {passive:true});
  });
})();


/* ── Swipe fix: attach to viewport, not full slider ── */
(function(){
  if(window.matchMedia('(min-width:769px)').matches) return;
  document.querySelectorAll('.case-slider-viewport').forEach(vp => {
    let startX = 0, startY = 0;
    vp.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, {passive:true});
    vp.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const dy = e.changedTouches[0].clientY - startY;
      if(Math.abs(dx) < 44 || Math.abs(dy) > Math.abs(dx)) return;
      const slider = vp.closest('[data-case-slider]');
      if(!slider) return;
      const btn = dx < 0
        ? slider.querySelector('.case-slider-nav.next')
        : slider.querySelector('.case-slider-nav.prev');
      btn && btn.click();
    }, {passive:true});
  });
})();

// ── Hero photo rotator — todas las páginas ──
(function(){
  var rotators = document.querySelectorAll('.hero-photo-rotator');
  rotators.forEach(function(rot){
    var imgs = rot.querySelectorAll('img');
    if(imgs.length < 2) return;
    var cur = 0;
    setInterval(function(){
      imgs[cur].classList.remove('active');
      cur = (cur + 1) % imgs.length;
      imgs[cur].classList.add('active');
    }, 4000);
  });
})();
