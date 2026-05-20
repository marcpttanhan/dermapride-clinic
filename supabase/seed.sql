-- ============================================================
-- DermaPride Clinics — Seed Data
-- Run: supabase db reset --linked  (resets + re-runs migrations + seed)
-- Or:  psql <connection-string> -f supabase/seed.sql
-- ============================================================

-- Admin user (password: admin123  — CHANGE IN PRODUCTION)
-- Hash generated with: bcryptjs.hashSync('admin123', 12)
INSERT INTO admin_users (email, password_hash, role, name) VALUES
  ('admin@dermapride.com',
   '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGniYE6Qvd4cPMHN8mFN8C1FzUa',
   'admin', 'Admin');

-- ── Site Settings ──────────────────────────────────────────

INSERT INTO site_settings (key, draft_value, published_value) VALUES

('home.hero', '{
  "kicker": "Reel 01 · A Pride of Skin",
  "l1": "คลินิกความงาม",
  "l2": "ที่สร้างเสน่ห์.",
  "l3": "ด้วยความซื่อตรง และหลักการแห่งสุนทรียศิลป์",
  "side": "DermaPride Clinics — คลินิกที่ผสานศาสตร์ของแพทย์เข้ากับสุนทรียศิลป์ เพื่อสร้างเสน่ห์อันเป็นเอกลักษณ์บนใบหน้าคุณ",
  "ctaPrimary": "จองคิวปรึกษาฟรี",
  "ctaPrimaryHref": "#booking",
  "ctaSecondary": "ทักหา Facebook",
  "ctaSecondaryHref": "https://www.facebook.com/DermaPrideClinic/",
  "backgroundImage": "/assets/welcome-hero.jpg"
}', '{
  "kicker": "Reel 01 · A Pride of Skin",
  "l1": "คลินิกความงาม",
  "l2": "ที่สร้างเสน่ห์.",
  "l3": "ด้วยความซื่อตรง และหลักการแห่งสุนทรียศิลป์",
  "side": "DermaPride Clinics — คลินิกที่ผสานศาสตร์ของแพทย์เข้ากับสุนทรียศิลป์ เพื่อสร้างเสน่ห์อันเป็นเอกลักษณ์บนใบหน้าคุณ",
  "ctaPrimary": "จองคิวปรึกษาฟรี",
  "ctaPrimaryHref": "#booking",
  "ctaSecondary": "ทักหา Facebook",
  "ctaSecondaryHref": "https://www.facebook.com/DermaPrideClinic/",
  "backgroundImage": "/assets/welcome-hero.jpg"
}'),

('home.doctor', '{
  "role": "Founder · Aesthetic Physician",
  "name": "Dr. Arpa Sungkanukit, M.D.",
  "nameTh": "พญ.อาภา สังขนุกิจ",
  "license": "ว.26433",
  "quote": "\"แตกต่าง ไม่ได้แปลว่าแปลก — เพียงแค่เรามีรสนิยม และเอกลักษณ์ในแบบของตัวเอง.\"",
  "bio": "แพทย์ผู้ก่อตั้ง DermaPride Clinics ผู้เชื่อในแนวคิด Integrity meets Artistry ดูแลคนไข้กว่า 50,000 เคส เน้นการวิเคราะห์โครงหน้าเป็นรายบุคคล เพื่อเสริมความงามให้ตรงจุด คงเอกลักษณ์ และเป็นธรรมชาติที่สุด",
  "image": "/assets/doctor.jpg",
  "specialization": "Botox · Filler · Facial Design",
  "certifications": "Allergan · Galderma",
  "experience": "12+ years · 50,000+ cases",
  "verificationUrl": "https://www.mct.or.th/"
}', '{
  "role": "Founder · Aesthetic Physician",
  "name": "Dr. Arpa Sungkanukit, M.D.",
  "nameTh": "พญ.อาภา สังขนุกิจ",
  "license": "ว.26433",
  "quote": "\"แตกต่าง ไม่ได้แปลว่าแปลก — เพียงแค่เรามีรสนิยม และเอกลักษณ์ในแบบของตัวเอง.\"",
  "bio": "แพทย์ผู้ก่อตั้ง DermaPride Clinics ผู้เชื่อในแนวคิด Integrity meets Artistry ดูแลคนไข้กว่า 50,000 เคส เน้นการวิเคราะห์โครงหน้าเป็นรายบุคคล เพื่อเสริมความงามให้ตรงจุด คงเอกลักษณ์ และเป็นธรรมชาติที่สุด",
  "image": "/assets/doctor.jpg",
  "specialization": "Botox · Filler · Facial Design",
  "certifications": "Allergan · Galderma",
  "experience": "12+ years · 50,000+ cases",
  "verificationUrl": "https://www.mct.or.th/"
}'),

