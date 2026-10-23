'use strict';
(()=>{
const EXPECTED='0.1.13-tug60-r5',ROOT=new URL('../',location.href),status=document.getElementById('status'),button=document.getElementById('apply'),open=document.getElementById('open');
function show(message,error=false){status.textContent=message;status.classList.toggle('error',error);}
function version(worker){return new Promise(resolve=>{if(!worker)return resolve(null);const channel=new MessageChannel(),timer=setTimeout(()=>{channel.port1.close();resolve(null);},1500);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data?.version||null);};try{worker.postMessage({type:'TUGI_VERSION'},[channel.port2]);}catch{clearTimeout(timer);channel.port1.close();resolve(null);}});}
function state(worker,allowed){return new Promise((resolve,reject)=>{const timer=setTimeout(()=>finish(Error('A atualização ainda não terminou. Mantém a rede ligada e volta a tentar.')),30000);function finish(error){clearTimeout(timer);worker.removeEventListener('statechange',changed);error?reject(error):resolve();}function changed(){if(allowed.includes(worker.state))finish();else if(worker.state==='redundant')finish(Error('Não foi possível preparar os ficheiros. A instalação anterior mantém-se disponível.'));}worker.addEventListener('statechange',changed);changed();});}
button.addEventListener('click',async()=>{button.disabled=true;open.hidden=true;try{
 if(!('serviceWorker'in navigator))throw Error('Este navegador não disponibiliza a atualização da PWA.');
 const registration=await navigator.serviceWorker.getRegistration(ROOT.href);
 if(!registration||registration.scope!==ROOT.href)throw Error('Não encontrei a instalação neste navegador. Abre esta página no mesmo Brave/Chrome em que instalaste a TUGI. Nenhum dado foi alterado.');
 for(const worker of [registration.active,registration.waiting,registration.installing].filter(Boolean))if(new URL(worker.scriptURL).href!==new URL('sw.js',ROOT).href)throw Error('A instalação encontrada não corresponde à TUGI. Nenhum dado foi alterado.');
 show('A procurar e preparar a atualização…');await registration.update();
 const candidate=registration.installing||registration.waiting;
 if(candidate)await state(candidate,['installed','activated']);
 const waiting=registration.waiting;
 if(waiting){if(await version(waiting)!==EXPECTED)throw Error('A atualização recebida ainda não é a revisão 5. Mantém a rede ligada e volta a tentar.');show('Ficheiros preparados. A ativar a atualização…');waiting.postMessage({type:'TUGI_ACTIVATE',version:EXPECTED});await state(waiting,['activated']);}
 if(await version(registration.active)!==EXPECTED)throw Error('A revisão 5 ainda não ficou ativa. Fecha os separadores TUGI e volta a tentar nesta página.');
 show('Atualização 5 ativa. Os dados foram mantidos. Abre a aplicação atualizada e testa Ligar Google → Sincronizar agora.');open.hidden=false;
 }catch(error){show(error.message,true);}finally{button.disabled=false;}});
})();
