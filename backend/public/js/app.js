"use strict";
/* ================================================================
   ★  ROZVIK™ CONFIG — CHANGE ANYTHING HERE ★
   All business settings in one place.
   ================================================================ */
const CFG = {
  waNumber:    "918368886161",   // ← CHANGE YOUR WHATSAPP NUMBER HERE
  waMessage:   "Hi ROZVIK! I'd like to place an order. Here are my items:",
  instaHandle: "rozvik.co",      // ← CHANGE YOUR INSTAGRAM HANDLE HERE (no @)
  deliveryFee: 60,               // ₹ delivery charge
  freeAbove:   500,              // ₹ order value = free delivery
  minOrder:    300,              // ₹ minimum order
  cities:      "Delhi & NCR",
};
const instaUrl = `https://www.instagram.com/${CFG.instaHandle}/`;

/* ================================================================
   PRODUCTS — edit names, descriptions, prices, variants here
   To add a product: copy a block and give it a new id
   ================================================================ */
const PRODUCTS = [
  {
    id:1, name:"California Almonds", tagline:"Premium Grade · Lightly Salted Available",
    cat:"Nuts", grade:"PREMIUM", isNew:false,
    desc:"Large, plump California almonds sourced directly. Rich in protein and healthy fats. Available natural or lightly salted. Locked in freshness with borosilicate glass.",
    img:"https://images.unsplash.com/photo-1585518419759-6e4ce9f22e3b?w=400",
    fillColor:"#C8A882", fillH:"65%", icon:"ti-circle", pkgText:"#5A3A18",
    wts:[{w:"100g",p:199},{w:"250g",p:449},{w:"500g",p:849},{w:"1kg",p:1599}]
  },
  {
    id:2, name:"Premium Cashews", tagline:"W240 Grade · Whole Kernels",
    cat:"Nuts", grade:"W240 GRADE", isNew:false,
    desc:"W240 whole cashew kernels — the grade exported to premium markets. Creamy, buttery, and consistently sized. Each jar is filled with hand-sorted, unbroken whole kernels only.",
    img:"https://images.unsplash.com/photo-1599599810694-b3f5fa33f35f?w=400",
    fillColor:"#E8D4A0", fillH:"70%", icon:"ti-circle", pkgText:"#5A4818",
    wts:[{w:"100g",p:249},{w:"250g",p:569},{w:"500g",p:1049},{w:"1kg",p:1999}]
  },
  {
    id:3, name:"Golden Raisins", tagline:"Sun-Dried · Seedless · Jumbo",
    cat:"Nuts", grade:"JUMBO GRADE", isNew:false,
    desc:"Jumbo golden raisins, sun-dried and naturally sweet. No added sugar, no sulphites, no artificial colour. The golden hue comes entirely from the natural drying process.",
    img:"https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400",
    fillColor:"#D4A840", fillH:"75%", icon:"ti-sun", pkgText:"#5A3810",
    wts:[{w:"100g",p:129},{w:"250g",p:289},{w:"500g",p:549},{w:"1kg",p:999}]
  },
  {
    id:4, name:"Iranian Pistachios", tagline:"Long Pista · Roasted & Salted",
    cat:"Nuts", grade:"PREMIUM GRADE", isNew:true,
    desc:"Long Iranian pistachios, roasted in small batches and lightly salted. Naturally open-shelled, rich green kernel, intense flavour. The snacking pistachio that sets the standard.",
    img:"https://images.unsplash.com/photo-1599599810694-b3f5fa33f35f?w=400",
    fillColor:"#8A9A60", fillH:"60%", icon:"ti-leaf", pkgText:"#2A4010",
    wts:[{w:"100g",p:349},{w:"250g",p:799},{w:"500g",p:1499},{w:"1kg",p:2799}]
  },
  {
    id:5, name:"Kashmiri Walnuts", tagline:"Light Halves · Kashmir Origin",
    cat:"Nuts", grade:"LIGHT HALVES", isNew:false,
    desc:"Light coloured walnut halves from the Kashmir valley — the variety known for mild bitterness and rich omega-3 content. Hand-cracked to preserve the half-kernel shape. No broken pieces in this jar.",
    img:"https://images.unsplash.com/photo-1585518419759-6e4ce9f22e3b?w=400",
    fillColor:"#C8A878", fillH:"68%", icon:"ti-circle-dotted", pkgText:"#4A2A10",
    wts:[{w:"100g",p:279},{w:"250g",p:629},{w:"500g",p:1199},{w:"1kg",p:2299}]
  },
  {
    id:6, name:"Dry Fruit Ladoo", tagline:"Handmade · No Sugar Added",
    cat:"Ladoos", grade:"HANDMADE", isNew:true,
    desc:"Handmade ladoos crafted from dates, almonds, cashews, pistachios and desiccated coconut. No refined sugar, no artificial binding agents. Each ladoo is rolled by hand and sealed fresh in glass.",
    img:"https://images.unsplash.com/photo-1599599810694-b3f5fa33f35f?w=400",
    fillColor:"#8A6040", fillH:"72%", icon:"ti-heart", pkgText:"#3A1A08",
    wts:[{w:"150g (4 pc)",p:299},{w:"300g (8 pc)",p:549},{w:"500g (14 pc)",p:899},{w:"1kg (28 pc)",p:1649}]
  },
  {
    id:7, name:"Handmade Chocolates", tagline:"Artisan · 3 Varieties Available",
    cat:"Chocolates", grade:"ARTISAN", isNew:true,
    desc:"Small-batch handmade chocolates in dark (70%), milk, and assorted varieties. Made with quality couverture chocolate and stuffed with dry fruit. No wax coating, no artificial flavour. Each piece individually set.",
    img:"https://images.unsplash.com/photo-1599599810694-b3f5fa33f35f?w=400",
    fillColor:"#4A2A10", fillH:"78%", icon:"ti-star", pkgText:"#1A0A04",
    wts:[{w:"100g (~8 pc)",p:299},{w:"200g (~16 pc)",p:549},{w:"400g (~32 pc)",p:999},{w:"1kg (~80 pc)",p:2399}]
  },
];

