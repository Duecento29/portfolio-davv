/* Shared SVG parallax controller.
   Each layer retains its supplied SVG coordinates, clipping, fill and original rotation.
   This avoids moving independent HTML overlays out of alignment with the PNGs. */
(() => {
  'use strict';
  const layerDepths = {
    home:    {home:.10, tavolo1:.78, windows_detail_trigger:.35, libreria31:.55, sedia1:.88},
    table:   {TAVOLO11:.08, oggetti:.58, PROGETTO1:.86},
    mirror:  {righttt1:.10, windows_detail_trigger:.10, '31':.62},
    library: {left1:.10, POL1:.58, windows_detail_trigger:.70},
    about:   {home:.10, windows_detail_trigger:.54, back:.74},
    books:   {}
  };

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page || 'home';
    document.documentElement.lang='it';
    for (const a of document.querySelectorAll('.portfolio-nav [data-nav]')) {
      if (a.dataset.nav === page) a.setAttribute('aria-current','page');
    }
    // Keep the complete photograph but give each Home object a separate hit silhouette.
    // The wrapper moves artwork and interaction geometry together during parallax.
    if(page==='home' && window.DAVV_HOME_HIT_AREAS){
      const ns='http://www.w3.org/2000/svg';
      for(const [id,d] of Object.entries(window.DAVV_HOME_HIT_AREAS)){
        const art=document.querySelector(`.scene-svg [id="${id}"]`);
        if(!art)continue;
        const group=document.createElementNS(ns,'g');
        for(const name of ['id','class','tabindex','role','aria-label','onclick']){
          if(art.hasAttribute(name)){group.setAttribute(name,art.getAttribute(name));art.removeAttribute(name);}
        }
        art.setAttribute('data-artwork',id);
        art.style.pointerEvents='none';
        art.style.removeProperty('transform');
        const hit=document.createElementNS(ns,'path');
        hit.setAttribute('d',d);
        hit.setAttribute('transform',`translate(${art.getAttribute('x')} ${art.getAttribute('y')}) scale(${art.getAttribute('width')} ${art.getAttribute('height')})`);
        hit.setAttribute('fill','transparent');
        hit.style.pointerEvents='fill';
        hit.setAttribute('aria-hidden','true');
        art.replaceWith(group);group.append(art,hit);
      }
    }
    // SVG's onclick works with a mouse by default, but not with the keyboard.
    document.querySelectorAll('.scene-svg [tabindex="0"]').forEach(el => {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
      });
    });
    const svg = document.querySelector('svg.scene-svg');
    if (!svg) return;
    const destinations = {
      home:{tavolo1:'Progetti',windows_detail_trigger:'Visual',libreria31:'Libreria',sedia1:'About'},
      table:{PROGETTO1:'Progetti'},
      mirror:{windows_detail_trigger:'Visual'},
      library:{windows_detail_trigger:'Libri'},
      about:{windows_detail_trigger:'About',back:'Video'}
    };
    const hint=document.createElement('div');
    hint.className='scene-hint';
    hint.setAttribute('aria-hidden','true'); // Buttons already have descriptive accessible names.
    document.body.appendChild(hint);
    let keyboardMode=false;
    const hideHint=()=>hint.classList.remove('is-visible');
    const positionHint=(x,y)=>{
      const width=hint.offsetWidth,height=hint.offsetHeight,gap=16,margin=12;
      const left=x+gap+width>window.innerWidth-margin ? x-width-gap : x+gap;
      const top=y+gap+height>window.innerHeight-margin ? y-height-gap : y+gap;
      hint.style.left=Math.max(margin,Math.min(left,window.innerWidth-width-margin))+'px';
      hint.style.top=Math.max(margin,Math.min(top,window.innerHeight-height-margin))+'px';
    };
    document.addEventListener('keydown',event=>{
      if(event.key==='Tab')keyboardMode=true;
      if(event.key==='Escape')hideHint();
    });
    document.addEventListener('pointerdown',()=>{keyboardMode=false;hideHint();},{passive:true});
    window.addEventListener('blur',hideHint);
    window.addEventListener('resize',hideHint);
    svg.querySelectorAll('.cursor[tabindex="0"]').forEach(element=>{
      const label=element.id==='home_button' ? 'Home' : destinations[page]?.[element.id];
      if(!label)return;
      element.addEventListener('pointerenter',event=>{
        if(event.pointerType==='touch')return;
        hint.textContent=label;positionHint(event.clientX,event.clientY);
        hint.classList.add('is-visible');
      });
      element.addEventListener('pointermove',event=>{
        if(event.pointerType!=='touch')positionHint(event.clientX,event.clientY);
      });
      element.addEventListener('pointerleave',hideHint);
      element.addEventListener('click',hideHint);
      element.addEventListener('focus',()=>{
        if(!keyboardMode)return;
        const bounds=element.getBoundingClientRect();
        hint.textContent=label;
        positionHint(Math.max(12,Math.min(bounds.right,window.innerWidth-100)),
          Math.max(12,Math.min(bounds.top+bounds.height/2,window.innerHeight-70)));
        hint.classList.add('is-visible');
      });
      element.addEventListener('blur',hideHint);
    });
    const depths = layerDepths[page] || {};
    const motionScale = (page==='home' || page==='about') ? .8 : .95;
    const layers = Object.entries(depths).map(([id,depth]) => {
      const element = svg.querySelector(`[id="${id}"]`);
      if (!element) return null;
      element.classList.add('scene-layer');
      // Exported CSS translations override the SVG transform attribute entirely.
      // Discard those frozen pointer offsets, preserving the authored SVG rotation.
      element.style.removeProperty('transform');
      element.style.removeProperty('transform-origin');
      return {element,depth,base:element.getAttribute('transform')||''};
    }).filter(Boolean);
    if (!layers.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let mouseX=0,mouseY=0,paintX=0,paintY=0,frame=0,lastTime=0;
    const apply = (time) => {
      frame=0;
      // Time-based easing gives the same weight on 60 Hz and high-refresh screens.
      const elapsed=lastTime ? Math.min(time-lastTime,50) : 16.67;
      lastTime=time;
      const ease=1-Math.exp(-elapsed/110);
      paintX += (mouseX-paintX)*ease;
      paintY += (mouseY-paintY)*ease;
      const settled=Math.abs(mouseX-paintX)<.001 && Math.abs(mouseY-paintY)<.001;
      if (settled) {paintX=mouseX;paintY=mouseY;}
      for (const {element,depth,base} of layers) {
        // Foreground objects move more than the distant room, in viewBox units.
        const x=(-paintX*22*depth*motionScale).toFixed(2);
        const y=(-paintY*12*depth*motionScale).toFixed(2);
        element.setAttribute('transform', `translate(${x} ${y}) ${base}`.trim());
      }
      if (!settled) frame=requestAnimationFrame(apply);
      else lastTime=0;
    };
    const move = (event) => {
      if (reduceMotion.matches || (event.pointerType==='touch' && !event.buttons)) return;
      mouseX=Math.max(-1,Math.min(1,(event.clientX/window.innerWidth-.5)*2));
      mouseY=Math.max(-1,Math.min(1,(event.clientY/window.innerHeight-.5)*2));
      if (!frame) frame=requestAnimationFrame(apply);
    };
    const reset = () => {
      mouseX=0;mouseY=0;
      if (!frame) frame=requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove',move,{passive:true});
    document.documentElement.addEventListener('pointerleave',reset);
    window.addEventListener('blur',reset);
    window.addEventListener('pointerup',event => {if(event.pointerType==='touch')reset();});
    window.addEventListener('pointercancel',reset);
    document.addEventListener('visibilitychange',() => {if(document.hidden)reset();});
    reduceMotion.addEventListener('change',() => {
      if (frame) cancelAnimationFrame(frame);
      frame=0;lastTime=0;mouseX=0;mouseY=0;paintX=0;paintY=0;
      for (const {element,base} of layers) {
        if (base) element.setAttribute('transform',base);
        else element.removeAttribute('transform');
      }
    });
    // Touch drags also work; reduced-motion users retain a completely still scene.
  });
})();
