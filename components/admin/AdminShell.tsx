'use client'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { SessionPayload } from '@/lib/auth'

interface Props { session: SessionPayload }

type Tab = 'home' | 'doctor' | 'procedures' | 'reviews' | 'branches' | 'hours'
         | 'philosophy' | 'results' | 'offers' | 'faq'
         | 'media' | 'theme' | 'seo' | 'bookings' | 'backup'

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'home',       label: 'Home',          icon: '⌂' },
  { id: 'doctor',     label: 'Doctor',         icon: '👩‍⚕️' },
  { id: 'procedures', label: 'Procedures',     icon: '✦' },
  { id: 'reviews',    label: 'Reviews',        icon: '★' },
  { id: 'philosophy', label: 'Philosophy',     icon: '◆' },
  { id: 'results',    label: 'Real Results',   icon: '⊞' },
  { id: 'offers',     label: 'Offers',         icon: '◎' },
  { id: 'faq',        label: 'FAQ',            icon: '?' },
  { id: 'branches',   label: 'Branches',       icon: '📍' },
  { id: 'hours',      label: 'Hours',          icon: '⏰' },
  { id: 'media',      label: 'Media Library',  icon: '🖼' },
  { id: 'theme',      label: 'Theme',          icon: '🎨' },
  { id: 'seo',        label: 'SEO',            icon: '🔍' },
  { id: 'bookings',   label: 'Bookings',       icon: '📋' },
  { id: 'backup',     label: 'Backup',         icon: '💾' },
]

