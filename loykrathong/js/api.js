/* ลอยกระทง — ชั้นเชื่อมต่อข้อมูล (Supabase หรือโหมดตัวอย่างในเครื่อง) */
(function () {
  "use strict";
  const cfg = window.LK_CONFIG || {};
  const configured = !!(cfg.SUPABASE_URL && cfg.SUPABASE_KEY && /^https:\/\//.test(cfg.SUPABASE_URL));
  const SB_SRC = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.116.0";
  const COLS = "id,name,base,flower,sathu_count,created_at,is_public,public_wish,lucky"; // ไม่ดึงคำอธิษฐาน (เป็นความลับ)

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    const b = new Uint8Array(16);
    (window.crypto || {}).getRandomValues ? crypto.getRandomValues(b) : b.forEach((_, i) => (b[i] = Math.random() * 256));
    b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
    const h = [...b].map((x) => x.toString(16).padStart(2, "0")).join("");
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  }

  let deviceId = store.get("lk-device", null);
  if (!deviceId) { deviceId = uuid().replace(/-/g, ""); store.set("lk-device", deviceId); }

  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src; s.async = true; s.onload = res; s.onerror = () => rej(new Error("load"));
      document.head.appendChild(s);
    });
  }

  let clientP = null;
  function client(opts = {}) {
    if (!configured) return Promise.resolve(null);
    if (!clientP) {
      clientP = (window.supabase ? Promise.resolve() : loadScript(SB_SRC)).then(() =>
        window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_KEY, {
          auth: { persistSession: !!opts.auth, autoRefreshToken: !!opts.auth, detectSessionInUrl: !!opts.auth },
          realtime: { params: { eventsPerSecond: 5 } },
        }));
    }
    return clientP;
  }

  class LKError extends Error {
    constructor(kind, msg) { super(msg || kind); this.kind = kind; }
  }
  function mapError(err) {
    const m = ((err && (err.message || "")) + " " + ((err && err.hint) || "")).toUpperCase();
    if (m.includes("CLOSED")) return new LKError("closed");
    if (m.includes("RATE_LIMIT")) return new LKError("rate");
    if (err && err.code === "23505") return new LKError("duplicate");
    if (err && (err.code === "23514" || err.code === "22001")) return new LKError("invalid");
    return new LKError("network", err && err.message);
  }

  /* ---------- โหมดตัวอย่าง ---------- */
  const SAMPLE = [
    ["แพรวา", "ขอให้แม่หายป่วยไว ๆ กลับมาทำกับข้าวให้กินอีก", "banana", "marigold"],
    ["ต้นกล้า", "ขอให้ติดคณะที่ตั้งใจไว้", "lotus", "lotus"],
    ["", "ขอให้ปีหน้าใจดีกับเราหน่อยนะ", "bread", "jasmine"],
    ["มุก", "ขอให้ร้านขายดี ลูกค้าแน่นทุกวัน", "banana", "rose"],
    ["บอสกับฝน", "ขอให้รักกันไปนาน ๆ ทะเลาะกันน้อยลง", "coconut", "orchid"],
    ["ยายจันทร์", "ขอให้ลูกหลานเดินทางปลอดภัย", "banana", "jasmine"],
    ["ภูมิ", "ขอขมาพระแม่คงคา ขอให้แม่น้ำใสสะอาด", "bread", "marigold"],
    ["ไอซ์", "ขอให้ได้งานภายในเดือนนี้", "lotus", "rose"],
    ["น้ำหวาน", "ขอให้สอบผ่านทุกวิชา เกรดออกมาสวย", "banana", "orchid"],
    ["พี่หมี", "ขอให้ทุกคนในบ้านแข็งแรง", "coconut", "marigold"],
    ["", "ลอยเรื่องเศร้าไปกับน้ำ พรุ่งนี้เริ่มใหม่", "lotus", "jasmine"],
    ["เฟิร์น", "ขอให้ได้ไปเที่ยวญี่ปุ่นกับเพื่อนปีหน้า", "banana", "lotus"],
  ];
  function demoAll() {
    let list = store.get("lk-demo", null);
    if (!list) {
      const now = Date.now();
      list = SAMPLE.map(([name, wish, base, flower], i) => ({
        id: uuid(), name, wish, base, flower, sathu_count: (i * 7) % 13, is_public: i % 3 === 0, public_wish: i % 3 === 0 ? wish : null, lucky: i === 4,
        created_at: new Date(now - (i * 23 + 4) * 60000).toISOString(), sample: true,
      }));
      store.set("lk-demo", list);
    }
    return list;
  }

  /* ---------- API ---------- */
  const listeners = new Set();
  let channel = null;

  const api = {
    configured,
    deviceId,
    client,
    LKError,
    store,

    async settings() {
      const fallback = { event_name: "ลอยกระทง", tagline: "ลอยทุกข์ให้ไปกับสายน้ำ ฝากความหวังไว้กับแสงเทียน", announcement: "", is_open: true, require_approval: false };
      const c = await client();
      if (!c) return { ...fallback, ...store.get("lk-demo-settings", {}) };
      const { data, error } = await c.from("settings").select("event_name,tagline,announcement,is_open,require_approval").eq("id", 1).maybeSingle();
      if (error || !data) return fallback;
      return data;
    },

    async list(limit = 160) {
      const c = await client();
      if (!c) return demoAll().filter((r) => (r.status || "visible") === "visible")
        .map(({ wish, ...r }) => r)
        .sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, limit);
      const { data, error } = await c.from("krathongs").select(COLS).eq("status", "visible")
        .order("created_at", { ascending: false }).limit(limit);
      if (error) throw mapError(error);
      return data || [];
    },

    async count() {
      const c = await client();
      if (!c) return demoAll().filter((r) => (r.status || "visible") === "visible").length;
      const { count, error } = await c.from("krathongs").select("id", { count: "exact", head: true }).eq("status", "visible");
      if (error) return null;
      return count;
    },

    async float({ name, wish, base, flower, is_public, lucky }) {
      const rec = { id: uuid(), name: (name || "").trim().slice(0, 30), wish: (wish || "").trim().slice(0, 140), base, flower, is_public: !!is_public, lucky: !!lucky };
      const c = await client();
      if (!c) {
        const list = demoAll();
        const ds = store.get("lk-demo-settings", {});
        if (ds.is_open === false) throw new LKError("closed");
        const words = store.get("lk-demo-words", []);
        const text = (rec.name + " " + rec.wish).toLowerCase();
        const flagged = words.some((w) => text.includes(String(w).toLowerCase()));
        const full = { ...rec, public_wish: rec.is_public ? rec.wish : null, sathu_count: 0, created_at: new Date().toISOString(),
          status: flagged || ds.require_approval ? "pending" : "visible", flagged };
        list.unshift(full);
        store.set("lk-demo", list.slice(0, 300));
        api.saveMine(full);
        return full;
      }
      const { error } = await c.from("krathongs").insert(rec);
      if (error) throw mapError(error);
      const full = { ...rec, public_wish: rec.is_public ? rec.wish : null, sathu_count: 0, created_at: new Date().toISOString() };
      api.saveMine(full);
      return full;
    },

    async sathu(id) {
      const done = store.get("lk-sathu", []);
      if (done.includes(id)) throw new LKError("duplicate");
      const c = await client();
      if (c) {
        const { error } = await c.from("sathus").insert({ krathong_id: id, device_id: deviceId });
        if (error) {
          const e = mapError(error);
          if (e.kind === "duplicate") { done.push(id); store.set("lk-sathu", done.slice(-500)); }
          throw e;
        }
      } else {
        const list = demoAll();
        const k = list.find((x) => x.id === id);
        if (k) { k.sathu_count = (k.sathu_count || 0) + 1; store.set("lk-demo", list); }
      }
      done.push(id); store.set("lk-sathu", done.slice(-500));
    },

    demoAll,
    /* กระทงของฉัน: เก็บคำอธิษฐานไว้ในเครื่องเจ้าของเท่านั้น */
    saveMine(rec) {
      const L = store.get("lk-mine-recs", []).filter((r) => r.id !== rec.id);
      L.unshift({ id: rec.id, name: rec.name, wish: rec.wish, base: rec.base, flower: rec.flower, is_public: !!rec.is_public, lucky: !!rec.lucky, created_at: rec.created_at });
      store.set("lk-mine-recs", L.slice(0, 100));
    },
    mine() { return store.get("lk-mine-recs", []); },
    myRec(id) { return store.get("lk-mine-recs", []).find((r) => r.id === id) || null; },

    async logSiamsi(n) {
      const c = await client();
      if (!c) { const L = store.get("lk-demo-siamsi", []); L.push({ n, t: Date.now() }); store.set("lk-demo-siamsi", L.slice(-500)); return; }
      const { error } = await c.from("siamsi_draws").insert({ number: n });
      if (error) throw mapError(error);
    },

    hasSathu(id) { return store.get("lk-sathu", []).includes(id); },

    /* handlers: { upsert(rec), remove(id), status(state) } */
    async subscribe(handlers) {
      listeners.add(handlers);
      const c = await client();
      if (!c || channel) return;
      channel = c.channel("river")
        .on("postgres_changes", { event: "*", schema: "public", table: "krathongs" }, (p) => {
          listeners.forEach((h) => {
            if (p.eventType === "DELETE") h.remove && h.remove(p.old && p.old.id);
            else if (p.new && p.new.status === "visible") h.upsert && h.upsert(p.new);
            else if (p.new) h.remove && h.remove(p.new.id);
          });
        })
        .subscribe((state) => listeners.forEach((h) => h.status && h.status(state)));
    },
  };

  window.LKApi = api;
})();
