'use strict';
// ===== Секретная комната после уровня: полки с монетками (r полок по c монеток), Бублик считает =====
class BonusCoin extends Ent {
  constructor(x, y, shelf) { super(x, y); this.shelf = shelf; this.got = false; this.ph = frand(0, 6); this.z = 0.5; }
  draw(c) { if (this.got) return; const b = Math.sin(G.t * 3 + this.ph) * 4; glow(c, this.x, this.y - 20 + b, 34, 'rgba(255,214,90,0.7)', 0.8); drawItem(c, 'coin', this.x, this.y - 6 + b, 34); }
}
function makeBonus(n) {
  const [R, C] = BONUS[n], next = () => goScene(() => n < LEVELS.length - 1 ? new PlayScene(n + 1) : new FinaleScene());
  // полки лесенкой: каждая на 2 клетки выше и правее предыдущей (прыжок Искры — до 3 клеток)
  const shelf = k => ({ c0: 6 + k * 4, c1: 10 + k * 4, row: 8 - 2 * k });
  const B = {
    idx: -1, rngId: 200 + n, bonus: true, noFg: true,
    build(S) {
      const W = 30 + R * 4, L = new Level(W, 12, 'day'); S.L = L; L.song = 'river'; L.bgImg = 'bonus'; L.tint = ['rgba(255,200,120,0.10)', 'rgba(120,60,20,0.10)'];
      L.ground(0, W, 10); L.spawn = { x: tc(2), y: tx(10) };
      S.coins = [];
      for (let k = 0; k < R; k++) {
        const sh = shelf(k); L.plank(sh.c0, sh.c1, sh.row);
        const w = (sh.c1 - sh.c0) * TILE, step = w / C;
        for (let i = 0; i < C; i++) S.coins.push(L.add(new BonusCoin(tx(sh.c0) + step * (i + 0.5), tx(sh.row), k)));
      }
      check(S.coins.length === R * C, `секрет: ${R} полок по ${C} = ${R * C} монеток`);
      S.bee = L.add(new Bee(tc(4), tx(8), S));
      S.exitX = tx(W - 3);
      return L;
    },
    start(S) {
      S.hud = { icon: 'coin', text: '0 из ' + R * C }; S.got = 0;
      run((function* () { G.freeze = true; yield 0.5; say(S.bee, VL.bIn(), 4); yield vwait(0.2); G.freeze = false; })());
    },
    goal(S) {
      const c = S.coins.find(o => !o.got);
      if (c) return { x: c.x, y: c.y, kind: 'coin', shelf: shelf(c.shelf) };
      return S.doneSaid ? null : { x: S.exitX, y: tx(10), kind: 'trigger' };
    },
    update(S) {
      const p = S.p;
      for (const o of S.coins) if (!o.got && !p.hidden && overlap(p, o.x - 26, o.y - 50, 52, 54)) { o.got = true; S.got++; Sound.pop(); sparkBurst(o.x, o.y - 20, 12, '#ffe066', 220); }
      S.hud.text = S.got + ' из ' + R * C;
      if (S.got === R * C && !S.doneSaid) {
        S.doneSaid = true;
        run((function* () {
          check(S.got === R * C && S.coins.every(o => o.got), 'секрет: собраны все монетки');
          S.bee.hx = S.p.x - 150; S.bee.hy = S.p.y - 10; G.freeze = true; yield 1.0; Sound.secret(); say(S.bee, VL.bDone(R, C), 5); yield vwait(0.4);
          try { const k = 'ts_plat_bonus'; const v = JSON.parse(localStorage.getItem(k) || '{}'); v[n] = R * C; localStorage.setItem(k, JSON.stringify(v)); } catch (_) { }
          B.finish(S);
        })());
      }
    },
    finish(S) { if (S.leaving) return; S.leaving = true; next(); },
    onEnter(S) { B.finish(S); },
    drawHud(S, c) {
      const w = 250, h = 70, x = G.W - 84 - G.sr - 80 - 24 - w, y = 16;
      goldButton(c, x, y, w, h, 'Дальше', 32, 0, 'green'); addButton(x, y, w, h, () => B.finish(S), 'skip');
    },
    counted() { return null; },
    avoidRects(S) { return S.coins.filter(o => !o.got).map(o => ({ x: o.x - 20, y: o.y - 44, w: 40, h: 44, counted: true })); },
    selfCheck(S) { check(S.got === S.coins.filter(o => o.got).length && S.got <= R * C, 'секрет: табличка = собранным монеткам'); },
  };
  return B;
}
