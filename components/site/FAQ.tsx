import type { FaqItem, ContactSettings } from '@/lib/supabase/types'

interface Props {
  faq:     { items: FaqItem[] }
  contact: ContactSettings
}

export default function FAQ({ faq, contact }: Props) {
  const items = (faq.items ?? []).filter(i => i.visible !== false)

  return (
    <section className="dpe-faq dpe-chapter" id="faq" data-screen-label="14 FAQ">
      <div className="dpe-shell">
        <div className="dpe-faq-grid">
          <div className="dpe-faq-side" data-veil>
            <div className="dpe-ch-num">Chapter 14 · Q&A</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>คำถาม<br/><em>ที่พบบ่อย.</em></h2>
            <div className="ask">
              <h4>ยังไม่เจอคำตอบ?</h4>
              <p>ทักหาเราได้ตลอด เราตอบเร็วผ่าน Facebook ภายใน 5 นาทีในเวลาทำการ</p>
              <a
                className="dpe-btn-cinema"
                style={{background:'var(--cine-ink)', color:'var(--cine-paper)', padding:'12px 20px', fontSize:'13px'}}
                href={contact.facebook || 'https://www.facebook.com/DermaPrideClinic/'}
                target="_blank"
                rel="noopener noreferrer"
              >
                ทักหา Facebook
                <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="dpe-faq-list" data-veil data-veil-delay="1">
            {items.map((item, i) => (
              <details key={item.id} className="dpe-faq-item" open={i === 0}>
                <summary>
                  <span className="ix">{String(i + 1).padStart(2,'0')}</span>
                  <span className="q">{item.q}</span>
                  <span className="t">+</span>
                </summary>
                <div className="a">{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
