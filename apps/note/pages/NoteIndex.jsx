import { noteService } from '../services/note.service.js' 
import { NoteList } from '../cmps/NoteList.jsx' 
import { NoteAdd } from '../cmps/NoteAdd.jsx'  

const { useState, useEffect } = React  

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
            })     
    }          
    
    function onPinNote(noteId) {
        // First, get the current note from state
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
                console.log('Note saved successfully with pinned state:', savedNote)
                
                setNotes(prevNotes => 
                    prevNotes.map(n => 
                        n.id === savedNote.id ? savedNote : n
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
    
    if (isLoading) return <div className="loading">Loading...</div>
    
    return (         
        <section className="note-index">             
            <h1>Notes</h1>             
            <NoteAdd onAddNote={onAddNote} />             
            <NoteList 
                notes={notes} 
                onRemoveNote={onRemoveNote}
                onPinNote={onPinNote}
            />         
        </section>     
    ) 
}