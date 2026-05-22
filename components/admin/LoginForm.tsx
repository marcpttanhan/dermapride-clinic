'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginForm() {
  const router      = useRouter()
  const params      = useSearchParams()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    try {
      const res = await fetch('/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: fd.get('email'), password: fd.get('password') }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Login failed'); return }
      router.push(params.get('next') || '/admin/dashboard')
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--cine-black)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        background: 'var(--cine-paper)',
        borderRadius: '16px',
        padding: '44px 40px',
        boxShadow: '0 50px 120px -30px rgba(0,0,0,0.6)',
      }}>
        {/* Logo */}
        <div style={{marginBottom:'36px'}}>
          <div style={{fontFamily:'var(--dp-display)', fontWeight:'300', fontSize:'32px', letterSpacing:'-0.025em', color:'var(--cine-ink)'}}>
            DermaPride<em style={{fontStyle:'italic', color:'var(--dp-teal-700)'}}>.</em>
          </div>
          <div style={{fontFamily:'var(--dp-mono)', fontSize:'11px', letterSpacing:'0.18em', textTransform:'uppercase', opacity:'0.55', marginTop:'6px'}}>
            Admin Access
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{display:'flex', flexDirection:'column', gap:'16px', marginBottom:'24px'}}>
            <div>
              <label style={{display:'block', fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase', opacity:'0.7', marginBottom:'8px'}}>
                Email
              </label>
              <input
                name="email" type="email" required autoComplete="email"
                style={{width:'100%', padding:'14px 16px', border:'1px solid var(--cine-rule)', borderRadius:'6px', background:'var(--cine-paper)', fontFamily:'var(--dp-sans)', fontSize:'14px', color:'var(--cine-ink)', outline:'none', boxSizing:'border-box'}}
                placeholder="admin@dermapride.com"
              />
            </div>
            <div>
              <label style={{display:'block', fontFamily:'var(--dp-mono)', fontSize:'10px', letterSpacing:'0.18em', textTransform:'uppercase', opacity:'0.7', marginBottom:'8px'}}>
                Password
              </label>
              <input
                name="password" type="password" required autoComplete="current-password"
                style={{width:'100%', padding:'14px 16px', border:'1px solid var(--cine-rule)', borderRadius:'6px', background:'var(--cine-paper)', fontFamily:'var(--dp-sans)', fontSize:'14px', color:'var(--cine-ink)', outline:'none', boxSizing:'border-box'}}
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <div style={{padding:'12px 16px', background:'rgba(232,168,158,0.2)', border:'1px solid rgba(232,168,158,0.5)', borderRadius:'6px', fontFamily:'var(--dp-sans)', fontSize:'13px', color:'#a0443c', marginBottom:'16px'}}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--cine-ink)',
              color: 'var(--cine-paper)',
              border: 'none',
              borderRadius: '8px',
              fontFamily: 'var(--dp-sans)',
              fontSize: '14px',
              fontWeight: '500',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
