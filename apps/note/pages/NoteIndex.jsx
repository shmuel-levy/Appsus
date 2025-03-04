const { useState, useEffect } = React

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
import { NoteFilter } from '../cmps/NoteFilter.jsx'
import { showSuccessMsg, showErrorMsg } from '../../../services/event-bus.service.js'

export function NoteIndex({ isTrash = false, isArchive = false }) {
    const [notes, setNotes] = useState([])
    const [filterBy, setFilterBy] = useState({ 
        txt: '', 
        type: '', 
        inTrash: isTrash,
        isArchived: isArchive 
    })
    const [isLoading, setIsLoading] = useState(true)
    
    useEffect(() => {
        setFilterBy(prev => ({ 
            ...prev, 
            inTrash: isTrash,
            isArchived: isArchive 
        }))
    }, [isTrash, isArchive])
    
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
        showSuccessMsg('Note added successfully')
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
        
        if (filterBy.isArchived) {
            noteService.restoreFromArchive(noteId)
                .then(() => {
                    setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                    showSuccessMsg('Note unarchived')
                })
                .catch(err => {
                    console.error('Error unarchiving note:', err)
                    showErrorMsg('Failed to unarchive note')
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
    
    function onArchiveNote(noteId) {
        noteService.moveToArchive(noteId)
            .then(() => {
                setNotes(prevNotes => prevNotes.filter(note => note.id !== noteId))
                showSuccessMsg('Note archived')
            })
            .catch(err => {
                console.error('Error archiving note:', err)
                showErrorMsg('Failed to archive note')
            })
    }
    
    function onChangeNote(updatedNote) {
        setNotes(prevNotes => 
            prevNotes.map(note => 
                note.id === updatedNote.id ? updatedNote : note
            )
        )
    }
    
    function onChangeColor(noteId, color) {
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
                showSuccessMsg('Note color changed')
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
                showSuccessMsg('Note duplicated')
            })
            .catch(err => {
                console.error('Error duplicating note:', err)
                showErrorMsg('Failed to duplicate note')
            })
    }
    
    if (isLoading && notes.length === 0) return <div className="loading">Loading...</div>
    
    return (
        <section className="note-index">
            <div className="note-filter-container">
                <NoteFilter onSetFilter={onSetFilter} />
            </div>
            
            {!filterBy.inTrash && !filterBy.isArchived && (
                <div className="note-add-container">
                    <NoteAdd onAddNote={onAddNote} />
                </div>
            )}
            
            <div className="notes-container">
                {filterBy.inTrash && <h2 className="page-title">Trash</h2>}
                {filterBy.isArchived && <h2 className="page-title">Archive</h2>}
                <NoteList
                    notes={notes}
                    onRemoveNote={onRemoveNote}
                    onPinNote={onPinNote}
                    onArchiveNote={onArchiveNote}
                    onChangeColor={onChangeColor}
                    onDuplicateNote={onDuplicateNote}
                    onChangeNote={onChangeNote}
                    inTrash={filterBy.inTrash}
                    inArchive={filterBy.isArchived}
                />
            </div>
        </section>
    )
}