import type { BranchSettings } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props { branches: BranchSettings[] }

export default function Branches({ branches }: Props) {
  return (
    <section className="dpe-branches dpe-chapter" id="branches" data-screen-label="11 Branches">
      <div className="dpe-shell">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'48px', alignItems:'end'}}>
          <div data-veil>
            <div className="dpe-ch-num">Chapter 11 · Where to find us</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>สองสาขา.<br/><em>มาตรฐานเดียว.</em></h2>
          </div>
          <p data-veil data-veil-delay="1" style={{fontFamily:'var(--dp-sans)', fontSize:'16px', lineHeight:'1.65', opacity:'0.75', maxWidth:'460px'}}>
            ทั้งสองสาขามีทีมแพทย์ ระบบ ราคา และคุณภาพการดูแลในมาตรฐานเดียวกัน — เลือกที่สะดวกการเดินทางของคุณ
          </p>
        </div>

        <div className="dpe-branches-grid">
          {branches.map((branch, i) => (
            <article key={i} className="dpe-branch" data-veil data-veil-delay={String(i > 0 ? 1 : 0)}>
              <div className="dpe-branch-hero">
                <div><img src={normalizeImageUrl(branch.image1)} alt="" data-cms-src={`home.branches.${i}.image1`} /></div>
                <div className="stack">
                  <div><img src={normalizeImageUrl(branch.image2)} alt="" data-cms-src={`home.branches.${i}.image2`} /></div>
                  <div><img src={normalizeImageUrl(branch.image3)} alt="" data-cms-src={`home.branches.${i}.image3`} /></div>
                </div>
              </div>
              <div className="dpe-branch-body">
                <div className="dpe-branch-tag">Branch {String(i + 1).padStart(2,'0')} · {i === 0 ? 'Watcharaphon' : 'Ratchapruek'}</div>
                <h3>DermaPride · <em>{i === 0 ? 'วัชรพล' : 'ราชพฤกษ์'}</em></h3>
                <div className="th">{branch.address}</div>
                <div className="dpe-branch-info">
                  <div><div className="k">License</div><div className="v">{branch.license}</div></div>
                  <div><div className="k">Phone</div><div className="v">{branch.phone}</div></div>
                  {branch.extra1Label && <div><div className="k">{branch.extra1Label}</div><div className="v">{branch.extra1Value}</div></div>}
                  {branch.extra2Label && <div><div className="k">{branch.extra2Label}</div><div className="v">{branch.extra2Value}</div></div>}
                </div>
              </div>
              <div className="dpe-branch-map">
                <iframe
                  src={branch.mapEmbed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map — ${branch.name}`}
                />
              </div>
              <div className="dpe-branch-actions">
                <a
                  className="dpe-btn-cinema"
                  style={{background:'var(--cine-ink)', color:'var(--cine-paper)', padding:'12px 20px', fontSize:'13px'}}
                  href={branch.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  เปิดใน Google Maps
                  <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </a>
                <a
                  className="dpe-btn-ghost-dark"
                  style={{color:'var(--cine-ink)', borderColor:'var(--cine-rule)', padding:'12px 18px', fontSize:'13px'}}
                  href={`tel:${branch.phone?.replace(/[^0-9+]/g,'')}`}
                >
                  โทรสาขา
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
