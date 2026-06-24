import React from 'react'
import { Link, useLocation } from 'react-router-dom'

function Footer() {
  const location = useLocation()

  const links = [
    { to: '/', label: 'Home', icon: '🏠' },
    { to: '/addnotes', label: 'Add Notes', icon: '✏️' },
    { to: '/viewnotes', label: 'View Notes', icon: '📋' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <footer style={{
      background: 'white',
      borderTop: '1.5px solid #ede9fe',
      padding: '20px 28px',
      marginTop: '40px',
      fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
    }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '1rem', color: '#4c1d95' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '9px', background: 'linear-gradient(135deg,#c4b5fd,#86efac,#fda4af)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px' }}>📝</div>
          Notely
        </div>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', gap: '6px' }}>
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 16px', borderRadius: '99px',
                  fontSize: '0.82rem', fontWeight: '700',
                  textDecoration: 'none', transition: 'all 0.2s',
                  background: isActive(link.to) ? 'linear-gradient(135deg,#a78bfa,#34d399)' : '#f5f3ff',
                  color: isActive(link.to) ? 'white' : '#7c3aed',
                  border: isActive(link.to) ? 'none' : '1.5px solid #ddd6fe',
                }}>
                <span style={{ fontSize: '13px' }}>{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <p style={{ margin: 0, fontSize: '0.78rem', color: '#c4b5fd', fontWeight: '600' }}>
          Your thoughts, organised ✨
        </p>

      </div>
    </footer>
  )
}

export default Footer