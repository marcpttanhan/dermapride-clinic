'use client'
import { useState } from 'react'
import type { ContactSettings } from '@/lib/supabase/types'

interface Props { contact: ContactSettings }

const SLOTS = ['10:00','11:30','13:00','14:30','16:00','17:30','18:30','19:00']

export default function Booking({ contact }: Props) {
  const [activeSlot, setActiveSlot] = useState('13:00')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().slice(0, 10)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setLoading(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      fd.get('name'),
          phone:     fd.get('phone'),
          branch:    fd.get('branch'),
          service:   fd.get('service'),
          date:      fd.get('date'),
          time_slot: activeSlot,
          message:   fd.get('message'),
        }),
      })
      if (res.ok) setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="dpe-booking dpe-chapter" id="booking" data-screen-label="12 Booking">
      <div className="dpe-shell">
        <div className="dpe-booking-grid">
          <div className="dpe-booking-aside" data-veil>
            <div className="dpe-ch-num">Chapter 12 · Book Your Visit</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>เริ่มต้น<br/>เส้นทาง<br/><em>ของคุณ.</em></h2>
            <div className="img"><img src="/assets/welcome-zone.jpg" alt="DermaPride welcome" /></div>
            <div className="quick">
              <a href={`tel:${contact.phone?.replace(/[^0-9+]/g,'')}`}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.34 1.91.62 2.82a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.28 1.85.49 2.82.62A2 2 0 0 1 22 16.92z"/>
                </svg>
                โทร · {contact.phone}
              </a>
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9v-2.9h2.54V9.79c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/>
                  </svg>
                  ทักหา Facebook · ตอบเร็วใน 5 นาที
                </a>
              )}
            </div>
          </div>

          <form
            className={`dpe-form${sent ? ' is-sent' : ''}`}
            id="bookForm"
            noValidate
            data-veil
            data-veil-delay="1"
            onSubmit={handleSubmit}
          >
            {!sent ? (
              <div className="dpe-form-body">
                <h3>นัดหมาย<em>ออนไลน์</em></h3>
                <p className="desc">ทีมเราจะติดต่อกลับเพื่อยืนยันคิวภายใน 5 นาที (ในเวลาทำการ)</p>

                <div className="dpe-form-row">
                  <div className="dpe-field"><label>ชื่อ-นามสกุล</label><input type="text" name="name" required placeholder="คุณ ..." /></div>
                  <div className="dpe-field"><label>เบอร์โทร</label><input type="tel" name="phone" required placeholder="08X-XXX-XXXX" /></div>
                </div>
                <div className="dpe-form-row">
                  <div className="dpe-field"><label>สาขา</label>
                    <select name="branch">
                      <option>สาขาวัชรพล</option>
                      <option>สาขาราชพฤกษ์</option>
                      <option>ปรึกษาก่อน — ทีมแนะนำ</option>
                    </select>
                  </div>
                  <div className="dpe-field"><label>หัตถการ</label>
                    <select name="service">
                      <option>ปรึกษาฟรี — Consultation</option>
                      <option>Botox</option>
                      <option>Filler</option>
                      <option>Laser Treatment</option>
                      <option>Meso Reverse</option>
                      <option>Vitamin IV</option>
                    </select>
                  </div>
                </div>
                <div className="dpe-form-row">
                  <div className="dpe-field full"><label>วันที่ต้องการ</label>
                    <input type="date" name="date" defaultValue={defaultDate} min={new Date().toISOString().slice(0,10)} required />
                  </div>
                </div>
                <div className="dpe-field" style={{marginBottom:'16px'}}>
                  <label>ช่วงเวลา</label>
                  <div className="dpe-slots">
                    {SLOTS.map(s => (
                      <button
                        key={s} type="button"
                        className={`dpe-slot${activeSlot === s ? ' is-active' : ''}`}
                        onClick={() => setActiveSlot(s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="dpe-field full">
                  <label>ข้อความ (ไม่บังคับ)</label>
                  <textarea name="message" placeholder="เล่าให้ฟังหน่อยว่าอยากแก้ไขจุดไหน"></textarea>
                </div>
                <div className="dpe-form-foot">
                  <button type="submit" className="send" disabled={loading}>
                    {loading ? 'กำลังส่ง…' : 'ส่งคำขอนัดหมาย'}
                    {!loading && <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>}
                  </button>
                  <span className="note">ข้อมูลของคุณส่งตรงถึงคลินิก — ไม่แชร์กับบุคคลอื่น</span>
                </div>
              </div>
            ) : (
              <div className="dpe-form-success" style={{display:'block'}}>
                <div style={{fontFamily:'var(--dp-display)', fontSize:'32px', fontWeight:'350', letterSpacing:'-0.02em', color:'var(--dp-teal-700)'}}>
                  ส่งคำขอเรียบร้อย ✓
                </div>
                <p style={{fontFamily:'var(--dp-sans)', margin:'12px 0 0', fontSize:'14px', opacity:'0.75', color:'var(--cine-ink)'}}>
                  ทีมเราจะติดต่อกลับเพื่อยืนยันคิวภายใน 5 นาที — ขอบคุณที่ไว้วางใจ DermaPride
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
