import Link from 'next/link'
import type { ProcedureRow } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props {
  procedures: ProcedureRow[]
}

// Matches the .dpe-film CSS section (chapter 04 + 05 in the original design numbering)
export default function Film({ procedures }: Props) {
  const botox  = procedures.find(p => p.slug === 'botox')  ?? procedures[0]
  const filler = procedures.find(p => p.slug === 'filler') ?? procedures[1]

  if (!botox && !filler) return null

  return (
    <>
      {/* Chapter 04 — Botox signature */}
      {botox && (
        <section className="dpe-film" id="film-botox" data-screen-label="04 Film · Botox">
          <div className="dpe-shell">
            <div className="dpe-film-grid">
              <div className="dpe-film-video" data-veil>
                <img
                  src={normalizeImageUrl(botox.hero_image_url || botox.image_url) || '/assets/slogan-1.jpg'}
                  alt={botox.name}
                />
                <div className="timestamp">SIGNATURE · 01</div>
              </div>

              <div className="dpe-film-copy" data-veil data-veil-delay="1">
                <div className="ch">Chapter 04 · Signature</div>
                <h3>
                  <em>{botox.headline || botox.name}</em>
                </h3>
                <div className="th-line">{botox.name_th || 'โบท็อกซ์'}</div>
                <p>{botox.sub_text || botox.description || 'โบท็อกซ์แบบปราณีต — วิเคราะห์โครงหน้าก่อนทุกครั้ง เพื่อรักษาเสน่ห์เฉพาะตัวของคุณ ไม่ใช่สูตรสำเร็จ'}</p>

                <div className="dpe-film-stats">
                  <div><div className="n">12+</div><div className="l">Years exp.</div></div>
                  <div><div className="n">50k+</div><div className="l">Cases</div></div>
                  <div><div className="n">4.92</div><div className="l">Rating</div></div>
                </div>

                <Link className="dpe-film-cta" href={`/procedures/${botox.slug}`}>
                  {botox.cta_text || 'ดูรายละเอียด'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Chapter 05 — Filler signature (reversed layout) */}
      {filler && (
        <section className="dpe-film dpe-film--reverse" id="film-filler" data-screen-label="05 Film · Filler">
          <div className="dpe-shell">
            <div className="dpe-film-grid">
              <div className="dpe-film-video" data-veil>
                <img
                  src={normalizeImageUrl(filler.hero_image_url || filler.image_url) || '/assets/slogan-5.jpg'}
                  alt={filler.name}
                />
                <div className="timestamp">SIGNATURE · 02</div>
              </div>

              <div className="dpe-film-copy" data-veil data-veil-delay="1">
                <div className="ch">Chapter 05 · Signature</div>
                <h3>
                  <em>{filler.headline || filler.name}</em>
                </h3>
                <div className="th-line">{filler.name_th || 'ฟิลเลอร์'}</div>
                <p>{filler.sub_text || filler.description || 'ฟิลเลอร์เติมเต็มอย่างปราณีต — เลือก Restylane หรือ Juvederm ตามความต้องการของผิวและโครงหน้าเฉพาะบุคคล'}</p>

                <div className="dpe-film-stats">
                  <div><div className="n">Restylane</div><div className="l">Galderma</div></div>
                  <div><div className="n">Allergan</div><div className="l">Certified</div></div>
                  <div><div className="n">100%</div><div className="l">Authentic</div></div>
                </div>

                <Link className="dpe-film-cta" href={`/procedures/${filler.slug}`}>
                  {filler.cta_text || 'ดูรายละเอียด'}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