const CATS = ["All","Nuts","Ladoos","Chocolates"];
const MARQUEE_ITEMS = [
  ["ti-flask","Borosilicate Glass Jars"],["ti-leaf","No Plastic Packaging"],
  ["ti-shield-check","No Preservatives"],["ti-heart","Handcrafted in Small Batches"],
  ["ti-truck","Delhi & NCR Delivery"],["ti-star","Premium Quality Nuts"],
  ["ti-recycle","Reusable Glass Jars"],["ti-award","Pure. Premium. Handcrafted."],
];

/* ── STATE ── */
const S = { cart:{}, selWt:{}, filter:"All", cartOpen:false, waOpen:false };
PRODUCTS.forEach(p => { S.selWt[p.id] = 0; });

/* ── PARTICLES ── */
function spawnParticles() {
  const f = document.getElementById('particles');
  const n = window.innerWidth < 600 ? 10 : 20;
  for(let i=0;i<n;i++){
    const d = document.createElement('div');
    d.className = 'par';
    const s = 3 + Math.random()*6;
    Object.assign(d.style,{width:s+'px',height:s+'px',left:Math.random()*100+'%',bottom:'-5%',animationDuration:(9+Math.random()*13)+'s',animationDelay:(Math.random()*10)+'s'});
    f.appendChild(d);
  }
}

/* ── MARQUEE ── */
function buildMarquee() {
  const all = [...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS,...MARQUEE_ITEMS];
  document.getElementById('mtrack').innerHTML = all.map(([ic,t])=>`<span class="mitem"><i class="ti ${ic}"></i>${t}</span>`).join('');
}

