/* Original artwork stays intact; all drawing, masking and rotation happen in the browser. */
(() => {
  'use strict';
  const key='davv_intro_v2';
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const replay=document.createElement('button');
  replay.className='intro-replay';replay.textContent='Rivedi intro';
  document.body.append(replay);
  let running=false;
  async function play(){
    if(running)return;running=true;
    const previous=document.activeElement;
    const overlay=document.createElement('div');
    overlay.className='intro-film';overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Introduzione al portfolio di Tommaso Caputo');
    overlay.innerHTML=`<div class="intro-orbit"><div class="intro-disc"><img src="assets/intro/Try.png" alt=""></div><div class="intro-title"><span>Portfolio</span><strong>Tommaso Caputo</strong></div></div>
      <div class="intro-paper"><svg class="intro-ink" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><circle cx="600" cy="450" r="5" fill="#080808"/><path d="M600 450 C570 410 640 414 621 461 C602 507 553 452 590 420 C635 377 677 462 610 491 C540 520 513 396 602 390 C709 375 713 520 600 530 C465 542 457 350 599 350 C770 350 766 573 595 575 C395 575 402 294 600 295" fill="none" stroke="#080808" stroke-width="2.5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/><path class="intro-line" d="M0 450 H1200" stroke="#080808" stroke-width="1.5" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/></svg></div>
      <div class="intro-art"><img src="assets/intro/10.jpg" alt="Composizione originale di Tommaso Caputo"></div><button class="intro-skip">Salta intro</button>`;
    const siblings=[...document.body.children].filter(el=>el instanceof HTMLElement&&!el.inert);
    siblings.forEach(el=>el.inert=true);document.body.append(overlay);
    const skip=overlay.querySelector('button');skip.focus({preventScroll:true});
    let stopped=false;const animations=[];
    function finish(){
      if(stopped)return;stopped=true;animations.forEach(a=>a.cancel());overlay.remove();
      siblings.forEach(el=>el.inert=false);document.removeEventListener('keydown',onKey);
      running=false;try{sessionStorage.setItem(key,'1')}catch{}
      if(previous instanceof HTMLElement&&previous!==document.body)previous.focus({preventScroll:true});
      else replay.focus({preventScroll:true});
    }
    function onKey(e){if(e.key==='Escape'){e.preventDefault();finish()}if(e.key==='Tab'){e.preventDefault();skip.focus()}}
    skip.onclick=finish;document.addEventListener('keydown',onKey);
    const animate=(selector,frames,duration,delay=0,easing='cubic-bezier(.4,0,.2,1)')=>{
      const animation=overlay.querySelector(selector).animate(frames,{duration,delay,easing,fill:'forwards'});
      animations.push(animation);return animation;
    };
    // Wait for both source images, with an escape path for a slow or failed download.
    const loaded=Promise.all([...overlay.querySelectorAll('img')].map(img=>img.decode()));
    let timeout;
    try{await Promise.race([loaded,new Promise((_,reject)=>{timeout=setTimeout(()=>reject(new Error('Image timeout')),10000)})])}
    catch{finish();return}finally{clearTimeout(timeout)}
    if(stopped)return;
    if(reduced.matches){
      overlay.querySelector('.intro-paper').remove();overlay.querySelector('.intro-art').remove();
      overlay.querySelector('.intro-orbit').style.opacity='1';overlay.querySelector('.intro-title').style.opacity='1';
      setTimeout(finish,1600);return;
    }
    animate('.intro-ink circle',[{opacity:0,transform:'scale(.4)',transformOrigin:'50% 50%'},{opacity:1,transform:'scale(1)'}],500);
    animate('.intro-ink path',[{strokeDashoffset:1},{strokeDashoffset:0}],2100,400);
    animate('.intro-ink path',[{opacity:1},{opacity:0}],700,2400);
    animate('.intro-line',[{strokeDashoffset:1},{strokeDashoffset:0}],800,2300);
    animate('.intro-art',[{opacity:0},{opacity:1}],1100,3000);
    animate('.intro-paper',[{opacity:1},{opacity:0}],500,4100);
    animate('.intro-art',[{clipPath:'circle(150% at 50% 50%)'},{clipPath:'circle(0% at 50% 50%)'}],1300,5100);
    animate('.intro-orbit',[{opacity:0},{opacity:1}],900,5700);
    animate('.intro-disc img',[{transform:'rotate(0deg)'},{transform:'rotate(200deg)'}],6000,6000,'linear');
    animate('.intro-title',[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],1100,7200);
    const end=overlay.animate([{opacity:1},{opacity:0}],{duration:800,delay:11300,fill:'forwards'});animations.push(end);
    end.finished.then(finish).catch(()=>{});
  }
  replay.onclick=play;
  let seen=false;try{seen=sessionStorage.getItem(key)==='1'}catch{}
  if(!seen&&!reduced.matches)play();
})();
