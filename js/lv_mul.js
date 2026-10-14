'use strict';
// ===== Уровни «Сад Умножения»: станции «посмотри на равные группы → ответь → вырастает мост» =====
// Все числа — из TASKS (lines.js). Каждое произведение, каждая группа и каждая надпись проверяются check().
const ST_X = [8, 52, 96], ST_GAP = [30, 36];
function mlMath(n, i) { const [r, c] = TASKS[n][i]; return { r, c, p: r * c, board: `${r} · ${c} = ?`, done: `${r} · ${c} = ${r * c}`, ans: r * c }; }
function lockBox(x0, x1, y0, y1) {
  const Z = Math.min(G.baseZoom, (G.W - 48) / (x1 - x0), (G.H - 40) / (y1 - y0));
  return { x: (x0 + x1) / 2, y: (y0 + y1) / 2, zoom: Z, make: () => lockBox(x0, x1, y0, y1) };
}
function makeML(n, cfg) {
  const D = {
    idx: n - 1, rngId: n,
    build(S) {
      const L = new Level(176, 12, cfg.bg); S.L = L; L.song = cfg.song; if (cfg.tint) L.tint = cfg.tint; L.bgImg = cfg.img;
      if (cfg.night) L.night = cfg.night;
      L.ground(0, ST_X[0] + ST_GAP[0], 10);
      for (let i = 0; i < 3; i++) { const e = ST_X[i] + ST_GAP[1], to = i < 2 ? ST_X[i + 1] + ST_GAP[0] : 176; L.ground(e, to, 10); }
      L.spawn = { x: tc(2), y: tx(10) };
      S.ment = L.add(new NPC(cfg.mentor, tc(5), tx(10), 1)); S.arch = S.ment;
      S.bee = L.add(new Bee(tc(1), tx(8), S));
      S.shch = L.add(new Shchelk(tx(180), tx(3))); S.shch.vis = false; S.shch.mode = 'arrived';
      if (n === 5) S.boss = L.add(new BossCloud(S.shch));
      L.plank(ST_X[1] + 40, ST_X[1] + 43, 5); S.bouncers.push(L.add(new Bouncer(tc(ST_X[1] + 39) - 10, tx(10), 'hay'))); S.gold = L.add(new GoldLantern(tx(ST_X[1] + 41) + 32, tx(5)));
      S.stations = ST_X.map((X0, i) => {
        const m = mlMath(n, i), st = { i, X0, m, started: false, done: false };
        const gx = tx(X0 + (cfg.gxo || 10)), y = tx(10);
        st.g = L.add(new MulGroup(cfg.lay, gx, y, m.r, m.c));
        if (cfg.lay === 'baskets') { st.cart = L.add(new Cart(st.g)); st.g.dx0 = 1400; }
        if (n === 5 || n <= 2) st.g.shown = 0;   // сливы прилетают от Щёлка
        check(st.g.x + st.g.width() < tx(X0 + ST_GAP[0]) - 60, 'предметы на берегу, не над рекой');
        check(st.g.rows * st.g.cols === m.p, 'в группе ровно r·c предметов');
        st.bridge = L.add(new Bridge(X0 + ST_GAP[0], X0 + ST_GAP[1], 10));
        return st;
      });
      const E = ST_X[2] + ST_GAP[1];
      L.plank(E + 8, E + 11, 8);
      if (n < 5) { S.flag = L.add(new Flag(tc(E + 30), tx(10), true)); S.flag.locked = true; }
      ST_X.forEach((X0, i) => { checkpoint(L, X0 + 2, 10, i > 0); checkpoint(L, X0 + ST_GAP[1] + 1, 10); });
      ST_X.forEach(X0 => ffArc(S, tx(X0 + 26) + 30, 590, tx(X0 + 37) + 30, 590, 160, 5));
      ffAt(S, [[tc(ST_X[1] + 39) - 10, 468], [tc(ST_X[1] + 39), 378], [tc(ST_X[1] + 39) + 30, 288]]);
      [[1, 80], [ST_X[0] + 28, 70], [ST_X[1] + 1, 70], [ST_X[1] + 28, 80], [ST_X[2] - 4, 80], [ST_X[2] + 28, 70], [E + 3, 80], [E + 36, 80]].forEach(([c, w]) => deco(L, 't_bush', tc(c), tx(10), w, 8));
      return L;
    },
    start(S) {
      S.weightsBase = n - 1; S.weightsHave = n - 1;
      S.hud = { icon: 'weights', text: S.weightsHave + ' из 5' };
      run((function* () {
        G.freeze = true; yield 0.5;
        archSay(S.ment, 'point', VL[`l${n}Intro`](), 6); yield vwait(0.3);
        say(S.p, VL[`l${n}Go`](), 3); yield vwait(0.2);
        S.ment.pose = 'idle'; G.freeze = false;
      })());
    },
    goal(S) {
      if (S.catching && S.eggPend) return { x: S.eggPend.x, y: tx(10), kind: 'egg' };
      if (S.catching) return null;
      if (S.herding) { const p = S.p, ch = (S.chicks || []).filter(o => !o.caught).sort((a, b) => Math.abs(a.x - p.x) - Math.abs(b.x - p.x))[0]; return ch ? { x: ch.x, y: tx(10), kind: 'chick' } : null; }
      return goalOf(S, st => tx(st.X0 + 5), tx(ST_X[2] + ST_GAP[1] + 4));
    },
    update(S) {
      const p = S.p; if (n === 5) coneTick(S, 1 / 60);
      for (const st of S.stations) if (!st.started && p.onGround && p.x > tx(st.X0 + 3) && p.x < tx(st.X0 + 14) && !(S.q && !S.q.solved) && S.stations.every(o => !o.started || o.done)) {
        st.started = true; S.cur = st; S.respawnPt = { x: tc(st.X0 + 4), y: tx(10) }; run(D.station(S, st));
      }
      S.hud.text = (S.weightsHave || 0) + ' из 5';
      const E = ST_X[2] + ST_GAP[1];
      if (!S.endStarted && S.stations[2].done && p.x >= tx(E + 4) - 32 && p.onGround) { S.endStarted = true; run(n === 5 ? D.finale(S) : D.ending(S)); }
      if (S.wp && !S.wp.got && !p.hidden && !G.freeze && Dialog.idle() && overlap(p, S.wp.x - 30, S.wp.y - 60, 60, 60)) { S.wp.got = true; weightGot(S); run((function* () { yield 0.3; say(S.p, VL[`l${n}Got`](), 3); })()); }
      if (S.flag && !S.done && !S.flag.locked && overlap(p, S.flag.x - 30, S.flag.y - 190, 60, 190)) { S.flag.on = true; S.complete(); }
    },
    lock(S, st) { const g = st.g; return fitLock(tx(st.X0) + 10, g.x + g.width() + (n >= 4 ? 230 : 30), tx(10) - Math.max(n === 5 ? 400 : 330, g.height() + 120)); },
    station(S, st) {
      return (function* () {
        const A = S.ment, m = st.m, g = st.g, B = S.bee, sh = S.shch; G.freeze = true;
        yield* puffTo(A, tc(st.X0 + 1) + 6, tx(10), 1);
        S.p.autoX = tx(st.X0 + 5); S.p.autoFace = 1;
        B.hx = tc(st.X0 + 9) - 26; B.hy = tx(10) - 120;
        S.cam.lock = D.lock(S, st); yield 0.5;
        if (cfg.pre) yield* cfg.pre(S, st);
        yield 0.9;
        check(D.shown(st) === true, 'на станции видно ровно то, что в задаче');
        G.freeze = false;
        S.ask({
          text: m.board, answer: m.ans, choices: CHOICES[n][st.i].slice().sort((x, y) => (st.i % 2 ? y - x : x - y)), row: cfg.plates ? 8 : 7, plates: !!cfg.plates, cols: [st.X0 + 3, st.X0 + 5, st.X0 + 7], speaker: A, hintSpeaker: B,
          say: VL[`l${n}Q`](), eqDone: m.done, hints: [cfg.plates ? VL.l1Sink() : null, VL[`l${n}H1`](), VL[`l${n}H2`]()].filter(Boolean),
          demo: function* () { g.hl = 3; archSay(A, 'point', VL[`l${n}D`](m.r, m.c), 7); yield 0.4; yield* countGroups(S, g); yield vwait(0.5); g.lab = 0; A.pose = 'idle'; },
          onCorrect: function* () {
            A.pose = 'cheer'; say(A, VL[`l${n}Ok`](m.r, m.c), 5); yield vwait(0.3); A.pose = 'idle';
            if (!cfg.hopCount) yield* countGroups(S, g);
            if (cfg.after) yield* cfg.after(S, st);
            S.cam.lock = fitLock(tx(st.X0 + ST_GAP[0] - 6), tx(st.X0 + ST_GAP[1] + 4), tx(10) - 330);
            B.hx = tc(st.X0 + ST_GAP[0] - 3); B.hy = tx(10) - 140;
            st.bridge.build(S.L); yield 1.4;
            if (st.i === 0) { say(B, VL.bridge(), 3); yield vwait(0.2); }
            B.hx = null; S.cam.lock = null; st.done = true;
          },
        });
      })();
    },
    shown(st) { const g = st.g, m = st.m; return g.rows === m.r && g.cols === m.c && g.count() === m.p && g.dx0 === 0; },
    ending(S) {
      return (function* () {
        const sh = S.shch, E = ST_X[2] + ST_GAP[1]; G.freeze = true;
        S.cam.lock = fitLock(tx(E + 2), tx(E + 16), tx(8) - 330);
        sh.vis = true; sh.weight = true; sh.x = tx(E + 20); sh.y = tx(3); sh.mode = 'goto'; sh.tx = tx(E + 11); sh.ty = tx(6); sh.gotoSpeed = 380;
        yield () => sh.mode === 'arrived';
        Sound.laugh(); say(sh, VL[cfg.sh1](), 3); yield vwait(0.2);
        sh.weight = false; const wp = S.L.add(new WeightPickup(tx(E + 9) + 32, tx(8))); S.wp = wp; puff(wp.x, wp.y - 20, 8); Sound.bump();
        if (cfg.sh2) { say(sh, VL[cfg.sh2](), 3); yield vwait(0.2); }
        sh.mode = 'goto'; sh.tx = tx(E + 30); sh.ty = tx(0);
        say(S.p, VL.l1Jump(), 3); yield vwait(0.2);
        S.cam.lock = null; G.freeze = false;
        yield 2; sh.vis = false;
      })();
    },
    finale(S) {
      return (function* () {
        const sh = S.shch, p = S.p, A = S.ment, E = ST_X[2] + ST_GAP[1], X = tx(E + 10); G.freeze = true;
        S.cam.lock = lockBox(X - 560, X + 460, tx(10) - 470, tx(10) + 30);
        yield* puffTo(A, X - 320, tx(10), 1);
        const bub = S.L.add(new NPC('bublik', X + 330, tx(10), -1)); puff(bub.x, bub.y - 60, 10);
        p.autoX = X - 160; p.autoFace = 1; yield () => p.autoX == null;
        S.bee.hx = X - 240; S.bee.hy = tx(10) - 260;
        sh.vis = true; sh.weight = true; sh.x = X + 600; sh.y = tx(2); sh.mode = 'goto'; sh.tx = X + 60; sh.ty = tx(10) - 300; sh.gotoSpeed = 300;
        yield () => sh.mode === 'arrived'; sh.face = -1;
        check(S.boss.feathers === 0, 'финал: у Щёлка не осталось перьев');
        say(sh, VL.l5Give(), 6); yield vwait(0.2);
        sh.weight = false; S.L.add(new FlyItem('weight', 40, sh.x, sh.y + 40, p.x, p.y - 130, 0.6, null, 60)); yield 0.7;
        S.weightsHave = 5; Sound.secret(); Sound.ura(); sparkBurst(p.x, p.y - 130, 30, '#ffe066', 380);
        check(S.weightsHave === 5, 'все пять звёздных монет вернулись');
        archSay(A, 'idle', VL.l5Forgive(), 6); yield vwait(0.2);
        S.medal = { t: 0 }; Sound.sparkle(); sparkBurst(sh.x, sh.y + 10, 24, '#ffd43b', 260);
        Sound.laugh(); say(sh, VL.l5Medal(), 3); yield vwait(0.2);
        say(bub, VL.l5Pie(), 3); yield vwait(0.2);
        S.lit = true;
        say(NARR, VL.l5Lights(), 5); yield vwait(0.6);
        G.freeze = false; S.complete();
      })();
    },
    avoidRects(S) {
      const out = [];
      for (const st of S.stations) { if (st.done) continue; out.push(...st.g.bounds()); }
      if (S.q && !S.q.solved) for (const b of S.q.blocks) if (!b.dead) out.push({ x: b.x - 44, y: b.y - 14, w: 88, h: 100 });
      return out.map(r => ({ x: r.x - 6, y: r.y - 6, w: r.w + 12, h: r.h + 12, counted: true }));
    },
    counted(S) {
      const st = S.cur; if (!st || st.done || !asking(S)) return null;
      return st.g.rects().map((o, i) => ({ kind: 'предмет ' + (i + 1), group: 'g' + o.g, r: o.r }));
    },
    countRule(S, ok) {
      const st = S.cur, out = [{ name: 'всего', visible: ok.length, expected: st.m.p }];
      for (let g = 0; g < st.m.r; g++) out.push({ name: 'группа ' + (g + 1), visible: cnt(ok, o => o.group === 'g' + g), expected: st.m.c });
      return out;
    },
    selfCheck(S) {
      const st = S.cur;
      if (st && S.board && !S.board.solved && S.q) {
        check(S.board.text === st.m.board, 'на доске — задача станции');
        check(D.shown(st), 'предметы = числам на доске');
        check(st.m.r * st.m.c === st.m.ans, 'ответ = произведение');
        check(S.q.choices.includes(st.m.ans) && new Set(S.q.choices).size === S.q.choices.length, 'ответ среди блоков, блоки разные');
      }
      if (S.boss) check(S.boss.feathers === 3 - S.stations.filter(s => s.knocked).length, 'перьев = 3 − верных ответов');
      check(S.weightsHave >= n - 1 && S.weightsHave <= n, 'табличка монет');
    },
    drawFront(S, c) {
      if (S.hop) drawSprite(c, IMG.iskra_jump, S.hop.x, S.hop.y, 114, false);
      if (S.medal) {
        const sh = S.shch; S.medal.t = Math.min(1, S.medal.t + 1 / 60); const k = easeOutBack(S.medal.t);
        c.save(); c.translate(sh.x + 4, sh.y + 22); c.scale(k, k);
        c.strokeStyle = '#c92a2a'; c.lineWidth = 5; c.beginPath(); c.moveTo(-12, -16); c.lineTo(0, 0); c.lineTo(12, -16); c.stroke();
        glow(c, 0, 8, 30, 'rgba(255,214,90,0.8)', 0.9);
        const g = c.createRadialGradient(-3, 5, 1, 0, 8, 12); g.addColorStop(0, '#fffbe0'); g.addColorStop(0.5, '#ffd43b'); g.addColorStop(1, '#a86b00');
        c.fillStyle = g; c.strokeStyle = '#5e3c00'; c.lineWidth = 2; c.beginPath(); c.arc(0, 8, 11, 0, 7); c.fill(); c.stroke(); c.restore();
      }
      if (S.lit) for (let i = 0; i < 18; i++) { const x = S.p.x - 600 + i * 70, y = S.p.y - 560 + Math.sin(i * 0.7) * 20; glow(c, x, y, 26, ['rgba(255,214,90,0.9)', 'rgba(255,135,135,0.9)', 'rgba(116,192,252,0.9)'][i % 3], 0.8 + 0.2 * Math.sin(G.t * 4 + i)); }
    },
  };
  return D;
}
// ---------- уровень 1: Курятник — ловим яйца (новая механика), ответ на плитах ----------
const LV1 = makeML(1, {
  bg: 'day', img: 'coop', song: 'day', lay: 'nests', mentor: 'arch', plates: 1, sh1: 'l1Sh1', sh2: 'l1Sh2',
  pre: function* (S, st) { yield* catchEggs(S, st); if (st.i === 0) { say(S.ment, VL.l1Plate(), 5); yield vwait(0.3); } },
});
// ---------- уровень 2: Двор — догоняем цыплят (новая механика) ----------
const LV2 = makeML(2, {
  bg: 'day', img: 'yard', song: 'day', lay: 'pairs', mentor: 'arch', sh1: 'l2Sh1', sh2: 'l1Sh2',
  pre: function* (S, st) { yield* herdChicks(S, st); },
});
// ---------- уровень 3: Зеркальный мост (ряды поворачиваются) ----------
const LV3 = makeML(3, {
  bg: 'day', img: 'pond', song: 'river', lay: 'pond', gxo: 11, mentor: 'arch', sh1: 'l3Sh1',
  pre: function* (S, st) { if (st.i === 0) { say(S.ment, VL.l3Rule(), 5); yield vwait(0.3); } },
  after: function* (S, st) {
    const g = st.g, m = st.m; g.lab = 0; Sound.sparkle();
    for (let t = 0; t <= 1.0001; t += 1 / 60) { g.rot = Math.min(1, t); yield 1 / 60; }
    g.rot = 1; const [R, C] = g.dims();
    check(R === m.c && C === m.r && g.count() === m.p, `поворот: ${m.c} · ${m.r} = ${m.p} — столько же`);
    S.board = { text: `${m.c} · ${m.r} = ${m.p}`, solved: true, t: 0 }; check(eqTrue(S.board.text), 'доска после поворота верна');
    yield* countGroups(S, g);
    say(S.ment, VL.l3Mir(m.r, m.c), 6); yield vwait(0.2);
    if (st.i === 0) { say(S.p, VL.l3Wow(), 2); yield vwait(0.2); }
    g.lab = 0;
  },
});
// ---------- уровень 4: Лестница троек (погоня за Щёлком) ----------
const LV4 = makeML(4, {
  bg: 'day', img: 'mill', song: 'river', lay: 'mill', gxo: 11, mentor: 'arch', sh1: 'l4End', hopCount: 1,
  pre: function* (S, st) {
    const sh = S.shch, g = st.g; sh.vis = true; sh.weight = true; sh.x = st.i ? tx(st.X0 - 10) : tx(st.X0 + 34); sh.y = tx(3); sh.mode = 'goto';
    sh.tx = g.x + g.width() + 110; sh.ty = Math.max(tx(10) - 340, g.y - g.height() - 20); sh.gotoSpeed = 520;
    yield () => sh.mode === 'arrived'; sh.face = -1; Sound.laugh();
    say(sh, VL[`l4Sh${st.i}`](), 3); yield vwait(0.2);
  },
  after: function* (S, st) {
    // Искра скачет по ступенькам тройками; Щёлк улетает к следующей станции
    const g = st.g, p = S.p, sh = S.shch, P = g.P; g.lab = 0;
    puff(p.x, p.y - 60, 8); p.hidden = true; S.hop = { x: p.x, y: p.y, t: 0 };
    for (let k = 0; k < g.rows; k++) {
      const x0 = S.hop.x, y0 = S.hop.y, x1 = g.x + k * P.sw + P.sw - 8, y1 = g.y - (k + 1) * P.sh;
      for (let t = 0; t <= 1; t += 1 / 24) { S.hop.x = lerp(x0, x1, t); S.hop.y = lerp(y0, y1, t) - Math.sin(t * Math.PI) * 70; yield 1 / 60; }
      S.hop.x = x1; S.hop.y = y1; g.lab = k + 1; Sound.count(Math.min(10, k + 1)); yield 0.25;
    }
    check(g.lab === g.rows && g.lab * g.cols === st.m.p, 'скачки: дошли до ' + st.m.p);
    sh.mode = 'goto'; sh.tx = st.i < 2 ? tx(ST_X[st.i + 1] + 20) : tx(ST_X[2] + ST_GAP[1] + 11); sh.ty = tx(1); Sound.laugh();
    yield 0.6; puff(S.hop.x, S.hop.y - 60, 8); S.hop = null; p.hidden = false; puff(p.x, p.y - 60, 8); g.lab = 0;
    yield 0.6; if (st.i < 2) sh.vis = false;
  },
});
// ---------- уровень 5: Щёлк на облаке (босс) ----------
const LV5 = makeML(5, {
  bg: 'day', img: 'boss', song: 'sunset', lay: 'field', mentor: 'arch', tint: ['rgba(255,150,70,0.10)', 'rgba(255,90,40,0.06)'],
  pre: function* (S, st) {
    const sh = S.shch, g = st.g; sh.vis = true; sh.weight = true;
    if (st.i === 0) { sh.x = tx(st.X0 + 34); sh.y = tx(2); }
    sh.mode = 'goto'; sh.tx = g.x + g.width() + 120; sh.ty = tx(10) - 300; sh.gotoSpeed = 480;
    yield () => sh.mode === 'arrived'; sh.face = -1; Sound.laugh();
    say(sh, VL[`l5Sh${st.i}`](), 3); yield vwait(0.1);
    // Щёлк бросает сливы — ровно r·c, по одной
    let pend = 0;
    for (let k = 0; k < st.m.p; k++) {
      const idx = g.shown + pend, q = g.pos(Math.floor(idx / g.cols), idx % g.cols); pend++;
      S.L.add(new FlyItem('egg', g.P.sz, sh.x, sh.y, q.x, q.y, 0.45, () => { g.shown++; pend--; Sound.pop(); }, 90)); yield 0.12;
    }
    yield () => pend === 0; check(g.count() === st.m.p, 'сливы: брошено ровно ' + st.m.p);
  },
  after: function* (S, st) {
    S.boss.knock(); st.knocked = true; G.shake = 0.2;
    yield 0.4; say(S.shch, VL.l5Hit(S.boss.feathers), 3); yield vwait(0.2);
    if (st.i < 2) { const sh = S.shch; sh.mode = 'goto'; sh.tx = tx(ST_X[st.i + 1] + 24); sh.ty = tx(2); }
  },
});