/* ── FILTERS ── */
function buildFilters() {
  document.getElementById('filters').innerHTML = CATS.map(c=>`<button class="fbtn${c===S.filter?' on':''}" onclick="setFilter('${c}')">${c}</button>`).join('');
}
function setFilter(c) { S.filter=c; buildFilters(); renderGrid(); }

/* ── JAR VISUAL ── */
function jarHTML(p, wi) {
  return `
  <div class="jar-wrap" onclick="openProductModal(${p.id})">
    <div class="jar">
      <div class="jar-lid"><span>ROZVIK™</span></div>
      <div class="jar-body">
        <img src="${p.img}" alt="${p.name}" style="width:100%;height:100%;object-fit:cover;border-radius:4px 4px 8px 8px;" onerror="this.style.display='none'">
        <div class="jar-fill" style="height:${p.fillH};background:${p.fillColor}20;border-top:2px solid ${p.fillColor}40;display:none"></div>
        <div class="jar-shine"></div>
        <div class="jar-label">
          <span class="jbrand">ROZVIK</span>
          <span class="jname">${p.name.split(' ').slice(0,2).join(' ').toUpperCase()}</span>
        </div>
      </div>
    </div>
  </div>`;
}

/* ── PRODUCT GRID ── */
function renderGrid() {
  const list = S.filter==='All' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===S.filter);
  const g = document.getElementById('pgrid');
  g.innerHTML = list.map(p => {
    const wi = S.selWt[p.id]||0;
    const added = !!(S.cart[p.id]?.qty>0);
    return `
<article class="pcard" id="pc_${p.id}">
  <div class="pimg" style="background:linear-gradient(135deg,${p.fillColor}18,${p.fillColor}08)">
    ${p.isNew?`<span class="pbadge isnew">NEW</span>`:''}
    <span class="pbadge grade">${p.grade}</span>
    ${jarHTML(p, wi)}
  </div>
  <div class="pbody">
    <div class="pname">${p.name}</div>
    <div class="psub">${p.tagline}</div>
    <div class="pdesc">${p.desc}</div>
    <div class="wrow" id="wr_${p.id}">
      ${p.wts.map((w,i)=>`<button class="wpill${i===wi?' on':''}" onclick="selWt(${p.id},${i})">${w.w}</button>`).join('')}
    </div>
    <div class="pfoot">
      <div class="pprice">
        <strong id="ppr_${p.id}">₹${p.wts[wi].p}</strong>
        <span id="ppw_${p.id}">${p.wts[wi].w}</span>
      </div>
      <button class="addbtn${added?' added':''}" id="ab_${p.id}" onclick="addToCart(${p.id})" title="Add to bag">
        <i class="ti ${added?'ti-check':'ti-plus'}"></i>
      </button>
    </div>
  </div>
</article>`;
  }).join('');
  requestAnimationFrame(()=>{
    g.querySelectorAll('.pcard').forEach((c,i)=>setTimeout(()=>c.classList.add('vis'),i*70));
  });
}

function selWt(pid, idx) {
  S.selWt[pid]=idx;
  const p=PRODUCTS.find(x=>x.id===pid);
  document.getElementById('ppr_'+pid).textContent='₹'+p.wts[idx].p;
  document.getElementById('ppw_'+pid).textContent=p.wts[idx].w+' · glass jar';
  document.querySelectorAll(`#wr_${pid} .wpill`).forEach((b,i)=>{b.className='wpill'+(i===idx?' on':'')});
}

/* ── CART ── */
function addToCart(pid) {
  const p=PRODUCTS.find(x=>x.id===pid);
  const wi=S.selWt[pid]||0;
  if(!S.cart[pid]) S.cart[pid]={pid,name:p.name,wt:p.wts[wi].w,price:p.wts[wi].p,qty:1,icon:p.icon,fillColor:p.fillColor};
  else{ S.cart[pid].qty++; S.cart[pid].wt=p.wts[wi].w; S.cart[pid].price=p.wts[wi].p; }
  updateCart();
  showToast('✓  '+p.name+' added to your bag');
  const dot=document.getElementById('cbadge');
  dot.classList.remove('pop'); requestAnimationFrame(()=>dot.classList.add('pop'));
  setTimeout(()=>dot.classList.remove('pop'),200);
  const btn=document.getElementById('ab_'+pid);
  if(btn){btn.className='addbtn added';btn.innerHTML='<i class="ti ti-check"></i>';}
}

