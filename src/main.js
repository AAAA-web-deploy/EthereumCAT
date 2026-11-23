/* Site controls, navigation, and launch-safe token fields. Works over file:// too. */
const art=new HeroPainter();
const blockMonitor=new BlockMonitor();
let toastTimer;
function toast(message){
  const el=document.getElementById('notice');if(!el)return;
  el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>el.classList.remove('visible'),4500);
}
function validContract(){return /^0x[a-fA-F0-9]{40}$/.test(CONFIG.contractAddress)}
function safeExternal(url){
  if(typeof url!=='string'||!url.trim())return null;
  try{const parsed=new URL(url);return ['http:','https:'].includes(parsed.protocol)?parsed.href:null}catch{return null}
}
function handleAction(action,network){
  if(action==='buy'){
    const href=safeExternal(CONFIG.buyUrl);
    if(validContract()&&href)window.open(href,'_blank','noopener,noreferrer');
    else toast('Trading opens after the verified ETHCAT contract and swap link are published.');
  }else if(action==='social'){
    const href=safeExternal(CONFIG.socials[network]);
    if(href)window.open(href,'_blank','noopener,noreferrer');
    else toast(`${network||'Social'} link has not been configured yet.`);
  }else if(action==='copy-contract'){
    if(!validContract()){toast('The contract address has not been published yet.');return}
    if(navigator.clipboard?.writeText)navigator.clipboard.writeText(CONFIG.contractAddress).then(()=>toast('Contract address copied'),()=>toast(`Contract: ${CONFIG.contractAddress}`));
    else toast(`Contract: ${CONFIG.contractAddress}`);
  }
}
function initToken(){
  document.getElementById('contract-value').textContent=validContract()?CONFIG.contractAddress:'Not published';
  document.getElementById('supply-value').textContent=CONFIG.tokenSupply||'To be confirmed';
  document.getElementById('tax-value').textContent=CONFIG.transferTax||'To be confirmed';
}
function initNavigation(){
  const toggle=document.getElementById('menu-toggle');const nav=document.getElementById('main-nav');
  toggle.addEventListener('click',()=>{
    const open=!nav.classList.contains('menu-open');nav.classList.toggle('menu-open',open);
    toggle.setAttribute('aria-expanded',String(open));
  });
  const links=[...document.querySelectorAll('.nav-link')];
  links.forEach(link=>link.addEventListener('click',()=>{nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false')}});
  const ids=['home','cat','block-room','token','community'];
  let scrolling=false;
  function refreshActive(){
    const marker=window.innerHeight*.35+document.querySelector('.site-header').getBoundingClientRect().height;
    let active='home';
    for(const id of ids){const el=document.getElementById(id);if(el&&el.getBoundingClientRect().top<=marker)active=id}
    for(const link of links){const match=link.getAttribute('href')==='#'+active;link.classList.toggle('is-current',match);if(match)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current')}
    scrolling=false;
  }
  window.addEventListener('scroll',()=>{if(!scrolling){scrolling=true;requestAnimationFrame(refreshActive)}},{passive:true});
  window.addEventListener('resize',refreshActive,{passive:true});refreshActive();
}
function initActions(){document.querySelectorAll('[data-action]').forEach(btn=>btn.addEventListener('click',()=>handleAction(btn.dataset.action,btn.dataset.network)))}
function initAnimationControls(){
  const sr=document.getElementById('a11y-status');
  document.getElementById('replay').addEventListener('click',()=>{
    paintGallery(false);art.start();
    // Gallery begins to color again as the user reaches each section.
    const visible=[...document.querySelectorAll('.paint-pair')].filter(el=>el.getBoundingClientRect().top<window.innerHeight);
    setTimeout(()=>visible.forEach(el=>el.classList.add('revealed')),1800);
    sr.textContent='Replaying pencil drawing and natural color filling.';
  });
  document.getElementById('skip').addEventListener('click',()=>{art.finish();paintGallery(true);sr.textContent='Full color artwork shown.'});
  document.getElementById('compare').addEventListener('click',()=>{
    art.toggle();paintGallery(art.mode!=='pencil');sr.textContent=art.mode==='pencil'?'Pencil-only artwork':'Color artwork';
  });
}
function boot(){
  initToken();initNavigation();initActions();initAnimationControls();setupGalleryPainting();
  document.getElementById('refresh-block').addEventListener('click',()=>blockMonitor.refresh());
  art.init();blockMonitor.start();
  window.addEventListener('beforeunload',()=>blockMonitor.stop());
  window.__ETHCAT__={skip:()=>{art.finish();paintGallery(true)},replay:()=>art.start(),pencil:()=>{art.pencil();paintGallery(false)},get state(){return art.mode},get latestBlock(){return blockMonitor.latest}};
}
boot();
