import { NotePreview } from './NotePreview.jsx'


export function NoteList({notes, onRemoveNote, onPinNote}) {
    if (!notes.length) return <div>No notes to display</div>
    return (
        <div className = 'notes-list'>
            {notes.map(note=>(
                <NotePreview
                key={note.id}
                note = {note}
                onRemoveNote = {onRemoveNote}
                onPinNote = {onPinNote} 
                />
            ))}
        </div>
    )
}
