/* ลอยกระทง — ฉากแม่น้ำ (canvas) กลางคืน / กลางวัน */
(function () {
  "use strict";
  const A = window.LKArt;
  const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const TAU = Math.PI * 2;

  function h01(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
    return (h >>> 0) / 4294967296;
  }
  function layer(w, h, dpr) {
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w * dpr)); c.height = Math.max(1, Math.round(h * dpr));
    const x = c.getContext("2d");
    x.setTransform(dpr, 0, 0, dpr, 0, 0);
    return [c, x];
  }

  /* ---------- สีของแต่ละช่วงเวลา ---------- */
  const PAL = {
    night: {
      sky: [[0, "#060b19"], [0.45, "#0f1832"], [0.82, "#232749"], [1, "#3d3552"]],
      trees: "#0a1020", ground: "#0a1020",
      gold: ["#e6bb6c", "#a97b46", "#4a3428"], band: "rgba(80,50,30,.6)", shade: "rgba(12,12,30,.5)",
      hall: { body: "#0c1324", roof: "#0c1324", face: "#141b31", edge: "rgba(226,178,98,.75)", lit: "#f3be6a" },
      water: [[0, "#202a47"], [0.2, "#141d34"], [1, "#080f1e"]],
      reflTint: "rgba(16,26,48,.35)", band2: "rgba(170,190,240,.022)", haze: "rgba(150,140,180,.1)",
      vig: "rgba(3,6,14,.6)", shimmer: [170, 190, 240], glowK: 1,
    },
    day: {
      sky: [[0, "#3f7fc4"], [0.45, "#79b2e3"], [0.82, "#bfdcf0"], [1, "#efe3cc"]],
      trees: "#2c5232", ground: "#3c5a34",
      gold: ["#ffe29a", "#d4a24f", "#8a6233"], band: "rgba(120,80,30,.45)", shade: "rgba(40,30,20,.18)",
      hall: { body: "#efe4cf", roof: "#a83c28", face: "#c4462f", edge: "rgba(240,196,100,.95)", lit: "#5a4630" },
      water: [[0, "#a9d0e6"], [0.18, "#6aa6cc"], [1, "#21557c"]],
      reflTint: "rgba(70,130,180,.3)", band2: "rgba(255,255,255,.05)", haze: "rgba(255,255,255,.22)",
      vig: "rgba(10,30,60,.22)", shimmer: [255, 255, 255], glowK: 0.32,
    },
  };

  /* ---------- สถาปัตยกรรมริมฝั่ง ---------- */
  function chedi(ctx, x, baseY, h, fill, band) {
    const w = h * 0.42;
    ctx.fillStyle = fill;
    ctx.fillRect(x - w * 0.78, baseY - h * 0.06, w * 1.56, h * 0.06 + 2);
    ctx.fillRect(x - w * 0.64, baseY - h * 0.11, w * 1.28, h * 0.05 + 1);
    ctx.fillRect(x - w * 0.54, baseY - h * 0.155, w * 1.08, h * 0.05);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.5, baseY - h * 0.15);
    ctx.bezierCurveTo(x - w * 0.54, baseY - h * 0.42, x - w * 0.24, baseY - h * 0.52, x - w * 0.12, baseY - h * 0.55);
    ctx.lineTo(x + w * 0.12, baseY - h * 0.55);
    ctx.bezierCurveTo(x + w * 0.24, baseY - h * 0.52, x + w * 0.54, baseY - h * 0.42, x + w * 0.5, baseY - h * 0.15);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(x - w * 0.15, baseY - h * 0.6, w * 0.3, h * 0.055);
    ctx.beginPath();
    ctx.moveTo(x - w * 0.11, baseY - h * 0.6);
    ctx.lineTo(x - w * 0.014, baseY - h * 0.965);
    ctx.lineTo(x, baseY - h);
    ctx.lineTo(x + w * 0.014, baseY - h * 0.965);
    ctx.lineTo(x + w * 0.11, baseY - h * 0.6);
    ctx.closePath(); ctx.fill();
    if (band) {
      ctx.strokeStyle = band; ctx.lineWidth = 1;
      for (let i = 0; i < 9; i++) {
        const yy = baseY - h * (0.62 + i * 0.035);
        const ww = w * 0.1 * (1 - i / 10);
        ctx.beginPath(); ctx.moveTo(x - ww, yy); ctx.lineTo(x + ww, yy); ctx.stroke();
      }
      ctx.beginPath(); ctx.moveTo(x - w * 0.5, baseY - h * 0.155); ctx.lineTo(x + w * 0.5, baseY - h * 0.155); ctx.stroke();
    }
  }

  function hall(ctx, x, baseY, w, h, c) {
    ctx.fillStyle = c.body;
    ctx.fillRect(x - w * 0.47, baseY - h * 0.34, w * 0.94, h * 0.34 + 2);
    ctx.fillStyle = c.lit;
    for (let i = -2; i <= 2; i++) {
      const dw = i === 0 ? w * 0.09 : w * 0.05, dh = i === 0 ? h * 0.2 : h * 0.12;
      ctx.globalAlpha = i === 0 ? 0.9 : 0.55;
      ctx.fillRect(x + i * w * 0.17 - dw / 2, baseY - dh - h * 0.04, dw, dh);
    }
    ctx.globalAlpha = 1;
    [[h, 0.42, 0.47], [0.86 * h, 0.5, 0.4], [0.72 * h, 0.58, 0.32]].forEach(([apexH, hw, eave], i) => {
      const ax = x, ay = baseY - apexH, ey = baseY - h * eave;
      const lx = x - w * hw, rx = x + w * hw;
      ctx.fillStyle = i === 2 ? c.face : c.roof;
      ctx.beginPath();
      ctx.moveTo(lx, ey);
      ctx.quadraticCurveTo(x - w * hw * 0.45, ay + (ey - ay) * 0.42, ax, ay);
      ctx.quadraticCurveTo(x + w * hw * 0.45, ay + (ey - ay) * 0.42, rx, ey);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = c.edge; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.moveTo(lx - 3, ey - 4);
      ctx.quadraticCurveTo(lx, ey + 1, lx + 1, ey);
      ctx.quadraticCurveTo(x - w * hw * 0.45, ay + (ey - ay) * 0.42, ax, ay);
      ctx.quadraticCurveTo(x + w * hw * 0.45, ay + (ey - ay) * 0.42, rx - 1, ey);
      ctx.quadraticCurveTo(rx, ey + 1, rx + 3, ey - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(ax, ay);
      ctx.quadraticCurveTo(ax - 1, ay - h * 0.09, ax + h * 0.045, ay - h * 0.1);
      ctx.stroke();
    });
  }

  function trees(ctx, W, horizon, rnd, color, day) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, horizon + 2);
    for (let x = 0; x <= W + 8; x += 6) {
      const y = horizon - 7 - 5 * Math.sin(x * 0.011) - 4 * Math.sin(x * 0.037 + 1.3) - rnd() * 3;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, horizon + 2); ctx.closePath(); ctx.fill();
    const blobs = [];
    for (let i = 0; i < W / 26; i++) {
      const x = rnd() * W, r = 6 + rnd() * 13, y = horizon - 8 - rnd() * 6;
      blobs.push([x, y, r]);
      ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.arc(x + r * 0.8, y + r * 0.3, r * 0.75, 0, TAU); ctx.fill();
    }
    if (day) {
      ctx.fillStyle = "rgba(120,170,100,.35)";
      blobs.forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x - r * 0.25, y - r * 0.3, r * 0.55, 0, TAU); ctx.fill(); });
      ctx.fillStyle = color;
    }
    for (let i = 0; i < Math.max(2, W / 380); i++) {
      const x = rnd() * W, hh = 34 + rnd() * 26, y0 = horizon - 8;
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x, y0); ctx.quadraticCurveTo(x + 3, y0 - hh * 0.5, x + 1, y0 - hh); ctx.stroke();
      ctx.beginPath();
      for (let j = 0; j < 9; j++) {
        const a = -Math.PI + (j / 8) * Math.PI;
        ctx.moveTo(x + 1, y0 - hh);
        ctx.quadraticCurveTo(x + 1 + Math.cos(a) * 9, y0 - hh - 6, x + 1 + Math.cos(a) * 15, y0 - hh + Math.abs(Math.sin(a)) * -4 + 6);
      }
      ctx.lineWidth = 1.6; ctx.stroke();
    }
  }

  function cloud(ctx, x, y, s) {
    ctx.fillStyle = "rgba(170,195,222,.55)";
    ctx.beginPath(); ctx.ellipse(x + 6 * s, y + 14 * s, 74 * s, 14 * s, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.93)";
    [[-46, 4, 24], [-18, -10, 32], [16, -16, 38], [50, -2, 28], [74, 8, 18], [-66, 10, 16], [0, 6, 30]].forEach(([dx, dy, r]) => {
      ctx.beginPath(); ctx.arc(x + dx * s, y + dy * s, r * s, 0, TAU); ctx.fill();
    });
  }

  /* ---------- ฉาก ---------- */
  class River {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext("2d");
      this.mode = "night";
      this.items = new Map();
      this.order = [];
      this.ripples = [];
      this.lanterns = [];
      this.sparks = [];
      this.birds = [];
      this.onPick = null;
      this.onHover = null;
      this.hover = null;
      this.mine = null;
      this.bottomInset = 0;
      this.showLabels = true;
      this.labelRects = [];
      this.focusId = null; this.focusUntil = 0;
      this.t0 = performance.now();
      this.last = this.t0;
      this.nextLantern = 0; this.nextNear = 4; this.nextFirework = 6;
      this.slow = 0;
      this.dprCap = 2;
      this.resize();
      let rt;
      window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => this.resize(), 120); });
      canvas.addEventListener("click", (e) => this.pick(e));
      canvas.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") this.hoverAt(e); });
      canvas.addEventListener("pointerleave", () => this.setHover(null));
      this.frame = this.frame.bind(this);
      requestAnimationFrame(this.frame);
    }

    setMode(mode) {
      const m = mode === "day" ? "day" : "night";
      if (m === this.mode) return;
      this.mode = m;
      this.lanterns = []; this.sparks = [];
      if (this.ready) this.prerender();
    }
    setBottomInset(px) { this.bottomInset = Math.max(0, px || 0); }

    resize() {
      const W = window.innerWidth, H = window.innerHeight;
      this.ready = false;
      this.W = W; this.H = H;
      if (W < 40 || H < 40) return;
      const dpr = Math.min(window.devicePixelRatio || 1, this.dprCap);
      this.dpr = dpr;
      this.c.width = Math.round(W * dpr); this.c.height = Math.round(H * dpr);
      this.c.style.width = W + "px"; this.c.style.height = H + "px";
      const portrait = W / H < 0.8;
      this.portrait = portrait;
      this.horizon = Math.round(H * (portrait ? 0.45 : 0.57));
      this.moon = { x: W * (portrait ? 0.78 : 0.75), y: H * (portrait ? 0.29 : 0.2), r: clamp(Math.min(W, H) * 0.06, 24, 62) };
      this.baseW = clamp(W * (portrait ? 0.32 : 0.145), 108, 220);
      this.templeX = W * (portrait ? 0.24 : 0.25);
      this.prerender();
      const rnd = A.rngFrom("stars" + W + "x" + H);
      this.stars = Array.from({ length: Math.round((W * this.horizon) / 5200) }, () => ({
        x: rnd() * W, y: Math.pow(rnd(), 1.4) * (this.horizon - 40), r: rnd() < 0.1 ? 1.4 : 0.8, p: rnd() * 7, s: 0.6 + rnd() * 2,
      }));
      this.shimmer = Array.from({ length: Math.round(W / 8) }, () => {
        const k = Math.pow(rnd(), 1.5);
        return { x: rnd() * W, k, y: this.horizon + 3 + (H - this.horizon) * k, w: 3 + k * 46, p: rnd() * 7, v: 2 + k * 7 };
      });
      this.birds = Array.from({ length: portrait ? 3 : 5 }, (_, i) => ({
        x: rnd() * W, y: this.horizon * (0.18 + rnd() * 0.4), s: 5 + rnd() * 5, v: 14 + rnd() * 16, ph: rnd() * 7,
      }));
      this.ready = true;
    }

    prerender() {
      const { W, H, dpr, horizon, moon } = this;
      const day = this.mode === "day", P = PAL[this.mode];
      const rnd = A.rngFrom("bank" + Math.round(W / 50));
      // ท้องฟ้า
      const [sky, s] = layer(W, horizon + 4, dpr);
      let g = s.createLinearGradient(0, 0, 0, horizon);
      P.sky.forEach(([o, c]) => g.addColorStop(o, c));
      s.fillStyle = g; s.fillRect(0, 0, W, horizon + 4);
      const ch0 = clamp(H * (this.portrait ? 0.12 : 0.16), 60, 170);
      if (day) {
        g = s.createRadialGradient(moon.x, moon.y, moon.r * 0.6, moon.x, moon.y, moon.r * 9);
        g.addColorStop(0, "rgba(255,248,222,.75)"); g.addColorStop(0.3, "rgba(255,244,210,.25)"); g.addColorStop(1, "rgba(255,244,210,0)");
        s.fillStyle = g; s.fillRect(0, 0, W, horizon + 4);
        g = s.createRadialGradient(moon.x, moon.y, 0, moon.x, moon.y, moon.r * 0.95);
        g.addColorStop(0, "#fffef8"); g.addColorStop(0.75, "#fff6d2"); g.addColorStop(1, "#ffe7a3");
        s.fillStyle = g; s.beginPath(); s.arc(moon.x, moon.y, moon.r * 0.95, 0, TAU); s.fill();
      } else {
        g = s.createRadialGradient(this.templeX, horizon, 0, this.templeX, horizon, W * 0.55);
        g.addColorStop(0, "rgba(246,170,90,.16)"); g.addColorStop(1, "rgba(246,170,90,0)");
        s.fillStyle = g; s.fillRect(0, 0, W, horizon + 4);
        g = s.createRadialGradient(moon.x, moon.y, moon.r * 0.8, moon.x, moon.y, moon.r * 7);
        g.addColorStop(0, "rgba(245,228,185,.22)"); g.addColorStop(0.35, "rgba(220,205,190,.07)"); g.addColorStop(1, "rgba(200,190,200,0)");
        s.fillStyle = g; s.fillRect(0, 0, W, horizon + 4);
        g = s.createRadialGradient(moon.x - moon.r * 0.3, moon.y - moon.r * 0.3, moon.r * 0.1, moon.x, moon.y, moon.r);
        g.addColorStop(0, "#fffbf0"); g.addColorStop(0.6, "#f5e8c8"); g.addColorStop(1, "#e2cc9a");
        s.fillStyle = g; s.beginPath(); s.arc(moon.x, moon.y, moon.r, 0, TAU); s.fill();
        s.save(); s.beginPath(); s.arc(moon.x, moon.y, moon.r, 0, TAU); s.clip();
        try { s.filter = "blur(" + Math.max(1, moon.r * 0.06) + "px)"; } catch (e) {}
        [[-0.3, -0.15, 0.32], [0.25, 0.2, 0.24], [0.05, -0.4, 0.16], [-0.1, 0.38, 0.2], [0.42, -0.2, 0.12]].forEach(([dx, dy, rr]) => {
          s.fillStyle = "rgba(170,150,115,.22)";
          s.beginPath(); s.arc(moon.x + dx * moon.r, moon.y + dy * moon.r, rr * moon.r, 0, TAU); s.fill();
        });
        s.restore();
        s.save();
        try { s.filter = "blur(10px)"; } catch (e) {}
        s.fillStyle = "rgba(20,24,48,.45)";
        s.beginPath(); s.ellipse(moon.x - moon.r * 1.6, moon.y + moon.r * 0.9, moon.r * 3.2, moon.r * 0.28, -0.05, 0, TAU); s.fill();
        s.fillStyle = "rgba(20,24,48,.3)";
        s.beginPath(); s.ellipse(moon.x + moon.r * 2.2, moon.y + moon.r * 1.6, moon.r * 2.6, moon.r * 0.2, 0.04, 0, TAU); s.fill();
        s.restore();
        const tg = s.createRadialGradient(this.templeX, horizon - ch0 * 0.4, 0, this.templeX, horizon - ch0 * 0.4, ch0 * 1.5);
        tg.addColorStop(0, "rgba(255,190,110,.24)"); tg.addColorStop(1, "rgba(255,190,110,0)");
        s.fillStyle = tg; s.fillRect(0, 0, W, horizon + 4);
      }
      this.sky = sky;

      // เมฆ (กลางวัน) วาดเป็นชั้นแยก เลื่อนได้ต่อเนื่อง
      this.clouds = null;
      if (day) {
        const [cl, c] = layer(W, horizon, dpr);
        const cr = A.rngFrom("clouds" + Math.round(W / 50));
        try { c.filter = "blur(3px)"; } catch (e) {}
        for (let i = 0; i < Math.max(4, Math.round(W / 260)); i++) {
          const x = cr() * W, y = horizon * (0.12 + cr() * 0.5), sc = (0.5 + cr() * 0.8) * clamp(W / 1200, 0.55, 1.2);
          [x - W, x, x + W].forEach((xx) => cloud(c, xx, y, sc));
        }
        this.clouds = cl;
      }

      // ฝั่งไกล
      const [bank, b] = layer(W, horizon + 4, dpr);
      trees(b, W, horizon, rnd, P.trees, day);
      const tx = this.templeX, ch = ch0;
      const gold = b.createLinearGradient(0, horizon - ch, 0, horizon);
      gold.addColorStop(0, P.gold[0]); gold.addColorStop(0.5, P.gold[1]); gold.addColorStop(1, P.gold[2]);
      chedi(b, tx - ch * 0.62, horizon - 4, ch * 0.46, gold, P.band);
      chedi(b, tx + ch * 1.55, horizon - 4, ch * 0.42, gold, P.band);
      chedi(b, tx, horizon - 4, ch, gold, P.band);
      const shade = b.createLinearGradient(tx - ch * 0.3, 0, tx + ch * 0.15, 0);
      shade.addColorStop(0, P.shade); shade.addColorStop(1, "rgba(0,0,0,0)");
      b.save(); b.globalCompositeOperation = "source-atop"; b.fillStyle = shade; b.fillRect(tx - ch, horizon - ch * 1.05, ch * 1.1, ch * 1.1); b.restore();
      hall(b, tx + ch * 0.82, horizon - 3, ch * 0.62, ch * 0.5, P.hall);
      b.fillStyle = P.ground; b.fillRect(0, horizon - 4, W, 8);
      this.lights = [];
      if (!day) {
        const nL = Math.round(W / 22);
        for (let i = 0; i < nL; i++) {
          const x = rnd() * W, y = horizon - 2 - rnd() * 4;
          const warm = rnd() < 0.85;
          this.lights.push({ x, y, warm, p: rnd() * 6 });
          b.globalCompositeOperation = "lighter";
          b.globalAlpha = 0.55;
          b.drawImage(A.softGlow, x - 7, y - 7, 14, 14);
          b.globalAlpha = 1; b.globalCompositeOperation = "source-over";
          b.fillStyle = warm ? "#ffd38a" : "#e9e4ff";
          b.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
        }
      }
      this.bank = bank;

      // น้ำ
      const [water, w] = layer(W, H, dpr);
      g = w.createLinearGradient(0, horizon, 0, H);
      P.water.forEach(([o, c]) => g.addColorStop(o, c));
      w.fillStyle = g; w.fillRect(0, horizon, W, H - horizon);
      const [tmp, t] = layer(W, H, dpr);
      t.save();
      try { t.filter = "blur(2.5px)"; } catch (e) {}
      t.translate(0, horizon * 2 + 2); t.scale(1, -0.82);
      t.drawImage(bank, 0, 0, W, horizon + 4);
      t.restore();
      t.globalCompositeOperation = "source-atop";
      t.fillStyle = P.reflTint; t.fillRect(0, 0, W, H);
      t.globalCompositeOperation = "destination-in";
      g = t.createLinearGradient(0, horizon, 0, horizon + ch * 1.1);
      g.addColorStop(0, day ? "rgba(0,0,0,.42)" : "rgba(0,0,0,.5)"); g.addColorStop(1, "rgba(0,0,0,0)");
      t.fillStyle = g; t.fillRect(0, 0, W, H);
      t.globalCompositeOperation = "source-over";
      t.clearRect(0, 0, W, horizon);
      w.drawImage(tmp, 0, 0, W, H);
      w.globalCompositeOperation = "lighter";
      w.globalAlpha = day ? 0.22 : 0.16;
      w.drawImage(A.softGlow, moon.x - moon.r * 2.6, horizon - (H - horizon) * 0.15, moon.r * 5.2, (H - horizon) * 1.25);
      w.globalAlpha = 1;
      this.lights.forEach((L) => {
        const len = 8 + rnd() * 18;
        const lg = w.createLinearGradient(0, horizon + 2, 0, horizon + 2 + len);
        lg.addColorStop(0, L.warm ? "rgba(255,200,120,.35)" : "rgba(220,220,255,.25)");
        lg.addColorStop(1, "rgba(255,200,120,0)");
        w.fillStyle = lg; w.fillRect(L.x - 0.8, horizon + 2, 1.6, len);
      });
      w.globalCompositeOperation = "source-over";
      for (let y = horizon + 2; y < H; y += 2 + (y - horizon) * 0.05) {
        w.fillStyle = P.band2;
        w.fillRect(0, y, W, 1);
      }
      g = w.createLinearGradient(0, horizon - H * 0.04, 0, horizon + H * 0.05);
      g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(0.5, P.haze); g.addColorStop(1, "rgba(255,255,255,0)");
      w.fillStyle = g; w.fillRect(0, horizon - H * 0.04, W, H * 0.09);
      this.water = water;

      // ขอบมืด + เกรน
      const [vig, v] = layer(W, H, 1);
      g = v.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.85);
      g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, P.vig);
      v.fillStyle = g; v.fillRect(0, 0, W, H);
      const grain = document.createElement("canvas"); grain.width = grain.height = 160;
      const gx = grain.getContext("2d"); const id = gx.createImageData(160, 160);
      const gr = A.rngFrom("grain");
      for (let i = 0; i < id.data.length; i += 4) { const n = gr() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = n; id.data[i + 3] = day ? 9 : 14; }
      gx.putImageData(id, 0, 0);
      v.fillStyle = v.createPattern(grain, "repeat"); v.fillRect(0, 0, W, H);
      this.vig = vig;
    }

    /* ---------- ข้อมูลกระทง ---------- */
    entity(rec, fresh) {
      let d = fresh ? 0.88 : 0.05 + 0.95 * Math.pow(h01(rec.id), 0.72);
      if (!fresh && this.mine && this.mine.has(rec.id)) d = Math.max(d, 0.74);
      return { rec, id: rec.id, d, seed: h01(rec.id + "s") * 100, phase: h01(rec.id + "p"), born: fresh ? performance.now() : 0, fresh, bbox: null };
    }
    resort() { this.order = [...this.items.values()].sort((a, b) => a.d - b.d); }
    set(list, max = 70) {
      const keep = new Set(list.slice(0, max).map((r) => r.id));
      for (const id of [...this.items.keys()]) if (!keep.has(id) && !this.items.get(id).fresh) this.items.delete(id);
      list.slice(0, max).forEach((r) => {
        const e = this.items.get(r.id);
        if (e) e.rec = r; else this.items.set(r.id, this.entity(r, false));
      });
      this.resort();
    }
    upsert(rec) {
      const e = this.items.get(rec.id);
      if (e) { e.rec = { ...e.rec, ...rec }; return; }
      this.items.set(rec.id, this.entity(rec, false));
      this.resort();
    }
    placeAt(e, target) {
      const { span, m, v } = this.motion(e);
      const T = Date.now() / 1000;
      e.phase = ((((target + m - T * v) % span) + span) % span) / span;
    }
    add(rec) {
      if (!this.ready) { this.items.set(rec.id, this.entity(rec, false)); this.resort(); return; }
      const e = this.entity(rec, true);
      const target = this.W * (this.portrait ? 0.5 : 0.42);
      this.placeAt(e, target);
      this.items.set(rec.id, e);
      this.resort();
      setTimeout(() => { const s = this.scaleOf(e.d); this.ripples.push({ x: target, y: this.waterYOf(e.d), s, t0: performance.now() }); }, 650);
    }
    remove(id) { if (this.items.delete(id)) this.resort(); }
    focus(id) {
      const e = this.items.get(id);
      if (!e) return false;
      if (this.ready) {
        const { span, m, v } = this.motion(e);
        const x = ((e.phase * span + (Date.now() / 1000) * v) % span) - m;
        if (x < this.W * 0.12 || x > this.W * 0.88) this.placeAt(e, this.W * 0.5);
      }
      this.focusId = id; this.focusUntil = performance.now() + 6000;
      return true;
    }

    posOf(id) {
      const e = this.items.get(id);
      if (!e || !e.bbox) return null;
      const x = (e.bbox[0] + e.bbox[2]) / 2;
      if (x < 0 || x > this.W) return null;
      return { x, y: e.bbox[1] };
    }
    scaleOf(d) { return 0.13 + 0.87 * Math.pow(d, 1.3); }
    waterYOf(d) {
      const bottom = this.H - this.bottomInset - 8;
      return this.horizon + 4 + Math.max(40, bottom - this.horizon - 4) * (0.04 + 0.88 * Math.pow(d, 1.3));
    }
    motion(e) {
      const s = this.scaleOf(e.d), wpx = this.baseW * s, m = wpx * 0.7 + 30, span = this.W + 2 * m;
      const v = (this.W / 1400) * (6 + 20 * e.d) + 1.2;
      return { s, wpx, m, span, v };
    }

    /* ---------- เลือก / ชี้ (พื้นที่แตะกว้างกว่าตัวกระทง) ---------- */
    hitAt(cx, cy) {
      for (let i = this.labelRects.length - 1; i >= 0; i--) {
        const L = this.labelRects[i], r = L.rect;
        if (cx >= r.x - 6 && cx <= r.x + r.w + 6 && cy >= r.y - 6 && cy <= r.y + r.h + 6) return L.e;
      }
      let best = null, bestScore = Infinity;
      for (const e of this.order) {
        const b = e.bbox;
        if (!b) continue;
        const bw = b[2] - b[0], bh = b[3] - b[1];
        const ex = Math.max(16, (52 - bw) / 2), ey = Math.max(16, (52 - bh) / 2);
        if (cx < b[0] - ex || cx > b[2] + ex || cy < b[1] - ey || cy > b[3] + ey) continue;
        const mx = (b[0] + b[2]) / 2, my = (b[1] + b[3]) / 2;
        const dist = Math.hypot((cx - mx) / (bw / 2 + ex), (cy - my) / (bh / 2 + ey));
        const score = dist - e.d * 0.35;
        if (score < bestScore) { bestScore = score; best = e; }
      }
      return best;
    }
    pick(ev) {
      const r = this.c.getBoundingClientRect();
      const e = this.hitAt(ev.clientX - r.left, ev.clientY - r.top);
      if (e && this.onPick) this.onPick(e.rec, { x: (e.bbox[0] + e.bbox[2]) / 2, y: e.bbox[1] });
    }
    hoverAt(ev) {
      const r = this.c.getBoundingClientRect();
      this.setHover(this.hitAt(ev.clientX - r.left, ev.clientY - r.top));
    }
    setHover(e) {
      if (this.hover === e) return;
      this.hover = e;
      this.c.style.cursor = e ? "pointer" : "default";
      if (this.onHover) this.onHover(e ? e.rec : null);
    }

    /* ---------- อนุภาค ---------- */
    spawnLantern(near) {
      const W = this.W;
      if (near) {
        this.lanterns.push({ x: W * (0.1 + Math.random() * 0.8), y: this.H + 20, vx: (Math.random() - 0.5) * 6, vy: -(16 + Math.random() * 10), size: 6 + Math.random() * 4, age: 0, life: 50, seed: Math.random() * 9, near: true });
      } else {
        this.lanterns.push({ x: Math.random() * W, y: this.horizon - 4, vx: (Math.random() - 0.3) * 3, vy: -(4 + Math.random() * 5), size: 1.2 + Math.random() * 1.8, age: 0, life: 45 + Math.random() * 30, seed: Math.random() * 9, near: false });
      }
    }
    firework() {
      const x = this.W * (0.08 + Math.random() * 0.84), y = this.horizon - this.H * (0.08 + Math.random() * 0.16);
      const cols = ["#ffd27a", "#ffb0bf", "#f5efe0", "#a9dcff"];
      const col = cols[Math.floor(Math.random() * cols.length)];
      const n = 56, sp = clamp(this.W / 14, 50, 110);
      for (let i = 0; i < n; i++) {
        const a = (i / n) * TAU + Math.random() * 0.1, v = sp * (0.7 + Math.random() * 0.35);
        this.sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, life: 1.5 + Math.random() * 0.7, col });
      }
    }

    /* ---------- วาดทุกเฟรม ---------- */
    frame(now) {
      requestAnimationFrame(this.frame);
      const dt = Math.min(0.05, (now - this.last) / 1000);
      this.last = now;
      if (dt > 0.034) this.slow++; else if (this.slow > 0) this.slow -= 0.25;
      if (this.slow > 90 && this.dprCap > 1) { this.dprCap = 1; this.slow = 0; this.resize(); }
      if (window.innerWidth !== this.W || window.innerHeight !== this.H) this.resize();
      if (!this.ready) return;
      const t = (now - this.t0) / 1000;
      const ctx = this.ctx, { W, H, horizon, moon } = this;
      const day = this.mode === "day";
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(this.sky, 0, 0, W, horizon + 4);

      if (day) {
        if (this.clouds) {
          const off = (t * 4) % W;
          ctx.drawImage(this.clouds, -off, 0, W, horizon);
          ctx.drawImage(this.clouds, W - off, 0, W, horizon);
        }
        this.drawBirds(ctx, dt, t);
      } else {
        ctx.fillStyle = "#fff";
        for (const s of this.stars) {
          const dx = s.x - moon.x, dy = s.y - moon.y;
          if (dx * dx + dy * dy < moon.r * moon.r * 4) continue;
          ctx.globalAlpha = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.s + s.p));
          ctx.fillRect(s.x, s.y, s.r, s.r);
        }
        ctx.globalAlpha = 1;
        if (!reduceMotion) {
          if (t > this.nextLantern) { this.spawnLantern(false); this.nextLantern = t + 0.9 + Math.random() * 1.4; }
          if (t > this.nextNear) { this.spawnLantern(true); this.nextNear = t + 10 + Math.random() * 12; }
          if (t > this.nextFirework) { this.firework(); this.nextFirework = t + 9 + Math.random() * 10; }
        }
        this.drawSparks(ctx, dt);
        this.drawLanterns(ctx, dt, t, false);
      }

      ctx.drawImage(this.bank, 0, 0, W, horizon + 4);
      if (!day) {
        ctx.globalCompositeOperation = "lighter";
        for (const L of this.lights) {
          const a = 0.15 + 0.2 * Math.sin(t * 1.3 + L.p);
          if (a <= 0.05) continue;
          ctx.globalAlpha = a;
          ctx.drawImage(A.softGlow, L.x - 5, L.y - 5, 10, 10);
        }
        ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      }

      ctx.drawImage(this.water, 0, 0, W, H);
      this.drawWaterLight(ctx, t, dt);
      this.drawKrathongs(ctx, t, now);
      this.drawRipples(ctx, now);
      if (!day) this.drawLanterns(ctx, dt, t, true);
      ctx.drawImage(this.vig, 0, 0, W, H);
    }

    drawBirds(ctx, dt, t) {
      ctx.strokeStyle = "rgba(30,42,62,.75)"; ctx.lineWidth = 1.4; ctx.lineCap = "round";
      for (const b of this.birds) {
        b.x += b.v * dt;
        if (b.x > this.W + 30) { b.x = -30; b.y = this.horizon * (0.18 + Math.random() * 0.4); }
        const f = Math.sin(t * 7 + b.ph) * 0.6, y = b.y + Math.sin(t * 0.8 + b.ph) * 4;
        ctx.beginPath();
        ctx.moveTo(b.x - b.s, y - b.s * f);
        ctx.quadraticCurveTo(b.x - b.s * 0.5, y - b.s * 0.5, b.x, y);
        ctx.quadraticCurveTo(b.x + b.s * 0.5, y - b.s * 0.5, b.x + b.s, y - b.s * f);
        ctx.stroke();
      }
    }

    drawWaterLight(ctx, t, dt) {
      const { W, H, horizon, moon } = this;
      const day = this.mode === "day", sh = PAL[this.mode].shimmer;
      ctx.globalCompositeOperation = "lighter";
      for (const s of this.shimmer) {
        s.x += s.v * dt;
        if (s.x > W + 50) s.x = -50;
        const a = (day ? 0.06 : 0.03) + (day ? 0.16 : 0.09) * (0.5 + 0.5 * Math.sin(t * (0.8 + s.k) + s.p));
        ctx.fillStyle = `rgba(${sh[0]},${sh[1]},${sh[2]},${a})`;
        ctx.fillRect(s.x, s.y, s.w, 1 + s.k);
      }
      const span = H - horizon;
      if (day) {
        // ประกายแดดบนผิวน้ำ
        for (let y = horizon + 3, i = 0; y < H; y += 3 + (y - horizon) * 0.03, i++) {
          const k = (y - horizon) / span;
          const width = moon.r * (0.8 + k * 3.2);
          for (let j = 0; j < 2; j++) {
            const ph = Math.sin(i * 12.9898 + j * 78.233) * 43758.5453;
            const r = ph - Math.floor(ph);
            const x = moon.x + (r - 0.5) * width * 2 + Math.sin(t * 0.7 + y * 0.05) * 6;
            const tw = 0.5 + 0.5 * Math.sin(t * 4 + i * 1.7 + j * 2.3);
            const a = 0.75 * Math.pow(1 - k, 1.1) * tw;
            if (a < 0.05) continue;
            ctx.globalAlpha = a;
            const len = 3 + k * 10;
            ctx.drawImage(A.softGlow, x - len, y - 1.5 - k * 1.5, len * 2, 3 + k * 3);
          }
        }
        ctx.globalAlpha = 1;
      } else {
        for (let y = horizon + 3; y < H; y += 3 + (y - horizon) * 0.035) {
          const k = (y - horizon) / span;
          const n = 0.5 + 0.5 * Math.sin(t * 1.3 + y * 0.083) * Math.sin(t * 0.45 + y * 0.021);
          const base = moon.r * (0.45 + k * 2.6);
          const a = 0.55 * Math.pow(1 - k, 1.35) * (0.45 + 0.55 * n);
          if (a < 0.015) continue;
          const cx = moon.x + Math.sin(t * 0.6 + y * 0.04) * moon.r * 0.3 * (0.3 + k);
          const hh = 1.4 + k * 3.2;
          const segs = n > 0.55 ? 1 : 2;
          for (let j = 0; j < segs; j++) {
            const off = segs === 1 ? 0 : (j ? 1 : -1) * base * (0.25 + 0.15 * Math.sin(t + y));
            const w = base * (segs === 1 ? 0.9 + 0.5 * n : 0.45 + 0.3 * n);
            ctx.globalAlpha = a;
            ctx.drawImage(A.softGlow, cx + off - w / 2, y - hh, w, hh * 2);
          }
        }
        ctx.globalAlpha = 1;
      }
      ctx.globalCompositeOperation = "source-over";
    }

    drawKrathongs(ctx, t, now) {
      const T = Date.now() / 1000;
      const labels = [];
      const gk = PAL[this.mode].glowK;
      for (const e of this.order) {
        const r = e.rec;
        const sp = A.sprite(r.base, r.flower, r.petal, r.tone);
        const { s, wpx, m, span, v } = this.motion(e);
        const k = wpx / sp.w;
        const x = ((e.phase * span + T * v) % span) - m;
        const yW = this.waterYOf(e.d) + Math.sin(t * 1.1 + e.seed) * 2.2 * s;
        let alpha = 1, dy = 0;
        if (e.born) {
          const age = (now - e.born) / 1000;
          if (age < 1.6) {
            const p = clamp(age / 1.1, 0, 1);
            dy = -(1 - (1 - Math.pow(1 - p, 3))) * 90 * s;
            alpha = clamp(age / 0.35, 0, 1);
          } else { e.born = 0; }
        }
        const top = yW - sp.water * k, left = x - (sp.w / 2) * k;
        e.bbox = [x - wpx * 0.42, yW - wpx * 0.62 + dy, x + wpx * 0.42, yW + wpx * 0.06];
        if (x < -m || x > this.W + m) continue;

        const fx = left + sp.flame.x * k, fy = top + sp.flame.y * k + dy;
        const flick = 0.85 + 0.15 * Math.sin(t * 13 + e.seed);
        ctx.globalCompositeOperation = "lighter";
        ctx.globalAlpha = 0.34 * alpha * flick * gk;
        ctx.drawImage(A.glow, x - 150 * s, yW - 18 * s, 300 * s, 40 * s);
        for (let i = 0; i < 11; i++) {
          const yy = yW + 8 * s + i * 7 * s;
          if (yy > this.H) break;
          const ww = (18 - i * 1.3) * s * (0.6 + 0.4 * Math.sin(t * 3 + i + e.seed));
          const xx = fx + Math.sin(t * 2.1 + i * 0.9 + e.seed) * 3.5 * s;
          const hh = Math.max(1.2, 2.4 * s);
          ctx.globalAlpha = (1 - i / 11) * 0.6 * alpha * gk;
          ctx.drawImage(A.softGlow, xx - ww * 0.75, yy - hh, ww * 1.5, hh * 2);
        }
        if (r.lucky) {
          const cyL = yW - wpx * 0.22 + dy;
          ctx.globalAlpha = 0.45 * alpha * (0.8 + 0.2 * Math.sin(t * 2 + e.seed)) * (this.mode === "day" ? 0.7 : 1);
          ctx.drawImage(A.glow, x - wpx * 0.9, cyL - wpx * 0.6, wpx * 1.8, wpx * 1.1);
        }
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = alpha * 0.9;
        ctx.drawImage(sp.refl, left, top, sp.w * k, sp.h * k);
        ctx.globalAlpha = alpha;
        ctx.save();
        ctx.translate(x, yW + dy);
        ctx.rotate(Math.sin(t * 0.9 + e.seed) * 0.03);
        ctx.drawImage(sp.canvas, -(sp.w / 2) * k, -sp.water * k, sp.w * k, sp.h * k);
        if (s > 0.42) A.smoke(ctx, sp.tips, -(sp.w / 2) * k, -sp.water * k, k, t, e.seed);
        A.flame(ctx, (sp.flame.x - sp.w / 2) * k, (sp.flame.y - sp.water) * k, k * 1.25, t, e.seed, gk < 1 ? 0.45 : 1);
        ctx.restore();
        if (r.lucky) this.sparkles(ctx, x, yW - wpx * 0.25 + dy, wpx, t, e.seed, alpha);
        labels.push([e, x, top + sp.flame.y * k + dy - 30 * k, s, alpha]);
        ctx.globalAlpha = 0.18 * alpha;
        ctx.strokeStyle = this.mode === "day" ? "#ffffff" : "#c8d6ff"; ctx.lineWidth = Math.max(0.6, s);
        ctx.beginPath(); ctx.ellipse(x, yW + 4 * s, wpx * 0.36, wpx * 0.05, 0, 0.1, Math.PI - 0.1); ctx.stroke();
        ctx.globalAlpha = 1;
        if (this.focusId === e.id && now < this.focusUntil) {
          const p = ((now / 1000) % 1.4) / 1.4;
          ctx.strokeStyle = `rgba(246,194,107,${0.9 * (1 - p)})`; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.ellipse(x, yW + 2, wpx * (0.45 + p * 0.45), wpx * (0.09 + p * 0.09), 0, 0, TAU); ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      this.drawLabels(ctx, labels, now);
    }

    sparkles(ctx, x, y, wpx, t, seed, alpha) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < 5; i++) {
        const a = t * 0.7 + seed + (i / 5) * TAU;
        const px = x + Math.cos(a) * wpx * 0.5, py = y + Math.sin(a) * wpx * 0.14 - Math.abs(Math.sin(t * 1.3 + i)) * wpx * 0.12;
        const tw = 0.5 + 0.5 * Math.sin(t * 5 + i * 2 + seed), r = Math.max(2, wpx * 0.035) * (0.6 + tw * 0.6);
        ctx.globalAlpha = alpha * (0.4 + 0.6 * tw);
        ctx.fillStyle = "#ffe39a";
        ctx.beginPath();
        ctx.moveTo(px, py - r * 2); ctx.lineTo(px + r * 0.4, py - r * 0.4); ctx.lineTo(px + r * 2, py); ctx.lineTo(px + r * 0.4, py + r * 0.4);
        ctx.lineTo(px, py + r * 2); ctx.lineTo(px - r * 0.4, py + r * 0.4); ctx.lineTo(px - r * 2, py); ctx.lineTo(px - r * 0.4, py - r * 0.4);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = alpha * 0.35 * tw;
        ctx.drawImage(A.softGlow, px - r * 4, py - r * 4, r * 8, r * 8);
      }
      ctx.restore();
    }

    /* ป้ายชื่อ: อยู่ในจอเสมอ หลบกันเองถ้าชน ใบใกล้ได้ที่ก่อน */
    drawLabels(ctx, labels, now) {
      const placed = [];
      this.labelRects = [];
      if (!this.showLabels) return;
      const maxY = this.H - this.bottomInset - 4;
      const pri = (L) => (this.mine && this.mine.has(L[0].id) ? 2 : 0) + (this.focusId === L[0].id && now < this.focusUntil ? 2 : 0) + L[3];
      labels.sort((a, b) => pri(b) - pri(a));
      for (const [e, x, y, s, alpha0] of labels) {
        const name = (e.rec.name || "").trim();
        const mine = this.mine && this.mine.has(e.id);
        if (!name || (s < 0.28 && !mine)) continue;
        if (x < 0 || x > this.W) continue;
        const fs = Math.round(Math.max(11, Math.min(15, 6 + 10 * s)));
        if (!e.label || e.label.fs !== fs || e.label.src !== name) {
          const text = name.length > 16 ? name.slice(0, 15) + "…" : name;
          ctx.font = `500 ${fs}px "IBM Plex Sans Thai Looped", system-ui, sans-serif`;
          e.label = { fs, src: name, text, w: ctx.measureText(text).width };
        }
        const L = e.label, w = L.w + 16, h = fs + 9;
        const up = h + 4;
        const tries = [[0, 0], [0, -up], [-(w / 2 + 6), 0], [w / 2 + 6, 0], [-(w / 2 + 6), -up], [w / 2 + 6, -up],
          [0, -2 * up], [0, up], [-(w + 8), 0], [w + 8, 0], [0, -3 * up]];
        let rect = null;
        for (const [dx, dy] of tries) {
          const lx = clamp(x - w / 2 + dx, 6, this.W - w - 6), ly = clamp(y - h + dy, 6, maxY - h);
          const hit = placed.some((r) => lx < r.x + r.w + 3 && lx + w + 3 > r.x && ly < r.y + r.h + 2 && ly + h + 2 > r.y);
          if (!hit) { rect = { x: lx, y: ly, w, h, moved: dx !== 0 || dy !== 0 }; break; }
        }
        if (!rect) {
          const focusNow = this.focusId === e.id && now < this.focusUntil;
          if (!mine && !focusNow) continue;
          rect = { x: clamp(x - w / 2, 6, this.W - w - 6), y: clamp(y - h, 6, maxY - h), w, h, moved: false };
        }
        placed.push(rect);
        this.labelRects.push({ e, rect });
        const edge = clamp(Math.min(x, this.W - x) / 50, 0, 1);
        const a = alpha0 * edge * (0.55 + 0.45 * Math.min(1, (s - 0.28) / 0.5));
        const focus = this.focusId === e.id && now < this.focusUntil;
        ctx.globalAlpha = Math.max(a, mine ? 0.85 * edge : 0);
        if (rect.moved) {
          ctx.strokeStyle = "rgba(243,233,210,.35)"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(rect.x + rect.w / 2, rect.y + rect.h); ctx.lineTo(x, y + 4); ctx.stroke();
        }
        ctx.fillStyle = mine || focus ? "rgba(246,194,107,.94)" : "rgba(6,11,24,.62)";
        ctx.beginPath(); ctx.roundRect(rect.x, rect.y, rect.w, rect.h, rect.h / 2); ctx.fill();
        if (!mine && !focus) { ctx.strokeStyle = e.rec.lucky ? "rgba(246,194,107,.85)" : "rgba(243,233,210,.16)"; ctx.lineWidth = e.rec.lucky ? 1.5 : 1; ctx.stroke(); }
        if (mine) {
          ctx.beginPath();
          ctx.moveTo(rect.x + rect.w / 2 - 5, rect.y + rect.h - 0.5); ctx.lineTo(rect.x + rect.w / 2 + 5, rect.y + rect.h - 0.5); ctx.lineTo(rect.x + rect.w / 2, rect.y + rect.h + 6);
          ctx.closePath(); ctx.fill();
        }
        ctx.font = `500 ${L.fs}px "IBM Plex Sans Thai Looped", system-ui, sans-serif`;
        ctx.fillStyle = mine || focus ? "#1b1f33" : "#f3e9d2";
        ctx.textBaseline = "middle"; ctx.textAlign = "left";
        ctx.fillText(L.text, rect.x + 8, rect.y + rect.h / 2 + 1);
        ctx.globalAlpha = 1;
      }
    }

    drawRipples(ctx, now) {
      this.ripples = this.ripples.filter((r) => (now - r.t0) / 1000 < 2.8);
      for (const r of this.ripples) {
        const age = (now - r.t0) / 1000;
        for (let i = 0; i < 3; i++) {
          const a = age - i * 0.35;
          if (a <= 0) continue;
          const rx = (16 + a * 80) * r.s, al = Math.max(0, 0.5 * (1 - a / 2.4));
          ctx.strokeStyle = `rgba(215,228,255,${al})`; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.ellipse(r.x, r.y + 4 * r.s, rx * 1.4, rx * 0.24, 0, 0, TAU); ctx.stroke();
        }
      }
    }

    drawLanterns(ctx, dt, t, nearPass) {
      ctx.globalCompositeOperation = "lighter";
      for (const L of this.lanterns) {
        if (L.near !== nearPass) continue;
        L.age += dt;
        L.x += (L.vx + Math.sin(t * 0.5 + L.seed) * (L.near ? 6 : 2)) * dt;
        L.y += L.vy * dt;
        const life = L.age / L.life;
        const fade = Math.min(1, L.age / 2) * (1 - life);
        const sz = L.size * (L.near ? 1 - life * 0.6 : 1 - life * 0.5);
        const fl = 0.85 + 0.15 * Math.sin(t * 9 + L.seed * 3);
        ctx.globalAlpha = 0.7 * fade * fl;
        ctx.drawImage(A.softGlow, L.x - sz * 5, L.y - sz * 5, sz * 10, sz * 10);
        if (L.near && sz > 3) {
          ctx.globalCompositeOperation = "source-over";
          ctx.globalAlpha = fade;
          const g = ctx.createLinearGradient(0, L.y - sz, 0, L.y + sz);
          g.addColorStop(0, "#ffcf87"); g.addColorStop(1, "#f08a3c");
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.moveTo(L.x - sz * 0.75, L.y - sz);
          ctx.lineTo(L.x + sz * 0.75, L.y - sz);
          ctx.lineTo(L.x + sz * 0.55, L.y + sz);
          ctx.lineTo(L.x - sz * 0.55, L.y + sz);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "rgba(255,250,220,.9)";
          ctx.fillRect(L.x - sz * 0.25, L.y + sz * 0.45, sz * 0.5, sz * 0.4);
          ctx.globalCompositeOperation = "lighter";
        } else {
          ctx.globalAlpha = fade;
          ctx.fillStyle = "#ffd9a0";
          ctx.fillRect(L.x - sz * 0.4, L.y - sz * 0.5, sz * 0.8, sz);
        }
      }
      this.lanterns = this.lanterns.filter((L) => L.age < L.life && L.y > -40);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }

    drawSparks(ctx, dt) {
      if (!this.sparks.length) return;
      ctx.globalCompositeOperation = "lighter";
      for (const p of this.sparks) {
        p.age += dt;
        p.px = p.x; p.py = p.y;
        p.vx *= 0.985; p.vy = p.vy * 0.985 + 26 * dt;
        p.x += p.vx * dt; p.y += p.vy * dt;
        const a = Math.max(0, 1 - p.age / p.life);
        ctx.globalAlpha = a * 0.85;
        ctx.strokeStyle = p.col; ctx.lineWidth = 1.3;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
      }
      this.sparks = this.sparks.filter((p) => p.age < p.life);
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    }
  }

  /* ---------- พรีวิวในหน้าประดิษฐ์ ---------- */
  River.preview = function (canvas, rec, t) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const wl = h * 0.7;
    let g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0d1530"); g.addColorStop(0.45, "#1b2240"); g.addColorStop(0.46, "#1a2342"); g.addColorStop(1, "#08101f");
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "lighter";
    for (let y = wl * 0.62; y < h; y += 3 + (y - wl * 0.6) * 0.05) {
      const a = 0.05 + 0.05 * Math.sin(t * 1.5 + y * 0.2);
      ctx.fillStyle = `rgba(170,190,240,${a})`;
      ctx.fillRect(w * 0.1 + Math.sin(t + y) * 8, y, w * 0.8, 1);
    }
    const sp = A.sprite(rec.base, rec.flower, rec.petal, rec.tone);
    const k = Math.min((w * 0.62) / sp.w, (h * 0.95) / sp.h);
    const x = w / 2, yW = wl + Math.sin(t * 1.2) * 2;
    ctx.globalAlpha = 0.4;
    ctx.drawImage(A.glow, x - sp.w * k * 0.8, yW - 22 * k * 2, sp.w * k * 1.6, 80 * k);
    for (let i = 0; i < 10; i++) {
      ctx.globalAlpha = (1 - i / 10) * 0.55;
      const ww = (22 - i * 1.6) * k * 2.6 * (0.6 + 0.4 * Math.sin(t * 3 + i));
      ctx.drawImage(A.softGlow, x - ww / 2 + Math.sin(t * 2 + i) * 4, yW + 12 * k * 2 + i * 9 * k * 2 - 3, ww, 6);
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 0.9;
    ctx.drawImage(sp.refl, x - (sp.w / 2) * k, yW - sp.water * k, sp.w * k, sp.h * k);
    ctx.globalAlpha = 1;
    ctx.save();
    ctx.translate(x, yW); ctx.rotate(Math.sin(t * 0.9) * 0.025);
    ctx.drawImage(sp.canvas, -(sp.w / 2) * k, -sp.water * k, sp.w * k, sp.h * k);
    A.smoke(ctx, sp.tips, -(sp.w / 2) * k, -sp.water * k, k, t, 2);
    A.flame(ctx, (sp.flame.x - sp.w / 2) * k, (sp.flame.y - sp.water) * k, k * 1.2, t, 2);
    ctx.restore();
  };

  window.LKRiver = River;
})();
