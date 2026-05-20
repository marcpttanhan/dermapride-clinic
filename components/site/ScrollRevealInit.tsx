'use client'
import { useEffect } from 'react'

// Mirrors the scroll-reveal logic from the original design's inline JS.
export default function ScrollRevealInit() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (!e.isIntersecting) return
          const parent = e.target.parentElement
          const peers  = parent
            ? [...parent.children].filter(c => c.hasAttribute('data-veil') || c.hasAttribute('data-veil-img'))
            : []
          const idx = peers.indexOf(e.target as Element)
          if (idx > 0 && peers.length > 1 && peers.length <= 12 && !(e.target as HTMLElement).style.transitionDelay) {
            ;(e.target as HTMLElement).style.transitionDelay = `${idx * 70}ms`
          }
          e.target.classList.add('is-in')
          io.unobserve(e.target)
        })
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.02 }
    )

    // Auto-tag content elements that don't already have data-veil
    const sels = [
      '.dpe-treatment','.dpe-offer','.dpe-pillar-row','.dpe-faq-item',
      '.dpe-results-thumb','.dpe-hour-row','.dpe-voice','.dpe-branch',
      '.dpe-chapter img','.dpe-results-image','.dpe-doctor-portrait',
    ]
    document.querySelectorAll(sels.join(',')).forEach(el => {
      if (el.hasAttribute('data-veil') || el.hasAttribute('data-veil-img')) return
      if (el.tagName === 'IMG' || el.classList.contains('dpe-results-image') || el.classList.contains('dpe-doctor-portrait')) {
        el.setAttribute('data-veil-img', '')
      } else {
        el.setAttribute('data-veil', '')
      }
    })

    document.querySelectorAll('[data-veil], [data-mask-reveal], [data-veil-img]').forEach(el => io.observe(el))

    const revealNearby = () => {
      document.querySelectorAll('[data-veil]:not(.is-in), [data-veil-img]:not(.is-in), [data-mask-reveal]:not(.is-in)').forEach(el => {
        const r = el.getBoundingClientRect()
        if (r.top < window.innerHeight + 200) el.classList.add('is-in')
      })
    }
    window.addEventListener('scroll', () => requestAnimationFrame(revealNearby), { passive: true })
    const t1 = setTimeout(revealNearby, 600)
    const t2 = setTimeout(revealNearby, 2000)

    return () => {
      io.disconnect()
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  return null
}
