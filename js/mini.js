'use strict';
// ===== Мини-игры вместо платформера: у каждого уровня своя механика. Все числа — из MC.TASKS; всё нарисованное посчитано кодом =====
const MK = MC.K;
const BOX = { sx: 0, sy: 0 };
// ---------- герои (картинки-ассеты; легко заменить файлом) ----------
class Actor {
  constructor(role, x, yb, h, flip = false) { const H = MC.HEROES[role]; Object.assign(this, { role, x, y: yb, h: h || H.h, flip, kind: H.voice, talk: 0, bob: Math.random() * 6, hop: 0 }); this.im = H.img; }
  mouth() { return { x: this.x, y: this.y - this.h * 0.72 }; }
  headTop() { return { x: this.x, y: this.y - this.h }; }
  update(dt) { this.talk = Math.max(0, this.talk - dt); this.hop = Math.max(0, this.hop - dt); }
  draw(c) {
    const im = IMG[this.im]; if (!im) return;
    const t = G.t + this.bob, sq = 1 + Math.sin(t * 2.2) * 0.012 + (this.talk > 0 ? Math.sin(t * 18) * 0.012 : 0), jy = this.hop > 0 ? -Math.sin(this.hop / 0.5 * Math.PI) * 40 : 0;
    const g = c.createRadialGradient(this.x, this.y, 4, this.x, this.y, this.h * 0.4); g.addColorStop(0, 'rgba(30,20,10,0.4)'); g.addColorStop(1, 'rgba(30,20,10,0)');
    c.save(); c.fillStyle = g; c.translate(this.x, this.y); c.scale(1, 0.18); c.beginPath(); c.arc(0, 0, this.h * 0.4, 0, 7); c.fill(); c.restore();
    const w = this.h * im.width / im.height;
    c.save(); c.translate(this.x, this.y + jy); c.scale(this.flip ? -1 : 1, sq); c.drawImage(im, -w / 2, -this.h, w, this.h); c.restore();
  }
  face() { const w = this.h * 0.5; return { x: this.x - w / 2, y: this.y - this.h, w, h: this.h * 0.55, face: this }; }
}
// злодей рисуется кодом (вихрь / юла) — без готового спрайта
class Villain {
  constructor(x, y) { Object.assign(this, { x, y, h: 170, kind: MC.HEROES.villain.voice, talk: 0, hp: 3, hurt: 0, tx: x, ty: y, vis: true }); }
  mouth() { return { x: this.x, y: this.y - 40 }; }
  headTop() { return { x: this.x, y: this.y - 90 }; }
  update(dt) { this.talk = Math.max(0, this.talk - dt); this.hurt = Math.max(0, this.hurt - dt); this.x += (this.tx - this.x) * Math.min(1, dt * 2); this.y += (this.ty - this.y) * Math.min(1, dt * 2); }
  draw(c) { if (!this.vis) return; drawVillainArt(c, this.x, this.y + Math.sin(G.t * 2) * 8, 1 - (3 - this.hp) * 0.12, G.t, this.hurt, this.talk); }
}
function drawVillainArt(c, x, y, s, t, hurt = 0, talk = 0) {
  c.save(); c.translate(x + (hurt > 0 ? Math.sin(t * 60) * 6 : 0), y); c.scale(s, s);
  if (MC.HEROES.villain.draw === 'whirl') {
    for (let i = 0; i < 7; i++) {
      const w = 110 - i * 12, yy = -i * 18 + 40, a = t * 6 + i;
      c.save(); c.translate(Math.sin(t * 3 + i * 0.7) * 10, yy); c.rotate(Math.sin(a) * 0.08);
      const g = c.createLinearGradient(-w, 0, w, 0); g.addColorStop(0, 'rgba(140,170,230,0.15)'); g.addColorStop(0.5, `rgba(${200 + i * 6},${220 + i * 4},255,0.85)`); g.addColorStop(1, 'rgba(140,170,230,0.15)');
      c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, w, 16, 0, 0, 7); c.fill(); c.restore();
    }
    for (let i = 0; i < 5; i++) { const a = t * 4 + i * 1.26; c.fillStyle = ['#7cb342', '#ffb74d', '#aed581', '#ffd54f', '#81c784'][i]; c.beginPath(); c.ellipse(Math.cos(a) * 80, -30 + Math.sin(a) * 18, 9, 5, a, 0, 7); c.fill(); }
    const fy = -70; c.fillStyle = '#fff'; c.strokeStyle = '#2c3e70'; c.lineWidth = 3;
    for (const ex of [-18, 18]) { c.beginPath(); c.ellipse(ex, fy, 12, 15, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#2c3e70'; c.beginPath(); c.arc(ex + 3, fy + 3, 6, 0, 7); c.fill(); c.fillStyle = '#fff'; }
    c.strokeStyle = '#2c3e70'; c.lineWidth = 4; c.beginPath(); if (hurt > 0) c.arc(0, fy + 34, 12, Math.PI * 1.1, Math.PI * 1.9); else c.arc(0, fy + 18, 14 + (talk > 0 ? Math.abs(Math.sin(t * 16)) * 4 : 0), 0.2, Math.PI - 0.2); c.stroke();
    c.beginPath(); c.moveTo(-32, fy - 22); c.lineTo(-8, fy - 14); c.moveTo(32, fy - 22); c.lineTo(8, fy - 14); c.stroke();
  } else {
    // юла-хулиганка: полосатый волчок с лицом
    c.rotate(Math.sin(t * 3) * 0.12);
    const cols = ['#e53935', '#fdd835', '#1e88e5', '#43a047', '#8e24aa'];
    for (let i = 0; i < 5; i++) { c.fillStyle = cols[(i + Math.floor(t * 8)) % 5]; c.beginPath(); c.moveTo(0, 60); c.lineTo(-90 + i * 36, -10); c.lineTo(-90 + (i + 1) * 36, -10); c.closePath(); c.fill(); }
    const g = c.createRadialGradient(-20, -40, 5, 0, -20, 95); g.addColorStop(0, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = '#ff7043'; c.beginPath(); c.ellipse(0, -10, 92, 60, 0, Math.PI, 0); c.fill(); c.fillStyle = g; c.fill();
    c.fillStyle = '#6d4c41'; c.fillRect(-6, -110, 12, 50); c.beginPath(); c.arc(0, -112, 10, 0, 7); c.fill();
    const fy = -34; c.fillStyle = '#fff'; c.strokeStyle = '#3e2723'; c.lineWidth = 3;
    for (const ex of [-22, 22]) { c.beginPath(); c.ellipse(ex, fy, 12, 14, 0, 0, 7); c.fill(); c.stroke(); c.fillStyle = '#3e2723'; c.beginPath(); c.arc(ex + 3, fy + 2, 6, 0, 7); c.fill(); c.fillStyle = '#fff'; }
    c.lineWidth = 4; c.beginPath(); if (hurt > 0) c.arc(0, fy + 32, 12, Math.PI * 1.1, Math.PI * 1.9); else c.arc(0, fy + 14, 14 + (talk > 0 ? Math.abs(Math.sin(t * 16)) * 4 : 0), 0.2, Math.PI - 0.2); c.stroke();
  }
  c.restore();
}
// ---------- предметы и ёмкости ----------
function thing(c, kind, x, y, s) {
  if (kind === 'chick' || kind === 'duck') { drawItem(c, kind, x, y + s * 0.5, s); return; }
  const k = ['teddy', 'tball', 'tcube', 'ttop', 'tcar'][kind === 'toy' ? 0 : 0];
  toyArt(c, kind, x, y, s);
}
function toyArt(c, kind, x, y, s) {
  // kind: toy0..toy4 — мишка, мячик, кубик, юла, машинка (рисуем кодом)
  const v = +String(kind).replace(/\D/g, '') || 0; c.save(); c.translate(x, y); const r = s / 2;
  if (v === 0) { c.fillStyle = '#b5764a'; for (const [ex, ey, er] of [[-r * 0.55, -r * 0.6, r * 0.28], [r * 0.55, -r * 0.6, r * 0.28]]) { c.beginPath(); c.arc(ex, ey, er, 0, 7); c.fill(); } c.beginPath(); c.arc(0, 0, r * 0.7, 0, 7); c.fill(); c.fillStyle = '#f0d0a8'; c.beginPath(); c.ellipse(0, r * 0.18, r * 0.3, r * 0.22, 0, 0, 7); c.fill(); c.fillStyle = '#3e2723'; for (const ex of [-r * 0.25, r * 0.25]) { c.beginPath(); c.arc(ex, -r * 0.15, r * 0.08, 0, 7); c.fill(); } c.beginPath(); c.arc(0, r * 0.1, r * 0.08, 0, 7); c.fill(); }
  else if (v === 1) { const g = c.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r * 0.75); g.addColorStop(0, '#ffd1dc'); g.addColorStop(1, '#e91e63'); c.fillStyle = g; c.beginPath(); c.arc(0, 0, r * 0.7, 0, 7); c.fill(); c.strokeStyle = '#fff59d'; c.lineWidth = r * 0.14; c.beginPath(); c.arc(0, 0, r * 0.7, -0.6, 0.9); c.stroke(); c.beginPath(); c.arc(0, 0, r * 0.4, 2.4, 3.9); c.stroke(); }
  else if (v === 2) { c.fillStyle = '#42a5f5'; c.strokeStyle = '#0d47a1'; c.lineWidth = 3; rr(c, -r * 0.65, -r * 0.65, r * 1.3, r * 1.3, r * 0.15); c.fill(); c.stroke(); c.fillStyle = '#fff'; c.font = font(r * 0.9, 900); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('A', 0, r * 0.05); }
  else if (v === 3) { c.fillStyle = '#ab47bc'; c.beginPath(); c.moveTo(0, r * 0.75); c.lineTo(-r * 0.75, -r * 0.1); c.quadraticCurveTo(0, -r * 0.75, r * 0.75, -r * 0.1); c.closePath(); c.fill(); c.fillStyle = '#ffeb3b'; c.fillRect(-r * 0.7, -r * 0.18, r * 1.4, r * 0.16); c.fillStyle = '#6d4c41'; c.fillRect(-r * 0.07, -r * 0.85, r * 0.14, r * 0.4); }
  else { c.fillStyle = '#ef5350'; rr(c, -r * 0.8, -r * 0.35, r * 1.6, r * 0.6, r * 0.2); c.fill(); c.fillStyle = '#e57373'; rr(c, -r * 0.4, -r * 0.7, r * 0.8, r * 0.45, r * 0.15); c.fill(); c.fillStyle = '#bbdefb'; c.fillRect(-r * 0.28, -r * 0.6, r * 0.56, r * 0.26); c.fillStyle = '#263238'; for (const ex of [-r * 0.45, r * 0.45]) { c.beginPath(); c.arc(ex, r * 0.28, r * 0.2, 0, 7); c.fill(); } }
  c.restore();
}
function drawThing(c, kind, x, y, s, i = 0) { if (kind === 'chick' || kind === 'duck') drawItem(c, kind, x, y + s * 0.5, s); else toyArt(c, 'toy' + (i % 5), x, y, s); }
function drawBox(c, x, y, w, h, n, full) {
  // корзинка (ферма) или коробка (игрушки); n — сколько уже внутри
  c.save();
  if (MC.BOXSTYLE === 'crate') {
    c.fillStyle = full ? '#ffcc80' : '#d7a86e'; c.strokeStyle = '#6d4c41'; c.lineWidth = 4; rr(c, x - w / 2, y - h, w, h, 8); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(109,76,65,0.5)'; c.lineWidth = 2; c.beginPath(); c.moveTo(x - w / 2 + 8, y - h / 2); c.lineTo(x + w / 2 - 8, y - h / 2); c.stroke();
    if (full) { c.fillStyle = '#e53935'; c.fillRect(x - 6, y - h, 12, h); }
  } else {
    const g = c.createLinearGradient(0, y - h, 0, y); g.addColorStop(0, full ? '#f6c56b' : '#d9a35a'); g.addColorStop(1, '#8d5a2b');
    c.fillStyle = g; c.strokeStyle = '#5d3a1a'; c.lineWidth = 4; c.beginPath(); c.moveTo(x - w / 2, y - h); c.lineTo(x + w / 2, y - h); c.lineTo(x + w / 2 - 12, y); c.lineTo(x - w / 2 + 12, y); c.closePath(); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(93,58,26,0.45)'; c.lineWidth = 2; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x - w / 2 + 6, y - h + k * h / 4); c.lineTo(x + w / 2 - 6, y - h + k * h / 4); c.stroke(); }
    c.strokeStyle = '#7a4a1e'; c.lineWidth = 5; c.beginPath(); c.ellipse(x, y - h, w / 2, 9, 0, Math.PI, 0); c.stroke();
  }
  c.restore();
}
// предметы внутри ёмкости: ровно n, рядом, не накладываются
function boxSlots(x, y, w, h, k) { const out = []; const sp = Math.min(46, (w - 20) / k); for (let i = 0; i < k; i++) out.push({ x: x + (i - (k - 1) / 2) * sp, y: y - h - 6 }); return out; }
// табличка с задачей + картинка групп: r групп по k предметов (ровно r·k)
function drawGroupsPanel(c, S, r, k, kind, cx, cy, maxW) {
  const s = Math.min(42, (maxW - 40) / (r * (k * 0.9 + 0.6))), gw = k * s * 0.9 + s * 0.6;
  const w = r * gw + 30, h = s * 1.7 + 20, x0 = cx - w / 2;
  c.fillStyle = 'rgba(255,250,235,0.9)'; c.strokeStyle = '#8a5a2b'; c.lineWidth = 3; rr(c, x0, cy - h / 2, w, h, 16); c.fill(); c.stroke();
  let n = 0;
  for (let g = 0; g < r; g++) {
    const gx = x0 + 15 + g * gw + gw / 2;
    c.fillStyle = g % 2 ? 'rgba(255,214,120,0.45)' : 'rgba(170,220,255,0.45)'; rr(c, gx - gw / 2 + 3, cy - h / 2 + 8, gw - 6, h - 16, 12); c.fill();
    for (let i = 0; i < k; i++) { drawThing(c, kind, gx + (i - (k - 1) / 2) * s * 0.9, cy, s, n); n++; }
  }
  S.drawn = n; return { x: x0, y: cy - h / 2, w, h };
}
function choicesFor(r, k) {
  const p = r * k, set = new Set([p]);
  for (const v of [r + k, p + k, p - k, p + 1, p + 2 * k, p - 1]) { if (set.size >= 3) break; if (v > 0 && v !== p) set.add(v); }
  return [...set].sort(() => fx() - 0.5);
}
function numBadge(c, x, y, v, r = 30, col = '#ffd43b') {
  c.save(); c.fillStyle = col; c.strokeStyle = '#5b3313'; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.stroke();
  txt(c, String(v), x, y + 2, { size: r * 1.15, fill: '#4a2a10' }); c.restore();
}
// ---------- МЕХАНИКИ ----------
const MECH = {};
// 1) конвейер: тащи предметы с ленты в ёмкость (по K), потом выбери ответ на табличках
MECH.conveyor = {
  init(S, r) {
    const W = G.W, H = G.H; this.S = S; this.r = r; this.belt = { y: H * 0.56, x0: 60, x1: W - 60 };
    const bw = Math.min(150, (W - 200) / r - 16); this.boxes = Array.from({ length: r }, (_, i) => ({ x: W / 2 + (i - (r - 1) / 2) * (bw + 16), y: H * 0.86, w: bw, h: 70, n: 0 }));
    this.items = []; this.spawned = 0; this.spawnT = 0; this.drag = null; this.phase = 'pack'; this.tags = null;
  },
  update(dt) {
    if (this.phase === 'pack') {
      this.spawnT -= dt;
      const onBelt = this.items.filter(o => o.state === 'belt').length;
      if (this.spawned < this.r * MK && this.spawnT <= 0 && onBelt < 4) { this.items.push({ x: this.belt.x0, y: this.belt.y - 30, state: 'belt', i: this.spawned }); this.spawned++; this.spawnT = 1.1; }
      for (const o of this.items) if (o.state === 'belt') { o.x = Math.min(o.x + 110 * dt, this.belt.x1 - 40 - this.items.filter(q => q.state === 'belt' && q.x > o.x).length * 70); }
      for (const o of this.items) if (o.state === 'fly') { o.t += dt * 3; const k = Math.min(1, o.t); o.x = lerp(o.fx, o.tx, k); o.y = lerp(o.fy, o.ty, k) - Math.sin(k * Math.PI) * 60; if (k >= 1) o.state = 'in'; }
      if (this.boxes.every(b => b.n === MK) && this.items.every(o => o.state === 'in')) {
        check(this.items.length === this.r * MK && this.boxes.length === this.r, 'конвейер: ровно r·k предметов в r ёмкостях');
        this.phase = 'answer'; const ch = choicesFor(this.r, MK); this.tags = ch.map((v, i) => ({ v, x: G.W / 2 + (i - 1) * 190, y: G.H * 0.3 })); this.S.onPacked();
      }
    }
  },
  openBox() { return this.boxes.find(b => b.n < MK); },
  put(o) { const b = this.openBox(); if (!b) return; const sl = boxSlots(b.x, b.y, b.w, b.h, MK)[b.n]; b.n++; Object.assign(o, { state: 'fly', t: 0, fx: o.x, fy: o.y, tx: sl.x, ty: sl.y }); Sound.pop(); sparkBurst(sl.x, sl.y, 6, '#fff3a0', 120); if (b.n === MK) Sound.light(4 + this.boxes.indexOf(b)); },
  hitItem(x, y) { return this.items.find(o => o.state === 'belt' && Math.hypot(o.x - x, o.y - y) < 46); },
  down(x, y) {
    if (this.phase === 'answer') { const t = this.tags.find(t => Math.abs(t.x - x) < 80 && Math.abs(t.y - y) < 60); if (t) this.S.answer(t.v); return; }
    const o = this.hitItem(x, y); if (o) { o.state = 'drag'; this.drag = o; this.dx = o.x - x; this.dy = o.y - y; }
  },
  move(x, y) { if (this.drag) { this.drag.x = x + this.dx; this.drag.y = y + this.dy; } },
  up(x, y) {
    const o = this.drag; if (!o) return; this.drag = null;
    const b = this.openBox();
    if (b && Math.abs(o.x - b.x) < b.w * 0.8 && o.y > b.y - b.h - 110) this.put(o);
    else { o.state = 'belt'; o.y = this.belt.y - 30; Sound.bump(); }
  },
  draw(c) {
    const { y, x0, x1 } = this.belt;
    c.fillStyle = '#4e342e'; rr(c, x0 - 20, y - 6, x1 - x0 + 40, 34, 17); c.fill();
    c.fillStyle = '#6d4c41'; rr(c, x0 - 14, y - 2, x1 - x0 + 28, 22, 11); c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.18)'; c.lineWidth = 3; const off = (G.t * 110) % 40; for (let x = x0 + off; x < x1; x += 40) { c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10, y + 18); c.stroke(); }
    for (const xx of [x0, x1]) { c.fillStyle = '#90a4ae'; c.beginPath(); c.arc(xx, y + 9, 16, 0, 7); c.fill(); }
    const ob = this.openBox();
    this.boxes.forEach(b => { if (b === ob && this.phase === 'pack') glow(c, b.x, b.y - b.h / 2, b.w, 'rgba(255,240,140,0.7)', 0.6 + 0.3 * Math.sin(G.t * 5)); drawBox(c, b.x, b.y, b.w, b.h, b.n, b.n === MK); });
    for (const o of this.items) if (o.state !== 'drag') drawThing(c, MC.LEVELS[this.S.n].item, o.x, o.y, 54, o.i);
    if (this.drag) drawThing(c, MC.LEVELS[this.S.n].item, this.drag.x, this.drag.y, 62, this.drag.i);
    if (this.phase === 'pack' && ob) { const it = this.items.find(o => o.state === 'belt'); if (it && this.S.hintT > 4) { const k = (G.t % 1.4) / 1.4; drawHand(c, lerp(it.x, ob.x, k), lerp(it.y, ob.y - 60, k)); } }
    if (this.tags) for (const t of this.tags) { woodPanel(c, t.x - 75, t.y - 50, 150, 100, 18, t.v); txt(c, String(t.v), t.x, t.y + 4, { size: 58, fill: '#fff8e1', stroke: '#4e2a0e', sw: 8 }); }
  },
  counted() { return this.boxes.reduce((s, b) => s + b.n, 0) + this.items.filter(o => o.state !== 'in' && o.state !== 'fly').length * 0; },
  probe() {
    if (this.phase === 'answer') return { kind: 'tap', targets: this.tags.map(t => ({ v: t.v, x: t.x, y: t.y })) };
    const it = this.items.find(o => o.state === 'belt'), b = this.openBox();
    return { kind: 'drag', from: it ? { x: it.x, y: it.y } : null, to: b ? { x: b.x, y: b.y - b.h / 2 } : null };
  },
};
// 2) рыбалка: рыбки с числами плавают; нажми — крючок ловит рыбку
MECH.fishing = {
  init(S, r) {
    this.S = S; this.r = r; const ch = choicesFor(r, MK);
    this.fish = ch.map((v, i) => ({ v, x: frand(G.W * 0.25, G.W * 0.8), y: G.H * (0.62 + i * 0.1), vx: (i % 2 ? -1 : 1) * frand(70, 110), ph: fx() * 6, caught: false }));
    this.hook = null;
  },
  update(dt) {
    for (const f of this.fish) if (!f.caught) { f.x += f.vx * dt; if (f.x < G.W * 0.18 || f.x > G.W * 0.92) f.vx = -f.vx; f.x = clamp(f.x, G.W * 0.18, G.W * 0.92); }
    const h = this.hook; if (h) {
      h.t += dt;
      if (h.state === 'down') { h.y = lerp(h.y0, h.f.y, Math.min(1, h.t / 0.5)); h.x = h.f.x; if (h.t >= 0.5) { h.state = 'up'; h.t = 0; h.f.caught = true; } }
      else if (h.state === 'up') { h.f.y = lerp(h.ty0 || (h.ty0 = h.f.y), G.H * 0.3, Math.min(1, h.t / 0.6)); h.y = h.f.y; if (h.t >= 0.6) { const ok = this.S.answer(h.f.v); if (!ok) { h.f.caught = false; h.f.y = h.ty0; } this.hook = null; } }
    }
  },
  down(x, y) { if (this.hook) return; const f = this.fish.find(f => !f.caught && Math.abs(f.x - x) < 80 && Math.abs(f.y - y) < 50); if (f) { this.hook = { f, state: 'down', t: 0, y0: G.H * 0.3, x: f.x, y: G.H * 0.3 }; Sound.whoosh ? Sound.whoosh() : Sound.pop(); } },
  draw(c) {
    const rodX = this.hook ? this.hook.x : G.W * 0.5;
    if (this.hook) { c.strokeStyle = 'rgba(40,40,40,0.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(rodX, 0); c.lineTo(this.hook.x, this.hook.y); c.stroke(); c.strokeStyle = '#555'; c.lineWidth = 4; c.beginPath(); c.arc(this.hook.x, this.hook.y + 8, 9, 0, Math.PI); c.stroke(); }
    for (const f of this.fish) {
      c.save(); c.translate(f.x, f.y + Math.sin(G.t * 3 + f.ph) * 6); c.scale(f.vx < 0 && !f.caught ? -1 : 1, 1); if (f.caught) c.rotate(-1.2);
      const g = c.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, '#ff8a65'); g.addColorStop(1, '#ffd54f');
      c.fillStyle = g; c.strokeStyle = '#8d3a17'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 0, 58, 32, 0, 0, 7); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(-52, 0); c.lineTo(-86, -24 + Math.sin(G.t * 9 + f.ph) * 5); c.lineTo(-86, 24 + Math.sin(G.t * 9 + f.ph) * 5); c.closePath(); c.fill(); c.stroke();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(34, -8, 8, 0, 7); c.fill(); c.fillStyle = '#222'; c.beginPath(); c.arc(36, -8, 4, 0, 7); c.fill();
      c.restore();
      txt(c, String(f.v), f.x - 4, f.y + Math.sin(G.t * 3 + f.ph) * 6 + 4, { size: 40, fill: '#fff', stroke: '#5b2a10', sw: 7 });
    }
  },
  probe() { return { kind: 'tap', targets: this.hook ? [] : this.fish.filter(f => !f.caught).map(f => ({ v: f.v, x: f.x, y: f.y })) }; },
};
// 3) прятки: из лунок/кочанов выглядывают числа; нажми верное, пока не спряталось
MECH.whack = {
  init(S, r) {
    this.S = S; this.r = r; this.ch = choicesFor(r, MK);
    const n = 6; this.holes = Array.from({ length: n }, (_, i) => ({ x: G.W * (0.2 + (i % 3) * 0.3), y: G.H * (0.66 + Math.floor(i / 3) * 0.2), v: null, t: 0, up: 0 }));
    this.next = 0.5; this.k = 0;
  },
  update(dt) {
    this.next -= dt;
    for (const h of this.holes) { if (h.v != null) { h.t -= dt; h.up = Math.min(1, h.up + dt * 5); if (h.t <= 0) { h.up -= dt * 10; if (h.up <= 0) { h.v = null; h.up = 0; } } } }
    if (this.next <= 0) {
      const free = this.holes.filter(h => h.v == null); if (free.length) { const h = free[Math.floor(fx() * free.length)]; h.v = this.ch[this.k++ % this.ch.length]; h.t = 2.4; h.up = 0; }
      this.next = 0.8;
    }
  },
  down(x, y) { const h = this.holes.find(h => h.v != null && h.up > 0.5 && Math.abs(h.x - x) < 80 && y > h.y - 140 && y < h.y + 30); if (h) { const ok = this.S.answer(h.v); if (!ok) { h.t = 0; } else { sparkBurst(h.x, h.y - 60, 14, '#ffe066', 220); } } },
  draw(c) {
    for (const h of this.holes) {
      c.fillStyle = 'rgba(40,25,10,0.55)'; c.beginPath(); c.ellipse(h.x, h.y, 70, 20, 0, 0, 7); c.fill();
      if (h.v != null) {
        c.save(); c.beginPath(); c.rect(h.x - 90, h.y - 200, 180, 200); c.clip();
        const yy = h.y + 70 - h.up * 120; drawItem(c, 'chick', h.x, yy + 40, 80); numBadge(c, h.x, yy - 46, h.v, 30); c.restore();
      }
      // кочан капусты спереди
      c.save(); c.translate(h.x, h.y + 6);
      for (let i = 0; i < 5; i++) { c.fillStyle = ['#558b2f', '#7cb342', '#9ccc65', '#689f38', '#8bc34a'][i]; c.beginPath(); c.ellipse((i - 2) * 22, 0, 34, 22, (i - 2) * 0.3, 0, 7); c.fill(); }
      c.restore();
    }
  },
  probe() { return { kind: 'tap', targets: this.holes.filter(h => h.v != null && h.up > 0.6 && h.t > 0.4).map(h => ({ v: h.v, x: h.x, y: h.y - 70 })) }; },
};
// 4) рельсы: стрелка направляет тележку/поезд к одному из трёх чисел; «Поехали!»
MECH.rails = {
  init(S, r) {
    this.S = S; this.r = r; this.ch = choicesFor(r, MK); this.sw = 1; this.run = null;
    const W = G.W, H = G.H; this.start = { x: W * 0.12, y: H * 0.68 }; this.fork = { x: W * 0.46, y: H * 0.68 };
    this.ends = this.ch.map((v, i) => ({ v, x: W * 0.86, y: H * (0.44 + i * 0.2) }));
  },
  pathPt(e, k) {
    const s = this.start, f = this.fork;
    if (k < 0.45) { const t = k / 0.45; return { x: lerp(s.x, f.x, t), y: s.y }; }
    const t = (k - 0.45) / 0.55, cx = lerp(f.x, e.x, 0.5);
    const a = 1 - t; return { x: a * a * f.x + 2 * a * t * cx + t * t * e.x, y: a * a * f.y + 2 * a * t * f.y + t * t * e.y };
  },
  update(dt) {
    const r = this.run; if (!r) return; r.k = Math.min(1, r.k + dt * 0.45);
    if (r.k >= 1 && !r.done) { r.done = true; const ok = this.S.answer(this.ends[this.sw].v); if (!ok) { this.run = null; } }
  },
  down(x, y) {
    if (this.run) return;
    if (Math.hypot(x - this.fork.x, y - (this.fork.y - 70)) < 70) { this.sw = (this.sw + 1) % 3; Sound.click(); return; }
    if (x > G.W / 2 - 120 && x < G.W / 2 + 120 && y > G.H - 120) { this.run = { k: 0 }; Sound.pop(); }
  },
  draw(c) {
    for (let i = 0; i < 3; i++) {
      const e = this.ends[i], act = i === this.sw;
      c.strokeStyle = act ? '#ffd54f' : 'rgba(80,50,30,0.7)'; c.lineWidth = act ? 12 : 8; c.beginPath();
      for (let k = 0.45; k <= 1.001; k += 0.02) { const p = this.pathPt(e, k); k === 0.45 ? c.moveTo(p.x, p.y) : c.lineTo(p.x, p.y); } c.stroke();
      woodPanel(c, e.x - 10, e.y - 50, 130, 100, 16, i + 3); txt(c, String(e.v), e.x + 55, e.y + 4, { size: 52, fill: '#fff8e1', stroke: '#4e2a0e', sw: 8 });
    }
    c.strokeStyle = '#5d4037'; c.lineWidth = 12; c.beginPath(); c.moveTo(this.start.x - 60, this.start.y); c.lineTo(this.fork.x, this.fork.y); c.stroke();
    for (let x = this.start.x - 50; x < this.fork.x; x += 34) { c.fillStyle = '#8d6e63'; c.fillRect(x, this.start.y - 4, 14, 20); }
    // рычаг стрелки
    const fx0 = this.fork.x, fy0 = this.fork.y - 70, a = (this.sw - 1) * 0.6;
    glow(c, fx0, fy0, 70, 'rgba(255,230,120,0.6)', 0.4 + 0.3 * Math.sin(G.t * 4));
    c.fillStyle = '#455a64'; rr(c, fx0 - 30, fy0 + 10, 60, 26, 8); c.fill(); c.strokeStyle = '#263238'; c.lineWidth = 9; c.beginPath(); c.moveTo(fx0, fy0 + 20); c.lineTo(fx0 + Math.sin(a) * 60, fy0 + 20 - Math.cos(a) * 60); c.stroke();
    c.fillStyle = '#e53935'; c.beginPath(); c.arc(fx0 + Math.sin(a) * 60, fy0 + 20 - Math.cos(a) * 60, 14, 0, 7); c.fill();
    // тележка с ёмкостями (ровно r по K)
    const p = this.run ? this.pathPt(this.ends[this.sw], this.run.k) : this.start;
    this.drawCart(c, p.x, p.y);
    if (!this.run) { goldButton(c, G.W / 2 - 120, G.H - 112, 240, 92, 'Поехали!', 42, Math.sin(G.t * 4) * 0.03, 'green'); }
  },
  drawCart(c, x, y) {
    const r = this.r, kind = MC.LEVELS[this.S.n].item, train = MC.BOXSTYLE === 'crate';
    const cw = Math.min(64, 330 / r), W = r * cw + 20;
    c.save(); c.translate(x, y);
    if (train) { c.fillStyle = '#1e88e5'; rr(c, -W / 2 - 70, -78, 70, 62, 10); c.fill(); c.fillStyle = '#263238'; c.fillRect(-W / 2 - 55, -110, 18, 34); }
    c.fillStyle = train ? '#e53935' : '#8d6e63'; c.strokeStyle = '#3e2723'; c.lineWidth = 4; rr(c, -W / 2, -60, W, 46, 8); c.fill(); c.stroke();
    for (const wx of [-W / 2 + 24, W / 2 - 24]) { c.fillStyle = '#37474f'; c.beginPath(); c.arc(wx, -10, 14, 0, 7); c.fill(); }
    let n = 0; for (let g = 0; g < r; g++) { const gx = -W / 2 + 10 + cw * g + cw / 2; c.fillStyle = 'rgba(255,224,130,0.9)'; rr(c, gx - cw / 2 + 3, -64, cw - 6, 10, 4); c.fill(); for (let i = 0; i < MK; i++) { drawThing(c, kind, gx + (i - (MK - 1) / 2) * Math.min(22, cw / MK), -78 - i * 0, Math.min(30, cw * 0.55), n); n++; } }
    this.cartN = n; c.restore();
  },
  probe() { return { kind: 'rails', sw: this.sw, ends: this.ends.map(e => e.v), lever: { x: this.fork.x, y: this.fork.y - 70 }, go: this.run ? null : { x: G.W / 2, y: G.H - 66 } }; },
};
// 5) полёт: герой летит за пальцем (вверх-вниз), ловит звезду с верным числом, облетает тучки
MECH.flight = {
  init(S, r) { this.S = S; this.r = r; this.ch = choicesFor(r, MK); this.p = { x: G.W * 0.18, y: G.H * 0.5, ty: G.H * 0.5 }; this.objs = []; this.t = 0; this.wave = 0; this.inv = 0; this.held = false; },
  update(dt) {
    this.t -= dt; this.inv = Math.max(0, this.inv - dt);
    if (this.t <= 0) {
      const ys = [0.3, 0.5, 0.7].sort(() => fx() - 0.5); const sp = 230 + this.S.round * 40;
      this.ch.forEach((v, i) => this.objs.push({ type: 'star', v, x: G.W + 60 + i * 30, y: G.H * ys[i], vx: -sp }));
      this.objs.push({ type: 'cloud', x: G.W + 340, y: G.H * frand(0.25, 0.75), vx: -sp * 1.1 });
      this.t = 3.6;
    }
    this.p.y += (this.p.ty - this.p.y) * Math.min(1, dt * 8);
    for (const o of this.objs) { o.x += o.vx * dt; if (o.dead) continue;
      if (Math.hypot(o.x - this.p.x, o.y - this.p.y) < (o.type === 'star' ? 60 : 70)) {
        if (o.type === 'star') { o.dead = true; const ok = this.S.answer(o.v); if (ok) { sparkBurst(o.x, o.y, 20, '#ffe066', 300); this.objs.forEach(q => q.dead = true); } }
        else if (!this.inv) { this.inv = 1.2; Sound.bump(); G.shake = 0.2; o.dead = true; }
      } }
    this.objs = this.objs.filter(o => o.x > -100 && !o.dead);
  },
  down(x, y) { this.held = true; this.p.ty = clamp(y, G.H * 0.18, G.H * 0.86); },
  move(x, y) { if (this.held) this.p.ty = clamp(y, G.H * 0.18, G.H * 0.86); },
  up() { this.held = false; },
  draw(c) {
    for (const o of this.objs) {
      if (o.type === 'star') { glow(c, o.x, o.y, 70, 'rgba(255,230,120,0.8)', 0.7); c.drawImage(IMG.t_star, o.x - 46, o.y - 46, 92, 92); txt(c, String(o.v), o.x, o.y + 6, { size: 38, fill: '#fff', stroke: '#7a3b00', sw: 7 }); }
      else { c.save(); c.globalAlpha = 0.95; for (const [dx, dy, rr2] of [[-40, 0, 44], [0, -20, 54], [44, 2, 42]]) { c.fillStyle = '#5c6b8a'; c.beginPath(); c.arc(o.x + dx, o.y + dy, rr2, 0, 7); c.fill(); } c.fillStyle = '#ffeb3b'; c.beginPath(); c.moveTo(o.x - 4, o.y + 30); c.lineTo(o.x + 14, o.y + 30); c.lineTo(o.x - 2, o.y + 70); c.lineTo(o.x + 4, o.y + 46); c.lineTo(o.x - 12, o.y + 46); c.closePath(); c.fill(); c.restore(); }
    }
    // воздушный змей + героиня
    const p = this.p; c.save(); if (this.inv && Math.floor(G.t * 12) % 2) c.globalAlpha = 0.5;
    c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 2; c.beginPath(); c.moveTo(p.x - 20, p.y - 70); c.quadraticCurveTo(p.x - 120, p.y + 40, p.x - 200, p.y + 140); c.stroke();
    c.fillStyle = '#e53935'; c.beginPath(); c.moveTo(p.x, p.y - 140); c.lineTo(p.x + 60, p.y - 80); c.lineTo(p.x, p.y - 20); c.lineTo(p.x - 60, p.y - 80); c.closePath(); c.fill(); c.fillStyle = '#ffeb3b'; c.beginPath(); c.moveTo(p.x, p.y - 140); c.lineTo(p.x + 60, p.y - 80); c.lineTo(p.x, p.y - 80); c.closePath(); c.fill();
    const im = IMG[MC.HEROES.main.img]; if (im) { const h = 120, w = h * im.width / im.height; c.drawImage(im, p.x - w / 2, p.y - h / 2 + 10, w, h); }
    c.restore();
  },
  probe() { const st = this.objs.filter(o => o.type === 'star' && o.x > this.p.x); return { kind: 'flight', p: { x: this.p.x, y: this.p.y }, stars: st.map(o => ({ v: o.v, x: o.x, y: o.y })), clouds: this.objs.filter(o => o.type === 'cloud').map(o => ({ x: o.x, y: o.y })) }; },
};
// 6) тир: шарики с числами поднимаются — нажми верный
MECH.gallery = {
  init(S, r) { this.S = S; this.r = r; this.ch = choicesFor(r, MK); this.b = []; this.t = 0; this.k = 0; },
  update(dt) {
    this.t -= dt; const sp = 70 + this.S.round * 25;
    if (this.t <= 0) { const v = this.ch[this.k++ % 3]; this.b.push({ v, x: G.W * frand(0.22, 0.85), y: G.H + 60, vy: -sp * frand(0.9, 1.2), ph: fx() * 6, col: TOYC[this.k % TOYC.length] }); this.t = 0.9; }
    for (const o of this.b) { o.y += o.vy * dt; o.x += Math.sin(G.t * 1.5 + o.ph) * 20 * dt; }
    this.b = this.b.filter(o => o.y > -80 && !o.dead);
  },
  down(x, y) { const o = this.b.find(o => Math.hypot(o.x - x, o.y - y) < 55); if (!o) return; o.dead = true; puff(o.x, o.y, 10, o.col); Sound.pop(); this.S.answer(o.v); },
  draw(c) { for (const o of this.b) { c.strokeStyle = 'rgba(80,60,40,0.8)'; c.lineWidth = 2; c.beginPath(); c.moveTo(o.x, o.y + 40); c.quadraticCurveTo(o.x + 10, o.y + 80, o.x - 4, o.y + 120); c.stroke(); drawBalloon(c, o.x, o.y, o.col, 1.25); txt(c, String(o.v), o.x, o.y + 2, { size: 40, fill: '#fff', stroke: '#3b1f4a', sw: 7 }); } },
  probe() { return { kind: 'tap', targets: this.b.filter(o => o.y < G.H - 80 && o.y > 120).map(o => ({ v: o.v, x: o.x, y: o.y })) }; },
};
// 7) катапульта: тяни назад и отпускай — снаряд летит по дуге в мишень с числом
MECH.catapult = {
  init(S, r) {
    this.S = S; this.r = r; this.ch = choicesFor(r, MK); this.base = { x: G.W * 0.16, y: G.H * 0.66 }; this.shot = null; this.pull = null;
    this.tg = this.ch.map((v, i) => ({ v, x: G.W * (0.58 + i * 0.13), y: G.H * (0.42 + (i % 2) * 0.18), hit: 0 }));
  },
  vel(dx, dy) { return { vx: -dx * 6.2, vy: -dy * 6.2 }; },
  aimFor(t) { // для автотеста: перебор натяжки, как ребёнок пробует
    let best = null; for (let a = 0.2; a < 1.4; a += 0.01) for (let L = 40; L <= 160; L += 4) { const dx = -Math.cos(a) * L, dy = Math.sin(a) * L; const tr = this.sim(dx, dy, t); if (tr != null && (!best || tr < best.e)) best = { dx, dy, e: tr }; } return best;
  },
  sim(dx, dy, t) { let { vx, vy } = this.vel(dx, dy), x = this.base.x, y = this.base.y - 40, e = 1e9; for (let i = 0; i < 400; i++) { vy += 900 / 120; x += vx / 120; y += vy / 120; e = Math.min(e, Math.hypot(x - t.x, y - t.y)); if (y > G.H) break; } return e < 30 ? e : null; },
  update(dt) {
    const s = this.shot; if (!s) return;
    for (let i = 0; i < 2; i++) { s.vy += 900 * dt / 2; s.x += s.vx * dt / 2; s.y += s.vy * dt / 2;
      const t = this.tg.find(t => Math.hypot(t.x - s.x, t.y - s.y) < 55);
      if (t) { this.shot = null; t.hit = 1; puff(t.x, t.y, 14, '#ffe082'); Sound.bump(); const ok = this.S.answer(t.v); if (!ok) setTimeout(() => t.hit = 0, 600); return; } }
    if (s.y > G.H + 50 || s.x > G.W + 50) { this.shot = null; Sound.bump(); }
  },
  down(x, y) { if (this.shot) return; if (Math.hypot(x - this.base.x, y - (this.base.y - 40)) < 120) this.pull = { dx: 0, dy: 0, x0: x, y0: y }; },
  move(x, y) { if (this.pull) { let dx = x - this.pull.x0, dy = y - this.pull.y0; const L = Math.hypot(dx, dy); if (L > 160) { dx *= 160 / L; dy *= 160 / L; } this.pull.dx = dx; this.pull.dy = dy; } },
  up() { const p = this.pull; if (!p) return; this.pull = null; if (Math.hypot(p.dx, p.dy) < 25) return; const v = this.vel(p.dx, p.dy); this.shot = { x: this.base.x, y: this.base.y - 40, ...v }; Sound.pop(); },
  draw(c) {
    for (const t of this.tg) { c.save(); c.translate(t.x, t.y); if (t.hit) c.rotate(0.3); for (const [r2, col] of [[56, '#e53935'], [42, '#fff'], [28, '#e53935']]) { c.fillStyle = col; c.beginPath(); c.arc(0, 0, r2, 0, 7); c.fill(); } c.restore(); txt(c, String(t.v), t.x, t.y + 4, { size: 40, fill: '#fff', stroke: '#4a0d0d', sw: 8 }); c.fillStyle = '#795548'; c.fillRect(t.x - 6, t.y + 56, 12, G.H * 0.9 - t.y - 56); }
    const b = this.base, p = this.pull || { dx: 0, dy: 0 };
    c.strokeStyle = '#5d4037'; c.lineWidth = 16; c.beginPath(); c.moveTo(b.x, b.y + 80); c.lineTo(b.x, b.y - 20); c.moveTo(b.x, b.y - 20); c.lineTo(b.x - 34, b.y - 70); c.moveTo(b.x, b.y - 20); c.lineTo(b.x + 34, b.y - 70); c.stroke();
    const px = b.x + p.dx, py = b.y - 40 + p.dy; c.strokeStyle = '#3e2723'; c.lineWidth = 5; c.beginPath(); c.moveTo(b.x - 34, b.y - 70); c.lineTo(px, py); c.lineTo(b.x + 34, b.y - 70); c.stroke();
    if (!this.shot) toyArt(c, 'toy1', px, py, 44);
    if (this.pull && Math.hypot(p.dx, p.dy) > 25) { let { vx, vy } = this.vel(p.dx, p.dy), x = b.x, y = b.y - 40; c.fillStyle = 'rgba(255,255,255,0.8)'; for (let i = 0; i < 60; i++) { vy += 900 / 30; x += vx / 30; y += vy / 30; if (i % 3 === 0) { c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill(); } } }
    if (this.shot) toyArt(c, 'toy1', this.shot.x, this.shot.y, 44);
    if (!this.shot && !this.pull && this.S.hintT > 3) { const k = (G.t % 1.4) / 1.4; drawHand(c, b.x - k * 90, b.y - 40 + k * 50); }
  },
  probe() { return { kind: 'catapult', base: { x: this.base.x, y: this.base.y - 40 }, busy: !!this.shot, targets: this.tg.map(t => ({ v: t.v, x: t.x, y: t.y })) }; },
};
// 8) карточки-пары (лото): найди пары «r · K» и «r·K»
MECH.memory = {
  init(S, r, list) {
    this.S = S; const tasks = list || [[r, MK]]; this.cards = [];
    tasks.forEach(([a, b], i) => { this.cards.push({ id: i, txt: `${a} · ${b}`, a, b }); this.cards.push({ id: i, txt: String(a * b), v: a * b }); });
    this.cards.sort(() => fx() - 0.5); const n = this.cards.length, cols = Math.min(4, n), rows = Math.ceil(n / cols);
    this.cards.forEach((cd, i) => { cd.x = G.W / 2 + ((i % cols) - (cols - 1) / 2) * 200; cd.y = G.H * 0.42 + (Math.floor(i / cols) - (rows - 1) / 2) * 170; cd.open = 0; cd.done = false; });
    this.sel = []; this.wait = 0; this.pairs = 0; this.total = tasks.length;
  },
  update(dt) { for (const c of this.cards) c.open += ((c.done || this.sel.includes(c) ? 1 : 0) - c.open) * Math.min(1, dt * 10); if (this.wait > 0) { this.wait -= dt; if (this.wait <= 0) this.sel = []; } },
  down(x, y) {
    if (this.wait > 0) return; const cd = this.cards.find(c => !c.done && !this.sel.includes(c) && Math.abs(c.x - x) < 85 && Math.abs(c.y - y) < 75); if (!cd) return;
    this.sel.push(cd); Sound.click();
    if (this.sel.length === 2) { const [a, b] = this.sel; if (a.id === b.id) { a.done = b.done = true; this.sel = []; this.pairs++; Sound.light(4 + this.pairs); sparkBurst(b.x, b.y, 14, '#ffe066', 220); check((a.v || b.v) === (a.a || b.a) * (a.b || b.b), 'лото: пара верная'); if (this.pairs === this.total) this.S.answerDone(); } else { this.wait = 0.9; Sound.bump(); this.S.miss(); } }
  },
  draw(c) {
    for (const cd of this.cards) {
      const k = Math.abs(Math.cos(cd.open * Math.PI / 2)) , show = cd.open > 0.5;
      c.save(); c.translate(cd.x, cd.y); c.scale(show ? Math.max(0.05, Math.sin(cd.open * Math.PI / 2)) : Math.max(0.05, k), 1);
      if (show) { c.fillStyle = cd.done ? '#fff59d' : '#fffde7'; c.strokeStyle = '#8d6e63'; c.lineWidth = 5; rr(c, -80, -70, 160, 140, 18); c.fill(); c.stroke(); txt(c, cd.txt, 0, 6, { size: cd.v ? 64 : 48, fill: '#4e342e' }); }
      else { const g = c.createLinearGradient(-80, -70, 80, 70); g.addColorStop(0, '#7e57c2'); g.addColorStop(1, '#42a5f5'); c.fillStyle = g; c.strokeStyle = '#fff'; c.lineWidth = 5; rr(c, -80, -70, 160, 140, 18); c.fill(); c.stroke(); c.drawImage(IMG.t_star, -30, -30, 60, 60); }
      c.restore();
    }
  },
  probe() { return { kind: 'memory', cards: this.cards.map(c => ({ id: c.id, done: c.done, x: c.x, y: c.y })), wait: this.wait > 0 }; },
};
function drawHand(c, x, y) { c.save(); c.translate(x, y); c.fillStyle = '#ffe0b2'; c.strokeStyle = '#6d4c41'; c.lineWidth = 3; c.beginPath(); c.ellipse(0, 0, 18, 24, -0.3, 0, 7); c.fill(); c.stroke(); c.beginPath(); c.ellipse(-6, -30, 7, 18, -0.2, 0, 7); c.fill(); c.stroke(); c.restore(); }
// ---------- общая сцена уровня ----------
function mline(k, ...a) { return MC.L[k](...a); }
function msay(S, k, ...a) {
  const role = MC.WHO[k], [t] = MC.L[k](...a);
  const who = role === 'narrator' ? NARR : role === 'villain' ? S.vil : S.act[role];
  return say(who || NARR, t);
}
class MiniScene {
  constructor(n, opts = {}) {
    this.n = n; this.isMini = true; this.L = MC.LEVELS[n]; this.tasks = MC.TASKS[n + 1]; this.round = 0; this.nQ = 0; this.firstTry = 0; this.miss0 = false; this.hintT = 0;
    this.bg = IMG['lv' + (n + 1)] || IMG.bg_title; this.t = 0; this.done = false; this.card = null; this.secretFound = false; this.flash = 0;
    G.zoom = 1; G.freeze = false; this.cam = { x: 0, y: 0 };
    const H = G.H;
    this.act = { mentor: new Actor('mentor', G.W * 0.09, H - 14), main: new Actor('main', G.W * 0.2, H - 10), pet: new Actor('pet', G.W * 0.92, H - 10, null, true) };
    if (this.L.mech === 'flight') this.act.main.hidden = true;
    this.vil = this.L.boss ? new Villain(G.W * 0.82, H * 0.32) : null;
    this.sec = { x: G.W * this.L.secret[0], y: G.H * this.L.secret[1], got: false };
    Sound.setMode && Sound.setMode('day');
    run(this.script());
  }
  *script() {
    const S = this; yield 0.6;
    if (this.vil) { msay(S, 'v' + (S.n + 1)); yield vwait(0.2); }
    msay(S, 'i' + (S.n + 1)); yield vwait(0.2); msay(S, 'g' + (S.n + 1)); yield vwait(0.1);
    for (this.round = 0; this.round < this.tasks.length; this.round++) {
      const [r, k] = this.tasks[this.round]; check(k === MK, 'множитель урока');
      this.q = { r, k, p: r * k, solved: false }; this.miss0 = false; this.hintT = 0; this.misses = 0;
      const mech = MECH[Array.isArray(this.L.mech) ? this.L.mech[this.round] : this.L.mech]; this.mech = Object.create(mech); this.mech.init(this, r);
      if (this.mech.phase !== 'pack') { msay(S, 'q' + (S.n + 1), r); }
      yield () => this.q.solved;
      this.nQ++; if (!this.miss0) this.firstTry++;
      msay(S, 'ok', r, k); S.act.main.hop = 0.5; sparkBurst(G.W / 2, G.H * 0.3, 26, '#ffe066', 360); Sound.ura && Sound.ura();
      if (this.vil) { this.vil.hp--; this.vil.hurt = 0.8; G.shake = 0.3; yield vwait(0.1); msay(S, 'hit' + (3 - this.vil.hp)); }
      yield vwait(0.4); this.mech = null;
    }
    msay(S, 'end'); yield vwait(0.3);
    this.complete();
  }
  onPacked() { msay(this, 'pack'); this.packed = true; msay(this, 'q' + (this.n + 1), this.q.r); }
  answer(v) {
    if (!this.q || this.q.solved) return false;
    if (v === this.q.p) { this.q.solved = true; check(v === this.q.r * this.q.k, 'ответ = произведение'); Sound.light(8); return true; }
    this.miss(); return false;
  }
  answerDone() { this.q.solved = true; }
  miss() { this.miss0 = true; this.misses++; Sound.bump(); this.flash = 0.4; say(this.act.pet, mline(this.misses > 1 ? 'h' : 'no')[0], null, { drop: true }); }
  complete() {
    if (this.done) return; this.done = true; Sound.fanfare(); saveProgress(this.n + 1);
    this.stars = this.nQ ? clamp(Math.round(3 * this.firstTry / this.nQ), 1, 3) : 3; Prog.record(this.n, this.stars, this.secretFound, 0, 0); this.card = { t: 0 };
  }
  update(dt) {
    this.t += dt; updateTasks(dt); updateParticles(dt);
    for (const b of G.bubbles) b.t += dt; G.bubbles = G.bubbles.filter(b => b.t < b.dur); Dialog.update();
    for (const a of Object.values(this.act)) a.update(dt); if (this.vil) this.vil.update(dt);
    if (this.mech && !this.card) { this.mech.update(dt); this.hintT += dt; }
    G.shake = Math.max(0, (G.shake || 0) - dt); this.flash = Math.max(0, this.flash - dt);
    if (this.card) this.card.t += dt;
    if (fx() < dt * 2) spawn({ type: 'spark', layer: 'world', x: frand(0, G.W), y: frand(0, G.H * 0.7), vx: 0, vy: -10, g: 0, life: 1.2, size: frand(3, 6), col: '#fff6c0' });
  }
  draw(c) {
    G.ui = []; const sh = G.shake ? Math.sin(G.t * 70) * 8 * G.shake : 0;
    c.save(); c.translate(sh, 0);
    const im = this.bg, s = Math.max(G.W / im.width, G.H / im.height) * 1.04; c.drawImage(im, (G.W - im.width * s) / 2 + Math.sin(this.t * 0.15) * 8, (G.H - im.height * s) / 2, im.width * s, im.height * s);
    c.fillStyle = 'rgba(255,240,210,0.06)'; c.fillRect(0, 0, G.W, G.H);
    // секрет: еле заметная золотая искорка
    if (!this.sec.got) { const a = 0.35 + 0.35 * Math.sin(this.t * 3); glow(c, this.sec.x, this.sec.y, 26, `rgba(255,220,90,${a})`, 1); c.drawImage(IMG.t_star, this.sec.x - 11, this.sec.y - 11, 22, 22); }
    if (this.vil) this.vil.draw(c);
    for (const [k, a] of Object.entries(this.act)) if (!a.hidden) a.draw(c);
    G.avoid = Object.values(this.act).filter(a => !a.hidden).map(a => a.face());
    if (this.mech) this.mech.draw(c);
    // табличка задачи и картинка групп (кроме конвейера во время упаковки: там группы собирает игрок)
    if (this.q && !this.q.solved && this.mech && !(this.L.mech === 'conveyor' && this.mech.phase === 'pack')) {
      const pr = drawGroupsPanel(c, this, this.q.r, MK, this.L.item, G.W / 2, 140, Math.min(G.W * 0.62, 760));
      txt(c, `${this.q.r} · ${MK} = ?`, G.W / 2, pr.y + pr.h + 34, { size: 46, fill: '#fff8e1', stroke: '#4e2a0e', sw: 9 });
      G.avoid.push({ x: pr.x, y: pr.y, w: pr.w, h: pr.h + 60, counted: true });
    }
    drawParticles(c, 'world');
    for (const b of G.bubbles) drawBubble(c, b, this.cam);
    c.restore();
    if (this.flash) { c.fillStyle = `rgba(255,80,60,${this.flash * 0.3})`; c.fillRect(0, 0, G.W, G.H); }
    // HUD
    woodPanel(c, 16 + G.sl, 14, 300, 70, 16, 3); txt(c, `${this.n + 1}. ${this.L.name}`, 166 + G.sl, 52, { size: 26, fill: '#fff8e1' });
    for (let i = 0; i < this.tasks.length; i++) { const done = i < this.round || (i === this.round && this.q && this.q.solved); c.globalAlpha = done ? 1 : 0.35; c.drawImage(IMG.t_star, 330 + G.sl + i * 46, 24, 42, 42); c.globalAlpha = 1; }
    if (this.vil) { const w = 260, x = G.W - w - 110 - G.sr; c.fillStyle = 'rgba(0,0,0,0.4)'; rr(c, x, 26, w, 30, 15); c.fill(); c.fillStyle = '#ab47bc'; rr(c, x + 4, 30, (w - 8) * this.vil.hp / 3, 22, 11); c.fill(); txt(c, MC.HEROES.villain.name, x + w / 2, 42, { size: 20, fill: '#fff' }); }
    roundIconButton(c, G.W - 84 - G.sr, 18, 66, G.muted ? 'mute' : 'sound'); addButton(G.W - 84 - G.sr, 18, 66, 66, () => Sound.toggle(), 'sound');
    roundIconButton(c, G.W - 160 - G.sr, 18, 66, 'home'); addButton(G.W - 160 - G.sr, 18, 66, 66, () => goScene(() => new MapScene()), 'home');
    if (this.card) this.drawCard(c);
    drawParticles(c, 'hud');
  }
  drawCard(c) {
    const k = easeOutBack(Math.min(1, this.card.t / 0.5)); c.fillStyle = `rgba(20,10,40,${0.35 * Math.min(1, this.card.t * 3)})`; c.fillRect(0, 0, G.W, G.H);
    const w = 660, h = 400, x = G.W / 2 - w / 2, y = G.H / 2 - h / 2;
    c.save(); c.translate(G.W / 2, G.H / 2); c.scale(k, k); c.translate(-G.W / 2, -G.H / 2);
    woodPanel(c, x, y, w, h, 34, 21); c.fillStyle = 'rgba(255,248,225,0.95)'; rr(c, x + 22, y + 22, w - 44, h - 44, 24); c.fill();
    drawLogo(c, 'Уровень пройден!', G.W / 2, y + 74, 54, G.rt, 0, false);
    for (let i = 0; i < this.stars; i++) { const sx = G.W / 2 + (i - (this.stars - 1) / 2) * 110; glow(c, sx, y + 165, 70, 'rgba(255,220,100,0.7)', 0.8); c.drawImage(IMG.t_star, sx - 45, y + 120, 90, 90); }
    txt(c, this.secretFound ? 'Секрет найден!' : 'Секрет спрятан где-то здесь…', G.W / 2, y + 245, { size: 30, fill: '#5b3313' });
    c.restore(); G.ui = [];
    if (this.card.t > 0.5) {
      const by = y + h - 112, isLast = this.n >= MC.LEVELS.length - 1, next = () => goScene(() => isLast ? new FinaleScene() : new MiniScene(this.n + 1));
      goldButton(c, G.W / 2 - 300, by, 190, 84, 'Карта', 36, 0, 'green'); this.card.t > 0.7 && addButton(G.W / 2 - 300, by, 190, 84, () => goScene(() => new MapScene()), 'map');
      if (this.secretFound) { goldButton(c, G.W / 2 - 95, by, 190, 84, 'Секрет!', 36, Math.sin(G.rt * 5) * 0.03); this.card.t > 0.7 && addButton(G.W / 2 - 95, by, 190, 84, () => goScene(() => new BonusMini(this.n)), 'next'); }
      goldButton(c, G.W / 2 + 110, by, 190, 84, isLast ? 'Финал' : 'Дальше', 36, 0, 'green'); this.card.t > 0.7 && addButton(G.W / 2 + 110, by, 190, 84, next, 'skipbonus');
    }
  }
  onTap() { }
  pdown(x, y) {
    if (this.card) return;
    if (!this.sec.got && Math.hypot(x - this.sec.x, y - this.sec.y) < 40) { this.sec.got = true; this.secretFound = true; Prog.secretNow(this.n); Sound.secret(); sparkBurst(this.sec.x, this.sec.y, 24, '#ffd43b', 300); msay(this, 'sec'); return; }
    if (Dialog.cur && !this.mech) { Dialog.skip(); return; }
    if (this.mech && this.mech.down) this.mech.down(x, y);
  }
  pmove(x, y) { if (this.mech && this.mech.move) this.mech.move(x, y); }
  pup(x, y) { if (this.mech && this.mech.up) this.mech.up(x, y); }
  onEnter() { if (this.card && this.card.t > 0.5) goScene(() => this.n >= MC.LEVELS.length - 1 ? new FinaleScene() : new MiniScene(this.n + 1)); }
  probe() { return { scene: 'mini', n: this.n, round: this.round, q: this.q, mech: this.mech ? this.mech.probe() : null, card: !!this.card, secret: { x: this.sec.x, y: this.sec.y, got: this.sec.got }, drawn: this.drawn, talking: !Dialog.idle() }; }
}
// ---------- секретная комната ----------
class BonusMini extends MiniScene {
  constructor(n) { super(n); this.isBonus = true; this.bg = IMG['lv' + (n + 1)] || IMG.bg_title; }
  *script() {
    yield 0.5; msay(this, 'bIn'); yield vwait(0.2);
    this.q = { r: 0, k: MK, p: -1, solved: false };
    if (MC.BONUS_KIND === 'memory') {
      const pool = [[2, MK], [3, MK], [4, MK], [5, MK], [6, MK]].sort(() => fx() - 0.5).slice(0, 4); this.mech = Object.create(MECH.memory); this.mech.init(this, 0, pool);
      yield () => this.q.solved; this.result = pool.length; msay(this, 'bDone', pool.length);
    } else {
      this.mech = Object.create(MECH.race); this.mech.init(this); yield () => this.mech.over;
      this.result = this.mech.full; check(this.mech.full * MK === this.mech.boxes.filter(b => b.n === MK).length * MK, 'сеновал: полных корзинок × 2'); msay(this, 'bDone', this.mech.full);
    }
    yield vwait(0.5); this.done = true; this.stars = 3; this.card = { t: 0, bonus: true };
  }
  drawCard(c) {
    c.fillStyle = 'rgba(20,10,40,0.35)'; c.fillRect(0, 0, G.W, G.H); woodPanel(c, G.W / 2 - 300, G.H / 2 - 150, 600, 300, 30, 9);
    drawLogo(c, 'Секрет пройден!', G.W / 2, G.H / 2 - 80, 50, G.rt, 0, false);
    txt(c, MC.BONUS_KIND === 'memory' ? `Пар найдено: ${this.result}` : `${this.result} · ${MK} = ${this.result * MK}`, G.W / 2, G.H / 2, { size: 44, fill: '#fff8e1', stroke: '#4e2a0e', sw: 8 });
    G.ui = []; const isLast = this.n >= MC.LEVELS.length - 1, next = () => goScene(() => isLast ? new FinaleScene() : new MiniScene(this.n + 1));
    goldButton(c, G.W / 2 - 110, G.H / 2 + 50, 220, 84, isLast ? 'Финал' : 'Дальше', 36, 0, 'green'); this.card.t > 0.7 && addButton(G.W / 2 - 110, G.H / 2 + 50, 220, 84, next, 'next');
  }
  onEnter() { }
}
// гонка-сортировка на время: падающие предметы — нажми, и он прыгнет в открытую ёмкость (по K)
MECH.race = {
  init(S) { this.S = S; this.T = MC.BONUS_TIME; this.items = []; this.t = 0; this.boxes = Array.from({ length: 8 }, (_, i) => ({ x: G.W / 2 + (i - 3.5) * 140, y: G.H - 30, w: 120, h: 60, n: 0 })); this.full = 0; this.over = false; this.k = 0; },
  update(dt) {
    if (this.over) return; this.T -= dt; this.t -= dt;
    if (this.t <= 0) { this.items.push({ x: G.W * frand(0.15, 0.85), y: -40, vy: frand(90, 130), i: this.k++ }); this.t = 0.75; }
    for (const o of this.items) { if (o.fly) { o.ft += dt * 3; const k = Math.min(1, o.ft); o.x = lerp(o.fx, o.tx, k); o.y = lerp(o.fy, o.ty, k) - Math.sin(k * Math.PI) * 60; if (k >= 1) o.in = true; } else o.y += o.vy * dt; }
    this.items = this.items.filter(o => o.in || o.fly || o.y < G.H * 0.8);
    if (this.T <= 0) { this.over = true; this.full = this.boxes.filter(b => b.n === MK).length; }
  },
  down(x, y) { if (this.over) return; const o = this.items.find(o => !o.fly && Math.hypot(o.x - x, o.y - y) < 50); if (!o) return; const b = this.boxes.find(b => b.n < MK); if (!b) return; const sl = boxSlots(b.x, b.y, b.w, b.h, MK)[b.n]; b.n++; Object.assign(o, { fly: true, ft: 0, fx: o.x, fy: o.y, tx: sl.x, ty: sl.y }); Sound.pop(); },
  draw(c) {
    this.boxes.forEach(b => drawBox(c, b.x, b.y, b.w, b.h, b.n, b.n === MK));
    for (const o of this.items) drawThing(c, MC.LEVELS[this.S.n].item === 'duck' ? 'chick' : MC.LEVELS[this.S.n].item, o.x, o.y, 54, o.i);
    const k = Math.max(0, this.T / MC.BONUS_TIME); c.fillStyle = 'rgba(0,0,0,0.4)'; rr(c, G.W / 2 - 200, 100, 400, 28, 14); c.fill(); c.fillStyle = k > 0.3 ? '#ffd43b' : '#ff6b6b'; rr(c, G.W / 2 - 196, 104, 392 * k, 20, 10); c.fill();
    txt(c, `Полных: ${this.boxes.filter(b => b.n === MK).length}`, G.W / 2, 160, { size: 34, fill: '#fff8e1', stroke: '#4e2a0e', sw: 7 });
  },
  probe() { return { kind: 'tap', targets: this.items.filter(o => !o.fly && o.y > 60).map(o => ({ v: 0, x: o.x, y: o.y })), over: this.over }; },
};
// ---------- пролог-сказка (рассказчик + герои на фоне) ----------
class StoryMini extends MiniScene {
  constructor() { super(0); this.isStory = true; this.bg = IMG.bg_title; this.vil = new Villain(G.W * 0.8, G.H * 0.3); }
  *script() {
    yield 0.6; for (const k of ['p1', 'p2', 'p3', 'p4', 'p5', 'p6']) { msay(this, k); yield vwait(0.25); }
    try { localStorage.setItem(MC.LS + '_prologue', '1'); } catch (_) { }
    goScene(() => new MapScene());
  }
  drawCard() { }
  pdown() { if (Dialog.cur) Dialog.skip(); }
}
// ---------- подключение: карта и тесты открывают мини-игры вместо платформера ----------
LEVEL_NAMES.splice(0, LEVEL_NAMES.length, ...MC.LEVELS.map(l => l.name));
const _PlayScene = PlayScene;
PlayScene = function (n) { if (typeof n === 'number') return new MiniScene(n); if (n === (typeof PROLOGUE !== 'undefined' ? PROLOGUE : 0)) return new StoryMini(); return new _PlayScene(n); };
function prologueSeen() { try { return localStorage.getItem(MC.LS + '_prologue') === '1'; } catch (_) { return true; } }
(function () {
  const cv = document.getElementById('game');
  const L = e => toLogical(e.clientX, e.clientY);
  const uiHit = p => G.ui.some(u => p.x >= u.x && p.x <= u.x + u.w && p.y >= u.y && p.y <= u.y + u.h);
  let down = false;
  cv.addEventListener('pointerdown', e => { const p = L(e); if (uiHit(p) || !G.scene || !G.scene.pdown || G.trans) return; down = true; try { cv.setPointerCapture(e.pointerId); } catch (_) { } G.scene.pdown(p.x, p.y); });
  cv.addEventListener('pointermove', e => { if (!down || !G.scene || !G.scene.pmove) return; const p = L(e); G.scene.pmove(p.x, p.y); });
  const up = e => { if (!down) return; down = false; const p = L(e); if (G.scene && G.scene.pup) G.scene.pup(p.x, p.y); };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
})();
window.__mini = { probe: () => G.scene && G.scene.probe ? G.scene.probe() : { scene: G.scene && G.scene.constructor.name } };

// финал: озвученные реплики f1–f3 (свиток-лента, голоса героев)
(function () {
  const P = FinaleScene.prototype, u0 = P.update, d0 = P.draw;
  const KIND = r => r === 'narrator' ? 'narrator' : ((MC.HEROES[r] || {}).voice || 'narrator');
  P.update = function (dt) {
    u0.call(this, dt);
    if (!this._fl) { this._fl = 1; for (const k of ['f1', 'f2', 'f3']) if (MC.L[k]) say({ kind: KIND(MC.WHO[k]), narrator: true, talk: 0 }, MC.L[k]()[0]); }
    for (const b of G.bubbles) b.t += dt; G.bubbles = G.bubbles.filter(b => b.t < b.dur); Dialog.update();
  };
  P.draw = function (c) { d0.call(this, c); for (const b of G.bubbles) drawBubble(c, b, { x: 0, y: 0 }); };
})();
