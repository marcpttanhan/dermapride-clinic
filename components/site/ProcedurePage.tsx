'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { ProcedureRow, ProcedureSectionRow, ReviewRow } from '@/lib/supabase/types'
import { normalizeImageUrl, parseAccent } from '@/lib/utils'

interface Props {
  proc:    ProcedureRow
  reviews: ReviewRow[]
}

export default function ProcedurePage({ proc, reviews }: Props) {
  const sections = (proc.sections ?? []).filter(s => s.visible !== false)

  return (
    <>
      {/* Breadcrumb */}
      <div className="dpe-shell proc-crumb">
        <div className="proc-crumb-inner">
          <Link href="/">← Home</Link>
          <span style={{opacity:0.4}}>/</span>
          <span>Procedures</span>
          <span style={{opacity:0.4}}>/</span>
          <span style={{color:'var(--dp-teal-700)'}}>{proc.name}</span>
        </div>
      </div>

      {/* Hero */}
      <section className="proc-hero">
        <div className="dpe-shell">
          <div className="proc-hero-inner">
            <div>
              <div className="kicker">{proc.kicker || 'Procedures'}</div>
              <h1><em>{proc.headline || proc.name}</em></h1>
              {proc.name_th && <div className="nameTh">{proc.name_th}</div>}
              {proc.sub_text && <p className="sub">{proc.sub_text}</p>}
            </div>
            {proc.hero_image_url ? (
              <div className="proc-hero-image">
                <img src={normalizeImageUrl(proc.hero_image_url)} alt="" />
              </div>
            ) : <div />}
          </div>
        </div>
      </section>

      {/* Sections */}
      {sections.length === 0 ? (
        <section className="proc-empty">
          <h3>เนื้อหา <em>กำลังถูกเตรียม</em></h3>
          <p>หน้าหัตถการนี้ยังไม่มีเนื้อหา — ทีมงานกำลังเตรียมข้อมูลให้ในเร็ว ๆ นี้</p>
          <a className="dpe-btn-cinema" href="/#booking" style={{background:'#14242A', color:'#FAF7F2'}}>
            นัดหมายปรึกษาฟรี
            <svg className="arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7"/>
            </svg>
          </a>
        </section>
      ) : (
        sections.map((sec, idx) => (
          <ProcSection key={sec.id} sec={sec} idx={idx} reviews={reviews} />
        ))
      )}
    </>
  )
}

