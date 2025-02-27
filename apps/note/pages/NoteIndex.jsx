const { useState, useEffect } = React

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'

export function NoteIndex() {
    const [notes, setNotes] = useState([])
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
            })
            .catch(err => {
                console.error('Error loading notes:', err)
                setNotes([])
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    
    function onAddNote(newNote) {
        setNotes(prevNotes => [newNote, ...prevNotes])
    }
    
    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                console.log('Note removed successfully')
            })
            .catch(err => {
                console.error('Error removing note:', err)
            })
    }
    
    function onPinNote(noteId) {
        const note = notes.find(note => note.id === noteId)
        if (!note) {
            console.error('Note not found:', noteId)
            return
        }
                const updatedNote = {
            ...note,
            isPinned: !note.isPinned
        }
                noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prevNotes => 
                    prevNotes.map(note => 
                        note.id === savedNote.id ? savedNote : note
                    )
                )
                
                const actionText = savedNote.isPinned ? 'pinned' : 'unpinned'
                console.log(`Note ${actionText} successfully`)
            })
            .catch(err => {
                console.error('Error updating note:', err)
            })
    }
    
    if (isLoading) return <div className="loading">Loading...</div>
    
    return (
        <section className="note-index">
            <div className="note-add-container">
                <NoteAdd onAddNote={onAddNote} />
            </div>
            <div className="notes-container">
                <NoteList 
                    notes={notes} 
                    onRemoveNote={onRemoveNote}
                    onPinNote={onPinNote}
                />
            </div>
        </section>
    )
}