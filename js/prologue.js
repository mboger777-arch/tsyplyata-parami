'use strict';
// ---------- Пролог: Магазин игрушек Бублика, Щёлк уносит пять звёздочек ----------
class Chest extends Ent {
  constructor(x, y) { super(x, y); this.z = -1; this.coins = 5; }
  coinPt(i) { return { x: this.x - 84 + i * 42, y: this.y - 200 }; }
  rects() { const out = []; for (let i = 0; i < this.coins; i++) { const p = this.coinPt(i); out.push({ x: p.x - 22, y: p.y - 46, w: 44, h: 46 }); } return out; }
  draw(c) {
    // монетки-трубочки стоят в сундуке (видны над бортом), на каждой — звёздная монета
    drawChest(c, this.x, this.y, 1, 2.9);
    for (let i = 0; i < this.coins; i++) { const p = this.coinPt(i); glow(c, p.x, p.y - 22, 40, 'rgba(255,214,90,0.7)', 0.8); drawItem(c, 'weight', p.x, p.y, 40); }
  }
}
const PROLOGUE = {
  idx: -1, rngId: 99, cutscene: true,
  build(S) {
    const L = new Level(34, 12, 'day'); S.L = L; L.song = 'day'; L.bgImg = 'yard';
    L.ground(0, 34, 10);
    L.spawn = { x: tc(9), y: tx(10) };
    S.chest = L.add(new Chest(tc(17), tx(10)));
    S.arch = L.add(new NPC('bublik', tc(12) - 10, tx(10), 1)); S.mentA = L.add(new NPC('arch', tc(21), tx(10), -1)); S.mentA.alpha = 0;
    S.shch = L.add(new Shchelk(tx(40), tx(2))); S.shch.vis = false; S.shch.mode = 'arrived';
    [[3, 90], [6, 80], [27, 90], [31, 80]].forEach(([c, w]) => deco(L, 't_bush', tc(c), tx(10), w, 8));
    return L;
  },
  start(S) {
    S.weightsBase = 5; S.weightsHave = 5; S.hud = { icon: 'weights', text: '' };
    S.p.face = 1;
    S.cam.lock = fitLock(tc(8), tc(25), tx(10) - 420, 24);
    run(PROLOGUE.script(S));
  },
  script(S) {
    return (function* () {
      const A = S.arch, ch = S.chest, sh = S.shch, p = S.p;
      G.freeze = true; yield 0.8;
      say(NARR, VL.pr1(), 6); yield vwait(0.3);
      say(A, VL.pr2(), 6); yield vwait(0.3); A.pose = 'idle';
      sh.vis = true; sh.weight = false; sh.x = tx(36); sh.y = tx(2); sh.gotoSpeed = 520;
      Sound.laugh();
      for (let k = 0; k < 5; k++) {
        const pp = ch.coinPt(ch.coins - 1); sh.mode = 'goto'; sh.tx = pp.x + 20; sh.ty = pp.y - 110;
        yield () => sh.mode === 'arrived';
        if (k === 0) say(sh, VL.pr4(), 3);
        ch.coins--; S.weightsHave = ch.coins; Sound.pop(); sparkBurst(pp.x, pp.y - 20, 10, '#ffe066', 200);
        // искорки разлетаются по магазину
        for (let j = 0; j < 6; j++) spawn({ type: 'coin', x: pp.x, y: pp.y - 20, vx: frand(-420, 420), vy: frand(-760, -420), g: 1500, life: 1.1, size: 22 });
        sh.weight = true; yield 0.4;
        if (k === 0) yield vwait(0);
        sh.mode = 'goto'; sh.tx = tx(31) + k * 20; sh.ty = tx(3); yield () => sh.mode === 'arrived'; sh.weight = false;
      }
      sh.weight = true; sh.mode = 'goto'; sh.tx = tx(40); sh.ty = tx(0); Sound.laugh();
      yield 0.8;
      check(ch.coins === 0 && S.weightsHave === 0, 'звёздные монеты украдены: в сундуке 0');
      say(A, VL.pr5(), 5); yield vwait(0.3);
      say(p, VL.pr6(), 3); yield vwait(0.3);
      const M = S.mentA; puff(M.x, M.y - 70, 12); M.alpha = 1; Sound.pop(); yield 0.3;
      archSay(M, 'point', VL.pr7(), 7); yield vwait(0.3); M.pose = 'idle';
      say(NARR, VL.pr8(), 4); yield vwait(0.5);
      PROLOGUE.finish(S);
    })();
  },
  finish(S) {
    if (S.leaving) return; S.leaving = true;
    try { localStorage.setItem('ts_plat_prologue', '1'); } catch (_) { }
    goScene(() => new MapScene());
  },
  onEnter(S) { PROLOGUE.finish(S); },
  drawHud(S, c) {
    const w = 250, h = 70, x = G.W - 84 - G.sr - 80 - 24 - w, y = 16;
    goldButton(c, x, y, w, h, 'Пропустить', 32, 0, 'green');
    addButton(x, y, w, h, () => PROLOGUE.finish(S), 'skip');
  },
  update(S) { S.hud.text = S.weightsHave + ' из 5'; },
  counted() { return null; },
  avoidRects(S) { return S.chest.rects().concat([{ x: S.chest.x - 115, y: S.chest.y - 250, w: 230, h: 250 }]).map(r => ({ x: r.x - 6, y: r.y - 6, w: r.w + 12, h: r.h + 12, counted: true })); },
  selfCheck(S) { check(S.weightsHave === S.chest.coins, 'табличка = монетам в сундуке'); },
};
function prologueSeen() { try { return localStorage.getItem('ts_plat_prologue') === '1'; } catch (_) { return true; } }
