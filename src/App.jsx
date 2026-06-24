import './App.css'
import Addnotes from './components/Addnotes.jsx'
import Notes from './components/Notes.jsx'

function App() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(160deg,#faf9ff 0%,#f5f3ff 50%,#ecfdf5 100%)',
            padding: '40px 32px',
            fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
            boxSizing: 'border-box',
        }}>
            {/* Header */}
            <div style={{ marginBottom: '36px', textAlign: 'center' }}>
                <h1 style={{
                    fontSize: '2.6rem', fontWeight: '800',
                    background: 'linear-gradient(135deg,#a78bfa,#34d399,#fda4af)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    margin: '0 0 6px 0', letterSpacing: '-0.04em'
                }}>My Notes</h1>
                <p style={{ color: '#c4b5fd', fontSize: '0.9rem', margin: 0, fontWeight: '600' }}>
                    Your thoughts, organised ✨
                </p>
            </div>

            {/* Two-column layout for laptop, single column for mobile */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.6fr)',
                gap: '28px',
                maxWidth: '1200px',
                margin: '0 auto',
                alignItems: 'start',
            }}
                className="app-grid"
            >
                {/* Left — Add / Edit note */}
                <div style={{ position: 'sticky', top: '32px' }}>
                    <p style={{
                        fontSize: '0.7rem', fontWeight: '700', color: '#a78bfa',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        marginBottom: '10px', paddingLeft: '4px'
                    }}>Compose</p>
                    <Addnotes />
                </div>

                {/* Right — Notes list */}
                <div>
                    <p style={{
                        fontSize: '0.7rem', fontWeight: '700', color: '#34d399',
                        letterSpacing: '0.12em', textTransform: 'uppercase',
                        marginBottom: '10px', paddingLeft: '4px'
                    }}>All Notes</p>
                    <Notes />
                </div>
            </div>

            {/* Responsive: single column on small screens */}
            <style>{`
                @media (max-width: 768px) {
                    .app-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default App