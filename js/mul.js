'use strict';
// ===== Умножение: равные группы предметов. Всё, что видно, считается кодом (rects() — каждый предмет) =====
const _paintItem0 = paintItem;
paintItem = function (c, kind, s) {
  const r = s / 2; c.lineJoin = 'round'; c.lineCap = 'round';
  if (kind === 'berry') {   // малина-ягодка: красная шишечка из зёрнышек
    c.fillStyle = '#5c0e1a'; c.beginPath(); c.ellipse(0, -r, r * 0.92, r, 0, 0, 7); c.fill();
    for (let i = 0; i < 9; i++) { const a = i * 2.4, rr0 = (i % 3) * r * 0.3; const x = Math.cos(a) * rr0 * 0.9, y = -r + Math.sin(a) * rr0; sphere(c, x, y, r * 0.42, '#ffc2cf', '#e8284f', '#8f0f2c'); c.beginPath(); c.arc(x, y, r * 0.42, 0, 7); c.fill(); }
    c.fillStyle = '#4cae3a'; c.strokeStyle = '#256b14'; c.lineWidth = 1.4; for (const a of [-0.6, 0, 0.6]) { c.beginPath(); c.ellipse(Math.sin(a) * 7, -s - 1, 6, 3, a, 0, 7); c.fill(); c.stroke(); }
  } else if (kind === 'plum') {
    sphere(c, 0, -r, r, '#d8b4ff', '#7b3fd1', '#3b1475'); c.strokeStyle = '#26094f'; c.lineWidth = 2.2;
    c.beginPath(); c.ellipse(0, -r, r * 0.86, r, 0, 0, 7); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(40,10,80,0.5)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, -s + 4); c.quadraticCurveTo(r * 0.4, -r, 0, -3); c.stroke();
    c.strokeStyle = '#5b3313'; c.lineWidth = 3; c.beginPath(); c.moveTo(0, -s + 2); c.lineTo(3, -s - 5); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(-r * 0.4, -r * 1.35, r * 0.18, r * 0.12, -0.6, 0, 7); c.fill();
  } else if (kind === 'lily') {   // кувшинка: лист + розовый цветок
    c.fillStyle = '#3aa64a'; c.strokeStyle = '#1e5e26'; c.lineWidth = 2; c.beginPath(); c.ellipse(0, -r * 0.45, r * 1.15, r * 0.45, 0, 0.25, Math.PI * 2 - 0.25); c.lineTo(0, -r * 0.45); c.closePath(); c.fill(); c.stroke();
    for (let i = 0; i < 7; i++) { const a = -Math.PI / 2 + (i - 3) * 0.42; c.save(); c.translate(0, -r * 0.6); c.rotate(a + Math.PI / 2); c.fillStyle = i % 2 ? '#ff9ec7' : '#ffc4dd'; c.strokeStyle = '#c2255c'; c.lineWidth = 1.3; c.beginPath(); c.ellipse(0, -r * 0.42, r * 0.2, r * 0.46, 0, 0, 7); c.fill(); c.stroke(); c.restore(); }
    c.fillStyle = '#ffd43b'; c.beginPath(); c.arc(0, -r * 0.62, r * 0.18, 0, 7); c.fill();
  } else if (kind === 'bushc') {  // кустик на грядке с тремя ягодками
    c.fillStyle = '#2f8a2a'; c.strokeStyle = '#174d14'; c.lineWidth = 2;
    for (const [x, y, rad] of [[-r * 0.5, -r * 0.7, r * 0.55], [r * 0.5, -r * 0.7, r * 0.55], [0, -r * 1.15, r * 0.62], [0, -r * 0.55, r * 0.6]]) { sphere(c, x, y, rad, '#9be37a', '#3fa337', '#1d5e19'); c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); c.stroke(); }
    for (const [x, y] of [[-r * 0.45, -r * 0.6], [r * 0.4, -r * 0.95], [-r * 0.05, -r * 1.35]]) { sphere(c, x, y, r * 0.16, '#ffc2cf', '#e8284f', '#8f0f2c'); c.beginPath(); c.arc(x, y, r * 0.16, 0, 7); c.fill(); }
  } else _paintItem0(c, kind, s);
};

