/* ลอยกระทง — เซียมซี (คำทำนาย 28 ใบ + กระบอกเซียมซี) */
(function () {
  "use strict";

  // lv: 4 ดีมาก, 3 ดี, 2 ปานกลาง, 1 ระวัง
  const F = [
    [4, "จันทร์เพ็ญส่องฟ้า ทางข้างหน้าสว่างไสว", "งานที่ตั้งใจไว้จะสำเร็จเกินคาด มีผู้ใหญ่คอยหนุน", "คนโสดจะได้พบคนที่คุยกันถูกคอ คนมีคู่รักกันมั่นคง", "มีรายได้เข้ามาหลายทาง เก็บออมได้ดี", "แข็งแรงดี พักผ่อนให้พอจะยิ่งสดใส", "กล้าเริ่มสิ่งใหม่ในเดือนนี้ ฟ้าเปิดทางให้"],
    [3, "น้ำไหลเอื่อย ๆ แต่ไปถึงทะเลเสมอ", "ความก้าวหน้ามาช้าแต่มั่นคง อย่าใจร้อน", "ค่อยเป็นค่อยไป ความจริงใจชนะทุกอย่าง", "รายรับสม่ำเสมอ เลี่ยงการลงทุนที่เสี่ยงเกินไป", "ระวังการนอนดึกติดกันหลายคืน", "อดทนอีกนิด ผลดีกำลังเดินทางมา"],
    [4, "ดอกบัวพ้นน้ำ บานรับแสงอรุณ", "ปัญหาที่ค้างคาจะคลี่คลาย และได้รับคำชม", "มีข่าวดีเรื่องหัวใจ คนที่แอบชอบอาจเป็นฝ่ายเข้ามาก่อน", "มีโชคจากของขวัญหรือรางวัล", "จิตใจแจ่มใส ร่างกายกระปรี้กระเปร่า", "ช่วยเหลือผู้อื่นบ้าง โชคจะยิ่งทวีคูณ"],
    [2, "เมฆบังจันทร์ชั่วครู่ เดี๋ยวก็ผ่านพ้น", "งานติดขัดเล็กน้อย ตรวจรายละเอียดให้รอบคอบ", "อาจมีเรื่องเข้าใจผิด คุยกันตรง ๆ จะดีขึ้น", "ใช้จ่ายเกินตัวไปบ้าง ควรวางแผนงบให้ชัด", "กินข้าวให้ตรงเวลา ดูแลกระเพาะหน่อย", "ใจเย็น ๆ เรื่องร้ายจะกลายเป็นดีในไม่ช้า"],
    [3, "นกบินกลับรัง พบที่พักพิงอบอุ่น", "ได้ทีมงานหรือเพื่อนดี ๆ คอยช่วย", "ครอบครัวและคนรักเป็นกำลังใจสำคัญ", "ค่อย ๆ ดีขึ้น มีคนชวนทำสิ่งที่ได้ประโยชน์", "ดี ออกไปเดินรับลมบ้าง", "ให้เวลากับคนที่บ้านมากขึ้นอีกนิด"],
    [4, "ข้าวเต็มยุ้ง ปลาเต็มบ่อ", "เรียนหรือสอบผ่านฉลุย งานได้ผลตอบแทนดี", "ความรักหวานชื่น มีเรื่องดีให้ฉลองร่วมกัน", "การเงินมั่งคั่ง มีลาภลอยเข้ามา", "แข็งแรงสมบูรณ์", "แบ่งปันความสุขให้คนรอบข้าง แล้วจะได้กลับมาอีกมาก"],
    [1, "เดินทางกลางคืน ต้องถือตะเกียงให้มั่น", "ระวังคำพูดที่อาจทำให้เสียงาน คิดก่อนพูด", "อย่าเพิ่งตัดสินใจเรื่องใหญ่ตอนอารมณ์ไม่ดี", "ระวังถูกหลอกหรือของหาย เก็บของมีค่าให้ดี", "ระวังอุบัติเหตุเล็ก ๆ ระหว่างเดินทาง", "ช้าแต่ชัวร์ ความรอบคอบคือเครื่องรางที่ดีที่สุด"],
    [3, "ต้นกล้าได้ฝน งอกงามทุกวัน", "เหมาะเริ่มเรียนทักษะใหม่ จะได้ใช้ในอนาคต", "คนโสดมีคนเข้ามาทำความรู้จักผ่านเพื่อน", "ปานกลางค่อนข้างดี", "ดี ดื่มน้ำให้มากขึ้น", "ลงมือวันนี้ ดีกว่ารอวันที่พร้อม"],
    [4, "เก้าก้าวสู่ความก้าวหน้า", "มีโอกาสได้เลื่อนขั้นหรือได้รับเลือก", "คนรักสนับสนุนทุกการตัดสินใจ", "มีเกณฑ์ได้เงินก้อน", "ดีมาก", "ตอบรับโอกาสที่เข้ามา อย่าลังเล"],
    [2, "ลมพัดใบไผ่ เอนแต่ไม่หัก", "มีแรงกดดัน แต่คุณรับมือได้", "ต่างคนต่างยุ่ง หาเวลาพูดคุยกันบ้าง", "รายจ่ายจุกจิกเยอะ จดไว้จะเห็นทางประหยัด", "ระวังความเครียดสะสม", "ยืดหยุ่นไว้ แล้วจะผ่านทุกพายุ"],
    [3, "แสงเทียนเล็ก ๆ ส่องทางได้ไกล", "ความตั้งใจเล็ก ๆ ของคุณจะมีคนเห็นคุณค่า", "ความใส่ใจเล็กน้อยทำให้อีกฝ่ายอุ่นใจ", "เก็บเล็กผสมน้อยจะเห็นผลชัด", "ดี", "อย่าดูถูกสิ่งเล็ก ๆ ที่ทำทุกวัน"],
    [3, "ฟ้าหลังฝน งดงามเสมอ", "หลังช่วงเหนื่อย งานจะเริ่มลงตัว", "คนที่เคยห่างเหินจะกลับมาใกล้ชิด", "ฟื้นตัวดี ภาระเริ่มเบาลง", "ฟื้นตัวเร็ว", "ยิ้มให้ตัวเองบ้าง คุณทำได้ดีแล้ว"],
    [2, "เรือลำน้อยกลางกระแสน้ำ", "ต้องพึ่งตัวเองมากหน่อย อย่ารอคนอื่น", "อย่าคาดหวังจนลืมดูแลใจตัวเอง", "พอใช้ ช่วงนี้ยังไม่ควรให้ใครยืมเงิน", "พักสายตาจากหน้าจอบ่อย ๆ", "จับหางเสือให้มั่น แล้วจะถึงฝั่ง"],
    [4, "พระจันทร์เต็มดวงกลางสายน้ำ", "สิ่งที่ลงแรงไว้จะผลิดอกออกผล", "ความรักสมหวัง คู่ที่คบกันมีเกณฑ์ก้าวสู่ขั้นต่อไป", "เงินทองไหลมาเทมา", "สดชื่นแจ่มใส", "ขอบคุณตัวเองที่ไม่ยอมแพ้"],
    [3, "ปลาว่ายทวนน้ำ แข็งแรงขึ้นทุกวัน", "งานท้าทายจะทำให้คุณเก่งขึ้น", "อุปสรรคทำให้ความรักแน่นแฟ้น", "ได้มาจากความขยัน", "เหมาะเริ่มออกกำลังกาย", "ความยากวันนี้ คือความเก่งของวันพรุ่งนี้"],
    [1, "ไฟในเทียนต้องบังลม", "เก็บแผนงานไว้ก่อน ระวังคนพูดอย่างทำอย่าง", "อาจมีคำนินทากวนใจ เชื่อใจกันไว้", "อย่าค้ำประกันหรือเซ็นเอกสารโดยไม่อ่าน", "ร่างกายส่งสัญญาณเหนื่อย พักให้มาก", "ปกป้องสิ่งสำคัญให้ดี แล้วแสงจะไม่ดับ"],
    [3, "ดาวเรืองบานสะพรั่ง", "ได้รับการยอมรับในกลุ่ม มีชื่อเสียงดี", "เสน่ห์แรง มีคนชื่นชม", "ค้าขายดี ของขายออก", "ดี", "ใส่สีเหลืองหรือสีส้มจะเสริมดวง"],
    [2, "ทางแยกใต้แสงจันทร์", "ต้องตัดสินใจเรื่องสำคัญ ถามคนที่ไว้ใจก่อน", "ใจยังลังเล ไม่ต้องรีบ", "ชะลอการซื้อของชิ้นใหญ่ไว้ก่อน", "นอนไม่ค่อยหลับ ลองลดกาแฟตอนบ่าย", "ฟังเสียงหัวใจ แต่ใช้เหตุผลประกอบ"],
    [4, "สะพานทองข้ามแม่น้ำ", "ได้พบผู้ใหญ่หรือคนที่จะเปลี่ยนเส้นทางชีวิต", "เนื้อคู่อาจมาจากการเดินทาง", "มีโชคจากการเดินทาง", "ดี", "ออกไปพบผู้คนใหม่ ๆ โอกาสรออยู่"],
    [3, "ข้าวตั้งท้องรอวันเก็บเกี่ยว", "อีกไม่นานผลงานจะออกดอก ใจเย็น ๆ", "ความสัมพันธ์กำลังเติบโต", "การออมระยะยาวให้ผลดี", "ดี", "รอคอยอย่างมีความหวัง"],
    [2, "ฝนตกพรำ ๆ ที่ปลายนา", "งานเยอะจนล้า แบ่งเวลาให้ดี", "อย่าเอาความเหนื่อยไปลงกับคนใกล้ตัว", "ทรงตัว", "ดูแลตัวเองให้อบอุ่น ระวังหวัด", "ทำทีละอย่าง แล้วทุกอย่างจะเสร็จ"],
    [3, "สองมือพนมรับพร", "มีผู้ใหญ่เมตตา ขออะไรมักได้", "ได้รับความรักและความใส่ใจมากมาย", "มีลาภจากผู้ใหญ่หรือครอบครัว", "ดี", "ขอบคุณและตอบแทนผู้มีพระคุณ"],
    [1, "น้ำนิ่งไหลลึก", "อย่าประมาทงานที่ดูง่าย อาจมีปัญหาซ่อนอยู่", "อีกฝ่ายอาจมีเรื่องในใจ ลองถามด้วยความห่วงใย", "ระวังรายจ่ายแฝงที่ลืมยกเลิก", "ถึงเวลาตรวจสุขภาพประจำปีแล้ว", "มองให้ลึกกว่าผิวน้ำ แล้วจะไม่พลาด"],
    [3, "โคมลอยขึ้นฟ้า พาความหวังไปไกล", "ความฝันที่วางไว้มีลุ้นเป็นจริง", "ได้ไปเที่ยวหรือทำกิจกรรมโรแมนติกด้วยกัน", "ดี มีเงินเก็บไว้ไปเที่ยว", "สดใส", "เขียนเป้าหมายลงกระดาษ แล้วเริ่มทีละข้อ"],
    [4, "ทองคำในโคลน ล้างแล้วยิ่งเงางาม", "สิ่งที่คนเคยมองข้ามในตัวคุณจะเป็นที่ประจักษ์", "คนที่ใช่จะรักในตัวตนจริงของคุณ", "มีโชคจากสิ่งที่ไม่คาดคิด", "ดี", "เป็นตัวเองให้เต็มที่ ไม่ต้องเปรียบเทียบกับใคร"],
    [2, "ครึ่งทางของการเดินทาง", "งานยังไม่เสร็จดี อย่าเพิ่งท้อ", "ความสัมพันธ์ต้องการความพยายามจากทั้งสองฝ่าย", "พอใช้ ควรมีเงินสำรองยามฉุกเฉิน", "ยืดเส้นยืดสายบ้าง", "มาไกลแล้ว เดินต่ออีกนิด"],
    [3, "เสียงระฆังวัดยามเช้า", "เริ่มต้นใหม่ได้ดี เหมาะจัดระเบียบชีวิต", "ได้คืนดีกับคนที่เคยขัดใจกัน", "ดีขึ้นเมื่อเลิกซื้อของตามอารมณ์", "ตื่นเช้าจะดีต่อร่างกาย", "ปล่อยวางเรื่องเก่า แล้วรับวันใหม่"],
    [4, "กระทงทองลอยถึงปลายน้ำ", "ทุกเรื่องราบรื่นดังใจหมาย", "ความรักสมบูรณ์ เป็นที่รักของทุกคน", "มั่งคั่ง มีกินมีใช้ไม่ขาดมือ", "แข็งแรง อายุยืน", "คำอธิษฐานของคุณได้ยินแล้ว ทำความดีต่อไป"],
  ];
  const LEVEL = { 4: "ดีมาก", 3: "ดี", 2: "ปานกลาง", 1: "ระวังไว้" };
  const FORTUNES = F.map((f, i) => ({ n: i + 1, lv: f[0], level: LEVEL[f[0]], verse: f[1], work: f[2], love: f[3], money: f[4], health: f[5], tip: f[6] }));

  function randomNumber() {
    try { const a = new Uint32Array(1); crypto.getRandomValues(a); return 1 + (a[0] % FORTUNES.length); }
    catch (e) { return 1 + Math.floor(Math.random() * FORTUNES.length); }
  }

  /* ---------- เวทีเซียมซี: กระบอก ไม้หล่น ไม้ปวย ---------- */
  const TAU = Math.PI * 2;
  const ease3 = (p) => 1 - Math.pow(1 - p, 3);

  class Stage {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext("2d");
      this.t0 = performance.now(); this.last = this.t0;
      this.phase = "idle";
      this.onSound = null;
      const rnd = window.LKArt.rngFrom("siamsi-sticks");
      this.sticks = Array.from({ length: 26 }, () => ({ x: rnd() * 2 - 1, len: 0.55 + rnd() * 0.45, lean: (rnd() - 0.5) * 0.18, d: rnd() }));
      this.sticks.sort((a, b) => a.d - b.d);
      this.stick = null; this.poe = null;
      this.loop = this.loop.bind(this);
    }
    start() { cancelAnimationFrame(this.raf); this.last = performance.now(); this.raf = requestAnimationFrame(this.loop); }
    stop() { cancelAnimationFrame(this.raf); }
    reset() { this.phase = "idle"; this.stick = null; this.poe = null; }
    clearPoe() { this.poe = null; }

    shake() {
      this.phase = "shake"; this.shakeAt = performance.now();
      return new Promise((r) => (this._shakeDone = r));
    }
    eject(number) {
      const g = this.geo, dir = Math.random() < 0.5 ? -1 : 1;
      this.stick = { n: number, x: g.cx, y: g.top - g.ch * 0.2, vx: dir * (90 + Math.random() * 70), vy: -560 - Math.random() * 80,
        a: -0.15 * dir, va: dir * (8 + Math.random() * 4), bounces: 0, state: "fly", restAt: 0 };
      this.phase = "eject";
      return new Promise((r) => (this._ejectDone = r));
    }
    throwPoe(result) {
      const g = this.geo;
      const faces = result === "yes" ? (Math.random() < 0.5 ? ["round", "flat"] : ["flat", "round"]) : result === "no" ? ["round", "round"] : ["flat", "flat"];
      const at = performance.now();
      this.poe = faces.map((f, i) => ({
        face: f, sx: g.cx + (i ? 10 : -10), sy: g.floor - 20,
        tx: g.cx + (i ? 1 : -1) * (g.w * 0.17 + Math.random() * 18), ty: g.floor + 2,
        spins: 3 + i * 0.5 + Math.random(), dur: 1050 + i * 120, at, landed: false,
      }));
      this.phase = "poe";
      return new Promise((r) => (this._poeDone = r));
    }

    loop(now) {
      this.raf = requestAnimationFrame(this.loop);
      const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.c.clientWidth, h = this.c.clientHeight;
      if (!w || !h) return;
      if (this.c.width !== Math.round(w * dpr) || this.c.height !== Math.round(h * dpr)) { this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr); }
      const ctx = this.ctx, A = window.LKArt;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = (now - this.t0) / 1000;
      const cw = Math.min(w * 0.28, 130), ch = Math.min(h * 0.48, 210);
      const floor = h * 0.93;
      const geo = (this.geo = { w, h, cw, ch, cx: w / 2, floor, top: floor - ch });

      // พื้นหลัง + เทียน
      let g = ctx.createRadialGradient(w / 2, h * 0.75, 10, w / 2, h * 0.6, Math.max(w, h) * 0.7);
      g.addColorStop(0, "#2a2035"); g.addColorStop(0.55, "#121a30"); g.addColorStop(1, "#0a1122");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,220,160,.04)"; ctx.fillRect(0, floor - 4, w, h - floor + 4);
      const candles = [[0.12, 0.84], [0.88, 0.84]];
      ctx.globalCompositeOperation = "lighter";
      candles.forEach(([px, py], i) => { ctx.globalAlpha = 0.5 * (0.85 + 0.15 * Math.sin(t * 11 + i * 2)); ctx.drawImage(A.glow, w * px - 70, h * py - 80, 140, 140); });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      candles.forEach(([px, py], i) => { ctx.fillStyle = "#efe2c4"; ctx.fillRect(w * px - 5, h * py - 6, 10, 26); A.flame(ctx, w * px, h * py - 9, 0.75, t, i * 3); });
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath(); ctx.ellipse(w / 2, floor, cw * 0.62, 8, 0, 0, TAU); ctx.fill();

      // เขย่า
      let ang = Math.sin(t * 1.3) * 0.015, jx = 0;
      if (this.phase === "shake") {
        const a = (now - this.shakeAt) / 1000;
        const env = Math.min(1, a * 4) * (a < 1.5 ? 1 : Math.max(0, 1 - (a - 1.5) * 4));
        ang = Math.sin(a * 34) * 0.2 * env; jx = Math.sin(a * 17) * 6 * env;
        if (a > 1.75) { this.phase = "shaken"; const r = this._shakeDone; this._shakeDone = null; r && r(); }
      }
      this.drawCanister(ctx, geo, ang, jx, now);

      // ไม้ที่หล่นออกมา
      const s = this.stick;
      if (s) {
        const Lh = ch * 0.36;
        if (s.state === "fly") {
          s.vy += 1500 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.a += s.va * dt;
          const lo = w * 0.24, hi = w * 0.76;
          if (s.x < lo) { s.x = lo; s.vx = Math.abs(s.vx) * 0.5; }
          if (s.x > hi) { s.x = hi; s.vx = -Math.abs(s.vx) * 0.5; }
          const low = s.y + Math.abs(Math.cos(s.a)) * Lh;
          if (low >= floor + 6 && s.vy > 0) {
            s.y -= low - (floor + 6);
            s.vy = -s.vy * 0.42; s.vx *= 0.7; s.va = s.va * 0.55 + (Math.random() - 0.5) * 3;
            s.bounces++;
            this.onSound && this.onSound("tok", Math.min(1, Math.abs(s.vy) / 300 + 0.3));
            if (s.bounces >= 3 || Math.abs(s.vy) < 90) {
              s.state = "settle"; s.restAt = now; s.fromA = s.a; s.fromY = s.y;
              const n = ((s.a % Math.PI) + Math.PI) % Math.PI;
              s.toA = s.a - n + (n < Math.PI / 2 ? Math.PI / 2 - 0.07 : Math.PI / 2 + 0.07);
            }
          }
        } else if (s.state === "settle") {
          const p = Math.min(1, (now - s.restAt) / 380), e = ease3(p);
          s.a = s.fromA + (s.toA - s.fromA) * e;
          s.y = s.fromY + (floor + 2 - s.fromY) * e;
          s.x = Math.max(w * 0.24, Math.min(w * 0.76, s.x + s.vx * dt)); s.vx *= 0.9;
          if (p >= 1) { s.state = "rest"; this.phase = "picked"; const r = this._ejectDone; this._ejectDone = null; r && r(); }
        }
        const dx = Math.sin(s.a) * Lh, dy = -Math.cos(s.a) * Lh;
        this.drawStick(ctx, s.x - dx, s.y - dy, s.x + dx, s.y + dy, true);
        if (s.state === "rest") {
          ctx.fillStyle = "#f6c26b";
          ctx.beginPath(); ctx.arc(s.x, s.y - 30, 21, 0, TAU); ctx.fill();
          ctx.fillStyle = "#1b1f33"; ctx.font = "700 21px 'IBM Plex Sans Thai Looped', sans-serif";
          ctx.textAlign = "center"; ctx.textBaseline = "middle";
          ctx.fillText(Number(s.n).toLocaleString("th-TH-u-nu-thai"), s.x, s.y - 29);
        }
      }

      // ไม้ปวย
      if (this.poe) {
        let allLanded = true;
        this.poe.forEach((b) => {
          const p = Math.min(1, (now - b.at) / b.dur), e = ease3(p);
          const x = b.sx + (b.tx - b.sx) * p;
          const y = b.sy + (b.ty - b.sy) * p - 190 * 4 * p * (1 - p);
          const final = b.face === "round" ? 0 : Math.PI;
          const rot = final + (1 - e) * b.spins * TAU;
          if (p >= 1 && !b.landed) { b.landed = true; this.onSound && this.onSound("clack", 0.9); }
          if (p < 1) allLanded = false;
          this.drawPoe(ctx, x, y, rot, p < 1 ? 0.75 + 0.25 * Math.abs(Math.cos(rot)) : 1);
        });
        if (allLanded && this.phase === "poe") {
          this.phase = "poe-done";
          setTimeout(() => { const r = this._poeDone; this._poeDone = null; r && r(); }, 250);
        }
      }
    }

    drawCanister(ctx, geo, ang, jx, now) {
      const { cw, ch, floor } = geo, cx = geo.cx + jx;
      ctx.save();
      ctx.translate(cx, floor); ctx.rotate(ang);
      const top = -ch, rx = cw / 2, ry = cw * 0.16;
      ctx.fillStyle = "#2a0d0b";
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, 0, TAU); ctx.fill();
      const shaking = this.phase === "shake";
      this.sticks.forEach((s, i) => {
        const jit = shaking ? Math.sin(now / 35 + i * 1.7) * 7 : 0;
        const x0 = s.x * rx * 0.72, len = ch * 0.42 * s.len;
        this.drawStick(ctx, x0, top + ry * 0.6 + 40, x0 + s.lean * len, top - len + jit, false);
      });
      let g = ctx.createLinearGradient(-rx, 0, rx, 0);
      g.addColorStop(0, "#4e0f0d"); g.addColorStop(0.28, "#b3322a"); g.addColorStop(0.45, "#cf4a3b"); g.addColorStop(0.75, "#8e1f1a"); g.addColorStop(1, "#3f0b0a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-rx, top); ctx.ellipse(0, top, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(rx, -ry); ctx.ellipse(0, -ry, rx, ry, 0, 0, Math.PI, false);
      ctx.closePath(); ctx.fill();
      [top + ch * 0.1, -ch * 0.2].forEach((y) => {
        const bh = ch * 0.07;
        const gg = ctx.createLinearGradient(-rx, 0, rx, 0);
        gg.addColorStop(0, "#6b4a1c"); gg.addColorStop(0.35, "#e9c66f"); gg.addColorStop(0.55, "#f7dd92"); gg.addColorStop(1, "#5e3f16");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.ellipse(0, y + bh, rx, ry, 0, 0, Math.PI, false); ctx.lineTo(-rx, y);
        ctx.ellipse(0, y, rx, ry, 0, Math.PI, 0, true); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(90,40,10,.55)"; ctx.lineWidth = 1;
        for (let k = -6; k <= 6; k++) {
          const px = (k / 6.5) * rx, yy = y + bh / 2 + ry * Math.sqrt(Math.max(0, 1 - (px / rx) ** 2));
          ctx.beginPath(); ctx.moveTo(px - 4, yy); ctx.lineTo(px, yy - bh * 0.32); ctx.lineTo(px + 4, yy); ctx.lineTo(px, yy + bh * 0.32); ctx.closePath(); ctx.stroke();
        }
      });
      ctx.fillStyle = "rgba(247,221,146,.9)";
      ctx.font = `700 ${Math.round(cw * 0.26)}px Charm, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("เซียมซี", 0, top + ch * 0.48);
      ctx.strokeStyle = "#e9c66f"; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, 0, Math.PI, false); ctx.stroke();
      ctx.strokeStyle = "rgba(233,198,111,.5)";
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, Math.PI, TAU, false); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.fillRect(-rx * 0.55, top + ch * 0.05, rx * 0.16, ch * 0.85);
      ctx.restore();
    }

    drawStick(ctx, x0, y0, x1, y1, chosen) {
      const g = ctx.createLinearGradient(x0 - 3, y0, x0 + 3, y0);
      g.addColorStop(0, chosen ? "#b98d4a" : "#9c7a44"); g.addColorStop(0.5, chosen ? "#f3d9a0" : "#d8b878"); g.addColorStop(1, "#8a6a38");
      ctx.strokeStyle = g; ctx.lineWidth = chosen ? 6 : 4.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      const k = 0.13;
      ctx.strokeStyle = "#b02a22";
      ctx.beginPath(); ctx.moveTo(x1 + (x0 - x1) * k, y1 + (y0 - y1) * k); ctx.lineTo(x1, y1); ctx.stroke();
      if (chosen) {
        ctx.save(); ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.45;
        ctx.drawImage(window.LKArt.softGlow, (x0 + x1) / 2 - 50, (y0 + y1) / 2 - 50, 100, 100);
        ctx.restore();
      }
    }

    // ไม้ปวย: rot = 0 หลังโค้งขึ้น (คว่ำ), rot = π หน้าเรียบขึ้น (หงาย)
    drawPoe(ctx, x, y, rot, sq) {
      const R = 20;
      ctx.save();
      ctx.translate(x, y - 8); ctx.rotate(rot); ctx.scale(1, sq);
      const g = ctx.createLinearGradient(0, -R, 0, 0);
      g.addColorStop(0, "#d4553f"); g.addColorStop(1, "#7d150f");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-R * 1.25, 0);
      ctx.quadraticCurveTo(-R * 1.1, -R * 1.05, 0, -R * 0.95);
      ctx.quadraticCurveTo(R * 1.1, -R * 1.05, R * 1.25, 0);
      ctx.quadraticCurveTo(0, R * 0.18, -R * 1.25, 0);
      ctx.fill();
      ctx.strokeStyle = "#e9c66f"; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-R * 1.2, 0); ctx.quadraticCurveTo(0, R * 0.16, R * 1.2, 0); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,.16)";
      ctx.beginPath(); ctx.ellipse(-R * 0.35, -R * 0.62, R * 0.38, R * 0.12, -0.25, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  /* ---------- การ์ดรูปสำหรับแชร์ (1080x1920) ---------- */
  function wrapLines(ctx, text, maxW) {
    let parts;
    try { parts = [...new Intl.Segmenter("th", { granularity: "word" }).segment(text)].map((x) => x.segment); }
    catch (e) { parts = [...text]; }
    const lines = []; let cur = "";
    for (const p of parts) {
      const tryLine = cur + p;
      if (ctx.measureText(tryLine).width > maxW && cur.trim()) { lines.push(cur.trim()); cur = p.trimStart(); }
      else cur = tryLine;
    }
    if (cur.trim()) lines.push(cur.trim());
    return lines;
  }
  const TOPICS = {
    overall: "ภาพรวม", work: "การงาน การเรียน", love: "ความรัก", money: "การเงิน", health: "สุขภาพ",
  };
  async function storyImage(f, topic, opts = {}) {
    const fontsReady = document.fonts ? Promise.all([
      document.fonts.load("700 120px Charm"), document.fonts.load("500 40px 'IBM Plex Sans Thai Looped'"), document.fonts.load("600 40px 'IBM Plex Sans Thai Looped'"),
    ]).catch(() => {}) : Promise.resolve();
    await fontsReady;
    const W = 1080, H = 1920;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d"), A = window.LKArt;
    const th = (n) => Number(n).toLocaleString("th-TH-u-nu-thai");
    let g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#060b19"); g.addColorStop(0.5, "#151b38"); g.addColorStop(1, "#0a1224");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    const rnd = A.rngFrom("story-stars");
    for (let i = 0; i < 140; i++) { ctx.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.6})`; ctx.fillRect(rnd() * W, rnd() * 520, rnd() < 0.1 ? 3 : 2, rnd() < 0.1 ? 3 : 2); }
    g = ctx.createRadialGradient(860, 250, 60, 860, 250, 420);
    g.addColorStop(0, "rgba(245,228,185,.28)"); g.addColorStop(1, "rgba(245,228,185,0)");
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, 800);
    g = ctx.createRadialGradient(830, 220, 10, 860, 250, 92);
    g.addColorStop(0, "#fffbf0"); g.addColorStop(0.6, "#f5e8c8"); g.addColorStop(1, "#e2cc9a");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(860, 250, 92, 0, TAU); ctx.fill();

    ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
    ctx.fillStyle = "#f3e9d2"; ctx.font = "700 150px Charm, serif";
    ctx.fillText("เซียมซี", 80, 330);
    ctx.fillStyle = "rgba(243,233,210,.7)"; ctx.font = "500 40px 'IBM Plex Sans Thai Looped', sans-serif";
    ctx.fillText(opts.eventName || "ลอยกระทงออนไลน์", 86, 400);

    const order = topic && topic !== "overall" ? [topic].concat(["work", "love", "money", "health"].filter((k) => k !== topic)) : ["work", "love", "money", "health"];
    const X = 70, Wc = 940, pad = 64, inner = Wc - pad * 2;
    function layout(draw, y0) {
      let y = y0 + pad;
      ctx.font = "700 112px Charm, serif"; ctx.fillStyle = "#5a2e12";
      if (draw) ctx.fillText("ใบที่ " + th(f.n), X + pad, y + 100);
      ctx.font = "600 40px 'IBM Plex Sans Thai Looped', sans-serif";
      const lw = ctx.measureText(f.level).width + 56;
      if (draw) {
        ctx.fillStyle = f.lv === 4 ? "#5a2e12" : "rgba(0,0,0,0)";
        ctx.strokeStyle = f.lv === 1 ? "#8a2b1d" : "#5a2e12"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.roundRect(X + Wc - pad - lw, y + 40, lw, 72, 36); ctx.fill(); ctx.stroke();
        ctx.fillStyle = f.lv === 4 ? "#efe4cb" : f.lv === 1 ? "#8a2b1d" : "#22253a";
        ctx.fillText(f.level, X + Wc - pad - lw + 28, y + 90);
      }
      y += 150;
      ctx.font = "700 64px Charm, serif"; ctx.fillStyle = "#3b2414";
      wrapLines(ctx, f.verse, inner).forEach((ln) => { y += 88; if (draw) ctx.fillText(ln, X + pad, y); });
      y += 40;
      if (draw) { ctx.strokeStyle = "rgba(34,37,58,.3)"; ctx.setLineDash([10, 10]); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X + pad, y); ctx.lineTo(X + Wc - pad, y); ctx.stroke(); ctx.setLineDash([]); }
      y += 20;
      order.forEach((k, i) => {
        const focus = i === 0 && topic && topic !== "overall";
        ctx.font = "500 40px 'IBM Plex Sans Thai Looped', sans-serif";
        const lines = wrapLines(ctx, f[k], inner - (focus ? 40 : 0));
        const blockH = 58 + lines.length * 58 + 24;
        if (draw && focus) { ctx.fillStyle = "rgba(246,194,107,.35)"; ctx.beginPath(); ctx.roundRect(X + pad - 20, y + 6, inner + 40, blockH, 18); ctx.fill(); }
        y += 52;
        if (draw) {
          ctx.font = "600 34px 'IBM Plex Sans Thai Looped', sans-serif"; ctx.fillStyle = "rgba(34,37,58,.62)";
          ctx.fillText(TOPICS[k] + (focus ? "  (เรื่องที่ถาม)" : ""), X + pad + (focus ? 6 : 0), y);
        }
        ctx.font = "500 40px 'IBM Plex Sans Thai Looped', sans-serif"; ctx.fillStyle = "#22253a";
        lines.forEach((ln) => { y += 58; if (draw) ctx.fillText(ln, X + pad + (focus ? 6 : 0), y); });
        y += 30;
      });
      y += 10;
      ctx.font = "500 40px 'IBM Plex Sans Thai Looped', sans-serif";
      const tip = wrapLines(ctx, "คำแนะนำ  " + f.tip, inner);
      tip.forEach((ln, i) => {
        y += 58;
        if (draw) {
          if (i === 0) {
            ctx.font = "600 40px 'IBM Plex Sans Thai Looped', sans-serif"; ctx.fillStyle = "#5a2e12";
            const head = "คำแนะนำ  "; ctx.fillText(head, X + pad, y);
            const hw = ctx.measureText(head).width;
            ctx.font = "500 40px 'IBM Plex Sans Thai Looped', sans-serif"; ctx.fillStyle = "#22253a";
            ctx.fillText(ln.replace(/^คำแนะนำ\s*/, ""), X + pad + hw, y);
          } else { ctx.fillStyle = "#22253a"; ctx.fillText(ln, X + pad, y); }
        }
      });
      return y + pad;
    }
    const h0 = layout(false, 0), Hc = Math.min(h0, 1260), y0 = Math.max(470, Math.round(470 + (1690 - 470 - Hc) / 2));
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,.55)"; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    ctx.fillStyle = "#efe4cb";
    ctx.beginPath(); ctx.roundRect(X, y0, Wc, Hc, 12); ctx.fill();
    ctx.restore();
    if (opts.paper) {
      try {
        const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = opts.paper; });
        ctx.save(); ctx.beginPath(); ctx.roundRect(X, y0, Wc, Hc, 12); ctx.clip();
        ctx.fillStyle = ctx.createPattern(img, "repeat"); ctx.globalAlpha = 0.9; ctx.fillRect(X, y0, Wc, Hc); ctx.restore();
      } catch (e) {}
    }
    layout(true, y0);

    const t = 1.3;
    ctx.globalCompositeOperation = "lighter";
    [[150, 1790], [930, 1790]].forEach(([x, y]) => { ctx.globalAlpha = 0.6; ctx.drawImage(A.glow, x - 140, y - 160, 280, 280); });
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
    [[150, 1790], [930, 1790]].forEach(([x, y], i) => { ctx.fillStyle = "#efe2c4"; ctx.fillRect(x - 12, y - 10, 24, 70); A.flame(ctx, x, y - 16, 1.8, t, i); });
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(243,233,210,.75)"; ctx.font = "500 36px 'IBM Plex Sans Thai Looped', sans-serif";
    ctx.fillText("เสี่ยงเซียมซีและลอยกระทงได้ที่", W / 2, 1790);
    ctx.fillStyle = "#f6c26b"; ctx.font = "600 42px 'IBM Plex Sans Thai Looped', sans-serif";
    ctx.fillText(opts.url || location.host + location.pathname.replace(/index\.html$/, ""), W / 2, 1850);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  window.LKSiamsi = { FORTUNES, LEVEL, TOPICS, randomNumber, Stage, storyImage };
})();