function changeQty(pid,d) {
  if(!S.cart[pid]) return;
  S.cart[pid].qty+=d;
  if(S.cart[pid].qty<=0){
    delete S.cart[pid];
    const btn=document.getElementById('ab_'+pid);
    if(btn){btn.className='addbtn';btn.innerHTML='<i class="ti ti-plus"></i>';}
  }
  updateCart();
}

function updateCart() {
  const items=Object.values(S.cart).filter(x=>x.qty>0);
  const count=items.reduce((s,x)=>s+x.qty,0);
  const sub=items.reduce((s,x)=>s+x.qty*x.price,0);
  const del=sub>=CFG.freeAbove?0:CFG.deliveryFee;
  const tot=sub+del;
  document.getElementById('cbadge').textContent=count;
  const body=document.getElementById('cbody'), ft=document.getElementById('cft');
  if(!items.length){
    body.innerHTML=`<div class="cempty"><i class="ti ti-shopping-bag"></i><p>Your bag is empty</p><small>Add some goodness from our collection</small></div>`;
    ft.style.display='none'; return;
  }
  body.innerHTML=items.map(x=>`
    <div class="citem">
      <div class="cthumb" style="background:${x.fillColor}18">
        <div class="cjmini">
          <div class="cjlid"></div>
          <div class="cjbody"><i class="ti ${x.icon}" style="color:${x.fillColor}"></i></div>
        </div>
      </div>
      <div class="cinfo">
        <div class="cname">${x.name}</div>
        <div class="cmeta">${x.wt} · Glass jar · ₹${x.price}/jar</div>
        <div class="cqty">
          <button class="qb" onclick="changeQty(${x.pid},-1)">−</button>
          <span style="font-size:12px;min-width:20px;text-align:center">${x.qty}</span>
          <button class="qb" onclick="changeQty(${x.pid},1)">+</button>
        </div>
      </div>
      <div class="cprice">₹${x.qty*x.price}</div>
    </div>`).join('');
  document.getElementById('csub').textContent='₹'+fmt(sub);
  document.getElementById('cdel').textContent=del===0?'FREE':'₹'+del;
  document.getElementById('ctot').textContent='₹'+fmt(tot);
  const mn=document.getElementById('cmin');
  if(sub>=CFG.freeAbove){mn.style.display='none';}
  else{mn.style.display='flex';document.getElementById('cminleft').textContent=CFG.freeAbove-sub;}
  ft.style.display='block';
}

function clearCart(){
  S.cart={};
  PRODUCTS.forEach(p=>{const b=document.getElementById('ab_'+p.id);if(b){b.className='addbtn';b.innerHTML='<i class="ti ti-plus"></i>';}});
  updateCart();
}

/* ── WHATSAPP ORDER ── */
function whatsappOrder() {
  const items=Object.values(S.cart).filter(x=>x.qty>0);
  if(!items.length){showToast('Add items to bag first');return;}
  const sub=items.reduce((s,x)=>s+x.qty*x.price,0);
  const del=sub>=CFG.freeAbove?0:CFG.deliveryFee;
  let msg=CFG.waMessage+'\n\n';
  items.forEach(x=>{msg+=`• ${x.name} (${x.wt}) × ${x.qty} = ₹${x.qty*x.price}\n`;});
  msg+=`\nSubtotal: ₹${fmt(sub)}\nDelivery: ${del===0?'FREE':'₹'+del}\n*Total: ₹${fmt(sub+del)}*`;
  msg+='\n\nPlease share my delivery address and confirm availability. Thank you!';
  window.open(`https://wa.me/${CFG.waNumber}?text=${encodeURIComponent(msg)}`,'_blank');
  toggleCart();
}

