const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

import { noteService } from '../services/note.service.js'
import { ColorPicker } from "../cmps/ColorPicker.jsx"

export function NoteEdit({ onRemoveNote, onChangeColor, onDuplicateNote, onChangeNote, onClose }) {
    const { noteId } = useParams()
    const [note, setNote] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [noteType, setNoteType] = useState('NoteTxt')
    const [colorPickerNoteId, setColorPickerNoteId] = useState(null)
    const [newTodoInput, setNewTodoInput] = useState('')
    const navigate = useNavigate()
    const modalRef = useRef(null)
    
    useEffect(() => {
        loadNote()
        document.body.style.overflow = 'hidden'
        
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                handleClose()
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.body.style.overflow = 'auto'
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [noteId])
    
    function loadNote() {
        setIsLoading(true)
        noteService.get(noteId)
            .then(noteData => {
                setNote(noteData)
                setNoteType(noteData.type)
                setIsLoading(false)
            })
            .catch(err => {
                console.error('Error loading note:', err)
                setIsLoading(false)
            })
    }
    
    function handleClose() {
        onClose ? onClose() : navigate('/note')
    }
    
    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setNote(prevNote => {
            const updatedNote = {
                ...prevNote,
                info: {
                    ...prevNote.info,
                    [field]: value
                }
            }
            return updatedNote
        })
    }
    
    function handleSubmit(ev) {
        ev.preventDefault()
        
        noteService.save(note)
            .then(savedNote => {
                if (onChangeNote) onChangeNote(savedNote)
                handleClose()
            })
            .catch(err => {
                console.error('Error saving note:', err)
            })
    }
    
    function handleTodoInputChange(event) {
        setNewTodoInput(event.target.value)
    }

    function handleTodoInputBlur() {
        if (!newTodoInput.trim()) return
        
        var listTodos = newTodoInput.split(',')
        const cleanListTodos = listTodos.filter(Boolean)
        listTodos = cleanListTodos.map(txt => ({ txt: txt.trim(), doneAt: null }))
        
        setNote(prevNote => ({
            ...prevNote,
            info: {
                ...prevNote.info,
                todos: [...(prevNote.info.todos || []), ...listTodos]
            }
        }))
        setNewTodoInput('')
    }

    function handleCheckboxChange(todoIdx) {
        setNote(prevNote => {
            const updatedTodos = prevNote.info.todos.map((todo, idx) => {
                if (idx === todoIdx) {
                    return {
                        ...todo,
                        doneAt: todo.doneAt ? null : Date.now()
                    }
                }
                return todo
            })

            return {
                ...prevNote,
                info: {
                    ...prevNote.info,
                    todos: updatedTodos
                }
            }
        })
    }
    
    function onSendToMail(note) {
        const sendNewNote = note.info.title
        navigate(`/mail/?body=${sendNewNote}`)
    }
    
    if (isLoading || !note) return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="loading">Loading...</div>
            </div>
        </div>
    )
    
    return (
        <div className="modal-overlay">
            <div className="modal-container" ref={modalRef}>
                <div className="note-edit-modal" style={note.style}>
                    <form onSubmit={handleSubmit}>
                        <input 
                            style={note.style}
                            value={note.info.title || ''}
                            onChange={handleChange}
                            name="title"
                            type="text"
                            className="input edit-note-input-title"
                            placeholder="Title"
                        />
                        
                        {noteType === 'NoteTxt' && (
                            <textarea 
                                style={note.style}
                                name="txt" 
                                className="input edit-note-input"
                                placeholder="Take a note"
                                onChange={handleChange}
                                value={note.info.txt || ''}
                                rows={4}
                            />
                        )}
                        
                        {noteType === 'NoteImg' && (
                            <div>
                                <input 
                                    style={note.style}
                                    type="url"
                                    name="url"
                                    className="input edit-note-input-url"
                                    placeholder="Enter image URL"
                                    onChange={handleChange}
                                    value={note.info.url || ''}
                                />
                                {note.info.url && (
                                    <img 
                                        src={note.info.url} 
                                        alt={note.info.title || 'Note image'} 
                                        className="note-preview-image"
                                    />
                                )}
                            </div>
                        )}
                        
                        {noteType === 'NoteVideo' && (
                            <div>
                                <input 
                                    style={note.style}
                                    type="url"
                                    name="url"
                                    className="input edit-note-input-url"
                                    placeholder="Enter YouTube video URL"
                                    onChange={handleChange}
                                    value={note.info.url || ''}
                                />
                                {note.info.url && (
                                    <div className="video-container">
                                        <iframe 
                                            src={note.info.url} 
                                            title={note.info.title || 'Note video'}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {noteType === 'NoteTodos' && (
                            <div className="edit-todo-container">
                                <input 
                                    style={note.style}
                                    type="text"
                                    name="todos"
                                    className="input edit-todo-input"
                                    placeholder="Add List item (comma separated)"
                                    onChange={handleTodoInputChange}
                                    onBlur={handleTodoInputBlur}
                                    value={newTodoInput}
                                />
        
                                <ul className="edit-todo-list">
                                    {(note.info.todos || []).map((todo, idx) => (
                                        <li key={idx}>
                                            <input
                                                type="checkbox"
                                                checked={!!todo.doneAt}
                                                onChange={() => handleCheckboxChange(idx)}
                                            />
                                            <span className={todo.doneAt ? 'done' : ''}>{todo.txt}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        <div className="note-actions-container">
                            <div className="note-toolbar">
                                <button type="button" onClick={() => setColorPickerNoteId(noteId)} className="tool-button">
                                    <span className="material-symbols-outlined">palette</span>
                                </button>
                                <button type="button" onClick={() => { onRemoveNote(noteId); handleClose(); }} className="tool-button">
                                    <span className="material-symbols-outlined">delete</span>
                                </button>
                                <button type="button" onClick={() => onDuplicateNote(note)} className="tool-button">
                                    <span className="material-symbols-outlined">content_copy</span>
                                </button>
                                <button type="button" onClick={() => onSendToMail(note)} className="tool-button">
                                    <span className="material-symbols-outlined">mail</span>
                                </button>
                            </div>
                            
                            <div className="form-actions">
                                <button type="button" onClick={handleClose} className="close-button">Close</button>
                                <button type="submit" className="save-button">Save</button>
                            </div>
                        </div>
                    </form>
                    
                    {colorPickerNoteId === noteId && (
                        <ColorPicker onChangeColor={(color) => onChangeColor(noteId, color, setColorPickerNoteId)} />
                    )}
                </div>
            </div>
        </div>
    )
}