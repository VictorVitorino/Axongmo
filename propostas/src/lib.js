"use strict";
const NS="http://www.w3.org/2000/svg",$=id=>document.getElementById(id);
function S(t,a,p){const e=document.createElementNS(NS,t);if(a)for(const k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function H(t,a,p,x){const e=document.createElement(t);if(a)for(const k in a){if(k==="class")e.className=a[k];else if(k==="style")e.style.cssText=a[k];else if(k==="html")e.innerHTML=a[k];else e.setAttribute(k,a[k])}if(x!=null)e.textContent=x;if(p)p.appendChild(e);return e}
function T(p,x,y,s,a){const t=S("text",Object.assign({x,y},a||{}),p);t.textContent=s;return t}
function tip(el,v,l){el.setAttribute("data-tv",v);el.setAttribute("data-tl",l||"")}
function path(d,a,p){return S("path",Object.assign({d},a||{}),p)}
function fo(p,x,y,w,h,html,style){const f=S("foreignObject",{x,y,width:w,height:h},p);f.innerHTML=`<div xmlns="http://www.w3.org/1999/xhtml" style="${style||""}">${html}</div>`;return f}
function mk(svg,id,c){const d=S("defs",null,svg),m=S("marker",{id,viewBox:"0 0 10 10",refX:"9",refY:"5",markerWidth:"7",markerHeight:"7",orient:"auto-start-reverse"},d);S("path",{d:"M0 0L10 5L0 10z",fill:c},m)}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function count(el,from,to,suf){const t0=performance.now(),d=900;const st=t=>{const k=Math.min(1,(t-t0)/d),e=1-Math.pow(1-k,3),v=from+(to-from)*e;el.textContent=(k<1?Math.round(v):to).toLocaleString("pt-BR")+(suf||"");if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st)}
const ENTER={};
const IC={people:'<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M15 14.5c3 0 6 2 6 5.5"/>',
flag:'<path d="M5 21V4"/><path d="M5 4h12l-2.5 4L17 12H5"/>',
clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V2.5h6V4"/><path d="M8.5 10h7M8.5 14h7M8.5 18h4"/>',
wall:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 10h18M3 15h18M9 5v5M15 10v5M9 15v4"/>',
link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
fork:'<path d="M12 21v-7M12 14 6 8M12 14l6-6M6 8V3M18 8V3"/>',
refresh:'<path d="M20 12a8 8 0 1 1-2.3-5.7"/><path d="M20 4v5h-5"/>',
chat:'<path d="M4 5h16v11H9l-5 4z"/>',
star:'<path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/>',
search:'<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
bolt:'<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
warn:'<path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.5"/>',
box:'<path d="M12 2 3 7v10l9 5 9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
flow:'<circle cx="5" cy="6" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7.5 6h9M6.5 8l4 8M17.5 8l-4 8"/>',
sliders:'<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
cloud:'<path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18z"/>',
out:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>',
cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/>',
coin:'<circle cx="12" cy="12" r="8"/><path d="M14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5v1.5M12 16v1.5"/>',
bug:'<rect x="7" y="8" width="10" height="12" rx="5"/><path d="M12 8v12M9 5l1.5 3M15 5l-1.5 3M3 12h4M17 12h4M4 18l3-2M20 18l-3-2M4 7l3 2M20 7l-3 2"/>',
inbox:'<path d="M3 13l3-8h12l3 8v6H3z"/><path d="M3 13h5l1.5 3h5L16 13h5"/>',
book:'<path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z"/><path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z"/>',
cap:'<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
megaphone:'<path d="M3 10v4h4l8 5V5L7 10z"/><path d="M18 9a4 4 0 0 1 0 6"/>',
chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
map:'<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/>',
hand:'<path d="M7 11V6a1.5 1.5 0 0 1 3 0v4M10 10V4.5a1.5 1.5 0 0 1 3 0V10M13 10V5.5a1.5 1.5 0 0 1 3 0V12M16 9.5a1.5 1.5 0 0 1 3 0V15a6 6 0 0 1-6 6h-1a6 6 0 0 1-5-2.7L4 13.5a1.5 1.5 0 0 1 2.4-1.8L7 12.5"/>',
code:'<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>',
ai:'<path d="M12 3l1.8 4.7L18.5 9l-4.7 1.8L12 15.5l-1.8-4.7L5.5 9l4.7-1.3z"/><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9z"/>',
drive:'<rect x="3" y="13" width="18" height="7" rx="2"/><path d="M5 13l3-8h8l3 8"/><circle cx="17" cy="16.5" r="1"/>',
layers:'<path d="M12 3 2 8l10 5 10-5z"/><path d="M2 13l10 5 10-5"/>',
clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
check:'<path d="M4 12l5 5L20 6"/>',
eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
pulse:'<path d="M2 12h4l3-7 4 14 3-7h6"/>',
gauge:'<path d="M4 18a9 9 0 1 1 16 0"/><path d="M12 13l4-5"/><circle cx="12" cy="13" r="1.5"/>'};
const icon=(k,c,w)=>`<svg viewBox="0 0 24 24" style="width:${w||22}px;height:${w||22}px;fill:none;stroke:${c||"#fff"};stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round">${IC[k]}</svg>`;

/* chevrons de fase */
function chev(el,P){if(!el)return;el.classList.add("chev");el.style.gridTemplateColumns=`repeat(${P.length},1fr)`;P.forEach(([n,t,w,d,c],i)=>{const x=H("div",{"data-a":"right",style:`--d:${4+i*.6};background:${c}`},el);const h=H("div",{class:"h"},x);H("span",null,h,n);H("span",null,h,t);H("span",null,h,w);H("div",{class:"d"},x,d)})}

/* Gantt de 6 meses: rows=[[nome,cor,[[mIni,mFim,rotulo,tracejado?],...],descr]], ms=[[mes(0-6 decimal),rotulo]] */
function gantt(s,R,opt){if(!s)return;opt=opt||{};const W=+s.getAttribute("viewBox").split(" ")[2],x0=opt.lab||300,x1=W-10,MW=(x1-x0)/6,XM=m=>x0+m*MW,rh=opt.rh||44,top=opt.top||50;
const Hh=top+R.length*rh+(opt.ms?40:6);
for(let m=0;m<6;m++){S("rect",{x:XM(m),y:top-26,width:MW,height:20,rx:4,fill:m%2?"#EEF3F8":"#E4EBF2"},s);T(s,XM(m)+MW/2,top-12,"Mês "+(m+1),{"text-anchor":"middle",fill:"#35516A",style:"font:800 11px var(--fb);letter-spacing:.06em"});S("line",{x1:XM(m),y1:top-4,x2:XM(m),y2:Hh-(opt.ms?34:4),stroke:"#E8EDF2"},s)}
S("line",{x1:XM(6),y1:top-4,x2:XM(6),y2:Hh-(opt.ms?34:4),stroke:"#E8EDF2"},s);
R.forEach(([n,c,bars,d],i)=>{const y=top+i*rh;S("rect",{x:0,y,width:x0-12,height:rh-6,rx:8,fill:"#fff",stroke:"#D6DEE6"},s);S("rect",{x:0,y,width:6,height:rh-6,fill:c},s);T(s,16,y+(d?17:(rh-6)/2+5),n,{fill:"#002B49",style:"font:700 13px var(--fb)"});if(d)T(s,16,y+32,d,{fill:"#6B7B8C",style:"font:500 10.5px var(--fb)"});
bars.forEach(([a,b,l,t],k)=>{const g=S("g",{"data-a":"grow",style:`--d:${3+i*.7+k*.4};transform-box:fill-box`},s);const x=XM(a)+3,w=XM(b)-XM(a)-6,bh=rh-18;S("rect",{x,y:y+6,width:w,height:bh,rx:6,fill:t?"#fff":c,stroke:c,"stroke-width":t?2:0,"stroke-dasharray":t?"6 4":"0"},g);T(g,x+w/2,y+6+bh/2+4,l,{"text-anchor":"middle",fill:t?c:"#fff",style:"font:700 11.5px var(--fb)"});tip(g,l,`${n} · ${fmtM(a,b)}`)})});
if(opt.ms){const y=Hh-22;S("line",{x1:x0,y1:y,x2:x1,y2:y,stroke:"#98A6B3","stroke-width":1.5,"stroke-dasharray":"2 5"},s);T(s,x0-20,y+4,"Marcos de decisão",{"text-anchor":"end",fill:"#B35F00",style:"font:800 11px var(--fb);letter-spacing:.08em;text-transform:uppercase"});
opt.ms.forEach(([m,l],k)=>{const x=XM(m),g=S("g",{"data-a":"pop",style:`--d:${10+k};transform-box:fill-box;transform-origin:center`},s);S("path",{d:`M${x} ${y-9}l9 9-9 9-9-9z`,fill:"#F78C16",stroke:"#fff","stroke-width":2},g);T(g,x+(m>5.5?-14:14),y+4,l,{"text-anchor":m>5.5?"end":"start",fill:"#002B49",style:"font:700 11px var(--fb)"});S("line",{x1:x,y1:top-4,x2:x,y2:y-10,stroke:"#F5B570","stroke-dasharray":"3 4"},g);tip(g,l,"Marco de decisão · "+(m%1?"meio do mês "+Math.ceil(m):"final do mês "+m))})}}
const fmtM=(a,b)=>{const f=v=>{const k=Math.floor(v+1e-6);return k+1>6?6:k+1};const A=f(a),B=Math.max(A,Math.ceil(b-1e-6));return A===B?`mês ${A}`:`meses ${A}–${B}`};

/* canvas da proposta: blocos [ícone, rótulo, título, html, escuro?] */
function canvas(el,B){if(!el)return;B.forEach(([ic,e,t,html,dk],i)=>{const x=H("div",{class:"card tlt"+(dk?" nv":""),"data-a":"up",style:`--d:${3+i*.45};border-radius:12px;padding:14px 18px;min-height:176px;display:flex;flex-direction:column;gap:8px;border-top:4px solid ${dk?"#F78C16":["#5E8AB4","#33556D","#1F3263","#F78C16","#002B49","#5E8AB4"][i%6]}`},el);
x.innerHTML=`<div style="display:flex;align-items:center;gap:10px"><span style="width:36px;height:36px;border-radius:50%;background:${dk?"#F78C16":"#122143"};display:grid;place-items:center;flex:none">${icon(ic,"#fff",18)}</span><div><div class="eye" style="margin:0;color:${dk?"#F9A64A":"#B35F00"}">${e}</div><div style="font:800 20px/1.1 var(--fh);color:${dk?"#fff":"#002B49"}">${t}</div></div></div><div style="font:500 13.5px/1.5 var(--fb);color:${dk?"#C8DBEB":"#35516A"}">${html}</div>`})}

/* registro de efeitos por tela: play ao entrar, stop ao sair */
const FXR={list:[],add(slide,inst){if(slide&&inst)this.list.push({slide,inst});return inst},run(n){this.list.forEach(o=>{if(o.slide!==n){try{o.inst.stop&&o.inst.stop()}catch(e){}}});this.list.forEach(o=>{if(o.slide===n){try{o.inst.play&&o.inst.play()}catch(e){console.error(e)}}})}};
const slideOf=el=>el&&el.closest(".slide");

/* Gantt com Progress Motion: um cursor percorre os meses, acende barras e marcos; hover destaca a linha (Data Highlight) */
function gantt2(s,R,opt){opt=opt||{};const vb=s.getAttribute("viewBox").split(" ").map(Number),W=vb[2],x0=opt.lab||250,x1=W-8,MW=(x1-x0)/6,XM=m=>x0+m*MW,rh=opt.rh||36,top=opt.top||26,yEnd=top+R.length*rh,yMs=yEnd+16;
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches;
for(let m=0;m<6;m++){S("rect",{x:XM(m)+1,y:0,width:MW-2,height:20,rx:4,fill:m%2?"#EEF3F8":"#E4EBF2"},s);T(s,XM(m)+MW/2,14,"Mês "+(m+1),{"text-anchor":"middle",fill:"#35516A",style:"font:800 11px var(--fb);letter-spacing:.06em"});S("line",{x1:XM(m),y1:22,x2:XM(m),y2:yMs,stroke:"#E8EDF2"},s)}
S("line",{x1:XM(6),y1:22,x2:XM(6),y2:yMs,stroke:"#E8EDF2"},s);
const bars=[],rows=[],mss=[];
R.forEach(([n,c,list,d],i)=>{const y=top+i*rh,g=S("g",{class:"g2row"},s);rows.push(g);S("rect",{x:0,y:y+1,width:x0-10,height:rh-6,rx:7,fill:"#fff",stroke:"#D6DEE6"},g);S("rect",{x:0,y:y+1,width:5,height:rh-6,fill:c},g);T(g,14,y+rh/2+2,n,{fill:"#002B49",style:"font:700 12.5px var(--fb)"});
S("rect",{x:x0,y,width:x1-x0,height:rh-4,fill:"transparent"},g);
list.forEach(([a,b,l,t])=>{const x=XM(a)+2,w=XM(b)-XM(a)-4,bh=rh-12,bg=S("g",{class:"g2bar"},g);S("rect",{x,y:y+3,width:w,height:bh,rx:5,fill:t?"#fff":c,stroke:c,"stroke-width":t?1.8:0,"stroke-dasharray":t?"5 4":"0"},bg);T(bg,x+w/2,y+3+bh/2+4,l,{"text-anchor":"middle",fill:t?c:"#fff",style:"font:700 11px var(--fb)"});tip(bg,l,`${n} · ${fmtM(a,b)}`);bars.push({g:bg,x})});
g.addEventListener("pointerenter",()=>{s.classList.add("g2dim");rows.forEach(r=>r.classList.toggle("hi",r===g))});});
s.addEventListener("pointerleave",()=>{s.classList.remove("g2dim");rows.forEach(r=>r.classList.remove("hi"))});
if(opt.ms){S("line",{x1:x0,y1:yMs,x2:x1,y2:yMs,stroke:"#98A6B3","stroke-width":1.4,"stroke-dasharray":"2 5"},s);T(s,x0-14,yMs+4,"Marcos de decisão",{"text-anchor":"end",fill:"#B35F00",style:"font:800 10.5px var(--fb);letter-spacing:.08em;text-transform:uppercase"});
opt.ms.forEach(([m,l])=>{const x=XM(m),g=S("g",{class:"g2ms"},s);S("line",{x1:x,y1:22,x2:x,y2:yMs-9,stroke:"#F5B570","stroke-dasharray":"3 4"},g);S("path",{d:`M${x} ${yMs-9}l9 9-9 9-9-9z`,fill:"#F78C16",stroke:"#fff","stroke-width":2},g);T(g,x+(m>5.5?-13:13),yMs+4,l,{"text-anchor":m>5.5?"end":"start",fill:"#002B49",style:"font:700 11px var(--fb)"});tip(g,l,"Marco de decisão · "+(m%1?"meio do mês "+Math.ceil(m):"final do mês "+m));mss.push({g,x})})}
const cur=S("g",{class:"g2cur",opacity:0},s);S("line",{x1:0,y1:20,x2:0,y2:yMs+10,stroke:"#F78C16","stroke-width":2.5},cur);S("rect",{x:-30,y:-2,width:60,height:20,rx:10,fill:"#F78C16"},cur);const ct=T(cur,0,12,"mês 1",{"text-anchor":"middle",fill:"#0E1C39",style:"font:800 10.5px var(--fb)"});
let raf=0,t0=0;const dur=opt.dur||5200;
function set(x){bars.forEach(b=>b.g.classList.toggle("on",x>=b.x));mss.forEach(m=>m.g.classList.toggle("on",x>=m.x-1));cur.setAttribute("transform",`translate(${x},0)`);const m=Math.min(6,Math.floor((x-x0)/MW)+1);ct.textContent="mês "+m;if(opt.onMonth)opt.onMonth(m)}
function stop(){cancelAnimationFrame(raf);raf=0}
function play(){stop();if(RM){cur.setAttribute("opacity",0);set(x1+1);return}cur.setAttribute("opacity",1);set(x0-1);t0=0;const st=t=>{if(!t0)t0=t;const k=Math.min(1,(t-t0-400)/dur);set(x0+(x1-x0)*Math.max(0,k));if(k<1)raf=requestAnimationFrame(st);else{set(x1+1);cur.setAttribute("opacity",0);if(opt.onMonth)opt.onMonth(0)}};raf=requestAnimationFrame(st)}
set(x1+1);return{play,stop}}

/* Capa · Particle System (réplica do efeito 30 do Guia DTS, sem os controles) */
function fxCoverParticles(root,opts){opts=opts||{};const cv=root.querySelector(".cv4-cv"),ctx=cv.getContext("2d"),nOut=root.querySelector("[data-n]"),lOut=root.querySelector("[data-links]"),fOut=root.querySelector("[data-fps]");
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,W=1600,H=900,count=RM?60:(opts.count||140),SPEED=RM?.07:.28,LINK=opts.link||128,CUR=170,rnd=(a,b)=>a+Math.random()*(b-a);
let P=[],pulses=[],cursor=null,idle=0,raf=0,last=0,fa=0,fn=0;
const spawn=()=>{const hub=Math.random()<.07;return{x:rnd(0,W),y:rnd(0,H),vx:rnd(-1,1)*SPEED,vy:rnd(-1,1)*SPEED,r:hub?rnd(3.6,4.6):rnd(1.6,2.8),hub}};
function fit(){const r=cv.getBoundingClientRect(),k=r.width?r.width/W:1,pr=Math.min(2,Math.max(1,(devicePixelRatio||1)*k));cv.width=Math.round(W*pr);cv.height=Math.round(H*pr);ctx.setTransform(pr,0,0,pr,0,0)}
const loc=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}};
root.addEventListener("pointermove",e=>{cursor=loc(e);idle=0});root.addEventListener("pointerleave",()=>cursor=null);
root.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;const c=loc(e);pulses.push({x:c.x,y:c.y,r:0,a:1})});
function frame(t){const dt=last?Math.min(50,t-last):16.7;last=t;const k=dt/16.7,L2=LINK*LINK;
for(const p of P){if(cursor){const dx=p.x-cursor.x,dy=p.y-cursor.y,d2=dx*dx+dy*dy;if(d2<CUR*CUR&&d2>1){const d=Math.sqrt(d2),f=(1-d/CUR)*.9*k;p.vx+=dx/d*f;p.vy+=dy/d*f}}
for(const u of pulses){const dx=p.x-u.x,dy=p.y-u.y,d=Math.sqrt(dx*dx+dy*dy);if(d>2&&Math.abs(d-u.r)<26){const f=1.4*k*u.a;p.vx+=dx/d*f;p.vy+=dy/d*f}}
p.vx*=.975;p.vy*=.975;const sp=Math.hypot(p.vx,p.vy);if(sp>3.2){p.vx*=3.2/sp;p.vy*=3.2/sp}if(sp<SPEED*.6){p.vx+=rnd(-.02,.02)*k;p.vy+=rnd(-.02,.02)*k}
p.x+=p.vx*k;p.y+=p.vy*k;if(p.x<0){p.x=0;p.vx=Math.abs(p.vx)}else if(p.x>W){p.x=W;p.vx=-Math.abs(p.vx)}if(p.y<0){p.y=0;p.vy=Math.abs(p.vy)}else if(p.y>H){p.y=H;p.vy=-Math.abs(p.vy)}}
for(let q=pulses.length-1;q>=0;q--){const u=pulses[q];u.r+=7*k;u.a-=.016*k;if(u.a<=0)pulses.splice(q,1)}
idle+=dt;const cf=cursor?Math.max(0,Math.min(1,1-(idle-400)/600)):0;
ctx.clearRect(0,0,W,H);let links=0;ctx.lineWidth=1;
for(let i=0;i<P.length;i++){const a=P[i];for(let j=i+1;j<P.length;j++){const b=P[j],dx=a.x-b.x,dy=a.y-b.y,d2=dx*dx+dy*dy;if(d2<L2){ctx.strokeStyle=`rgba(163,184,214,${((1-Math.sqrt(d2)/LINK)*.55).toFixed(3)})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();links++}}}
if(cursor&&cf>0){for(const p of P){const d=Math.hypot(p.x-cursor.x,p.y-cursor.y);if(d<CUR){ctx.strokeStyle=`rgba(255,138,76,${((1-d/CUR)*.5*cf).toFixed(3)})`;ctx.beginPath();ctx.moveTo(cursor.x,cursor.y);ctx.lineTo(p.x,p.y);ctx.stroke()}}ctx.strokeStyle=`rgba(255,138,76,${(.3*cf).toFixed(3)})`;ctx.beginPath();ctx.arc(cursor.x,cursor.y,CUR,0,7);ctx.stroke()}
for(const u of pulses){ctx.strokeStyle=`rgba(255,255,255,${(u.a*.5).toFixed(3)})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(u.x,u.y,u.r,0,7);ctx.stroke();ctx.lineWidth=1}
for(const p of P){ctx.fillStyle=p.hub?"#FF8A4C":"#C9D6E8";if(p.hub){ctx.shadowColor="rgba(255,138,76,.9)";ctx.shadowBlur=12}ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.fill();ctx.shadowBlur=0}
fa+=dt;fn++;if(fn>=20){if(fOut)fOut.textContent=String(Math.min(60,Math.round(1000/(fa/fn))));if(lOut)lOut.textContent=String(links);fa=0;fn=0}
if(!RM)raf=requestAnimationFrame(frame)}
function play(){stop();fit();P=[];for(let i=0;i<count;i++)P.push(spawn());if(nOut)nOut.textContent=String(count);root.classList.remove("in");void root.offsetWidth;root.classList.add("in");last=0;raf=requestAnimationFrame(frame)}
function stop(){cancelAnimationFrame(raf);raf=0}
addEventListener("resize",()=>{if(raf)fit()});return{play,stop}}

/* Capa · rede de neurônios: começa com um neurônio delicado; cada pulso ou clique faz crescer outro, que liga o axônio a um vizinho e propaga o impulso */
function fxCoverNeurons(root,opts){opts=opts||{};const cv=root.querySelector(".cv4-cv"),ctx=cv.getContext("2d"),nOut=root.querySelector("[data-n]"),lOut=root.querySelector("[data-links]"),fOut=root.querySelector("[data-fps]"),btn=root.querySelector(".cv4-pulse");
const RM=matchMedia("(prefers-reduced-motion: reduce)").matches,W=1600,H=900,MAX=opts.max||11;let sd=11;const rnd=(a,b)=>{sd=(sd*16807)%2147483647;return a+(sd/2147483647)*(b-a)};
const SLOTS=[[1110,420],[1370,250],[1400,640],[880,650],[1210,790],[1500,440],[980,190],[790,400],[1260,560],[1520,820],[700,800]];
const bake=document.createElement("canvas");bake.width=W;bake.height=H;const bx=bake.getContext("2d");bx.lineCap="round";bx.lineJoin="round";
let N=[],sig=[],aps=[],sparks=[],cursor=null,raf=0,last=0,now=0,fa=0,fn=0,fired=0,timers=[],tD=0,tAuto=0;
function makeNeuron(x,y,target){const n={x,y,segs:[],tips:[],target,born:now,grown:false,charge:0,r:rnd(6.5,8.5),flash:0};
const prim=Math.round(rnd(5,7)),a0=rnd(0,6.28);let axA;if(target>=0){const t=N[target];axA=Math.atan2(t.y-y,t.x-x)}else axA=opts.axA!=null?opts.axA:.55;
function branch(px,py,ang,len,w,depth,t0,path){const n2=5;let a=ang,cx=px,cy=py;const pts=[[px,py]];for(let i=0;i<n2;i++){a+=rnd(-.22,.22);const nx=cx+Math.cos(a)*len/n2,ny=cy+Math.sin(a)*len/n2;n.segs.push({x0:cx,y0:cy,x1:nx,y1:ny,w:w*(1-i*.08),t0:t0+i*45});
if(len>26&&rnd(0,1)<.55){const sa=a+(rnd(0,1)<.5?1.5:-1.5),sl=rnd(2.5,5);n.segs.push({x0:nx,y0:ny,x1:nx+Math.cos(sa)*sl,y1:ny+Math.sin(sa)*sl,w:.6,t0:t0+i*45+60,sp:1})}cx=nx;cy=ny;pts.push([nx,ny])}
const full=path.concat(pts.slice(1));if(depth<=0||len<14){n.tips.push(full.slice().reverse());return}const k=rnd(0,1)<.7?2:3;for(let j=0;j<k;j++)branch(cx,cy,a+rnd(-.8,.8),len*rnd(.58,.78),w*.66,depth-1,t0+n2*45,full)}
for(let i=0;i<prim;i++){let ang=a0+i*6.28/prim+rnd(-.25,.25);if(Math.abs(((ang-axA+9.42)%6.28)-3.14)<.5)ang+=.6;branch(x+Math.cos(ang)*n.r*.8,y+Math.sin(ang)*n.r*.8,ang,rnd(48,74),1.9,3,rnd(0,120),[[x,y]])}
/* axônio */
let ex,ey;if(target>=0){const t=N[target],d=Math.hypot(t.x-x,t.y-y);ex=x+(t.x-x)*(1-34/d);ey=y+(t.y-y)*(1-34/d)}else{const L=opts.axLen||200;ex=x+Math.cos(axA)*L;ey=y+Math.sin(axA)*L}
const sx=x+Math.cos(axA)*n.r,sy=y+Math.sin(axA)*n.r,dx=ex-sx,dy=ey-sy,dl=Math.hypot(dx,dy),nx=-dy/dl,ny=dx/dl,bend=rnd(-.22,.22)*dl,c1=[sx+dx*.33+nx*bend,sy+dy*.33+ny*bend],c2=[sx+dx*.66-nx*bend*.6,sy+dy*.66-ny*bend*.6];
const ax=[];let L=0;for(let i=0;i<=120;i++){const t=i/120,u=1-t,p=[u*u*u*sx+3*u*u*t*c1[0]+3*u*t*t*c2[0]+t*t*t*ex,u*u*u*sy+3*u*u*t*c1[1]+3*u*t*t*c2[1]+t*t*t*ey];if(i)L+=Math.hypot(p[0]-ax[i-1][0],p[1]-ax[i-1][1]);p[2]=L;ax.push(p)}n.ax=ax;n.axL=L;
n.nodes=[];for(let s2=14;s2<L-10;s2+=16)n.nodes.push(s2);
n.term=[];const ta=Math.atan2(ey-ax[110][1],ex-ax[110][0]);for(let j=0;j<5;j++){const aa=ta+(j-2)*.42+rnd(-.12,.12),l=rnd(12,22),mx=ex+Math.cos(aa)*l*.55+rnd(-2,2),my=ey+Math.sin(aa)*l*.55+rnd(-2,2);n.term.push({pts:[[ex,ey],[mx,my],[ex+Math.cos(aa)*l,ey+Math.sin(aa)*l]],flash:0})}
n.tDend=Math.max(...n.segs.map(s=>s.t0))+220;return n}
const at=(n,s)=>{s=Math.max(0,Math.min(n.axL,s));let i=1;while(i<n.ax.length-1&&n.ax[i][2]<s)i++;const a=n.ax[i-1],b=n.ax[i],k=(s-a[2])/((b[2]-a[2])||1);return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k]};
function drawNeuron(c,n,age,glow){const T=RM?1e9:age;c.save();if(glow){c.shadowColor="rgba(176,77,255,.75)";c.shadowBlur=7}
for(const s of n.segs){if(T<s.t0)continue;const k=Math.min(1,(T-s.t0)/200);c.strokeStyle=s.sp?"rgba(214,170,255,.75)":"rgba(186,120,255,.88)";c.lineWidth=Math.max(.5,s.w);c.beginPath();c.moveTo(s.x0,s.y0);c.lineTo(s.x0+(s.x1-s.x0)*k,s.y0+(s.y1-s.y0)*k);c.stroke()}
/* soma */
const sk=Math.min(1,T/300);const g=c.createRadialGradient(n.x-2,n.y-2,1,n.x,n.y,n.r*2.2);g.addColorStop(0,"rgba(250,235,255,1)");g.addColorStop(.35,"rgba(190,110,255,.95)");g.addColorStop(.8,"rgba(110,10,170,.5)");g.addColorStop(1,"rgba(110,10,170,0)");c.fillStyle=g;c.beginPath();c.arc(n.x,n.y,n.r*2.2*sk,0,7);c.fill();
/* axônio e mielina */
const ta=n.tDend*.55,ap=Math.max(0,Math.min(1,(T-ta)/900)),sl=n.axL*ap;if(ap>0){c.strokeStyle="rgba(210,160,255,.9)";c.lineWidth=1.3;c.beginPath();for(let i=0;i<n.ax.length&&n.ax[i][2]<=sl;i++){const p=n.ax[i];i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1])}c.stroke();
c.lineCap="round";for(const nd of n.nodes){if(nd>sl)break;const a=at(n,nd-13),b=at(n,nd-3);c.strokeStyle="rgba(138,0,196,.95)";c.lineWidth=4.4;c.beginPath();c.moveTo(a[0],a[1]);c.lineTo(b[0],b[1]);c.stroke();c.strokeStyle="rgba(235,205,255,.55)";c.lineWidth=1.1;c.beginPath();c.moveTo(a[0],a[1]-1.2);c.lineTo(b[0],b[1]-1.2);c.stroke()}}
if(ap>=1){const tk=Math.min(1,(T-ta-900)/300);for(const t of n.term){c.strokeStyle="rgba(210,160,255,.85)";c.lineWidth=.9;c.beginPath();c.moveTo(t.pts[0][0],t.pts[0][1]);c.quadraticCurveTo(t.pts[1][0],t.pts[1][1],t.pts[0][0]+(t.pts[2][0]-t.pts[0][0])*tk,t.pts[0][1]+(t.pts[2][1]-t.pts[0][1])*tk);c.stroke();if(tk>=1){c.fillStyle="rgba(255,160,100,.95)";c.beginPath();c.arc(t.pts[2][0],t.pts[2][1],2.1,0,7);c.fill()}}}
c.restore();return ap>=1&&T>ta+1250}
function spawn(x,y){if(N.length>=MAX)return-1;let tg=-1,bd=1e9;N.forEach((m,j)=>{const d=Math.hypot(m.x-x,m.y-y);if(d<bd&&d>90){bd=d;tg=j}});const n=makeNeuron(x,y,tg);N.push(n);count();return N.length-1}
function count(){if(nOut)nOut.textContent=String(N.length);if(lOut)lOut.textContent=String(N.filter(n=>n.target>=0).length)}
function fire(i){const n=N[i];if(!n||!n.grown)return;aps.push({n:i,s:0,v:RM?n.axL:6.2});n.flash=1;fired++;if(fOut)fOut.textContent=String(fired)}
function nextSlot(){for(const s of SLOTS){if(!N.some(n=>Math.hypot(n.x-s[0],n.y-s[1])<120))return s}return[rnd(760,1540),rnd(80,840)]}
function pulse(){fire(0);const s=nextSlot();spawn(s[0]+rnd(-20,20),s[1]+rnd(-20,20))}
function fit(){const r=cv.getBoundingClientRect(),k=r.width?r.width/W:1,pr=Math.min(2,Math.max(1,(devicePixelRatio||1)*k));cv.width=Math.round(W*pr);cv.height=Math.round(H*pr);ctx.setTransform(pr,0,0,pr,0,0)}
const loc=e=>{const r=cv.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height}};
root.addEventListener("pointermove",e=>{cursor=loc(e)});root.addEventListener("pointerleave",()=>cursor=null);
root.addEventListener("pointerdown",e=>{if(e.target.closest("button,a"))return;const p=loc(e);let hit=-1;N.forEach((n,j)=>{if(Math.hypot(n.x-p.x,n.y-p.y)<60)hit=j});if(hit>=0)fire(hit);else if(p.x>600)spawn(Math.min(1560,p.x),Math.max(60,Math.min(850,p.y)))});
if(btn)btn.addEventListener("click",e=>{e.stopPropagation();pulse()});
const dust=[];for(let i=0;i<60;i++)dust.push({x:Math.random()*W,y:Math.random()*H,r:.5+Math.random()*1.2,vx:(Math.random()-.5)*.2,vy:(Math.random()-.5)*.16,a:.12+Math.random()*.3});
function frame(t){const dt=last?Math.min(50,t-last):16.7;last=t;now+=dt;const k=dt/16.7;ctx.clearRect(0,0,W,H);
for(const d of dust){d.x+=d.vx*k;d.y+=d.vy*k;if(d.x<0)d.x=W;if(d.x>W)d.x=0;if(d.y<0)d.y=H;if(d.y>H)d.y=0;ctx.fillStyle=`rgba(201,214,232,${d.a})`;ctx.beginPath();ctx.arc(d.x,d.y,d.r,0,7);ctx.fill()}
ctx.drawImage(bake,0,0);
N.forEach(n=>{if(!n.grown){if(drawNeuron(ctx,n,now-n.born,false)){n.grown=true;drawNeuron(bx,n,1e9,true)}}});
/* sinais dendríticos */
tD+=dt;if(tD>(cursor?140:380)){tD=0;const g=N.filter(n=>n.grown);if(g.length){let n=g[Math.floor(Math.random()*g.length)];if(cursor){let bd=1e9;g.forEach(m=>{const d=Math.hypot(m.x-cursor.x,m.y-cursor.y);if(d<bd){bd=d;n=m}})}sig.push({n,p:n.tips[Math.floor(Math.random()*n.tips.length)],i:0,f:0})}}
for(let q=sig.length-1;q>=0;q--){const s=sig[q];s.f+=.5*k;while(s.f>=1){s.f-=1;s.i++}if(s.i>=s.p.length-1){sig.splice(q,1);s.n.charge+=.22;if(s.n.charge>=1){s.n.charge=0;fire(N.indexOf(s.n))}continue}const a=s.p[s.i],b=s.p[s.i+1];ctx.fillStyle="rgba(245,225,255,.95)";ctx.beginPath();ctx.arc(a[0]+(b[0]-a[0])*s.f,a[1]+(b[1]-a[1])*s.f,1.6,0,7);ctx.fill()}
tAuto+=dt;if(tAuto>3200){tAuto=0;fire(0)}
/* somas acesas */
ctx.save();ctx.globalCompositeOperation="lighter";N.forEach(n=>{if(!n.grown)return;n.flash=Math.max(0,n.flash-.025*k);const e=Math.min(1,.25+n.charge*.5+n.flash);const g=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*4);g.addColorStop(0,`rgba(220,160,255,${.45*e})`);g.addColorStop(1,"rgba(176,77,255,0)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(n.x,n.y,n.r*4,0,7);ctx.fill()});ctx.restore();
/* potenciais de ação saltando entre nós */
for(let q=aps.length-1;q>=0;q--){const a=aps[q],n=N[a.n];a.s+=a.v*k;if(a.s>=n.axL){aps.splice(q,1);n.term.forEach(t=>t.flash=1);if(n.target>=0){const tg=N[n.target];for(let j=0;j<7;j++){const t=n.term[j%n.term.length].pts[2];sparks.push({x:t[0],y:t[1],tx:tg.x,ty:tg.y,f:0,v:rnd(.02,.035),tg:n.target})}}continue}
const nd=n.nodes.find(v=>v>a.s),p=at(n,a.s);ctx.save();ctx.globalCompositeOperation="lighter";const rg=ctx.createRadialGradient(p[0],p[1],0,p[0],p[1],16);rg.addColorStop(0,"rgba(255,255,255,.95)");rg.addColorStop(.3,"rgba(214,140,255,.75)");rg.addColorStop(1,"rgba(176,77,255,0)");ctx.fillStyle=rg;ctx.beginPath();ctx.arc(p[0],p[1],16,0,7);ctx.fill();if(nd){const q2=at(n,nd);ctx.fillStyle="rgba(255,180,120,.8)";ctx.beginPath();ctx.arc(q2[0],q2[1],2.6,0,7);ctx.fill()}ctx.restore()}
N.forEach(n=>n.term.forEach(t=>{if(!t.flash)return;t.flash=Math.max(0,t.flash-.03*k);ctx.save();ctx.shadowColor="#FF8A4C";ctx.shadowBlur=12*t.flash;ctx.fillStyle=`rgba(255,190,130,${t.flash})`;ctx.beginPath();ctx.arc(t.pts[2][0],t.pts[2][1],2.2+2*t.flash,0,7);ctx.fill();ctx.restore()}));
/* neurotransmissores atravessando a sinapse */
for(let q=sparks.length-1;q>=0;q--){const s=sparks[q];s.f+=s.v*k;if(s.f>=1){sparks.splice(q,1);const tg=N[s.tg];tg.charge+=.2;if(tg.charge>=1){tg.charge=0;fire(s.tg)}continue}const x=s.x+(s.tx-s.x)*s.f,y=s.y+(s.ty-s.y)*s.f;ctx.fillStyle=`rgba(255,170,110,${1-s.f*.6})`;ctx.beginPath();ctx.arc(x,y,1.5,0,7);ctx.fill()}
if(cursor){ctx.strokeStyle="rgba(214,140,255,.22)";ctx.beginPath();ctx.arc(cursor.x,cursor.y,70,0,7);ctx.stroke()}
fa+=dt;fn++;if(fn>30){fa=0;fn=0}
if(!RM)raf=requestAnimationFrame(frame)}
function play(){stop();fit();sd=11;N=[];sig=[];aps=[];sparks=[];fired=0;now=0;tAuto=0;bx.clearRect(0,0,W,H);spawn(SLOTS[0][0],SLOTS[0][1]);if(fOut)fOut.textContent="0";root.classList.remove("in");void root.offsetWidth;root.classList.add("in");last=0;
timers.push(setTimeout(()=>{const s=nextSlot();spawn(s[0],s[1])},RM?0:2600));timers.push(setTimeout(()=>{const s=nextSlot();spawn(s[0],s[1])},RM?0:5200));
if(RM){N.forEach(n=>{n.grown=true;drawNeuron(bx,n,1e9,true)});frame(0)}else raf=requestAnimationFrame(frame)}
function stop(){cancelAnimationFrame(raf);raf=0;timers.forEach(clearTimeout);timers=[]}
addEventListener("resize",()=>{if(raf)fit()});return{play,stop}}
