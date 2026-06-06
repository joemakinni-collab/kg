// Loader
window.addEventListener('load',()=>{setTimeout(()=>document.querySelector('.loader')?.classList.add('gone'),500)});

// Page transitions — show loader when navigating between pages
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a)return;
  const href=a.getAttribute('href');
  if(!href||href.startsWith('#')||href.startsWith('http')||href.startsWith('//')||href.startsWith('javascript:')||a.hasAttribute('download')||a.hasAttribute('target'))return;
  e.preventDefault();
  const loader=document.querySelector('.loader');
  if(loader){
    loader.classList.remove('gone');
    loader.querySelector('.loader-logo')?.style.setProperty('animation','none');
    loader.offsetHeight;
    loader.querySelector('.loader-logo')?.style.removeProperty('animation');
  }
  setTimeout(()=>{window.location.href=href},400);
});

// Year
document.getElementById('yr') && (document.getElementById('yr').textContent=new Date().getFullYear());

// Nav scroll
const nav=document.querySelector('.kg-nav');
window.addEventListener('scroll',()=>{
  nav?.classList.toggle('scrolled',window.scrollY>30);
  const sp=document.querySelector('.scroll-progress');
  if(sp){const h=document.documentElement.scrollHeight-window.innerHeight;sp.style.width=(window.scrollY/h*100)+'%'}
});

// Mobile menu
const burger=document.querySelector('.burger');
const mm=document.querySelector('.mobile-menu');
burger?.addEventListener('click',()=>{burger.classList.toggle('open');mm?.classList.toggle('open')});
mm?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.classList.remove('open');mm.classList.remove('open')}));

// Cursor glow
const glow=document.querySelector('.cursor-glow');
document.addEventListener('mousemove',e=>{if(glow){glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'}});

// AOS
AOS.init({duration:900,easing:'ease-out-cubic',once:true,offset:80});

// Home gallery swiper
if(document.querySelector('.home-gallery-swiper')){
  new Swiper('.home-gallery-swiper',{loop:true,effect:'coverflow',centeredSlides:true,slidesPerView:1.1,spaceBetween:16,grabCursor:true,speed:12000,easing:'linear',autoplay:{delay:0,disableOnInteraction:false,waitForTransition:true},pagination:{el:'.swiper-pagination',clickable:true},breakpoints:{768:{slidesPerView:1.5,spaceBetween:20},1024:{slidesPerView:2.2,spaceBetween:24}}});
}
if(document.querySelector('.testi-swiper')){
  new Swiper('.testi-swiper',{slidesPerView:1,spaceBetween:30,loop:true,pagination:{el:'.swiper-pagination',clickable:true},breakpoints:{768:{slidesPerView:2},1100:{slidesPerView:3}},autoplay:{delay:5000}});
}

// GSAP reveal
if(window.gsap){
  gsap.registerPlugin(ScrollTrigger);
  gsap.utils.toArray('.reveal').forEach(el=>{
    gsap.from(el.children,{y:'120%',opacity:0,duration:1.2,ease:'power4.out',stagger:.08,scrollTrigger:{trigger:el,start:'top 85%'}});
  });

}

// Magnetic buttons
document.querySelectorAll('.magnetic').forEach(btn=>{
  btn.addEventListener('mousemove',e=>{const r=btn.getBoundingClientRect();const x=e.clientX-r.left-r.width/2;const y=e.clientY-r.top-r.height/2;btn.style.transform=`translate(${x*.25}px,${y*.35}px)`});
  btn.addEventListener('mouseleave',()=>btn.style.transform='');
});

// Counter stats
const obs=new IntersectionObserver(entries=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const el=en.target;const target=+el.dataset.count;let cur=0;const step=target/60;
      const t=setInterval(()=>{cur+=step;if(cur>=target){cur=target;clearInterval(t)}el.textContent=Intl.NumberFormat().format(Math.floor(cur))+(target>=1000?'+':'')},20);
      obs.unobserve(el);
    }
  });
},{threshold:.4});
document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));

