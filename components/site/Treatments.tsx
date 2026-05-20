import Link from 'next/link'
import type { ProcedureRow } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props { procedures: ProcedureRow[] }

const SPAN_PATTERNS: Record<number, string[]> = {
  1: ['lg'],
  2: ['wide', 'wide'],
  3: ['lg', 'md', 'md'],
  4: ['lg', 'md', 'sm', 'sm'],
  5: ['lg', 'md', 'sm', 'sm', 'wide'],
  6: ['lg', 'md', 'sm', 'sm', 'sm', 'wide'],
}

export default function Treatments({ procedures }: Props) {
  const n     = procedures.length
  const spans = SPAN_PATTERNS[n] ?? procedures.map((_, i) => i === 0 ? 'lg' : i === 1 ? 'md' : 'sm')

  return (
    <section className="dpe-chapter dpe-chapter--paper" id="treatments" data-screen-label="07 Treatments">
      <div className="dpe-shell">
        <div className="dpe-treatments-head">
          <div data-veil>
            <div className="dpe-ch-num">Chapter 06 · Treatments</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>
              หัตถการ<br/><em>ของเรา.</em>
            </h2>
          </div>
          <p data-veil data-veil-delay="1">
            ทุกหัตถการเริ่มต้นที่การวิเคราะห์ใบหน้าโดยแพทย์ — เพื่อเลือกเทคนิคที่เหมาะกับโครงหน้าของคุณคนเดียว
            ไม่ใช่สูตรสำเร็จ แต่คือการออกแบบเฉพาะบุคคล
          </p>
        </div>

        <div className="dpe-treatments-grid" id="treatmentsGrid">
          {procedures.map((proc, i) => (
            <Link
              key={proc.id}
              className={`dpe-treatment dpe-treatment--${spans[i] || 'sm'}`}
              href={`/procedures/${proc.slug}`}
            >
              <img
                src={normalizeImageUrl(proc.image_url) || '/assets/welcome-hero.jpg'}
                alt={proc.name}
              />
              <span className="arrow">
                <svg viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M7 17L17 7M7 7h10v10"/>
                </svg>
              </span>
              <div className="info">
                <div className="num">— {String(i + 1).padStart(2,'0')}{i === 0 ? ' / Signature' : ''}</div>
                <div className="nm"><em>{proc.name}</em></div>
                <div className="th">{proc.description || proc.name_th || ''}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
