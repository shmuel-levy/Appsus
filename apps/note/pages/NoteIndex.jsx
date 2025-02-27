const { useState, useEffect } = React

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { showSuccessMsg, showErrorMsg } from '../../services/event-bus.service.js'


export function NoteIndex() {
    const [notes, setNotes] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [filterBy, setFilterBy] = useState({ txt: '', type: '' })
    
    useEffect(() => {
        loadNotes()
    }, [filterBy])
    
    function loadNotes() {
        setIsLoading(true)
        noteService.query(filterBy)
            .then(notesFromService => {
                setNotes(notesFromService)
            })
            .catch(err => {
                showErrorMsg('Failed to load notes')
                setNotes([])
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    
    function onAddNote(newNote) {
        setNotes(prevNotes => [newNote, ...prevNotes])
        showSuccessMsg('Note added successfully')
    }
    
    function onRemoveNote(noteId) {
        noteService.remove(noteId)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                showSuccessMsg('Note removed successfully')
            })
            .catch(err => {
                showErrorMsg('Failed to remove note')
            })
    }
    
    function onPinNote(noteId) {
        const note = notes.find(note => note.id === noteId)
        if (!note) return
        
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
                showSuccessMsg(`Note ${actionText} successfully`)
            })
            .catch(err => {
                console.error('Error updating note:', err)
                showErrorMsg('Failed to update note')
            })
    }
    
    function onSetFilter(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }
    
    if (isLoading) return <div className="loading">Loading notes...</div>
    
    return (
        <section className="note-index">
            <NoteAdd onAddNote={onAddNote} />
            
            <NoteList 
                notes={notes} 
                onRemoveNote={onRemoveNote}
                onPinNote={onPinNote}
            />
        </section>
    )
}