('home.contact', '{
  "phone": "065-859-8599",
  "facebook": "https://www.facebook.com/DermaPrideClinic/",
  "line": "",
  "instagram": ""
}', '{
  "phone": "065-859-8599",
  "facebook": "https://www.facebook.com/DermaPrideClinic/",
  "line": "",
  "instagram": ""
}'),

('home.branches', '[
  {
    "name": "DermaPride · วัชรพล",
    "address": "ถนนวัชรพล กรุงเทพมหานคร",
    "license": "12101005467",
    "phone": "065-859-8599",
    "image1": "/assets/clinic-watcharaphon-1.jpg",
    "image2": "/assets/clinic-watcharaphon-2.jpg",
    "image3": "/assets/in-clinic.jpg",
    "mapUrl": "https://www.google.com/maps/place/DermaPride+Clinics/@13.8792187,100.6415179,17z",
    "mapEmbed": "https://www.google.com/maps?q=DermaPride+Clinics+Watcharaphon+13.8792187,100.6415179&output=embed",
    "extra1Label": "Parking", "extra1Value": "ฟรี · จอดสะดวก",
    "extra2Label": "Access",  "extra2Value": "ใกล้ทางด่วน"
  },
  {
    "name": "DermaPride · ราชพฤกษ์",
    "address": "อมอร์ วิลเลจ ราชพฤกษ์ นนทบุรี",
    "license": "10101033360",
    "phone": "065-859-8599",
    "image1": "/assets/clinic-ratchapruk-1.jpg",
    "image2": "/assets/clinic-ratchapruk-2.jpg",
    "image3": "/assets/clinic-ratchapruk-3.jpg",
    "mapUrl": "https://www.google.com/maps/place/DermaPride+Clinics+%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2/@13.9226954,100.4487628,17z",
    "mapEmbed": "https://www.google.com/maps?q=DermaPride+Clinics+Ratchapruek+13.9226954,100.4487628&output=embed",
    "extra1Label": "Style",  "extra1Value": "บูทีค · เงียบสงบ",
    "extra2Label": "Access", "extra2Value": "MRT สายสีม่วง"
  }
]', '[
  {
    "name": "DermaPride · วัชรพล",
    "address": "ถนนวัชรพล กรุงเทพมหานคร",
    "license": "12101005467",
    "phone": "065-859-8599",
    "image1": "/assets/clinic-watcharaphon-1.jpg",
    "image2": "/assets/clinic-watcharaphon-2.jpg",
    "image3": "/assets/in-clinic.jpg",
    "mapUrl": "https://www.google.com/maps/place/DermaPride+Clinics/@13.8792187,100.6415179,17z",
    "mapEmbed": "https://www.google.com/maps?q=DermaPride+Clinics+Watcharaphon+13.8792187,100.6415179&output=embed",
    "extra1Label": "Parking", "extra1Value": "ฟรี · จอดสะดวก",
    "extra2Label": "Access",  "extra2Value": "ใกล้ทางด่วน"
  },
  {
    "name": "DermaPride · ราชพฤกษ์",
    "address": "อมอร์ วิลเลจ ราชพฤกษ์ นนทบุรี",
    "license": "10101033360",
    "phone": "065-859-8599",
    "image1": "/assets/clinic-ratchapruk-1.jpg",
    "image2": "/assets/clinic-ratchapruk-2.jpg",
    "image3": "/assets/clinic-ratchapruk-3.jpg",
    "mapUrl": "https://www.google.com/maps/place/DermaPride+Clinics+%E0%B8%AA%E0%B8%B2%E0%B8%82%E0%B8%B2/@13.9226954,100.4487628,17z",
    "mapEmbed": "https://www.google.com/maps?q=DermaPride+Clinics+Ratchapruek+13.9226954,100.4487628&output=embed",
    "extra1Label": "Style",  "extra1Value": "บูทีค · เงียบสงบ",
    "extra2Label": "Access", "extra2Value": "MRT สายสีม่วง"
  }
]'),

