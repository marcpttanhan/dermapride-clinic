import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Fraunces, JetBrains_Mono } from 'next/font/google'
import '../styles/globals.css'

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'DermaPride · A Film of Integrity & Artistry',
    template: '%s · DermaPride Clinics',
  },
  description:
    'DermaPride Clinics · คลินิก4แท้ — เสน่ห์ที่สร้างจากความซื่อตรงและสุนทรียศิลป์ โดย พญ.อาภา สังขนุกิจ',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dermaprideclinics.com'),
  openGraph: {
    siteName: 'DermaPride Clinics',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" className={`${fraunces.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="dpe-no-overflow">{children}</body>
    </html>
  )
}
