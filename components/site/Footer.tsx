import Link from 'next/link'
import type { ContactSettings, ProcedureRow } from '@/lib/supabase/types'

interface Props {
  contact:    ContactSettings
  procedures: ProcedureRow[]
}

export default function Footer({ contact, procedures }: Props) {
  return (
    <footer className="dpe-footer">
      <div className="dpe-shell">
        <div className="dpe-footer-grid">
          <div className="brand">
            <h2>DermaPride<em>.</em></h2>
            <p>เสน่ห์ที่สร้างจากความซื่อตรง และหลักการแห่งสุนทรียศิลป์ — โดย พญ.อาภา สังขนุกิจ.</p>
            <div className="socials">
              {contact.facebook && (
                <a href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9v-2.9h2.54V9.79c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/>
                  </svg>
                </a>
              )}
              {contact.instagram && (
                <a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16">
                    <rect x="3" y="3" width="18" height="18" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          <div>
            <h5>Visit</h5>
            <ul>
              <li><Link href="/#branches">สาขาวัชรพล</Link></li>
              <li><Link href="/#branches">สาขาราชพฤกษ์</Link></li>
              <li><Link href="/#hours">เวลาเปิดบริการ</Link></li>
              <li><a href={`tel:${contact.phone?.replace(/[^0-9+]/g,'')}`}>{contact.phone}</a></li>
            </ul>
          </div>

          <div>
            <h5>Procedures</h5>
            <ul>
              {procedures.slice(0, 6).map(p => (
                <li key={p.id}>
                  <Link href={`/procedures/${p.slug}`}>{p.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5>Care</h5>
            <ul>
              <li><Link href="/#doctor">เกี่ยวกับแพทย์</Link></li>
              <li><Link href="/#philosophy">มาตรฐาน 4 แท้</Link></li>
              <li><Link href="/#faq">คำถามที่พบบ่อย</Link></li>
              <li><Link href="/#offers">โปรโมชั่น</Link></li>
              <li><Link href="/#booking">นัดหมาย</Link></li>
            </ul>
          </div>
        </div>

        <div className="dpe-footer-bottom">
          <div>© 2026 DermaPride Clinics · License 12101005467 · 10101033360 · All rights reserved.</div>
          <Link className="dpe-footer-admin-link" href="/admin">Admin Access</Link>
        </div>
      </div>
    </footer>
  )
}