('home.hours', '[
  {"day":"Monday",    "th":"วันจันทร์",    "open":"",      "close":"",      "closed":true},
  {"day":"Tuesday",   "th":"วันอังคาร",    "open":"",      "close":"",      "closed":true},
  {"day":"Wednesday", "th":"วันพุธ",       "open":"10:00", "close":"19:00", "closed":false},
  {"day":"Thursday",  "th":"วันพฤหัสบดี",  "open":"",      "close":"",      "closed":true},
  {"day":"Friday",    "th":"วันศุกร์",     "open":"10:00", "close":"19:00", "closed":false},
  {"day":"Saturday",  "th":"วันเสาร์",     "open":"10:00", "close":"14:00", "closed":false},
  {"day":"Sunday",    "th":"วันอาทิตย์",   "open":"10:00", "close":"14:00", "closed":false}
]', '[
  {"day":"Monday",    "th":"วันจันทร์",    "open":"",      "close":"",      "closed":true},
  {"day":"Tuesday",   "th":"วันอังคาร",    "open":"",      "close":"",      "closed":true},
  {"day":"Wednesday", "th":"วันพุธ",       "open":"10:00", "close":"19:00", "closed":false},
  {"day":"Thursday",  "th":"วันพฤหัสบดี",  "open":"",      "close":"",      "closed":true},
  {"day":"Friday",    "th":"วันศุกร์",     "open":"10:00", "close":"19:00", "closed":false},
  {"day":"Saturday",  "th":"วันเสาร์",     "open":"10:00", "close":"14:00", "closed":false},
  {"day":"Sunday",    "th":"วันอาทิตย์",   "open":"10:00", "close":"14:00", "closed":false}
]'),

('home.philosophy', '{
  "kicker": "มาตรฐาน 4 แท้",
  "title": "มาตรฐาน [4 แท้]\nคือคำมั่นของเรา.",
  "sub": "คำสัญญาที่เราตั้งเป็นมาตรฐานคลินิก — ใช่ยาของแท้ที่ตรวจสอบได้ ใช้แพทย์ที่มีใบประกอบวิชาชีพ ใช้ขั้นตอนตามมาตรฐานสากล และยืนยันราคาก่อนทำหัตถการเสมอ",
  "items": [
    {"id":"pl_1","title":"Real Medicine","titleTh":"ยาแท้","body":"ทุกขวด ทุกซอง ทุก lot — มีเลข อย. และนำเข้าโดยตรงจากตัวแทนผู้ผลิต ตรวจสอบได้ที่เคาน์เตอร์ก่อนเปิดใช้","visible":true},
    {"id":"pl_2","title":"Real Doctor","titleTh":"หมอแท้","body":"หัตถการทุกขั้นตอนทำโดยแพทย์ผู้มีใบประกอบวิชาชีพเวชกรรม ที่ผ่านการอบรมจาก Allergan และ Galderma โดยตรง","visible":true},
    {"id":"pl_3","title":"Real Protocol","titleTh":"ขั้นตอนแท้","body":"ปรึกษา · วินิจฉัย · ทำหัตถการ · ดูแลหลังทำ — ยึดตามมาตรฐานการแพทย์อย่างเคร่งครัด ทุกขั้นตอนปลอดภัยและสะอาด","visible":true},
    {"id":"pl_4","title":"Real Price","titleTh":"ราคาแท้","body":"ราคาโปร่งใส ตรวจสอบได้ ไม่มีค่าใช้จ่ายแอบแฝง ยืนยันราคาเป็นลายลักษณ์อักษรก่อนเริ่มทุกหัตถการ","visible":true}
  ]
}', '{
  "kicker": "มาตรฐาน 4 แท้",
  "title": "มาตรฐาน [4 แท้]\nคือคำมั่นของเรา.",
  "sub": "คำสัญญาที่เราตั้งเป็นมาตรฐานคลินิก — ใช่ยาของแท้ที่ตรวจสอบได้ ใช้แพทย์ที่มีใบประกอบวิชาชีพ ใช้ขั้นตอนตามมาตรฐานสากล และยืนยันราคาก่อนทำหัตถการเสมอ",
  "items": [
    {"id":"pl_1","title":"Real Medicine","titleTh":"ยาแท้","body":"ทุกขวด ทุกซอง ทุก lot — มีเลข อย. และนำเข้าโดยตรงจากตัวแทนผู้ผลิต ตรวจสอบได้ที่เคาน์เตอร์ก่อนเปิดใช้","visible":true},
    {"id":"pl_2","title":"Real Doctor","titleTh":"หมอแท้","body":"หัตถการทุกขั้นตอนทำโดยแพทย์ผู้มีใบประกอบวิชาชีพเวชกรรม ที่ผ่านการอบรมจาก Allergan และ Galderma โดยตรง","visible":true},
    {"id":"pl_3","title":"Real Protocol","titleTh":"ขั้นตอนแท้","body":"ปรึกษา · วินิจฉัย · ทำหัตถการ · ดูแลหลังทำ — ยึดตามมาตรฐานการแพทย์อย่างเคร่งครัด ทุกขั้นตอนปลอดภัยและสะอาด","visible":true},
    {"id":"pl_4","title":"Real Price","titleTh":"ราคาแท้","body":"ราคาโปร่งใส ตรวจสอบได้ ไม่มีค่าใช้จ่ายแอบแฝง ยืนยันราคาเป็นลายลักษณ์อักษรก่อนเริ่มทุกหัตถการ","visible":true}
  ]
}'),

