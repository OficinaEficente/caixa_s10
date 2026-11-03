const CONTENT_NAME='Curso Reparo Caixa Direcao S10 Setor e Sem-fim';
const VALUE=89;
const CURRENCY='BRL';

function eventId(){
  return typeof crypto!=='undefined'&&crypto.randomUUID?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2,11)}`;
}

function readCookie(name){
  const prefix=`${name}=`;
  const row=document.cookie.split('; ').find(item=>item.startsWith(prefix));
  return row?decodeURIComponent(row.slice(prefix.length)):'';
}

function hasMetaClickId(){
  try{return new URLSearchParams(location.search).has('fbclid');}catch{return false;}
}

async function waitForMetaCookies(timeout=1500){
  const needsFbc=hasMetaClickId();
  const deadline=Date.now()+timeout;
  while(Date.now()<deadline){
    const fbp=readCookie('_fbp');
    const fbc=readCookie('_fbc');
    if(fbp&&(!needsFbc||fbc))return;
    await new Promise(resolve=>setTimeout(resolve,75));
  }
}

function trackMeta(name,custom={},userData={}){
  const id=eventId();
  if(typeof window.fbq==='function'){
    window.fbq('track',name,custom,{eventID:id});
  }

  (async()=>{
    await waitForMetaCookies();
    await fetch('/api/track',{
      method:'POST',
      headers:{'content-type':'application/json'},
      credentials:'same-origin',
      body:JSON.stringify({
        event_name:name,
        event_id:id,
        event_source_url:location.href,
        custom_data:custom,
        user_data:userData
      }),
      keepalive:true
    });
  })().catch(()=>{});

  return id;
}

async function initMeta(){
  try{
    const response=await fetch('/config.js',{cache:'no-store'});
    if(!response.ok)return;
    const js=await response.text();
    new Function(js)();
    const pixelId=window.OE_CONFIG?.metaPixelId;
    if(!pixelId)return;

    !function(f,b,e,v,n,t,s){
      if(f.fbq)return;
      n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];
      t=b.createElement(e);t.async=!0;t.src=v;
      s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s);
    }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');

    window.fbq('set','autoConfig',false,pixelId);
    window.fbq('init',pixelId);
    trackMeta('PageView');
    trackMeta('ViewContent',{content_name:CONTENT_NAME,value:VALUE,currency:CURRENCY});
  }catch(error){
    console.warn('Meta tracking init skipped',error);
  }
}

'use strict';
const modal = document.querySelector('#enrollment');
let opener;
document.querySelectorAll('[data-enroll]').forEach(button => {
  button.addEventListener('click', () => {
    opener = button;
    modal.showModal();
    if(typeof window.gtag==='function') window.gtag('event','open_enrollment_info',{content_name:CONTENT_NAME});
    document.body.classList.add('modal-open');
  });
});
modal.querySelectorAll('.modal-close, [data-close]').forEach(button => button.addEventListener('click', () => modal.close()));
modal.addEventListener('click', event => {
  if (event.target !== modal) return;
  const r = modal.getBoundingClientRect();
  if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) modal.close();
});
modal.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  opener?.focus();
});

initMeta();
