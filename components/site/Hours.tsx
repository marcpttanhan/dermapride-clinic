import type { HourRow } from '@/lib/supabase/types'
import { dayIndex } from '@/lib/utils'

interface Props { hours: HourRow[] }

export default function Hours({ hours }: Props) {
  const todayIdx = new Date().getDay()

  return (
    <section className="dpe-hours" id="hours" data-screen-label="13 Hours">
      <div className="dpe-shell">
        <div className="dpe-hours-grid">
          <div data-veil>
            <div className="dpe-ch-num" style={{opacity:'0.7'}}>Chapter 13 · Opening Hours</div>
            <h2 className="dpe-h-display" style={{marginTop:'20px'}}>เวลา<br/><em>ให้บริการ.</em></h2>
            <p style={{fontFamily:'var(--dp-sans)', fontSize:'16px', lineHeight:'1.6', opacity:'0.7', maxWidth:'380px', margin:'24px 0 0'}}>
              เปิดเฉพาะวันพุธ ศุกร์ เสาร์ และอาทิตย์ — เน้นคุณภาพ
              ให้แพทย์ดูแลทุกเคสได้อย่างเต็มที่
            </p>
          </div>

          <div className="dpe-hours-list" data-veil data-veil-delay="1">
            {hours.map((row, i) => {
              const isToday  = dayIndex(row.day) === todayIdx
              const rowClass = ['dpe-hour-row', row.closed && 'is-closed', isToday && 'is-today'].filter(Boolean).join(' ')
              const timeStr  = row.closed ? '— ปิด' : `${row.open} — ${row.close}`

              return (
                <div key={i} className={rowClass} data-day={dayIndex(row.day)}>
                  <div className="day">{row.day}<span className="th">{row.th}</span></div>
                  <div className="time">{timeStr}</div>
                  <div>
                    {isToday && !row.closed && (
                      <span className="pill">Today</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
