/* Section titles share the opening film's typography and reveal the live room. */
(() => {
 'use strict';
 const sections={library:['Libreria','Liber–Libri'],mirror:['Visual','Liber–Libera'],table:['Progetti','Liber–Liberorum'],about:['About','Turi']};
 const page=document.body.dataset.page,section=sections[page];
 if(!section)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),key='davv_section_type_1_'+page;
 const replay=document.createElement('button');replay.className='section-replay';replay.textContent='Rivedi apertura';document.body.append(replay);
 let running=false;
 function play(){
  if(running)return;running=true;
  const previous=document.activeElement,overlay=document.createElement('div');
  overlay.className='section-intro';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label',section[0]);
  overlay.innerHTML='<div class="section-intro__type"><h1 class="section-intro__title"></h1><span class="section-intro__label"></span><span class="section-intro__rule" aria-hidden="true"></span></div><button class="section-intro__skip">Salta</button>';
  overlay.querySelector('.section-intro__label').textContent=section[0];overlay.querySelector('h1').textContent=section[1];
  const siblings=[...document.body.children].filter(el=>!el.inert);
  siblings.forEach(el=>el.inert=true);document.body.append(overlay);
  const skip=overlay.querySelector('button');skip.focus({preventScroll:true});
  let timer,exitTimer,finished=false;
  function finish(){if(finished)return;finished=true;clearTimeout(timer);clearTimeout(exitTimer);overlay.remove();siblings.forEach(el=>el.inert=false);document.removeEventListener('keydown',onKey);running=false;try{sessionStorage.setItem(key,'1')}catch{};(previous instanceof HTMLElement&&previous!==document.body?previous:replay).focus({preventScroll:true})}
  function onKey(e){if(e.key==='Escape'){e.preventDefault();finish()}else if(e.key==='Tab'){e.preventDefault();skip.focus()}}
  skip.onclick=finish;document.addEventListener('keydown',onKey);
  timer=setTimeout(()=>{overlay.classList.add('is-leaving');exitTimer=setTimeout(finish,reduced.matches?0:700)},2600);
 }
 replay.onclick=play;
 let seen=false;try{seen=!!sessionStorage.getItem(key)}catch{}
 if(!seen&&!reduced.matches)play();
})();
