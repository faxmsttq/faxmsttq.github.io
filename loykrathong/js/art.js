/* ลอยกระทง — งานวาดกระทง (canvas, วาดครั้งเดียวแล้วเก็บเป็น sprite) */
(function () {
  "use strict";

  const BASES = {
    banana:  { name: "ใบตอง",       note: "หยวกกล้วย พับกลีบใบตอง", meaning: "ความอุดมสมบูรณ์ งอกงามไม่สิ้นสุด", bless: "ชีวิตอุดมสมบูรณ์งอกงาม" },
    lotus:   { name: "กลีบบัว",     note: "กลีบบัวซ้อนสามชั้น",     meaning: "ความบริสุทธิ์ และปัญญาที่เบ่งบาน", bless: "จิตใจบริสุทธิ์ ปัญญาเบ่งบาน" },
    bread:   { name: "ขนมปัง",      note: "ปลากินได้ ไม่เป็นขยะ",   meaning: "ความเมตตา แบ่งปันให้สัตว์น้ำ",   bless: "มีใจเมตตา เผื่อแผ่ผู้อื่น" },
    coconut: { name: "กะลามะพร้าว", note: "ลอยได้นาน ย่อยสลายเอง", meaning: "ความมั่นคง อดทนฝ่าทุกกระแส",    bless: "ใจมั่นคง ฝ่าทุกกระแสได้" },
  };
  const PETALS = {
    phanom:     { name: "พนมมือ",     note: "กลีบแหลมเหมือนมือไหว้", meaning: "ความนอบน้อม และการขอขมาพระแม่คงคา", bless: "ด้วยใจนอบน้อม" },
    kulap:      { name: "กุหลาบ",     note: "กลีบมน ม้วนปลาย",       meaning: "ความรักและความอ่อนโยน",            bless: "ด้วยความรักอ่อนโยน" },
    lebmuenang: { name: "เล็บมือนาง", note: "กลีบเรียวยาว ปลายแหลม", meaning: "ความประณีต ใส่ใจทุกรายละเอียด",     bless: "ด้วยความประณีตใส่ใจ" },
    phaka:      { name: "ผกาภิรมย์",  note: "กลีบซ้อนสองชั้น",        meaning: "ความสุขที่เบ่งบานซ้อนกันหลายชั้น",   bless: "พร้อมความสุขหลายชั้น" },
  };
  const TONES = {
    natural: { name: "ธรรมชาติ", sw: "#3f8a4a", swLotus: "#e58fa8", meaning: "ความเรียบง่ายที่งดงาม", bless: "เรียบง่ายแต่งดงาม" },
    pandan:  { name: "ใบเตย",    sw: "#5cc45f", swLotus: "#9fd08a", meaning: "ความสดชื่น มีชีวิตชีวา", bless: "สดชื่นทุกวัน" },
    gold:    { name: "ทองคำ",    sw: "#d9a63e", swLotus: "#d9a63e", meaning: "ความรุ่งเรืองมั่งคั่ง",  bless: "รุ่งเรืองดั่งทอง" },
    pink:    { name: "บานเย็น",  sw: "#d6589b", swLotus: "#d6589b", meaning: "ความสดใสร่าเริง",        bless: "สดใสร่าเริง" },
    pearl:   { name: "ขาวมุก",   sw: "#efe9dc", swLotus: "#f3efe6", meaning: "ความใสสะอาดบริสุทธิ์",   bless: "ใสสะอาดดั่งไข่มุก" },
  };
  const FLOWERS = {
    marigold: { name: "ดาวเรือง", meaning: "ความเจริญรุ่งเรือง",                bless: "เจริญรุ่งเรืองยิ่งขึ้น" },
    rose:     { name: "กุหลาบ",   meaning: "ความรักและความปรารถนาดี",           bless: "สมหวังในความรัก" },
    jasmine:  { name: "มะลิ",     meaning: "ความบริสุทธิ์ และความกตัญญู",        bless: "มีใจบริสุทธิ์ กตัญญูรู้คุณ" },
    orchid:   { name: "กล้วยไม้", meaning: "ความสง่างาม และความสำเร็จ",          bless: "สำเร็จอย่างสง่างาม" },
    lotus:    { name: "บัวตูม",   meaning: "ความศรัทธา และความหวังที่กำลังเบ่งบาน", bless: "ความหวังเบ่งบานดั่งบัวพ้นน้ำ" },
  };
  function meaningOf(rec) {
    const b = BASES[rec.base] || BASES.banana, p = PETALS[rec.petal] || PETALS.phanom;
    const t = TONES[rec.tone] || TONES.natural, f = FLOWERS[rec.flower] || FLOWERS.marigold;
    return {
      parts: [
        { label: "ฐาน" + b.name, text: b.meaning },
        { label: "กลีบ" + p.name, text: p.meaning },
        { label: "สี" + t.name, text: t.meaning },
        { label: "ดอก" + f.name, text: f.meaning },
      ],
      title: `กระทง${b.name} กลีบ${p.name} สี${t.name} ประดับ${f.name}`,
      text: `ขอให้${b.bless} ${p.bless} ${t.bless} และ${f.bless}`,
    };
  }

  const SW = 400, SH = 300, WATER = 250, RES = 2;

  function rngFrom(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    let a = h >>> 0;
    return function () {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h) { this.rect(x, y, w, h); };
  }
  const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

  /* ---------- กลีบ / ใบพับ ---------- */
  function fold(ctx, px, py, w, h, lean, back, palette) {
    const tx = px + lean, ty = py - h;
    const [hue, sat, lDark, lLight] = palette(back);
    // ซีกซ้าย
    let g = ctx.createLinearGradient(px, py, tx, ty);
    g.addColorStop(0, hsl(hue, sat, lDark - 8));
    g.addColorStop(1, hsl(hue - 6, sat, lDark + 6));
    ctx.beginPath();
    ctx.moveTo(px - w / 2, py);
    ctx.quadraticCurveTo(px - w * 0.42, py - h * 0.5, tx, ty);
    ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    // ซีกขวา
    g = ctx.createLinearGradient(px, py, tx, ty);
    g.addColorStop(0, hsl(hue, sat, lLight - 8));
    g.addColorStop(1, hsl(hue - 8, sat - 6, lLight + 8));
    ctx.beginPath();
    ctx.moveTo(px + w / 2, py);
    ctx.quadraticCurveTo(px + w * 0.42, py - h * 0.5, tx, ty);
    ctx.lineTo(px, py);
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    // เส้นขอบ + สันพับ
    ctx.beginPath();
    ctx.moveTo(px - w / 2, py);
    ctx.quadraticCurveTo(px - w * 0.42, py - h * 0.5, tx, ty);
    ctx.quadraticCurveTo(px + w * 0.42, py - h * 0.5, px + w / 2, py);
    ctx.strokeStyle = hsl(hue, sat, 10, 0.55); ctx.lineWidth = 0.9; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px, py - 1); ctx.lineTo(tx, ty + 2);
    ctx.strokeStyle = hsl(hue - 20, 50, 80, back ? 0.35 : 0.22); ctx.lineWidth = 0.8; ctx.stroke();
  }

  function petal(ctx, px, py, w, h, lean, back, base, tip) {
    const tx = px + lean, ty = py - h;
    const g = ctx.createLinearGradient(px, py, tx, ty);
    g.addColorStop(0, back ? base[1] : base[0]);
    g.addColorStop(0.55, back ? base[2] : base[1]);
    g.addColorStop(1, tip);
    ctx.beginPath();
    ctx.moveTo(px - w * 0.18, py);
    ctx.bezierCurveTo(px - w * 0.75, py - h * 0.35, px - w * 0.35, py - h * 0.85, tx, ty);
    ctx.bezierCurveTo(px + w * 0.35, py - h * 0.85, px + w * 0.75, py - h * 0.35, px + w * 0.18, py);
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    ctx.strokeStyle = "rgba(120,30,60,.35)"; ctx.lineWidth = 0.8; ctx.stroke();
    ctx.beginPath();
    for (let k = -1; k <= 1; k++) {
      ctx.moveTo(px + k * w * 0.12, py - 2);
      ctx.quadraticCurveTo(px + k * w * 0.2, py - h * 0.5, tx + k * 1.5, ty + h * 0.12);
    }
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 0.7; ctx.stroke();
  }

  function roseFold(ctx, px, py, w, h, lean, back, palette) {
    const [hue, sat, lD, lL] = palette(back);
    const tx = px + lean * 0.8, ty = py - h * 0.9;
    const outline = () => {
      ctx.beginPath();
      ctx.moveTo(px - w * 0.5, py);
      ctx.bezierCurveTo(px - w * 0.66, py - h * 0.62, tx - w * 0.42, ty - h * 0.06, tx, ty);
      ctx.bezierCurveTo(tx + w * 0.42, ty - h * 0.06, px + w * 0.66, py - h * 0.62, px + w * 0.5, py);
      ctx.closePath();
    };
    let g = ctx.createLinearGradient(px, py, tx, ty);
    g.addColorStop(0, hsl(hue, sat, lD - 8)); g.addColorStop(1, hsl(hue - 6, sat, lD + 8));
    outline(); ctx.fillStyle = g; ctx.fill();
    ctx.save(); outline(); ctx.clip();
    g = ctx.createLinearGradient(px, py, tx, ty);
    g.addColorStop(0, hsl(hue, sat, lL - 8)); g.addColorStop(1, hsl(hue - 8, sat - 6, lL + 10));
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.moveTo(px, py + 2); ctx.lineTo(tx, ty - 6); ctx.lineTo(px + w, ty - 6); ctx.lineTo(px + w, py + 2); ctx.closePath(); ctx.fill();
    ctx.restore();
    outline(); ctx.strokeStyle = hsl(hue, sat, 10, 0.5); ctx.lineWidth = 0.9; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(tx, ty + h * 0.1, w * 0.26, h * 0.08, 0, Math.PI * 1.05, Math.PI * 1.95);
    ctx.strokeStyle = hsl(hue - 15, 45, Math.min(96, lL + 26), 0.75); ctx.lineWidth = 1.4; ctx.stroke();
  }
  const lighter = (palette, k) => (back) => { const [a, b, c, d] = palette(back); return [a, b, Math.min(94, c + k), Math.min(96, d + k)]; };
  function foldStyled(ctx, f, style, palette) {
    if (style === "kulap") return roseFold(ctx, f.px, f.py, f.w * 1.08, f.h * 0.92, f.lean, f.back, palette);
    if (style === "lebmuenang") {
      fold(ctx, f.px, f.py, f.w * 0.62, f.h * 1.24, f.lean * 1.15, f.back, palette);
      return;
    }
    fold(ctx, f.px, f.py, f.w, f.h, f.lean, f.back, palette);
    if (style === "phaka") fold(ctx, f.px, f.py - 1, f.w * 0.55, f.h * 0.68, f.lean * 0.7, f.back, lighter(palette, 16));
  }
  function lotusPetal(ctx, f, style, L) {
    const tip = f.back ? L[2] : L[1];
    if (style === "kulap") {
      petal(ctx, f.px, f.py, f.w * 1.4, f.h * 0.84, f.lean * 0.7, f.back, L[0], tip);
      ctx.beginPath(); ctx.ellipse(f.px + f.lean * 0.7, f.py - f.h * 0.72, f.w * 0.3, f.h * 0.06, 0, Math.PI * 1.05, Math.PI * 1.95);
      ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.3; ctx.stroke();
      return;
    }
    if (style === "lebmuenang") return petal(ctx, f.px, f.py, f.w * 0.82, f.h * 1.14, f.lean * 0.9, f.back, L[0], tip);
    petal(ctx, f.px, f.py, f.w * 1.15, f.h, f.lean * 0.8, f.back, L[0], tip);
    if (style === "phaka") petal(ctx, f.px, f.py - 1, f.w * 0.62, f.h * 0.64, f.lean * 0.55, f.back, [L[0][2], L[0][2], "#ffffff"], L[2]);
  }

  function ring(tiers, cx, drawOne) {
    const items = [];
    tiers.forEach((t, ti) => {
      for (let i = 0; i < t.n; i++) {
        const a = (i / t.n) * Math.PI * 2 + (ti % 2 ? Math.PI / t.n : 0);
        const px = cx + Math.cos(a) * t.rx, py = t.by + Math.sin(a) * t.ry;
        const proj = 0.38 + 0.62 * Math.abs(Math.sin(a));
        const w = ((Math.PI * 2 * t.rx) / t.n) * 1.05 * proj;
        items.push({ a, px, py, w, h: t.h, lean: Math.cos(a) * t.h * 0.32, back: Math.sin(a) < 0, ti });
      }
    });
    items.sort((p, q) => p.py - q.py);
    items.forEach(drawOne);
    return items;
  }

  /* ---------- ดอกไม้ ---------- */
  function marigold(ctx, x, y, r, rnd) {
    ctx.fillStyle = hsl(24, 80, 22);
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.15, r * 0.95, r * 0.75, 0, 0, Math.PI * 2); ctx.fill();
    [1, 0.78, 0.56, 0.34].forEach((L, li) => {
      const n = Math.round(13 * L) + 6;
      for (let j = 0; j < n; j++) {
        const a = (j / n) * Math.PI * 2 + rnd() * 0.5;
        const rr = r * L * 0.72;
        const ex = x + Math.cos(a) * rr, ey = y + Math.sin(a) * rr * 0.72 - li * r * 0.12;
        ctx.fillStyle = hsl(28 + rnd() * 12, 92, 40 + li * 7 + rnd() * 6);
        ctx.beginPath();
        ctx.ellipse(ex, ey, r * 0.3 * L + 1.4, r * 0.2 * L + 1.1, a, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    ctx.fillStyle = "rgba(255,230,150,.35)";
    ctx.beginPath(); ctx.ellipse(x - r * 0.2, y - r * 0.35, r * 0.25, r * 0.15, -0.4, 0, Math.PI * 2); ctx.fill();
  }
  function rose(ctx, x, y, r, rnd) {
    ctx.fillStyle = "#5c0a16";
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.1, r, r * 0.8, 0, 0, Math.PI * 2); ctx.fill();
    for (let k = 0; k < 6; k++) {
      const rr = r * (1 - k * 0.15);
      const ox = Math.cos(k * 2.1 + rnd()) * r * 0.08, oy = Math.sin(k * 2.1) * r * 0.06 - k * r * 0.05;
      ctx.fillStyle = k % 2 ? "#a3172b" : "#c22a3e";
      ctx.beginPath(); ctx.ellipse(x + ox, y + oy, rr, rr * 0.78, k * 0.6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(255,140,150,.45)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(x + ox, y + oy, rr * 0.92, rr * 0.7, k * 0.6, Math.PI * 1.05, Math.PI * 1.85); ctx.stroke();
    }
    ctx.fillStyle = "#4a0812";
    ctx.beginPath(); ctx.ellipse(x, y - r * 0.28, r * 0.14, r * 0.1, 0, 0, Math.PI * 2); ctx.fill();
  }
  function blossom(ctx, x, y, r, petals, colA, colB, center, rot) {
    for (let i = 0; i < petals; i++) {
      const a = rot + (i / petals) * Math.PI * 2;
      ctx.fillStyle = i % 2 ? colA : colB;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * r * 0.55, y + Math.sin(a) * r * 0.42, r * 0.55, r * 0.32, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = center;
    ctx.beginPath(); ctx.arc(x, y, r * 0.2, 0, Math.PI * 2); ctx.fill();
  }
  function jasmine(ctx, x, y, r, rnd) {
    ctx.fillStyle = "rgba(40,70,40,.8)";
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.25, r * 0.9, r * 0.55, 0, 0, Math.PI * 2); ctx.fill();
    const pts = [[-0.45, 0.1], [0.45, 0.12], [0, -0.3], [-0.1, 0.35], [0.3, -0.05]];
    pts.forEach(([dx, dy], i) => {
      const bx = x + dx * r, by = y + dy * r;
      if (i === 4) {
        ctx.fillStyle = "#f4efe0";
        ctx.beginPath(); ctx.ellipse(bx, by, r * 0.16, r * 0.26, 0.3, 0, Math.PI * 2); ctx.fill();
      } else {
        blossom(ctx, bx, by, r * 0.48, 5, "#fbf8ee", "#ece6d6", "#e2c36a", rnd() * 3);
      }
    });
  }
  function orchid(ctx, x, y, r, rnd) {
    const rot = -Math.PI / 2 + (rnd() - 0.5) * 0.4;
    for (let i = 0; i < 5; i++) {
      const a = rot + (i / 5) * Math.PI * 2;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, "#f6e3fb"); g.addColorStop(0.5, "#c47ad9"); g.addColorStop(1, "#8b3aa8");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.4, r * (i % 2 ? 0.52 : 0.42), r * 0.3, a, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#5e1477";
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.12, r * 0.24, r * 0.2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#ffe08a";
    ctx.beginPath(); ctx.arc(x, y - r * 0.02, r * 0.08, 0, Math.PI * 2); ctx.fill();
  }
  function lotusBud(ctx, x, y, r) {
    ctx.fillStyle = "#3c6b3a";
    ctx.beginPath(); ctx.ellipse(x, y + r * 0.35, r * 0.75, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createLinearGradient(x, y + r * 0.4, x, y - r * 1.4);
    g.addColorStop(0, "#f8d3dc"); g.addColorStop(0.6, "#ee95ab"); g.addColorStop(1, "#c94a6d");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.35);
    ctx.bezierCurveTo(x - r * 0.25, y - r * 0.9, x - r * 0.75, y - r * 0.3, x - r * 0.45, y + r * 0.3);
    ctx.quadraticCurveTo(x, y + r * 0.5, x + r * 0.45, y + r * 0.3);
    ctx.bezierCurveTo(x + r * 0.75, y - r * 0.3, x + r * 0.25, y - r * 0.9, x, y - r * 1.35);
    ctx.fill();
    ctx.strokeStyle = "rgba(150,40,70,.45)"; ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(x, y + r * 0.4); ctx.quadraticCurveTo(x - r * 0.15, y - r * 0.5, x, y - r * 1.3);
    ctx.moveTo(x - r * 0.3, y + r * 0.3); ctx.quadraticCurveTo(x - r * 0.5, y - r * 0.3, x - r * 0.08, y - r * 1.05);
    ctx.moveTo(x + r * 0.3, y + r * 0.3); ctx.quadraticCurveTo(x + r * 0.5, y - r * 0.3, x + r * 0.08, y - r * 1.05);
    ctx.stroke();
  }
  function flower(ctx, type, x, y, r, rnd) {
    if (type === "rose") rose(ctx, x, y, r, rnd);
    else if (type === "jasmine") jasmine(ctx, x, y, r, rnd);
    else if (type === "orchid") orchid(ctx, x, y, r, rnd);
    else if (type === "lotus") lotusBud(ctx, x, y, r * 0.85);
    else marigold(ctx, x, y, r, rnd);
  }

  /* ---------- เทียน ธูป ---------- */
  function candleAndIncense(ctx, cx, baseY) {
    const top = baseY - 62;
    const sticks = [[-36, -82], [-12, -92], [30, -86]];
    const tips = [];
    sticks.forEach(([dx, dy]) => {
      const x0 = cx + dx * 0.15, y0 = baseY + 2, x1 = cx + dx, y1 = baseY + dy;
      ctx.strokeStyle = "#6b241a"; ctx.lineWidth = 2.4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = "#c9a26b"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (x1 - x0) * 0.28, y0 + (y1 - y0) * 0.28); ctx.stroke();
      ctx.fillStyle = "#ff6b3d";
      ctx.beginPath(); ctx.arc(x1, y1, 2.2, 0, Math.PI * 2); ctx.fill();
      tips.push({ x: x1, y: y1 });
    });
    const g = ctx.createLinearGradient(cx - 8, 0, cx + 8, 0);
    g.addColorStop(0, "#cdbb93"); g.addColorStop(0.45, "#fff8e8"); g.addColorStop(1, "#bfa97f");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.roundRect(cx - 8, top, 16, baseY - top + 4, 3); ctx.fill();
    ctx.fillStyle = "#fbf2dc";
    ctx.beginPath(); ctx.ellipse(cx, top + 1, 8, 3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f6ecd2";
    ctx.beginPath(); ctx.ellipse(cx + 6, top + 9, 2.2, 6, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#2a1c10"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(cx + 0.5, top - 6); ctx.stroke();
    return { flame: { x: cx, y: top - 7 }, tips };
  }

  /* ---------- ฐาน ---------- */
  const TONE_PAL = {
    natural: (back) => back ? [82, 46, 34, 46] : [104, 42, 22, 33],
    pandan:  (back) => back ? [100, 62, 44, 58] : [118, 58, 31, 45],
    gold:    (back) => back ? [44, 74, 50, 64] : [40, 70, 35, 50],
    pink:    (back) => back ? [328, 60, 60, 72] : [330, 56, 44, 58],
    pearl:   (back) => back ? [40, 24, 84, 92] : [38, 18, 70, 82],
  };
  const LOTUS = {
    natural: [["#f6d5de", "#f9e4ea", "#fff1f4"], "#e0718f", "#f0a3b7"],
    pandan:  [["#dcefd2", "#e9f6e1", "#f6fff0"], "#6aa457", "#a6d18f"],
    gold:    [["#f5e2b0", "#faedc9", "#fff7e4"], "#c9962e", "#e2bd63"],
    pink:    [["#f7cce4", "#fadcec", "#fff0f8"], "#c2408a", "#e07cb6"],
    pearl:   [["#f3efe6", "#f8f5ee", "#ffffff"], "#c9bfa9", "#e3dccb"],
  };

  function drawBanana(ctx, cx, rnd, style, tone) {
    const pal = TONE_PAL[tone] || TONE_PAL.natural;
    ctx.fillStyle = "#4f6a37";
    ctx.beginPath(); ctx.ellipse(cx, 256, 136, 34, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createLinearGradient(0, 220, 0, 280);
    g.addColorStop(0, "#d7dfae"); g.addColorStop(1, "#97ad6c");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(cx, 248, 133, 30, 0, 0, Math.PI * 2); ctx.fill();
    ring([
      { rx: 126, ry: 29, by: 246, n: 20, h: 44 },
      { rx: 92,  ry: 21, by: 225, n: 15, h: 40 },
      { rx: 58,  ry: 13, by: 206, n: 11, h: 34 },
    ], cx, (f) => foldStyled(ctx, f, style, pal));
    return 196;
  }
  function drawLotus(ctx, cx, rnd, style, tone) {
    const L = LOTUS[tone] || LOTUS.natural;
    ctx.fillStyle = "#24472a";
    ctx.beginPath(); ctx.ellipse(cx, 256, 152, 34, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(140,190,120,.25)"; ctx.lineWidth = 1;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2;
      ctx.beginPath(); ctx.moveTo(cx, 256); ctx.lineTo(cx + Math.cos(a) * 148, 256 + Math.sin(a) * 32); ctx.stroke();
    }
    const tiers = [
      { rx: 112, ry: 26, by: 244, n: 12, h: 62 },
      { rx: 80,  ry: 19, by: 228, n: 10, h: 56 },
      { rx: 48,  ry: 12, by: 212, n: 8,  h: 46 },
    ];
    ring(tiers, cx, (f) => lotusPetal(ctx, f, style, L));
    return 202;
  }
  function drawBread(ctx, cx, rnd, style, tone) {
    const pal = TONE_PAL[tone] || TONE_PAL.natural;
    ctx.fillStyle = "#8a4e1f";
    ctx.beginPath(); ctx.ellipse(cx, 258, 128, 36, 0, 0, Math.PI * 2); ctx.fill();
    const g = ctx.createRadialGradient(cx - 20, 236, 10, cx, 246, 130);
    g.addColorStop(0, "#f3cc8a"); g.addColorStop(0.7, "#d99a52"); g.addColorStop(1, "#b5722f");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(cx, 246, 124, 32, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#a8642a"; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(cx, 247, 118, 29, 0, 0, Math.PI * 2); ctx.stroke();
    for (let i = 0; i < 90; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
      ctx.fillStyle = `rgba(${120 + rnd() * 40},${70 + rnd() * 20},30,.35)`;
      ctx.fillRect(cx + Math.cos(a) * rr * 112, 246 + Math.sin(a) * rr * 26, 2, 1);
    }
    ring([{ rx: 70, ry: 15, by: 236, n: 12, h: 26 }], cx, (f) => foldStyled(ctx, f, style, pal));
    return 212;
  }
  function drawCoconut(ctx, cx, rnd, style, tone) {
    const pal = TONE_PAL[tone] || TONE_PAL.natural;
    const g = ctx.createLinearGradient(0, 220, 0, 285);
    g.addColorStop(0, "#7b5130"); g.addColorStop(1, "#3a2414");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(cx - 116, 226);
    ctx.bezierCurveTo(cx - 112, 278, cx + 112, 278, cx + 116, 226);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(170,120,70,.35)"; ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const x = cx - 105 + rnd() * 210, y = 232 + rnd() * 34;
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + (rnd() - 0.5) * 14, y + 4 + rnd() * 6); ctx.stroke();
    }
    ctx.fillStyle = "#24160b";
    ctx.beginPath(); ctx.ellipse(cx, 226, 112, 26, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#a57a4c"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(cx, 226, 113, 27, 0, 0, Math.PI * 2); ctx.stroke();
    ring([{ rx: 86, ry: 18, by: 228, n: 14, h: 30 }], cx, (f) => foldStyled(ctx, f, style, pal));
    return 206;
  }

  /* ---------- ประกอบ sprite ---------- */
  const cache = new Map();
  function sprite(base, flowerType, petalStyle, tone) {
    if (!BASES[base]) base = "banana";
    if (!FLOWERS[flowerType]) flowerType = "marigold";
    if (!PETALS[petalStyle]) petalStyle = "phanom";
    if (!TONES[tone]) tone = "natural";
    const key = base + "|" + flowerType + "|" + petalStyle + "|" + tone;
    if (cache.has(key)) return cache.get(key);
    const rnd = rngFrom(key);
    const c = document.createElement("canvas");
    c.width = SW * RES; c.height = SH * RES;
    const ctx = c.getContext("2d");
    ctx.scale(RES, RES);
    const cx = SW / 2;
    let my;
    if (base === "lotus") my = drawLotus(ctx, cx, rnd, petalStyle, tone);
    else if (base === "bread") my = drawBread(ctx, cx, rnd, petalStyle, tone);
    else if (base === "coconut") my = drawCoconut(ctx, cx, rnd, petalStyle, tone);
    else my = drawBanana(ctx, cx, rnd, petalStyle, tone);

    const R = flowerType === "jasmine" ? 20 : 21;
    const mound = [[0, -6, 1], [-36, 4, 0.82], [36, 4, 0.82], [-66, 16, 0.66], [66, 16, 0.66],
                   [-20, 18, 0.86], [20, 18, 0.86], [-46, 24, 0.7], [46, 24, 0.7], [0, 26, 0.78]];
    mound.sort((p, q) => p[1] - q[1]);
    const back = mound.filter((m) => m[1] <= 4), front = mound.filter((m) => m[1] > 4);
    back.forEach(([dx, dy, s]) => flower(ctx, flowerType, cx + dx, my + dy, R * s, rnd));
    const meta = candleAndIncense(ctx, cx, my + 8);
    front.forEach(([dx, dy, s]) => flower(ctx, flowerType, cx + dx, my + dy, R * s, rnd));

    // เงาสะท้อน
    const rc = document.createElement("canvas");
    rc.width = c.width; rc.height = c.height;
    const r = rc.getContext("2d");
    r.save();
    try { r.filter = "blur(3px)"; } catch (e) {}
    r.translate(0, WATER * RES * 2);
    r.scale(1, -1);
    r.drawImage(c, 0, 0);
    r.restore();
    r.globalCompositeOperation = "source-atop";
    r.fillStyle = "rgba(10,22,40,.5)";
    r.fillRect(0, 0, rc.width, rc.height);
    r.globalCompositeOperation = "destination-in";
    const fade = r.createLinearGradient(0, WATER * RES, 0, (WATER + 70) * RES);
    fade.addColorStop(0, "rgba(0,0,0,.55)"); fade.addColorStop(1, "rgba(0,0,0,0)");
    r.fillStyle = fade;
    r.fillRect(0, 0, rc.width, rc.height);
    r.globalCompositeOperation = "source-over";
    r.clearRect(0, 0, rc.width, WATER * RES);

    const out = { canvas: c, refl: rc, w: SW, h: SH, water: WATER, flame: meta.flame, tips: meta.tips };
    cache.set(key, out);
    return out;
  }

  /* ---------- แสง ---------- */
  function radialSprite(size, stops) {
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const x = c.getContext("2d");
    const g = x.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([o, col]) => g.addColorStop(o, col));
    x.fillStyle = g; x.fillRect(0, 0, size, size);
    return c;
  }
  const glow = radialSprite(256, [[0, "rgba(255,214,140,.95)"], [0.18, "rgba(255,190,100,.45)"], [0.5, "rgba(255,150,60,.12)"], [1, "rgba(255,140,50,0)"]]);
  const softGlow = radialSprite(128, [[0, "rgba(255,226,170,1)"], [0.35, "rgba(255,196,110,.35)"], [1, "rgba(255,170,80,0)"]]);

  function flame(ctx, x, y, s, t, seed, glowK = 1) {
    const f = 1 + 0.09 * Math.sin(t * 17 + seed) + 0.05 * Math.sin(t * 31 + seed * 2.3);
    const sway = Math.sin(t * 5.3 + seed) * 1.4 * s;
    const h = 24 * s * f, w = 6.5 * s;
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5 * f * glowK;
    const gs = 150 * s;
    ctx.drawImage(glow, x - gs / 2, y - gs / 2 - 4 * s, gs, gs);
    ctx.restore();
    const g = ctx.createRadialGradient(x, y - h * 0.15, 0, x, y - h * 0.3, h * 0.75);
    g.addColorStop(0, "rgba(255,253,235,1)");
    g.addColorStop(0.35, "rgba(255,214,110,.95)");
    g.addColorStop(1, "rgba(255,120,30,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x + sway, y - h);
    ctx.bezierCurveTo(x - w * 1.2, y - h * 0.4, x - w, y + w * 0.4, x, y + w * 0.5);
    ctx.bezierCurveTo(x + w, y + w * 0.4, x + w * 1.2, y - h * 0.4, x + sway, y - h);
    ctx.fill();
    ctx.fillStyle = "rgba(120,160,255,.35)";
    ctx.beginPath(); ctx.ellipse(x, y + w * 0.1, w * 0.45, w * 0.35, 0, 0, Math.PI * 2); ctx.fill();
    return f;
  }

  function smoke(ctx, tips, ox, oy, k, t, seed) {
    ctx.save();
    ctx.lineWidth = Math.max(0.6, 1.2 * k);
    tips.forEach((p, i) => {
      const x0 = ox + p.x * k, y0 = oy + p.y * k;
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      for (let j = 1; j <= 8; j++) {
        const yy = y0 - j * 9 * k;
        const xx = x0 + Math.sin(t * 1.4 + j * 0.8 + i + seed) * j * 1.3 * k;
        ctx.lineTo(xx, yy);
      }
      const g = ctx.createLinearGradient(0, y0, 0, y0 - 72 * k);
      g.addColorStop(0, "rgba(220,215,230,.28)"); g.addColorStop(1, "rgba(220,215,230,0)");
      ctx.strokeStyle = g; ctx.stroke();
    });
    ctx.restore();
  }

  /* ---------- กระดาษสา (พื้นผิวสำหรับการ์ด) ---------- */
  function paperTexture() {
    const c = document.createElement("canvas");
    c.width = c.height = 220;
    const x = c.getContext("2d");
    x.fillStyle = "#efe4cb"; x.fillRect(0, 0, 220, 220);
    const rnd = rngFrom("saa-paper");
    for (let i = 0; i < 420; i++) {
      x.strokeStyle = `rgba(${150 + rnd() * 60},${120 + rnd() * 50},${80 + rnd() * 40},${0.08 + rnd() * 0.12})`;
      x.lineWidth = 0.4 + rnd() * 0.8;
      const px = rnd() * 220, py = rnd() * 220, a = rnd() * Math.PI, l = 6 + rnd() * 22;
      x.beginPath(); x.moveTo(px, py);
      x.quadraticCurveTo(px + Math.cos(a) * l * 0.5 + (rnd() - 0.5) * 6, py + Math.sin(a) * l * 0.5, px + Math.cos(a) * l, py + Math.sin(a) * l);
      x.stroke();
    }
    for (let i = 0; i < 1800; i++) {
      x.fillStyle = `rgba(90,60,30,${rnd() * 0.05})`;
      x.fillRect(rnd() * 220, rnd() * 220, 1, 1);
    }
    try { return c.toDataURL("image/png"); } catch (e) { return ""; }
  }

  /* ---------- รูปย่อสำหรับปุ่มเลือก ---------- */
  function thumb(canvas, base, flowerType, opts = {}) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth || 120, h = canvas.clientHeight || 90;
    canvas.width = w * dpr; canvas.height = h * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    if (opts.flowerOnly) {
      const k = h / 70;
      ctx.save(); ctx.translate(w / 2, h * 0.6); ctx.scale(k, k);
      flower(ctx, flowerType, 0, 0, 22, rngFrom("thumb" + flowerType));
      ctx.restore();
      return;
    }
    const sp = sprite(base, flowerType, opts.petal, opts.tone);
    const k = Math.min(w / 330, h / 210) * (opts.zoom || 1);
    const ox = w / 2 - (SW / 2) * k, oy = h * (opts.water || 0.82) - WATER * k;
    ctx.drawImage(sp.canvas, ox, oy, SW * k, SH * k);
    flame(ctx, ox + sp.flame.x * k, oy + sp.flame.y * k, k, opts.t || 0, 1);
  }

  window.LKArt = { BASES, FLOWERS, PETALS, TONES, meaningOf, sprite, flame, smoke, glow, softGlow, paperTexture, thumb, rngFrom };
})();
