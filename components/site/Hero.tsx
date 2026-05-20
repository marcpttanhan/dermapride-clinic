import type { HeroSettings } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props { hero: HeroSettings }

export default function Hero({ hero }: Props) {
  return (
    <section className="dpe-hero" data-screen-label="00 Hero">
      <div className="dpe-hero-video">
        <img
          src={normalizeImageUrl(hero.backgroundImage) || '/assets/welcome-hero.jpg'}
          alt=""
          data-cms-src="home.hero.backgroundImage"
        />
      </div>

      <div className="dpe-hero-inner">
        <div className="dpe-hero-top">
          <div className="reel"><span className="dot"></span><span>Reel 01 · A Pride of Skin</span></div>
          <div>เปิดบริการ พ · ศ · ส · อา</div>
        </div>

        <div className="dpe-hero-mid">
          <h1 className="dpe-hero-title">
            <span className="l1" data-mask-reveal><span>{hero.l1 || 'คลินิกความงาม'}</span></span>
            <span className="l2" data-mask-reveal data-mask-delay="1"><span>{hero.l2 || 'ที่สร้างเสน่ห์.'}</span></span>
            <span className="l3" data-mask-reveal data-mask-delay="2"><span>{hero.l3}</span></span>
          </h1>
          <aside className="dpe-hero-side" data-veil data-veil-delay="3">
            <div className="kicker">{hero.kicker || '— Bangkok · since 2024'}</div>
            <p>{hero.side}</p>
          </aside>
        </div>

        <div className="dpe-hero-bot">
          <div className="scroll-cue">Scroll to begin</div>
          <div className="actions">
            <a
              className="dpe-btn-cinema"
              href={hero.ctaPrimaryHref || '#booking'}
            >
              <span>{hero.ctaPrimary || 'จองคิวปรึกษาฟรี'}</span>
              <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7"/>
              </svg>
            </a>
            <a
              className="dpe-btn-ghost-dark"
              href={hero.ctaSecondaryHref || 'https://www.facebook.com/DermaPrideClinic/'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9v-2.9h2.54V9.79c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/>
              </svg>
              <span>{hero.ctaSecondary || 'ทักหา Facebook'}</span>
            </a>
          </div>
        </div>
      </div>

      <aside className="dpe-hero-meta">
        <div className="card"><div className="k">License No.</div><div className="v">ว.26433</div></div>
        <div className="card"><div className="k">Cases of care</div><div className="v">50,000<span style={{fontSize:'0.5em'}}>+</span></div></div>
        <div className="card"><div className="k">Patient rating</div><div className="v">4.92 / 5.0</div></div>
      </aside>
    </section>
  )
}
