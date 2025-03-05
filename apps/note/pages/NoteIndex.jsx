const { useState, useEffect } = React
const { useOutletContext } = ReactRouterDOM

import { noteService } from '../services/note.service.js'
import { NoteList } from '../cmps/NoteList.jsx'
import { NoteAdd } from '../cmps/NoteAdd.jsx'
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
    const [globalFilterBy, onSetFilter] = useOutletContext() || [{}, () => {}]
    
    useEffect(() => {
        setFilterBy(prev => ({ 
            ...prev, 
            txt: globalFilterBy.txt || prev.txt,
            type: globalFilterBy.type || prev.type,
            inTrash: isTrash,
            isArchived: isArchive 
        }))
    }, [globalFilterBy, isTrash, isArchive])
    
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
    
    if (isLoading && notes.length === 0) return <div className="loading">Loading...</div>
    
    return (
        <section className="note-index">
            {/* Note: We're hiding the filter in CSS since it's now in the header */}
            <div className="note-filter-container">
                {/* This will be hidden by CSS */}
            </div>
            
            {!filterBy.inTrash && !filterBy.isArchived && (
                <div className="note-add-container">
                    <NoteAdd onAddNote={onAddNote} />
                </div>
            )}
            
            <div className="notes-container">
                {filterBy.inTrash && <h2 className="page-title">Trash</h2>}
                {filterBy.isArchived && <h2 className="page-title">Archive</h2>}
                
                {!filterBy.inTrash && !filterBy.isArchived && notes.some(note => note.isPinned) && (
                    <div className="pinned-notes-section">
                        <h2 className="section-title">Pinned</h2>
                        <NoteList
                            notes={notes.filter(note => note.isPinned)}
                            onRemoveNote={onRemoveNote}
                            onPinNote={onPinNote}
                            onArchiveNote={onArchiveNote}
                            inTrash={filterBy.inTrash}
                            inArchive={filterBy.isArchived}
                        />
                    </div>
                )}
                
                {!filterBy.inTrash && !filterBy.isArchived && notes.some(note => note.isPinned) && notes.some(note => !note.isPinned) && (
                    <div className="other-notes-section">
                        <h2 className="section-title">Other</h2>
                        <NoteList
                            notes={notes.filter(note => !note.isPinned)}
                            onRemoveNote={onRemoveNote}
                            onPinNote={onPinNote}
                            onArchiveNote={onArchiveNote}
                            inTrash={filterBy.inTrash}
                            inArchive={filterBy.isArchived}
                        />
                    </div>
                )}
                
                {(filterBy.inTrash || filterBy.isArchived || !notes.some(note => note.isPinned) || !notes.some(note => !note.isPinned)) && (
                    <NoteList
                        notes={notes}
                        onRemoveNote={onRemoveNote}
                        onPinNote={onPinNote}
                        onArchiveNote={onArchiveNote}
                        inTrash={filterBy.inTrash}
                        inArchive={filterBy.isArchived}
                    />
                )}
            </div>
        </section>
    )
}