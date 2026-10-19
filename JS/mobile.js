(() => {
 if(!window.DAVV_MOBILE)return;
 const ns='http://www.w3.org/2000/svg';
 const pages={home:['Home','index.html'],table:['Progetti','Tavolo_new.html'],mirror:['Visual','right-Home_0.3.html'],library:['Libreria','left-Home_0.2.html'],about:['About','about_0.2.html']};
 const page=document.body.dataset.page==='books'?'library':document.body.dataset.page;
 const app=document.createElement('div');app.id='mobile-app';
 document.documentElement.lang='it';
 function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e}
 function link(text,url,cls){const a=el('a',cls,text);a.href=url;return a}
 // Display the photographic part of the existing board through an SVG viewport.
 // No source image is rewritten; the original full board remains available below.
 function artwork(src,box,size){const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox',box.join(' '));svg.setAttribute('aria-hidden','true');const img=document.createElementNS(ns,'image');img.setAttribute('href',src);img.setAttribute('width',size[0]);img.setAttribute('height',size[1]);svg.append(img);return svg}
 const top=el('header','m-top');const brand=link('DAVV','index.html','m-brand');brand.append(el('span','','.'));top.append(brand,el('small','','Tommaso Caputo'));app.append(top);
 const main=el('main');main.id='contenuti';app.append(main);
 const nav=el('nav','m-nav');nav.setAttribute('aria-label','Navigazione portfolio');
 for(const [id,[label,url]] of Object.entries(pages)){const a=link(label,url);if(id===page)a.setAttribute('aria-current','page');nav.append(a)}app.append(nav);
 function cvs(){const actions=el('div','m-actions');for(const language of ['Italiano','English']){const name=`Curriculum_Tommaso_Caputo_${language}.pdf`;const a=link('CV '+language+' ↓','assets/cv/'+name,'m-button');a.download=name;actions.append(a)}return actions}
 if(page==='home'){
  main.append(el('p','m-kicker','Portfolio'),el('h1','','Tommaso Caputo'));
  const orbit=el('div','m-orbit');
  const hero=el('img','m-orbit__image');hero.src='assets/intro/composizione-sfondo-allineato.png';hero.alt='Composizione circolare Vedo, sento, parlo';hero.width=1254;hero.height=1254;orbit.append(hero);main.append(orbit);
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,angle=0,target=0;
  function paint(){angle+=(target-angle)*.12;if(Math.abs(target-angle)<.05)angle=target;hero.style.transform=`rotate(${angle}deg)`;frame=angle===target?0:requestAnimationFrame(paint)}
  function turn(){target=reduced.matches?0:Math.min(110,Math.max(0,scrollY)*.14);if(!frame)frame=requestAnimationFrame(paint)}
  addEventListener('scroll',turn,{passive:true});
  reduced.addEventListener('change',()=>{cancelAnimationFrame(frame);frame=0;if(reduced.matches){angle=target=0;hero.style.transform='rotate(0deg)'}else turn()});turn();
  const links=el('div','m-links');const subtitles={table:'Design e sperimentazioni',mirror:'Opere e immagini',library:'Libri e letture',about:'Contatti e curriculum'};
  for(const [i,id] of ['table','mirror','library','about'].entries()){const a=link('',pages[id][1],'m-tile');const copy=el('span','m-tile__copy');copy.append(el('strong','',pages[id][0]),el('span','m-tile__description',subtitles[id]));const arrow=el('span','m-tile__arrow','↗');arrow.setAttribute('aria-hidden','true');a.append(el('span','m-tile__number',String(i+1).padStart(2,'0')),copy,arrow);links.append(a)}main.append(links);
 }else if(page==='about'){
  main.append(el('p','m-kicker','About / Turi'),el('h1','','Tommaso Caputo'));
  const profile=el('div','m-profile');profile.append(artwork('IMG/ABOUT/about.png',[1174,250,230,230],[1638,910]));main.append(profile);
  main.append(el('h2','','Contatti'));
  main.append(link('tommaso.caputo@studio.unibo.it','mailto:tommaso.caputo@studio.unibo.it','m-contact'),link('+39 392 8238224','tel:+393928238224','m-contact'),link('Instagram · Duecento29','https://www.instagram.com/duecento29/','m-contact'),el('p','m-contact','LinkedIn · T. Caputo'));
  main.append(el('h2','', 'Curriculum'),cvs());
  const actions=el('div','m-actions');actions.append(link('Guarda il video ↗','https://youtu.be/9-r3pZYxQ_o','m-button'),link('Apri la presentazione completa ↗','IMG/ABOUT/about.png','m-button'));main.append(actions);
 }else{
  const subtitles={table:'Liber–Liberorum',mirror:'Liber–Libera',library:'Liber–Libri'};
  main.append(el('p','m-kicker',subtitles[page]),el('h1','',pages[page][0]));
  const items=window.DAVV_MOBILE_CONTENT[page];
  for(const [i,item] of items.entries()){
   const card=el('article','m-card');card.id='scheda-'+(i+1);
   card.append(el('h2','',item.title));if(item.author||item.date)card.append(el('p','m-meta',item.author||item.date));
   const a=page==='table'?el('div','m-art'):link('',item.image,'m-art');if(page==='table'){a.setAttribute('role','img');a.setAttribute('aria-label',item.title)}else a.setAttribute('aria-label','Apri immagine completa: '+item.title);
   a.append(artwork(item.image,page==='library'?[201,365,650,480]:[55,181,910,686],page==='library'?[1920,910]:[1638,910]));card.append(a);
   if(item.text){const content=page==='library'?el('details','m-reading'):el('div','m-copy');const prose=page==='library'?el('blockquote','m-excerpt'):content;if(page==='library'){content.append(el('summary','','Leggi il brano'));content.append(prose)}for(const paragraph of item.text)prose.append(el('p','',paragraph));card.append(content)}
   if(page!=='table')card.append(link('Apri la tavola completa ↗',item.image,'m-original'));main.append(card);
  }
 }
 // Hide the desktop scene from both pointer and keyboard interaction on phones.
 for(const child of document.body.children)if(child instanceof HTMLElement||child instanceof SVGElement){child.setAttribute('inert','');child.setAttribute('aria-hidden','true')}
 document.body.append(app);
})();