/* ── CART TOGGLE ── */
function toggleCart(){
  S.cartOpen=!S.cartOpen;
  document.getElementById('cpanel').classList.toggle('open',S.cartOpen);
  document.getElementById('cov').classList.toggle('on',S.cartOpen);
}

/* ── AUTH ── */
function showAuth(){document.getElementById('authModal').classList.add('on')}
function hideAuth(){document.getElementById('authModal').classList.remove('on')}
document.getElementById('authModal').addEventListener('click',e=>{if(e.target===e.currentTarget)hideAuth()});

/* ── LOGIN WITH OTP (mobile or email) ──
   Talks to /api/auth/request-otp and /api/auth/verify-otp on
   our own backend. The logged-in session token is kept in
   localStorage so the customer stays logged in on their next visit. */
function backToAuthStep0(){
  document.getElementById('authStep1').style.display='none';
  document.getElementById('authStep0').style.display='block';
  document.getElementById('authOtpInp').value='';
}

async function requestOtp(){
  const identifier=document.getElementById('authInp').value.trim();
  if(!identifier){ showToast('Enter your phone number or email'); return; }

  const btn=document.getElementById('authSendBtn');
  btn.disabled=true; btn.textContent='SENDING…';
  try{
    const res=await fetch(API_BASE+'/api/auth/request-otp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({identifier})
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'Could not send code');

    document.getElementById('authSentTo').textContent='Code sent to '+identifier;
    document.getElementById('authStep0').style.display='none';
    document.getElementById('authStep1').style.display='block';
    // devCode is only ever present while backend/config.js has otpDevMode:true
    // (local testing, before a real SMS/email provider is wired up).
    if(data.devCode) showToast('Dev mode — your code is '+data.devCode);
  }catch(err){
    showToast(err.message);
  }finally{
    btn.disabled=false; btn.textContent='SEND OTP →';
  }
}

async function verifyOtp(){
  const identifier=document.getElementById('authInp').value.trim();
  const code=document.getElementById('authOtpInp').value.trim();
  if(!code){ showToast('Enter the code'); return; }

  const btn=document.getElementById('authVerifyBtn');
  btn.disabled=true; btn.textContent='VERIFYING…';
  try{
    const res=await fetch(API_BASE+'/api/auth/verify-otp',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({identifier,code})
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'Could not verify code');

    localStorage.setItem('rozvikToken',data.token);
    localStorage.setItem('rozvikUser',JSON.stringify(data.user));
    showLoggedInState(data.user);
    hideAuth();
    showToast('✓  Logged in as '+identifier);
  }catch(err){
    showToast(err.message);
  }finally{
    btn.disabled=false; btn.textContent='VERIFY & LOG IN →';
  }
}

function showLoggedInState(user){
  const btn=document.querySelector('.hright .hico[title="Account"]');
  if(btn){ btn.title='Logged in as '+user.identifier; btn.style.color='var(--gold)'; }
}

// If the browser already has a saved session, show as logged-in
// (without bothering the backend — the token itself was already
// checked the last time we got it).
(function restoreLogin(){
  const saved=localStorage.getItem('rozvikUser');
  if(saved) showLoggedInState(JSON.parse(saved));
})();

