(()=>{
  const nav=document.querySelector('.nav');
  const header=document.querySelector('header');

  const sourcingPolish=document.createElement('style');
  sourcingPolish.textContent=`
    #sourcing .source-grid{gap:24px;align-items:stretch}
    #sourcing .source-card{display:flex;flex-direction:column;border-radius:20px!important;overflow:hidden;box-shadow:0 18px 44px rgba(4,14,14,.08)!important;background:#fff}
    #sourcing .source-visual{position:relative;height:330px!important;padding:18px!important;background:linear-gradient(145deg,#eef3ef 0%,#e7eee9 100%)!important;border-bottom:1px solid rgba(4,14,14,.07)!important}
    #sourcing .source-visual:before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 82% 4%,rgba(63,168,71,.08),transparent 32%);pointer-events:none}
    #sourcing .source-shot{position:relative;height:100%!important;border-radius:15px!important;overflow:hidden!important;background:#fff!important;border:1px solid rgba(23,75,56,.12)!important;box-shadow:0 16px 32px rgba(4,14,14,.10)!important}
    #sourcing .source-shot img{width:100%!important;height:100%!important;object-fit:cover!important;background:#fff!important;transition:transform .65s cubic-bezier(.22,1,.36,1)!important}
    #sourcing .source-card:first-child .source-shot img{object-position:50% 18%!important;transform:scale(1.20)!important;transform-origin:50% 20%!important}
    #sourcing .source-card:nth-child(2) .source-shot img{object-position:50% 10%!important;transform:scale(1.13)!important;transform-origin:50% 12%!important}
    #sourcing .source-card:first-child:hover .source-shot img{transform:scale(1.225)!important}
    #sourcing .source-card:nth-child(2):hover .source-shot img{transform:scale(1.155)!important}
    #sourcing .source-copy{display:flex;flex-direction:column;align-items:flex-start;flex:1;min-height:220px;padding:26px 28px 28px!important}
    #sourcing .source-kicker{margin-bottom:13px!important;font-size:10.5px!important;letter-spacing:.12em!important}
    #sourcing .source-num{width:29px!important;height:29px!important;font-size:9.5px!important}
    #sourcing .source-copy h3{margin:0 0 10px!important;font-size:30px!important;line-height:1.02!important;letter-spacing:-.025em!important}
    #sourcing .source-copy p{max-width:560px;margin:0 0 19px!important;font-size:13.5px!important;line-height:1.62!important}
    #sourcing .source-copy a{margin-top:auto!important;font-size:13px!important}
    #sourcing .source-card:nth-child(2) .source-copy{background:linear-gradient(135deg,#174b38 0%,#286c50 100%)!important}
    #sourcing .source-card:nth-child(2) .source-copy h3{color:#fff!important}
    #sourcing .source-card:nth-child(2) .source-kicker,#sourcing .source-card:nth-child(2) .source-copy p,#sourcing .source-card:nth-child(2) .source-copy a{color:rgba(255,255,255,.9)!important}
    #sourcing .source-card:nth-child(2) .source-num{background:rgba(255,255,255,.14)!important;color:#fff!important;border:1px solid rgba(255,255,255,.16)}
    @media(max-width:900px){
      #sourcing .source-visual{height:300px!important}
      #sourcing .source-card:first-child .source-shot img{transform:scale(1.17)!important}
      #sourcing .source-card:nth-child(2) .source-shot img{transform:scale(1.10)!important}
    }
    @media(max-width:600px){
      #sourcing .source-grid{gap:16px}
      #sourcing .source-visual{height:238px!important;padding:10px!important}
      #sourcing .source-copy{min-height:0;padding:21px 21px 23px!important}
      #sourcing .source-copy h3{font-size:24px!important}
      #sourcing .source-copy p{font-size:12.5px!important}
      #sourcing .source-card:first-child .source-shot img{transform:scale(1.15)!important}
      #sourcing .source-card:nth-child(2) .source-shot img{transform:scale(1.08)!important}
    }
  `;
  document.head.appendChild(sourcingPolish);

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
