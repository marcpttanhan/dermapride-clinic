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
