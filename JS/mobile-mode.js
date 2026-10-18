/* Phone layout is selected before the desktop controllers start. */
(() => {
 const query=matchMedia('(max-width: 600px), (max-width: 1100px) and (hover: none) and (pointer: coarse)');
 window.DAVV_MOBILE=query.matches;
 document.documentElement.classList.toggle('mobile-site',query.matches);
 // Portrait and landscape phones use the same layout and keep their scroll state.
 query.addEventListener('change',()=>location.reload());
})();
