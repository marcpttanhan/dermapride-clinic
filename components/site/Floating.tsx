import type { ContactSettings } from '@/lib/supabase/types'

interface Props { contact: ContactSettings }

export default function Floating({ contact }: Props) {
  return (
    <div className="dpe-floating">
      {contact.facebook && (
        <a className="fb" href={contact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12a10 10 0 1 0-11.56 9.88V14.9H7.9v-2.9h2.54V9.79c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.57V12h2.77l-.44 2.9h-2.33v6.98A10 10 0 0 0 22 12z"/>
          </svg>
        </a>
      )}
      <a className="ph" href={`tel:${contact.phone?.replace(/[^0-9+]/g,'')}`} aria-label="Phone">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.13 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.97.34 1.91.62 2.82a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.28 1.85.49 2.82.62A2 2 0 0 1 22 16.92z"/>
        </svg>
      </a>
    </div>
  )
}
