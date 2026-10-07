/* ===== Casca de apresentação A&M · mesma navegação, chrome e efeitos do modelo TMG =====
   Cada deck define window.DECK antes deste script e preenche ENTER[t] para animações por tela. */
"use strict";
const DK=window.DECK;
const AMDECO=`<svg class="am-deco" viewBox="0 0 520 80" preserveAspectRatio="xMaxYMid slice" aria-hidden="true"><path d="M40 80 L100 0" stroke="#F78C16" stroke-width="1.4" fill="none"/><path d="M150 80 L210 0" stroke="#5E8AB4" stroke-width="7" fill="none" opacity=".55"/><path d="M190 80 V0" stroke="#F78C16" stroke-width="1.2" opacity=".7"/><path d="M280 80 L340 0" stroke="#5E8AB4" stroke-width="16" fill="none" opacity=".45"/><path d="M350 80 V0" stroke="#5E8AB4" stroke-width="5" opacity=".45"/><path d="M420 80 L480 0" stroke="#F78C16" stroke-width="1.4" fill="none" opacity=".8"/></svg>`;

const slides=[...document.querySelectorAll(".slide")],N=slides.length;let cur=0,busy=false;
const REDMO=matchMedia("(prefers-reduced-motion: reduce)").matches;
function kin(el){let k=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const parts=c.textContent.split(/(\s+)/),f=document.createDocumentFragment();parts.forEach(p=>{if(!p)return;if(/^\s+$/.test(p)){f.appendChild(document.createTextNode(p));return}const w=document.createElement("span");w.className="kw";const i=document.createElement("span");i.style.setProperty("--k",k++);i.textContent=p;w.appendChild(i);f.appendChild(w)});c.replaceWith(f)}else if(c.nodeType===1&&!c.classList.contains("kw"))walk(c)})};walk(el)}

/* ---------- chrome: cabeçalho, faixa e rodapé ---------- */
slides.forEach((s,i)=>{if(s.dataset.band){const top=H("div",{class:"sr-top"});const p=(s.dataset.p||"").split(" · ");
top.innerHTML=`${AMDECO}<div class="am-wm"><span class="am-a">Alvarez &amp; Marsal</span><span class="am-s">${DK.brandSub}</span></div><div class="am-div"></div><div class="am-title"><b>${s.dataset.t}</b><span>${p.length>1?"Parte "+p[0]+" · "+p[1]:(p[0]||"")}</span></div><div class="am-right"><span class="am-dot"></span>${DK.rightLabel}<span class="am-chip">${i+1} / ${N}</span></div>`;s.prepend(top);
s.prepend(H("div",{class:"sr-dec"},null,"▸▸▸▸▸▸▸▸▸▸▸▸"));const band=H("div",{class:"sr-band "+(s.dataset.c||"c-navy")});band.innerHTML=`<span>›</span><span class="bt">${s.dataset.band}</span>${s.dataset.bs?`<small>${s.dataset.bs}</small>`:""}`;top.after(band);kin(band.querySelector(".bt"))}
if(s.hasAttribute("data-nofoot"))return;const f=H("div",{class:"foot"},s);H("b",null,f,DK.footLabel);if(s.dataset.src)H("span",{class:"s",title:s.dataset.src},f,s.dataset.src);H("span",{class:"n"},f,`${i+1} / ${N}`)});
document.querySelectorAll(".kin").forEach(kin);

/* ---------- roteiro (agenda) no resumo executivo ---------- */
(function(){const ag=$("agenda");if(!ag)return;DK.parts.filter(p=>p[3]).forEach(([lab,key,desc,col],i)=>{const l=slides.map((x,j)=>x.dataset.p===key?j:-1).filter(j=>j>=0);if(!l.length)return;const n=key.split(" · ")[0];
const b=H("button",{class:"clk","data-a":"up",style:`--d:${12+i};display:grid;grid-template-columns:34px 1fr;gap:10px;align-items:center;text-align:left;background:#fff;border:1.5px solid var(--line);border-top:4px solid ${col};border-radius:12px;padding:7px 12px`},ag);
H("div",{style:`font:800 27px var(--fh);color:${col}`},b,n);const x=H("div",null,b);H("div",{style:"font:800 14px var(--fh);color:var(--navy);white-space:nowrap"},x,`Parte ${n} · ${lab} · telas ${l[0]+1}–${l[l.length-1]+1}`);H("div",{class:"small",style:"font-size:10.5px"},x,desc);b.addEventListener("click",()=>go(l[0]))})})();

