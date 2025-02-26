import { NotePreview } from './NotePreview.jsx'

export function NoteList({ notes, onRemoveNote, onPinNote }) {
    if (!notes.length) return <div className="no-notes">No notes to display</div>
    const sortedNotes = [...notes].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        return b.createdAt - a.createdAt
    })
    
    return (
        <div className="notes-list">
            {sortedNotes.map(note => (
                <NotePreview
                    key={note.id}
                    note={note}
                    onRemoveNote={onRemoveNote}
                    onPinNote={onPinNote}
                />
            ))}
        </div>
    )
}