('home.results', '{
  "items": [
    {"id":"rs_1","image":"/assets/ba-3.jpg","title":"โปรแกรมฟิลเลอร์ใต้ตา","summary":"แก้ปัญหาใต้ตาคล้ำดูสดใส เพิ่มมิติให้กระบอกตา ลดร่องลึกใต้ตา","treatment":"ฟิลเลอร์ใต้ตา","amount":"1 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_2","image":"/assets/ba-1.jpg","title":"Restylane Full Face","summary":"ฟิลเลอร์ Restylane เติมเต็มได้ตรงจุด เพิ่มมิติให้ใบหน้า ทำให้ใบหน้าดูมีมุมมากขึ้น","treatment":"Restylane Filler","amount":"2 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_3","image":"/assets/ba-2.jpg","title":"ใต้ตาดำ → กระจ่างใส","summary":"เปลี่ยนใต้ตาดำคล้ำให้กระจ่างใสขึ้น ลดถุงใต้ตาที่ทำให้ดูบวม","treatment":"ฟิลเลอร์ใต้ตา + Skin Booster","amount":"3 cc","resultTime":"2 สัปดาห์","visible":true},
    {"id":"rs_4","image":"/assets/ba-5.jpg","title":"Babilone Neo One","summary":"สลายไขมัน พร้อมยกกระชับแบบขั้นสุด เห็นผลคูณ 2","treatment":"Babilone Neo One","amount":"—","resultTime":"4–6 สัปดาห์","visible":true},
    {"id":"rs_5","image":"/assets/ba-7.jpg","title":"ใต้ตา & ร่องแก้ม","summary":"โปรแกรมฟิลเลอร์ใต้ตา ร่องแก้ม — แก้ปัญหาใต้ตาดำคล้ำ","treatment":"ฟิลเลอร์ใต้ตา + ร่องแก้ม","amount":"3 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_6","image":"/assets/ba-10.jpg","title":"Meso Reverse Aging","summary":"ย้อนวัย พร้อมสร้างผิวกระจก — ฟื้นฟูผิวที่ดูโทรมให้กระจ่างใส มีออร่า","treatment":"Meso Reverse","amount":"—","resultTime":"3 ครั้ง","visible":true}
  ]
}', '{
  "items": [
    {"id":"rs_1","image":"/assets/ba-3.jpg","title":"โปรแกรมฟิลเลอร์ใต้ตา","summary":"แก้ปัญหาใต้ตาคล้ำดูสดใส เพิ่มมิติให้กระบอกตา ลดร่องลึกใต้ตา","treatment":"ฟิลเลอร์ใต้ตา","amount":"1 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_2","image":"/assets/ba-1.jpg","title":"Restylane Full Face","summary":"ฟิลเลอร์ Restylane เติมเต็มได้ตรงจุด เพิ่มมิติให้ใบหน้า ทำให้ใบหน้าดูมีมุมมากขึ้น","treatment":"Restylane Filler","amount":"2 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_3","image":"/assets/ba-2.jpg","title":"ใต้ตาดำ → กระจ่างใส","summary":"เปลี่ยนใต้ตาดำคล้ำให้กระจ่างใสขึ้น ลดถุงใต้ตาที่ทำให้ดูบวม","treatment":"ฟิลเลอร์ใต้ตา + Skin Booster","amount":"3 cc","resultTime":"2 สัปดาห์","visible":true},
    {"id":"rs_4","image":"/assets/ba-5.jpg","title":"Babilone Neo One","summary":"สลายไขมัน พร้อมยกกระชับแบบขั้นสุด เห็นผลคูณ 2","treatment":"Babilone Neo One","amount":"—","resultTime":"4–6 สัปดาห์","visible":true},
    {"id":"rs_5","image":"/assets/ba-7.jpg","title":"ใต้ตา & ร่องแก้ม","summary":"โปรแกรมฟิลเลอร์ใต้ตา ร่องแก้ม — แก้ปัญหาใต้ตาดำคล้ำ","treatment":"ฟิลเลอร์ใต้ตา + ร่องแก้ม","amount":"3 cc","resultTime":"เห็นผลทันที","visible":true},
    {"id":"rs_6","image":"/assets/ba-10.jpg","title":"Meso Reverse Aging","summary":"ย้อนวัย พร้อมสร้างผิวกระจก — ฟื้นฟูผิวที่ดูโทรมให้กระจ่างใส มีออร่า","treatment":"Meso Reverse","amount":"—","resultTime":"3 ครั้ง","visible":true}
  ]
}'),

