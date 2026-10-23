const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const dir=path.resolve(__dirname,'..'),C=require('../core.js');
test('TUG-59 release retains exact TUG-57 sync fix, PWA identity/icons and storage schema',()=>{
 const frozen={
  'sync.js':'dc49b54e45448693722d73665d16108119d28d28336f0be2562c92138a76c57e',
  'manifest.webmanifest':'edd095a9cbfd74c15d410d66f2e0cecafc175d5d8ea8da5521979f0756d01de0',
  'icons/icon-192.png':'f038341846a640c1eb02b9e46d303615e26f5a0d711d4af9bdc3beb257e43d83',
  'icons/icon-512.png':'32396202bdacef7f2b1718fb64f0d89489d3b39f3b4214957719fdbe34703727'
 };
 for(const [name,sha]of Object.entries(frozen))assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path.join(dir,name))).digest('hex'),sha,name);
 assert.equal(C.SCHEMA,2);assert.equal(C.DB_NAME,'luna-tugi-v2');assert.equal(C.VERSION,'0.1.13 TEST');
 const oldCore=fs.readFileSync(path.join(dir,'core.js'),'utf8').replace("VERSION='0.1.13 TEST'","VERSION='0.1.11 TEST'");
 assert.equal(crypto.createHash('sha256').update(oldCore).digest('hex'),'cc0e280d72cbb36cf7ad415d408a575c4475d51065ad8258a8190c07523671cf','core implementation is unchanged apart from version');
});