function ProcSection({ sec, idx, reviews }: { sec: ProcedureSectionRow; idx: number; reviews: ReviewRow[] }) {
  const reverse = idx % 2 === 1
  const tone    = sec.type === 'cta' ? 'is-dark' : idx % 2 === 0 ? 'is-paper' : 'is-cream'
  const num     = String(idx + 1).padStart(2, '0')

  const CopyBlock = () => (
    <div className="proc-copy">
      {sec.subtitle
        ? <div className="eyebrow">{sec.subtitle}</div>
        : <div className="eyebrow">— {num}</div>
      }
      {sec.title && (
        <h2 dangerouslySetInnerHTML={{ __html: parseAccent(sec.title) }} />
      )}
      {sec.body    && <div className="body">{sec.body}</div>}
      {sec.price   && <div className="price"><span className="lbl">Highlight</span><span className="val">{sec.price}</span></div>}
      {sec.tags    && (
        <div className="tags">
          {sec.tags.split(',').map((t,i) => <span key={i} className="tag">{t.trim()}</span>)}
        </div>
      )}
    </div>
  )

  if (sec.type === 'image-text') {
    const img = sec.images?.[0]?.src
    return (
      <section className={`proc-sec ${tone}${reverse ? ' is-reverse' : ''}`}>
        <div className="dpe-shell">
          <div className="proc-twocol">
            <div className="proc-image-frame">
              {img
                ? <img src={normalizeImageUrl(img)} alt="" />
                : <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontFamily:'var(--dp-sans)',fontSize:'13px',color:'rgba(20,36,42,0.4)'}}>No image</div>
              }
            </div>
            <CopyBlock />
          </div>
        </div>
      </section>
    )
  }

  if (sec.type === 'slider') {
    return (
      <section className={`proc-sec ${tone}${reverse ? ' is-reverse' : ''}`}>
        <div className="dpe-shell">
          <div className="proc-twocol">
            <ImageSlider images={sec.images ?? []} />
            <CopyBlock />
          </div>
        </div>
      </section>
    )
  }

  if (sec.type === 'before-after') {
    const a = sec.images?.[0], b = sec.images?.[1]
    return (
      <section className={`proc-sec ${tone}${reverse ? ' is-reverse' : ''}`}>
        <div className="dpe-shell">
          <div className="proc-twocol">
            <div className="proc-ba">
              <div>{a && <img src={normalizeImageUrl(a.src)} alt="" />}<span>Before</span></div>
              <div>{b && <img src={normalizeImageUrl(b.src)} alt="" />}<span>After</span></div>
            </div>
            <CopyBlock />
          </div>
        </div>
      </section>
    )
  }

  if (sec.type === 'pricing') {
    return (
      <section className={`proc-sec ${tone}`}>
        <div className="dpe-shell" style={{maxWidth:'880px'}}>
          <div className="proc-pricing">
            {sec.title && <h3 dangerouslySetInnerHTML={{ __html: parseAccent(sec.title) }} />}
            {sec.body  && <div className="body">{sec.body}</div>}
          </div>
        </div>
      </section>
    )
  }

  if (sec.type === 'reviews') {
    const shown = reviews.slice(0, 6)
    return (
      <section className={`proc-sec ${tone}`}>
        <div className="dpe-shell">
          {sec.title && <h2 style={{fontFamily:'var(--dp-display)',fontWeight:'300',fontSize:'clamp(32px,4vw,56px)',letterSpacing:'-0.025em',margin:'0 0 32px'}}
            dangerouslySetInnerHTML={{ __html: parseAccent(sec.title) }} />}
          <div className="proc-reviews-grid">
            {shown.map(r => (
              <article key={r.id} className="proc-rev">
                <div className="stars">{'★'.repeat(r.stars ?? 5)}</div>
                <p>{r.body}</p>
                <footer>
                  <span className="nm">{r.name}</span>
                  <span className="tr">{r.treatment || ''}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (sec.type === 'cta') {
    return (
      <section className={`proc-sec ${tone}`}>
        <div className="dpe-shell">
          <div className="proc-cta-block">
            {sec.title && <h2 dangerouslySetInnerHTML={{ __html: parseAccent(sec.title) }} />}
            {sec.body  && <p>{sec.body}</p>}
            <div className="actions">
              <a className="dpe-btn-cinema" href="/#booking">นัดหมายปรึกษาฟรี</a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return null
}

function ImageSlider({ images }: { images: Array<{ src: string; alt?: string }> }) {
  const [cur, setCur] = useState(0)
  const total = images.length
  const go = (i: number) => setCur((i + total) % total)

  if (!total) {
    return (
      <div className="proc-slider">
        <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',fontFamily:'var(--dp-sans)',fontSize:'13px',color:'rgba(20,36,42,0.4)'}}>
          No images
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="proc-slider" data-slider>
        <div className="track" style={{transform:`translateX(-${cur * 100}%)`}}>
          {images.map((img, i) => (
            <div key={i} className="slide">
              <img src={normalizeImageUrl(img.src)} alt={img.alt || ''} />
            </div>
          ))}
        </div>
        {total > 1 && (
          <>
            <div className="arrows">
              <button onClick={() => go(cur - 1)}>
                <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
              <button onClick={() => go(cur + 1)}>
                <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            </div>
            <div className="nav">
              {images.map((_, i) => (
                <button key={i} className={`dot${i === cur ? ' is-active' : ''}`} onClick={() => go(i)} />
              ))}
            </div>
          </>
        )}
      </div>
      {total > 1 && (
        <div className="thumbs">
          {images.map((img, i) => (
            <div key={i} className={`proc-slider-thumb${i === cur ? ' is-active' : ''}`} onClick={() => go(i)}>
              <img src={normalizeImageUrl(img.src)} alt="" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
