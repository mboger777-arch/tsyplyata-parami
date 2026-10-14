'use strict';
// ===== «Цыплята парами»: расписные предметы, новые раскладки и новые механики (ловля яиц, догонялки с цыплятами, шишки босса) =====
// Каждый показанный предмет считает код: MulGroup.shown растёт ровно на 1 за пойманное яйцо / пойманного цыплёнка.
const PAINTED = { egg: 'it_egg', chick: 'it_chick', duck: 'it_duck', sack: 'it_sack', ear: 'it_ear', gegg: 'it_gegg', cone: 'it_cone' };
const _paintItemTS = paintItem;
paintItem = function (c, kind, s) {
  if (kind === 'weight') kind = 'gegg';
  const im = IMG[PAINTED[kind]];
  if (im) { const k = s * 1.15 / Math.max(im.width, im.height), w = im.width * k, h = im.height * k; c.drawImage(im, -w / 2, -h, w, h); return; }
  _paintItemTS(c, kind === 'gegg' ? 'coin' : kind, s);
};
Object.assign(ML, {
  nests: { it: 'egg', sz: 34, bw: 96, gap: 18 },
  pairs: { it: 'chick', sz: 46, dx: 46, gap: 34 },
  pond: { it: 'duck', sz: 44, dx: 56, dy: 50 },
  mill: { it: 'sack', sz: 40, sw: 118, sh: 48 },
  field: { it: 'egg', sz: 38, dx: 50, dy: 46 },
});
// раскладки нового урока поверх MulGroup: nests ≈ корзинки, pairs — пары на земле, pond/field ≈ сетка, mill ≈ ступеньки
const _mgPos = MulGroup.prototype.pos, _mgW = MulGroup.prototype.width, _mgH = MulGroup.prototype.height, _mgBack = MulGroup.prototype.drawBack, _mgLab = MulGroup.prototype.labPos, _mgFront = MulGroup.prototype.drawFrontParts;
const LAYMAP = { nests: 'baskets', pond: 'grid', mill: 'steps', field: 'plums' };
function asLay(g, fn, ...a) { const l = g.lay, m = LAYMAP[l]; if (!m) return fn.apply(g, a); const P = g.P; g.lay = m; ML[m] = Object.assign({}, ML[m], P); try { return fn.apply(g, a); } finally { g.lay = l; } }
const ML0 = JSON.parse(JSON.stringify(ML));
MulGroup.prototype.pos = function (g, i) {
  const P = this.P, X = this.x + this.dx0, Y = this.y;
  if (this.lay === 'pairs') return { x: X + 30 + g * (P.dx * 2 + P.gap) + i * P.dx, y: Y - 8 };
  if (this.lay === 'nests') { const bx = X + g * (P.bw + P.gap) + P.bw / 2; return { x: bx + (i - 0.5) * 30, y: Y - 34 }; }
  return asLay(this, _mgPos, g, i);
};
MulGroup.prototype.width = function () { const P = this.P; if (this.lay === 'pairs') return 40 + this.rows * (P.dx * 2 + P.gap); return asLay(this, _mgW); };
MulGroup.prototype.height = function () { if (this.lay === 'pairs') return 110; if (this.lay === 'nests') return 110; return asLay(this, _mgH); };
MulGroup.prototype.labPos = function (g) { const P = this.P, X = this.x + this.dx0, Y = this.y; if (this.lay === 'pairs') return { x: X + 30 + g * (P.dx * 2 + P.gap) + P.dx / 2, y: Y + 26 }; if (this.lay === 'nests') return { x: X + g * (P.bw + P.gap) + P.bw / 2, y: Y + 26 }; return asLay(this, _mgLab, g); };
MulGroup.prototype.drawFrontParts = function (c) { if (this.lay === 'nests' || this.lay === 'pairs') return; return asLay(this, _mgFront, c); };
MulGroup.prototype.drawBack = function (c) {
  const P = this.P, X = this.x + this.dx0, Y = this.y;
  if (this.lay === 'nests') { for (let g = 0; g < this.rows; g++) { const bx = X + g * (P.bw + P.gap), im = IMG.it_nest; if (im) { const w = P.bw + 10, h = w * im.height / im.width; c.drawImage(im, bx - 5, Y - h * 0.8, w, h); } else { c.fillStyle = '#b07a3a'; rr(c, bx, Y - 40, P.bw, 36, 18); c.fill(); } } return; }
  if (this.lay === 'pairs') { for (let g = 0; g < this.rows; g++) { const x0 = X + 30 + g * (P.dx * 2 + P.gap) - 30; c.fillStyle = 'rgba(255,240,180,0.55)'; c.strokeStyle = 'rgba(160,110,40,0.8)'; c.lineWidth = 3; c.beginPath(); c.ellipse(x0 + 30 + P.dx / 2, Y - 4, P.dx + 14, 14, 0, 0, 7); c.fill(); c.stroke(); } return; }
  if (this.lay === 'pond') {   // вода пруда под утятами
    const R = Math.max(this.rows, this.cols), mid = this.rot > 0 && this.rot < 1, [r0, c0] = this.dims(), h = (mid ? R : r0) * P.dy + 22, w = (mid ? R : c0) * P.dx + 30;
    const gx = X + 30 - P.dx / 2 - 8, gy = Y - 2 - h, gr = c.createLinearGradient(0, gy, 0, gy + h); gr.addColorStop(0, 'rgba(110,210,255,0.92)'); gr.addColorStop(1, 'rgba(25,120,190,0.92)');
    c.fillStyle = gr; c.strokeStyle = '#7a5a2a'; c.lineWidth = 6; rr(c, gx, gy, w, h, 26); c.fill(); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,0.45)'; c.lineWidth = 2; for (let k = 0; k < 4; k++) { const yy = gy + 14 + k * (h - 24) / 3; c.beginPath(); c.moveTo(gx + 16, yy); c.quadraticCurveTo(gx + w / 2, yy + 6 * Math.sin(G.t * 2 + k), gx + w - 16, yy); c.stroke(); }
    return;
  }
  if (this.lay === 'field') { const R = this.rows; c.fillStyle = 'rgba(120,70,30,0.85)'; c.strokeStyle = '#4a2a0e'; c.lineWidth = 4; rr(c, X + 30 - P.dx / 2 - 6, Y - 4 - (R * P.dy + 18), this.cols * P.dx + 24, R * P.dy + 18, 16); c.fill(); c.stroke(); return; }
  return asLay(this, _mgBack, c);
};
// ---------- курочка на насесте и падающее яйцо ----------
class Hen extends Ent {
  constructor(x, y) { super(x, y); this.z = 1; this.lay = 0; this.ph = frand(0, 6); }
  update(dt) { this.lay = Math.max(0, this.lay - dt); }
  draw(c) {
    const im = IMG.it_hen, w = 96, sq = this.lay > 0 ? 1 + Math.sin(this.lay * 30) * 0.06 : 1 + Math.sin(G.t * 3 + this.ph) * 0.02;
    c.fillStyle = '#8a5a2b'; rr(c, this.x - 60, this.y, 120, 12, 6); c.fill();
    if (im) { const h = w * im.height / im.width; c.save(); c.translate(this.x, this.y); c.scale(1 / sq, sq); c.drawImage(im, -w / 2, -h, w, h); c.restore(); }
  }
}
class FallEgg extends Ent {
  constructor(hen, S, onCatch) { super(hen.x, hen.y - 20); this.hen = hen; this.S = S; this.onCatch = onCatch; this.t = 0; this.vy = 0; this.z = 3; this.wob = 0.9; hen.lay = 0.9; }
  update(dt) {
    this.t += dt; const p = this.S.p, gy = tx(10);
    if (this.t < this.wob) return;                 // курочка «кудахчет» — яйцо вот-вот упадёт
    this.vy = Math.min(380, this.vy + 520 * dt); this.y += this.vy * dt;
    if (!p.hidden && overlap(p, this.x - 26, this.y - 40, 52, 44) && this.y < gy - 20) { this.dead = true; Sound.pop(); sparkBurst(this.x, this.y - 20, 10, '#fff4c0', 200); this.onCatch(this); return; }
    if (this.y >= gy) { this.dead = true; puff(this.x, gy - 10, 8); Sound.bump(); this.S.eggMiss = (this.S.eggMiss || 0) + 1; this.S.eggPend = null; }
  }
  draw(c) {
    const gy = tx(10), k = clamp((this.y - this.hen.y) / (gy - this.hen.y), 0, 1);
    c.fillStyle = `rgba(40,20,0,${0.15 + 0.3 * k})`; c.beginPath(); c.ellipse(this.x, gy - 3, 14 + 16 * k, 6, 0, 0, 7); c.fill();   // тень — куда упадёт
    const wob = this.t < this.wob ? Math.sin(this.t * 40) * 0.2 : 0;
    c.save(); c.translate(this.x, this.y); c.rotate(wob); drawItem(c, 'egg', 0, 0, 34); c.restore();
  }
}
// L1: ловим яйца — ровно r·2 пойманных; упавшее яйцо курочка снесёт снова
function* catchEggs(S, st) {
  const g = st.g, m = st.m, X0 = st.X0; g.shown = 0;
  if (!S.hens) { S.hens = []; }
  const hens = [3, 6, 9].map(c => S.L.add(new Hen(tc(X0 + c) - 20, tx(6))));
  if (st.i === 0) { say(S.ment, VL.l1Catch(), 4); yield vwait(0.2); }
  G.freeze = false; S.catching = st; let pend = 0, lastMiss = 0;
  while (g.shown + pend < m.p) {
    if (!S.eggPend) {
      const h = hens[Math.floor(frand(0, hens.length))];
      S.eggPend = S.L.add(new FallEgg(h, S, egg => {
        S.eggPend = null; pend++; const idx = g.shown + pend - 1, q = g.pos(Math.floor(idx / g.cols), idx % g.cols);
        S.L.add(new FlyItem('egg', 34, egg.x, egg.y, q.x, q.y, 0.5, () => { g.shown++; pend--; Sound.count(Math.min(10, g.shown)); }, 80));
      }));
    }
    if ((S.eggMiss || 0) > lastMiss && Dialog.idle()) { lastMiss = S.eggMiss; if (lastMiss === 1) say(S.bee, VL.l1Miss(), 3); }
    yield 1 / 60;
  }
  yield () => pend === 0;
  S.catching = null; G.freeze = true;
  check(g.count() === m.p && g.shown === m.p, `яйца: поймано ровно ${m.p}`);
  for (const h of hens) { puff(h.x, h.y - 40, 8); h.dead = true; }
  if (st.i === 0) { say(S.p, VL.l1Full(), 2); yield vwait(0.2); }
}
// ---------- цыплята бегают по двору ----------
class Chick extends Ent {
  constructor(x, x0, x1, S) { super(x, tx(10)); Object.assign(this, { x0, x1, S }); this.vx = frand(-60, 60); this.hop = 0; this.t = frand(0, 3); this.z = 2; this.face = 1; }
  update(dt) {
    if (this.caught) return; this.t += dt;
    if (this.t > 1.2) { this.t = 0; this.vx = frand(-70, 70); }
    this.x = clamp(this.x + this.vx * dt, this.x0, this.x1); if (this.x <= this.x0 || this.x >= this.x1) this.vx = -this.vx;
    this.face = this.vx >= 0 ? 1 : -1; this.hop = Math.abs(Math.sin(G.t * 9 + this.x * 0.01)) * 8;
  }
  draw(c) { if (this.caught) return; c.fillStyle = 'rgba(40,20,0,0.25)'; c.beginPath(); c.ellipse(this.x, this.y - 2, 18, 5, 0, 0, 7); c.fill(); c.save(); c.translate(this.x, this.y - this.hop); c.scale(-this.face, 1); drawItem(c, 'chick', 0, 0, 46); c.restore(); }
}
function* herdChicks(S, st) {
  const g = st.g, m = st.m, X0 = st.X0; g.shown = 0;
  const x0 = tx(X0) + 40, x1 = tx(X0 + 9);
  S.chicks = Array.from({ length: m.p }, (_, k) => S.L.add(new Chick(lerp(x0, x1, (k + 0.5) / m.p), x0, x1, S)));
  check(S.chicks.length === m.p, `цыплят на дворе ровно ${m.p}`);
  if (st.i === 0) { say(S.bee, VL.l2Run(), 3); yield vwait(0.2); }
  G.freeze = false; S.herding = st; let pend = 0;
  while (g.shown + pend < m.p) {
    const p = S.p;
    for (const ch of S.chicks) if (!ch.caught && !p.hidden && overlap(p, ch.x - 28, ch.y - 50, 56, 52)) {
      ch.caught = true; pend++; const idx = g.shown + pend - 1, q = g.pos(Math.floor(idx / g.cols), idx % g.cols); Sound.pop();
      S.L.add(new FlyItem('chick', 46, ch.x, ch.y, q.x, q.y, 0.6, () => { g.shown++; pend--; Sound.count(Math.min(10, g.shown)); sparkBurst(q.x, q.y - 20, 6, '#fff3a0', 120); }, 140));
    }
    yield 1 / 60;
  }
  yield () => pend === 0;
  S.herding = null; G.freeze = true; for (const ch of S.chicks) ch.dead = true; S.chicks = [];
  check(g.count() === m.p, `цыплята: в парах ровно ${m.p}`);
  if (st.i === 0) { say(S.p, VL.l2All(), 2); yield vwait(0.2); }
}
// ---------- босс: шишки с тенью-предупреждением (не сбивают ответ, только «ой») ----------
class Cone extends Ent {
  constructor(x, S) { super(x, S.shch.y); this.S = S; this.t = 0; this.z = 3; this.tx = x; }
  update(dt) {
    this.t += dt; const gy = tx(10), p = this.S.p; if (this.t < 0.9) { this.y = this.S.shch.y + 40; this.x = lerp(this.S.shch.x, this.tx, this.t / 0.9); return; }
    this.y += 520 * dt;
    if (!p.hidden && overlap(p, this.x - 20, this.y - 30, 40, 34)) { this.dead = true; p.vy = Math.min(p.vy, -300); sparkBurst(this.x, this.y, 10, '#c08040', 200); Sound.bump(); if (!this.S.dodged) { this.S.dodged = 1; if (Dialog.idle()) say(p, VL.l5Dodge(), 2); } }
    if (this.y >= gy) { this.dead = true; dust(this.x, gy, 6); }
  }
  draw(c) { const gy = tx(10); c.fillStyle = 'rgba(80,20,0,0.35)'; c.beginPath(); c.ellipse(this.tx, gy - 3, 20, 6, 0, 0, 7); c.fill(); c.save(); c.translate(this.x, this.y); c.rotate(this.t * 5); drawItem(c, 'cone', 0, 10, 36); c.restore(); }
}
function coneTick(S, dt) {
  if (!S.boss || !S.shch.vis || !S.q || S.q.solved) return;
  S.coneT = (S.coneT || 2.5) - dt; if (S.coneT > 0) return; S.coneT = frand(2.4, 3.6);
  S.L.add(new Cone(S.p.x + frand(-140, 140), S));
}