('home.offers', '{
  "items": [
    {"id":"of_1","image":"/assets/slogan-2.jpg","title":"[First] Consultation","sub":"ปรึกษาแพทย์ + วิเคราะห์ผิวครั้งแรก","tag":"Signature","price":"ฟรี","was":"฿ 1,200","ctaHref":"#booking","visible":true},
    {"id":"of_2","image":"/assets/ba-5.jpg","title":"[Botox] Slim Face","sub":"โบท็อกซ์เรียวกราม Allergan","tag":"Limited","price":"฿ 3,900","was":"฿ 6,500","ctaHref":"#booking","visible":true},
    {"id":"of_3","image":"/assets/ba-4.jpg","title":"[Restylane] Under-eye","sub":"ฟิลเลอร์ใต้ตา 1 cc","tag":"Best Seller","price":"฿ 8,900","was":"฿ 12,000","ctaHref":"#booking","visible":true},
    {"id":"of_4","image":"/assets/ba-10.jpg","title":"[Meso] Reverse Aging","sub":"ย้อนวัย · ผิวกระจก","tag":"New","price":"฿ 2,500","was":"฿ 4,000","ctaHref":"#booking","visible":true},
    {"id":"of_5","image":"/assets/lifestyle-1.jpg","title":"[Vitamin] White Plus","sub":"วิตามินผิว IV Drip","tag":"Wellness","price":"฿ 1,290","was":"฿ 1,900","ctaHref":"#booking","visible":true}
  ]
}', '{
  "items": [
    {"id":"of_1","image":"/assets/slogan-2.jpg","title":"[First] Consultation","sub":"ปรึกษาแพทย์ + วิเคราะห์ผิวครั้งแรก","tag":"Signature","price":"ฟรี","was":"฿ 1,200","ctaHref":"#booking","visible":true},
    {"id":"of_2","image":"/assets/ba-5.jpg","title":"[Botox] Slim Face","sub":"โบท็อกซ์เรียวกราม Allergan","tag":"Limited","price":"฿ 3,900","was":"฿ 6,500","ctaHref":"#booking","visible":true},
    {"id":"of_3","image":"/assets/ba-4.jpg","title":"[Restylane] Under-eye","sub":"ฟิลเลอร์ใต้ตา 1 cc","tag":"Best Seller","price":"฿ 8,900","was":"฿ 12,000","ctaHref":"#booking","visible":true},
    {"id":"of_4","image":"/assets/ba-10.jpg","title":"[Meso] Reverse Aging","sub":"ย้อนวัย · ผิวกระจก","tag":"New","price":"฿ 2,500","was":"฿ 4,000","ctaHref":"#booking","visible":true},
    {"id":"of_5","image":"/assets/lifestyle-1.jpg","title":"[Vitamin] White Plus","sub":"วิตามินผิว IV Drip","tag":"Wellness","price":"฿ 1,290","was":"฿ 1,900","ctaHref":"#booking","visible":true}
  ]
}'),

