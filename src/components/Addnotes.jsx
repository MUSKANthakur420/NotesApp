import React, { useState, useEffect, useRef } from 'react'
import { createNote, updateNote, editNotes } from '../features/Notes/NotesSlice'
import { useDispatch, useSelector } from 'react-redux'

// Load Quill dynamically (CDN)
function useQuill(containerRef, onChangeRef) {
    const quillRef = useRef(null)

    useEffect(() => {
        if (!document.getElementById('quill-css')) {
            const link = document.createElement('link')
            link.id = 'quill-css'
            link.rel = 'stylesheet'
            link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css'
            document.head.appendChild(link)
        }

        const initQuill = () => {
            if (quillRef.current || !containerRef.current) return
            const Quill = window.Quill
            if (!Quill) return

            quillRef.current = new Quill(containerRef.current, {
                theme: 'snow',
                placeholder: 'Write something about the topic...',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }, { background: [] }],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['blockquote', 'code-block'],
                        ['link'],
                        ['clean'],
                    ],
                },
            })

            quillRef.current.on('text-change', () => {
                const html = quillRef.current.root.innerHTML
                onChangeRef.current(html === '<p><br></p>' ? '' : html)
            })
        }

        if (window.Quill) {
            initQuill()
        } else if (!document.getElementById('quill-js')) {
            const script = document.createElement('script')
            script.id = 'quill-js'
            script.src = 'https://cdn.quilljs.com/1.3.7/quill.min.js'
            script.onload = initQuill
            document.head.appendChild(script)
        } else {
            const interval = setInterval(() => {
                if (window.Quill) { clearInterval(interval); initQuill() }
            }, 50)
            return () => clearInterval(interval)
        }
    }, [])

    return quillRef
}

