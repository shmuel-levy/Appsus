const { useState, useRef, useEffect } = React
import { noteService } from '../services/note.service.js'
import { storageService } from '../../services/async-storage.service.js'

const NOTES_KEY = 'notesDB'

export function NoteAdd({ onAddNote }) {
    const [noteType, setNoteType] = useState('NoteTxt')
    const [noteInfo, setNoteInfo] = useState({ txt: '' })
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedColor, setSelectedColor] = useState('#ffffff')
    const [showColorPalette, setShowColorPalette] = useState(false)
    const formRef = useRef()
    const colorPaletteRef = useRef()

    // Available colors like Google Keep
    const colors = [
        { name: 'Default', value: '#ffffff' },
        { name: 'Red', value: '#f28b82' },
        { name: 'Orange', value: '#fbbc04' },
        { name: 'Yellow', value: '#fff475' },
        { name: 'Green', value: '#ccff90' },
        { name: 'Teal', value: '#a7ffeb' },
        { name: 'Blue', value: '#cbf0f8' },
        { name: 'Dark Blue', value: '#aecbfa' },
        { name: 'Purple', value: '#d7aefb' },
        { name: 'Pink', value: '#fdcfe8' },
        { name: 'Brown', value: '#e6c9a8' },
        { name: 'Gray', value: '#e8eaed' },
    ]

    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (isExpanded && isNoteEmpty()) {
                    setIsExpanded(false)
                    setSelectedColor('#ffffff') // Reset color when collapsing
                }
            }
            
            // Close color palette when clicking outside it
            if (colorPaletteRef.current && 
                !colorPaletteRef.current.contains(event.target) && 
                event.target.className !== 'color-btn') {
                setShowColorPalette(false)
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
        
        const newNote = {
            createdAt: Date.now(),
            type: noteType,
            isPinned: false,
            inTrash: false,
            style: {
                backgroundColor: selectedColor
            },
            info: noteInfo
        }
                
        storageService.post(NOTES_KEY, newNote)
            .then(savedNote => {
                console.log('Note saved successfully:', savedNote)
                onAddNote(savedNote)
                resetForm()
                setIsExpanded(false)
                setSelectedColor('#ffffff') // Reset color after adding
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
    
    function toggleColorPalette(ev) {
        ev.preventDefault()
        setShowColorPalette(prev => !prev)
    }
    
    function selectColor(color) {
        setSelectedColor(color)
        setShowColorPalette(false)
    }

    return (
        <div 
            className={`note-add ${isExpanded ? 'expanded' : 'collapsed'}`}
            style={{ backgroundColor: selectedColor }}
        >
            <form onSubmit={handleSubmit} ref={formRef}>
                {renderNoteForm()}
                
                {isExpanded && (
                    <div className="note-form-footer">
                        <div className="note-tools">
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
                            
                            <div className="color-picker">
                                <button 
                                    type="button" 
                                    className="color-btn"
                                    onClick={toggleColorPalette}
                                    title="צבע הפתק"
                                >
                                    🎨
                                </button>
                                
                                {showColorPalette && (
                                    <div className="color-palette" ref={colorPaletteRef}>
                                        {colors.map(color => (
                                            <div 
                                                key={color.value}
                                                className={`color-option ${selectedColor === color.value ? 'selected' : ''}`}
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => selectColor(color.value)}
                                                title={color.name}
                                            ></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <button type="submit">הוסף פתק</button>
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
                        placeholder="רשום פתק..." 
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
                            placeholder="כותרת" 
                            value={noteInfo.title || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <input 
                            type="text" 
                            name="url" 
                            placeholder="כתובת תמונה" 
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
                            placeholder="כותרת הרשימה" 
                            value={noteInfo.title || ''}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <textarea
                            name="todosText"
                            placeholder="רשום פריטים מופרדים בפסיקים"
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