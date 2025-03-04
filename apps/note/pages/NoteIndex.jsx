const { useOutletContext } = ReactRouterDOM
const { useState, useEffect } = React

import { NoteList } from "../cmps/NoteList.jsx"
import { NoteAdd } from "../cmps/NoteAdd.jsx"
import { NoteFilter } from "../cmps/NoteFilter.jsx"
import { noteService } from '../services/note.service.js'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

export function NoteIndex({ isTrash = false }) {
    const [notes, setNotes] = useState([])
    const [filterBy, setFilterBy] = useState({ txt: '', type: '', inTrash: isTrash })
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        setFilterBy(prev => ({ ...prev, inTrash: isTrash }))
    }, [isTrash])
    
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
        showSuccessMsg("Note added successfully")
    }
    
    function onRemoveNote(noteId) {
        if (filterBy.inTrash) {
            noteService.remove(noteId)
                .then(() => {
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                    showSuccessMsg('Note permanently deleted')
                })
                .catch(err => {
                    console.error('Error removing note:', err)
                    showErrorMsg('Failed to delete note')
                })
        } else {
            noteService.moveToTrash(noteId)
                .then(() => {
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                    showSuccessMsg('Note moved to trash')
                })
                .catch(err => {
                    console.error('Error moving note to trash:', err)
                    showErrorMsg('Failed to move note to trash')
                })
        }
    }
    
    function onPinNote(noteId) {
        const note = notes.find(note => note.id === noteId)
        if (!note) {
            console.error('Note not found:', noteId)
            return
        }
        
        if (filterBy.inTrash) {
            noteService.restoreFromTrash(noteId)
                .then(() => {
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                    showSuccessMsg('Note restored from trash')
                })
                .catch(err => {
                    console.error('Error restoring note:', err)
                    showErrorMsg('Failed to restore note')
                })
            
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
                showSuccessMsg(`Note ${actionText} successfully`)
            })
            .catch(err => {
                console.error('Error updating note:', err)
                showErrorMsg('Failed to update note')
            })
    }
    
    function onChangeColor(noteId, color, setColorPickerNoteId) {
        const note = notes.find(note => note.id === noteId)
        if (!note) return
        
        const updatedNote = {
            ...note,
            style: {
                ...note.style,
                backgroundColor: color
            }
        }
        
        noteService.save(updatedNote)
            .then(savedNote => {
                setNotes(prevNotes => 
                    prevNotes.map(note => 
                        note.id === savedNote.id ? savedNote : note
                    )
                )
                if (setColorPickerNoteId) setColorPickerNoteId(null)
            })
            .catch(err => {
                console.error('Error changing note color:', err)
                showErrorMsg('Failed to change note color')
            })
    }
    
    function onDuplicateNote(note) {
        const newNote = { ...note, id: '' }
        
        noteService.save(newNote)
            .then(savedNote => {
                setNotes(prevNotes => [savedNote, ...prevNotes])
                showSuccessMsg('Note duplicated successfully')
            })
            .catch(err => {
                console.error('Error duplicating note:', err)
                showErrorMsg('Failed to duplicate note')
            })
    }
    
    function onChangeNote(updatedNote) {
        setNotes(prevNotes => 
            prevNotes.map(note => 
                note.id === updatedNote.id ? updatedNote : note
            )
        )
        showSuccessMsg('Note updated successfully')
    }
    
    if (isLoading && notes.length === 0) return <div className="loading">Loading...</div>
    
    return (
        <section className="note-index">
            <div className="note-filter-container">
                <NoteFilter onSetFilter={onSetFilter} />
            </div>
            
            {!filterBy.inTrash && (
                <div className="note-add-container">
                    <NoteAdd onAddNote={onAddNote} />
                </div>
            )}
            
            <div className="notes-container">
                {filterBy.inTrash && <h2 className="page-title">אשפה</h2>}
                <NoteList
                    notes={notes}
                    onRemoveNote={onRemoveNote}
                    onPinNote={onPinNote}
                    onChangeColor={onChangeColor}
                    onDuplicateNote={onDuplicateNote}
                    onChangeNote={onChangeNote}
                    inTrash={filterBy.inTrash}
                />
            </div>
        </section>
    )
}