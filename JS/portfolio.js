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
  const labels = {home:'Home', table:'Progetti', mirror:'Visual', library:'Libreria', about:'About', books:'Libri'};

  document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page || 'home';
    document.documentElement.lang='it';
    for (const a of document.querySelectorAll('.portfolio-nav [data-nav]')) {
      if (a.dataset.nav === page) a.setAttribute('aria-current','page');
    }
    // SVG's onclick works with a mouse by default, but not with the keyboard.
    document.querySelectorAll('.scene-svg [tabindex="0"]').forEach(el => {
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.dispatchEvent(new MouseEvent('click',{bubbles:true})); }
      });
    });
    const svg = document.querySelector('svg.scene-svg');
    if (!svg) return;
    const depths = layerDepths[page] || {};
    const layers = Object.entries(depths).map(([id,depth]) => {
      const element = svg.querySelector(`[id="${id}"]`);
      return element ? {element,depth,base:element.getAttribute('transform')||''} : null;
    }).filter(Boolean);
    if (!layers.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const smallTouch = window.matchMedia('(pointer: coarse)');
    let mouseX=0,mouseY=0,paintX=0,paintY=0,frame=0;
    const apply = () => {
      frame=0;
      // Subtle physical offsets, expressed in SVG viewBox coordinates (1920 x 910).
      paintX += (mouseX-paintX)*.15;
      paintY += (mouseY-paintY)*.15;
      for (const {element,depth,base} of layers) {
        const x=(paintX*26*depth).toFixed(2);
        const y=(paintY*17*depth).toFixed(2);
        element.setAttribute('transform', `translate(${x} ${y}) ${base}`.trim());
      }
      if (Math.abs(mouseX-paintX)>.002 || Math.abs(mouseY-paintY)>.002) frame=requestAnimationFrame(apply);
    };
    const move = (event) => {
      if (reduceMotion.matches || smallTouch.matches) return;
      mouseX=(event.clientX/window.innerWidth-.5)*2;
      mouseY=(event.clientY/window.innerHeight-.5)*2;
      if (!frame) frame=requestAnimationFrame(apply);
    };
    window.addEventListener('pointermove',move,{passive:true});
    window.addEventListener('blur',() => {mouseX=0;mouseY=0;if(!frame)frame=requestAnimationFrame(apply);});
    // Depth layers never change layout or raster alignment; no device tilt is required.
    if (reduceMotion.matches || smallTouch.matches) return;
    apply();
  });
})();
