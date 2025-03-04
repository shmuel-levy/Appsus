import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onPinNote, onArchiveNote, inTrash = false, inArchive = false }) {
    if (!notes.length) return (
        <div className="no-notes">
            {inTrash 
                ? 'No notes in trash' 
                : inArchive 
                    ? 'No notes in archive'
                    : 'No notes to display'
            }
        </div>
    )
    
    const sortedNotes = [...notes].sort((a, b) => {
        if (inTrash || inArchive) return b.createdAt - a.createdAt
        
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
                            onArchiveNote={onArchiveNote}
                            inTrash={inTrash}
                            inArchive={inArchive}
                        />
                    </a>
                </div>
            ))}
        </div>
    )
}