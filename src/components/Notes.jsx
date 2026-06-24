import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchNotes, deleteNote, editNotes, searchNotes } from '../features/Notes/NotesSlice'
import { useNavigate } from 'react-router-dom'

const ACCENTS = [
    'linear-gradient(180deg,#c4b5fd,#a78bfa)',
    'linear-gradient(180deg,#86efac,#34d399)',
    'linear-gradient(180deg,#fda4af,#fb7185)',
    'linear-gradient(180deg,#93c5fd,#60a5fa)',
    'linear-gradient(180deg,#fde68a,#fbbf24)',
]

function Notes() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const Notes = useSelector(state => state.Notes.Notes) || []
    const search = useSelector(state => state.Notes.search)
    const loading = useSelector(state => state.Notes.loading)
    const error = useSelector(state => state.Notes.error)
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        dispatch(searchNotes(''))
        dispatch(fetchNotes())
    }, [])

    const filteredNotes = search
        ? Notes.filter(n => n.topic.toLowerCase().includes(search.toLowerCase()))
        : Notes

    const searchHandler = (e) => {
        e.preventDefault()
        dispatch(searchNotes(searchInput))
    }

    const inp = {
        width: '100%', padding: '12px 16px', fontSize: '0.9rem',
        background: '#faf9ff', border: '1.5px solid #ede9fe',
        borderRadius: '12px', color: '#1e1b4b',
        fontFamily: "'Plus Jakarta Sans',system-ui,sans-serif",
        outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s',
    }

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ color: '#a78bfa', fontWeight: '700', fontSize: '0.9rem' }}>Loading notes...</p>
        </div>
    )

    if (error) return (
        <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <p style={{ color: '#f43f5e', fontWeight: '700', fontSize: '0.9rem' }}>{error}</p>
        </div>
    )

    return (
        <div>
            {/* Scoped styles for rendered Quill HTML inside note cards */}
            <style>{`
                .note-theory { margin: 0; color: #6b7280; font-size: 0.83rem; line-height: 1.65; }
                .note-theory p { margin: 0 0 4px 0; }
                .note-theory p:last-child { margin-bottom: 0; }
                .note-theory strong { font-weight: 700; color: #374151; }
                .note-theory em { font-style: italic; }
                .note-theory u { text-decoration: underline; }
                .note-theory s { text-decoration: line-through; }
                .note-theory h1 { font-size: 1rem; font-weight: 700; color: #1e1b4b; margin: 4px 0; }
                .note-theory h2 { font-size: 0.92rem; font-weight: 700; color: #1e1b4b; margin: 4px 0; }
                .note-theory h3 { font-size: 0.86rem; font-weight: 700; color: #1e1b4b; margin: 4px 0; }
                .note-theory ul, .note-theory ol { padding-left: 18px; margin: 2px 0; }
                .note-theory li { margin-bottom: 2px; }
                .note-theory blockquote {
                    border-left: 3px solid #a78bfa; margin: 4px 0;
                    padding: 2px 10px; color: #7c3aed; font-style: italic;
                }
                .note-theory pre {
                    background: #f5f3ff; border-radius: 6px;
                    padding: 8px 10px; font-size: 0.78rem;
                    color: #4c1d95; overflow-x: auto; margin: 4px 0;
                }
                .note-theory a { color: #7c3aed; text-decoration: underline; }
                .note-theory-preview {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>

            <form onSubmit={searchHandler} style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                <input type='text' placeholder='Search notes...' onChange={e => setSearchInput(e.target.value)} value={searchInput}
                    style={{ ...inp, flex: 1 }}
                    onFocus={e => { e.target.style.borderColor = '#86efac'; e.target.style.background = '#f0fdf4' }}
                    onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.background = '#faf9ff' }} />
                <button type='submit' style={{ padding: '12px 20px', background: '#f0fdf4', color: '#059669', border: '1.5px solid #86efac', borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap' }}>
                    Search
                </button>
            </form>

            {filteredNotes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '64px 0' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🌸</div>
                    <p style={{ fontSize: '0.9rem', color: '#a78bfa', fontWeight: '600', marginBottom: '16px' }}>
                        {search ? `No notes found for "${search}"` : 'No notes yet!'}
                    </p>
                    {!search && (
                        <button onClick={() => navigate('/addnotes')} style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#a78bfa,#34d399)', color: 'white', border: 'none', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                            + Add your first note
                        </button>
                    )}
                </div>
            )}

            {filteredNotes.map((Note, i) => (
                <div key={Note._id}
                    style={{ background: 'white', borderRadius: '18px', border: '1.5px solid #f3f4f6', padding: '18px 22px', marginBottom: '10px', display: 'flex', alignItems: 'flex-start', gap: '16px', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ddd6fe'; e.currentTarget.style.transform = 'translateX(4px)' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#f3f4f6'; e.currentTarget.style.transform = 'translateX(0)' }}>
                    <div style={{ width: '4px', borderRadius: '4px', alignSelf: 'stretch', flexShrink: 0, background: ACCENTS[i % ACCENTS.length], minHeight: '40px' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h2 style={{ margin: '0 0 5px 0', color: '#1e1b4b', fontSize: '0.95rem', fontWeight: '700' }}>{Note.topic}</h2>
                        {/* Render rich HTML from Quill, with 3-line clamp preview */}
                        <div
                            className='note-theory note-theory-preview'
                            dangerouslySetInnerHTML={{ __html: Note.theory }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                        <button onClick={() => { dispatch(editNotes(Note._id)); navigate('/addnotes') }}
                            style={{ padding: '5px 13px', background: '#f5f3ff', color: '#7c3aed', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', fontFamily: 'inherit' }}>
                            Edit
                        </button>
                        <button onClick={() => dispatch(deleteNote(Note._id))}
                            style={{ padding: '5px 13px', background: '#fff1f2', color: '#f43f5e', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: '700', fontFamily: 'inherit' }}>
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Notes