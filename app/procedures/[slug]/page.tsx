import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getProcedureBySlug, getAllProcedureSlugs, REVALIDATE_SECONDS } from '@/lib/cms'
import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import Floating from '@/components/site/Floating'
import ProcedurePage from '@/components/site/ProcedurePage'
import ScrollRevealInit from '@/components/site/ScrollRevealInit'
import { getHomePageData } from '@/lib/cms'
import '../../../styles/procedure.css'

export const revalidate = REVALIDATE_SECONDS

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllProcedureSlugs()
  return slugs.map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const proc = await getProcedureBySlug(slug)
  if (!proc) return {}
  return {
    title: proc.seo_title || `${proc.name} · DermaPride Clinics`,
    description: proc.seo_desc || proc.description || '',
    openGraph: { images: proc.seo_og_image ? [{ url: proc.seo_og_image }] : [] },
  }
}

export default async function ProcedureDetailPage({ params }: Props) {
  const { slug } = await params
  const [proc, homeData] = await Promise.all([
    getProcedureBySlug(slug),
    getHomePageData(),
  ])

  if (!proc) notFound()

  return (
    <>
      <Nav contact={homeData.contact} pinned />

      <main>
        <ProcedurePage proc={proc} reviews={homeData.reviews} />
      </main>

      <Footer contact={homeData.contact} procedures={homeData.procedures} />
      <Floating contact={homeData.contact} />
      <ScrollRevealInit />
    </>
  )
}
