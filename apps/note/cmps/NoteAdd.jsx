const { useState } = React
import { noteService } from '../services/note.service.js'

export function NoteAdd({ onAddNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [noteInfo, setNoteInfo] = useState({ txt: '' })

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

    function handleSubmit(ev) {
        ev.preventDefault()
        if (isNoteEmpty()) return 

        noteService.createNote(noteType, noteInfo)
            .then(savedNote => {
                onAddNote(savedNote)
                resetForm()
            })
            .catch(err => {
                console.error('Error saving note:', err)
            })
    }

    function isNoteEmpty() {
        switch(noteType) {
            case 'NoteTxt': 
                return !noteInfo.txt.trim()
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
        <div className="note-add">
            <form onSubmit={handleSubmit}>
                {renderNoteForm()}
                
                <div className="note-type-buttons">
                    <button type="button" onClick={() => handleTypeChange('NoteTxt')}>Text</button>
                    <button type="button" onClick={() => handleTypeChange('NoteImg')}>Image</button>
                    <button type="button" onClick={() => handleTypeChange('NoteTodos')}>Todos</button>
                </div>
                
                <button type="submit">Add Note</button>
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
                        autoFocus
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
                        />
                        <input 
                            type="text" 
                            name="url" 
                            placeholder="Image URL" 
                            value={noteInfo.url || ''}
                            onChange={handleChange}
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
                        />
                        <textarea
                            name="todosText"
                            placeholder="Enter items separated by commas"
                            onChange={handleTodoChange}
                        />
                    </div>
                )
                
            default:
                return <div>Unsupported note type</div>
        }
    }
}