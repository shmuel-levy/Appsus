const { useState, useRef, useEffect } = React
import { noteService } from "../services/note.service.js"

export function NoteAdd({ onAddNote }) {
    const [noteType, setNoteType] = useState("NoteTxt")
    const [noteInfo, setNoteInfo] = useState({ txt: "" })
    const [isExpanded, setIsExpanded] = useState(false)
    const [selectedColor, setSelectedColor] = useState("#ffffff")
    const [showColorPalette, setShowColorPalette] = useState(false)
    const formRef = useRef()
    const colorPaletteRef = useRef()

    const colors = [
        { name: "Default", value: "#ffffff" },
        { name: "Red", value: "#f28b82" },
        { name: "Orange", value: "#fbbc04" },
        { name: "Yellow", value: "#fff475" },
        { name: "Green", value: "#ccff90" },
        { name: "Teal", value: "#a7ffeb" },
        { name: "Blue", value: "#cbf0f8" },
        { name: "Dark Blue", value: "#aecbfa" },
        { name: "Purple", value: "#d7aefb" },
        { name: "Pink", value: "#fdcfe8" },
        { name: "Brown", value: "#e6c9a8" },
        { name: "Gray", value: "#e8eaed" },
    ]

    useEffect(() => {
        function handleClickOutside(event) {
            if (formRef.current && !formRef.current.contains(event.target)) {
                if (isExpanded && isNoteEmpty()) {
                    setIsExpanded(false)
                    setSelectedColor("#ffffff")
                }
            }

            if (
                colorPaletteRef.current &&
                !colorPaletteRef.current.contains(event.target) &&
                event.target.className !== "color-btn"
            ) {
                setShowColorPalette(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isExpanded])

    function handleTypeChange(type) {
        setNoteType(type)
        setNoteInfo(noteService.getEmptyNote(type).info)
    }

    function handleChange(ev) {
        const { name, value } = ev.target
        setNoteInfo((prevInfo) => ({ ...prevInfo, [name]: value }))
    }

    function handleTodoChange(ev) {
        const todosText = ev.target.value
        const todos = todosText
            .split(",")
            .filter((txt) => txt.trim())
            .map((txt) => ({ txt: txt.trim(), doneAt: null }))

        setNoteInfo((prevInfo) => ({ ...prevInfo, todos }))
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
            isArchived: false,
            inTrash: false,
            style: {
                backgroundColor: selectedColor,
            },
            info: noteInfo,
        }

        noteService.save(newNote)
            .then((savedNote) => {
                console.log("Note saved successfully:", savedNote)
                onAddNote(savedNote)
                resetForm()
                setIsExpanded(false)
                setSelectedColor("#ffffff")
            })
            .catch((err) => {
                console.error("Error saving note:", err)
            })
    }

    function isNoteEmpty() {
        switch (noteType) {
            case "NoteTxt":
                return !noteInfo.txt || !noteInfo.txt.trim()
            case "NoteImg":
                return !noteInfo.url || !noteInfo.title
            case "NoteTodos":
                return (
                    !noteInfo.title || !noteInfo.todos || noteInfo.todos.length === 0
                )
            case "NoteVideo":
                return !noteInfo.url || !noteInfo.title
            default:
                return true
        }
    }

    function resetForm() {
        setNoteInfo(noteService.getEmptyNote(noteType).info)
    }

    function toggleColorPalette(ev) {
        ev.preventDefault()
        setShowColorPalette((prev) => !prev)
    }

    function selectColor(color) {
        setSelectedColor(color)
        setShowColorPalette(false)
    }

    return (
        <div
            className={`note-add ${isExpanded ? "expanded" : "collapsed"}`}
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
        className={noteType === "NoteTxt" ? "active" : ""}
        onClick={() => handleTypeChange("NoteTxt")}
        title="Text note"
    >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
            <path d="M14 17H4v2h10v-2zm6-8H4v2h16V9zM4 15h16v-2H4v2zM4 5v2h16V5H4z"/>
        </svg>
    </button>
    <button
        type="button"
        className={noteType === "NoteImg" ? "active" : ""}
        onClick={() => handleTypeChange("NoteImg")}
        title="Image note"
    >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z"/>
        </svg>
    </button>
    <button
        type="button"
        className={noteType === "NoteTodos" ? "active" : ""}
        onClick={() => handleTypeChange("NoteTodos")}
        title="List note"
    >
      
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
            <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
        </svg>
    </button>
    <button
        type="button"
        className={noteType === "NoteVideo" ? "active" : ""}
        onClick={() => handleTypeChange("NoteVideo")}
        title="YouTube video note"
    >
        <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
            <path d="M21.58 7.19c-.23-.86-.91-1.54-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.81.42c-.86.23-1.54.91-1.77 1.77C2 8.75 2 12 2 12s0 3.25.42 4.81c.23.86.91 1.54 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.81-.42c.86-.23 1.54-.91 1.77-1.77C22 15.25 22 12 22 12s0-3.25-.42-4.81zM10 15V9l5.2 3-5.2 3z"/>
        </svg>
    </button>
</div>

                            <div className="color-picker">
                                <button
                                    type="button"
                                    className="color-btn"
                                    onClick={toggleColorPalette}
                                    title="Note color"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                                        <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
                                        <circle cx="6.5" cy="11.5" r="1.5"/>
                                        <circle cx="9.5" cy="7.5" r="1.5"/>
                                        <circle cx="14.5" cy="7.5" r="1.5"/>
                                        <circle cx="17.5" cy="11.5" r="1.5"/>
                                    </svg>
                                </button>

                                {showColorPalette && (
                                    <div className="color-palette" ref={colorPaletteRef}>
                                        {colors.map((color) => (
                                            <div
                                                key={color.value}
                                                className={`color-option ${
                                                    selectedColor === color.value ? "selected" : ""
                                                }`}
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => selectColor(color.value)}
                                                title={color.name}
                                            ></div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button type="submit">Add Note</button>
                    </div>
                )}
            </form>
        </div>
    )

    function renderNoteForm() {
        switch (noteType) {
            case "NoteTxt":
                return (
                    <input
                        type="text"
                        name="txt"
                        placeholder="Take a note..."
                        value={noteInfo.txt || ""}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        autoFocus={isExpanded}
                    />
                )

            case "NoteImg":
                return (
                    <div className="img-note-form">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={noteInfo.title || ""}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <input
                            type="text"
                            name="url"
                            placeholder="Image URL"
                            value={noteInfo.url || ""}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                    </div>
                )

            case "NoteTodos":
                return (
                    <div className="todos-note-form">
                        <input
                            type="text"
                            name="title"
                            placeholder="List title"
                            value={noteInfo.title || ""}
                            onChange={handleChange}
                            onFocus={handleFocus}
                        />
                        <textarea
                            name="todosText"
                            placeholder="List items (comma separated)"
                            onChange={handleTodoChange}
                            onFocus={handleFocus}
                            rows={isExpanded ? 3 : 1}
                        />
                    </div>
                )
                
            case "NoteVideo":
                return (
                    <div className="video-note-form" dir="ltr">
                        <input
                            type="text"
                            name="title"
                            placeholder="Title"
                            value={noteInfo.title || ""}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            dir="ltr"
                        />
                        <input
                            type="text"
                            name="url"
                            placeholder="YouTube Video URL"
                            value={noteInfo.url || ""}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            dir="ltr"
                        />
                    </div>
                )

            default:
                return <div>Unsupported note type</div>
        }
    }
}