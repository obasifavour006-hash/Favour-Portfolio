(function(){
  'use strict';
  var $=function(s,c){return (c||document).querySelector(s)}, $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover=matchMedia('(hover:hover) and (pointer:fine)').matches;
  $('#yr').textContent=new Date().getFullYear();

  /* nav */
  var nav=$('.nav'), burger=$('.burger'), menu=$('#menu');
  addEventListener('scroll',function(){nav.classList.toggle('is-stuck',scrollY>10)},{passive:true});
  burger.addEventListener('click',function(){var o=menu.classList.toggle('open');burger.setAttribute('aria-expanded',o);burger.setAttribute('aria-label',o?'Close menu':'Open menu')});
  $$('a',menu).forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');burger.setAttribute('aria-expanded','false')})});
  var links=$$('.nav__links a:not(.btn)');
  var secs=['home','work','services','about','contact'].map(function(id){return document.getElementById(id)});
  var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(l){l.classList.toggle('is-active',l.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-45% 0px -50% 0px'});
  secs.forEach(function(s){s&&so.observe(s)});

  /* tools */
  var tl=$('#tools');
  var hues=[262,280,250,300,235,270,290,320,10,200,255,215,340,160,25,45,225,0];
  TOOLS.forEach(function(t,i){var li=document.createElement('li');var b=document.createElement('b');b.textContent=t.replace(/[^A-Za-z]/g,'').slice(0,2);b.style.background='hsl('+(hues[i%hues.length])+' 60% 46%)';li.appendChild(b);li.appendChild(document.createTextNode(t));tl.appendChild(li)});

  /* projects */
  var grid=$('#grid'), fb=$('#filters');
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
  PROJECTS.forEach(function(p){
    var c=el('button','pcard');c.type='button';c.dataset.cat=p.cat;c.setAttribute('aria-label','Play '+p.title);
    var m=el('div','pcard__media');m.style.aspectRatio=p.w+'/'+p.h;
    var img=new Image();img.src='assets/images/poster-'+p.id+'.jpg';img.alt=p.title+' video thumbnail';img.loading='lazy';img.width=p.w;img.height=p.h;
    var v=document.createElement('video');v.muted=true;v.loop=true;v.playsInline=true;v.preload='none';v.setAttribute('aria-hidden','true');v.tabIndex=-1;v.dataset.src='assets/videos/'+p.id+'.mp4';
    var pl=el('span','pcard__play');pl.setAttribute('aria-hidden','true');pl.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    m.appendChild(img);m.appendChild(v);m.appendChild(pl);
    var i=el('div','pcard__info');i.appendChild(el('span','pcard__cat',CATS[p.cat]+' · '+p.industry));i.appendChild(el('h3',null,p.title));i.appendChild(el('p',null,p.desc));
    c.appendChild(m);c.appendChild(i);grid.appendChild(c);
    if(canHover&&!reduce){
      c.addEventListener('mouseenter',function(){if(!v.src)v.src=v.dataset.src;var pr=v.play();if(pr&&pr.then)pr.then(function(){c.classList.add('is-playing')}).catch(function(){})});
      c.addEventListener('mouseleave',function(){v.pause();v.currentTime=0;c.classList.remove('is-playing')});
    }
    c.addEventListener('click',function(){v.pause();c.classList.remove('is-playing');openModal(p)});
  });
  Object.keys(CATS).forEach(function(k,i){var b=el('button',null,CATS[k]);b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',i===0);b.dataset.f=k;fb.appendChild(b)});
  function filter(k){
    $$('button',fb).forEach(function(b){b.setAttribute('aria-selected',b.dataset.f===k)});
    $$('.pcard',grid).forEach(function(c){c.classList.toggle('is-hidden',k!=='all'&&c.dataset.cat!==k)});
  }
  fb.addEventListener('click',function(e){var b=e.target.closest('button');if(b)filter(b.dataset.f)});
  $$('.card[data-filter]').forEach(function(a){a.addEventListener('click',function(){var f=a.dataset.filter;if(f)filter(f)})});

  /* modal */
  var modal=$('#modal'), mv=$('#mv');
  function openModal(p){
    mv.src='assets/videos/'+p.id+'.mp4';mv.poster='assets/images/poster-'+p.id+'.jpg';
    $('#mt').textContent=p.title;$('#md').textContent=p.industry+' · '+p.desc;
    if(modal.showModal)modal.showModal();else modal.setAttribute('open','');
    document.body.style.overflow='hidden';
    var pr=mv.play();if(pr&&pr.catch)pr.catch(function(){});
  }
  function closeModal(){mv.pause();mv.removeAttribute('src');mv.load();if(modal.close)modal.close();else modal.removeAttribute('open');document.body.style.overflow=''}
  $('.modal__x').addEventListener('click',closeModal);
  modal.addEventListener('click',function(e){if(e.target===modal)closeModal()});
  modal.addEventListener('cancel',function(){setTimeout(closeModal,0)});

  /* about video lazy source */
  var iv=$('#introVideo');
  iv.addEventListener('play',function(){if(!iv.src)iv.src=iv.dataset.src},{once:true});
  iv.addEventListener('click',function(){if(!iv.src){iv.src=iv.dataset.src;iv.play()}});

  /* reveal + counters */
  $$('.stats li').forEach(function(l,i){l.style.setProperty('--d',i*.1+'s')});
  $$('.cards .card').forEach(function(l,i){l.style.setProperty('--d',i*.1+'s')});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);var n=$('[data-count]',e.target);if(n&&!reduce)count(n)}})},{threshold:0,rootMargin:"0px 0px -6% 0px"});
  $$('.reveal').forEach(function(r){io.observe(r)});
  function count(n){var to=+n.dataset.count,s=n.dataset.suffix||'',t0=performance.now();(function f(t){var k=Math.min((t-t0)/1200,1);n.textContent=Math.round(to*(1-Math.pow(1-k,3)))+s;if(k<1)requestAnimationFrame(f)})(t0)}
})();
