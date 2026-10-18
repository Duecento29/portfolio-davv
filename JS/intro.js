/* Original artwork stays intact; all drawing, masking and rotation happen in the browser. */
(() => {
  'use strict';
  const key='davv_intro_v3';
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
    overlay.innerHTML=`<div class="intro-backdrop"></div><div class="intro-orbit"><div class="intro-disc"><img src="assets/intro/Try.png" alt=""></div><div class="intro-title"><span>Portfolio</span><strong>Tommaso Caputo</strong></div></div>
      <div class="intro-paper"><svg class="intro-ink" viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect width="1200" height="900" fill="#dcdbd8"/><polygon class="intro-surface" fill="#050505" points="257,0 257,0 943,900 943,900"/><path class="intro-thread" fill="none" stroke="#080808" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      <div class="intro-art"><img src="assets/intro/10.jpg" alt="Composizione originale di Tommaso Caputo"></div><button class="intro-skip">Salta intro</button>`;
    const siblings=[...document.body.children].filter(el=>el instanceof HTMLElement&&!el.inert);
    siblings.forEach(el=>el.inert=true);document.body.append(overlay);document.body.classList.add('intro-playing');
    const skip=overlay.querySelector('button');skip.focus({preventScroll:true});
    let stopped=false;let frame;const animations=[];
    function finish(){
      if(stopped)return;stopped=true;cancelAnimationFrame(frame);animations.forEach(a=>a.cancel());overlay.remove();document.body.classList.remove('intro-playing');
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
    // One continuous thread: tangled point → straight line → the artwork's diagonal.
    // Coordinates use the same 4:3 frame as the untouched photograph.
    const thread=overlay.querySelector('.intro-thread');
    const surface=overlay.querySelector('.intro-surface');
    const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
    const origin=performance.now();
    function draw(now){
      if(stopped)return;
      const t=(now-origin)/1000, untie=ease((t-1.5)/1.9), turn=ease((t-3.65)/1.25);
      const angle=Math.atan2(900,686)*turn;
      const points=[];
      for(let i=0;i<=240;i++){
        const u=i/240;
        // Irregular superposed loops keep the initial point alive without moving its centre far.
        const vibration=(1-untie)*Math.sin(t*22+u*31)*1.8;
        const tangledX=12*Math.sin(u*51+t*.8)+7*Math.sin(u*113-t*.6)+vibration;
        const tangledY=13*Math.cos(u*67-t*.7)+6*Math.sin(u*139+t)+vibration;
        const x=tangledX*(1-untie)+(u-.5)*1600*untie;
        const y=tangledY*(1-untie);
        points.push(`${i?'L':'M'}${(600+x*Math.cos(angle)-y*Math.sin(angle)).toFixed(2)},${(450+x*Math.sin(angle)+y*Math.cos(angle)).toFixed(2)}`);
      }
      thread.setAttribute('d',points.join(' '));
      const spread=ease((t-4.9)/1.2);
      surface.setAttribute('points',`${257*(1-spread)},0 257,0 943,900 ${943*(1-spread)},900`);
      if(t<6.7)frame=requestAnimationFrame(draw);
    }
    frame=requestAnimationFrame(draw);
    animate('.intro-art',[{opacity:0},{opacity:1}],1100,5700);
    animate('.intro-paper',[{opacity:1},{opacity:0}],500,6800);
    animate('.intro-art',[{clipPath:'circle(150% at 50% 50%)'},{clipPath:'circle(0% at 50% 50%)'}],1300,7500);
    animate('.intro-orbit',[{opacity:0},{opacity:1}],900,8100);
    animate('.intro-disc img',[{transform:'rotate(0deg)'},{transform:'rotate(200deg)'}],6000,8400,'linear');
    animate('.intro-title',[{opacity:0,transform:'translateY(14px)'},{opacity:1,transform:'translateY(0)'}],1100,9600);
    animate('.intro-backdrop',[{backdropFilter:'blur(12px)',backgroundColor:'rgba(0,0,0,.64)'},{backdropFilter:'blur(0px)',backgroundColor:'rgba(0,0,0,0)'}],1300,13200);
    const home=document.querySelector('.scene-svg');
    if(home)animations.push(home.animate([{filter:'blur(10px)'},{filter:'blur(0px)'}],{duration:1300,delay:13200,fill:'forwards'}));
    const end=overlay.animate([{opacity:1},{opacity:0}],{duration:900,delay:13600,fill:'forwards'});animations.push(end);
    end.finished.then(finish).catch(()=>{});
  }
  replay.onclick=play;
  let seen=false;try{seen=sessionStorage.getItem(key)==='1'}catch{}
  if(!seen&&!reduced.matches)play();
})();
