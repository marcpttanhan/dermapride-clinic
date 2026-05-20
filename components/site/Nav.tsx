'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { ContactSettings } from '@/lib/supabase/types'

interface Props {
  contact: ContactSettings
  pinned?: boolean
}

export default function Nav({ contact, pinned = false }: Props) {
  const [isLight,  setLight]  = useState(false)
  const [isPinned, setPinned] = useState(pinned)

  useEffect(() => {
    if (pinned) { setPinned(true); setLight(true); return }

    const hero = document.querySelector('.dpe-hero')
    const onScroll = () => {
      const heroBottom = hero ? hero.getBoundingClientRect().bottom : 0
      setLight(heroBottom < 80)
      setPinned(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [pinned])

  const cls = ['dpe-nav', isLight && 'is-light', isPinned && 'is-pinned'].filter(Boolean).join(' ')

  return (
    <header className={cls} id="dpeNav">
      <Link className="dpe-nav-logo" href="/" id="logoLink">
        <span className="logo-text">DermaPride<em>.</em></span>
        <img className="logo-img" src="/assets/logo.jpg" alt="DermaPride" />
      </Link>

      <nav className="dpe-nav-rail">
        <Link href="/#top">Home</Link>
        <Link href="/#doctor">Doctor</Link>
        <Link href="/#treatments">Treatments</Link>
        <Link href="/#results">Results</Link>
        <Link href="/#impressions">Voices</Link>
        <Link href="/#branches">Branches</Link>
        <Link href="/#booking">Booking</Link>
      </nav>

      <div className="dpe-nav-end">
        <a
          className="dpe-nav-phone"
          href={`tel:${contact.phone?.replace(/[^0-9+]/g, '')}`}
        >
          {contact.phone}
        </a>
        <Link className="dpe-nav-cta" href="/#booking">
          Book a Visit
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </Link>
      </div>
    </header>
  )
}
