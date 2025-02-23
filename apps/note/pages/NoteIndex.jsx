import { useState, useEffect } from "react"
import { noteService } from "../services/note.service"
import { NoteList } from "../cmps/NoteList"
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
                console.log('Notes loaded:', notesFromService)
                setNotes(notesFromService)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Error loading notes:', err)
                setIsLoading(false)
                setNotes(null)
            })
    }

      
  return (
    <section className="note-index">
      <h1>Notes</h1>
    </section>
  )
}