('home.faq', '{
  "items": [
    {"id":"fq_1","q":"DermaPride ใช้ยา / ฟิลเลอร์ของแท้หรือไม่?","a":"แท้ 100% นำเข้าโดยตรงจากตัวแทนจำหน่ายของผู้ผลิต (Allergan, Galderma, AbbVie) ทุกขวดมีเลข อย. ตรวจสอบได้ที่หน้าเคาน์เตอร์ก่อนเริ่มหัตถการ","visible":true},
    {"id":"fq_2","q":"คุณหมอเป็นใคร? มีประสบการณ์มาแค่ไหน?","a":"พญ.อาภา สังขนุกิจ (เลขที่ใบประกอบฯ ว.26433) เป็นแพทย์ผู้ก่อตั้ง มีประสบการณ์ด้านความงามมากกว่า 12 ปี ดูแลเคสมาแล้วกว่า 50,000 เคส","visible":true},
    {"id":"fq_3","q":"ปรึกษาแพทย์ครั้งแรก มีค่าใช้จ่ายไหม?","a":"ฟรีค่ะ การปรึกษาและวิเคราะห์โครงหน้าครั้งแรกไม่มีค่าใช้จ่าย และไม่บังคับให้ทำหัตถการ","visible":true},
    {"id":"fq_4","q":"เจ็บไหม? ใช้เวลานานไหม?","a":"หัตถการส่วนใหญ่ใช้ยาชาเฉพาะที่ Botox ใช้เวลาประมาณ 15–20 นาที, Filler ประมาณ 30–45 นาที","visible":true},
    {"id":"fq_5","q":"ผ่อนชำระได้ไหม?","a":"ได้ค่ะ — ผ่อน 0% สูงสุด 12 เดือน ผ่านบัตรเครดิตที่ร่วมรายการ","visible":true},
    {"id":"fq_6","q":"ผลข้างเคียงที่ควรรู้?","a":"อาการบวมแดงเล็กน้อยที่จุดฉีดเป็นเรื่องปกติและจะหายภายใน 1–3 วัน","visible":true},
    {"id":"fq_7","q":"เปลี่ยนสาขาได้ไหม?","a":"ได้ค่ะ — ระบบของเราเชื่อมต่อกันทั้งสาขาวัชรพลและราชพฤกษ์ ประวัติการรักษาจะอยู่ในระบบเดียวกัน","visible":true}
  ]
}', '{
  "items": [
    {"id":"fq_1","q":"DermaPride ใช้ยา / ฟิลเลอร์ของแท้หรือไม่?","a":"แท้ 100% นำเข้าโดยตรงจากตัวแทนจำหน่ายของผู้ผลิต (Allergan, Galderma, AbbVie) ทุกขวดมีเลข อย. ตรวจสอบได้ที่หน้าเคาน์เตอร์ก่อนเริ่มหัตถการ","visible":true},
    {"id":"fq_2","q":"คุณหมอเป็นใคร? มีประสบการณ์มาแค่ไหน?","a":"พญ.อาภา สังขนุกิจ (เลขที่ใบประกอบฯ ว.26433) เป็นแพทย์ผู้ก่อตั้ง มีประสบการณ์ด้านความงามมากกว่า 12 ปี ดูแลเคสมาแล้วกว่า 50,000 เคส","visible":true},
    {"id":"fq_3","q":"ปรึกษาแพทย์ครั้งแรก มีค่าใช้จ่ายไหม?","a":"ฟรีค่ะ การปรึกษาและวิเคราะห์โครงหน้าครั้งแรกไม่มีค่าใช้จ่าย และไม่บังคับให้ทำหัตถการ","visible":true},
    {"id":"fq_4","q":"เจ็บไหม? ใช้เวลานานไหม?","a":"หัตถการส่วนใหญ่ใช้ยาชาเฉพาะที่ Botox ใช้เวลาประมาณ 15–20 นาที, Filler ประมาณ 30–45 นาที","visible":true},
    {"id":"fq_5","q":"ผ่อนชำระได้ไหม?","a":"ได้ค่ะ — ผ่อน 0% สูงสุด 12 เดือน ผ่านบัตรเครดิตที่ร่วมรายการ","visible":true},
    {"id":"fq_6","q":"ผลข้างเคียงที่ควรรู้?","a":"อาการบวมแดงเล็กน้อยที่จุดฉีดเป็นเรื่องปกติและจะหายภายใน 1–3 วัน","visible":true},
    {"id":"fq_7","q":"เปลี่ยนสาขาได้ไหม?","a":"ได้ค่ะ — ระบบของเราเชื่อมต่อกันทั้งสาขาวัชรพลและราชพฤกษ์ ประวัติการรักษาจะอยู่ในระบบเดียวกัน","visible":true}
  ]
}'),

