export function NotePreview({ note, onRemoveNote, onPinNote, onArchiveNote, inTrash = false, inArchive = false }) {
    const { id, type, info, isPinned, style = {} } = note
    const { backgroundColor = '#ffffff' } = style
    
    function handleRemove(ev) {
        ev.preventDefault()  
        ev.stopPropagation() 
        onRemoveNote(id)
    }
    
    function handlePin(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        onPinNote(id)
    }

    function handleRestore(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        onPinNote(id) 
    }
    
    function handleArchive(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        if (onArchiveNote) onArchiveNote(id)
    }
    
    function getYoutubeEmbedUrl(url) {
        if (!url) return ''
        
        let videoId = null
        const standardMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/)
        if (standardMatch && standardMatch[1]) {
            videoId = standardMatch[1]
        }
        
        const embedMatch = url.match(/youtube\.com\/embed\/([^?]+)/)
        if (embedMatch && embedMatch[1]) {
            videoId = embedMatch[1]
        }
        
        if (!videoId) return ''
        
        return `https://www.youtube.com/embed/${videoId}`
    }
    
    function renderNoteContent() {
        switch (type) {
            case 'NoteTxt':
                return (
                    <div>
                        {info.title && <h3>{info.title}</h3>}
                        {info.txt && <p>{info.txt}</p>}
                    </div>
                )
                
            case 'NoteImg':
                return (
                    <div>
                        <h3>{info.title}</h3>
                        <img
                            src={info.url}
                            alt={info.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'
                            }}
                        />
                    </div>
                )
                
            case 'NoteTodos':
                return (
                    <div>
                        <h3>{info.title}</h3>
                        <ul>
                            {info.todos.map((todo, idx) => (
                                <li key={idx} className={todo.doneAt ? 'done' : ''}>
                                    {todo.txt}
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            
            case 'NoteVideo':
                return (
                    <div>
                        <h3>{info.title}</h3>
                        <div className="video-container">
                            <iframe
                                src={getYoutubeEmbedUrl(info.url)}
                                title={info.title || "YouTube video"}
                                frameBorder="0"
                                allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                                allowFullScreen>
                            </iframe>
                        </div>
                    </div>
                )
                
            default:
                return <p>Unsupported note type</p>
        }
    } 
    
    return (
        <div 
            className={`note-preview ${type.toLowerCase()} ${isPinned ? 'pinned' : ''} ${inTrash ? 'in-trash' : ''} ${inArchive ? 'in-archive' : ''}`}
            style={{ backgroundColor }}
        >
            {isPinned && !inTrash && !inArchive && (
                <div className="pin-indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#f1c40f">
                        <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z"/>
                    </svg>
                </div>
            )}
            
            <div className="note-content">
                {renderNoteContent()}
            </div>
          
            <div className="note-actions" style={{ display: 'none' }}>
                {!inTrash && !inArchive ? (
                    <div className="regular-actions">
                        <button 
                            className={`pin-btn ${isPinned ? 'pinned' : ''}`}
                            onClick={handlePin}
                            title={isPinned ? 'Unpin' : 'Pin note'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z"/>
                            </svg>
                        </button>
                        
                        <button 
                            className="archive-btn"
                            onClick={handleArchive}
                            title="Archive"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z"/>
                            </svg>
                        </button>
                        
                        <button 
                            className="remove-btn"
                            onClick={handleRemove}
                            title="Move to trash"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm-2 16H9V8h1v12zm3 0h-1V8h1v12zM7 20H6V6h1v14z"/>
                            </svg>
                        </button>
                    </div>
                ) : inTrash ? (
                    <div className="trash-actions">
                        <button 
                            className="restore-btn"
                            onClick={handleRestore}
                            title="Restore note"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M14 12a2 2 0 1 0-2-2c0 1.1.9 2 2 2zm-2-9a9 9 0 0 0-9 9c0 4.17 2.84 7.67 6.69 8.69v.01l.12.03A9 9 0 0 0 12 21a9 9 0 0 0 9-9c0-4.97-4.03-9-9-9zm0 2c3.86 0 7 3.14 7 7s-3.14 7-7 7-7-3.14-7-7 3.14-7 7-7zm1 7h5v2h-5v4l-5-5 5-5v4z"/>
                            </svg>
                        </button>
                        <button 
                            className="remove-btn delete-forever"
                            onClick={handleRemove}
                            title="Delete forever"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"/>
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div className="archive-actions">
                        <button 
                            className="restore-btn"
                            onClick={handleRestore}
                            title="Unarchive"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z"/>
                            </svg>
                        </button>
                        <button 
                            className="remove-btn"
                            onClick={handleRemove}
                            title="Move to trash"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm-2 16H9V8h1v12zm3 0h-1V8h1v12zM7 20H6V6h1v14z"/>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}