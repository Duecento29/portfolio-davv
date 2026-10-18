/* Approved Test C: one continuous artwork from the surface to the rotating circle. */
(() => {
'use strict';
const key='davv_intro_diagonal_4';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
const replay=document.createElement('button');replay.className='intro-replay';replay.textContent='Rivedi intro';document.body.append(replay);
let running=false;
async function play(){
 if(running)return;running=true;
 const previous=document.activeElement,scene=document.querySelector('.scene-svg');
 const savedFilter=scene?scene.style.filter:'';
 const overlay=document.createElement('div');overlay.className='intro-film';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Introduzione al portfolio di Tommaso Caputo');
 overlay.innerHTML='<div class="intro-backdrop"></div><canvas class="intro-canvas" aria-hidden="true"></canvas><button class="intro-skip">Salta intro</button>';
 const siblings=[...document.body.children].filter(el=>el instanceof HTMLElement&&!el.inert);
 siblings.forEach(el=>el.inert=true);document.body.append(overlay);document.body.classList.add('intro-playing');
 const canvas=overlay.querySelector('canvas'),ctx=canvas.getContext('2d'),backdrop=overlay.querySelector('.intro-backdrop'),skip=overlay.querySelector('button');
 skip.focus({preventScroll:true});let stopped=false,frame,timer,portrait=false;
 const W=1280,H=960,images={},paper='#dcdbd8';
 const clamp=x=>Math.max(0,Math.min(1,x));
 const smooth=x=>{x=clamp(x);return x*x*x*(x*(x*6-15)+10)};
 const mix=(a,b,t)=>a+(b-a)*t;
 function fill(color){ctx.fillStyle=color;ctx.fillRect(0,0,W,H)}
 function finish(){if(stopped)return;stopped=true;cancelAnimationFrame(frame);clearTimeout(timer);overlay.remove();document.body.classList.remove('intro-playing');if(scene)scene.style.filter=savedFilter;siblings.forEach(el=>el.inert=false);document.removeEventListener('keydown',onKey);running=false;try{sessionStorage.setItem(key,'1')}catch{};(previous instanceof HTMLElement&&previous!==document.body?previous:replay).focus({preventScroll:true})}
 function onKey(e){if(e.key==='Escape'){e.preventDefault();finish()}else if(e.key==='Tab'){e.preventDefault();skip.focus()}}
 skip.onclick=finish;document.addEventListener('keydown',onKey);
function continuousArt(scale=1){
 const img=images['composizione-sfondo-allineato.png'];
 ctx.save();ctx.scale(scale,scale);
 // One square texture, cropped to a 4:3 stage and then the rotating circle.
 // The circle reveals more of this same texture, with no swaps or mirrored joins.
 ctx.drawImage(img,-640,-640,1280,1280);ctx.restore();
}
function original(t){
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 fill(paper);
 const untie=smooth((t-1.25)/1.8),turn=smooth((t-2.8)/1.55),spread=smooth((t-3.9)/1.6);
 const angle=Math.atan2(960,546)*turn;
 ctx.save();ctx.beginPath();ctx.rect(0,0,W,H);ctx.clip();
 if(spread>0){ctx.beginPath();ctx.moveTo(374-1500*spread,0);ctx.lineTo(374,0);ctx.lineTo(920,960);ctx.lineTo(920-1500*spread,960);ctx.closePath();ctx.fillStyle='#050505';ctx.fill()}
 ctx.translate(640+7*turn,480);ctx.rotate(angle);ctx.beginPath();
 for(let i=0;i<=420;i++){
 const u=i/420;
 // Progressively release folds along the thread, rather than stretching all loops in lockstep.
 const release=smooth(untie*1.45-u*.45),r=1-release;
 const phase=t*.6;
 const x=mix(14*Math.sin(u*83+phase)+6*Math.sin(u*131-phase),(u-.5)*1700,release);
 const y=r*(13*Math.cos(u*71-phase)+6*Math.sin(u*149+phase)+1.4*Math.sin(t*19+u*35));
 i?ctx.lineTo(x,y):ctx.moveTo(x,y);
 }
 ctx.strokeStyle='#080808';ctx.lineWidth=1.3;ctx.stroke();ctx.restore();
 // Reveal only the final composition. No intermediate collage, no 10.jpg / Try.png swaps.
 const reveal=smooth((t-5.05)/1.8);
 ctx.save();ctx.globalAlpha=reveal;ctx.translate(640,480);continuousArt();ctx.restore();
 ctx.restore();
}
function tail(t){
 const morph=smooth(t/2.15),exit=smooth((t-5.4)/1.5);
 backdrop.style.opacity=String(1-exit);if(scene)scene.style.filter=`blur(${12*(1-exit)}px)`;
 const diameter=840;
 const cx=640,cy=mix(480,440,morph),w=mix(1280,diameter,morph),h=mix(960,diameter,morph);
 ctx.save();ctx.globalAlpha=1-exit;ctx.beginPath();ctx.roundRect(cx-w/2,cy-h/2,w,h,diameter/2*morph);ctx.clip();
 ctx.translate(cx,cy);
 // Rotation accelerates gently while the corners round; no disappearing iris or image swap.
 const angle=(Math.max(0,t-.35)-.6*(1-Math.exp(-Math.max(0,t-.35)/.6)))*.47;
 ctx.rotate(angle*morph);continuousArt(mix(1,.57*diameter/540,morph));ctx.restore();
 const title=smooth((t-1.65)/1.1)*(1-exit);
 ctx.save();ctx.globalAlpha=title;ctx.fillStyle='#f6f3ec';ctx.textAlign='center';ctx.shadowColor='#0009';ctx.shadowBlur=20;
 ctx.font=`${portrait?30:18}px Arial`;ctx.letterSpacing='4px';ctx.fillText('PORTFOLIO',640,920);ctx.letterSpacing='-1.5px';ctx.font=`${portrait?94:74}px Arial`;ctx.fillText('Tommaso Caputo',640,portrait?1040:1000);ctx.restore();
}

 const img=new Image();img.src='assets/intro/composizione-sfondo-allineato.png';
 try{await Promise.race([img.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('Image timeout')),15000)})])}catch{finish();return}finally{clearTimeout(timer)}
 if(stopped)return;images['composizione-sfondo-allineato.png']=img;
 const start=performance.now();
 function render(now){
  if(stopped)return;
  const t=(now-start)/1000, width=innerWidth,height=innerHeight,dpr=Math.min(devicePixelRatio||1,2);
  if(canvas.width!==Math.round(width*dpr)||canvas.height!==Math.round(height*dpr)){canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr)}
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
  const scale=Math.min(width*.9/W,height*.88/1120);portrait=height>width*1.2;
  ctx.translate((width-W*scale)/2,(height-1120*scale)/2);ctx.scale(scale,scale);
  if(reduced.matches){tail(3);if(t>=1.6){finish();return}}
  else if(t<8)original(t);else if(t<15)tail(t-8);else{finish();return}
  frame=requestAnimationFrame(render);
 }
 frame=requestAnimationFrame(render);
}
replay.onclick=play;let seen=false;try{seen=sessionStorage.getItem(key)==='1'}catch{}
if(!seen&&!reduced.matches)play();
})();