function fit(){const vw=innerWidth,vh=innerHeight,sm=vw<760,pad=sm?8:22,bar=sm?54:64,sc=Math.min((vw-pad*2)/1600,(vh-pad-bar)/900),st=$("stage");st.style.left=vw/2+"px";st.style.top=(pad+(vh-pad-bar)/2)+"px";st.style.transform=`translate(-50%,-50%) scale(${sc})`}
addEventListener("resize",fit);
function counters(n){n.querySelectorAll("[data-count]").forEach(el=>{const to=+el.dataset.count,suf=el.dataset.suf||"";count(el,0,to,suf)})}
function activate(i,inst,back){const n=slides[i];slides.forEach((s,k)=>{if(k!==i)s.classList.remove("active","entering","play","back")});n.classList.remove("play","entering","back");void n.offsetWidth;n.classList.add("active","play");if(!inst){n.classList.add("entering");if(back)n.classList.add("back")}cur=i;
$("cnt").textContent=`${i+1} / ${N}`;$("progress").style.width=((i+1)/N*100)+"%";$("bPrev").disabled=i===0;$("bNext").disabled=i===N-1;try{history.replaceState(null,"","#"+(i+1))}catch(e){}
n.querySelectorAll(".lv .fl[data-w]").forEach(f=>{f.style.transition="none";f.style.width="0";void f.offsetWidth;f.style.transition="";setTimeout(()=>f.style.width=f.dataset.w+"%",350)});
n.querySelectorAll(".gbar").forEach(r=>{r.style.transition="none";r.setAttribute("width",0);void r.getBoundingClientRect();r.style.transition="width 1s cubic-bezier(.2,.7,.2,1)";setTimeout(()=>r.setAttribute("width",r.dataset.w),350)});
counters(n);const fn=ENTER[n.dataset.t];if(fn)fn()}
function chapter(meta,done){const c=$("chap");c.innerHTML=`<div class="n">${meta[0]}</div><div class="ey">PARTE ${meta[0]}</div><h1>${meta[1]}</h1><p>${meta[2]}</p><div class="ln"></div><div class="sk">clique para pular ›</div>`;kin(c.querySelector("h1"));c.classList.add("on","play");
const ln=c.querySelector(".ln"),p=c.querySelector("p"),nn=c.querySelector(".n");ln.animate([{width:"0px"},{width:"520px"}],{duration:900,delay:300,easing:"cubic-bezier(.2,.7,.2,1)",fill:"forwards"});p.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:700,delay:500,fill:"backwards"});nn.animate([{opacity:0,transform:"translateX(80px)"},{opacity:1,transform:"none"}],{duration:1300,easing:"cubic-bezier(.2,.7,.2,1)"});
let ended=false;const end=()=>{if(ended)return;ended=true;c.animate([{opacity:1},{opacity:0}],{duration:450}).onfinish=()=>{c.classList.remove("on","play");c.innerHTML=""};done()};c.onclick=end;setTimeout(end,2100)}
function go(i,inst){i=Math.max(0,Math.min(N-1,i));if(i===cur&&!inst)return;if(busy)return;const back=i<cur,prevP=slides[cur].dataset.p,nextP=slides[i].dataset.p;
if(inst||REDMO){activate(i,true,back);return}
const chap=!back&&nextP!==prevP&&DK.chapters[nextP];busy=true;const w=$("wipe");w.style.visibility="visible";const bars=[...w.querySelectorAll("i")],dir=back?-1:1;
bars.forEach((b,k)=>b.animate([{transform:`translateX(${-110*dir}%) skewX(-12deg)`},{transform:"translateX(0) skewX(-12deg)"}],{duration:420,delay:k*70,easing:"cubic-bezier(.7,0,.3,1)",fill:"forwards"}));
setTimeout(()=>{const after=()=>{bars.forEach((b,k)=>b.animate([{transform:"translateX(0) skewX(-12deg)"},{transform:`translateX(${110*dir}%) skewX(-12deg)`}],{duration:460,delay:(2-k)*70,easing:"cubic-bezier(.7,0,.3,1)",fill:"forwards"}));setTimeout(()=>{w.style.visibility="hidden";busy=false},640)};
if(chap){activate(i,true,back);slides[i].classList.remove("play");chapter(chap,()=>{const n=slides[i];void n.offsetWidth;n.classList.add("play");counters(n);const fn=ENTER[n.dataset.t];if(fn)fn()});after()}else{activate(i,false,back);after()}},560)}
$("bNext").onclick=()=>go(cur+1);$("bPrev").onclick=()=>go(cur-1);
addEventListener("keydown",e=>{if(e.target.tagName==="INPUT")return;if(["ArrowRight","PageDown"," "].includes(e.key)){e.preventDefault();go(cur+1)}else if(["ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();go(cur-1)}else if(e.key==="Home")go(0);else if(e.key==="End")go(N-1);else if(e.key==="f"||e.key==="F"){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen?.()}});
let tx=null;addEventListener("touchstart",e=>{tx=e.touches[0].clientX},{passive:true});addEventListener("touchend",e=>{if(tx==null||e.target.tagName==="INPUT")return;const dx=e.changedTouches[0].clientX-tx;if(Math.abs(dx)>60)dx<0?go(cur+1):go(cur-1);tx=null},{passive:true});
const tp=$("tip");addEventListener("pointermove",e=>{const el=e.target.closest&&e.target.closest("[data-tv]");if(el){tp.querySelector("b").textContent=el.dataset.tv;tp.querySelector("span").textContent=el.dataset.tl;tp.classList.add("on");tp.style.left=Math.min(e.clientX+14,innerWidth-330)+"px";tp.style.top=(e.clientY+14)+"px"}else tp.classList.remove("on")});
fit();const h0=parseInt(location.hash.slice(1),10);cur=isNaN(h0)?0:Math.max(0,Math.min(N-1,h0-1));activate(cur,true);

/* ===== camada de efeitos (trilha narrativa, ripple, tilt, ampliar, sobre o slide, índice) ===== */
(function(){
const FX={modal:false};const stage=$("stage");const SC=()=>stage.getBoundingClientRect().width/1600;
/* trilha narrativa */
const rail=H("div",{id:"rail"},document.body);FX.rail=DK.parts.map(([n,key])=>{const idx=slides.map((s,i)=>((s.dataset.p||"Contexto")===key)?i:-1).filter(i=>i>=0);if(!idx.length)return null;const d=H("div",{class:"seg2",style:`width:${Math.max(n.length*8+14,idx.length*18)}px`},rail);H("span",null,d,n);const bar=H("i",null,d);const b=H("b",null,bar);d.addEventListener("click",()=>go(idx[0]));d.title=`${n} · telas ${idx[0]+1}–${idx[idx.length-1]+1}`;return{idx,d,b}}).filter(Boolean);
/* indicador deslizante dos seletores */
function segSync(){document.querySelectorAll(".seg").forEach(sg=>{if(!sg.offsetParent)return;let ind=sg.querySelector(".seg-ind");if(!ind){ind=H("span",{class:"seg-ind"});sg.prepend(ind)}const on=sg.querySelector("button.on");if(on){ind.style.left=on.offsetLeft+"px";ind.style.width=on.offsetWidth+"px"}})}
document.querySelectorAll(".seg").forEach(sg=>new MutationObserver(()=>requestAnimationFrame(segSync)).observe(sg,{attributes:true,subtree:true,attributeFilter:["class"]}));
/* ripple */
document.addEventListener("pointerdown",e=>{if(REDMO)return;const el=e.target.closest("button,.clk,.xp");if(!el||el.closest(".flip")||el.id==="chap"||el.closest("#idxP"))return;if(getComputedStyle(el).position==="static")el.style.position="relative";el.style.overflow="hidden";const r=el.getBoundingClientRect(),sc=stage.contains(el)?SC():1,x=(e.clientX-r.left)/sc,y=(e.clientY-r.top)/sc,size=Math.max(r.width,r.height)/sc*1.1;const sp=H("span",{class:"rp",style:`width:${size}px;height:${size}px;left:${x-size/2}px;top:${y-size/2}px`},el);setTimeout(()=>sp.remove(),650)});
/* tilt 3D + glare */
function tilt(el){if(REDMO)return;if(el.dataset.a){const w=H("div",{style:"display:grid;perspective:900px"});w.dataset.a=el.dataset.a;w.style.setProperty("--d",el.style.getPropertyValue("--d")||"0");el.removeAttribute("data-a");el.parentNode.insertBefore(w,el);w.appendChild(el)}else el.parentNode.style.perspective="900px";
el.classList.add("tilt");if(getComputedStyle(el).position==="static")el.style.position="relative";H("span",{class:"tilt-glare"},el);
el.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;el.style.transform=`rotateX(${(0.5-py)*6}deg) rotateY(${(px-0.5)*6}deg) translateZ(4px)`;el.style.setProperty("--gx",px*100+"%");el.style.setProperty("--gy",py*100+"%")});el.addEventListener("pointerleave",()=>{el.style.transform=""})}
document.querySelectorAll(".tlt,#agenda > button").forEach(tilt);
/* botões magnéticos */
if(!REDMO)["bNext","bPrev"].forEach(id=>{const b=$(id);addEventListener("pointermove",e=>{if(b.disabled){b.style.transform="";return}const r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),d=Math.hypot(dx,dy);b.style.transform=d<80?`translate(${dx*.16}px,${dy*.16}px)`:""})});
/* parallax da capa */
const cvTxt=$("cvText"),cvArt=$("cvArt");if(!REDMO&&cvTxt&&cvArt){cvTxt.style.transition=cvArt.style.transition="transform .5s ease-out";stage.addEventListener("pointermove",e=>{const r=stage.getBoundingClientRect(),dx=(e.clientX-r.left)/r.width-.5,dy=(e.clientY-r.top)/r.height-.5;if(cur===0){cvArt.style.transform=`translate(${-dx*20}px,${-dy*14}px)`;cvTxt.style.transform=`translate(${dx*8}px,${dy*6}px)`}const n=$("chap").querySelector(".n");if(n)n.style.transform=`translate(${-dx*40}px,${-dy*24}px)`});stage.addEventListener("pointerleave",()=>{cvArt.style.transform="";cvTxt.style.transform=""})}
/* aurora da capa */
(function(){const au=document.createElement("canvas");au.width=400;au.height=225;au.style.cssText="position:absolute;inset:0;width:1600px;height:900px;filter:blur(34px);opacity:.8;pointer-events:none";slides[0].prepend(au);const ax=au.getContext("2d");let run=false;
const blobs=[[.22,.34,130,"94,138,180",.42],[.68,.62,160,"31,50,99",.7],[.56,.22,90,"247,140,22",.13],[.86,.84,120,"157,187,217",.26],[.4,.8,110,"18,33,67",.5]];
function fr(t){if(!run)return;ax.clearRect(0,0,400,225);blobs.forEach(([bx,by,r,c,a],i)=>{const x=bx*400+Math.sin(t/4200+i)*44,y=by*225+Math.cos(t/5200+i*1.3)*26;const g=ax.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,`rgba(${c},${a})`);g.addColorStop(1,`rgba(${c},0)`);ax.fillStyle=g;ax.fillRect(0,0,400,225)});requestAnimationFrame(fr)}
FX.aurora={start(){if(run||REDMO)return;run=true;requestAnimationFrame(fr)},stop(){run=false}}})();
/* ampliar gráficos (modal focus) */
(function(){const fzm=H("div",{id:"fzm"},stage),box=H("div",{class:"box"},fzm),cl=H("button",{class:"cl",title:"Fechar"},box,"✕"),tt=H("div",{class:"ttl2"},box),host=H("div",null,box);H("div",{class:"hint2"},box,"Esc ou clique fora para fechar");
function close(){fzm.classList.remove("on");host.innerHTML="";FX.modal=false}cl.addEventListener("click",close);fzm.addEventListener("click",e=>{if(e.target===fzm)close()});
addEventListener("keydown",e=>{if(FX.modal){if(e.key==="Escape")close();e.stopImmediatePropagation()}},true);
function open(el,title){host.innerHTML="";tt.textContent=title;const W=1460,Hh=700;let node;
if(el.tagName==="svg"){node=el.cloneNode(true);const vb=el.viewBox.baseVal,ar=vb.width/vb.height;let w=W,h=W/ar;if(h>Hh){h=Hh;w=Hh*ar}node.setAttribute("width",w);node.setAttribute("height",h);node.style.cssText=`width:${w}px;height:${h}px;max-width:none`;host.appendChild(node)}
else{node=el.cloneNode(true);const r=el.getBoundingClientRect(),sc=SC(),w0=r.width/sc,h0=r.height/sc,k=Math.min(W/w0,Hh/h0);const wr=H("div",{style:`width:${w0*k}px;height:${h0*k}px;overflow:hidden`},host);node.style.transform=`scale(${k})`;node.style.transformOrigin="0 0";node.style.width=w0+"px";node.style.height=h0+"px";node.style.animation="none";wr.appendChild(node)}
node.querySelectorAll("[data-a]").forEach(x=>x.removeAttribute("data-a"));node.querySelectorAll(".dr").forEach(x=>x.classList.remove("dr"));
box.classList.toggle("dark",!!el.closest(".dk")||!!el.closest(".slide.dark"));fzm.classList.add("on");FX.modal=true}
const targets=(DK.zoom||[]).map(id=>$(id)).filter(Boolean);
const fzb=H("button",{class:"fzb",title:"Ampliar (duplo clique também amplia)"},stage,"⤢");let cur_=null,hide=0;
targets.forEach(el=>{el.addEventListener("pointerenter",()=>{clearTimeout(hide);cur_=el;const r=el.getBoundingClientRect(),sr=stage.getBoundingClientRect(),sc=sr.width/1600;fzb.style.left=((r.right-sr.left)/sc-40)+"px";fzb.style.top=((r.top-sr.top)/sc+6)+"px";fzb.style.opacity=1});el.addEventListener("pointerleave",()=>{hide=setTimeout(()=>fzb.style.opacity=0,450)});el.addEventListener("dblclick",()=>open(el,el.closest(".slide").dataset.t))});
fzb.addEventListener("pointerenter",()=>clearTimeout(hide));fzb.addEventListener("pointerleave",()=>{hide=setTimeout(()=>fzb.style.opacity=0,300)});fzb.addEventListener("click",()=>{if(cur_)open(cur_,cur_.closest(".slide").dataset.t)});
FX.hideFz=()=>{fzb.style.opacity=0}})();
FX.onSlide=i=>{FX.rail.forEach(r=>{const k=r.idx.indexOf(i);r.d.classList.toggle("on",k>=0);r.b.style.width=k<0?(i>r.idx[r.idx.length-1]?"100%":"0%"):((k+1)/r.idx.length*100)+"%"});requestAnimationFrame(segSync);if(i===0)FX.aurora.start();else FX.aurora.stop();FX.hideFz()};
const _act=activate;activate=function(i,inst,back){_act(i,inst,back);FX.onSlide(i)};FX.onSlide(cur);
$("controls").insertAdjacentHTML("afterbegin",'<span class="c" style="font-weight:500;opacity:.8;height:40px">⤢ amplia gráficos</span>');
})();
/* sobre este slide */
(function(){const bt=H("button",{class:"g",id:"bInfo",title:"Sobre este slide (tecla I)","aria-expanded":"false"});bt.innerHTML='<span style="display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;border:2px solid currentColor;font:800 11px/1 var(--fb)">i</span><span>Sobre este slide</span>';
$("controls").insertBefore(bt,$("bPrev"));
const pn=H("div",{id:"infoP"},document.body);pn.innerHTML='<div class="ih"><span class="ie">Sobre este slide</span><button class="ix" aria-label="Fechar">×</button></div><div class="it"></div><div class="id"></div>';
let open=false;const fill=i=>{const s=slides[i];pn.querySelector(".it").textContent=s.dataset.t;pn.querySelector(".id").textContent=s.dataset.desc||DK.desc[s.dataset.t]||DK.descDefault};
const set=v=>{open=v;pn.classList.toggle("on",v);bt.classList.toggle("on",v);bt.setAttribute("aria-expanded",v);if(v)fill(cur)};
bt.addEventListener("click",()=>set(!open));pn.querySelector(".ix").addEventListener("click",()=>set(false));
addEventListener("keydown",e=>{if(e.key==="i"||e.key==="I")set(!open);if(e.key==="Escape")set(false)});
const _a8=activate;activate=function(i,inst,back){_a8(i,inst,back);if(open)fill(i)}})();
/* índice de páginas */
(function(){const c=$("cnt");c.setAttribute("role","button");c.setAttribute("tabindex","0");c.title="Índice · escolha a página (tecla G)";c.classList.add("idxBtn");
const ix=H("div",{id:"idxP"},document.body);const hd=H("div",{class:"xh"},ix);H("span",null,hd,"Índice");const xb=H("button",{class:"ix","aria-label":"Fechar"},hd,"×");const ls=H("div",{class:"xl"},ix);
const PN={};DK.parts.forEach(([n,key])=>PN[key]=key.includes(" · ")?"Parte "+key:n);
let last=null,items=[];slides.forEach((s,i)=>{const p=s.dataset.p||"Contexto";if(p!==last){H("div",{class:"xg"},ls,PN[p]||p);last=p}const b=H("button",{class:"xi"},ls);H("b",null,b,String(i+1).padStart(2,"0"));H("span",null,b,s.dataset.t);b.addEventListener("click",()=>{set(false);go(i)});items.push(b)});
let open=false;const set=v=>{open=v;ix.classList.toggle("on",v);c.classList.toggle("on",v);if(v){items.forEach((b,k)=>b.classList.toggle("cur",k===cur));const a=items[cur];if(a)a.scrollIntoView({block:"center"})}};
c.addEventListener("click",e=>{e.stopPropagation();set(!open)});c.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();set(!open)}});xb.addEventListener("click",()=>set(false));
ix.addEventListener("click",e=>e.stopPropagation());addEventListener("click",()=>{if(open)set(false)});addEventListener("keydown",e=>{if(e.key==="g"||e.key==="G")set(!open);if(e.key==="Escape")set(false)})})();
if(ENTER["Capa"]&&cur===0)ENTER["Capa"]();
