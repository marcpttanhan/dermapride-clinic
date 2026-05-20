'use client'
import { useState } from 'react'
import type { ResultItem } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props {
  results: { items: ResultItem[] }
}

export default function Results({ results }: Props) {
  const items = (results.items ?? []).filter(i => i.visible !== false)
  const [activeIdx, setActiveIdx] = useState(0)
  const active = items[activeIdx] ?? items[0]

  return (
    <section className="dpe-results dpe-chapter" id="results" data-screen-label="08 Results">
      <div className="dpe-shell">
        <div className="dpe-results-head">
          <div data-veil>
            <div className="dpe-ch-num">Chapter 08 · Real Results</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>ผลลัพธ์ที่<br/><em>บอกเล่าตัวเอง.</em></h2>
          </div>
          <p data-veil data-veil-delay="1" style={{fontFamily:'var(--dp-sans)', fontSize:'16px', lineHeight:'1.65', opacity:'0.75'}}>
            ภาพจากผู้ใช้บริการจริงที่ได้รับอนุญาตให้เผยแพร่ — ผลลัพธ์อาจแตกต่างกันในแต่ละบุคคล
            เราเน้นความเป็นธรรมชาติและคงเอกลักษณ์เดิม
          </p>
        </div>

        {active && (
          <div className="dpe-results-stage" data-veil data-veil-delay="2">
            <div className="dpe-results-image">
              <img
                id="resImg"
                src={normalizeImageUrl(active.image)}
                alt="Before and after"
                style={{transition:'opacity 240ms ease'}}
              />
            </div>
            <aside className="dpe-results-meta">
              <div className="case">CASE · {String(activeIdx + 1).padStart(4,'0')}</div>
              <h4>{active.title}</h4>
              <p>{active.summary}</p>
              <div className="facts">
                <div><div className="k">หัตถการ</div><div className="v">{active.treatment}</div></div>
                <div><div className="k">ปริมาณ</div><div className="v">{active.amount}</div></div>
                <div><div className="k">ผู้ดูแล</div><div className="v">พญ.อาภา สังขนุกิจ</div></div>
                <div><div className="k">ผลลัพธ์</div><div className="v">{active.resultTime}</div></div>
              </div>
            </aside>
          </div>
        )}

        <div className="dpe-results-thumbs" data-veil data-veil-delay="3">
          {items.map((item, i) => (
            <button
              key={item.id}
              className={`dpe-results-thumb${i === activeIdx ? ' is-active' : ''}`}
              onClick={() => setActiveIdx(i)}
            >
              <img src={normalizeImageUrl(item.image)} alt="" />
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
