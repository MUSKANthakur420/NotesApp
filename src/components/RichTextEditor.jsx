import React, { useRef, useCallback } from 'react'

const TOOLBAR_GROUPS = [
    [
        { cmd: 'bold',          icon: 'B',   title: 'Bold',          style: { fontWeight: '800' } },
        { cmd: 'italic',        icon: 'I',   title: 'Italic',        style: { fontStyle: 'italic' } },
        { cmd: 'underline',     icon: 'U',   title: 'Underline',     style: { textDecoration: 'underline' } },
        { cmd: 'strikeThrough', icon: 'S',   title: 'Strikethrough', style: { textDecoration: 'line-through' } },
    ],
    [
        { cmd: 'insertOrderedList',   icon: '1≡', title: 'Numbered list' },
        { cmd: 'insertUnorderedList', icon: '•≡', title: 'Bullet list' },
    ],
    [
        { cmd: 'justifyLeft',   icon: '⬛', title: 'Align left' },
        { cmd: 'justifyCenter', icon: '⬛', title: 'Align center' },
        { cmd: 'justifyRight',  icon: '⬛', title: 'Align right' },
    ],
    [
        { cmd: 'undo', icon: '↩', title: 'Undo' },
        { cmd: 'redo', icon: '↪', title: 'Redo' },
    ],
]

const HEADING_OPTIONS = [
    { label: 'Normal',    tag: 'p' },
    { label: 'Heading 1', tag: 'h1' },
    { label: 'Heading 2', tag: 'h2' },
    { label: 'Heading 3', tag: 'h3' },
]

const FONT_SIZES = ['12px', '14px', '16px', '18px', '20px', '24px', '28px', '32px']

const HIGHLIGHT_COLORS = [
    { color: '#fde68a', title: 'Yellow' },
    { color: '#bbf7d0', title: 'Green' },
    { color: '#bfdbfe', title: 'Blue' },
    { color: '#fecaca', title: 'Red' },
    { color: '#e9d5ff', title: 'Purple' },
    { color: 'transparent', title: 'None' },
]

const TEXT_COLORS = [
    { color: '#1e1b4b', title: 'Dark' },
    { color: '#7c3aed', title: 'Purple' },
    { color: '#059669', title: 'Green' },
    { color: '#dc2626', title: 'Red' },
    { color: '#2563eb', title: 'Blue' },
    { color: '#d97706', title: 'Amber' },
]

function ToolbarBtn({ title, children, onClick, active }) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={e => { e.preventDefault(); onClick() }}
            style={{
                padding: '4px 9px',
                borderRadius: '7px',
                border: active ? '1.5px solid #a78bfa' : '1.5px solid transparent',
                background: active ? '#f5f3ff' : 'transparent',
                color: active ? '#7c3aed' : '#4b5563',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: '700',
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                lineHeight: 1,
                transition: 'all 0.15s',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.background = '#f5f3ff'; e.currentTarget.style.color = '#7c3aed' } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4b5563' } }}
        >
            {children}
        </button>
    )
}

