(()=>{
  const nav=document.querySelector('.nav');
  const header=document.querySelector('header');

  if(nav&&header&&!document.querySelector('.mobile-menu-toggle')){
    const toggle=document.createElement('button');
    toggle.className='mobile-menu-toggle';
    toggle.type='button';
    toggle.setAttribute('aria-label','Open menu');
    toggle.setAttribute('aria-expanded','false');
    toggle.innerHTML='<span></span><span></span><span></span>';

    const panel=document.createElement('div');
    panel.className='mobile-menu-panel';
    panel.setAttribute('aria-hidden','true');
    panel.innerHTML=`
      <nav class="mobile-menu-links" aria-label="Mobile navigation">
        <a href="/fpx-sourcing">FPX Sourcing</a>
        <a href="/timber">Timber Range</a>
        <a href="/our-customers">Our Customers</a>
        <a href="/fpx-intelligence">FPX Intelligence</a>
        <a href="/saw-point">Saw Point</a>
        <a href="/industry-insights">FPX Insights</a>
        <a href="/frequently-asked-questions">FAQ</a>
        <a href="/about-us">About Us</a>
        <a href="/contact-us">Contact</a>
      </nav>
      <div class="mobile-menu-actions">
        <a class="mobile-login" href="https://app.fpx.nz/">Login</a>
        <a class="mobile-access" href="https://app.fpx.nz/sourcing-sign-up">Get FPX Access</a>
      </div>`;

    nav.appendChild(toggle);
    header.appendChild(panel);

    const setOpen=(open)=>{
      header.classList.toggle('mobile-menu-open',open);
      toggle.setAttribute('aria-expanded',String(open));
      toggle.setAttribute('aria-label',open?'Close menu':'Open menu');
      panel.setAttribute('aria-hidden',String(!open));
      document.body.classList.toggle('mobile-menu-lock',open&&window.innerWidth<=900);
    };

    toggle.addEventListener('click',()=>setOpen(!header.classList.contains('mobile-menu-open')));
    panel.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setOpen(false)));
    document.addEventListener('keydown',e=>{if(e.key==='Escape')setOpen(false)});
    window.addEventListener('resize',()=>{if(window.innerWidth>900)setOpen(false)});
  }

  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const selectors=['.benefit','.source-head','.source-card','.range-head','.product','.request-panel','#customers>.wrap>.ey','#customers>.wrap>h2','.cust','.intel-in','.final-in'];
    const nodes=[...document.querySelectorAll(selectors.join(','))];
    nodes.forEach((el,i)=>{
      el.classList.add('fpx-reveal');
      el.style.setProperty('--fpx-delay',Math.min((i%4)*45,135)+'ms');
    });
    const io=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('fpx-visible');io.unobserve(entry.target)}
      });
    },{threshold:.05,rootMargin:'0px 0px -4% 0px'});
    nodes.forEach(el=>io.observe(el));
  }
})();
