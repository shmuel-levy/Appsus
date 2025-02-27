const { useState, useRef, useEffect } = React
import { noteService } from '../services/note.service.js'

export function NoteAdd({ onAddNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [noteInfo, setNoteInfo] = useState({ txt: '' })
    const [isExpanded, setIsExpanded] = useState(false)
    const formRef = useRef()

    // Add click outside listener to collapse the form
    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (isExpanded && isNoteEmpty()) {
                    setIsExpanded(false)
                }
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isExpanded])

    function handleTypeChange(type) {
        setNoteType(type)
        setNoteInfo(noteService.getEmptyNote(type).info)
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setNoteInfo(prevInfo => ({ ...prevInfo, [name]: value }))
    }

    function handleTodoChange(ev) {
        const todosText = ev.target.value
        const todos = todosText.split(',')
            .filter(txt => txt.trim())
            .map(txt => ({ txt: txt.trim(), doneAt: null }))
        
        setNoteInfo(prevInfo => ({ ...prevInfo, todos }))
    }

    function handleFocus() {
        setIsExpanded(true)
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        if (isNoteEmpty()) return 

        console.log('Creating new note of type:', noteType, 'with info:', noteInfo)
        
        noteService.createNote(noteType, noteInfo)
            .then(savedNote => {
                console.log('Note saved successfully:', savedNote)
                onAddNote(savedNote)
                resetForm()
                setIsExpanded(false)
            })
            .catch(err => {
                console.error('Error saving note:', err)
            })
    }

    function isNoteEmpty() {
        switch(noteType) {
            case 'NoteTxt': 
                return !noteInfo.txt || !noteInfo.txt.trim()
            case 'NoteImg':
                return !noteInfo.url || !noteInfo.title
            case 'NoteTodos':
                return !noteInfo.title || !noteInfo.todos || noteInfo.todos.length === 0
            default:
                return true
        }
    }

    function resetForm() {
        setNoteInfo(noteService.getEmptyNote(noteType).info)
    }

    return (
        <div className={`note-add ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <form onSubmit={handleSubmit} ref={formRef}>
                {renderNoteForm()}
                
                {isExpanded && (
                    <div className="note-form-footer">
                        <div className="note-type-buttons">
                            <button 
                                type="button" 
                                className={noteType === 'NoteTxt' ? 'active' : ''}
                                onClick={() => handleTypeChange('NoteTxt')}
                            >
                                Text
                            </button>
                            <button 
                                type="button" 
                                className={noteType === 'NoteImg' ? 'active' : ''}
                                onClick={() => handleTypeChange('NoteImg')}
                            >
                                Image
                            </button>
                            <button 
                                type="button" 
                                className={noteType === 'NoteTodos' ? 'active' : ''}
                                onClick={() => handleTypeChange('NoteTodos')}
                            >
                                Todos
                            </button>
                        </div>
                        
                        <button type="submit">Add Note</button>
                    </div>
                )}
            </form>
        </div>
    )

    function renderNoteForm() {
        switch(noteType) {
            case 'NoteTxt':
                return (
                    <input 
                        type="text" 
                        name="txt" 
                        placeholder="Take a note..." 
                        value={noteInfo.txt || ''}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        autoFocus={isExpanded}
                    />
                )
                
            case 'NoteImg':
                return (
                    <div className="img-note-form">
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="Title" 
                            value={noteInfo.title || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <input 
                            type="text" 
                            name="url" 
                            placeholder="Image URL" 
                            value={noteInfo.url || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                )
                
            case 'NoteTodos':
                return (
                    <div className="todos-note-form">
                        <input 
                            type="text" 
                            name="title" 
                            placeholder="List title" 
                            value={noteInfo.title || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <textarea
                            name="todosText"
                            placeholder="Enter items separated by commas"
                            onChange={handleTodoChange}
                            onFocus={handleFocus}
                            rows={isExpanded ? 3 : 1}
                        />
                    </div>
                )
                
            default:
                return <div>Unsupported note type</div>
        }
    }
}