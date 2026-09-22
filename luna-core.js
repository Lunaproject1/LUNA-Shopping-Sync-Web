(()=>{if(!('serviceWorker' in navigator))return;
const register=()=>navigator.serviceWorker.register('./sw.js',{updateViaCache:'none'}).then(r=>{
  r.update().catch(()=>{});
  setInterval(()=>r.update().catch(()=>{}),60000);
}).catch(()=>{});
if(document.readyState==='loading')addEventListener('DOMContentLoaded',register,{once:true});else register();
})();