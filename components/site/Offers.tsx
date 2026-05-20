import type { OfferItem } from '@/lib/supabase/types'
import { normalizeImageUrl, parseAccent } from '@/lib/utils'

interface Props {
  offers: { items: OfferItem[] }
}

export default function Offers({ offers }: Props) {
  const items = (offers.items ?? []).filter(i => i.visible !== false)

  return (
    <section className="dpe-offers dpe-chapter" id="offers" data-screen-label="10 Offers">
      <div className="dpe-shell">
        <div className="dpe-offers-head">
          <div data-veil>
            <div className="dpe-ch-num">Chapter 10 · Curated Offerings</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>โปรโมชั่น<br/><em>เดือนนี้.</em></h2>
          </div>
          <p data-veil data-veil-delay="1">
            แคมเปญที่คัดสรร — เพื่อให้คุณเริ่มต้นเส้นทางความงามได้ง่ายขึ้น
            ใช้ได้ทั้งสาขาวัชรพลและราชพฤกษ์
          </p>
        </div>

        <div className="dpe-offer-list">
          {items.map(item => (
            <a key={item.id} className="dpe-offer" href={item.ctaHref || '#booking'} data-veil>
              <div className="dpe-offer-thumb">
                <img src={normalizeImageUrl(item.image)} alt="" />
              </div>
              <div
                className="dpe-offer-name"
                dangerouslySetInnerHTML={{ __html: parseAccent(item.title) + `<span class="th">${item.sub}</span>` }}
              />
              <div className="dpe-offer-tag">{item.tag}</div>
              <div className="dpe-offer-price">
                <span className="was">{item.was}</span>
                {item.price}
              </div>
              <div className="dpe-offer-arrow">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </div>
            </a>
          ))}
        </div>

        <p style={{marginTop:'36px', fontFamily:'var(--dp-mono)', fontSize:'11px', letterSpacing:'0.05em', color:'var(--cine-ink)', opacity:'0.55'}} data-veil>
          Ⓘ &nbsp; ผ่อน 0% สูงสุด 12 เดือน · ผ่อนตรงกับคลินิก ไม่ง้อบัตร · ยืนยันราคาก่อนทำหัตถการทุกครั้ง
        </p>
      </div>
    </section>
  )
}
