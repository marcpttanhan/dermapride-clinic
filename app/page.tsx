import type { Metadata } from 'next'
import { getHomePageData } from '@/lib/cms'

import Nav from '@/components/site/Nav'
import Hero from '@/components/site/Hero'
import Marquee from '@/components/site/Marquee'
import Manifesto from '@/components/site/Manifesto'
import Philosophy from '@/components/site/Philosophy'
import Doctor from '@/components/site/Doctor'
import Treatments from '@/components/site/Treatments'
import Results from '@/components/site/Results'
import Voices from '@/components/site/Voices'
import Offers from '@/components/site/Offers'
import Branches from '@/components/site/Branches'
import Booking from '@/components/site/Booking'
import Hours from '@/components/site/Hours'
import FAQ from '@/components/site/FAQ'
import Footer from '@/components/site/Footer'
import Floating from '@/components/site/Floating'
import ScrollRevealInit from '@/components/site/ScrollRevealInit'

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomePageData()
  const seo = data.seo
  return {
    title: seo.title || 'DermaPride · A Film of Integrity & Artistry',
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: seo.ogImage ? [{ url: seo.ogImage }] : [],
    },
  }
}

export default async function HomePage() {
  const data = await getHomePageData()

  return (
    <>
      <Nav contact={data.contact} />

      <main id="top">
        <Hero hero={data.hero} />
        <Marquee />
        <Manifesto />
        <Philosophy philosophy={data.philosophy} />
        <Doctor doctor={data.doctor} />
        <Treatments procedures={data.procedures} />
        <Results results={data.results} />
        <Voices reviews={data.reviews} />
        <Offers offers={data.offers} />
        <Branches branches={data.branches} />
        <Booking contact={data.contact} />
        <Hours hours={data.hours} />
        <FAQ faq={data.faq} contact={data.contact} />
      </main>

      <Footer contact={data.contact} procedures={data.procedures} />
      <Floating contact={data.contact} />

      {/* Initializes scroll-reveal + nav behavior — client-only */}
      <ScrollRevealInit />
    </>
  )
}