('theme', '{
  "primary":     "#1A968F",
  "secondary":   "#E8A89E",
  "ink":         "#14242A",
  "paper":       "#FAF7F2",
  "radiusScale": 1,
  "fontScale":   1
}', '{
  "primary":     "#1A968F",
  "secondary":   "#E8A89E",
  "ink":         "#14242A",
  "paper":       "#FAF7F2",
  "radiusScale": 1,
  "fontScale":   1
}'),

('seo.home', '{
  "title":       "DermaPride · A Film of Integrity & Artistry",
  "description": "DermaPride Clinics · คลินิก4แท้ — เสน่ห์ที่สร้างจากความซื่อตรงและสุนทรียศิลป์ โดย พญ.อาภา สังขนุกิจ",
  "ogImage":     "/assets/banner.jpg"
}', '{
  "title":       "DermaPride · A Film of Integrity & Artistry",
  "description": "DermaPride Clinics · คลินิก4แท้ — เสน่ห์ที่สร้างจากความซื่อตรงและสุนทรียศิลป์ โดย พญ.อาภา สังขนุกิจ",
  "ogImage":     "/assets/banner.jpg"
}');

-- ── Procedures ─────────────────────────────────────────────
INSERT INTO procedures (slug, name, name_th, description, image_url, cta_text, sort_order) VALUES
  ('botox',        'Botox',        'โบท็อกซ์',      'โบท็อกซ์ · ลดริ้วรอย ปรับโครงหน้า',          '/assets/slogan-1.jpg',     'ดูรายละเอียด', 1),
  ('filler',       'Filler',       'ฟิลเลอร์',      'ฟิลเลอร์ · เติมเต็มอย่างปราณีต',              '/assets/slogan-5.jpg',     'ดูรายละเอียด', 2),
  ('laser',        'Laser',        'เลเซอร์',        'เลเซอร์ · ฝ้า กระ ผิวกระจ่าง',                '/assets/slogan-3.jpg',     'ดูรายละเอียด', 3),
  ('skin-booster', 'Skin Booster', 'สกินบูสเตอร์',  'สกินบูสเตอร์ · ผิวฉ่ำ ฟูเด้ง',                '/assets/ba-12.jpg',        'ดูรายละเอียด', 4),
  ('meso',         'Meso',         'เมโส',           'เมโส · ย้อนวัย ผิวกระจก',                     '/assets/ba-10.jpg',        'ดูรายละเอียด', 5),
  ('vitamin',      'Vitamin',      'วิตามิน',        'วิตามิน IV Drip · บูสต์จากภายใน',              '/assets/lifestyle-1.jpg',  'ดูรายละเอียด', 6);

-- ── Reviews ────────────────────────────────────────────────
INSERT INTO reviews (name, age, treatment, body, stars, sort_order) VALUES
  ('คุณแอน', '41 ปี', 'Botox Slim Face',
   '"คุณหมออาภาวิเคราะห์หน้าให้ละเอียดมาก — ฉีดโบเรียวกราม แต่ยังเก็บเสน่ห์เดิมไว้ครบ ไม่ใช่หน้าเหมือนคนอื่นในโลก."',
   5, 0),
  ('คุณพิม', '35 ปี', 'Restylane Filler',
   '"ฉีดฟิลเลอร์ใต้ตามาแล้ว 2 ครั้ง อุ่นใจมาก เพราะหมอใช้ของแท้ Restylane ให้ดูซองก่อนเปิดทุกครั้ง ผลลัพธ์เป็นธรรมชาติ."',
   5, 1),
  ('คุณนิด', '32 ปี', 'Skin Booster',
   '"ฉีด Skin Booster เห็นผลจริง ผิวฟูเด้งขึ้นในไม่กี่วัน — แนะนำได้ตรงจุด ไม่กดดันให้ซื้อแพ็คเกจเลยค่ะ."',
   5, 2);
