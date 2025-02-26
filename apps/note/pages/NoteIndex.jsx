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
        noteService.get(noteId)             
            .then(note => {                 
                const updatedNote = {...note, isPinned: !note.isPinned}                 
                return noteService.save(updatedNote)             
            })             
            .then(updatedNote => {                 
                setNotes(prevNotes => prevNotes.map(note =>                      
                    note.id === updatedNote.id ? updatedNote : note                 
                ))             
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