export default function AdminShell({ session }: Props) {
  const router = useRouter()
  const [tab,         setTab]        = useState<Tab>('home')
  const [settings,    setSettings]   = useState<Record<string, unknown>>({})
  const [procedures,  setProcedures] = useState<unknown[]>([])
  const [reviews,     setReviews]    = useState<unknown[]>([])
  const [media,       setMedia]      = useState<unknown[]>([])
  const [bookings,    setBookings]   = useState<unknown[]>([])
  const [hasDraft,    setHasDraft]   = useState(false)
  const [saving,      setSaving]     = useState(false)
  const [publishing,  setPublishing] = useState(false)
  const [toast,       setToast]      = useState('')
  const [isOpen,      setOpen]       = useState(true)

  // Load all data on mount
  useEffect(() => {
    loadAll()
  }, [])

  async function loadAll() {
    const [sRes, pRes, rRes, mRes, bRes, pubRes] = await Promise.all([
      fetch('/api/cms/settings?draft=1'),
      fetch('/api/cms/procedures'),
      fetch('/api/cms/reviews'),
      fetch('/api/cms/media'),
      fetch('/api/booking'),
      fetch('/api/cms/publish'),
    ])
    if (sRes.ok)   setSettings(await sRes.json())
    if (pRes.ok)   setProcedures(await pRes.json())
    if (rRes.ok)   setReviews(await rRes.json())
    if (mRes.ok)   setMedia(await mRes.json())
    if (bRes.ok)   setBookings(await bRes.json())
    if (pubRes.ok) setHasDraft((await pubRes.json()).hasDraft)
  }

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }, [])

  async function saveSetting(key: string, value: unknown) {
    setSaving(true)
    try {
      const res = await fetch('/api/cms/settings', {
        method:  'PUT',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ key, value }),
      })
      if (res.ok) {
        setSettings(prev => ({ ...prev, [key]: value }))
        setHasDraft(true)
        showToast('Draft saved ✓')
      }
    } finally { setSaving(false) }
  }

  async function publishAll() {
    setPublishing(true)
    try {
      const res = await fetch('/api/cms/publish', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({}),
      })
      if (res.ok) {
        setHasDraft(false)
        showToast('Published live ✓')
      }
    } finally { setPublishing(false) }
  }

  async function uploadMedia(file: File): Promise<string | null> {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/cms/media/upload', { method: 'POST', body: fd })
    if (!res.ok) { showToast('Upload failed'); return null }
    const data = await res.json()
    setMedia(prev => [data, ...prev])
    return data.url
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (!isOpen) return null

  const s = settings as Record<string, Record<string, unknown>>

  return (
    <div className="dp-admin-veil is-open">
      <div className="dp-admin-modal" style={{maxWidth:'1180px', maxHeight:'92vh'}}>

        {/* Sidebar */}
        <aside className="dp-admin-aside" style={{overflowY:'auto', maxHeight:'92vh'}}>
          <div className="lg">DermaPride<em style={{fontStyle:'italic', color:'var(--dp-teal-300)'}}>.</em></div>
          <div className="sub">Admin CMS</div>

          {NAV.map(item => (
            <div
              key={item.id}
              className={`nav-item${tab === item.id ? ' is-active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}

          <div className="footer">
            <div style={{marginBottom:'8px', opacity:0.7}}>{session.email}</div>
            <button
              onClick={logout}
              style={{background:'none', border:'none', color:'rgba(255,255,255,0.5)', cursor:'pointer', fontSize:'12px', padding:0}}
            >
              Sign out
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="dp-admin-main">
          {/* Top bar */}
          <div className="dp-admin-bar">
            <div className="ctx">
              <strong>DermaPride CMS</strong>
              <span style={{marginLeft:'12px'}}>{hasDraft ? '· Unpublished changes' : '· Up to date'}</span>
            </div>
            <div className="actions">
              {hasDraft && (
                <button
                  onClick={publishAll}
                  disabled={publishing}
                  style={{
                    padding:'10px 20px', background:'var(--dp-teal-700)', color:'white',
                    border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px',
                    fontFamily:'var(--dp-sans)', fontWeight:'500',
                  }}
                >
                  {publishing ? 'Publishing…' : 'Publish Changes'}
                </button>
              )}
              <div
                className="close"
                onClick={() => setOpen(false)}
                title="Close admin"
              >✕</div>
            </div>
          </div>

          {/* Content */}
          <div className="dp-admin-content">
            {tab === 'home' && <HomeTab s={s} save={saveSetting} upload={uploadMedia} />}
            {tab === 'doctor' && <DoctorTab s={s} save={saveSetting} upload={uploadMedia} />}
            {tab === 'philosophy' && <PhilosophyTab s={s} save={saveSetting} />}
            {tab === 'results' && <ResultsTab s={s} save={saveSetting} upload={uploadMedia} />}
            {tab === 'offers' && <OffersTab s={s} save={saveSetting} upload={uploadMedia} />}
            {tab === 'faq' && <FaqTab s={s} save={saveSetting} />}
            {tab === 'branches' && <BranchesTab s={s} save={saveSetting} upload={uploadMedia} />}
            {tab === 'hours' && <HoursTab s={s} save={saveSetting} />}
            {tab === 'reviews' && <ReviewsTab reviews={reviews} setReviews={setReviews} upload={uploadMedia} showToast={showToast} />}
            {tab === 'procedures' && <ProceduresTab procedures={procedures} setProcedures={setProcedures} upload={uploadMedia} showToast={showToast} />}
            {tab === 'media' && <MediaTab media={media} upload={uploadMedia} />}
            {tab === 'theme' && <ThemeTab s={s} save={saveSetting} />}
            {tab === 'seo' && <SeoTab s={s} save={saveSetting} />}
            {tab === 'bookings' && <BookingsTab bookings={bookings} />}
            {tab === 'backup' && <BackupTab settings={settings} showToast={showToast} />}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position:'fixed', bottom:'24px', left:'50%', transform:'translateX(-50%)',
          background:'var(--cine-ink)', color:'var(--cine-paper)', padding:'12px 24px',
          borderRadius:'8px', fontFamily:'var(--dp-sans)', fontSize:'13px', zIndex:9999,
          boxShadow:'0 20px 40px rgba(0,0,0,0.3)',
        }}>
          {toast}
        </div>
      )}
    </div>
  )
}

// ── Shared field components ──────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{marginBottom:'16px'}}>
      <label style={{display:'block', fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', opacity:'0.6', marginBottom:'6px'}}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { value: string; onChange: (v: string) => void }) {
  return (
    <input
      {...props}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{width:'100%', padding:'10px 12px', border:'1px solid var(--dp-line-strong)', borderRadius:'6px', fontFamily:'var(--dp-sans)', fontSize:'13px', background:'var(--dp-shell)', color:'var(--dp-ink-800)', boxSizing:'border-box'}}
    />
  )
}

function Textarea({ value, onChange, rows = 3 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <textarea
      value={value}
      rows={rows}
      onChange={e => onChange(e.target.value)}
      style={{width:'100%', padding:'10px 12px', border:'1px solid var(--dp-line-strong)', borderRadius:'6px', fontFamily:'var(--dp-sans)', fontSize:'13px', background:'var(--dp-shell)', color:'var(--dp-ink-800)', boxSizing:'border-box', resize:'vertical'}}
    />
  )
}

function ImageField({ label, value, onChange, upload }: { label: string; value: string; onChange: (v: string) => void; upload: (f: File) => Promise<string | null> }) {
  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) onChange(url)
  }
  return (
    <Field label={label}>
      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
        {value && <img src={value} alt="" style={{width:'60px', height:'60px', objectFit:'cover', borderRadius:'4px', flexShrink:0}} />}
        <div style={{flex:1}}>
          <Input value={value} onChange={onChange} placeholder="URL or upload" />
          <label style={{display:'inline-block', marginTop:'6px', padding:'6px 12px', background:'var(--dp-teal-50)', color:'var(--dp-teal-800)', borderRadius:'4px', fontSize:'12px', cursor:'pointer', fontFamily:'var(--dp-sans)'}}>
            Upload file
            <input type="file" accept="image/*,video/*" style={{display:'none'}} onChange={handleFile} />
          </label>
        </div>
      </div>
    </Field>
  )
}

function SaveBtn({ onClick, saving }: { onClick: () => void; saving?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      style={{marginTop:'16px', padding:'12px 24px', background:'var(--cine-ink)', color:'var(--cine-paper)', border:'none', borderRadius:'8px', fontFamily:'var(--dp-sans)', fontSize:'13px', fontWeight:'500', cursor:'pointer'}}
    >
      {saving ? 'Saving…' : 'Save to Draft'}
    </button>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="dp-admin-block">
      <h4>{title}</h4>
      {children}
    </div>
  )
}

// ── Tab components ────────────────────────────────────────

function HomeTab({ s, save, upload }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void; upload: (f: File) => Promise<string | null> }) {
  const hero    = (s['home.hero']    || {}) as Record<string, string>
  const contact = (s['home.contact'] || {}) as Record<string, string>

  const [h, setH] = useState<Record<string,string>>(hero)
  const [c, setC] = useState<Record<string,string>>(contact)

  const sh = (k: string) => (v: string) => setH(prev => ({ ...prev, [k]: v }))
  const sc = (k: string) => (v: string) => setC(prev => ({ ...prev, [k]: v }))

  return (
    <>
      <Block title="Hero Section">
        <ImageField label="Background Image" value={h.backgroundImage || ''} onChange={sh('backgroundImage')} upload={upload} />
        <Field label="Kicker"><Input value={h.kicker || ''} onChange={sh('kicker')} /></Field>
        <Field label="Headline Line 1"><Input value={h.l1 || ''} onChange={sh('l1')} /></Field>
        <Field label="Headline Line 2"><Input value={h.l2 || ''} onChange={sh('l2')} /></Field>
        <Field label="Headline Line 3"><Input value={h.l3 || ''} onChange={sh('l3')} /></Field>
        <Field label="Side Paragraph"><Textarea value={h.side || ''} onChange={sh('side')} /></Field>
        <Field label="CTA Primary Text"><Input value={h.ctaPrimary || ''} onChange={sh('ctaPrimary')} /></Field>
        <Field label="CTA Primary Href"><Input value={h.ctaPrimaryHref || ''} onChange={sh('ctaPrimaryHref')} /></Field>
        <Field label="CTA Secondary Text"><Input value={h.ctaSecondary || ''} onChange={sh('ctaSecondary')} /></Field>
        <Field label="CTA Secondary Href"><Input value={h.ctaSecondaryHref || ''} onChange={sh('ctaSecondaryHref')} /></Field>
        <SaveBtn onClick={() => save('home.hero', h)} />
      </Block>
      <Block title="Contact">
        <Field label="Phone"><Input value={c.phone || ''} onChange={sc('phone')} /></Field>
        <Field label="Facebook URL"><Input value={c.facebook || ''} onChange={sc('facebook')} /></Field>
        <Field label="LINE URL"><Input value={c.line || ''} onChange={sc('line')} /></Field>
        <Field label="Instagram URL"><Input value={c.instagram || ''} onChange={sc('instagram')} /></Field>
        <SaveBtn onClick={() => save('home.contact', c)} />
      </Block>
    </>
  )
}

function DoctorTab({ s, save, upload }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void; upload: (f: File) => Promise<string | null> }) {
  const init = (s['home.doctor'] || {}) as Record<string, string>
  const [d, setD] = useState<Record<string,string>>(init)
  const sd = (k: string) => (v: string) => setD(prev => ({ ...prev, [k]: v }))

  return (
    <Block title="Doctor Profile">
      <ImageField label="Portrait Image" value={d.image || ''} onChange={sd('image')} upload={upload} />
      <Field label="Role / Title"><Input value={d.role || ''} onChange={sd('role')} /></Field>
      <Field label="Name (EN)"><Input value={d.name || ''} onChange={sd('name')} /></Field>
      <Field label="Name (Thai)"><Input value={d.nameTh || ''} onChange={sd('nameTh')} /></Field>
      <Field label="License No."><Input value={d.license || ''} onChange={sd('license')} /></Field>
      <Field label="Quote"><Textarea value={d.quote || ''} onChange={sd('quote')} /></Field>
      <Field label="Bio"><Textarea value={d.bio || ''} onChange={sd('bio')} rows={5} /></Field>
      <Field label="Specialization"><Input value={d.specialization || ''} onChange={sd('specialization')} /></Field>
      <Field label="Certifications"><Input value={d.certifications || ''} onChange={sd('certifications')} /></Field>
      <Field label="Experience"><Input value={d.experience || ''} onChange={sd('experience')} /></Field>
      <Field label="Verification URL"><Input value={d.verificationUrl || ''} onChange={sd('verificationUrl')} /></Field>
      <SaveBtn onClick={() => save('home.doctor', d)} />
    </Block>
  )
}

function PhilosophyTab({ s, save }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void }) {
  type Phil = { kicker: string; title: string; sub: string; items: Array<{id:string; title:string; titleTh:string; body:string; visible:boolean}> }
  const [p, setP] = useState<Phil>((s['home.philosophy'] as Phil) || { kicker:'', title:'', sub:'', items:[] })

  function updateItem(idx: number, key: string, val: string) {
    setP(prev => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [key]: val }
      return { ...prev, items }
    })
  }

  return (
    <Block title="Philosophy / 4 แท้ Pillars">
      <Field label="Kicker"><Input value={p.kicker} onChange={v => setP(x => ({...x, kicker:v}))} /></Field>
      <Field label="Sub Text"><Textarea value={p.sub} onChange={v => setP(x => ({...x, sub:v}))} /></Field>
      <hr style={{margin:'20px 0', border:'none', borderTop:'1px solid var(--dp-line)'}} />
      {p.items.map((item, i) => (
        <div key={item.id} style={{padding:'16px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'12px'}}>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', opacity:'0.5', marginBottom:'12px'}}>Pillar {i+1}</div>
          <Field label="Title (EN)"><Input value={item.title} onChange={v => updateItem(i,'title',v)} /></Field>
          <Field label="Title (Thai)"><Input value={item.titleTh} onChange={v => updateItem(i,'titleTh',v)} /></Field>
          <Field label="Description"><Textarea value={item.body} onChange={v => updateItem(i,'body',v)} rows={2} /></Field>
        </div>
      ))}
      <SaveBtn onClick={() => save('home.philosophy', p)} />
    </Block>
  )
}

function ResultsTab({ s, save, upload }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void; upload: (f: File) => Promise<string | null> }) {
  type Results = { items: Array<{id:string; image:string; title:string; summary:string; treatment:string; amount:string; resultTime:string; visible:boolean}> }
  const [r, setR] = useState<Results>((s['home.results'] as Results) || { items:[] })

  function updateItem(idx: number, key: string, val: string) {
    setR(prev => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [key]: val }
      return { ...prev, items }
    })
  }

  return (
    <Block title="Before & After Results">
      {r.items.map((item, i) => (
        <div key={item.id} style={{padding:'16px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'12px'}}>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', opacity:'0.5', marginBottom:'12px'}}>Case {i+1}</div>
          <ImageField label="Image" value={item.image} onChange={v => updateItem(i,'image',v)} upload={upload} />
          <Field label="Title"><Input value={item.title} onChange={v => updateItem(i,'title',v)} /></Field>
          <Field label="Summary"><Textarea value={item.summary} onChange={v => updateItem(i,'summary',v)} rows={2} /></Field>
          <Field label="Treatment"><Input value={item.treatment} onChange={v => updateItem(i,'treatment',v)} /></Field>
          <Field label="Amount"><Input value={item.amount} onChange={v => updateItem(i,'amount',v)} /></Field>
          <Field label="Result Time"><Input value={item.resultTime} onChange={v => updateItem(i,'resultTime',v)} /></Field>
        </div>
      ))}
      <SaveBtn onClick={() => save('home.results', r)} />
    </Block>
  )
}

function OffersTab({ s, save, upload }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void; upload: (f: File) => Promise<string | null> }) {
  type Offers = { items: Array<{id:string; image:string; title:string; sub:string; tag:string; price:string; was:string; ctaHref:string; visible:boolean}> }
  const [o, setO] = useState<Offers>((s['home.offers'] as Offers) || { items:[] })

  function updateItem(idx: number, key: string, val: string) {
    setO(prev => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [key]: val }
      return { ...prev, items }
    })
  }

  return (
    <Block title="Curated Offerings / Promotions">
      {o.items.map((item, i) => (
        <div key={item.id} style={{padding:'16px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'12px'}}>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.14em', textTransform:'uppercase', opacity:'0.5', marginBottom:'12px'}}>Offer {i+1}</div>
          <ImageField label="Image" value={item.image} onChange={v => updateItem(i,'image',v)} upload={upload} />
          <Field label="Title (use [Em] for italic)"><Input value={item.title} onChange={v => updateItem(i,'title',v)} /></Field>
          <Field label="Sub Title"><Input value={item.sub} onChange={v => updateItem(i,'sub',v)} /></Field>
          <Field label="Tag"><Input value={item.tag} onChange={v => updateItem(i,'tag',v)} /></Field>
          <Field label="Price"><Input value={item.price} onChange={v => updateItem(i,'price',v)} /></Field>
          <Field label="Was Price"><Input value={item.was} onChange={v => updateItem(i,'was',v)} /></Field>
          <Field label="CTA Link"><Input value={item.ctaHref} onChange={v => updateItem(i,'ctaHref',v)} /></Field>
        </div>
      ))}
      <SaveBtn onClick={() => save('home.offers', o)} />
    </Block>
  )
}

function FaqTab({ s, save }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void }) {
  type Faq = { items: Array<{id:string; q:string; a:string; visible:boolean}> }
  const [f, setF] = useState<Faq>((s['home.faq'] as Faq) || { items:[] })

  function updateItem(idx: number, key: string, val: string) {
    setF(prev => {
      const items = [...prev.items]
      items[idx] = { ...items[idx], [key]: val }
      return { ...prev, items }
    })
  }
  function addItem() {
    setF(prev => ({ items: [...prev.items, { id:`fq_${Date.now()}`, q:'', a:'', visible:true }] }))
  }
  function removeItem(idx: number) {
    setF(prev => ({ items: prev.items.filter((_, i) => i !== idx) }))
  }

  return (
    <Block title="FAQ">
      {f.items.map((item, i) => (
        <div key={item.id} style={{padding:'16px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'12px'}}>
          <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
            <span style={{fontFamily:'var(--dp-mono)', fontSize:'10px', textTransform:'uppercase', opacity:'0.5'}}>Q{i+1}</span>
            <button onClick={() => removeItem(i)} style={{background:'none', border:'none', color:'var(--dp-blush-500)', cursor:'pointer', fontSize:'12px'}}>Remove</button>
          </div>
          <Field label="Question"><Input value={item.q} onChange={v => updateItem(i,'q',v)} /></Field>
          <Field label="Answer"><Textarea value={item.a} onChange={v => updateItem(i,'a',v)} rows={3} /></Field>
        </div>
      ))}
      <button onClick={addItem} style={{marginBottom:'12px', padding:'10px 16px', background:'var(--dp-teal-50)', color:'var(--dp-teal-800)', border:'1px solid var(--dp-teal-200)', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}>
        + Add Question
      </button>
      <SaveBtn onClick={() => save('home.faq', f)} />
    </Block>
  )
}

function BranchesTab({ s, save, upload }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void; upload: (f: File) => Promise<string | null> }) {
  type BranchList = Array<Record<string,string>>
  const [branches, setBranches] = useState<BranchList>((s['home.branches'] as BranchList) || [])

  function updateBranch(idx: number, key: string, val: string) {
    setBranches(prev => {
      const arr = [...prev]
      arr[idx] = { ...arr[idx], [key]: val }
      return arr
    })
  }

  return (
    <Block title="Branch Locations">
      {branches.map((branch, i) => (
        <div key={i} style={{padding:'20px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'16px'}}>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'10px', textTransform:'uppercase', opacity:'0.5', marginBottom:'14px'}}>Branch {i+1}</div>
          <Field label="Branch Name"><Input value={branch.name || ''} onChange={v => updateBranch(i,'name',v)} /></Field>
          <Field label="Address"><Input value={branch.address || ''} onChange={v => updateBranch(i,'address',v)} /></Field>
          <Field label="Phone"><Input value={branch.phone || ''} onChange={v => updateBranch(i,'phone',v)} /></Field>
          <Field label="License"><Input value={branch.license || ''} onChange={v => updateBranch(i,'license',v)} /></Field>
          <ImageField label="Image 1" value={branch.image1 || ''} onChange={v => updateBranch(i,'image1',v)} upload={upload} />
          <ImageField label="Image 2" value={branch.image2 || ''} onChange={v => updateBranch(i,'image2',v)} upload={upload} />
          <ImageField label="Image 3" value={branch.image3 || ''} onChange={v => updateBranch(i,'image3',v)} upload={upload} />
          <Field label="Google Maps URL"><Input value={branch.mapUrl || ''} onChange={v => updateBranch(i,'mapUrl',v)} /></Field>
          <Field label="Maps Embed URL"><Input value={branch.mapEmbed || ''} onChange={v => updateBranch(i,'mapEmbed',v)} /></Field>
        </div>
      ))}
      <SaveBtn onClick={() => save('home.branches', branches)} />
    </Block>
  )
}

function HoursTab({ s, save }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void }) {
  type HourRow = { day: string; th: string; open: string; close: string; closed: boolean }
  const [hours, setHours] = useState<HourRow[]>((s['home.hours'] as HourRow[]) || [])

  function update(idx: number, key: string, val: string | boolean) {
    setHours(prev => {
      const arr = [...prev]
      arr[idx] = { ...arr[idx], [key]: val }
      return arr
    })
  }

  return (
    <Block title="Opening Hours">
      {hours.map((row, i) => (
        <div key={i} style={{display:'grid', gridTemplateColumns:'1fr auto auto auto auto', gap:'8px', alignItems:'center', padding:'8px 0', borderTop:i>0?'1px solid var(--dp-line)':'none'}}>
          <div style={{fontFamily:'var(--dp-display)', fontSize:'16px'}}>{row.day} <span style={{fontFamily:'var(--dp-sans)', fontSize:'12px', opacity:'0.6'}}>{row.th}</span></div>
          <input type="time" value={row.open} disabled={row.closed} onChange={e => update(i,'open',e.target.value)}
            style={{padding:'6px 8px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', fontFamily:'var(--dp-mono)', fontSize:'12px', width:'90px'}} />
          <input type="time" value={row.close} disabled={row.closed} onChange={e => update(i,'close',e.target.value)}
            style={{padding:'6px 8px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', fontFamily:'var(--dp-mono)', fontSize:'12px', width:'90px'}} />
          <label style={{display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', fontFamily:'var(--dp-sans)', whiteSpace:'nowrap'}}>
            <input type="checkbox" checked={row.closed} onChange={e => update(i,'closed',e.target.checked)} />
            Closed
          </label>
        </div>
      ))}
      <SaveBtn onClick={() => save('home.hours', hours)} />
    </Block>
  )
}

function ReviewsTab({ reviews, setReviews, upload, showToast }: {
  reviews: unknown[]
  setReviews: React.Dispatch<React.SetStateAction<unknown[]>>
  upload: (f: File) => Promise<string | null>
  showToast: (m: string) => void
}) {
  type Review = { id: string; name: string; age: string; treatment: string; body: string; stars: number; image_url: string }
  const list = reviews as Review[]

  async function save(r: Review) {
    const res = await fetch(`/api/cms/reviews/${r.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    })
    if (res.ok) showToast('Review saved ✓')
  }

  async function remove(id: string) {
    await fetch(`/api/cms/reviews/${id}`, { method: 'DELETE' })
    setReviews(prev => (prev as Review[]).filter(r => r.id !== id))
    showToast('Review deleted')
  }

  return (
    <Block title="Customer Reviews">
      {list.map((r, i) => (
        <ReviewCard key={r.id} r={r} idx={i} onSave={save} onRemove={() => remove(r.id)} upload={upload} />
      ))}
      <button
        onClick={async () => {
          const res = await fetch('/api/cms/reviews', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name:'New Review', body:'Review text', stars:5}) })
          if (res.ok) { const nr = await res.json(); setReviews(prev => [...prev, nr]) }
        }}
        style={{padding:'10px 16px', background:'var(--dp-teal-50)', color:'var(--dp-teal-800)', border:'1px solid var(--dp-teal-200)', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}
      >
        + Add Review
      </button>
    </Block>
  )
}

function ReviewCard({ r, idx, onSave, onRemove, upload }: { r: {id:string;name:string;age:string;treatment:string;body:string;stars:number;image_url:string}; idx: number; onSave: (r: typeof r) => void; onRemove: () => void; upload: (f: File) => Promise<string | null> }) {
  const [d, setD] = useState(r)
  const sd = (k: string) => (v: string | number) => setD(prev => ({ ...prev, [k]: v }))

  return (
    <div style={{padding:'16px', background:'var(--dp-shell)', borderRadius:'8px', marginBottom:'12px'}}>
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'10px'}}>
        <span style={{fontFamily:'var(--dp-mono)', fontSize:'10px', textTransform:'uppercase', opacity:'0.5'}}>Review {idx+1}</span>
        <button onClick={onRemove} style={{background:'none', border:'none', color:'var(--dp-blush-500)', cursor:'pointer', fontSize:'12px'}}>Remove</button>
      </div>
      <Field label="Name"><Input value={d.name || ''} onChange={sd('name') as (v:string)=>void} /></Field>
      <Field label="Age"><Input value={d.age || ''} onChange={sd('age') as (v:string)=>void} /></Field>
      <Field label="Treatment"><Input value={d.treatment || ''} onChange={sd('treatment') as (v:string)=>void} /></Field>
      <Field label="Review Text"><Textarea value={d.body || ''} onChange={sd('body') as (v:string)=>void} /></Field>
      <Field label="Stars">
        <select value={d.stars} onChange={e => setD(p => ({...p, stars: Number(e.target.value)}))} style={{padding:'8px 12px', border:'1px solid var(--dp-line-strong)', borderRadius:'6px', fontSize:'13px'}}>
          {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
        </select>
      </Field>
      <ImageField label="Photo" value={d.image_url || ''} onChange={sd('image_url') as (v:string)=>void} upload={upload} />
      <button onClick={() => onSave(d)} style={{padding:'10px 20px', background:'var(--cine-ink)', color:'var(--cine-paper)', border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}>
        Save
      </button>
    </div>
  )
}

function ProceduresTab({ procedures, setProcedures, upload, showToast }: {
  procedures: unknown[]
  setProcedures: React.Dispatch<React.SetStateAction<unknown[]>>
  upload: (f: File) => Promise<string | null>
  showToast: (m: string) => void
}) {
  type Proc = { id: string; name: string; name_th: string; slug: string; description: string; image_url: string; visible: boolean; sort_order: number }
  const list = procedures as Proc[]

  async function save(p: Proc) {
    const res = await fetch(`/api/cms/procedures/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    })
    if (res.ok) { const updated = await res.json(); setProcedures(prev => (prev as Proc[]).map(x => x.id === p.id ? updated : x)); showToast('Procedure saved ✓') }
  }

  async function addProc() {
    const name = prompt('Procedure name (English):')
    if (!name) return
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')
    const res = await fetch('/api/cms/procedures', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name, slug}) })
    if (res.ok) { const np = await res.json(); setProcedures(prev => [...prev, np]); showToast('Procedure created ✓') }
    else { const e = await res.json(); showToast(e.error || 'Error') }
  }

  return (
    <Block title="Procedure Categories">
      {list.map((p, i) => (
        <div key={p.id} style={{display:'grid', gridTemplateColumns:'60px 1fr 1fr 1fr auto', gap:'8px', alignItems:'center', padding:'12px 0', borderTop:i>0?'1px solid var(--dp-line)':'none'}}>
          <img src={p.image_url || '/assets/welcome-hero.jpg'} alt="" style={{width:'52px', height:'52px', objectFit:'cover', borderRadius:'4px'}} />
          <div>
            <div style={{fontWeight:'600', fontSize:'14px'}}>{p.name}</div>
            <div style={{fontSize:'12px', opacity:'0.6'}}>{p.name_th}</div>
          </div>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'11px', opacity:'0.6'}}>/procedures/{p.slug}</div>
          <div style={{fontSize:'12px', opacity:'0.7'}}>{p.description}</div>
          <div style={{display:'flex', gap:'8px'}}>
            <a href={`/procedures/${p.slug}`} target="_blank" style={{padding:'6px 10px', background:'var(--dp-teal-50)', color:'var(--dp-teal-800)', borderRadius:'4px', fontSize:'12px', textDecoration:'none'}}>
              View
            </a>
          </div>
        </div>
      ))}
      <button onClick={addProc} style={{marginTop:'16px', padding:'10px 16px', background:'var(--dp-teal-50)', color:'var(--dp-teal-800)', border:'1px solid var(--dp-teal-200)', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}>
        + Add Procedure
      </button>
    </Block>
  )
}

function MediaTab({ media, upload }: { media: unknown[]; upload: (f: File) => Promise<string | null> }) {
  type Media = { id: string; filename: string; public_url: string; mime_type: string; size_bytes: number }
  const list = media as Media[]
  const [dragging, setDragging] = useState(false)

  async function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const files = Array.from(e.dataTransfer.files)
    for (const f of files) await upload(f)
  }

  return (
    <Block title="Media Library">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{border:`2px dashed ${dragging ? 'var(--dp-teal-600)' : 'var(--dp-line-strong)'}`, borderRadius:'8px', padding:'32px', textAlign:'center', marginBottom:'16px', background: dragging ? 'var(--dp-teal-50)' : 'transparent', transition:'all 200ms ease'}}
      >
        <div style={{fontFamily:'var(--dp-sans)', fontSize:'14px', color:'var(--dp-ink-500)'}}>
          Drag & drop files here
        </div>
        <label style={{display:'inline-block', marginTop:'12px', padding:'10px 20px', background:'var(--cine-ink)', color:'var(--cine-paper)', borderRadius:'6px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}>
          Choose Files
          <input type="file" multiple accept="image/*,video/*" style={{display:'none'}} onChange={async e => {
            for (const f of Array.from(e.target.files ?? [])) await upload(f)
          }} />
        </label>
      </div>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(120px,1fr))', gap:'10px'}}>
        {list.map((m) => (
          <div key={m.id} style={{position:'relative'}}>
            <img src={m.public_url} alt={m.filename} style={{width:'100%', aspectRatio:'1', objectFit:'cover', borderRadius:'6px'}} />
            <div style={{fontSize:'10px', fontFamily:'var(--dp-mono)', opacity:'0.6', marginTop:'4px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{m.filename}</div>
          </div>
        ))}
      </div>
    </Block>
  )
}

function ThemeTab({ s, save }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void }) {
  type Theme = { primary: string; secondary: string; ink: string; paper: string; radiusScale: number; fontScale: number }
  const [t, setT] = useState<Theme>((s['theme'] as Theme) || { primary:'#1A968F', secondary:'#E8A89E', ink:'#14242A', paper:'#FAF7F2', radiusScale:1, fontScale:1 })
  const st = (k: string) => (v: string) => setT(prev => ({ ...prev, [k]: v }))

  return (
    <Block title="Global Theme">
      <Field label="Primary Color"><input type="color" value={t.primary} onChange={e => st('primary')(e.target.value)} style={{width:'60px', height:'36px', padding:'2px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', cursor:'pointer'}} /> <Input value={t.primary} onChange={st('primary')} style={{display:'inline', width:'auto', marginLeft:'8px'} as React.CSSProperties} /></Field>
      <Field label="Secondary Color"><input type="color" value={t.secondary} onChange={e => st('secondary')(e.target.value)} style={{width:'60px', height:'36px', padding:'2px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', cursor:'pointer'}} /></Field>
      <Field label="Ink Color"><input type="color" value={t.ink} onChange={e => st('ink')(e.target.value)} style={{width:'60px', height:'36px', padding:'2px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', cursor:'pointer'}} /></Field>
      <Field label="Paper Color"><input type="color" value={t.paper} onChange={e => st('paper')(e.target.value)} style={{width:'60px', height:'36px', padding:'2px', border:'1px solid var(--dp-line-strong)', borderRadius:'4px', cursor:'pointer'}} /></Field>
      <SaveBtn onClick={() => save('theme', t)} />
    </Block>
  )
}

function SeoTab({ s, save }: { s: Record<string, Record<string, unknown>>; save: (k: string, v: unknown) => void }) {
  type Seo = { title: string; description: string; ogImage: string }
  const [seo, setSeo] = useState<Seo>((s['seo.home'] as Seo) || { title:'', description:'', ogImage:'' })
  const ss = (k: string) => (v: string) => setSeo(prev => ({ ...prev, [k]: v }))

  return (
    <Block title="SEO — Homepage">
      <Field label="Meta Title"><Input value={seo.title} onChange={ss('title')} /></Field>
      <Field label="Meta Description"><Textarea value={seo.description} onChange={ss('description')} rows={2} /></Field>
      <Field label="OG Image URL"><Input value={seo.ogImage} onChange={ss('ogImage')} /></Field>
      <SaveBtn onClick={() => save('seo.home', seo)} />
    </Block>
  )
}

function BookingsTab({ bookings }: { bookings: unknown[] }) {
  type Booking = { id: string; name: string; phone: string; branch: string; service: string; date: string; time_slot: string; status: string; created_at: string }
  const list = bookings as Booking[]

  return (
    <Block title="Bookings">
      <div style={{overflowX:'auto'}}>
        <table style={{width:'100%', borderCollapse:'collapse', fontFamily:'var(--dp-sans)', fontSize:'13px'}}>
          <thead>
            <tr style={{borderBottom:'2px solid var(--dp-line)'}}>
              {['Name','Phone','Branch','Service','Date','Time','Status','Received'].map(h => (
                <th key={h} style={{padding:'8px 12px', textAlign:'left', fontWeight:'600', color:'var(--dp-ink-600)', fontSize:'11px', textTransform:'uppercase', letterSpacing:'0.06em'}}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map(b => (
              <tr key={b.id} style={{borderBottom:'1px solid var(--dp-line)'}}>
                <td style={{padding:'10px 12px', fontWeight:'600'}}>{b.name}</td>
                <td style={{padding:'10px 12px'}}>{b.phone}</td>
                <td style={{padding:'10px 12px', opacity:'0.7'}}>{b.branch}</td>
                <td style={{padding:'10px 12px', opacity:'0.7'}}>{b.service}</td>
                <td style={{padding:'10px 12px', fontFamily:'var(--dp-mono)', fontSize:'12px'}}>{b.date}</td>
                <td style={{padding:'10px 12px', fontFamily:'var(--dp-mono)', fontSize:'12px'}}>{b.time_slot}</td>
                <td style={{padding:'10px 12px'}}>
                  <span style={{padding:'3px 8px', background:b.status==='confirmed'?'var(--dp-teal-50)':b.status==='cancelled'?'var(--dp-blush-100)':'#FFF4E1', color:b.status==='confirmed'?'var(--dp-teal-800)':b.status==='cancelled'?'#a0443c':'#C2741A', borderRadius:'999px', fontSize:'11px', fontWeight:'500'}}>
                    {b.status}
                  </span>
                </td>
                <td style={{padding:'10px 12px', fontFamily:'var(--dp-mono)', fontSize:'11px', opacity:'0.6'}}>{new Date(b.created_at).toLocaleDateString('th-TH')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <div style={{padding:'32px', textAlign:'center', opacity:'0.5', fontFamily:'var(--dp-sans)'}}>No bookings yet</div>}
      </div>
    </Block>
  )
}

function BackupTab({ settings, showToast }: { settings: Record<string, unknown>; showToast: (m: string) => void }) {
  function exportJSON() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href = url; a.download = `dermapride-backup-${Date.now()}.json`
    a.click(); URL.revokeObjectURL(url)
    showToast('Backup exported ✓')
  }

  return (
    <Block title="Backup & Restore">
      <p style={{fontFamily:'var(--dp-sans)', fontSize:'14px', color:'var(--dp-ink-600)', marginBottom:'16px'}}>
        Export all site settings as a JSON backup, or restore from a previous export.
      </p>
      <button onClick={exportJSON} style={{padding:'12px 24px', background:'var(--cine-ink)', color:'var(--cine-paper)', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontFamily:'var(--dp-sans)'}}>
        Export JSON Backup
      </button>
    </Block>
  )
}