/* ── CHECKOUT ── */
function openCheckout(){
  if(S.cartOpen)toggleCart();
  const items=Object.values(S.cart).filter(x=>x.qty>0);
  const sub=items.reduce((s,x)=>s+x.qty*x.price,0);
  const del=sub>=CFG.freeAbove?0:CFG.deliveryFee;
  document.getElementById('chkSummary').innerHTML=
    items.map(x=>`<div class="osm-row"><span>${x.name} × ${x.qty}</span><span>₹${x.qty*x.price}</span></div>`).join('')+
    `<div class="osm-row"><span>Delivery</span><span>${del===0?'FREE':'₹'+del}</span></div>`+
    `<div class="osm-row total"><span>Total</span><span>₹${fmt(sub+del)}</span></div>`;
  chkStep(0);
  document.getElementById('checkoutModal').classList.add('on');
}
function closeCheckout(){document.getElementById('checkoutModal').classList.remove('on')}
function chkStep(n){
  document.querySelectorAll('.cstep').forEach((s,i)=>s.className='cstep'+(i===n?' on':''));
  document.querySelectorAll('.cs').forEach((s,i)=>s.className='cs'+(i===n?' on':''));
}
function selPay(btn){document.querySelectorAll('.pay-opt').forEach(b=>b.classList.remove('sel'));btn.classList.add('sel')}
document.getElementById('checkoutModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeCheckout()});

/* ── PLACE ORDER (sends the cart to our backend) ──
   "" means "same website", so this works when the page is
   served by the backend at http://localhost:3000.
   If the backend isn't running, we fall back to WhatsApp. */
const API_BASE = "";
async function placeOrder(){
  // 1. Read the address form.
  const name=document.getElementById('chkName').value.trim();
  const phone=document.getElementById('chkPhone').value.trim();
  const addr=document.getElementById('chkAddr').value.trim();
  const city=document.getElementById('chkCity').value.trim();
  const pin=document.getElementById('chkPin').value.trim();
  if(!name||!phone||!addr){
    chkStep(0); // go back to the address step
    showToast('Please fill name, phone and address');
    return;
  }

  // 2. Turn the cart into the simple shape the backend expects.
  const items=Object.values(S.cart)
    .filter(x=>x.qty>0)
    .map(x=>({productId:x.pid, weight:x.wt, qty:x.qty}));
  if(!items.length){showToast('Your bag is empty');return;}

  const order={
    customer:{ name, phone, address:[addr,city,pin].filter(Boolean).join(', ') },
    items
  };

  // 3. Send it. Disable the button so it can't be double-clicked.
  const btn=document.getElementById('placeOrderBtn');
  btn.disabled=true; btn.textContent='PLACING ORDER…';
  try{
    const res=await fetch(API_BASE+'/api/orders',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify(order)
    });
    const data=await res.json();
    if(!res.ok) throw new Error(data.error||'Could not place order');

    // 4. Success — show the order number and the confirmation step.
    document.getElementById('chkOrderId').textContent='Order #'+data.order.id;
    chkStep(2);
  }catch(err){
    // Backend missing/offline → keep the shop working via WhatsApp.
    showToast(err.message+' — opening WhatsApp instead');
    whatsappOrder();
  }finally{
    btn.disabled=false; btn.textContent='PLACE ORDER →';
  }
}

/* ── WHATSAPP POPUP ── */
function buildWA(){
  const url=`https://wa.me/${CFG.waNumber}?text=${encodeURIComponent(CFG.waMessage)}`;
  const disp='+'+CFG.waNumber.slice(0,2)+' '+CFG.waNumber.slice(2,7)+' '+CFG.waNumber.slice(7);
  document.getElementById('walink').onclick=()=>window.open(url,'_blank');
  document.getElementById('wanum').textContent=disp;
  buildQR(document.getElementById('waqr'),url);
}

/* ── QR CODE (real, scannable) ──
   We don't draw the QR ourselves — we ask a free QR-generator
   image service (api.qrserver.com) to render one for whatever
   link/text we give it, and just show that image.
   "data" is the exact thing you want opened when someone scans
   it (e.g. a WhatsApp link or an Instagram profile URL). */
