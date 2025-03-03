const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect } = React

import { noteService } from '../services/note.service.js'

export function NoteEdit() {
    const { noteId } = useParams()
    const [note, setNote] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    
    useEffect(() => {
        console.log('Loading note with ID:', noteId)
        loadNote()
    }, [])
    
    function loadNote() {
        setIsLoading(true)
        noteService.get(noteId)
            .then(noteData => {
                console.log('Note loaded:', noteData)
                setNote(noteData)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Error loading note:', err)
                setIsLoading(false)
            })
    }
    
    function handleChange(ev) {
        const { name, value } = ev.target
        
        setNote(prevNote => {
            if (name === 'txt') {
                return {
                    ...prevNote,
                    info: { ...prevNote.info, txt: value }
                }
            } else if (name === 'title') {
                return {
                    ...prevNote,
                    info: { ...prevNote.info, title: value }
                }
            } else if (name === 'url') {
                return {
                    ...prevNote,
                    info: { ...prevNote.info, url: value }
                }
            }
            return prevNote
        })
    }
    
    function handleBackClick() {
        navigate('/note')
    }
    
    function handleSubmit(ev) {
        ev.preventDefault()
        console.log('Saving note:', note)
        
        noteService.save(note)
            .then(savedNote => {
                console.log('Note saved successfully:', savedNote)
                navigate('/note')
            })
            .catch(err => {
                console.error('Error saving note:', err)
            })
    }
    
    if (isLoading) return <div className="loading">Loading...</div>
    if (!note) return <div className="not-found">Note not found <button onClick={handleBackClick}>Back to Notes</button></div>
    
    return (
        <div className="note-edit">
            <div className="note-edit-container">
                <h2>Editing Note: {note.id}</h2>
                
                <form onSubmit={handleSubmit}>
                    {note.type === 'NoteTxt' && (
                        <div>
                            <div>
                                <label>Title:</label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={note.info.title || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>Text:</label>
                                <textarea 
                                    name="txt" 
                                    value={note.info.txt || ''}
                                    onChange={handleChange}
                                    rows={4}
                                />
                            </div>
                        </div>
                    )}
                    
                    {note.type === 'NoteImg' && (
                        <div>
                            <div>
                                <label>Title:</label>
                                <input 
                                    type="text"
                                    name="title"
                                    value={note.info.title || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label>URL:</label>
                                <input 
                                    type="url"
                                    name="url"
                                    value={note.info.url || ''}
                                    onChange={handleChange}
                                />
                            </div>
                            {note.info.url && (
                                <img 
                                    src={note.info.url} 
                                    alt={note.info.title || 'Note image'} 
                                    style={{maxWidth: '200px'}}
                                />
                            )}
                        </div>
                    )}
                    
                    <div className="form-actions">
                        <button type="button" onClick={handleBackClick}>Cancel</button>
                        <button type="submit">Save</button>
                    </div>
                </form>
            </div>
        </div>
    )
}