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

  /* ---------- กระบอกเซียมซี ---------- */
  class Canister {
    constructor(canvas) {
      this.c = canvas;
      this.ctx = canvas.getContext("2d");
      this.state = "idle";
      this.t0 = performance.now();
      this.number = 0;
      const rnd = window.LKArt.rngFrom("siamsi-sticks");
      this.sticks = Array.from({ length: 26 }, () => ({ x: rnd() * 2 - 1, len: 0.55 + rnd() * 0.45, lean: (rnd() - 0.5) * 0.18, d: rnd() }));
      this.sticks.sort((a, b) => a.d - b.d);
      this.raf = 0;
      this.loop = this.loop.bind(this);
    }
    start() { cancelAnimationFrame(this.raf); this.raf = requestAnimationFrame(this.loop); }
    stop() { cancelAnimationFrame(this.raf); }
    shake(number, onRise, onDone) {
      this.state = "shaking"; this.number = number; this.shakeAt = performance.now();
      this.onRise = onRise; this.onDone = onDone; this.risen = false;
    }
    reset() { this.state = "idle"; this.number = 0; }
    loop(now) {
      this.raf = requestAnimationFrame(this.loop);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.c.clientWidth, h = this.c.clientHeight;
      if (!w || !h) return;
      if (this.c.width !== Math.round(w * dpr)) { this.c.width = Math.round(w * dpr); this.c.height = Math.round(h * dpr); }
      const ctx = this.ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = (now - this.t0) / 1000;
      // พื้นหลัง
      let g = ctx.createRadialGradient(w / 2, h * 0.75, 10, w / 2, h * 0.6, Math.max(w, h) * 0.7);
      g.addColorStop(0, "#2a2035"); g.addColorStop(0.55, "#121a30"); g.addColorStop(1, "#0a1122");
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      [[0.16, 0.86], [0.84, 0.86]].forEach(([px, py], i) => {
        const f = 0.85 + 0.15 * Math.sin(t * 11 + i * 2);
        ctx.globalAlpha = 0.5 * f;
        ctx.drawImage(window.LKArt.glow, w * px - 70, h * py - 80, 140, 140);
      });
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = "source-over";
      [[0.16, 0.86], [0.84, 0.86]].forEach(([px, py], i) => {
        ctx.fillStyle = "#efe2c4"; ctx.fillRect(w * px - 5, h * py - 6, 10, 26);
        window.LKArt.flame(ctx, w * px, h * py - 9, 0.75, t, i * 3);
      });
      ctx.fillStyle = "rgba(0,0,0,.35)";
      ctx.beginPath(); ctx.ellipse(w / 2, h * 0.93, w * 0.17, 8, 0, 0, Math.PI * 2); ctx.fill();

      // การเคลื่อนไหว
      let ang = Math.sin(t * 1.3) * 0.015, jx = 0, rise = 0;
      if (this.state === "shaking") {
        const a = (now - this.shakeAt) / 1000;
        const env = Math.min(1, a * 4) * (a < 1.7 ? 1 : Math.max(0, 1 - (a - 1.7) * 3));
        ang = Math.sin(a * 34) * 0.2 * env;
        jx = Math.sin(a * 17) * 6 * env;
        if (a > 1.9 && !this.risen) { this.risen = true; this.riseAt = now; this.state = "rising"; this.onRise && this.onRise(); }
      }
      if (this.state === "rising" || this.state === "done") {
        const r = Math.min(1, (now - this.riseAt) / 900);
        rise = 1 - Math.pow(1 - r, 3);
        if (r >= 1 && this.state === "rising") { this.state = "done"; this.onDone && this.onDone(); }
      }

      const cw = Math.min(w * 0.3, 140), ch = Math.min(h * 0.5, 230);
      const cx = w / 2 + jx, by = h * 0.93;
      ctx.save();
      ctx.translate(cx, by); ctx.rotate(ang);
      const top = -ch, rx = cw / 2, ry = cw * 0.16;
      // ปากกระบอกด้านใน
      ctx.fillStyle = "#2a0d0b";
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, 0, Math.PI * 2); ctx.fill();
      // ไม้เซียมซี
      const shaking = this.state === "shaking";
      this.sticks.forEach((s, i) => {
        const jitter = shaking ? Math.sin(now / 35 + i * 1.7) * 7 : 0;
        const x0 = s.x * rx * 0.72, len = ch * 0.42 * s.len;
        this.stick(ctx, x0, top + ry * 0.6 + 40, x0 + s.lean * len, top - len + jitter, false);
      });
      if (this.number && rise > 0) {
        const len = ch * 0.42 + ch * 0.62 * rise;
        this.stick(ctx, 0, top + 40, 4, top - len, true);
      }
      // ตัวกระบอก
      g = ctx.createLinearGradient(-rx, 0, rx, 0);
      g.addColorStop(0, "#4e0f0d"); g.addColorStop(0.28, "#b3322a"); g.addColorStop(0.45, "#cf4a3b"); g.addColorStop(0.75, "#8e1f1a"); g.addColorStop(1, "#3f0b0a");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-rx, top);
      ctx.ellipse(0, top, rx, ry, 0, Math.PI, 0, true);
      ctx.lineTo(rx, -ry);
      ctx.ellipse(0, -ry, rx, ry, 0, 0, Math.PI, false);
      ctx.closePath(); ctx.fill();
      // แถบทอง + ลาย
      [top + ch * 0.1, -ch * 0.2].forEach((y) => {
        const bh = ch * 0.07;
        const gg = ctx.createLinearGradient(-rx, 0, rx, 0);
        gg.addColorStop(0, "#6b4a1c"); gg.addColorStop(0.35, "#e9c66f"); gg.addColorStop(0.55, "#f7dd92"); gg.addColorStop(1, "#5e3f16");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.ellipse(0, y + bh, rx, ry, 0, 0, Math.PI, false);
        ctx.lineTo(-rx, y);
        ctx.ellipse(0, y, rx, ry, 0, Math.PI, 0, true);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "rgba(90,40,10,.55)"; ctx.lineWidth = 1;
        for (let k = -6; k <= 6; k++) {
          const px = (k / 6.5) * rx, yy = y + bh / 2 + ry * Math.sqrt(Math.max(0, 1 - (px / rx) ** 2));
          ctx.beginPath(); ctx.moveTo(px - 4, yy); ctx.lineTo(px, yy - bh * 0.32); ctx.lineTo(px + 4, yy); ctx.lineTo(px, yy + bh * 0.32); ctx.closePath(); ctx.stroke();
        }
      });
      // ตัวอักษรบนกระบอก
      ctx.fillStyle = "rgba(247,221,146,.9)";
      ctx.font = `700 ${Math.round(cw * 0.26)}px Charm, serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("เซียมซี", 0, top + ch * 0.48);
      // ขอบปาก
      ctx.strokeStyle = "#e9c66f"; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, 0, Math.PI, false); ctx.stroke();
      ctx.strokeStyle = "rgba(233,198,111,.5)";
      ctx.beginPath(); ctx.ellipse(0, top, rx, ry, 0, Math.PI, Math.PI * 2, false); ctx.stroke();
      // ประกายเงา
      ctx.fillStyle = "rgba(255,255,255,.08)";
      ctx.fillRect(-rx * 0.55, top + ch * 0.05, rx * 0.16, ch * 0.85);
      ctx.restore();

      // ป้ายเลข
      if (this.number && rise > 0.85) {
        const a = Math.min(1, (rise - 0.85) / 0.15);
        const len = ch * 0.42 + ch * 0.62 * rise;
        const tx = cx + Math.sin(ang) * len + 4, ty = by - ch - len - 4;
        ctx.globalAlpha = a;
        ctx.fillStyle = "#f6c26b";
        ctx.beginPath(); ctx.arc(tx + 30, ty + 12, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#1b1f33";
        ctx.font = "700 22px 'IBM Plex Sans Thai Looped', sans-serif";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(Number(this.number).toLocaleString("th-TH-u-nu-thai"), tx + 30, ty + 13);
        ctx.globalAlpha = 1;
      }
    }
    stick(ctx, x0, y0, x1, y1, chosen) {
      const g = ctx.createLinearGradient(x0 - 3, 0, x0 + 3, 0);
      g.addColorStop(0, chosen ? "#b98d4a" : "#9c7a44"); g.addColorStop(0.5, chosen ? "#f3d9a0" : "#d8b878"); g.addColorStop(1, "#8a6a38");
      ctx.strokeStyle = g; ctx.lineWidth = chosen ? 6 : 4.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      const k = 0.13;
      ctx.strokeStyle = "#b02a22";
      ctx.beginPath(); ctx.moveTo(x1 + (x0 - x1) * k, y1 + (y0 - y1) * k); ctx.lineTo(x1, y1); ctx.stroke();
      if (chosen) {
        ctx.save();
        ctx.globalCompositeOperation = "lighter"; ctx.globalAlpha = 0.5;
        ctx.drawImage(window.LKArt.softGlow, x1 - 40, y1 - 40, 80, 80);
        ctx.restore();
      }
    }
  }

  window.LKSiamsi = { FORTUNES, LEVEL, randomNumber, Canister };
})();