// ---- игрушки (урок 73): мишка, мячик, кубик, пирамидка — объёмные, «пиксаровские» блики
const TOYC = ['#ff6b6b', '#4dabf7', '#51cf66', '#ffd43b', '#cc5de8', '#ff922b'];
function toyLight(h) { return h === '#ffd43b' ? '#fff6c8' : '#ffffff'; }
const _paintItem1 = paintItem;
paintItem = function (c, kind, s) {
  const r = s / 2; c.lineJoin = 'round'; c.lineCap = 'round';
  if (kind === 'teddy') {
    const B = ['#ffd8a8', '#c8814a', '#6b3a16'];
    c.strokeStyle = '#4a2610'; c.lineWidth = 2;
    for (const e of [-1, 1]) { sphere(c, e * r * 0.62, -s * 0.95, r * 0.26, ...B); c.beginPath(); c.arc(e * r * 0.62, -s * 0.95, r * 0.26, 0, 7); c.fill(); c.stroke(); }
    sphere(c, 0, -r * 0.55, r * 0.62, ...B); c.beginPath(); c.ellipse(0, -r * 0.55, r * 0.62, r * 0.55, 0, 0, 7); c.fill(); c.stroke();
    sphere(c, 0, -s * 0.72, r * 0.5, ...B); c.beginPath(); c.arc(0, -s * 0.72, r * 0.5, 0, 7); c.fill(); c.stroke();
    c.fillStyle = '#f6d2a6'; c.beginPath(); c.ellipse(0, -s * 0.64, r * 0.24, r * 0.17, 0, 0, 7); c.fill();
    c.fillStyle = '#2b1a10'; for (const e of [-1, 1]) { c.beginPath(); c.arc(e * r * 0.2, -s * 0.78, r * 0.075, 0, 7); c.fill(); }
    c.beginPath(); c.ellipse(0, -s * 0.68, r * 0.08, r * 0.055, 0, 0, 7); c.fill();
    c.fillStyle = '#ff6b9d'; c.beginPath(); c.moveTo(-r * 0.3, -r * 1.02); c.lineTo(0, -r * 0.9); c.lineTo(r * 0.3, -r * 1.02); c.lineTo(r * 0.3, -r * 0.78); c.lineTo(0, -r * 0.9); c.lineTo(-r * 0.3, -r * 0.78); c.closePath(); c.fill();
  } else if (kind === 'tball') {
    sphere(c, 0, -r, r, '#ffe0e0', '#ff4d4d', '#9e1b1b'); c.beginPath(); c.arc(0, -r, r, 0, 7); c.fill();
    c.save(); c.beginPath(); c.arc(0, -r, r, 0, 7); c.clip();
    c.fillStyle = '#ffe14d'; c.fillRect(-r, -r - r * 0.2, s, r * 0.4); c.fillStyle = '#3b8cff'; c.beginPath(); c.arc(0, -r, r * 0.22, 0, 7); c.fill(); c.restore();
    c.strokeStyle = '#6e1010'; c.lineWidth = 2; c.beginPath(); c.arc(0, -r, r, 0, 7); c.stroke();
    c.fillStyle = 'rgba(255,255,255,0.75)'; c.beginPath(); c.ellipse(-r * 0.4, -r * 1.45, r * 0.24, r * 0.14, -0.6, 0, 7); c.fill();
  } else if (kind === 'tcube') {
    const g = c.createLinearGradient(-r, -s, r, 0); g.addColorStop(0, '#9fe6ff'); g.addColorStop(1, '#1c7ed6');
    c.fillStyle = g; c.strokeStyle = '#0b3d75'; c.lineWidth = 2.4; rr(c, -r * 0.9, -s * 0.9, s * 0.9, s * 0.9, r * 0.22); c.fill(); c.stroke();
    c.fillStyle = '#ffd43b'; c.beginPath(); for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + k * Math.PI / 5, rad = k % 2 ? r * 0.18 : r * 0.42; c.lineTo(Math.cos(a) * rad, -s * 0.45 + Math.sin(a) * rad); } c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.55)'; rr(c, -r * 0.72, -s * 0.84, r * 0.6, r * 0.18, r * 0.09); c.fill();
  } else if (kind === 'tpyr') {
    const cols = ['#ff6b6b', '#ff922b', '#ffd43b', '#51cf66'];
    for (let k = 0; k < 4; k++) { const w = r * (1 - k * 0.2), y = -r * 0.3 - k * r * 0.42; sphere(c, -w * 0.3, y - r * 0.1, w, '#ffffff', cols[k], '#5a2d0c'); c.strokeStyle = 'rgba(70,30,0,0.6)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(0, y, w, r * 0.24, 0, 0, 7); c.fill(); c.stroke(); }
    sphere(c, 0, -s * 0.95, r * 0.18, '#ffffff', '#4dabf7', '#1c4f80'); c.beginPath(); c.arc(0, -s * 0.95, r * 0.18, 0, 7); c.fill();
  } else _paintItem1(c, kind, s);
};
// раскладки: beds — грядки уходят назад; baskets — корзинки в ряд; grid — пруд (ряды ↕ можно повернуть); steps — ступеньки лестницы
const ML = {
  shelves: { its: ['teddy', 'tball', 'tcube'], sz: 50, dx: 64, dy: 82 },
  baskets: { it: 'tball', sz: 30, bw: 104, gap: 16 },
  grid: { it: 'tcube', sz: 40, dx: 54, dy: 48 },
  plums: { it: 'tpyr', sz: 38, dx: 50, dy: 46 },
  steps: { it: 'teddy', sz: 36, sw: 132, sh: 48 },
};
function mlItem(P, i) { return P.its ? P.its[i % P.its.length] : P.it; }
class MulGroup extends Ent {
  constructor(lay, x, y, rows, cols) { super(x, y); Object.assign(this, { lay, rows, cols }); this.z = -0.5; this.hl = 0; this.lab = 0; this.rot = 0; this.shown = rows * cols; this.dx0 = 0; }
  get P() { return ML[this.lay]; }
  // позиция i-го предмета в группе g (низ предмета)
  pos(g, i) {
    const P = this.P, X = this.x + this.dx0, Y = this.y;
    if (this.lay === 'shelves') return { x: X + 52 + i * P.dx, y: Y - 26 - g * P.dy };
    if (this.lay === 'baskets') { const bx = X + g * (P.bw + P.gap) + P.bw / 2; return { x: bx + (i - 1) * 30, y: Y - 56 }; }
    if (this.lay === 'steps') return { x: X + g * P.sw + 26 + i * 38, y: Y - (g + 1) * P.sh };
    // grid/plums: ряд g, место i; поворот rot∈[0,1] переводит (ряд g, место i) → (ряд i, место g)
    const a = { x: X + 30 + i * P.dx, y: Y - 16 - g * P.dy }, b = { x: X + 30 + g * P.dx, y: Y - 16 - i * P.dy };
    const k = easeInOut(this.rot); return { x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) };
  }
  dims() { return this.rot >= 0.5 ? [this.cols, this.rows] : [this.rows, this.cols]; }
  width() {
    const P = this.P;
    if (this.lay === 'shelves') return 70 + this.cols * P.dx;
    if (this.lay === 'baskets') return this.rows * (P.bw + P.gap);
    if (this.lay === 'steps') return this.rows * P.sw + 20;
    return 60 + Math.max(this.rows, this.cols) * P.dx;
  }
  height() { const P = this.P; if (this.lay === 'shelves') return this.rows * P.dy + 50; if (this.lay === 'baskets') return 130; if (this.lay === 'steps') return (this.rows + 1) * P.sh + 20; return Math.max(this.rows, this.cols) * P.dy + 40; }
  count() { return Math.min(this.shown, this.rows * this.cols); }
  rects() {
    const P = this.P, out = []; let n = 0;
    for (let g = 0; g < this.rows; g++) for (let i = 0; i < this.cols; i++) { if (n++ >= this.shown) continue; const p = this.pos(g, i), s = P.sz; out.push({ kind: 'it', g, r: { x: p.x - s * 0.45, y: p.y - s * 0.95, w: s * 0.9, h: s * 0.9 } }); }
    return out;
  }
  bounds() { return [{ x: this.x + this.dx0, y: this.y - this.height(), w: this.width(), h: this.height() }]; }
  update(dt) { this.hl = Math.max(0, this.hl - dt); }
  drawBack(c) {
    const P = this.P, X = this.x + this.dx0, Y = this.y;
    if (this.lay === 'shelves') {   // стеллаж: стойки + полки (полка = группа)
      const w = this.width() - 10, top = Y - this.height();
      c.fillStyle = 'rgba(60,30,10,0.18)'; rr(c, X + 10, top + 6, w, Y - top - 6, 14); c.fill();
      c.fillStyle = '#ffe8c2'; rr(c, X + 14, top, w - 8, Y - top - 8, 12); c.fill();
      for (const sx of [X + 6, X + w - 6]) { const gg = c.createLinearGradient(sx, 0, sx + 18, 0); gg.addColorStop(0, '#e09a5a'); gg.addColorStop(1, '#8a4f22'); c.fillStyle = gg; c.strokeStyle = '#4a2610'; c.lineWidth = 3; rr(c, sx, top - 10, 18, Y - top + 10, 6); c.fill(); c.stroke(); }
      for (let g = 0; g < this.rows; g++) {
        const y = Y - 26 - g * P.dy, gg = c.createLinearGradient(0, y, 0, y + 16); gg.addColorStop(0, '#f0b070'); gg.addColorStop(1, '#a8622c');
        c.fillStyle = gg; c.strokeStyle = '#4a2610'; c.lineWidth = 3; rr(c, X, y, w + 12, 16, 6); c.fill(); c.stroke();
      }
    }
    if (this.lay === 'grid' || this.lay === 'plums') {   // пруд / скатерть под рядами
      const [R, C] = [Math.max(this.rows, this.cols), Math.max(this.rows, this.cols)];
      const h = this.lay === 'grid' ? (this.rot > 0 && this.rot < 1 ? R : this.dims()[0]) * P.dy + 18 : this.rows * P.dy + 18, w = (this.rot > 0 && this.rot < 1 ? C : this.dims()[1]) * P.dx + 24;
      c.fillStyle = this.lay === 'grid' ? 'rgba(255,120,170,0.85)' : 'rgba(255,244,214,0.94)'; c.strokeStyle = this.lay === 'grid' ? '#ffd43b' : '#b0682a'; c.lineWidth = this.lay === 'grid' ? 8 : 4;
      rr(c, X + 30 - P.dx / 2 - 6, Y - 4 - h, w, h, 18); c.fill(); c.stroke();
    }
    if (this.lay === 'steps') for (let g = 0; g < this.rows; g++) {   // ступеньки (декор, не платформы)
      const x0 = X + g * P.sw, y = Y - (g + 1) * P.sh;
      const col = TOYC[g % TOYC.length], gr = c.createLinearGradient(0, y, 0, Y); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(40,20,60,0.55)');
      c.fillStyle = col; c.strokeStyle = '#3b1d4a'; c.lineWidth = 3; rr(c, x0, y, P.sw, Y - y, 10); c.fill(); c.fillStyle = gr; rr(c, x0, y, P.sw, Y - y, 10); c.fill(); c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.45)'; rr(c, x0 + 8, y + 5, P.sw - 16, 8, 4); c.fill();
    }
    if (this.lay === 'baskets') for (let g = 0; g < this.rows; g++) {   // корзинка (задняя стенка)
      const bx = X + g * (P.bw + P.gap); c.fillStyle = 'rgba(40,20,60,0.35)'; rr(c, bx + 4, Y - 96, P.bw - 8, 50, 10); c.fill();
    }
  }
  drawFrontParts(c) {
    const P = this.P, X = this.x + this.dx0, Y = this.y;
    if (this.lay === 'baskets') for (let g = 0; g < this.rows; g++) {   // корзинка: низкий борт, ягоды над ним
      const bx = X + g * (P.bw + P.gap);
      const col = TOYC[g % TOYC.length], gr = c.createLinearGradient(0, Y - 52, 0, Y - 6); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(30,10,40,0.45)');
      c.fillStyle = col; c.beginPath(); c.moveTo(bx, Y - 54); c.lineTo(bx + P.bw, Y - 54); c.lineTo(bx + P.bw - 12, Y - 6); c.lineTo(bx + 12, Y - 6); c.closePath(); c.fill(); c.fillStyle = gr; c.strokeStyle = '#2b1640'; c.lineWidth = 3; c.beginPath(); c.moveTo(bx, Y - 54); c.lineTo(bx + P.bw, Y - 54); c.lineTo(bx + P.bw - 12, Y - 6); c.lineTo(bx + 12, Y - 6); c.closePath(); c.fill(); c.stroke();
      c.strokeStyle = 'rgba(255,255,255,0.55)'; c.lineWidth = 3; for (const yy of [Y - 42]) { c.beginPath(); c.moveTo(bx + 6, yy); c.lineTo(bx + P.bw - 6, yy); c.stroke(); }
    }
  }
  draw(c) {
    const P = this.P;
    this.drawBack(c);
    let n = 0;
    for (let g = 0; g < this.rows; g++) for (let i = 0; i < this.cols; i++) {
      if (n++ >= this.shown) continue;
      const p = this.pos(g, i);
      if (this.hl > 0) glow(c, p.x, p.y - P.sz / 2, P.sz, 'rgba(255,240,150,0.8)', Math.min(1, this.hl));
      drawItem(c, mlItem(P, i), p.x, p.y, P.sz);
    }
    this.drawFrontParts(c);
    // подписи «по порядку»: 4, 8, 12 — у каждой группы
    for (let g = 0; g < Math.min(this.lab, this.groupsNow()); g++) { const l = this.labPos(g); bubbleNum(c, l.x, l.y, String((g + 1) * this.perNow())); }
  }
  groupsNow() { return this.dims()[0]; }
  perNow() { return this.dims()[1]; }
  labPos(g) {
    const P = this.P, X = this.x + this.dx0, Y = this.y;
    if (this.lay === 'shelves') return { x: X + this.width() + 34, y: Y - 56 - g * P.dy };
    if (this.lay === 'baskets') return { x: X + g * (P.bw + P.gap) + P.bw / 2, y: Y + 26 };
    if (this.lay === 'steps') return { x: X + g * P.sw + 45, y: Y - (g + 1) * P.sh + 28 };
    const [R, C] = this.dims(); return { x: X + 30 + C * P.dx - 4, y: Y - 34 - g * P.dy };
  }
}
function bubbleNum(c, x, y, s) {
  c.save(); c.font = font(26, 900); const w = Math.max(40, c.measureText(s).width + 20);
  c.fillStyle = '#fff8e6'; c.strokeStyle = '#c2410c'; c.lineWidth = 3; rr(c, x - w / 2, y - 18, w, 36, 18); c.fill(); c.stroke();
  txt(c, s, x, y, { size: 26, fill: '#c2410c' }); c.restore();
}
function easeInOut(t) { t = clamp(t, 0, 1); return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
// подписи групп одна за другой: 4, 8, 12 (тик на каждую), в конце проверка кодом
function* countGroups(S, g) {
  g.lab = 0; const [R, C] = g.dims();
  for (let k = 1; k <= R; k++) { g.lab = k; Sound.count(Math.min(10, k)); yield 0.6; }
  check(g.lab === R && R * C === g.rows * g.cols && g.count() === g.rows * g.cols, `подписи: ${R} групп по ${C} = ${R * C}`);
}
// игрушечный поезд: рельсы, сцепки, колёса у каждого вагончика, паровозик впереди (слева)
class Cart extends Ent {
  constructor(grp) { super(grp.x, grp.y); this.g = grp; this.z = -0.55; }
  draw(c) {
    const g = this.g, P = g.P, X = g.x + g.dx0, Y = g.y, spin = g.dx0 / 18;
    c.strokeStyle = '#7a4a2a'; c.lineWidth = 6; c.beginPath(); c.moveTo(g.x - 2000, Y - 2); c.lineTo(g.x + 2400, Y - 2); c.stroke();
    c.fillStyle = '#a0683a'; for (let x = Math.floor((g.x - 2000) / 46) * 46; x < g.x + 2400; x += 46) c.fillRect(x, Y - 4, 22, 8);
    const wheel = (wx, rad) => { c.fillStyle = '#2f2f3a'; c.beginPath(); c.arc(wx, Y - 12, rad, 0, 7); c.fill(); c.fillStyle = '#ffd43b'; c.beginPath(); c.arc(wx, Y - 12, rad * 0.4, 0, 7); c.fill(); c.strokeStyle = '#e9ecef'; c.lineWidth = 2.5; c.beginPath(); c.moveTo(wx + Math.cos(spin) * rad * 0.8, Y - 12 + Math.sin(spin) * rad * 0.8); c.lineTo(wx - Math.cos(spin) * rad * 0.8, Y - 12 - Math.sin(spin) * rad * 0.8); c.stroke(); };
    for (let k = 0; k < g.rows; k++) { const bx = X + k * (P.bw + P.gap); c.fillStyle = '#3b2a4a'; c.fillRect(bx + 8, Y - 22, P.bw - 16, 8); if (k) c.fillRect(bx - P.gap - 4, Y - 30, P.gap + 8, 6); wheel(bx + 26, 11); wheel(bx + P.bw - 26, 11); }
    // паровозик (не считается: в нём нет мячиков)
    const lx = X - 150; c.fillStyle = '#3b2a4a'; c.fillRect(lx + 132, Y - 30, 24, 6);
    c.fillStyle = '#e03131'; c.strokeStyle = '#5c0f0f'; c.lineWidth = 3; rr(c, lx, Y - 70, 120, 50, 10); c.fill(); c.stroke();
    c.fillStyle = '#1c7ed6'; rr(c, lx + 60, Y - 118, 66, 56, 8); c.fill(); c.stroke();
    c.fillStyle = '#d0ebff'; rr(c, lx + 72, Y - 108, 42, 24, 5); c.fill();
    c.fillStyle = '#ffd43b'; rr(c, lx + 54, Y - 126, 78, 12, 5); c.fill(); c.stroke();
    c.fillStyle = '#343a40'; rr(c, lx + 14, Y - 108, 22, 40, 4); c.fill(); c.fillStyle = '#ffd43b'; rr(c, lx + 8, Y - 114, 34, 10, 4); c.fill();
    for (let k = 0; k < 3; k++) { c.fillStyle = `rgba(255,255,255,${0.7 - k * 0.2})`; c.beginPath(); c.arc(lx + 25 - k * 18 + Math.sin(G.t * 3 + k) * 4, Y - 128 - k * 24, 12 + k * 6, 0, 7); c.fill(); }
    glow(c, lx + 4, Y - 48, 22, 'rgba(255,240,150,0.9)', 0.8); c.fillStyle = '#fff3bf'; c.beginPath(); c.arc(lx + 4, Y - 48, 8, 0, 7); c.fill();
    wheel(lx + 28, 16); wheel(lx + 92, 16);
  }
}
// облако босса и перья Щёлка
class BossCloud extends Ent {
  constructor(sh) { super(sh.x, sh.y); this.sh = sh; this.z = -0.2; this.feathers = 3; this.fall = []; }
  update(dt) { this.x = this.sh.x; this.y = this.sh.y; for (const f of this.fall) f.t += dt; this.fall = this.fall.filter(f => f.t < 0.6); }
  knock() { this.feathers--; const p = this.featherPos(this.feathers); this.fall.push({ x: p.x, y: p.y, t: 0 }); Sound.pop(); sparkBurst(p.x, p.y, 22, ['#ff6b6b', '#ffd43b', '#4dabf7'][this.feathers], 300); }
  featherPos(i) { const sh = this.sh; return { x: sh.x + (i - 1) * 54, y: sh.y - 210 - (i === 1 ? 24 : 0) }; }
  draw(c) {
    const sh = this.sh; if (!sh.vis) return;
    for (let i = 0; i < this.feathers; i++) { const p = this.featherPos(i), sw = Math.sin(G.t * 2 + i) * 6; c.strokeStyle = 'rgba(80,80,90,0.9)'; c.lineWidth = 2; c.beginPath(); c.moveTo(sh.x, sh.y - 70); c.quadraticCurveTo(p.x + sw, p.y + 60, p.x + sw, p.y + 40); c.stroke(); drawBalloon(c, p.x + sw, p.y, ['#ff6b6b', '#ffd43b', '#4dabf7'][i], 1); }
    for (const f of this.fall) { c.save(); c.globalAlpha = clamp(1 - f.t * 2, 0, 1); for (let k = 0; k < 8; k++) { const a = k * 0.785; c.fillStyle = '#ffffff'; c.beginPath(); c.arc(f.x + Math.cos(a) * f.t * 160, f.y - 10 + Math.sin(a) * f.t * 160, 6, 0, 7); c.fill(); } c.restore(); }
  }
}
function drawBalloon(c, x, y, col, s = 1) {
  c.save(); c.translate(x, y); c.scale(s, s);
  sphere(c, -10, -12, 40, '#ffffff', col, 'rgba(40,10,40,0.9)'); c.beginPath(); c.ellipse(0, 0, 32, 40, 0, 0, 7); c.fill();
  c.fillStyle = col; c.beginPath(); c.moveTo(-6, 42); c.lineTo(6, 42); c.lineTo(0, 36); c.fill();
  c.fillStyle = 'rgba(255,255,255,0.7)'; c.beginPath(); c.ellipse(-12, -16, 7, 12, -0.5, 0, 7); c.fill(); c.restore();
}
function drawFeather(c, x, y, a) {
  c.save(); c.translate(x, y); c.rotate(a); c.scale(1.4, 1.4);
  const g = c.createLinearGradient(0, -34, 0, 6); g.addColorStop(0, '#ff6b9d'); g.addColorStop(0.5, '#ffd43b'); g.addColorStop(1, '#4dabf7');
  c.fillStyle = g; c.strokeStyle = '#5b2a50'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 6); c.quadraticCurveTo(-14, -14, 0, -36); c.quadraticCurveTo(14, -14, 0, 6); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(0, 6); c.lineTo(0, -30); c.stroke(); c.restore();
}
// Бублик на шариках летает рядом с Искрой (или в заданной точке)
class Bee extends NPC {
  constructor(x, y, S) { super('bublik', x, y, 1); this.h = 98; this.S = S; this.fly = true; this.z = 1.5; this.follow = true; this.hx = null; }
  update(dt) {
    super.update(dt);
    const p = this.S.p; let tx, ty;
    if (this.hx != null) { tx = this.hx; ty = this.hy; }
    else { tx = p.x - 110 * (p.face || 1); ty = p.y - 70; }
    ty += Math.sin(G.t * 3 + this.ph) * 10;
    const k = 1 - Math.exp(-dt * 3); this.x += (tx - this.x) * k; this.y += (ty - this.y) * k;
    if (Math.abs(tx - this.x) > 4) this.face = tx > this.x ? 1 : -1;
    if (this.hx == null && Math.abs(p.x - this.x) < 60) this.face = p.face || 1;
  }
  draw(c) {
    // Бублик летит на связке воздушных шариков и покачивается
    const sw = Math.sin(G.t * 2.2 + this.ph) * 0.05, top = this.y - this.h;
    c.save(); c.translate(this.x, top); c.rotate(sw);
    const B = [[-34, -118, '#ff6b9d'], [0, -140, '#ffd43b'], [34, -118, '#4dabf7']];
    for (const [bx, by] of B) { c.strokeStyle = 'rgba(80,80,90,0.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(0, 18); c.quadraticCurveTo(bx * 0.6, by * 0.4, bx, by + 30); c.stroke(); }
    for (const [bx, by, col] of B) drawBalloon(c, bx, by, col, 0.72);
    c.translate(-this.x, -top); super.draw(c); c.restore();
  }
}
function drawChest(c, x, yb, s = 1, open = 1) {
  c.save(); c.translate(x, yb); c.scale(s, s);
  c.fillStyle = 'rgba(40,20,0,0.3)'; c.beginPath(); c.ellipse(0, -2, 120, 14, 0, 0, 7); c.fill();
  const body = (y, h, c0, c1) => { const g = c.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; };
  c.fillStyle = body(-110, 110, '#c0703a', '#6e3a14'); c.strokeStyle = '#3e1f08'; c.lineWidth = 5; rr(c, -110, -110, 220, 110, 14); c.fill(); c.stroke();
  c.fillStyle = '#ffcc29'; c.strokeStyle = '#8a5a00'; c.lineWidth = 3;
  for (const bx of [-80, 68]) { rr(c, bx, -110, 14, 110, 4); c.fill(); c.stroke(); }
  rr(c, -20, -80, 40, 44, 8); c.fill(); c.stroke(); c.fillStyle = '#3e1f08'; c.beginPath(); c.arc(0, -64, 6, 0, 7); c.fill(); c.fillRect(-3, -62, 6, 14);
  // крышка
  c.save(); c.translate(0, -110); c.rotate(-0.5 * open);
  c.fillStyle = body(-60, 60, '#d9844a', '#8a4a1c'); c.strokeStyle = '#3e1f08'; c.lineWidth = 5; c.beginPath(); c.moveTo(-110, 0); c.lineTo(-110, -30); c.quadraticCurveTo(0, -80, 110, -30); c.lineTo(110, 0); c.closePath(); c.fill(); c.stroke();
  c.restore();
  c.restore();
}