function RichTextEditor({ value, onChange, placeholder = 'Write your theory here...' }) {
    const editorRef = useRef(null)

    const exec = useCallback((cmd, val = null) => {
        editorRef.current?.focus()
        document.execCommand(cmd, false, val)
        handleChange()
    }, [])

    const handleChange = useCallback(() => {
        if (editorRef.current && onChange) {
            onChange(editorRef.current.innerHTML)
        }
    }, [onChange])

    const insertLink = () => {
        const url = window.prompt('Enter URL:', 'https://')
        if (url) exec('createLink', url)
    }

    const isActive = (cmd) => {
        try { return document.queryCommandState(cmd) } catch { return false }
    }

    return (
        <div style={{
            border: '1.5px solid #ede9fe',
            borderRadius: '14px',
            background: '#faf9ff',
            overflow: 'hidden',
            transition: 'border-color 0.2s',
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        }}
            onFocus={e => e.currentTarget.style.borderColor = '#a78bfa'}
            onBlur={e => e.currentTarget.style.borderColor = '#ede9fe'}
        >
            {/* ── Toolbar ── */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '2px',
                padding: '8px 10px',
                borderBottom: '1.5px solid #ede9fe',
                background: 'white',
            }}>

                {/* Heading select */}
                <select
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => exec('formatBlock', e.target.value)}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '7px',
                        border: '1.5px solid #ede9fe',
                        background: '#faf9ff',
                        color: '#4b5563',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        height: '28px',
                        marginRight: '4px',
                    }}
                >
                    {HEADING_OPTIONS.map(h => (
                        <option key={h.tag} value={h.tag}>{h.label}</option>
                    ))}
                </select>

                {/* Font size */}
                <select
                    onMouseDown={e => e.stopPropagation()}
                    onChange={e => {
                        editorRef.current?.focus()
                        const sel = window.getSelection()
                        if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
                            document.execCommand('fontSize', false, '7')
                            editorRef.current.querySelectorAll('font[size="7"]').forEach(el => {
                                el.removeAttribute('size')
                                el.style.fontSize = e.target.value
                            })
                        }
                        handleChange()
                    }}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '7px',
                        border: '1.5px solid #ede9fe',
                        background: '#faf9ff',
                        color: '#4b5563',
                        fontSize: '0.78rem',
                        fontWeight: '600',
                        fontFamily: 'inherit',
                        cursor: 'pointer',
                        height: '28px',
                        marginRight: '4px',
                    }}
                >
                    <option value="">Size</option>
                    {FONT_SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>

                {/* Divider */}
                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Format buttons */}
                {TOOLBAR_GROUPS[0].map(btn => (
                    <ToolbarBtn key={btn.cmd} title={btn.title} onClick={() => exec(btn.cmd)} active={isActive(btn.cmd)}>
                        <span style={btn.style}>{btn.icon}</span>
                    </ToolbarBtn>
                ))}

                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Lists */}
                {TOOLBAR_GROUPS[1].map(btn => (
                    <ToolbarBtn key={btn.cmd} title={btn.title} onClick={() => exec(btn.cmd)} active={isActive(btn.cmd)}>
                        {btn.icon}
                    </ToolbarBtn>
                ))}

                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Align */}
                <ToolbarBtn title="Align left"   onClick={() => exec('justifyLeft')}   active={isActive('justifyLeft')}>  ≡←</ToolbarBtn>
                <ToolbarBtn title="Align center" onClick={() => exec('justifyCenter')} active={isActive('justifyCenter')}>≡↔</ToolbarBtn>
                <ToolbarBtn title="Align right"  onClick={() => exec('justifyRight')}  active={isActive('justifyRight')}> ≡→</ToolbarBtn>

                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Text color */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600' }}>A</span>
                    {TEXT_COLORS.map(tc => (
                        <button
                            key={tc.color}
                            type="button"
                            title={tc.title}
                            onMouseDown={e => { e.preventDefault(); exec('foreColor', tc.color) }}
                            style={{
                                width: '16px', height: '16px', borderRadius: '50%',
                                background: tc.color, border: '1.5px solid #e5e7eb',
                                cursor: 'pointer', padding: 0, flexShrink: 0,
                            }}
                        />
                    ))}
                </div>

                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Highlight */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '600' }}>H</span>
                    {HIGHLIGHT_COLORS.map(hc => (
                        <button
                            key={hc.color}
                            type="button"
                            title={hc.title}
                            onMouseDown={e => {
                                e.preventDefault()
                                if (hc.color === 'transparent') exec('hiliteColor', 'transparent')
                                else exec('hiliteColor', hc.color)
                            }}
                            style={{
                                width: '16px', height: '16px', borderRadius: '4px',
                                background: hc.color === 'transparent' ? 'white' : hc.color,
                                border: hc.color === 'transparent' ? '1.5px dashed #d1d5db' : '1.5px solid #e5e7eb',
                                cursor: 'pointer', padding: 0, flexShrink: 0,
                            }}
                        />
                    ))}
                </div>

                <div style={{ width: '1px', height: '20px', background: '#ede9fe', margin: '0 4px' }} />

                {/* Link */}
                <ToolbarBtn title="Insert link" onClick={insertLink}>🔗</ToolbarBtn>

                {/* Undo / Redo */}
                <ToolbarBtn title="Undo" onClick={() => exec('undo')}>↩</ToolbarBtn>
                <ToolbarBtn title="Redo" onClick={() => exec('redo')}>↪</ToolbarBtn>

                {/* Clear formatting */}
                <ToolbarBtn title="Clear formatting" onClick={() => exec('removeFormat')}>✕</ToolbarBtn>
            </div>

            {/* ── Editable area ── */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleChange}
                onKeyUp={handleChange}
                dangerouslySetInnerHTML={value ? undefined : undefined}
                data-placeholder={placeholder}
                style={{
                    minHeight: '220px',
                    padding: '16px 18px',
                    outline: 'none',
                    fontSize: '0.9rem',
                    color: '#1e1b4b',
                    lineHeight: '1.75',
                    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                    background: '#faf9ff',
                    overflowY: 'auto',
                    maxHeight: '400px',
                }}
                // inject CSS for placeholder via a style tag below
            />

            {/* Placeholder + editor styles */}
            <style>{`
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #c4b5fd;
                    pointer-events: none;
                    font-style: italic;
                }
                [contenteditable] h1 { font-size: 1.5rem; font-weight: 800; margin: 8px 0 4px; color: #1e1b4b; }
                [contenteditable] h2 { font-size: 1.2rem; font-weight: 700; margin: 8px 0 4px; color: #1e1b4b; }
                [contenteditable] h3 { font-size: 1rem;   font-weight: 700; margin: 6px 0 3px; color: #1e1b4b; }
                [contenteditable] p  { margin: 4px 0; }
                [contenteditable] ul { padding-left: 1.4rem; margin: 4px 0; }
                [contenteditable] ol { padding-left: 1.4rem; margin: 4px 0; }
                [contenteditable] a  { color: #7c3aed; text-decoration: underline; }
            `}</style>
        </div>
    )
}

export default RichTextEditor
