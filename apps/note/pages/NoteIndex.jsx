import { noteService } from "../services/note.service.js"
import { NoteList } from "../cmps/NoteList.jsx"
const { useState, useEffect } = React

export function NoteIndex() {
  const [notes, setNotes] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [filterBy, setFilterBy] = useState({ txt: "", type: "" })
  useEffect(() => {
    loadNotes()
  }, [])

  function loadNotes() {
    console.log("loading...")
    setIsLoading(true)
    noteService
      .query(filterBy)
      .then((notes) => {
        console.log('Notes loaded:', notes)
        setNotes(notes)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Failed", err)
        setNotes(null)
        setIsLoading(false)
      })
  }
  function renderNoteContent(note) {
    switch (note.type) {
      case "NoteTxt":
        return <p>{note.info.txt}</p>

      case "NoteImg":
        return (
          <div className="note-img">
            <h3>{note.info.title}</h3>
            <img src={note.info.url} alt={note.info.title} />
          </div>
        )
      case "NoteTodos":
        return (
          <div className="note-todos">
            <h3>{note.info.title}</h3>
            <ul>
              {note.info.todos.map((todo, idx) => (
                <li key={idx} className={todo.doneAt ? "done" : ""}>
                  {todo.txt}
                </li>
              ))}
            </ul>
          </div>
        )
        default:
            return <p> Unsupported note type</p>
    }
  }

  function getNotesForDisplay() {
    if (isLoading) return <div className="loading">Loading...</div>
    if (!notes) return <div className="error">Error loading notes</div>
    if (notes.length === 0) return <div className="empty">No notes yet</div>

    return (
        <div className="notes-grid">
            {notes.map(note => (
                <article 
                    key={note.id} 
                    className={`note ${note.type.toLowerCase()} ${note.isPinned ? 'pinned' : ''}`}
                    style={note.style}
                >
                    {renderNoteContent(note)}
                </article>
            ))}
        </div>
    )
}

  return (
    <section className="note-index">
      <h1>Notes</h1>
      {getNotesForDisplay()}
    </section>
  )
}
