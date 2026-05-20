import type { ReviewRow } from '@/lib/supabase/types'

interface Props { reviews: ReviewRow[] }

export default function Voices({ reviews }: Props) {
  const shown = reviews.slice(0, 3)

  return (
    <section className="dpe-voices dpe-chapter" id="impressions" data-screen-label="09 Impressions">
      <div className="dpe-shell">
        <header className="dpe-voices-head">
          <div data-veil>
            <div className="dpe-ch-num">Chapter 09 · Voices</div>
            <h2 className="dpe-h-display dpe-thai-h" style={{marginTop:'20px'}}>
              ความประทับใจ<br/><em>จากลูกค้าของเรา.</em>
            </h2>
            <p className="dpe-voices-sub" data-veil data-veil-delay="1">
              เสียงจริงจากคนไข้ที่เคยได้รับการดูแลที่ DermaPride —
              เรื่องราวเล็ก ๆ ที่บอกเล่าความรู้สึก หลังจบหัตถการ.
            </p>
          </div>
          <div className="dpe-voices-rating" data-veil data-veil-delay="2">
            <div className="stars">★★★★★</div>
            <div className="n">4.92<span className="of">/5.0</span></div>
            <div className="l">จาก 1,247 รีวิว · Google · Facebook</div>
          </div>
        </header>

        <div className="dpe-voices-stage">
          <figure className="dpe-voices-video" data-veil>
            <div className="dpe-voices-video-frame">
              <iframe
                src="https://drive.google.com/file/d/1Soic8r_vArdjygWrT70dEX8Iaw21HvZ1/preview"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                loading="lazy"
                title="ความประทับใจจากลูกค้าของเรา · DermaPride"
              />
            </div>
            <figcaption>
              <div className="cap-l">VIDEO · ความประทับใจ</div>
              <div className="cap-r">เสียงจริงจากคนไข้</div>
            </figcaption>
          </figure>

          <aside className="dpe-voices-aside" data-veil data-veil-delay="1">
            {shown.map(r => (
              <article key={r.id} className="dpe-voice">
                <div className="stars">{'★'.repeat(Math.max(1, Math.min(5, r.stars ?? 5)))}</div>
                <p>{r.body}</p>
                <footer>
                  <span className="nm">{r.name}{r.age ? ` · ${r.age}` : ''}</span>
                  <span className="role">{r.treatment}</span>
                </footer>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
