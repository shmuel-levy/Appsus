import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'

const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        setIsLoading(true)
        noteService.query()
            .then(notesFromService => {
                setNotes(notesFromService)
            })
            .catch(err => {
                console.error('Error loading notes:', err)
                setNotes(null)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    function onAddNote(newNote) {
        setNotes(prevNotes => [newNote, ...prevNotes])
    }

    function renderNoteContent(note) {
        switch (note.type) {
            case 'NoteTxt':
                return <p>{note.info.txt}</p>

            case 'NoteImg':
                return (
                    <div>
                        <h3>{note.info.title}</h3>
                        <img
                            src={note.info.url}
                            alt={note.info.title}
                            onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found'
                            }}
                        />
                    </div>
                )

            case 'NoteTodos':
                return (
                    <div>
                        <h3>{note.info.title}</h3>
                        <ul>
                            {note.info.todos.map((todo, idx) => (
                                <li key={idx}>{todo.txt}</li>
                            ))}
                        </ul>
                    </div>
                )

            default:
                return <p>Unsupported note type</p>
        }
    }

    function getNotesForDisplay() {
        if (isLoading) return <div className="loading">Loading...</div>
        if (!notes) return <div className="error">Error loading notes</div>
        if (notes.length === 0) return <div>No notes yet</div>

        return (
            <div className="notes-list">
                {notes.map(note => (
                    <div key={note.id} className={`note-preview ${note.type.toLowerCase()}`}>
                        {renderNoteContent(note)}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <section className="note-index">
            <h1>Notes</h1>
            <NoteAdd onAddNote={onAddNote} />
            {getNotesForDisplay()}
        </section>
    )
}