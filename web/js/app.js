/* Prezi tarzı sonsuz tuval sunum motoru — GSAP + SplitText + MorphSVG */
gsap.registerPlugin(SplitText, MorphSVGPlugin, CustomEase);

const W = 1600, H = 900;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const IMG = n => `assets/img/${n}.jpg`;
const GL = 'ABCDEFGHIJKLMNOPRSTUVYZ#%&/<>';
const rnd = gsap.utils.random;

/* ------------------------------------------------------------------ */
/* Kinetik tipografi yardımcıları (Akıcı, GPU hızlandırmalı, Çeşitli)  */
/* ------------------------------------------------------------------ */
function split(el, type = 'chars,words') {
  if (el._sp) {
    el._sp.revert();
    el._sp = null;
  }
  el._sp = new SplitText(el, { type, charsClass: 'k-char', wordsClass: 'k-word', linesClass: 'line-mask' });
  return el._sp;
}

// 1. Maskeli satır akışı (Apple / Keynote akıcılığı, sıfır reflow)
function kMaskSlide(tl, el, at = 0, each = 0.04) {
  if (!el) return;
  const sp = split(el, 'lines,words');
  tl.fromTo(sp.words, { yPercent: 115, opacity: 0 },
    { yPercent: 0, opacity: 1, duration: 0.85, ease: 'power4.out', stagger: each }, at);
}

