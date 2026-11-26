const fs=require('fs'),os=require('os'),path=require('path'),{spawn}=require('child_process');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'anniversary-qa-'));
const downloads=path.join(temp,'downloads');fs.mkdirSync(downloads);
const html='__anniversary_qa.html',jsx='__anniversary_qa.tsx';
fs.writeFileSync(html,'<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="root"></div><script type="module" src="/'+jsx+'"></script></body></html>');
fs.writeFileSync(jsx,'import React from "react";import {createRoot} from "react-dom/client";import "./src/index.css";import {PhotoPuzzle} from "./src/components/birthday/PhotoPuzzle";import {FinalLetterSection} from "./src/components/birthday/FinalLetterSection";createRoot(document.getElementById("root")!).render(location.search.includes("letter")?<FinalLetterSection onComplete={()=>{}}/>:<PhotoPuzzle imageSrc="/photos/puzzle-1.svg" loveLine="Test" onComplete={()=>{}}/>);');
const proc=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+temp,'--window-size=1280,900','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const assert=(v,m)=>{if(!v)throw Error(m);console.log('PASS '+m);};
async function until(fn,ms=15000){const end=Date.now()+ms;while(Date.now()<end){try{const x=await fn();if(x)return x;}catch{}await sleep(200);}throw Error('Timed out');}
let ws;let id=0;const pending=new Map();const errors=[];
async function main(){
const port=await until(()=>{const f=path.join(temp,'DevToolsActivePort');return fs.existsSync(f)&&fs.readFileSync(f,'utf8').split('\n')[0].trim();});
const pages=await(await fetch('http://127.0.0.1:'+port+'/json/list')).json();ws=new WebSocket(pages.find(p=>p.type==='page').webSocketDebuggerUrl);
await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text);};
const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}));});
async function ev(expression){const r=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;}
async function nav(p){await call('Page.navigate',{url:'http://127.0.0.1:5178/'+p});await sleep(800);}
async function mouse(type,x,y,button='none'){await call('Input.dispatchMouseEvent',{type,x,y,button,buttons:type==='mouseReleased'?0:button==='left'?1:0,clickCount:1});}
async function click(x,y){await mouse('mousePressed',x,y,'left');await mouse('mouseReleased',x,y,'left');await sleep(150);}
await call('Runtime.enable');await call('Page.enable');await call('Page.setDownloadBehavior',{behavior:'allow',downloadPath:downloads});
await nav('create');await until(()=>ev('document.querySelectorAll("input[type=file]").length===12'));
assert(await ev('Promise.all([...document.images].map(i=>i.decode().then(()=>true).catch(()=>false))).then(a=>a.length===12&&a.every(Boolean))'),'12 anime images decode in customization studio');
await ev(`(()=>{const a=[...document.querySelectorAll("input")];const set=(e,v)=>{Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set.call(e,v);e.dispatchEvent(new Event("input",{bubbles:true}));};set(a[0],"QA Alex");set(a[1],"QA Mia");document.querySelector("details").open=true;const q=[...document.querySelectorAll("input")].find(e=>e.closest("label")?.textContent.startsWith("Question 1"));set(q,"QA question");})()`);
await sleep(150);await ev('[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Build My Website")).click()');
await until(()=>ev('!!sessionStorage.getItem("anniversary-preview")'));
const cfg=await ev('JSON.parse(sessionStorage.getItem("anniversary-preview"))');
assert(cfg.FINAL_GALLERY.photos.length===7&&cfg.LOVE_QUESTIONS.length===5,'customization preserves fixed gallery and question counts');
assert(cfg.FINAL_LETTER.paragraphs.some(p=>p.includes('QA Mia'))&&cfg.LOVE_QUESTIONS[0].question==='QA question','custom name and question saved');
await ev('[...document.querySelectorAll("button")].find(b=>b.textContent.includes("Download website ZIP")).click()');
const zipPath=path.join(downloads,'my-anniversary-website.zip');await until(()=>fs.existsSync(zipPath),30000);
const z=fs.readFileSync(zipPath);let offset=0,entries=new Map();while(z.readUInt32LE(offset)===0x04034b50){const len=z.readUInt32LE(offset+18),nl=z.readUInt16LE(offset+26),ex=z.readUInt16LE(offset+28);const name=z.toString('utf8',offset+30,offset+30+nl);const start=offset+30+nl+ex;entries.set(name,z.subarray(start,start+len));offset=start+len;}
assert(entries.size>=40&&entries.get('index.html').toString().includes('window.__ANNIVERSARY_CONFIG__=')&&entries.get('index.html').toString().includes('QA Mia'),'downloaded ZIP contains personalized configuration and website files');
assert(entries.get('photos/hero.svg').length>100000,'download includes new anime art');
await nav('?preview=1');await until(()=>ev('document.body.innerText.includes("QA question")'));assert(true,'personalized preview renders the edited question');
await nav(html);await until(()=>ev('document.querySelectorAll("[data-puzzle-index]").length===9'));
const grid=()=>ev('[...document.querySelectorAll("[data-puzzle-index]")].map(x=>x.getAttribute("aria-label"))');
const point=i=>ev(`(()=>{const r=document.querySelector('[data-puzzle-index="${i}"]').getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()`);
const expected=(a,f,t)=>{a=[...a];a.splice(t,0,a.splice(f,1)[0]);return a;};
let old=await grid();let a=await point(0),b=await point(7);await click(...a);await click(...b);assert(JSON.stringify(await grid())===JSON.stringify(expected(old,0,7)),'click selection moves across board and shifts intervening tiles');
old=await grid();a=await point(0);b=await point(5);await mouse('mousePressed',...a,'left');for(let i=1;i<=8;i++){await mouse('mouseMoved',a[0]+(b[0]-a[0])*i/8,a[1]+(b[1]-a[1])*i/8,'left');await sleep(30);}await mouse('mouseReleased',...b,'left');await sleep(250);assert(JSON.stringify(await grid())===JSON.stringify(expected(old,0,5)),'real pointer drag moves tile and shifts neighbors');
old=await grid();a=await point(0);await mouse('mousePressed',...a,'left');await mouse('mouseMoved',900,700,'left');await mouse('mouseReleased',900,700,'left');await sleep(150);assert(JSON.stringify(await grid())===JSON.stringify(old),'outside drop leaves puzzle unchanged');
await nav(html+'?letter');await until(()=>ev('document.body.innerText.includes("Drag heart seal")'));const seal=await ev(`(()=>{const el=document.querySelector('[class*="bottom-1"][class*="ml-7"][class*="z-40"]');if(!el)return null;const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return {diff:Math.abs(a.x+a.width/2-b.x-b.width/2),x:a.x+a.width/2,y:a.y+a.height/2};})()`);assert(seal&&seal.diff<2,'heart seal horizontally centered');await mouse('mousePressed',seal.x,seal.y,'left');for(let i=1;i<=10;i++){await mouse('mouseMoved',seal.x,seal.y-i*8,'left');await sleep(35);}await mouse('mouseReleased',seal.x,seal.y-80,'left');await until(()=>ev('document.body.innerText.includes("Drag scroll up")'));assert(true,'heart seal drag opens envelope');
console.log('Browser runtime exception count:',errors.length);
}
main().catch(e=>{console.error('FAIL',e.message);process.exitCode=1;}).finally(async()=>{if(ws)ws.close();proc.kill();for(const f of [html,jsx])try{fs.unlinkSync(f)}catch{};await sleep(500);try{fs.rmSync(temp,{recursive:true,force:true})}catch{};});
