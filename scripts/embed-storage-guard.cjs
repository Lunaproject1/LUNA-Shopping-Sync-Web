const fs=require('fs');
const configurations={
 'notes-v013.html':{app:'notes',keys:{'luna.notes.v01':'array','luna.notes.checks.v01':'array','luna.notes.history.v01':'array'}},
 'notes-v016-test.html':{app:'notes',keys:{'luna.notes.v01':'array','luna.notes.checks.v01':'array','luna.notes.history.v01':'array'}},
 'finance.html':{app:'finance',keys:Object.fromEntries(['v01','history.v01','cards.v01','accounts.v01','reconciliation.v01','breakdown.v01','delete_queue.v01','recurring.v01','goals.v01'].map(k=>['luna.finance.'+k,'array']).concat([['luna.finance.breakdown.meta.v01','object'],['luna.finance.fx_history.v01','object']]))},
 'training.html':{app:'training',keys:{'luna.training.v010':'training'}},
 'shopping.html':{app:'shopping',keys:Object.fromEntries(['v01','lists.v01','history.v01','purchasehistory.v02'].map(k=>['luna.shopping.'+k,'array']).concat([['luna.shopping.learned.v01','object']]))}
};configurations['finance-v0298.html']=configurations['finance.html'];
const source=fs.readFileSync('src/luna-storage-guard.js','utf8');
for(const [file,cfg]of Object.entries(configurations)){
 let s=fs.readFileSync(file,'utf8');
 s=s.replace(/<script data-luna-storage-guard>[\s\S]*?<\/script>\n?/,'');
 s=s.replace(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g,(all,attrs='',body)=>/\bsrc\s*=/.test(attrs)?all:'<script'+attrs+'>\nif(window.LunaStorage)window.LunaStorage.assertReady();\n'+body.replace(/^\nif\(window.LunaStorage\)window.LunaStorage.assertReady\(\);\n/,'')+'</script>');
 const guard='<script data-luna-storage-guard>\n'+source.replace('LUNA_STORAGE_CONFIG',JSON.stringify(cfg))+'\n</script>\n';
 s=s.replace(/<script\b/,guard+'<script');fs.writeFileSync(file,s);
}
