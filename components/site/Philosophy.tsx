import type { PhilosophySettings } from '@/lib/supabase/types'

interface Props { philosophy: PhilosophySettings }

export default function Philosophy({ philosophy }: Props) {
  const items = (philosophy.items ?? []).filter(i => i.visible !== false)

  return (
    <section className="dpe-chapter dpe-chapter--cream" id="philosophy" data-screen-label="02 Pillars">
      <div className="dpe-shell">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'end'}}>
          <div data-veil>
            <div className="dpe-ch-num">Chapter 02 · ปรัชญา</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>
              มาตรฐาน <em>4 แท้</em><br/>คือคำมั่นของเรา.
            </h2>
          </div>
          <p data-veil data-veil-delay="1" style={{fontFamily:'var(--dp-sans)', fontSize:'16px', lineHeight:'1.7', opacity:'0.75', maxWidth:'460px'}}>
            {philosophy.sub}
          </p>
        </div>

        <div className="dpe-pillars-list" id="pillarsList">
          {items.map((item, i) => (
            <div className="dpe-pillar-row" data-veil key={item.id}>
              <div className="ix">0{i + 1}</div>
              <div className="nm">
                <em>{item.title}</em>
                <span className="th">{item.titleTh}</span>
              </div>
              <div className="desc">{item.body}</div>
              <div className="arrow">→</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
