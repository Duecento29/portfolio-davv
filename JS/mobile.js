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
  const hero=el('img','m-hero');hero.src='assets/intro/composizione-sfondo-allineato.png';hero.alt='Composizione Vedo, sento, parlo';hero.width=1254;hero.height=1254;main.append(hero);
  const links=el('div','m-links');const subtitles={table:'Design e sperimentazioni',mirror:'Opere e immagini',library:'Libri e letture',about:'Contatti e curriculum'};
  for(const id of ['table','mirror','library','about']){const a=link('',pages[id][1],'m-tile');a.append(el('strong','',pages[id][0]+' ↗'),el('span','',subtitles[id]));links.append(a)}main.append(links);
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
   const a=link('',item.image,'m-art');a.setAttribute('aria-label','Apri immagine completa: '+item.title);
   a.append(artwork(item.image,page==='library'?[201,365,650,480]:[55,181,910,686],page==='library'?[1920,910]:[1638,910]));card.append(a);
   if(item.text){const content=page==='library'?el('details'):el('div','m-copy');if(page==='library')content.append(el('summary','','Leggi il brano'));for(const paragraph of item.text)content.append(el('p','',paragraph));card.append(content)}
   card.append(link('Apri la tavola completa ↗',item.image,'m-original'));main.append(card);
  }
 }
 // Hide the desktop scene from both pointer and keyboard interaction on phones.
 for(const child of document.body.children)if(child instanceof HTMLElement||child instanceof SVGElement){child.setAttribute('inert','');child.setAttribute('aria-hidden','true')}
 document.body.append(app);
})();
