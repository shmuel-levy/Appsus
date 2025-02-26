export function NotePreview({ note, onRemoveNote, onPinNote }) {
    const { id, type, info, isPinned, style = {} } = note
    const { backgroundColor = '#ffffff' } = style

    function handleRemove(ev) {
        ev.stopPropagation()
        onRemoveNote(id)
    }

    function handlePin(ev) {
        ev.stopPropagation()
        onPinNote(id)
    }

    function renderNoteContent() {
        switch (type) {
            case 'NoteTxt':
                return <p>{info.txt}</p>

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

            default:
                return <p>Unsupported note type</p>
        }
    }

    return (
        <div 
            className={`note-preview ${type.toLowerCase()}`} 
            style={{ backgroundColor }}
        >
            <div className="note-content">
                {renderNoteContent()}
            </div>
            
            <div className="note-actions">
                <button 
                    className={`pin-btn ${isPinned ? 'pinned' : ''}`}
                    onClick={handlePin}
                    title={isPinned ? 'Unpin' : 'Pin note'}
                >
                    📌
                </button>
                
                <button 
                    className="remove-btn"
                    onClick={handleRemove}
                    title="Delete note"
                >
                    🗑️
                </button>
            </div>
        </div>
    )
}