function Addnotes() {
    const dispatch = useDispatch()
    const edit = useSelector(state => state.Notes.edit)
    const Notes = useSelector(state => state.Notes.Notes)
    const loading = useSelector(state => state.Notes.loading)
    const [topic, setTopic] = useState('')
    const [theory, setTheory] = useState('')
    const [aiLoading, setAiLoading] = useState(false)
    const [aiError, setAiError] = useState('')

    const editorContainerRef = useRef(null)
    const onChangeRef = useRef(setTheory)
    onChangeRef.current = setTheory

    const quillRef = useQuill(editorContainerRef, onChangeRef)

    useEffect(() => {
        if (edit) {
            const Note = Notes.find(n => n._id === edit)
            if (Note) {
                setTopic(Note.topic)
                setTheory(Note.theory)
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = Note.theory || ''
                }
            }
        } else {
            setTopic('')
            setTheory('')
            if (quillRef.current) quillRef.current.setText('')
        }
    }, [edit])

    // --- AI Generate Handler ---
    const generateWithAI = async () => {
        if (!topic.trim()) {
            setAiError('Enter a topic first')
            setTimeout(() => setAiError(''), 2500)
            return
        }

        setAiLoading(true)
        setAiError('')

        // Clear editor before streaming
        if (quillRef.current) quillRef.current.root.innerHTML = ''

        try {
            const res = await fetch('/api/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // sends JWT cookie
                body: JSON.stringify({ topic }),
            })

            if (!res.ok) throw new Error('Failed to generate')

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let accumulated = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                const chunk = decoder.decode(value, { stream: true })
                const lines = chunk.split('\n')

                for (const line of lines) {
                    if (!line.startsWith('data: ')) continue
                    try {
                        const parsed = JSON.parse(line.slice(6))
                        if (parsed.done) break
                        if (parsed.error) throw new Error(parsed.error)
                        if (parsed.text) {
                            accumulated += parsed.text
                            // Stream HTML into Quill in real time
                            if (quillRef.current) {
                                quillRef.current.root.innerHTML = accumulated
                                setTheory(accumulated)
                            }
                        }
                    } catch (_) { }
                }
            }
        } catch (err) {
            setAiError('AI generation failed. Try again.')
        } finally {
            setAiLoading(false)
        }
    }

    const NotesHandler = async (e) => {
        e.preventDefault()
        if (!topic.trim() || !theory.trim()) return
        if (edit) {
            await dispatch(updateNote({ id: edit, topic, theory }))
        } else {
            await dispatch(createNote({ topic, theory }))
        }
        setTopic('')
        setTheory('')
        if (quillRef.current) quillRef.current.setText('')
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
        <>
            <style>{`
                .ql-toolbar.ql-snow {
                    border: none !important;
                    border-bottom: 1.5px solid #ede9fe !important;
                    border-radius: 12px 12px 0 0;
                    background: #f5f3ff;
                    padding: 8px 10px;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                }
                .ql-container.ql-snow {
                    border: none !important;
                    border-radius: 0 0 12px 12px;
                    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
                    font-size: 0.9rem;
                    color: #1e1b4b;
                    min-height: 110px;
                }
                .ql-editor { min-height: 110px; padding: 12px 16px; }
                .ql-editor.ql-blank::before { color: #a09bc0; font-style: normal; }
                .ql-snow .ql-stroke { stroke: #7c3aed; }
                .ql-snow .ql-fill { fill: #7c3aed; }
                .ql-snow .ql-picker { color: #7c3aed; }
                .ql-snow.ql-toolbar button:hover .ql-stroke,
                .ql-snow .ql-toolbar button.ql-active .ql-stroke { stroke: #34d399; }
                .ql-snow.ql-toolbar button:hover .ql-fill,
                .ql-snow .ql-toolbar button.ql-active .ql-fill { fill: #34d399; }

                @keyframes ai-pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                .ai-generating { animation: ai-pulse 1.2s ease-in-out infinite; }
            `}</style>

            <div style={{ background: 'white', borderRadius: '24px', border: '1.5px solid #ede9fe', padding: '26px', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                    <span style={{
                        width: '8px', height: '8px', borderRadius: '50%',
                        background: edit ? 'linear-gradient(135deg,#fda4af,#fb7185)' : 'linear-gradient(135deg,#a78bfa,#34d399)',
                        display: 'inline-block'
                    }} />
                    <p style={{ fontSize: '0.72rem', fontWeight: '700', color: edit ? '#f43f5e' : '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                        {edit ? 'Editing Note' : 'New Note'}
                    </p>
                </div>

                <form onSubmit={NotesHandler}>
                    {/* Topic input + AI button side by side */}
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                            type='text'
                            placeholder='Topic'
                            onChange={e => setTopic(e.target.value)}
                            value={topic}
                            style={{ ...inp, flex: 1, marginBottom: 0 }}
                            onFocus={e => { e.target.style.borderColor = '#a78bfa'; e.target.style.background = '#f5f3ff' }}
                            onBlur={e => { e.target.style.borderColor = '#ede9fe'; e.target.style.background = '#faf9ff' }}
                        />
                        <button
                            type='button'
                            onClick={generateWithAI}
                            disabled={aiLoading}
                            className={aiLoading ? 'ai-generating' : ''}
                            title='Generate note content with AI'
                            style={{
                                padding: '12px 16px',
                                background: 'linear-gradient(135deg,#a78bfa,#34d399)',
                                color: 'white', border: 'none', borderRadius: '12px',
                                fontSize: '0.82rem', fontWeight: '700',
                                cursor: aiLoading ? 'not-allowed' : 'pointer',
                                fontFamily: 'inherit', whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}>
                            {aiLoading ? '✦ Generating...' : '✦ AI Generate'}
                        </button>
                    </div>

                    {/* AI error */}
                    {aiError && (
                        <p style={{ color: '#f43f5e', fontSize: '0.78rem', fontWeight: '600', marginBottom: '10px', marginTop: '-4px' }}>
                            {aiError}
                        </p>
                    )}

                    {/* Rich Text Editor */}
                    <div
                        style={{
                            border: '1.5px solid #ede9fe', borderRadius: '12px',
                            marginBottom: '18px', overflow: 'hidden',
                            background: '#faf9ff', transition: 'border-color 0.2s',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = '#a78bfa' }}
                        onBlur={e => { e.currentTarget.style.borderColor = '#ede9fe' }}
                    >
                        <div ref={editorContainerRef} />
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type='submit' disabled={loading}
                            style={{ flex: 1, padding: '12px', background: 'linear-gradient(135deg,#a78bfa,#34d399)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}>
                            {loading ? 'Saving...' : edit ? '✓ Update Note' : '+ Add Note'}
                        </button>
                        {edit && (
                            <button type='button' onClick={() => dispatch(editNotes(null))}
                                style={{ padding: '12px 20px', background: '#fff1f2', color: '#f43f5e', border: '1.5px solid #fecdd3', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </>
    )
}

export default Addnotes