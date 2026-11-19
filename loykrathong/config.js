/* ===================================================================
   ตั้งค่าการเชื่อมต่อ Supabase
   เอาค่ามาจาก Supabase Dashboard → Project Settings → API Keys
   - SUPABASE_URL  : Project URL  (https://xxxx.supabase.co)
   - SUPABASE_KEY  : Publishable key (sb_publishable_...) หรือ anon key
   ห้ามใส่ secret key / service_role key ในไฟล์นี้เด็ดขาด
   ถ้าเว้นว่างไว้ เว็บจะทำงานแบบ "โหมดตัวอย่าง" (เก็บข้อมูลในเครื่องเท่านั้น)
   =================================================================== */
window.LK_CONFIG = {
  SUPABASE_URL: "",
  SUPABASE_KEY: "",
};
