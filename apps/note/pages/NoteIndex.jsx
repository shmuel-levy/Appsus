const noteService = window.noteService
import { NoteList } from '../cmps/NoteList.jsx' 
const { useState, useEffect } = React

export function NoteIndex() {
    const [notes, setNotes] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    console.log('noteService:', noteService)

    useEffect(() => {
        loadNotes()
    }, [])

    function loadNotes() {
        if (!noteService) {
            console.error('noteService is not defined')
            return
        }
        setIsLoading(true)
        noteService.query()
            .then(notesFromService => {
                setNotes(notesFromService)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Error loading notes:', err)
                setIsLoading(false)
                setNotes(null)
            })
    }

  function getNotesForDisplay() {
    if (isLoading) return <div>Loading...</div>
    if (notes === null) return <div>Error loading notes</div>
    if (notes.length === 0) return <div>No notes yet</div>

    return notes.map(note => (
        <div key={note.id}>
            {note.type === 'NoteTxt' && <p>{note.info.txt}</p>}
            {note.type === 'NoteImg' && (
                <div>
                    <h3>{note.info.title}</h3>
                    <img src={note.info.url} alt={note.info.title} />
                </div>
            )}
            {note.type === 'NoteTodos' && (
                <div>
                    <h3>{note.info.title}</h3>
                    <ul>
                        {note.info.todos.map((todo, idx) => (
                            <li key={idx}>{todo.txt}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    ))
}

  return (
    <section className="note-index">
      <h1>Notes</h1>
      {getNotesForDisplay()}
    </section>
  )
}