// Store filter + search
const grid=document.getElementById('product-grid');
if(grid){
  const filterBtns=document.querySelectorAll('.filters .filter-btn');
  const cards=grid.querySelectorAll('[data-cat]');
  const search=document.getElementById('store-search');
  let activeCat='All';
  const apply=()=>{const q=(search?.value||'').toLowerCase();cards.forEach(c=>{const cat=c.dataset.cat;const name=c.querySelector('.product-name').textContent.toLowerCase();const match=(activeCat==='All'||cat===activeCat)&&name.includes(q);c.style.display=match?'':'none'})};
  filterBtns.forEach(b=>b.addEventListener('click',()=>{filterBtns.forEach(x=>x.classList.remove('active'));b.classList.add('active');activeCat=b.dataset.filter;apply()}));
  search?.addEventListener('input',apply);

  // Load dynamic products from admin (localStorage)
  try{
    const stored=JSON.parse(localStorage.getItem('kg_products')||'[]');
    if(stored.length){
      const frag=document.createDocumentFragment();
      stored.forEach((p,i)=>{
        const col=document.createElement('div');
        col.className='col-6 col-md-4 col-lg-3';
        col.dataset.cat=p.category||'Apparel';
        const sizesHtml=p.sizes?Object.entries(p.sizes).filter(([,v])=>v>0).map(([s,v])=>`<option value="${s}">${s} (${v})</option>`).join(''):'';
        col.innerHTML=`
          <article class="product-card">
            <a class="product-media" href="#"><img src="${p.image||'assets/images/logo.png'}" alt="${p.name}" loading="lazy" onerror="this.src='assets/images/logo.png'"></a>
            <div class="product-body">
              <span class="product-cat">${p.category||'General'}</span>
              <h3 class="product-name">${p.name}</h3>
              ${p.description?`<p class="product-desc">${p.description}</p>`:''}
              ${sizesHtml?`<div class="product-sizes"><select class="size-select form-select form-select-sm">${sizesHtml}</select></div>`:''}
              <div class="product-foot"><span class="product-price">KES ${(+p.price).toLocaleString()}</span><button class="add-cart" data-name="${p.name}" data-price="${p.price}"><i class="fas fa-plus"></i></button></div>
            </div>
          </article>`;
        frag.appendChild(col);
      });
      grid.appendChild(frag);
      // Re-run filter to include new products
      apply();
    }
  }catch(e){}
}

// Gallery filter
const masonry=document.getElementById('masonry');
if(masonry){
  const items=masonry.querySelectorAll('.masonry-item');
  document.querySelectorAll('.filters .filter-btn').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.filters .filter-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');
    const f=b.dataset.filter;items.forEach(i=>{i.style.display=(f==='All'||i.dataset.cat===f)?'':'none'});
  }));
}

// Lightbox
const lb=document.getElementById('lightbox');
if(lb){
  const lbImg=lb.querySelector('img');
  document.querySelectorAll('.lightbox-trigger').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();lbImg.src=a.href;lb.classList.add('open')}));
  lb.addEventListener('click',()=>lb.classList.remove('open'));
}

// Cart (UI only)
let cart=JSON.parse(localStorage.getItem('kg_cart')||'[]');
const updateCart=()=>{document.querySelectorAll('.cart-count').forEach(el=>el.textContent=cart.length);localStorage.setItem('kg_cart',JSON.stringify(cart))};
updateCart();
document.body.addEventListener('click',e=>{
  const b=e.target.closest('.add-cart');
  if(!b)return;
  cart.push({name:b.dataset.name,price:+b.dataset.price});
  updateCart();
  showToast(`${b.dataset.name} added to bag`);
});
function showToast(msg){
  let t=document.querySelector('.toast-cart');
  if(!t){t=document.createElement('div');t.className='toast-cart';document.body.appendChild(t)}
  t.innerHTML=`<i class="fas fa-bag-shopping"></i><span>${msg}</span>`;
  t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2400);
}

// Form validation
document.querySelectorAll('.kg-form').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();let ok=true;
    form.querySelectorAll('[required]').forEach(f=>{
      const val=(f.value||'').trim();let v=!!val;
      if(f.type==='email')v=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      f.classList.toggle('invalid',!v);if(!v)ok=false;
    });
    if(ok){const btn=form.querySelector('button[type=submit]');const orig=btn.innerHTML;btn.innerHTML='✓ Sent — we will be in touch';btn.disabled=true;form.reset();setTimeout(()=>{btn.innerHTML=orig;btn.disabled=false},4000)}
  });
  form.querySelectorAll('input,select,textarea').forEach(f=>f.addEventListener('input',()=>f.classList.remove('invalid')));
});
