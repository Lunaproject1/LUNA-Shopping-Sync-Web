const fs=require('fs'),assert=require('node:assert/strict');
// Run with jsdom installed (npm install --no-save jsdom), from repository root.
const {JSDOM,VirtualConsole}=require('jsdom');
function app(file,storage={}){
 const errors=[],html=fs.readFileSync(file,'utf8').replace(/<script[^>]*src=[^>]*><\/script>/g,'');
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://luna.test/notes.html',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.alert=m=>{throw Error(m)};for(const [k,v] of Object.entries(storage))w.localStorage.setItem(k,v)}});
 if(file==='notes-v015-test.html'){assert.equal(errors.length,1);assert.match(errors[0],/Cannot access 'location'/);console.log('BASELINE bootstrap ReferenceError reproduced')}else if(errors.length)throw Error(errors.join('\n'));return dom;
}
const old=app('notes-v015-test.html');
for(const [name,input] of [['formatting','[ ] **Task** __important__ [red]red[/red]'],['trailing','Line\n'],['empty checklist','[ ]\n**Questions**\n? Why']]){
 old.window.setEditorContent(input);let actual=old.window.editorToMarkup();console.log('BASELINE',name,JSON.stringify({input,actual,failed:input!==actual}));assert.notEqual(actual,input);
}old.window.document.getElementById('contentVisual').innerHTML='A<div>B</div>';assert.equal(old.window.editorToMarkup(),'AB');console.log('BASELINE fused blocks reproduced');old.window.close();
let dom=app(process.argv[2]||'notes-v016-test.html'),w=dom.window,d=w.document,total=0;
assert.equal(d.querySelector('.notesVersion').textContent,'v0.1.49 TEST');assert(d.title.endsWith('v0.1.49 TEST'));assert(d.querySelector('.footer').textContent.includes('v0.1.49 TEST'));total+=3;
const samples=['','Plain text','Line\n','Line\n\n','\n\nLine','First\n\nThird','[ ] ','[ ] \n\n**Questions**\n? Why','[ ] **Task** __important__ [red]red[/red]','[X] Done\n[ ] Pending','  [ ] Indented\n\n[x] Finished','• One\n1. Two\n? Question','[red]**Bold** __underline__[/red]','[blue]First\nSecond[/blue]','[ ] [green]**Task**[/green]\n\nEnd\n','Literal <tag> & "quote"'];
for(const input of samples){let actual=input;for(let i=0;i<5;i++){w.setEditorContent(actual);actual=w.editorToMarkup();assert.equal(actual,input,'roundtrip '+JSON.stringify(input));total++}}
for(const [html,expected] of [['A<div>B</div>','A\nB'],['<div>A</div><div>B</div>','A\nB'],['<div>A</div><div><br></div><div>B</div>','A\n\nB'],['A<br><div>B</div>','A\nB'],['<p>A</p><p><br></p><p>B</p>','A\n\nB'],['<div><br></div><div>B</div>','\nB'],['A<div><br></div>','A\n'],['<b>A<br>B</b>','**A**\n**B**']]){d.getElementById('contentVisual').innerHTML=html;assert.equal(w.editorToMarkup(),expected,html);total++}
const empty='[ ] \n\n**Questions**\n? Why';let box=d.createElement('div');box.innerHTML=w.richNoteHtml(empty,true);assert.equal(box.querySelectorAll('input').length,1);assert.equal(box.querySelector('.inlineCheck span').textContent,'');assert(!box.querySelector('.inlineCheck strong'));total++;
// Full application save -> localStorage -> fresh app -> edit -> save.
const body='**Context**\n\n[ ] __Task__ [red]urgent[/red]\n[x] Done\n[ ] \n\n**Questions**\n? Why\n';
w.newNote({title:'QA disposable',content:body,type:'Meeting'});w.save();assert.equal(w.eval('notes[0].content'),body);const id=w.eval('notes[0].id');const storage={};for(let i=0;i<w.localStorage.length;i++){const k=w.localStorage.key(i);storage[k]=w.localStorage.getItem(k)}dom.window.close();dom=app(process.argv[2]||'notes-v016-test.html',storage);w=dom.window;d=w.document;w.openNote(id);w.editNote();assert.equal(w.editorToMarkup(),body);w.save();assert.equal(w.eval('notes[0].content'),body);total+=3;
// View/Actions indices include completed and empty checkboxes.
w.eval("notes[0].content='[x] Completed\\n[ ] \\n[ ] Pending A\\n[ ] Pending B'");const actions=w.inlineActionItems(w.eval('notes[0]'));assert.deepEqual(Array.from(actions,x=>x.c.index),[2,3]);w.toggleInlineAction(id,3,true);assert.equal(w.eval('notes[0].content'),'[x] Completed\n[ ] \n[ ] Pending A\n[x] Pending B');total+=2;
// Transport conversion only: use the existing Notes row/from mapping, no cloud calls.
assert.equal(w.eval('cfg[0].from(cfg[0].row(notes[0])).content'),w.eval('notes[0].content'));total++;
// Cursor in a styled node must inspect preceding text on the same line.
w.setEditorContent('Header **Task**');let strong=d.querySelector('#contentVisual strong'),r=d.createRange();r.setStart(strong.firstChild,0);r.collapse(true);w.getSelection().removeAllRanges();w.getSelection().addRange(r);w.rememberEditorRange();w.visualFormat('check');assert.equal(w.editorToMarkup(),'Header \n[ ] **Task**');total++;
console.log('PASS',total,'assertions; local save/reload/edit and transport mapping verified; Android/layout/live sync NOT validated');w.close();
