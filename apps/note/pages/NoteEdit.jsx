const { useParams, useNavigate } = ReactRouterDOM
const { useState, useEffect, useRef } = React

import { noteService } from "../services/note.service.js"

export function NoteEdit() {
  const { noteId } = useParams()
  const [note, setNote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [noteType, setNoteType] = useState("NoteTxt")
  const [showColorPalette, setShowColorPalette] = useState(false)
  const [newTodoInput, setNewTodoInput] = useState("")
  const navigate = useNavigate()
  const modalRef = useRef(null)
  const colorPaletteRef = useRef(null)

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
    loadNote()
    document.body.style.overflow = "hidden"

    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose()
      }

      if (
        colorPaletteRef.current &&
        !colorPaletteRef.current.contains(event.target) &&
        !event.target.closest(".palette-btn")
      ) {
        setShowColorPalette(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.body.style.overflow = "auto"
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [noteId])

  function loadNote() {
    setIsLoading(true)
    noteService
      .get(noteId)
      .then((noteData) => {
        setNote(noteData)
        setNoteType(noteData.type)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error("Error loading note:", err)
        setIsLoading(false)
      })
  }

  function handleClose() {
    navigate("/note")
  }

  function handleChange({ target }) {
    const field = target.name
    let value = target.value

    switch (target.type) {
      case "number":
      case "range":
        value = +value
        break

      case "checkbox":
        value = target.checked
        break

      default:
        break
    }

    setNote((prevNote) => {
      const updatedNote = {
        ...prevNote,
        info: {
          ...prevNote.info,
          [field]: value,
        },
      }
      return updatedNote
    })
  }

  function handleSubmit(ev) {
    ev.preventDefault()

    noteService
      .save(note)
      .then(() => {
        handleClose()
      })
      .catch((err) => {
        console.error("Error saving note:", err)
      })
  }

  function handleTodoInputChange(event) {
    setNewTodoInput(event.target.value)
  }

  function handleTodoInputBlur() {
    if (!newTodoInput.trim()) return

    var listTodos = newTodoInput.split(",")
    const cleanListTodos = listTodos.filter(Boolean)
    listTodos = cleanListTodos.map((txt) => ({
      txt: txt.trim(),
      doneAt: null,
    }))

    setNote((prevNote) => ({
      ...prevNote,
      info: {
        ...prevNote.info,
        todos: [...(prevNote.info.todos || []), ...listTodos],
      },
    }))
    setNewTodoInput("")
  }

  function handleCheckboxChange(todoIdx) {
    setNote((prevNote) => {
      const updatedTodos = prevNote.info.todos.map((todo, idx) => {
        if (idx === todoIdx) {
          return {
            ...todo,
            doneAt: todo.doneAt ? null : Date.now(),
          }
        }
        return todo
      })

      return {
        ...prevNote,
        info: {
          ...prevNote.info,
          todos: updatedTodos,
        },
      }
    })
  }

  function handlePinNote() {
    if (!note) return

    const updatedNote = {
      ...note,
      isPinned: !note.isPinned,
    }

    noteService
      .save(updatedNote)
      .then((savedNote) => {
        setNote(savedNote)
      })
      .catch((err) => {
        console.error("Error updating pin status:", err)
      })
  }

  function handleArchive() {
    if (!note) return
    
    const updatedNote = {
        ...note,
        isArchived: true  
    }
    
    noteService.save(updatedNote)
        .then(savedNote => {
            console.log('Note archived:', savedNote)
            handleClose() 
        })
        .catch(err => {
            console.error('Error archiving note:', err)
        })
  }

  function handleAddImage() {
    setNoteType("NoteImg")
    setNote((prevNote) => ({
      ...prevNote,
      type: "NoteImg",
    }))
  }

  function handleChangeColor(color) {
    if (!note) return

    const updatedNote = {
      ...note,
      style: {
        ...note.style,
        backgroundColor: color,
      },
    }

    setNote(updatedNote)
    setShowColorPalette(false)

    noteService.save(updatedNote).catch((err) => {
      console.error("Error updating note color:", err)
    })
  }

  function handleRemoveNote() {
    if (!note) return

    noteService
      .moveToTrash(noteId)
      .then(() => {
        handleClose()
      })
      .catch((err) => {
        console.error("Error moving note to trash:", err)
      })
  }

  function handleSendToMail() {
    if (!note || !note.info) return
    window.location.href = `mailto:?subject=${encodeURIComponent(
      note.info.title || "Note"
    )}&body=${encodeURIComponent(note.info.txt || "")}`
  }

  function toggleColorPalette(ev) {
    ev.preventDefault()
    setShowColorPalette((prev) => !prev)
  }

  if (isLoading || !note)
    return (
      <div className="modal-overlay">
        <div className="modal-container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    )

  return (
    <div className="modal-overlay">
      <div className="modal-container" ref={modalRef}>
        <div className={`note-edit-modal ${note.isPinned ? 'pinned' : ''}`} style={note.style}>
          {note.isPinned && (
            <div className="pin-indicator">
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="#f1c40f">
                <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
              </svg>
            </div>
          )}
          <form onSubmit={handleSubmit} className="note-edit-form">
            <input
              style={note.style}
              value={note.info.title || ""}
              onChange={handleChange}
              name="title"
              type="text"
              className="input edit-note-input-title"
              placeholder="Title"
            />

            {noteType === "NoteTxt" && (
              <textarea
                style={note.style}
                name="txt"
                className="input edit-note-input"
                placeholder="Take a note"
                onChange={handleChange}
                value={note.info.txt || ""}
                rows={4}
              />
            )}

            {noteType === "NoteImg" && (
              <div>
                <input
                  style={note.style}
                  type="url"
                  name="url"
                  className="input edit-note-input-url"
                  placeholder="Enter image URL"
                  onChange={handleChange}
                  value={note.info.url || ""}
                />
                {note.info.url && (
                  <img
                    src={note.info.url}
                    alt={note.info.title || "Note image"}
                    className="note-preview-image"
                  />
                )}
              </div>
            )}

            {noteType === "NoteVideo" && (
              <div>
                <input
                  style={note.style}
                  type="url"
                  name="url"
                  className="input edit-note-input-url"
                  placeholder="Enter YouTube video URL"
                  onChange={handleChange}
                  value={note.info.url || ""}
                />
                {note.info.url && (
                  <div className="video-container">
                    <iframe
                      src={note.info.url}
                      title={note.info.title || "Note video"}
                      frameBorder="0"
                      allow="accelerometer autoplay clipboard-write encrypted-media gyroscope picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {noteType === "NoteTodos" && (
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
                      <span className={todo.doneAt ? "done" : ""}>
                        {todo.txt}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="note-actions-footer">
              <div className="action-buttons">
                <button
                  type="button"
                  onClick={handlePinNote}
                  className={`action-btn push_pin ${note.isPinned ? 'pinned' : ''}`}
                  title={note.isPinned ? "Unpin note" : "Pin note"}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M17 4v7l2 3v2h-6v5l-1 1-1-1v-5H5v-2l2-3V4c0-1.1.9-2 2-2h6c1.11 0 2 .89 2 2zM9 4v7.75L7.5 14h9L15 11.75V4H9z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={toggleColorPalette}
                  className="action-btn palette-btn"
                  title="Background options"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z" />
                    <circle cx="6.5" cy="11.5" r="1.5" />
                    <circle cx="9.5" cy="7.5" r="1.5" />
                    <circle cx="14.5" cy="7.5" r="1.5" />
                    <circle cx="17.5" cy="11.5" r="1.5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleArchive}
                  className="action-btn archive"
                  title="Archive"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm8.45-9h-2.9v3H8l4 4 4-4h-2.55z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newNote = { ...note, id: "" }
                    noteService.save(newNote)
                  }}
                  className="action-btn content_copy"
                  title="Make a copy"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveNote}
                  className="action-btn delete"
                  title="Delete note"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm-2 16H9V8h1v12zm3 0h-1V8h1v12zM7 20H6V6h1v14z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleSendToMail}
                  className="action-btn mail"
                  title="Send"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="action-btn image"
                  title="Add image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="currentColor"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z" />
                  </svg>
                </button>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleClose}
                  className="close-button"
                >
                  Close
                </button>
                <button type="submit" className="save-button">
                  Save
                </button>
              </div>
            </div>

            {showColorPalette && (
              <div className="color-palette-container" ref={colorPaletteRef}>
                <div className="color-palette">
                  {colors.map((color) => (
                    <div
                      key={color.value}
                      className="color-option"
                      style={{
                        backgroundColor: color.value,
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        border:
                          color.value === "#ffffff"
                            ? "1px solid #e0e0e0"
                            : "none",
                        cursor: "pointer",
                        margin: "2px",
                      }}
                      onClick={() => handleChangeColor(color.value)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}