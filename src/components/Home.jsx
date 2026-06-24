import React from 'react'
import { useNavigate } from 'react-router-dom'

function Home() {
    const navigate = useNavigate()

    const features = [
        { icon: '🔍', title: 'Instant Search', desc: 'Find any note by topic in seconds.', bg: '#f5f3ff', border: '#c4b5fd,#a78bfa' },
        { icon: '💾', title: 'Auto Saved', desc: 'Persists across sessions with localStorage.', bg: '#f0fdf4', border: '#86efac,#34d399' },
        { icon: '✏️', title: 'Quick Edit', desc: 'Pre-fills the form instantly, ready to update.', bg: '#fff1f2', border: '#fda4af,#fb7185' },
    ]

    return (
        <div style={{ minHeight: '100vh', background: '#faf9ff', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>

         
            <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', background: 'white', borderBottom: '1.5px solid #ede9fe', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800', fontSize: '1.1rem', color: '#4c1d95' }}>
                    <div style={{ width: '34px', height: '34px', borderRadius: '12px', background: 'linear-gradient(135deg,#c4b5fd,#86efac,#fda4af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px' }}>📝</div>
                    Notely
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => navigate('/addnotes')} style={{ padding: '8px 18px', borderRadius: '99px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', border: '1.5px solid #ddd6fe', background: '#f5f3ff', color: '#7c3aed' }}>
                        + Add Notes
                    </button>
                    <button onClick={() => navigate('/viewnotes')} style={{ padding: '8px 18px', borderRadius: '99px', fontSize: '0.82rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: 'linear-gradient(135deg,#a78bfa,#34d399)', color: 'white' }}>
                        View Notes
                    </button>
                </div>
            </nav>

    
            <section style={{ padding: '72px 20px 56px', textAlign: 'center', background: 'linear-gradient(180deg,#faf9ff 0%,#f5f3ff 60%,#ecfdf5 100%)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'white', color: '#7c3aed', fontSize: '0.75rem', fontWeight: '700', padding: '5px 15px', borderRadius: '99px', border: '1.5px solid #ddd6fe', marginBottom: '26px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'linear-gradient(135deg,#a78bfa,#34d399)', display: 'inline-block' }} />
                    Built with React + Redux
                </span>
                <h1 style={{ fontSize: '3.2rem', fontWeight: '800', color: '#1e1b4b', lineHeight: '1.12', marginBottom: '16px', letterSpacing: '-0.04em' }}>
                    Your thoughts,<br />
                    <span style={{ background: 'linear-gradient(135deg,#a78bfa 0%,#34d399 50%,#fda4af 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        beautifully organised
                    </span>
                </h1>
                <p style={{ color: '#9ca3af', fontSize: '1rem', maxWidth: '380px', margin: '0 auto 36px', lineHeight: '1.8' }}>
                    Capture ideas, study notes, and everything in between. Fast, searchable, always yours.
                </p>
                <button onClick={() => navigate('/viewnotes')} style={{ padding: '14px 34px', background: 'linear-gradient(135deg,#a78bfa,#34d399)', color: 'white', border: 'none', borderRadius: '99px', fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                    Get Started →
                </button>
            </section>

           
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', padding: '0 28px 64px', maxWidth: '760px', margin: '0 auto' }}>
                {features.map(f => (
                    <div key={f.title} style={{ background: `linear-gradient(white,white) padding-box, linear-gradient(135deg,${f.border}) border-box`, border: '1.5px solid transparent', borderRadius: '20px', padding: '22px', transition: 'transform 0.2s', cursor: 'default' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', marginBottom: '14px' }}>{f.icon}</div>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '700', color: '#1e1b4b', marginBottom: '5px' }}>{f.title}</h3>
                        <p style={{ fontSize: '0.8rem', color: '#9ca3af', lineHeight: '1.65' }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Home