// 2. Siber / Veri deşifresi (Sabit harf genişliği, pürüzsüz ışıltı)
function kCyberDecode(tl, el, at = 0, each = 0.02) {
  if (!el) return;
  const sp = split(el, 'chars');
  tl.fromTo(sp.chars, { opacity: 0, y: 14, filter: 'blur(3px)' },
    { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', stagger: each }, at);
  tl.fromTo(el, { textShadow: '0 0 24px rgba(61,232,245,0.75)' },
    { textShadow: '0 0 0px transparent', duration: 0.7, ease: 'power2.out' }, at + 0.25);
}

// 3. Esnek 3D Pop (Dinamik ve modern)
function kWordPop(tl, el, at = 0, each = 0.038) {
  if (!el) return;
  const sp = split(el, 'words');
  tl.fromTo(sp.words, { y: 26, opacity: 0, scale: 0.88, rotationX: -14, transformPerspective: 800 },
    { y: 0, opacity: 1, scale: 1, rotationX: 0, duration: 0.75, ease: 'back.out(1.5)', stagger: each }, at);
}

// 4. İpeksi kayma (Silky glide & soft blur)
function kFluidFade(tl, el, at = 0, each = 0.035) {
  if (!el) return;
  const sp = split(el, 'words');
  tl.fromTo(sp.words, { opacity: 0, x: -26, filter: 'blur(4px)' },
    { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.75, ease: 'power3.out', stagger: each }, at);
}

// 5. Sinematik kerning açılışı
function kUnfold(tl, el, at = 0) {
  if (!el) return;
  tl.fromTo(el, { letterSpacing: '0.12em', opacity: 0, y: 18 },
    { letterSpacing: '-0.02em', opacity: 1, y: 0, duration: 0.95, ease: 'expo.out' }, at);
}

// Başlık stili rotatörü: her slayt türüne göre farklı, akıcı animasyon
function kAnimateTitle(tl, el, variant = 0, at = 0) {
  if (!el) return;
  const anims = [kMaskSlide, kCyberDecode, kWordPop, kFluidFade];
  const fn = anims[Math.abs(variant) % anims.length];
  fn(tl, el, at);
}

// Paragraf gövde metni
function kWords(tl, el, at = 0) {
  if (!el) return;
  const sp = split(el, 'words');
  tl.set(el, { opacity: 1 }, at);
  tl.fromTo(sp.words, { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', stagger: 0.014 }, at);
  $$('em', el).forEach((e, i) => tl.fromTo(e, { color: '#ffffff' }, { color: 'var(--red)', duration: 0.6, ease: 'power2.out' }, at + 0.35 + i * 0.15));
}

/* ------------------------------------------------------------------ */
/* Simülasyon / görselleştirme blokları                                */
/* ------------------------------------------------------------------ */
const ECG = (() => {
  let d = 'M0 60';
  for (let i = 0; i < 4; i++) { const x = i * 150; d += ` L${x + 40} 60 L${x + 52} 52 L${x + 62} 60 L${x + 80} 60 L${x + 88} 66 L${x + 96} 8 L${x + 106} 102 L${x + 114} 60 L${x + 135} 60 L${x + 145} 46 L${x + 150} 60`; }
  return d;
})();

const VIZ = {
  ecg: {
    html: () => `<div class="vz vz-ecg">
      <div class="ecg-top">
        <span class="ecg-title">TELEMETRİK HASTA MONİTÖRÜ</span>
        <span class="ok">● CANLI AKIŞ</span>
      </div>
      <svg viewBox="0 0 320 110" preserveAspectRatio="none">
        <defs>
          <filter id="ecgGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#19c48b" flood-opacity="0.9"/>
          </filter>
        </defs>
        <line x1="0" y1="55" x2="320" y2="55" stroke="rgba(255,255,255,0.06)" stroke-width="1" stroke-dasharray="4 4"/>
        <g class="scroll">
          <path d="${ECG}" fill="none" stroke="#19c48b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#ecgGlow)"/>
          <path transform="translate(600 0)" d="${ECG}" fill="none" stroke="#19c48b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#ecgGlow)"/>
        </g>
      </svg>
      <div class="vals">
        <div class="val-box"><span class="lbl">KALP ATIM HIZI</span><span class="num"><b data-hr>72</b> <small>bpm</small></span></div>
        <div class="val-box"><span class="lbl">OKSİJEN</span><span class="num green"><b data-sp>98%</b> <small>SpO₂</small></span></div>
        <div class="val-box"><span class="lbl">RİTİM</span><span class="tag-status">SİNÜS</span></div>
      </div>
    </div>`,
    start(r) {
      const scroll = $('.scroll', r);
      if (scroll) gsap.to(scroll, { x: -600, duration: 4.2, ease: 'none', repeat: -1 });
      const hr = $('[data-hr]', r), sp = $('[data-sp]', r);
      gsap.to({}, { duration: 1.1, repeat: -1, onRepeat() {
        if (hr) hr.textContent = Math.round(rnd(70, 78));
        if (sp) sp.textContent = Math.round(rnd(97, 99)) + '%';
      } });
    }
  },
  alert: {
    html: () => `<div class="vz vz-alert">
      <div class="al-ic">⚠</div>
      <div class="al-body">
        <b>OLASI İLAÇ ETKİLEŞİMİ UYARISI</b>
        <span>Varfarin + Aspirin → Kanama riski artışı tespit edildi. Hekim onayı ve alternatif tedavi protokolü önerisi.</span>
      </div>
      <div class="al-action">KLİNİK KARAR DESTEK</div>
    </div>`,
    start(r) { gsap.fromTo($('.vz-alert', r), { boxShadow: '0 0 0 0 rgba(255,77,94,.75)' }, { boxShadow: '0 0 0 24px rgba(255,77,94,0)', duration: 1.4, repeat: -1 }); }
  },
  rights: {
    html: () => `<div class="vz vz-rights">${['Doğru hasta', 'Doğru ilaç', 'Doğru doz', 'Doğru yol', 'Doğru zaman'].map(t => `<span>${t}</span>`).join('')}</div>`,
    start(r) {
      const s = $$('span', r);
      gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
        .to(s, { background: '#19c48b', borderColor: '#19c48b', color: '#04150f', duration: .35, stagger: .45 })
        .to(s, { background: 'transparent', borderColor: 'rgba(255,255,255,.25)', color: '#cfe0f5', duration: .3 }, '+=1.2');
    }
  },
  stock: {
    html: () => `<div class="vz vz-stock">
      <div class="stock-hdr"><b>GERÇEK ZAMANLI STOK SEVİYELERİ</b><span>Akıllı Tahmin Modeli</span></div>
      <div class="stock-list">
        ${[['Eldiven', 18], ['Serum seti', 64], ['Enjektör', 41]].map(([n, v]) => `
          <div class="st-row">
            <label>${n}</label>
            <div class="st-bar-wrap"><i><u data-v="${v}"></u></i></div>
            <em class="${v < 25 ? 'low' : ''}">${v < 25 ? '⚠ Otomatik sipariş önerisi' : '%' + v}</em>
          </div>`).join('')}
      </div>
    </div>`,
    start(r) { $$('u', r).forEach(u => gsap.fromTo(u, { width: '100%' }, { width: u.dataset.v + '%', duration: 2.2, ease: 'power3.inOut', repeat: -1, repeatDelay: 2.5, yoyo: false })); }
  },
  shift: {
    html: () => {
      const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
      const heat = [[2, 3, 2], [3, 4, 3], [2, 3, 2], [3, 3, 2], [4, 4, 3], [2, 2, 2], [1, 2, 1]];
      return `<div class="vz vz-shift">
        <div class="shift-hdr"><b>HEMŞİRE VARDİYA & İŞ YÜKÜ TAHMİNİ</b><span>Yapay Zeka Dinamik Dağılımı</span></div>
        <div class="hd"><span></span>${days.map(d => `<span>${d}</span>`).join('')}</div>
        ${['Gündüz', 'Akşam', 'Gece'].map((s, si) => `<div class="rw"><span class="shift-lbl">${s}</span>${heat.map((h, di) => `<i class="h${h[si]}"></i>`).join('')}</div>`).join('')}
        <div class="shift-legend"><small>Tahmini hasta yoğunluğu · Koyu = Yüksek iş yükü · Dinamik atama</small></div>
      </div>`;
    },
    start(r) { gsap.fromTo($$('i', r), { scale: 0 }, { scale: 1, duration: .5, stagger: { each: .04, from: 'random' }, ease: 'back.out(2)' }); }
  },
  glucose: {
    html: () => `<div class="vz vz-glu">
      <div class="cgm-top">
        <div class="cgm-tag">CGM · SÜREKLİ GLİKOZ İZLEME</div>
        <div class="cgm-live"><span class="cgm-pulse"></span>CANLI TELEMETRİ</div>
      </div>
      <div class="cgm-screen">
        <svg viewBox="0 0 440 130" preserveAspectRatio="none">
          <defs>
            <linearGradient id="gluGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="#3de8f5"/>
              <stop offset="38%" stop-color="#2bf0ab"/>
              <stop offset="68%" stop-color="#ffb703"/>
              <stop offset="100%" stop-color="#ff4d6d"/>
            </linearGradient>
            <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(25,196,139,0.22)"/>
              <stop offset="100%" stop-color="rgba(25,196,139,0.06)"/>
            </linearGradient>
            <filter id="gluGlow" x="-10%" y="-30%" width="120%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" flood-color="#3de8f5" flood-opacity="0.9"/>
            </filter>
            <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#3de8f5" flood-opacity="1"/>
            </filter>
          </defs>
          
          <!-- Background Grid Lines -->
          <line x1="0" y1="18" x2="440" y2="18" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="4 4"/>
          <line x1="0" y1="45" x2="440" y2="45" stroke="rgba(25,196,139,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="0" y1="90" x2="440" y2="90" stroke="rgba(25,196,139,0.3)" stroke-width="1" stroke-dasharray="3 3"/>
          <line x1="0" y1="118" x2="440" y2="118" stroke="rgba(255,255,255,0.07)" stroke-width="1" stroke-dasharray="4 4"/>

          <!-- Value scale marks on the right -->
          <text x="435" y="22" fill="rgba(255,255,255,0.35)" font-size="10" text-anchor="end">220</text>
          <text x="435" y="49" fill="#2bf0ab" font-size="10" font-weight="600" text-anchor="end">180</text>
          <text x="435" y="94" fill="#2bf0ab" font-size="10" font-weight="600" text-anchor="end">70</text>
          <text x="435" y="122" fill="rgba(255,255,255,0.35)" font-size="10" text-anchor="end">40</text>

          <!-- Normal Target Range Band (70 - 180 mg/dL) -->
          <rect x="0" y="45" width="440" height="45" class="band" fill="url(#bandGrad)" stroke="rgba(25,196,139,0.35)" stroke-width="1"/>
          <text x="14" y="72" fill="rgba(255,255,255,0.6)" font-size="11" font-weight="600" letter-spacing="1">HEDEF ARALIK (70 - 180 mg/dL)</text>

          <!-- Glucose curve -->
          <path class="gl" fill="none" stroke="url(#gluGrad)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round" filter="url(#gluGlow)"
            d="M0 80 C35 76 55 64 85 68 S135 96 170 88 S220 38 260 34 S325 72 365 80 S405 58 440 64"/>
          
          <!-- Live Cursor Marker -->
          <circle class="dot-halo" r="11" cx="260" cy="34" fill="rgba(61,232,245,0.25)"/>
          <circle class="dot" r="5.5" cx="260" cy="34" fill="#ffffff" stroke="#3de8f5" stroke-width="2.5" filter="url(#dotGlow)"/>
        </svg>
      </div>
      <div class="vals">
        <div class="cgm-stat">
          <span class="cgm-lbl">ANLIK GLİKOZ</span>
          <div class="cgm-num-box">
            <b data-g class="cgm-num">128</b>
            <span class="cgm-unit">mg/dL</span>
          </div>
        </div>
        <div class="cgm-badge-box">
          <span class="cgm-arrow" data-arr>↗</span>
          <span class="warn" data-w>Hedef aralıkta</span>
        </div>
        <div class="cgm-predict">
          <span class="cgm-sub">YZ TAHMİNİ (30 dk)</span>
          <b class="cgm-pred-val">Stabil Seyir</b>
        </div>
      </div>
    </div>`,
    start(r) {
      const p = $('.gl', r), dot = $('.dot', r), halo = $('.dot-halo', r), g = $('[data-g]', r), w = $('[data-w]', r), arr = $('[data-arr]', r);
      if (!p) return;
      const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L });
      const o = { t: 0 };
      gsap.to(o, { t: 1, duration: 6, repeat: -1, repeatDelay: 1.2, ease: 'none', onUpdate() {
        p.style.strokeDashoffset = L * (1 - o.t);
        const pt = p.getPointAtLength(L * o.t);
        if (dot) { dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); }
        if (halo) { halo.setAttribute('cx', pt.x); halo.setAttribute('cy', pt.y); }
        const v = Math.round(222 - pt.y * 1.55);
        if (g) g.textContent = v;
        const hi = v > 155;
        const lo = v < 85;
        if (w) {
          if (hi) {
            w.textContent = 'Yükselme eğilimi · Uyarı';
            w.className = 'warn on high';
            if (arr) { arr.textContent = '↑'; arr.className = 'cgm-arrow high'; }
          } else if (lo) {
            w.textContent = 'Düşüş eğilimi · Hipo riski';
            w.className = 'warn on low';
            if (arr) { arr.textContent = '↓'; arr.className = 'cgm-arrow low'; }
          } else {
            w.textContent = 'Hedef aralıkta';
            w.className = 'warn normal';
            if (arr) { arr.textContent = '↗'; arr.className = 'cgm-arrow normal'; }
          }
        }
      } });
    }
  },
  drip: {
    big: true,
    html: () => `<div class="vz vz-big vz-device">
      <div class="vz-device-header">
        <span class="vz-tag">AKILLI TIBBİ CİHAZ · İNFÜZYON</span>
        <span class="vz-status-pill ok"><i class="vz-dot"></i> DOZ KONTROLÜ AKTİF</span>
      </div>
      <div class="vz-canvas-wrap">
        <svg viewBox="0 0 340 400">
          <defs>
            <linearGradient id="ivBagGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="rgba(61,232,245,0.12)"/>
              <stop offset="50%" stop-color="rgba(61,232,245,0.04)"/>
              <stop offset="100%" stop-color="rgba(61,232,245,0.15)"/>
            </linearGradient>
            <linearGradient id="ivLiquidGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#3de8f5" stop-opacity="0.45"/>
              <stop offset="100%" stop-color="#12688f" stop-opacity="0.75"/>
            </linearGradient>
            <filter id="dripGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#3de8f5" flood-opacity="0.7"/>
            </filter>
          </defs>
          
          <!-- IV Stand / Hanger -->
          <line x1="170" y1="10" x2="170" y2="35" stroke="#798fa8" stroke-width="4" stroke-linecap="round"/>
          <path d="M150 25 C150 15 190 15 190 25" fill="none" stroke="#798fa8" stroke-width="3"/>
          <circle cx="170" cy="35" r="4" fill="#3de8f5"/>

          <!-- IV Bag Body -->
          <path class="stroke" fill="url(#ivBagGrad)" stroke="#3de8f5" stroke-width="2.5"
            d="M110 38 h120 a16 16 0 0 1 16 16 v145 a55 55 0 0 1 -55 55 h-42 a55 55 0 0 1 -55 -55 v-145 a16 16 0 0 1 16 -16z"/>
          
          <!-- Volume graduation lines -->
          <g stroke="rgba(255,255,255,0.3)" stroke-width="1.5">
            <line x1="120" y1="80" x2="135" y2="80"/><text x="142" y="83" fill="rgba(255,255,255,0.5)" font-size="10">250</text>
            <line x1="120" y1="120" x2="135" y2="120"/><text x="142" y="123" fill="rgba(255,255,255,0.5)" font-size="10">150</text>
            <line x1="120" y1="160" x2="135" y2="160"/><text x="142" y="163" fill="rgba(255,255,255,0.5)" font-size="10">50</text>
          </g>

          <!-- Liquid in Bag -->
          <rect class="fill" x="116" y="110" width="108" height="110" rx="12" fill="url(#ivLiquidGrad)" stroke="rgba(61,232,245,0.4)" stroke-width="1"/>
          
          <!-- Drip Chamber -->
          <rect x="156" y="244" width="28" height="52" rx="6" fill="rgba(61,232,245,0.12)" stroke="#3de8f5" stroke-width="2"/>
          <line x1="170" y1="239" x2="170" y2="249" stroke="#3de8f5" stroke-width="2.5"/>
          <circle class="drop d1" cx="170" cy="254" r="4.5" fill="#3de8f5" filter="url(#dripGlow)"/>
          <circle class="drop d2" cx="170" cy="254" r="4.5" fill="#3de8f5" filter="url(#dripGlow)"/>
          <rect x="160" y="284" width="20" height="10" rx="3" fill="#12688f"/>

          <!-- Tubing to Pump -->
          <path d="M170 296 v25 q0 24 35 30 h15" fill="none" stroke="rgba(61,232,245,0.7)" stroke-width="2.5" stroke-linecap="round"/>

          <!-- Smart Pump Controller -->
          <g class="pump-group">
            <rect class="pump" x="200" y="315" width="125" height="74" rx="12" fill="#091b35" stroke="#7952ff" stroke-width="2.5"/>
            <!-- Screen inside pump -->
            <rect x="210" y="324" width="105" height="36" rx="6" fill="#030c1a" stroke="rgba(61,232,245,0.3)" stroke-width="1"/>
            <text x="262" y="348" text-anchor="middle" fill="#3de8f5" font-family="'Space Grotesk', monospace" font-size="20" font-weight="700">1.2 mL/s</text>
            <!-- Pump status labels -->
            <circle cx="218" cy="374" r="3.5" fill="#19c48b"/>
            <text x="227" y="377" fill="#cde0f5" font-size="10" font-weight="600" letter-spacing="0.5">DERS AKTİF</text>
            <text x="306" y="377" fill="#798fa8" font-size="9" text-anchor="end">OTO-LİMİT</text>
          </g>
        </svg>
      </div>
      <div class="vz-device-footer">
        <div class="vz-f-item"><span class="f-dot green"></span><span>Akıllı Doz Hata Azaltma (DERS)</span></div>
        <div class="vz-f-item"><span class="f-dot blue"></span><span>Hava Kabarcığı & Basınç Sensörü</span></div>
      </div>
    </div>`,
    start(r) {
      const drops = $$('.drop', r);
      drops.forEach((d, i) => {
        gsap.fromTo(d,
          { y: 0, opacity: 1, scale: 1 },
          { y: 32, opacity: 0.1, scale: 0.85, duration: 1.15, repeat: -1, delay: i * 0.58, ease: 'power1.in' }
        );
      });
      const f = $('.fill', r);
      if (f) {
        gsap.to(f, { attr: { y: 125, height: 95 }, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      }
    }
  },
  wheel: {
    big: true,
    html: () => `<div class="vz vz-big vz-device">
      <div class="vz-device-header">
        <span class="vz-tag">OTONOM HASTA TRANSFERİ</span>
        <span class="vz-status-pill ok"><i class="vz-dot"></i> LiDAR AKTİF</span>
      </div>
      <div class="vz-canvas-wrap">
        <svg viewBox="0 0 340 400">
          <defs>
            <linearGradient id="routeGrad" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stop-color="#3de8f5"/>
              <stop offset="50%" stop-color="#ffb703"/>
              <stop offset="100%" stop-color="#ff4d6d"/>
            </linearGradient>
            <filter id="radGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#3de8f5" flood-opacity="0.6"/>
            </filter>
          </defs>

          <!-- LiDAR Radar Scan Waves -->
          <g class="radar">
            <circle class="rad-ring" cx="150" cy="180" r="60" fill="none" stroke="rgba(61,232,245,0.45)" stroke-width="1.8" stroke-dasharray="5 5"/>
            <circle class="rad-ring" cx="150" cy="180" r="110" fill="none" stroke="rgba(61,232,245,0.3)" stroke-width="1.8" stroke-dasharray="6 6"/>
            <circle class="rad-ring" cx="150" cy="180" r="155" fill="none" stroke="rgba(61,232,245,0.2)" stroke-width="1.5" stroke-dasharray="8 8"/>
          </g>

          <!-- Obstacle Detection Point -->
          <g class="obstacle" transform="translate(230, 190)">
            <circle cx="0" cy="0" r="16" fill="rgba(255,77,109,0.2)" stroke="#ff4d6d" stroke-width="2"/>
            <text x="0" y="5" text-anchor="middle" fill="#ff4d6d" font-size="14" font-weight="bold">⚠</text>
            <text x="0" y="26" text-anchor="middle" fill="#ff758f" font-size="10" font-weight="600">ENGEL</text>
          </g>

          <!-- Dynamic Rerouting Trajectory -->
          <path class="route" d="M35 365 C100 335 55 245 150 220 S265 140 265 50" fill="none" stroke="url(#routeGrad)" stroke-width="3.5" stroke-linecap="round"/>

          <!-- Wheelchair + Rider -->
          <g class="chair">
            <!-- Rear Main Wheel -->
            <circle cx="125" cy="275" r="60" fill="rgba(61,232,245,0.06)" stroke="#3de8f5" stroke-width="3.5"/>
            <circle cx="125" cy="275" r="32" fill="none" stroke="rgba(61,232,245,0.3)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <circle cx="125" cy="275" r="8" fill="#3de8f5"/>
            <!-- Front Caster Wheel -->
            <circle cx="218" cy="312" r="22" fill="rgba(61,232,245,0.06)" stroke="#3de8f5" stroke-width="3"/>
            <circle cx="218" cy="312" r="5" fill="#3de8f5"/>
            <line x1="218" y1="312" x2="208" y2="280" stroke="#3de8f5" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Frame, Footrest, Seat -->
            <path d="M100 95 v120 h108 l28 65 M98 215 h-30 M175 280 h35" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Head / Patient Sensor Node -->
            <circle cx="118" cy="62" r="22" fill="rgba(121,82,255,0.3)" stroke="#7952ff" stroke-width="3"/>
            <!-- Vital sensor indicator on chair -->
            <circle cx="145" cy="180" r="4" fill="#19c48b"/>
          </g>

          <!-- Dynamic Guidance Text -->
          <rect x="25" y="360" width="290" height="28" rx="8" fill="rgba(5,15,32,0.85)" stroke="rgba(61,232,245,0.3)" stroke-width="1"/>
          <text x="170" y="379" text-anchor="middle" fill="#d2e5f8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600">
            🧭 Engel algılandı → Güvenli rota güncellendi
          </text>
        </svg>
      </div>
      <div class="vz-device-footer">
        <div class="vz-f-item"><span class="f-dot cyan"></span><span>360° Ultrasonik + LiDAR Güvenlik Çemberi</span></div>
        <div class="vz-f-item"><span class="f-dot green"></span><span>Entegre Vital Bulgu Monitörü (Nabız/SpO₂)</span></div>
      </div>
    </div>`,
    start(r) {
      const rings = $$('.radar .rad-ring', r);
      rings.forEach((c, i) => {
        gsap.fromTo(c,
          { opacity: 0.8, scale: 0.6, transformOrigin: '150px 180px' },
          { opacity: 0, scale: 1.15, duration: 2.6, repeat: -1, delay: i * 0.7, ease: 'power1.out' }
        );
      });
      const p = $('.route', r);
      if (p) {
        gsap.fromTo(p, { strokeDasharray: '10 12', strokeDashoffset: 0 }, { strokeDashoffset: -220, duration: 4, ease: 'none', repeat: -1 });
      }
      const chair = $('.chair', r);
      if (chair) {
        gsap.to(chair, { y: -6, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
    }
  },
  bed: {
    big: true,
    html: () => `<div class="vz vz-big vz-device">
      <div class="vz-device-header">
        <span class="vz-tag">AKILLI HASTA YATAĞI · BASI ÖNLEME</span>
        <span class="vz-status-pill ok"><i class="vz-dot"></i> SENSÖRLER AKTİF</span>
      </div>
      <div class="vz-canvas-wrap">
        <svg viewBox="0 0 340 400">
          <defs>
            <filter id="ecgGlow" x="-20%" y="-40%" width="140%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#19c48b" flood-opacity="0.8"/>
            </filter>
            <linearGradient id="mattressGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="rgba(61,232,245,0.3)"/>
              <stop offset="100%" stop-color="rgba(121,82,255,0.2)"/>
            </linearGradient>
          </defs>

          <!-- Top Section: Integrated Vitals Telemetry Panel -->
          <g class="vitals-panel" transform="translate(15, 20)">
            <rect x="0" y="0" width="310" height="150" rx="14" fill="#06162e" stroke="rgba(61,232,245,0.25)" stroke-width="1.5"/>
            <!-- Heart Rate -->
            <text x="24" y="48" fill="#3de8f5" font-family="'Space Grotesk', monospace" font-size="46" font-weight="700">72</text>
            <text x="86" y="32" fill="#9ec5ea" font-size="13" font-weight="600">bpm</text>
            <text x="86" y="48" fill="rgba(255,255,255,0.5)" font-size="11">NABIZ</text>

            <!-- SpO2 -->
            <text x="175" y="48" fill="#19c48b" font-family="'Space Grotesk', monospace" font-size="46" font-weight="700">98%</text>
            <text x="262" y="32" fill="#9ec5ea" font-size="13" font-weight="600">SpO₂</text>
            <text x="262" y="48" fill="rgba(255,255,255,0.5)" font-size="11">OKSİJEN</text>

            <!-- ECG Live Trace Line -->
            <line x1="20" y1="105" x2="290" y2="105" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
            <path class="hr" d="M20 105 L70 105 L82 82 L96 130 L110 95 L120 105 L290 105"
              fill="none" stroke="#19c48b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#ecgGlow)"/>
            <text x="24" y="136" fill="#19c48b" font-size="11" font-weight="600" letter-spacing="1">● NORMAL SİNÜS RİTMİ</text>
            <text x="286" y="136" text-anchor="end" fill="rgba(255,255,255,0.5)" font-size="11">25 mm/s</text>
          </g>

          <!-- Bottom Section: Articulating Smart Bed -->
          <g class="bedg" transform="translate(15, 190)">
            <!-- Bed Base Frame -->
            <rect class="stroke" x="15" y="115" width="280" height="24" rx="8" fill="#082042" stroke="#3de8f5" stroke-width="2.5"/>
            <!-- Legs & Wheels -->
            <line x1="45" y1="139" x2="45" y2="165" stroke="#3de8f5" stroke-width="3"/>
            <circle cx="45" cy="172" r="7" fill="#082042" stroke="#3de8f5" stroke-width="2.5"/>
            <line x1="265" y1="139" x2="265" y2="165" stroke="#3de8f5" stroke-width="3"/>
            <circle cx="265" cy="172" r="7" fill="#082042" stroke="#3de8f5" stroke-width="2.5"/>

            <!-- Articulating Head Section (Rotates up/down) -->
            <g class="head" transform-origin="100 115">
              <rect class="fill head-mattress" x="25" y="70" width="95" height="42" rx="10" fill="url(#mattressGrad)" stroke="#7952ff" stroke-width="2.5"/>
              <line x1="30" y1="72" x2="115" y2="72" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
              <!-- Headrest Angle Indicator -->
              <text x="65" y="96" fill="#ffffff" font-size="12" font-weight="700" text-anchor="middle">30° Fowler</text>
            </g>

            <!-- Flat Lower Mattress & Pelvic Zone -->
            <rect class="fill body-mattress" x="122" y="90" width="168" height="24" rx="8" fill="url(#mattressGrad)" stroke="#3de8f5" stroke-width="2"/>
            
            <!-- Pressure Sensor Distribution Nodes (Decubitus ulcer prevention) -->
            <circle cx="150" cy="102" r="4" fill="#2bf0ab"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite"/></circle>
            <circle cx="185" cy="102" r="4" fill="#2bf0ab"><animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" begin="0.5s"/></circle>
            <circle cx="220" cy="102" r="4" fill="#2bf0ab"><animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" begin="1s"/></circle>
            <circle cx="255" cy="102" r="4" fill="#2bf0ab"><animate attributeName="opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" begin="1.5s"/></circle>
          </g>

          <!-- Automatic Positioning Indicator Tag -->
          <rect x="25" y="365" width="290" height="28" rx="8" fill="rgba(5,15,32,0.85)" stroke="rgba(61,232,245,0.3)" stroke-width="1"/>
          <text x="170" y="384" text-anchor="middle" fill="#d2e5f8" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="600">
            🛏️ Bası yarası önleme: Basınç noktaları dinamik dengeleniyor
          </text>
        </svg>
      </div>
      <div class="vz-device-footer">
        <div class="vz-f-item"><span class="f-dot cyan"></span><span>Mikro-İklim & Dinamik Basınç Dağılımı</span></div>
        <div class="vz-f-item"><span class="f-dot green"></span><span>Temassız Sürekli Vital Bulgu Takibi</span></div>
      </div>
    </div>`,
    start(r) {
      const head = $('.head', r);
      if (head) {
        gsap.to(head, { rotation: -24, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' });
      }
      const h = $('.hr', r);
      if (h) {
        const L = h.getTotalLength();
        gsap.fromTo(h, { strokeDasharray: L, strokeDashoffset: L }, { strokeDashoffset: 0, duration: 1.6, repeat: -1, ease: 'none' });
      }
    }
  }
};

/* ------------------------------------------------------------------ */
/* Yerleşim (dünya koordinatları)                                      */
/* ------------------------------------------------------------------ */
const COLS = 6, DX = 3000, DY = 2500;
const ROT = [0, -4, 3, -2, 5, -5, 2, -3, 4, 0, -4, 3];
const F = {};          // id → frame kaydı
const STEPS = [];      // gezinme adımları
const tops = [];       // tepe-seviye kayıtlar (rota için)

DECK.forEach((d, i) => {
  const row = Math.floor(i / COLS); let col = i % COLS; if (row % 2) col = COLS - 1 - col;
  const jit = (n, m) => ((i * n) % m) - m / 2;
  d.x = col * DX + jit(137, 380); d.y = row * DY + jit(91, 300);
  d.r = d.type === 'surgery' ? 0 : ROT[i % ROT.length];
  d.s = d.type === 'chap' ? 1.15 : 1;
});

/* ------------------------------------------------------------------ */
/* DOM üretimi                                                         */
/* ------------------------------------------------------------------ */
const framesEl = $('#frames');
const T = {};   // tip → html şablonu

T.hero = d => `
  <div class="logos rv">
    <div class="logo-wrap"><img src="assets/img/logo-scu.png" alt="Sivas Cumhuriyet Üniversitesi"></div>
    <div class="logo-wrap"><img src="assets/img/logo-eru.png" alt="Erciyes Üniversitesi"></div>
  </div>
  <div class="tag eyebrow rv">Sivas Cumhuriyet Üniversitesi × Erciyes Üniversitesi</div>
  <h1><span class="l a">SAĞLIKTA</span><span class="l b ai">YAPAY ZEKA</span><span class="l c">UYGULAMALARI</span></h1>
  <div class="sub rv">Klinik Beceri Eğitiminde Kullanımı<small>Hemşirelikte yapay zeka: bugün ne yapıyor, yarın ne yapacak?</small></div>
  <div class="by rv">PROF. DR. AHMET ALTUN</div>
  <div class="hero-visual-card rv">
    <img class="hero-illu" src="assets/img/ai_health_hero.jpg" alt="Sağlıkta Yapay Zeka">
    
    <!-- Holografik Kalp Nabız ve Tarama Efektleri (Orijinal çizimle %100 uyumlu) -->
    <div class="hero-heart-fx">
      <div class="heart-pulse-glow"></div>
      <div class="heart-scan-ring ring-a"></div>
      <div class="heart-scan-ring ring-b"></div>
      <div class="heart-scan-reticle"></div>
    </div>

    <div class="hero-hud">
      <div class="hud-tag top-tag">
        <span class="hud-pulse"></span>
        <span>KLİNİK SİMÜLASYON & BECERİ EĞİTİMİ</span>
      </div>
      <div class="hud-stat-badge stat-vitals">
        <div class="stat-icon">❤️</div>
        <div class="stat-info">
          <span class="stat-lbl">HAYATİ BULGU İZLEMİ</span>
          <div class="stat-val"><b data-hero-bpm>74</b> <small>bpm · Stabil</small></div>
        </div>
        <div class="stat-sparkline">
          <svg viewBox="0 0 70 24"><path d="M0 12 L18 12 L24 4 L30 20 L36 8 L42 16 L48 12 L70 12" fill="none" stroke="#2bf0ab" stroke-width="2.2" stroke-linecap="round"/></svg>
        </div>
      </div>
      <div class="hud-stat-badge stat-ai">
        <div class="stat-icon cyan">🧠</div>
        <div class="stat-info">
          <span class="stat-lbl">NÖRAL KLİNİK MODEL</span>
          <div class="stat-val"><b class="c-cyan">%99.4</b> <small>Doğruluk</small></div>
        </div>
      </div>
      <div class="hud-reticle">
        <div class="reticle-ring"></div>
        <div class="reticle-label">AI ASSIST : ONLINE</div>
      </div>
      <div class="hud-tag bot-tag">
        <span>Geleceğin Hemşireliği · İnsan Dokunuşu + Yapay Zeka</span>
      </div>
    </div>
  </div>`;

T.poster = d => `
  <img class="holo" src="${IMG('holo')}" alt="">
  <img class="afis rv" src="assets/img/afis.jpg" alt="Etkinlik afişi">
  <div class="info">
    <div class="tag rv">Konferans · Hemşirelik Bölümü</div>
    <h2 class="t">Bir Gün, Bir Salon, Bir Gelecek</h2>
    <dl class="rv">
      <dt>KONUŞMACI</dt><dd>Prof. Dr. Ahmet ALTUN<br><span style="font-weight:500;color:#a9c0dd;font-size:26px">Sivas Cumhuriyet Üniversitesi Tıp Fakültesi · Tıbbi Farmakoloji AD</span></dd>
      <dt>TARİH</dt><dd>20 Ekim 2026 · 14.30 – 15.30</dd>
      <dt>YER</dt><dd>ERÜ Kadir Has Merkez Kütüphanesi Fikir Atölyesi</dd>
      <dt>DÜZENLEYEN</dt><dd>ERÜ Sağlık Bilimleri Fakültesi Hemşirelik Bölümü</dd>
    </dl>
  </div>`;

const ICON_PATH = n => ICONS[n];
T.chap = (d, idx) => {
  const sec = SECTIONS[d.sec], prev = SECTIONS[Math.max(0, d.sec - 1)];
  const titleLen = d.title.length;
  const fSize = titleLen > 40 ? 74 : titleLen > 24 ? 90 : 108;
  return `
  <div class="num rv">BÖLÜM ${sec.no}</div>
  <div class="chap-wrap">
    <h1 class="t" style="font-size:${fSize}px">${d.title}</h1>
    <p class="sub rv">${d.sub}</p>
  </div>
  <svg class="shape" viewBox="0 0 100 100"><path d="${ICONS[prev.icon]}"/></svg>`;
};

T.hub = (d) => `
  <div class="bgimg" style="background-image:url(${IMG(d.bg)})"></div>
  <div class="htitle">
    <div class="hno rv">${SECTIONS[d.sec].no} · ${d.kids.length} ALT KONU</div>
    <h1 class="t">${d.title}</h1>
    <p class="rv">${d.sub}</p>
    ${d.pipe ? `<div class="pipe rv"><span>VERİ</span><i>→</i><span>ÖRÜNTÜ</span><i>→</i><span>TAHMİN</span></div>` : ''}
  </div>`;

function vizBlock(k) {
  if (!k.viz) return '';
  const v = VIZ[k.viz];
  return v.big ? '' : `<div class="viz rv" data-viz="${k.viz}">${v.html()}</div>`;
}
T.card = (k, i, n) => {
  const len = k.title.length;
  const cls = len > 46 ? 'xs' : len > 28 ? 'sm' : '';
  const v = k.viz && VIZ[k.viz];
  const photo = k.img ? `<figure class="photo pv"><img src="${IMG(k.img)}" alt=""></figure>`
    : v && v.big ? `<figure class="photo pv vbox" data-viz="${k.viz}">${v.html()}</figure>` : '';
  return `<div class="stripe"></div>
    <div class="idx pv">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</div>
    ${k.long ? `<div class="big pv">${k.big}</div>` : ''}
    <div class="txt"><h2 class="pv ${cls}">${k.title}</h2><p class="body rv">${k.body}</p>${vizBlock(k)}</div>${photo}`;
};

T.mccarthy = () => `
  <div class="mhead"><div class="tag rv">1956 · Dartmouth Konferansı</div>
    <h2 class="t">John McCarthy<span>The Father of Artificial Intelligence</span></h2></div>
  <p class="mtxt rv"><em>1956'da John McCarthy, Dartmouth Konferansı</em> sırasında "Yapay Zeka" terimini ortaya attı ve bu, Yapay Zeka'nın bir çalışma alanı olarak başlangıcını işaret etti. Onun katkıları, gelecekteki gelişmelerin temelini attı ve sağlık hizmetleri de dahil olmak üzere çeşitli alanları etkiledi.</p>
  <div class="ph rv" style="left:760px"><img src="${IMG('mccarthy1')}" alt=""></div>
  <div class="ph rv" style="left:1150px"><img src="${IMG('mccarthy2')}" alt=""></div>
  <div class="tl">
    <div class="line"></div>
    ${[['1858', 'Nightingale, istatistik ve grafiklerle bakımı iyileştirir'], ['1950', 'Turing: «Makineler düşünebilir mi?»'], ['1956', '«Yapay Zeka» terimi doğar', 1], ['1958', 'McCarthy, LISP dilini geliştirir'], ['1997', 'Deep Blue, satranç şampiyonunu yener'], ['2016', 'AlphaGo, Go şampiyonunu yener'], ['2022', 'Üretken YZ herkesin eline geçer']].map(([y, t, h], i) => `<div class="ev ${h ? 'hot' : ''}" style="left:${i * 208}px"><b>${y}</b><i></i><span>${t}</span></div>`).join('')}
  </div>`;

/* Zihin haritası verisi */
const MAP = [
  ['Makine Öğrenimi', ['Derin Öğrenme', 'Tahmine Dayalı Analitik']],
  ['Doğal Dil İşleme', ['Çeviri', 'Sınıflandırma & Kümeleme', 'Bilgi Çıkarımı']],
  ['Konuşma', ['Konuşmadan Metne', 'Metinden Konuşmaya']],
  ['Uzman Sistemler', []],
  ['Planlama, Çizelgeleme\n& Optimizasyon', []],
  ['Robotik', []],
  ['Görüntü', ['Görüntü Tanıma', 'Makine Görüşü']]
];
const MAPCOL = ['#4d8dff', '#2fd3c0', '#f4c542', '#ff7a59', '#b18cff', '#7bd65a', '#ff6fa8'];
T.map = () => `<h2 class="t">Yapay Zekanın Alanları</h2><svg viewBox="0 0 1600 900"><g id="mapg"></g></svg>
  <div class="tag rv" style="position:absolute;right:80px;top:70px;text-align:right;max-width:520px;color:#9fd3ff">Hemşirelikte gördüğümüz uygulamaların çoğu bu dallardan birinin ürünüdür</div>`;

T.venn = () => `<h2 class="t"><em>AI</em> vs <em>ML</em> vs <em>DL</em> vs <em>DS</em></h2>
  <svg viewBox="0 0 1600 900"><defs>
    <radialGradient id="gAI" cx="50%" cy="30%"><stop offset="0" stop-color="#1c3f87"/><stop offset="1" stop-color="#0d2150"/></radialGradient>
    <radialGradient id="gML" cx="50%" cy="30%"><stop offset="0" stop-color="#2557b8"/><stop offset="1" stop-color="#173a7d"/></radialGradient>
    <radialGradient id="gDL" cx="50%" cy="30%"><stop offset="0" stop-color="#3e7bff"/><stop offset="1" stop-color="#2658c9"/></radialGradient>
    <radialGradient id="gDS" cx="50%" cy="30%"><stop offset="0" stop-color="#1fd2c4" stop-opacity=".85"/><stop offset="1" stop-color="#0f8f9c" stop-opacity=".85"/></radialGradient></defs>
    <g id="vg">
      <circle class="vc" data-i="0" cx="800" cy="560" r="300" fill="url(#gAI)" stroke="#6fa3ff" stroke-width="3"/>
      <circle class="vc" data-i="1" cx="800" cy="650" r="205" fill="url(#gML)" stroke="#8fb8ff" stroke-width="3"/>
      <circle class="vc" data-i="2" cx="860" cy="730" r="115" fill="url(#gDL)" stroke="#bcd5ff" stroke-width="3"/>
      <circle class="vc" data-i="3" cx="640" cy="705" r="165" fill="url(#gDS)" stroke="#8ff3e8" stroke-width="3"/>
      <g class="vl" fill="#fff" font-family="Anton" text-anchor="middle" style="text-transform:uppercase">
        <text data-i="0" x="800" y="330" font-size="46">Yapay Zeka</text>
        <text data-i="1" x="800" y="480" font-size="40">Makine Öğrenimi</text>
        <text data-i="2" x="880" y="740" font-size="34">Derin Öğrenme</text>
        <text data-i="3" x="590" y="720" font-size="36">Veri Bilimi</text>
      </g>
      <g stroke="#3de8f5" stroke-width="2" stroke-dasharray="4 6" class="vlines">
        <path data-i="0" d="M1015 350 L1120 270"/><path data-i="1" d="M985 585 L1120 520"/>
        <path data-i="2" d="M970 750 L1120 735"/><path data-i="3" d="M480 690 L430 650"/></g>
    </g></svg>
  <div class="vcall" data-i="0" style="left:1130px;top:190px"><h3>Yapay Zeka</h3>İnsan davranışını taklit eden akıllı makineler yaratmaktır.<span class="ex">Örnek: hasta düşme riski uyarı sistemi</span></div>
  <div class="vcall" data-i="1" style="left:1130px;top:420px"><h3>Makine Öğrenimi</h3>YZ'nin bir alt kümesidir; tahmin yapmak için eğitim verisine dayalı model kurar.<span class="ex">Örnek: vital bulgulardan sepsis riski tahmini</span></div>
  <div class="vcall" data-i="2" style="left:1130px;top:640px"><h3>Derin Öğrenme</h3>ML'nin bir alt kümesi; karmaşık problemleri çözen çok katmanlı algoritmalar.<span class="ex">Örnek: akciğer grafisinde pnömoni tespiti</span></div>
  <div class="vcall l" data-i="3" style="left:20px;top:520px"><h3>Veri Bilimi</h3>İstatistik ve bilimsel yöntemlerle veriden anlam ve içgörü çıkarır; YZ ile iç içe çalışır.<span class="ex">Örnek: hemşire iş yükü analizi</span></div>`;

T.role = () => `
  <div class="tag rv" style="position:absolute;left:96px;top:60px">TEMEL ROL</div>
  <h2 class="t" style="position:absolute;left:96px;top:100px;font-size:62px;line-height:1.16;width:780px">YZ şunu iyileştirir:<br><span class="roller"><div class="rl"><span>Hasta Sonuçlarını</span><span>Operasyonel Verimliliği</span><span>Klinik Kararı</span><span>Hasta Sonuçlarını</span></div></span></h2>
  <p class="rv" style="position:absolute;left:96px;top:280px;width:760px;font-size:24px;line-height:1.55;color:#e1eefc">Yapay Zeka, hasta sonuçlarını, operasyonel verimliliği ve klinik karar verme süreçlerini önemli ölçüde iyileştirdiği için sağlık hizmetlerinde hayati bir role sahiptir. Teknolojilerden yararlanarak sağlık hizmeti sağlayıcıları <em>daha kesin teşhisler koyabilir, iş akışlarını düzenleyebilir ve kişiselleştirilmiş hasta bakımı sağlayabilir;</em> bu da nihayetinde iyileştirilmiş sağlık sonuçları ve kaynak optimizasyonu ile sonuçlanır.</p>
  <img class="rv" src="${IMG('hosp_a')}" style="position:absolute;left:96px;top:560px;width:760px;height:250px;object-fit:cover;border-radius:26px" alt="">
  <img class="rv" src="${IMG('hosp_b')}" style="position:absolute;right:70px;top:60px;width:620px;height:780px;object-fit:cover;border-radius:36px" alt="">`;

T.surgery = () => `
  <h2 class="t">AI Yardımı ile Yapılan Cerrahi İşlemler</h2><div class="tag rv" style="position:absolute;right:80px;top:70px">KAYDIRARAK KARŞILAŞTIR</div>
  <div class="cmp" data-noclick>
    <img src="${IMG('aisurg')}" alt=""><img class="top" src="${IMG('classicsurg')}" alt="">
    <div class="handle"></div><span class="lab a">GELENEKSEL</span><span class="lab b">YZ DESTEKLİ</span>
  </div>
  <div class="cols">
    <div class="rv"><h3>Geleneksel Cerrahilerin Kısıtlılıkları</h3>Geleneksel cerrahi yöntemler büyük ölçüde cerrahın <em>doğrudan becerisine ve deneyimine</em> dayanır; bu da performansta değişkenliğe yol açabilir. İnsan hatası bir risk oluşturur ve komplikasyonlara ya da optimal olmayan sonuçlara neden olabilir.</div>
    <div class="rv"><h3>YZ Destekli Cerrahi</h3>Cerrahlara <em>gelişmiş görselleştirme araçları</em> ve hassas enstrümanlar sağlayarak cerrahi süreci geliştirir, operasyonlar sırasında daha iyi hassasiyet sunar. Karmaşık ameliyatları destekler ve genel hasta sonuçlarını iyileştirir.</div>
  </div>`;
T.surgery = T.surgery;

T.analytics = () => `
  <div class="txt"><div class="tag rv">KKDS · TAHMİNE DAYALI ANALİTİK</div><h2 class="t">Hemşirelikte Tahmine Dayalı Analitik</h2>
    <p class="rv">Tahmine dayalı analitik, <em>geçmiş verileri ve istatistiksel algoritmaları</em> kullanarak gelecekteki hasta ihtiyaçlarını ve sonuçlarını öngörür. Bu sayede sağlık profesyonelleri proaktif müdahaleler uygulayarak hasta bakımını iyileştirir ve komplikasyonları azaltır.</p>
    <img class="rv" src="${IMG('analytics')}" style="width:100%;height:210px;object-fit:cover;border-radius:26px" alt=""></div>
  <div class="panel rv" data-noclick>
    <div class="tag">CANLI SİMÜLASYON · ÖRNEK SENARYO</div><h3>Düşme Riski Tahmini</h3>
    <svg class="gauge" viewBox="0 0 400 240"><path d="M40 200 A160 160 0 0 1 360 200" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="30" stroke-linecap="round"/><path id="garc" d="M40 200 A160 160 0 0 1 360 200" fill="none" stroke="url(#gg)" stroke-width="30" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/><defs><linearGradient id="gg"><stop offset="0" stop-color="#19c48b"/><stop offset=".5" stop-color="#f4c542"/><stop offset="1" stop-color="#ff4d5e"/></linearGradient></defs>
      <text class="val" id="gval" x="200" y="178" text-anchor="middle">0</text><text class="lvl" id="glvl" x="200" y="214" text-anchor="middle" fill="#3de8f5">DÜŞÜK</text></svg>
    <p class="tag" style="margin-bottom:10px">Hasta özelliklerini aç/kapat</p>
    <div class="chips" id="gchips">
      <button data-w="22">Yaş &gt; 75</button><button data-w="20">Sedatif ilaç</button><button data-w="18">Önceki düşme</button><button data-w="14">Gece idrar sıklığı</button>
      <button class="good" data-w="-18">Yatak alarmı açık</button><button class="good" data-w="-14">Mobilizasyon desteği</button></div>
    <div class="rec" id="grec">Standart bakım planı yeterli.</div>
    <div class="note">Gerçek veri değildir; yapay zekânın girdilerden riski nasıl hesapladığını göstermek için hazırlanmıştır.</div></div>`;

T.chat = () => `
  <div class="col a"><h2 class="t">Yapay Zeka Destekli Sohbet Robotları</h2>
    <p class="rv">Sohbet robotları, <em>7/24 hizmet</em> vererek hastaların sorularına anında yanıt verir ve temel sağlık ihtiyaçlarında onlara rehberlik eder. Rutin sorgulamaları ele alarak hemşirelik personelinin iş yükünü azaltır ve hemşirelerin daha karmaşık hasta bakım görevlerine odaklanmalarına olanak tanır.</p><img class="rv" src="${IMG('chatrobot')}" alt=""></div>
  <div class="col b"><h2 class="t">Yapay Zeka Destekli Sanal Asistanlar</h2>
    <p class="rv">Sanal asistanlar, idari görevleri kolaylaştırarak, <em>randevu programlarını yöneterek ve hasta bakım aktiviteleri için hatırlatıcılar sağlayarak</em> hemşirelere destek olur. Bu, sağlık ekiplerinde verimliliği artırır ve genel hasta deneyimini iyileştirir.</p><img class="rv" src="${IMG('tablet')}" alt=""></div>
  <div class="phone"><header>SANAL ASİSTAN · ÖRNEK SENARYO</header><div class="msgs"></div></div>`;

T.robots = () => `
  <div class="c a"><img class="rv" src="${IMG('robotbear')}" alt=""><h2 class="t">Hasta Bakımını Geliştiren Robotlar</h2>
    <p class="rv">Japonya, Çin ve Avrupa ülkeleri gibi ülkeler, hasta bakımını geliştirmek ve sağlık personeline yardımcı olmak için robotları aktif olarak kullanıyor. <em>Örneğin Japonya, hastaları kaldırmak ve desteklemek için tasarlanmış RIBA robotunu (ardılı ROBEAR) geliştirdi; Çin ise Sanbot gibi ilaç hatırlatıcı robotları hizmete sundu.</em></p><span class="chip rv">RIBA · ROBEAR · SANBOT</span></div>
  <div class="c b"><img class="rv" src="${IMG('robotcare')}" alt=""><h2 class="t">İletişimi Kolaylaştıran Robotlar</h2>
    <p class="rv">Robotlar ayrıca çeşitli bölgelerde <em>uzaktan iletişim ve hasta izleme</em> için kullanılıyor. Avrupa'daki telepresence (uzaktan varlık) robotları, sağlık çalışanlarının hastaları ve aileleriyle uzaktan iletişim kurmasına olanak tanıyarak bakım sürekliliğini sağlıyor. Bu entegrasyon, hizmet sunum şeklini dönüştürüyor ve hasta sonuçlarını iyileştiriyor.</p><span class="chip rv">TELEPRESENCE</span></div>
  <div class="mid">AI</div>`;

T.ethics = () => `
  <div class="tag rv" style="position:absolute;left:96px;top:44px">BU SUNUMA EKLENDİ</div>
  <h2 class="t" style="top:90px">İnsan + Yapay Zeka: Güven Dört Ayak Üzerinde Durur</h2>
  <p class="lead rv">Yukarıdaki her uygulama değerli; ama yalnızca doğru kullanıldığında. Hemşirelik mesleği bu dönüşümün <em>sorumlu tarafı</em>.</p>
  <div class="pillars">
    ${[
      ['Veri Gizliliği ve KVKK', 'Hasta verisi en hassas veridir. Kişisel verilerin korunması hukuki ve etik bir zorunluluktur.', 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z'],
      ['Önyargı ve Adalet', 'Model, eğitildiği veri kadar adildir. Az temsil edilen gruplarda hata oranı artabilir.', 'M12 3v18M5 7h14M5 7l-3 8a4 4 0 0 0 6 0zM19 7l-3 8a4 4 0 0 0 6 0z'],
      ['Şeffaflık', 'Öneri neden verildi? Hemşire, sistemin gerekçesini anlayabilmeli ve sorgulayabilmeli.', 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z'],
      ['İnsan Gözetimi', 'Son karar klinisyendedir. Yapay zeka öneri sunar; sorumluluk devredilmez.', 'M12 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM4 21v-2a6 6 0 0 1 16 0v2M17 12l4 4']
    ].map(([t, p, d], i) => `<div class="pil rv" data-n="0${i + 1}"><svg viewBox="0 0 24 24" style="stroke-width:1.6"><path d="${d}"/></svg><h3>${t}</h3><p>${p}</p></div>`).join('')}
  </div>`;

T.end = () => `
  <img class="bgp" src="${IMG('speaker')}" alt="">
  <div class="quote"><span class="q1">Hiçbirimiz işimizi yapay zekaya kaptırmayacağız.</span><span class="q2 rv">Ama muhtemelen yapay zekayı bizden daha iyi kullanan birine <em>kaptıracağız…</em></span></div>
  <div class="thanks"><img class="afis" src="assets/img/afis.jpg" alt=""><div><h2 class="t">Teşekkürler</h2>
    <p>Prof. Dr. Ahmet ALTUN<br>Sivas Cumhuriyet Üniversitesi Tıp Fakültesi · Tıbbi Farmakoloji AD<br><span style="color:var(--cyan);font-family:var(--mono);font-size:24px">20 Ekim 2026 · ERÜ Fikir Atölyesi</span></p>
    <div class="lg"><img src="assets/img/logo-scu.png" alt=""><img src="assets/img/logo-eru.png" alt=""></div></div></div>`;

/* --- frame oluşturma --- */
function mkFrame(id, cls, html, x, y, r, s, extra = {}) {
  const el = document.createElement('section');
  el.className = `frame ${cls} pre`; el.id = 'f-' + id; el.innerHTML = html;
  framesEl.appendChild(el);
  gsap.set(el, { x: x - W / 2, y: y - H / 2, rotation: r, scale: s, transformOrigin: '50% 50%' });
  const f = Object.assign({ id, el, x, y, r, s, type: 'card' }, extra);
  F[id] = f; return f;
}
const CLS = { hero: 'f-hero', poster: 'f-poster', chap: 'f-chap', hub: 'f-hub', mccarthy: 'f-mc', map: 'f-map', venn: 'f-venn', role: 'f-flat', surgery: 'f-cmp', analytics: 'f-an', chat: 'f-chat', robots: 'f-rob', ethics: 'f-eth', end: 'f-end' };

DECK.forEach((d, i) => {
  const f = mkFrame(d.id, CLS[d.type] + (d.type === 'hub' ? ' n' + d.kids.length : ''), T[d.type](d, i), d.x, d.y, d.r, d.s, { type: d.type, sec: d.sec, deck: d, top: i });
  tops.push(f); STEPS.push({ f });
  if (d.type === 'hub') {
    const n = d.kids.length, rad = d.r * Math.PI / 180, cr = Math.cos(rad), sr = Math.sin(rad);
    let pos, sc;
    if (n === 3) { sc = .30; pos = [[430, -285], [430, 0], [430, 285]]; }
    else if (n === 4) { sc = .27; pos = [[160, -140], [610, -140], [160, 140], [610, 140]]; }
    else { sc = .22; pos = [[190, -245], [610, -245], [190, 0], [610, 0], [400, 245]]; }
    d.kids.forEach((k, j) => {
      const [lx, ly] = pos[j]; const wx = d.x + lx * cr - ly * sr, wy = d.y + lx * sr + ly * cr;
      const kf = mkFrame(k.id, 'f-card' + (k.long ? ' long' : ''), T.card(k, j, n), wx, wy, d.r, sc, { type: 'card', hub: d.id, sec: d.sec, k, kidx: j });
      STEPS.push({ f: kf });
      // Başlangıç önizleme: başlık kutucuğu tam doldurur, gövde gizlenir
      const h = $('h2', kf.el), body = $('.body', kf.el);
      const isLong = k.long;
      const prevY = isLong ? 200 : 160;
      const prevScale = isLong ? 1.45 : 1.25;
      gsap.set(h, { y: prevY, scale: prevScale, transformOrigin: 'left center' });
      gsap.set(body, { opacity: 0, visibility: 'hidden' });
      if (k.viz && !(VIZ[k.viz].big)) {
        const vz = $('.viz', kf.el);
        if (vz) gsap.set(vz, { opacity: 0, visibility: 'hidden' });
      }
    });
  }
});
STEPS.forEach((s, i) => { s.f.step = i; s.f.fam = s.f.hub || s.f.id; });

/* Ghost kelimeler */
(() => {
  const g = $('#ghosts');
  GHOSTS.forEach((w, i) => {
    const d = document.createElement('div'); d.className = 'ghost'; d.textContent = w;
    const col = i % 5, row = Math.floor(i / 5);
    d.style.cssText = `left:${col * DX + DX / 2 + rnd(-300, 300)}px;top:${row * DY + DY / 2 - 160 + rnd(-200, 200)}px;font-size:${rnd(300, 460)}px;transform:rotate(${rnd(-14, 14)}deg)`;
    g.appendChild(d);
  });
})();

/* Rota */
const routeSegs = [];
(() => {
  const svg = $('#route'), NS = 'http://www.w3.org/2000/svg';
  for (let i = 1; i < tops.length; i++) {
    const a = tops[i - 1], b = tops[i];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
    const nx = -dy * .25, ny = dx * .25;
    const dstr = `M${a.x} ${a.y} Q${mx + nx} ${my + ny} ${b.x} ${b.y}`;
    const base = document.createElementNS(NS, 'path'); base.setAttribute('d', dstr); base.setAttribute('class', 'base');
    const lit = document.createElementNS(NS, 'path'); lit.setAttribute('d', dstr); lit.setAttribute('class', 'lit'); lit.setAttribute('pathLength', 1);
    lit.style.strokeDasharray = 1; lit.style.strokeDashoffset = 1;
    svg.append(base, lit); routeSegs.push(lit);
  }
})();

/* ------------------------------------------------------------------ */
/* Özel çerçeve davranışları (enter / build)                          */
/* ------------------------------------------------------------------ */
function loop(f, fn) { f.loops = f.loops || gsap.context(() => { }, f.el); f.loops.add(fn); }

const A = {};   // tip → (f, tl, instant)

A.hero = (f, tl) => {
  const e = f.el;
  tl.fromTo($('.logos', e), { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'expo.out' }, 0.1)
    .fromTo($('.eyebrow', e), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.7 }, 0.25);
  kMaskSlide(tl, $('.a', e), 0.2, 0.04);
  kMaskSlide(tl, $('.b', e), 0.36, 0.04);
  kMaskSlide(tl, $('.c', e), 0.52, 0.04);
  tl.fromTo($('.hero-visual-card', e), { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0.45)
    .fromTo($('.hud-stat-badge', e), { scale: 0.8, opacity: 0, y: 20 }, { scale: 1, opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.8)' }, 0.9)
    .fromTo([$('.sub', e), $('.by', e)], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out' }, 0.85);

  loop(f, () => gsap.to($('.ai', e), { textShadow: '0 0 70px rgba(61,232,245,.95)', duration: 1.8, yoyo: true, repeat: -1 }));

  const bpm = $('[data-hero-bpm]', e);
  if (bpm) {
    loop(f, () => gsap.to({}, { duration: 1.3, repeat: -1, onRepeat() { bpm.textContent = Math.round(rnd(72, 76)); } }));
  }
};

A.poster = (f, tl) => {
  const e = f.el;
  tl.fromTo($('.afis', e), { rotationY: 40, x: -120, opacity: 0, transformPerspective: 1200 }, { rotationY: 0, x: 0, opacity: 1, duration: 1.3, ease: 'expo.out' }, 0);
  kMaskSlide(tl, $('h2', e), 0.25, 0.04);
  tl.fromTo([$('.tag', e), $('dl', e)], { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, stagger: 0.14, ease: 'power3.out' }, 0.5);
  loop(f, () => gsap.to($('.afis', e), { y: -8, duration: 2.8, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
};

A.chap = (f, tl) => {
  const e = f.el, d = f.deck, sec = SECTIONS[d.sec], path = $('.shape path', e);
  tl.fromTo($('.num', e), { opacity: 0, x: -35 }, { opacity: 1, x: 0, duration: 0.65 }, 0);
  kMaskSlide(tl, $('h1', e), 0.12, 0.038);
  tl.fromTo($('.sub', e), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.65);
  tl.fromTo($('.shape', e), { scale: 0.5, rotation: -40, opacity: 0 }, { scale: 1, rotation: 0, opacity: 1, duration: 1.4, ease: 'expo.out' }, 0.1);
  tl.to(path, { morphSVG: { shape: ICONS[sec.icon], type: 'rotational' }, duration: 1.6, ease: 'power3.inOut' }, 0.3);
  loop(f, () => gsap.to($('.shape', e), { rotation: 6, scale: 1.03, duration: 3.2, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
};

A.hub = (f, tl) => {
  const e = f.el;
  tl.fromTo($('.hno', e), { opacity: 0, x: -24 }, { opacity: 1, x: 0, duration: 0.6 }, 0);
  kWordPop(tl, $('h1', e), 0.1, 0.032);
  tl.fromTo($('.htitle p', e), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.5);
  const pipe = $('.pipe', e);
  if (pipe) tl.fromTo($$('span,i', pipe), { opacity: 0, x: -14 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.45 }, 0.75);

  // Bu hub'a ait çocuk kartların başlıklarını kutucuğu dolduran önizleme konumuna al
  const kids = Object.values(F).filter(x => x.hub === f.id);
  kids.forEach(k => {
    const h = $('h2', k.el), body = $('.body', k.el), isLong = k.k && k.k.long;
    const prevY = isLong ? 200 : 160;
    const prevScale = isLong ? 1.45 : 1.25;
    gsap.set(h, { y: prevY, scale: prevScale, transformOrigin: 'left center' });
    gsap.set(body, { opacity: 0, visibility: 'hidden' });
    const viz = $('.viz', k.el);
    if (viz) gsap.set(viz, { opacity: 0 });
  });

  const kidEls = kids.map(k => k.el);
  tl.fromTo(kidEls, { opacity: 0, y: '+=35' }, { opacity: 1, y: '-=35', duration: 0.75, stagger: 0.12, ease: 'power3.out', clearProps: 'opacity' }, 0.35);
};

A.card = (f, tl, instant) => {
  const e = f.el, h = $('h2', e), body = $('.body', e), ph = $('.photo', e), img = $('img', e);
  const isLong = f.k && f.k.long;
  const prevY = isLong ? 200 : 160;
  const prevScale = isLong ? 1.45 : 1.25;

  // Zoom yapıldığında başlık kutunun ortasından YUKARI kendi yerine kayar
  tl.fromTo(h,
    { y: prevY, scale: prevScale, transformOrigin: 'left center' },
    { y: 0, scale: 1, duration: 0.95, ease: 'power3.out' },
    0
  );

  if (img) tl.fromTo(img, { scale: 1.15 }, { scale: 1, duration: 1.4, ease: 'power3.out' }, 0);
  if (ph) tl.fromTo(ph, { x: 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.85, ease: 'expo.out' }, 0.08);

  // Başlık yukarı kayınca altındaki açıklama yazısı açılır
  tl.set(body, { visibility: 'visible' }, 0.28);
  tl.fromTo(body,
    { opacity: 0, y: 32 },
    { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' },
    0.32
  );
  $$('em, b', body).forEach((em, i) => {
    tl.fromTo(em, { color: '#ffffff' }, { color: 'var(--red)', duration: 0.6, ease: 'power2.out' }, 0.6 + i * 0.12);
  });

  const viz = $('.viz', e);
  if (viz) {
    tl.set(viz, { visibility: 'visible' }, 0.4);
    tl.fromTo(viz, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.75, ease: 'power3.out' }, 0.45);
  }
  $$('[data-viz]', e).forEach(v => loop(f, () => VIZ[v.dataset.viz].start(v)));
  if (img) loop(f, () => gsap.to(img, { scale: 1.05, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
};

A.mccarthy = (f, tl) => {
  const e = f.el;
  tl.fromTo($('.tag', e), { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 0.6 }, 0);
  kCyberDecode(tl, $('h2', e), 0.1, 0.02);
  tl.set($('.mtxt', e), { opacity: 1 }, 0);
  kWords(tl, $('.mtxt', e), 0.45);
  tl.fromTo($$('.ph', e), { opacity: 0, y: 45, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.16, ease: 'expo.out' }, 0.55);
  tl.fromTo($('.line', e), { scaleX: 0 }, { scaleX: 1, duration: 1.4, ease: 'power2.inOut' }, 0.85);
  tl.fromTo($$('.ev', e), { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.15, ease: 'back.out(1.8)' }, 1.05);
  tl.fromTo($('.ev.hot', e), { scale: 1 }, { scale: 1.1, duration: 0.4, yoyo: true, repeat: 3, transformOrigin: '0 0' }, 2.4);
};

A.map = (f, tl) => {
  const e = f.el, g = $('#mapg', e), NS = 'http://www.w3.org/2000/svg', cx = 730, cy = 505;
  g.innerHTML = '';
  const mk = (n, a) => { const x = document.createElementNS(NS, n); for (const k in a) x.setAttribute(k, a[k]); g.appendChild(x); return x; };
  const lines = [], nodes = [], leaves = [];

  // 7 ana dal için sağ ve alt kenarlardan taşmayı, düğümlerin çakışmasını %100 önleyen özel açı ve yarıçaplar
  const MAP_ANGLES = [-90, -36, 16, 64, 132, 178, 222].map(a => a * Math.PI / 180);
  const MAP_RADII = [
    { rx: 280, ry: 200 }, // Makine Öğrenimi (üst)
    { rx: 290, ry: 185 }, // Doğal Dil İşleme (sağ-üst)
    { rx: 290, ry: 175 }, // Konuşma (sağ-orta)
    { rx: 320, ry: 235 }, // Uzman Sistemler (sağ-alt)
    { rx: 330, ry: 235 }, // Planlama & Optimizasyon (sol-alt)
    { rx: 270, ry: 170 }, // Robotik (sol-orta)
    { rx: 280, ry: 180 }  // Görüntü (sol-üst)
  ];

  MAP.forEach(([name, kids], i) => {
    const ang = MAP_ANGLES[i], col = MAPCOL[i];
    const { rx, ry } = MAP_RADII[i];
    const bx = cx + Math.cos(ang) * rx, by = cy + Math.sin(ang) * ry;
    const l1 = mk('path', { d: `M${cx} ${cy} L${bx} ${by}`, stroke: col, 'stroke-width': 5, fill: 'none', pathLength: 1, 'stroke-linecap': 'round' });
    lines.push(l1);

    kids.forEach((kn, j) => {
      const spread = (j - (kids.length - 1) / 2) * 0.32, a2 = ang + spread;
      const isRight = Math.cos(a2) >= 0;
      // Yaprakların çerçeveden (1600x900) dışarı taşmasını önleyen kompakt yarıçaplar
      const lrx = isRight ? 515 : 490;
      const lry = 320;
      const lx = cx + Math.cos(a2) * lrx, ly = cy + Math.sin(a2) * lry;

      lines.push(mk('path', { d: `M${bx} ${by} L${lx} ${ly}`, stroke: col, 'stroke-width': 2.2, fill: 'none', pathLength: 1, opacity: .75 }));
      const right = lx > cx;
      const t = mk('text', { x: lx + (right ? 12 : -12), y: ly + 7, 'text-anchor': right ? 'start' : 'end', 'font-size': 21, 'font-weight': 600, fill: '#dff1ff' });
      t.textContent = kn;
      const dot = mk('circle', { cx: lx, ly: ly, r: 6.5, fill: col });
      leaves.push(t, dot);
    });

    const linesOfName = name.split('\n');
    const isMulti = linesOfName.length > 1;
    const maxLen = Math.max(...linesOfName.map(l => l.length));
    const w = Math.max(150, maxLen * 11.8 + 38);
    const h = isMulti ? 74 : 54;
    const gr = mk('g', { class: 'mn' });

    const rect = document.createElementNS(NS, 'rect');
    [
      ['x', bx - w / 2],
      ['y', by - h / 2],
      ['width', w],
      ['height', h],
      ['rx', 27],
      ['fill', '#08152c'],
      ['stroke', col],
      ['stroke-width', 4]
    ].forEach(([k, v]) => rect.setAttribute(k, v));
    gr.appendChild(rect);

    if (isMulti) {
      linesOfName.forEach((lineText, lineIdx) => {
        const tx = document.createElementNS(NS, 'text');
        const yPos = by - 7 + lineIdx * 24;
        [
          ['x', bx],
          ['y', yPos],
          ['text-anchor', 'middle'],
          ['font-size', 20],
          ['font-weight', 800],
          ['fill', lineIdx === 0 ? '#ffffff' : col]
        ].forEach(([k, v]) => tx.setAttribute(k, v));
        tx.textContent = lineText;
        gr.appendChild(tx);
      });
    } else {
      const tx = document.createElementNS(NS, 'text');
      [
        ['x', bx],
        ['y', by + 7],
        ['text-anchor', 'middle'],
        ['font-size', 22],
        ['font-weight', 800],
        ['fill', '#ffffff']
      ].forEach(([k, v]) => tx.setAttribute(k, v));
      tx.textContent = name;
      gr.appendChild(tx);
    }
    nodes.push(gr);
  });

  const c = mk('g', {});
  const cc = document.createElementNS(NS, 'circle');
  [['cx', cx], ['cy', cy], ['r', 88], ['fill', '#0a2a55'], ['stroke', '#3de8f5'], ['stroke-width', 5]].forEach(([k, v]) => cc.setAttribute(k, v));
  const ct = document.createElementNS(NS, 'text');
  [['x', cx], ['y', cy - 4], ['text-anchor', 'middle'], ['font-size', 32], ['font-family', 'var(--font-display)']].forEach(([k, v]) => ct.setAttribute(k, v));
  ct.textContent = 'YAPAY ZEKA';
  const ct2 = ct.cloneNode();
  ct2.setAttribute('y', cy + 30);
  ct2.setAttribute('font-size', 24);
  ct2.setAttribute('fill', '#3de8f5');
  ct2.textContent = '(AI)';
  c.append(cc, ct, ct2);
  g.appendChild(c);
  nodes.forEach(n => g.appendChild(n));

  gsap.set([...lines], { strokeDasharray: 1, strokeDashoffset: 1 });
  tl.fromTo(c, { scale: 0, transformOrigin: `${cx}px ${cy}px` }, { scale: 1, duration: 1, ease: 'elastic.out(1,.55)' }, 0)
    .to(lines, { strokeDashoffset: 0, duration: 1.2, stagger: .08, ease: 'power2.inOut' }, .3)
    .fromTo(nodes, { opacity: 0, scale: .2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: .6, stagger: .12, ease: 'back.out(2)' }, .5)
    .fromTo(leaves, { opacity: 0 }, { opacity: 1, duration: .5, stagger: .05 }, 1.3);
  loop(f, () => gsap.to(cc, { attr: { r: 96 }, duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
};

A.venn = (f, tl, instant) => {
  const e = f.el, cs = $$('.vc', e), ls = $$('.vl text', e), lines = $$('.vlines path', e), calls = $$('.vcall', e);
  f.api = {
    builds: 4,
    reset() { gsap.set(cs, { scale: 0, transformOrigin: '50% 50%' }); gsap.set(ls, { opacity: 0 }); gsap.set(lines, { strokeDashoffset: 0, opacity: 0 }); gsap.set(calls, { opacity: 0, x: 0 }); },
    build(i, inst) {
      const t = gsap.timeline();
      t.to(cs[i], { scale: 1, duration: 1.2, ease: 'elastic.out(1,.6)' }, 0)
        .to(ls[i], { opacity: 1, duration: .6 }, .4).to(lines[i], { opacity: 1, duration: .5 }, .6)
        .fromTo(calls[i], { opacity: 0, x: i === 3 ? -40 : 40 }, { opacity: 1, x: 0, duration: .8, ease: 'power3.out' }, .6);
      if (i === 0) { /* AI ilk açılış */ } else t.to(cs.slice(0, i), { scale: 1.015, yoyo: true, repeat: 1, duration: .25 }, .1);
      if (inst) t.progress(1); return t;
    }
  };
  f.api.reset();
  kWordPop(tl, $('h2', e), 0, 0.04);
  tl.fromTo($('h2', e), {}, {}, 0);
  if (instant) { for (let i = 0; i < 4; i++) f.api.build(i, true); f.build = 4; }
};

A.role = (f, tl) => {
  const e = f.el, rl = $('.rl', e);
  tl.fromTo($('.tag', e), { opacity: 0 }, { opacity: 1 }, 0);
  kMaskSlide(tl, $('h2', e), 0.1, 0.04);
  tl.set($('p', e), { opacity: 1 }, 0);
  kWords(tl, $('p', e), 0.45);
  tl.fromTo($$('img', e), { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }, 0.45);
  gsap.set(rl, { y: 0 });
  loop(f, () => gsap.to(rl, { y: () => -(rl.children[0].offsetHeight * 3), duration: 6, ease: 'steps(3)', repeat: -1 }));
};

A.surgery = (f, tl) => {
  const e = f.el, cmp = $('.cmp', e), top = $('.top', cmp), handle = $('.handle', cmp);
  kWordPop(tl, $('h2', e), 0, 0.03);
  tl.fromTo(cmp, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out' }, 0.15);
  const o = { v: 0 }; const set = v => { top.style.clipPath = `inset(0 ${100 - v}% 0 0)`; handle.style.left = v + '%'; };
  set(0);
  tl.to(o, { v: 100, duration: 1.6, ease: 'power2.inOut', onUpdate: () => set(o.v) }, 0.7)
    .to(o, { v: 50, duration: 1.1, ease: 'power3.inOut', onUpdate: () => set(o.v) }, 2.4);
  tl.fromTo($$('.cols>div,.tag', e), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15 }, 1.0);
  if (!cmp._bound) {
    cmp._bound = true;
    const mv = ev => { const r = cmp.getBoundingClientRect(); const v = gsap.utils.clamp(0, 100, (ev.clientX - r.left) / r.width * 100); o.v = v; set(v); };
    cmp.addEventListener('pointerdown', ev => { f.tl && f.tl.progress(1); mv(ev); cmp.setPointerCapture(ev.pointerId); cmp.onpointermove = mv; });
    cmp.addEventListener('pointerup', () => cmp.onpointermove = null);
  }
};

A.analytics = (f, tl) => {
  const e = f.el, chips = $$('#gchips button', e), arc = $('#garc', e), val = $('#gval', e), lvl = $('#glvl', e), rec = $('#grec', e);
  const st = { v: 0 };
  const calc = () => Math.max(4, Math.min(98, 12 + chips.filter(c => c.classList.contains('on')).reduce((s, c) => s + +c.dataset.w, 0)));
  const paint = () => { arc.style.strokeDashoffset = 100 - st.v; val.textContent = Math.round(st.v); const v = st.v; lvl.textContent = v < 30 ? 'DÜŞÜK' : v < 60 ? 'ORTA' : 'YÜKSEK'; lvl.setAttribute('fill', v < 30 ? '#19c48b' : v < 60 ? '#f4c542' : '#ff4d5e'); };
  const update = () => {
    const v = calc(); gsap.to(st, { v, duration: .9, ease: 'power3.out', onUpdate: paint });
    rec.textContent = v < 30 ? 'Standart bakım planı yeterli.' : v < 60 ? 'Düşme önlem kontrol listesini uygula, hastayı sık gözle.' : 'Yüksek risk: düşme protokolünü başlat, yatak alarmı + refakatçi + hekime bildir.';
  };
  if (!f.bound) { f.bound = true; chips.forEach(c => c.addEventListener('click', ev => { ev.stopPropagation(); c.classList.toggle('on'); AudioFX.build(); update(); })); }
  chips.forEach(c => c.classList.remove('on')); chips[0].classList.add('on'); chips[1].classList.add('on'); chips[4].classList.add('on');
  kFluidFade(tl, $('h2', e), 0, 0.035);
  tl.fromTo($('.tag', e), { opacity: 0 }, { opacity: 1 }, 0).set($('.txt p', e), { opacity: 1 }, 0); kWords(tl, $('.txt p', e), 0.45);
  tl.fromTo($('img', e), { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 0.9);
  tl.fromTo($('.panel', e), { x: 100, opacity: 0, rotationY: -15, transformPerspective: 1200 }, { x: 0, opacity: 1, rotationY: 0, duration: 1.1, ease: 'expo.out' }, 0.25);
  tl.call(update, null, 1.2);
};

A.chat = (f, tl, instant) => {
  const e = f.el, phone = $('.phone', e), box = $('.msgs', e);
  tl.set($$('.col p', e), { opacity: 1 }, 0);
  $$('.col h2', e).forEach((h, i) => kMaskSlide(tl, h, i * 0.15, 0.03));
  $$('.col p', e).forEach((p, i) => kWords(tl, p, 0.45 + i * 0.15));
  tl.fromTo($$('.col img', e), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.14 }, 0.85);
  const script = [['u', 'Ameliyat sonrası ilk gün. Ağrım arttı, ne yapmalıyım?'], ['b', 'Merhaba Ayşe Hanım. Ağrınızı 0–10 arasında kaç puanlarsınız?'], ['u', '7 diyebilirim.'], ['b', 'Anlıyorum. Son ağrı kesici dozunuz 6 saat önceydi. Sorumlu hemşirenize hemen bildirim gönderiyorum.'], ['s', '⚑ Hemşire istasyonuna iletildi · Öncelik: ORTA'], ['b', 'Yalnız değilsiniz; hemşireniz birkaç dakika içinde yanınızda olacak.']];
  f.api = {
    builds: 1,
    build(i) {
      box.innerHTML = ''; gsap.killTweensOf(phone);
      const t = gsap.timeline(); f.chatTl = t;
      t.fromTo(phone, { opacity: 0, scale: .7, y: 120, rotationY: 30, transformPerspective: 1200 }, { opacity: 1, scale: 1, y: 0, rotationY: 0, duration: .9, ease: 'expo.out' });
      let at = 1.0;
      script.forEach(([who, txt]) => {
        const typ = () => { const d = document.createElement('div'); d.className = 'typing'; d.innerHTML = '<i></i><i></i><i></i>'; d.id = 'typ'; box.appendChild(d); };
        const untyp = () => $('#typ', box)?.remove();
        const put = () => { untyp(); const m = document.createElement('div'); m.className = 'msg ' + who; m.textContent = txt; box.appendChild(m); gsap.from(m, { y: 24, opacity: 0, scale: .9, duration: .45, ease: 'back.out(2)' }); };
        if (who === 'b') { t.call(typ, null, at); at += .9; }
        t.call(put, null, at); at += who === 'u' ? 1.1 : 1.5;
      });
    },
    leave() { gsap.to(phone, { opacity: 0, scale: .8, duration: .4 }); f.chatTl && f.chatTl.kill(); }
  };
};

A.robots = (f, tl) => {
  const e = f.el;
  $$('.c', e).forEach((c, i) => {
    tl.fromTo($('img', c), { opacity: 0, y: -50, scale: 1.12 }, { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: 'expo.out' }, i * 0.18);
    kMaskSlide(tl, $('h2', c), 0.25 + i * 0.18, 0.025);
    tl.set($('p', c), { opacity: 1 }, 0);
    kWords(tl, $('p', c), 0.65 + i * 0.18);
    tl.fromTo($('.chip', c), { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, 1.3);
  });
  tl.fromTo($('.mid', e), { scale: 0, rotation: -180 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'elastic.out(1,.5)' }, 0.7);
  loop(f, () => gsap.to($('.mid', e), { boxShadow: '0 0 90px rgba(255,77,94,.9)', yoyo: true, repeat: -1, duration: 1.2 }));
};

A.ethics = (f, tl) => {
  const e = f.el;
  tl.fromTo($('.tag', e), { opacity: 0, x: -24 }, { opacity: 1, x: 0 }, 0);
  kMaskSlide(tl, $('h2', e), 0.1, 0.035);
  tl.set($('.lead', e), { opacity: 1 }, 0);
  kWords(tl, $('.lead', e), 0.55);
  tl.fromTo($$('.pil', e), { y: 90, opacity: 0, rotationX: -25, transformPerspective: 900 }, { y: 0, opacity: 1, rotationX: 0, duration: 0.85, stagger: 0.14, ease: 'expo.out' }, 0.8);
  tl.fromTo($$('.pil svg path', e), { strokeDasharray: 120, strokeDashoffset: 120 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.14 }, 1.0);
};

A.end = (f, tl, instant) => {
  const e = f.el, q1 = $('.q1', e), q2 = $('.q2', e), th = $('.thanks', e);
  gsap.set(th, { opacity: 0 }); gsap.set(th.querySelector('.afis'), { clearProps: 'all' });
  kMaskSlide(tl, q1, 0.1, 0.035);
  tl.set(q2, { opacity: 1 }, 1.2);
  kWordPop(tl, q2, 1.2, 0.04);
  f.api = {
    builds: 1,
    build() {
      const t = gsap.timeline(); f.endTl = t;
      t.to([$('.quote', e), $('.bgp', e)], { opacity: 0, scale: 1.05, duration: 0.7, ease: 'power2.in' })
        .set(th, { pointerEvents: 'auto' }).to(th, { opacity: 1, duration: 0.7 }, 0.3)
        .fromTo($('.afis', th), { x: -160, rotationY: 45, transformPerspective: 1200, opacity: 0 }, { x: 0, rotationY: 0, opacity: 1, duration: 1.2, ease: 'expo.out' }, 0.4)
        .call(() => { const h = $('h2', th); kMaskSlide(gsap.timeline(), h, 0, 0.04); }, null, 0.7)
        .fromTo($$('p,.lg', th), { opacity: 0, y: 24 }, { opacity: 1, y: 0, stagger: 0.16, duration: 0.7 }, 1.1);
    },
    leave() { gsap.set([$('.quote', e), $('.bgp', e)], { opacity: 1, scale: 1 }); gsap.set(th, { opacity: 0, pointerEvents: 'none' }); }
  };
};

/* ------------------------------------------------------------------ */
/* Kamera                                                              */
/* ------------------------------------------------------------------ */
const world = $('#world');
const cam = { x: 0, y: 0, k: .1, rot: 0 };
let camTween = null;
const vp = () => ({ w: innerWidth, h: innerHeight });
function applyCam() {
  const { w, h } = vp();
  world.style.transform = `translate(${w / 2}px,${h / 2}px) rotate(${-cam.rot}deg) scale(${cam.k}) translate(${-cam.x}px,${-cam.y}px)`;
}
function targetFor(f, pad = .93) {
  const { w, h } = vp();
  return { x: f.x, y: f.y, k: Math.min(w / (W * f.s), h / (H * f.s)) * pad, rot: f.r };
}
function overviewTarget() {
  const { w, h } = vp();
  let minx = 1e9, miny = 1e9, maxx = -1e9, maxy = -1e9;
  Object.values(F).forEach(f => { const r = Math.hypot(W, H) / 2 * f.s; minx = Math.min(minx, f.x - r); maxx = Math.max(maxx, f.x + r); miny = Math.min(miny, f.y - r); maxy = Math.max(maxy, f.y + r); });
  return { x: (minx + maxx) / 2, y: (miny + maxy) / 2, k: Math.min(w / (maxx - minx), h / (maxy - miny)) * .95, rot: 0 };
}
function flyTo(t, instant = false, onMid) {
  if (camTween) camTween.kill();
  if (instant) { Object.assign(cam, t); applyCam(); return null; }
  const a = { ...cam };
  const dr = ((t.rot - a.rot + 540) % 360) - 180;
  const dist = Math.hypot(t.x - a.x, t.y - a.y), { w } = vp();
  const kmin = Math.min(a.k, t.k), ratio = dist * kmin / w;
  const dip = ratio > .5 ? Math.min(1.25, Math.log(1 + ratio) * .42) : 0;
  const kr = Math.abs(Math.log(t.k / a.k));
  const dur = gsap.utils.clamp(1.2, 3, 1.15 + .5 * Math.log(1 + ratio * 2) + .12 * kr);
  const o = { p: 0 };
  camTween = gsap.to(o, {
    p: 1, duration: dur, ease: 'power3.inOut',
    onUpdate() {
      const p = o.p;
      cam.x = a.x + (t.x - a.x) * p; cam.y = a.y + (t.y - a.y) * p; cam.rot = a.rot + dr * p;
      cam.k = Math.exp(Math.log(a.k) + (Math.log(t.k) - Math.log(a.k)) * p - dip * Math.sin(Math.PI * p));
      applyCam();
    }
  });
  camTween.duration = dur; return dur;
}

/* ------------------------------------------------------------------ */
/* Ses Efektleri (Web Audio API - Zarif, Kısık, Doğal UI Akustiği)   */
/* ------------------------------------------------------------------ */
const AudioFX = (() => {
  let ctx = null, masterGain = null, enabled = true;

  function init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      masterGain = ctx.createGain();
      masterGain.gain.value = 0.16; // Çok zarif, kısık ve rahatsız etmeyen seviye
      masterGain.connect(ctx.destination);
    } catch (e) {}
  }

  function resume() {
    if (!ctx) init();
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  // Slayt geçiş efekti (aerodinamik fütüristik hava geçişi + sıcak sub ton)
  function slide(dir = 1) {
    if (!enabled) return;
    resume();
    if (!ctx) return;
    const t = ctx.currentTime;

    // 1. Yumuşak süzülme / hava geçişi (filtreli gürültü geçişi)
    try {
      const bufLen = Math.floor(ctx.sampleRate * 0.28);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufLen * 0.35));
      const noise = ctx.createBufferSource();
      noise.buffer = buf;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.value = 1.6;
      filter.frequency.setValueAtTime(dir > 0 ? 300 : 520, t);
      filter.frequency.exponentialRampToValueAtTime(dir > 0 ? 640 : 260, t + 0.24);

      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.075, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);

      noise.connect(filter); filter.connect(g); g.connect(masterGain);
      noise.start(t); noise.stop(t + 0.28);
    } catch(e) {}

    // 2. Sıcak ve derin mikroskobik sub-bass dokunuşu
    try {
      const osc = ctx.createOscillator();
      const og = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(dir > 0 ? 115 : 145, t);
      osc.frequency.exponentialRampToValueAtTime(dir > 0 ? 165 : 95, t + 0.22);
      og.gain.setValueAtTime(0.0001, t);
      og.gain.exponentialRampToValueAtTime(0.055, t + 0.04);
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
      osc.connect(og); og.connect(masterGain);
      osc.start(t); osc.stop(t + 0.25);
    } catch(e) {}
  }

  // Slayt içi adım/parça (build) değişimi (hassas mikro cam tıkırtısı)
  function build() {
    if (!enabled) return;
    resume();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(960, t);
      osc.frequency.exponentialRampToValueAtTime(1420, t + 0.032);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.048, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.038);
      osc.connect(g); g.connect(masterGain);
      osc.start(t); osc.stop(t + 0.04);
    } catch(e) {}
  }

  // Bölüm geçişi (akustik harmonik akor)
  function section() {
    if (!enabled) return;
    resume();
    if (!ctx) return;
    const t = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, idx) => {
      try {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t + idx * 0.035);
        g.gain.setValueAtTime(0.0001, t + idx * 0.035);
        g.gain.exponentialRampToValueAtTime(0.035, t + idx * 0.035 + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + idx * 0.035 + 0.32);
        osc.connect(g); g.connect(masterGain);
        osc.start(t + idx * 0.035); osc.stop(t + idx * 0.035 + 0.35);
      } catch(e) {}
    });
  }

  // Genel bakış açılma / kapanma
  function overview(open) {
    if (!enabled) return;
    resume();
    if (!ctx) return;
    const t = ctx.currentTime;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(open ? 260 : 520, t);
      osc.frequency.exponentialRampToValueAtTime(open ? 520 : 260, t + 0.2);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.045, t + 0.035);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
      osc.connect(g); g.connect(masterGain);
      osc.start(t); osc.stop(t + 0.22);
    } catch(e) {}
  }

  function toggle() {
    enabled = !enabled;
    const btn = $('#btn-sound');
    if (btn) {
      btn.innerHTML = enabled
        ? '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>'
        : '<svg viewBox="0 0 24 24"><path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/></svg>';
      btn.title = enabled ? 'Sesi Kapat (M)' : 'Sesi Aç (M)';
      btn.classList.toggle('muted', !enabled);
    }
    return enabled;
  }

  return { init, resume, slide, build, section, overview, toggle, isEnabled: () => enabled };
})();

/* ------------------------------------------------------------------ */
/* Arka plan: dinamik sinir ağı ve geçiş partikülleri                 */
/* ------------------------------------------------------------------ */
const bg = $('#bg'), bctx = bg.getContext('2d');
const NODES = Array.from({ length: 135 }, () => ({ x: Math.random(), y: Math.random(), z: rnd(.25, 1.1), p: Math.random() * 6 }));
const AMB_PARTICLES = Array.from({ length: 45 }, () => ({
  x: Math.random(), y: Math.random(), z: rnd(.2, .9),
  r: rnd(1.2, 2.8),
  vy: rnd(-0.0003, -0.0008),
  vx: rnd(-0.0002, 0.0002),
  p: Math.random() * Math.PI * 2,
  hue: Math.random() > .5 ? '61,232,245' : '121,82,255'
}));
let WARP_PARTICLES = [];

function triggerTransitionParticles(fromX, fromY, toX, toY) {
  const dx = toX - fromX, dy = toY - fromY;
  const dist = Math.hypot(dx, dy) || 1;
  const ndx = dx / dist, ndy = dy / dist;
  const count = Math.min(85, Math.max(40, Math.floor(dist * 0.045)));
  const w = innerWidth, h = innerHeight;

  for (let i = 0; i < count; i++) {
    const angleSpread = (Math.random() - 0.5) * 0.95;
    const speed = rnd(7, 24);
    const cos = Math.cos(angleSpread), sin = Math.sin(angleSpread);
    const vx = -(ndx * cos - ndy * sin) * speed;
    const vy = -(ndy * cos + ndx * sin) * speed;
    const colors = ['61,232,245', '121,82,255', '43,240,171', '255,255,255'];
    const col = colors[Math.floor(Math.random() * colors.length)];

    WARP_PARTICLES.push({
      x: w * 0.5 + (Math.random() - 0.5) * w * 0.9,
      y: h * 0.5 + (Math.random() - 0.5) * h * 0.9,
      vx, vy,
      r: rnd(1.5, 3.8),
      col,
      alpha: rnd(0.7, 0.95),
      decay: rnd(0.013, 0.024),
      tail: rnd(14, 38)
    });
  }
}

function triggerMiniBurst() {
  const w = innerWidth, h = innerHeight;
  for (let i = 0; i < 20; i++) {
    const ang = Math.random() * Math.PI * 2;
    const sp = rnd(3, 9);
    WARP_PARTICLES.push({
      x: w * 0.5 + (Math.random() - 0.5) * 320,
      y: h * 0.5 + (Math.random() - 0.5) * 220,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp,
      r: rnd(1.2, 2.6),
      col: '61,232,245',
      alpha: 0.85,
      decay: 0.026,
      tail: 8
    });
  }
}

let lastCam = { x: 0, y: 0, k: .1 };

function drawBg(t) {
  const dpr = Math.min(devicePixelRatio || 1, 2), w = innerWidth, h = innerHeight;
  if (bg.width !== w * dpr || bg.height !== h * dpr) { bg.width = w * dpr; bg.height = h * dpr; }
  bctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const g = bctx.createRadialGradient(w * .5, h * .4, 0, w * .5, h * .5, Math.max(w, h) * .85);
  g.addColorStop(0, '#0a1d3d'); g.addColorStop(1, '#030813'); bctx.fillStyle = g; bctx.fillRect(0, 0, w, h);

  const TW = w * 1.4, TH = h * 1.4, pts = [];
  const zk = Math.pow(cam.k, .22);

  lastCam.x = cam.x; lastCam.y = cam.y; lastCam.k = cam.k;

  for (const n of NODES) {
    const ox = (n.x * TW - cam.x * .05 * n.z * zk * 10 * cam.k * 4 + Math.sin(t / 3000 + n.p) * 14);
    const oy = (n.y * TH - cam.y * .05 * n.z * zk * 10 * cam.k * 4 + Math.cos(t / 3400 + n.p) * 14);
    pts.push({ x: ((ox % TW) + TW) % TW - (TW - w) / 2, y: ((oy % TH) + TH) % TH - (TH - h) / 2, z: n.z });
  }
  bctx.lineWidth = 1;
  for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
    const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
    if (d < 185) {
      bctx.strokeStyle = `rgba(61,232,245,${(1 - d / 185) * .22})`;
      bctx.beginPath(); bctx.moveTo(pts[i].x, pts[i].y); bctx.lineTo(pts[j].x, pts[j].y); bctx.stroke();
    }
  }
  for (const p of pts) {
    bctx.fillStyle = `rgba(120,230,255,${.25 + p.z * .5})`;
    bctx.beginPath();
    bctx.arc(p.x, p.y, 1.5 + p.z * 2, 0, Math.PI * 2);
    bctx.fill();
  }

  // 2. Sürekli süzülen ortam mikro-parçacıkları (biyolüminesans toz)
  for (const a of AMB_PARTICLES) {
    a.y += a.vy; a.x += a.vx + Math.sin(t / 2000 + a.p) * 0.0003;
    if (a.y < 0) a.y = 1; if (a.x < 0) a.x = 1; if (a.x > 1) a.x = 0;
    const ax = a.x * w, ay = a.y * h;
    const pulse = 0.5 + 0.5 * Math.sin(t / 1400 + a.p);
    bctx.fillStyle = `rgba(${a.hue},${(0.2 + 0.4 * pulse) * a.z})`;
    bctx.beginPath();
    bctx.arc(ax, ay, a.r * a.z, 0, Math.PI * 2);
    bctx.fill();
  }

  // 3. Geçiş anı dinamik warp / hız partikülleri (Işık çizgileri ve kıvılcımlar)
  if (WARP_PARTICLES.length > 0) {
    const nextWarp = [];
    for (let k = 0; k < WARP_PARTICLES.length; k++) {
      const p = WARP_PARTICLES[k];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.96;
      p.vy *= 0.96;
      p.alpha -= p.decay;

      if (p.alpha > 0.01 && p.x >= -80 && p.x <= w + 80 && p.y >= -80 && p.y <= h + 80) {
        const tailX = p.x - p.vx * (p.tail * 0.35);
        const tailY = p.y - p.vy * (p.tail * 0.35);

        bctx.strokeStyle = `rgba(${p.col},${p.alpha})`;
        bctx.lineWidth = p.r;
        bctx.lineCap = 'round';
        bctx.beginPath();
        bctx.moveTo(p.x, p.y);
        bctx.lineTo(tailX, tailY);
        bctx.stroke();

        bctx.fillStyle = `rgba(255,255,255,${Math.min(1, p.alpha * 1.2)})`;
        bctx.beginPath();
        bctx.arc(p.x, p.y, p.r * 0.7, 0, Math.PI * 2);
        bctx.fill();

        nextWarp.push(p);
      }
    }
    WARP_PARTICLES = nextWarp;
  }
}
gsap.ticker.add(drawBg);

/* ------------------------------------------------------------------ */
/* Gezinme                                                             */
/* ------------------------------------------------------------------ */
let cur = -1, overview = false, lastSec = -1;
const progress = $('#progress');
(function buildProgress() {
  const segs = {};
  STEPS.forEach((s, i) => { const sec = s.f.sec; (segs[sec] = segs[sec] || []).push(i); });
  Object.entries(segs).forEach(([sec, arr]) => {
    const d = document.createElement('div'); d.className = 'seg'; d.title = SECTIONS[sec].name;
    arr.forEach(i => { const b = document.createElement('i'); b.dataset.i = i; d.appendChild(b); });
    d.addEventListener('click', e => { const b = e.target.closest('i'); go(b ? +b.dataset.i : arr[0]); });
    progress.appendChild(d);
  });
})();

function paintHud(i) {
  const f = STEPS[i].f, sec = SECTIONS[f.sec];
  $$('#progress i').forEach(b => { const n = +b.dataset.i; b.className = n < i ? 'done' : n === i ? 'cur' : ''; });
  $('#counter').textContent = `${String(i + 1).padStart(2, '0')} / ${STEPS.length}`;
  if (f.sec !== lastSec) {
    if (lastSec !== -1) AudioFX.section();
    lastSec = f.sec; $('#sec-no').textContent = 'BÖLÜM ' + sec.no; $('#sec-name').textContent = sec.name;
    gsap.to('#badge-path', { morphSVG: { shape: ICONS[sec.icon] }, duration: 1.1, ease: 'power3.inOut' });
    gsap.fromTo('#section', { scale: .92 }, { scale: 1, duration: .8, ease: 'elastic.out(1,.5)' });
  }
}
function setDim(f) {
  Object.values(F).forEach(o => o.el.classList.toggle('dim', !overview && o.fam !== f.fam));
}
function leave(f) {
  if (!f) return;
  if (f.tl) f.tl.progress(1);
  if (f.loops) { f.loops.kill(); f.loops = null; }
  if (f.api && f.api.leave) f.api.leave();
  // Karttan çıkıldığında başlığı tekrar kutucuğu dolduran önizleme konumuna al
  if (f.type === 'card' && f.hub) {
    const h = $('h2', f.el), body = $('.body', f.el), isLong = f.k && f.k.long;
    const prevY = isLong ? 200 : 160;
    const prevScale = isLong ? 1.45 : 1.25;
    gsap.set(h, { y: prevY, scale: prevScale, transformOrigin: 'left center' });
    gsap.set(body, { opacity: 0, visibility: 'hidden' });
    const viz = $('.viz', f.el);
    if (viz) gsap.set(viz, { opacity: 0 });
  }
  $$('.line-mask, .k-word, .k-char', f.el).forEach(el => {
    if (el._sp) { el._sp.revert(); el._sp = null; }
  });
}
function enter(f, instant, fromPrev) {
  f.el.classList.remove('pre');
  $$('.rv', f.el).forEach(x => x.style.opacity = '');
  gsap.set($$('.rv', f.el), { opacity: 0 });
  f.build = 0;
  const tl = gsap.timeline(); f.tl = tl;
  (A[f.type] || A.card)(f, tl, instant || fromPrev);
  if (instant || fromPrev) { tl.progress(1); if (f.api && fromPrev) { /* tüm build'ler tamam */ } }
  if (f.api && f.api.builds && (instant || fromPrev) && f.type !== 'venn') { /* sohbet/kapanış bir sonraki tuşa kalır */ }
}
function go(i, opts = {}) {
  i = gsap.utils.clamp(0, STEPS.length - 1, i);
  if (overview) { overview = false; document.body.classList.remove('overview'); }
  const prev = STEPS[cur] && STEPS[cur].f, f = STEPS[i].f, back = i < cur, first = cur < 0;
  leave(prev);
  const sameFam = prev && prev.fam === f.fam;
  cur = i; history.replaceState(null, '', '#' + (i + 1));
  paintHud(i); setDim(f);
  // rota ışığı
  routeSegs.forEach((s, n) => gsap.to(s, { strokeDashoffset: n < f.top || (n === f.top - 0 && false) ? 0 : 1, duration: 1.6, ease: 'power2.inOut' }));
  routeSegs.forEach((s, n) => gsap.to(s, { strokeDashoffset: n < tops.indexOf(F[f.fam]) ? 0 : 1, duration: 1.6, ease: 'power2.inOut', overwrite: true }));
  const t = targetFor(f);

  if (!first && !opts.instant) {
    AudioFX.slide(back ? -1 : 1);
    const prevT = prev ? targetFor(prev) : cam;
    triggerTransitionParticles(prevT.x, prevT.y, t.x, t.y);
  }

  const dur = flyTo(t, !!opts.instant);
  const delay = opts.instant ? 0 : Math.max(.35, dur * (sameFam ? .5 : .62));
  gsap.delayedCall(delay, () => { if (cur === i) enter(f, !!opts.instant, back); });
  if (opts.instant) enter(f, true, true);
  if (f.api && f.api.reset && !back) { /* reset zaten enter içinde */ }
}
function next() {
  const f = STEPS[cur].f;
  if (f.api && f.api.builds && (f.build || 0) < f.api.builds) {
    f.build = (f.build || 0) + 1;
    AudioFX.build();
    triggerMiniBurst();
    f.api.build(f.build - 1, false);
    return;
  }
  if (cur < STEPS.length - 1) go(cur + 1);
}
function prev() { if (cur > 0) go(cur - 1); }

function toggleOverview(force) {
  overview = force !== undefined ? force : !overview;
  AudioFX.overview(overview);
  document.body.classList.toggle('overview', overview);
  if (overview) { Object.values(F).forEach(o => o.el.classList.remove('dim')); flyTo(overviewTarget()); }
  else { const f = STEPS[cur].f; setDim(f); flyTo(targetFor(f)); }
}

/* Girdi */
addEventListener('keydown', e => {
  AudioFX.resume();
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'ArrowDown') { e.preventDefault(); overview ? toggleOverview(false) : next(); }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') { e.preventDefault(); overview ? toggleOverview(false) : prev(); }
  else if (e.key === 'Home') go(0); else if (e.key === 'End') go(STEPS.length - 1);
  else if (e.key === 'o' || e.key === 'O' || e.key === 'Escape') toggleOverview(e.key === 'Escape' ? false : undefined);
  else if (e.key === 'f' || e.key === 'F') fs();
  else if (e.key === 'm' || e.key === 'M') AudioFX.toggle();
});
function fs() { document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.(); }
$('#btn-next').onclick = e => { e.stopPropagation(); AudioFX.resume(); next(); };
$('#btn-prev').onclick = e => { e.stopPropagation(); AudioFX.resume(); prev(); };
$('#btn-over').onclick = () => { AudioFX.resume(); toggleOverview(); };
$('#btn-full').onclick = fs;
const btnSound = $('#btn-sound');
if (btnSound) btnSound.onclick = () => { AudioFX.resume(); AudioFX.toggle(); };

let wlock = 0;
addEventListener('wheel', e => { AudioFX.resume(); const n = performance.now(); if (n - wlock < 1000 || Math.abs(e.deltaY) < 25) return; wlock = n; e.deltaY > 0 ? next() : prev(); }, { passive: true });
$('#viewport').addEventListener('click', e => {
  AudioFX.resume();
  const fe = e.target.closest('.frame');
  if (overview) { if (fe && F[fe.id.slice(2)]) go(F[fe.id.slice(2)].step); else toggleOverview(false); return; }
  if (e.target.closest('[data-noclick],button,.chips')) return;
  // Hub ekranında sağdaki çocuk kartlardan birine tıklandığında doğrudan o karta zoom yap
  if (fe && F[fe.id.slice(2)] && F[fe.id.slice(2)].hub === STEPS[cur].f.id) {
    go(F[fe.id.slice(2)].step);
    return;
  }
  next();
});
let tx = 0, ty = 0;
addEventListener('touchstart', e => { AudioFX.resume(); tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
addEventListener('touchend', e => { if (e.target.closest('[data-noclick]')) return; const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev(); });
let idleT; const wake = () => { document.body.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => document.body.classList.add('idle'), 3500); };
['mousemove', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, wake)); wake();
addEventListener('resize', () => { if (overview) flyTo(overviewTarget(), true); else flyTo(targetFor(STEPS[cur].f), true); });
setTimeout(() => $('#help').style.opacity = 0, 6000);

/* Açılış: uzaktan, döndürülmüş kameradan hero'ya sinematik giriş */
(function boot() {
  const start = Math.max(1, Math.min(STEPS.length, parseInt(location.hash.slice(1)) || 1)) - 1;
  const f = STEPS[start].f, t = targetFor(f);
  Object.assign(cam, { x: t.x + 2400, y: t.y - 1600, k: t.k * .05, rot: t.rot + 40 }); applyCam();
  document.fonts.ready.then(() => go(start));
})();
window.__deck = { go, next, prev, STEPS, F, cam, toggleOverview };
