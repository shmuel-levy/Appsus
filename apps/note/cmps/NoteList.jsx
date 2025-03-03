import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onPinNote, inTrash = false }) {
    if (!notes.length) return (
        <div className="no-notes">
            {inTrash ? 'אין פתקים באשפה' : 'אין פתקים להצגה'}
        </div>
    )
    
    // Sort notes - pinned notes first, then by creation date (newest first)
    const sortedNotes = [...notes].sort((a, b) => {
        // When in trash, don't sort by pinned status
        if (inTrash) return b.createdAt - a.createdAt
        
        // Normal sort order with pinned notes first
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return b.createdAt - a.createdAt
    })
    
    return (
        <div className="notes-list">
            {sortedNotes.map(note => (
                <div key={note.id} className="note-item">
                    <a href={`#/note/${note.id}`} className="note-link">
                        <NotePreview
                            note={note}
                            onRemoveNote={onRemoveNote}
                            onPinNote={onPinNote}
                            inTrash={inTrash}
                        />
                    </a>
                </div>
            ))}
        </div>
    )
}