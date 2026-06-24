import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from '../features/Auth/AuthSlice'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector(state => state.auth)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        const result = await dispatch(loginUser({ email, password }))
        if (result.meta.requestStatus === 'fulfilled') navigate('/')
    }

    const inp = {
        width: '100%', padding: '12px 16px', fontSize: '0.9rem',
        background: '#faf9ff', border: '1.5px solid #ede9fe',
        borderRadius: '12px', color: '#1e1b4b',
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        outline: 'none', boxSizing: 'border-box',
        marginBottom: '12px', transition: 'all 0.2s',
    }

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#faf9ff 0%,#f5f3ff 50%,#ecfdf5 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif" }}>
            <div style={{ background: 'white', borderRadius: '24px', border: '1.5px solid #ede9fe', padding: '36px', width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg,#c4b5fd,#86efac,#fda4af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 12px' }}>📝</div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e1b4b', margin: '0 0 4px', letterSpacing: '-0.03em' }}>Welcome back</h1>
                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', margin: 0 }}>Login to your Notely account</p>
                </div>

                {error && <p style={{ color: '#f43f5e', fontSize: '0.82rem', fontWeight: '600', marginBottom: '12px', textAlign: 'center' }}>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input type='email' placeholder='Email' value={email} onChange={e => setEmail(e.target.value)}
                        style={inp}
                        onFocus={e => { e.target.style.borderColor = '#a78bfa'; e.target.style.background = '#f5f3ff' }}
                        onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.background = '#faf9ff' }} />
                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)}
                        style={{ ...inp, marginBottom: '20px' }}
                        onFocus={e => { e.target.style.borderColor = '#a78bfa'; e.target.style.background = '#f5f3ff' }}
                        onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.background = '#faf9ff' }} />
                    <button type='submit' disabled={loading}
                        style={{ width: '100%', padding: '12px', background: 'linear-gradient(135deg,#a78bfa,#34d399)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.83rem', color: '#9ca3af' }}>
                    Don't have an account?{' '}
                    <Link to='/register' style={{ color: '#7c3aed', fontWeight: '700', textDecoration: 'none' }}>Register</Link>
                </p>
            </div>
        </div>
    )
}

export default Login