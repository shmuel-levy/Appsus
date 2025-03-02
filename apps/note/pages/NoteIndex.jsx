const { useState, useEffect } = React

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { NoteFilter } from '../cmps/NoteFilter.jsx'

export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [filterBy, setFilterBy] = useState({ txt: '', type: '' })
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        loadNotes()
    }, [filterBy])
    
    function loadNotes() {
        setIsLoading(true)
        noteService.query(filterBy)
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
    
    function onSetFilter(newFilterBy) {
        setFilterBy(prevFilterBy => ({ ...prevFilterBy, ...newFilterBy }))
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
    
    if (isLoading && notes.length === 0) return <div className="loading">Loading...</div>
    
    return (
        <section className="note-index">
            <div className="note-filter-container">
                <NoteFilter onSetFilter={onSetFilter} />
            </div>
            
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