function buildQR(el,data){
  const src='https://api.qrserver.com/v1/create-qr-code/?size=160x160&data='+encodeURIComponent(data);
  el.innerHTML=`<img src="${src}" width="160" height="160" alt="Scan to open" style="display:block">`;
}
function toggleWa(){
  S.waOpen=!S.waOpen;
  document.getElementById('wapop').classList.toggle('open',S.waOpen);
}
document.addEventListener('click',e=>{
  if(!e.target.closest('#wabtn')&&!e.target.closest('#wapop')){S.waOpen=false;document.getElementById('wapop').classList.remove('open');}
});

/* ── SCROLL ── */
function handleScroll(){
  document.getElementById('hdr').classList.toggle('slim',window.scrollY>50);
  document.querySelectorAll('.reveal').forEach(el=>{if(el.getBoundingClientRect().top<window.innerHeight-70)el.classList.add('in');});
}
window.addEventListener('scroll',handleScroll,{passive:true});

/* ── HELPERS ── */
function goTo(id){const el=document.getElementById(id);if(!el)return;window.scrollTo({top:el.offsetTop-(id==='hero'?0:70),behavior:'smooth'});}
function fmt(n){return n.toLocaleString('en-IN')}

let tt;
function showToast(msg){
  const el=document.getElementById('toast');el.textContent=msg;el.classList.add('on');
  clearTimeout(tt);tt=setTimeout(()=>el.classList.remove('on'),2800);
}

document.addEventListener('keydown',e=>{if(e.key==='Escape'){hideAuth();closeCheckout();closeProductModal();if(S.cartOpen)toggleCart();}});

/* ── PRODUCT MODAL ── */
function openProductModal(pid){
  const p=PRODUCTS.find(x=>x.id===pid);
  const modal=document.getElementById('productModal');
  document.getElementById('pmImg').src=p.img;
  document.getElementById('pmName').textContent=p.name;
  document.getElementById('pmDesc').textContent=p.desc;
  const wtHtml=p.wts.map((w,i)=>`<button class="weight-opt" data-idx="${i}" onclick="selWeight(${pid},${i})">${w.w}<br><span>₹${w.p}</span></button>`).join('');
  document.getElementById('pmWeights').innerHTML=wtHtml;
  document.querySelectorAll('.weight-opt')[0].classList.add('sel');
  document.getElementById('pmAddBtn').onclick=()=>{addToCart(pid);closeProductModal();};
  modal.classList.add('on');
}
function closeProductModal(){
  document.getElementById('productModal').classList.remove('on');
}
function selWeight(pid,idx){
  S.selWt[pid]=idx;
  document.querySelectorAll('.weight-opt').forEach(b=>b.classList.remove('sel'));
  document.querySelectorAll('.weight-opt')[idx].classList.add('sel');
}
document.getElementById('productModal').addEventListener('click',e=>{if(e.target===e.currentTarget)closeProductModal()});

/* ── LOAD PRODUCTS FROM BACKEND ──
   Try to get the live catalog from the API. If it works, we
   replace the built-in PRODUCTS list with the server's copy
   (so you can change prices without editing this file).
   If the backend isn't running, we just keep the built-in list. */
async function loadProducts(){
  try{
    const res=await fetch(API_BASE+'/api/products');
    if(!res.ok) throw new Error('bad response');
    const fresh=await res.json();
    if(Array.isArray(fresh) && fresh.length){
      PRODUCTS.length=0;                 // empty the array (it's a const, so we mutate it)
      fresh.forEach(p=>PRODUCTS.push(p)); // fill it with the server's products
      PRODUCTS.forEach(p=>{ if(S.selWt[p.id]==null) S.selWt[p.id]=0; });
      renderGrid();                       // redraw the grid with fresh data
    }
  }catch(e){
    // Backend offline — the built-in PRODUCTS list is used instead.
    console.log('Using built-in product list (backend not reachable).');
  }
}

/* ── INIT ── */
spawnParticles();buildMarquee();buildFilters();renderGrid();updateCart();buildWA();handleScroll();loadProducts();
buildQR(document.getElementById('ftIgQr'),instaUrl);
