import type { DoctorSettings } from '@/lib/supabase/types'
import { normalizeImageUrl } from '@/lib/utils'

interface Props { doctor: DoctorSettings }

export default function Doctor({ doctor }: Props) {
  return (
    <section className="dpe-doctor dpe-chapter" id="doctor" data-screen-label="03 Doctor">
      <div className="dpe-shell">
        <div className="dpe-doctor-grid">
          <div className="dpe-doctor-portrait" data-veil>
            <img
              src={normalizeImageUrl(doctor.image) || '/assets/doctor.jpg'}
              alt={doctor.nameTh || 'Doctor'}
              data-cms-src="home.doctor.image"
            />
            <div className="badge">
              License · {doctor.license}
              <strong>{doctor.nameTh}</strong>
            </div>
          </div>

          <div className="dpe-doctor-copy" data-veil data-veil-delay="1">
            <div className="dpe-ch-num">CHAPTER 03 · DOCTOR</div>
            <div className="role" style={{marginTop:'24px'}}>{doctor.role}</div>
            <h2 className="dpe-doctor-name">
              Dr. Arpa<br/><em>Sungkanukit,</em> M.D.
              <span className="th">{doctor.nameTh}</span>
            </h2>

            <blockquote className="dpe-doctor-quote">{doctor.quote}</blockquote>

            <div className="dpe-doctor-signature">
              <a
                href={doctor.verificationUrl || 'https://www.mct.or.th/'}
                target="_blank"
                rel="noopener noreferrer"
                style={{fontFamily:'var(--dp-mono)', fontSize:'11px', letterSpacing:'0.18em', textTransform:'uppercase', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:'8px'}}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Verify License · {doctor.license}
              </a>
            </div>

            <p style={{fontFamily:'var(--dp-sans)', fontSize:'16px', lineHeight:'1.72', opacity:'0.78', margin:'0'}}>
              {doctor.bio}
            </p>

            <div className="dpe-doctor-credits">
              <div><div className="k">Specialization</div><div className="v">{doctor.specialization}</div></div>
              <div><div className="k">Certified</div><div className="v">{doctor.certifications}</div></div>
              <div><div className="k">Experience</div><div className="v">{doctor.experience}</div></div>
              <div><div className="k">License</div><div className="v">{doctor.license}</div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
