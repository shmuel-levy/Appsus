import { storageService } from '../../services/async-storage.service.js'
import { utilService } from '../../services/util.service.js'

const NOTES_KEY = 'notesDB'

const defaultNotes = [
    {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        inTrash: false,
        style: { backgroundColor: '#fff475' },
        info: { 
            title: 'Presentation Notes',
            txt: 'what are we vowing bout'
        }
    },
    {
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: true,
        inTrash: false,
        style: { backgroundColor: '#cbf0f8' }, 
        info: {
            url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaW5nfGVufDB8fDB8fHww&auto=format&fit=crop&w=600&q=60',
            title: 'My NoteKeep and EmailKeep in progress'
        }
    },
    {
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#d7aefb' }, 
        info: {
            title: 'Project Features',
            todos: [
                { txt: 'Modal editing with real-time updates', doneAt: 187111111 },
                { txt: 'Color picker for note customization', doneAt: 187111111 },
                { txt: 'Pinning important notes', doneAt: 187111111 },
                { txt: 'Moving notes to trash', doneAt: null },
                { txt: 'Archive functionality', doneAt: null }
            ]
        }
    },
    {
        id: 'n104',
        createdAt: 1112225,
        type: 'NoteTxt',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#fdcfe8' }, 
        info: {
            title: 'CSS Tips',
            txt: 'Remember to use flexbox for responsive layouts. Grid is great for two-dimensional layouts. Keep your CSS modular and reusable!'
        }
    },
    {
        id: 'n105',
        createdAt: 1112226,
        type: 'NoteTodos',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#a7ffeb' }, 
        info: {
            title: 'Project Showcase',
            todos: [
                { txt: 'Prepare live demo', doneAt: null },
                { txt: 'Highlight key features', doneAt: null },
                { txt: 'Explain technical challenges', doneAt: null },
                { txt: 'Mention future improvements', doneAt: null }
            ]
        }
    },
    {
        id: 'n106',
        createdAt: 1112227,
        type: 'NoteImg',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#f28b82' }, 
        info: {
            url: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGNvZGluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=600&q=60',
            title: 'Late Night Coding Sessions'
        }
    },
    {
        id: 'n107',
        createdAt: 1112228,
        type: 'NoteTxt',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#ccff90' }, 
        info: {
            title: 'React Best Practices',
            txt: 'Always use functional components with hooks. Keep state local when possible. Use context for global state. Break complex UIs into smaller components. Handle errors gracefully.'
        }
    },
    {
        id: 'n108',
        createdAt: 1112229,
        type: 'NoteVideo',
        isPinned: true,
        inTrash: false,
        style: { backgroundColor: '#cbf0f8' },
        info: {
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Must Watch Video'
        }
    },
    {
        id: 'n109',
        createdAt: 1112230,
        type: 'NoteVideo',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#fff475' },
        info: {
            url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            title: 'First YouTube Video Ever'
        }
    },
    {
        id: 'n110',
        createdAt: 1112231,
        type: 'NoteVideo',
        isPinned: false,
        inTrash: false,
        style: { backgroundColor: '#fdcfe8' },
        info: {
            url: 'https://www.youtube.com/watch?v=_GuOjXYl5ew',
            title: 'Quick React JS Tutorial'
        }
    }
]

export const noteService = {
    query,
    get,
    remove,
    save,
    getEmptyNote,
    createNote,
    getRandomId: utilService.makeId,
    moveToTrash,
    restoreFromTrash,
    moveToArchive,
    restoreFromArchive,
    sendNoteToEmail,
    formatNoteForEmail
}

_createDemoNotes()

function query(filterBy = {}) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            notes = notes.map(note => {
                if (note.inTrash === undefined) note.inTrash = false
                if (note.isArchived === undefined) note.isArchived = false
                return note
            })
            
            if (filterBy.inTrash) {
                notes = notes.filter(note => note.inTrash)
            } else if (filterBy.isArchived) {
                notes = notes.filter(note => note.isArchived && !note.inTrash)
            } else {
                notes = notes.filter(note => !note.inTrash && !note.isArchived)
            }
            
            if (filterBy.type) {
                notes = notes.filter(note => note.type === filterBy.type)
            }
            
            if (filterBy.txt) {
                notes = notes.filter(note => 
                    _getNoteText(note).toLowerCase().includes(filterBy.txt.toLowerCase())
                )
            }
            
            if (filterBy.color) {
                notes = notes.filter(note => 
                    note.style && 
                    note.style.backgroundColor && 
                    note.style.backgroundColor.toLowerCase() === filterBy.color.toLowerCase()
                )
            }
            
            return notes.sort((a, b) => b.isPinned - a.isPinned || b.createdAt - a.createdAt)
        })
}

function get(noteId) {
    return storageService.get(NOTES_KEY, noteId)
}

function remove(noteId) {
    return storageService.remove(NOTES_KEY, noteId)
}

function save(note) {
    if (!note.id) {
        note.id = utilService.makeId()  
        return storageService.post(NOTES_KEY, note)  
    }

    return storageService.query(NOTES_KEY)
        .then(notes => {
            const existingNote = notes.find(n => n.id === note.id)
            if (!existingNote) {
                console.warn('🛑 Note with ID ${note.id} not found, creating a new one.')
                return storageService.post(NOTES_KEY, note)  
            }
            return storageService.put(NOTES_KEY, note)  
        })
}

function moveToTrash(noteId) {
    return get(noteId)
        .then(note => {
            note.inTrash = true
            return save(note)
        })
}

function restoreFromTrash(noteId) {
    return get(noteId)
        .then(note => {
            note.inTrash = false
            return save(note)
        })
}


function moveToArchive(noteId) {
    return get(noteId)
        .then(note => {
            note.isArchived = true
            return save(note)
        })
}

function restoreFromArchive(noteId) {
    return get(noteId)
        .then(note => {
            note.isArchived = false
            return save(note)
        })
}

function createNote(type, info, style = {}) {
    const note = {
        id: utilService.makeId(),
        createdAt: Date.now(),
        type,
        isPinned: false,
        inTrash: false,
        isArchived: false,
        style: {
            backgroundColor: style.backgroundColor || '#ffffff'
        },
        info
    }
    return save(note)
}

function getEmptyNote(type = 'NoteTxt') {
    const emptyInfoMap = {
        'NoteTxt': { title: '', txt: '' },
        'NoteImg': { url: '', title: '' },
        'NoteTodos': { title: '', todos: [] },
        'NoteVideo': { url: '', title: '' } 
    }
    
    if (!emptyInfoMap[type]) {
        console.warn(`Invalid note type: ${type}, defaulting to NoteTxt`)
        type = 'NoteTxt'
    }
    
    return {
        type,
        inTrash: false,
        isArchived: false,
        isPinned: false,
        style: { backgroundColor: '#ffffff' },
        info: {...emptyInfoMap[type]}
    }
}

/**
 * Formats a note for email content based on its type
 * @param {Object} note - The note to format
 * @returns {Object} - Object with subject and body for email
 */
function formatNoteForEmail(note) {
    let subject = '';
    let body = '';
    
    switch (note.type) {
        case 'NoteTxt':
            subject = note.info.title || 'Text Note';
            body = `${note.info.title ? note.info.title + '\n\n' : ''}${note.info.txt || ''}`;
            break;
            
        case 'NoteImg':
            subject = note.info.title || 'Image Note';
            body = `${note.info.title ? note.info.title + '\n\n' : ''}Image URL: ${note.info.url}`;
            break;
            
        case 'NoteVideo':
            subject = note.info.title || 'Video Note';
            body = `${note.info.title ? note.info.title + '\n\n' : ''}Video URL: ${note.info.url}`;
            break;
            
        case 'NoteTodos':
            subject = note.info.title || 'Todo List';
            body = note.info.title ? note.info.title + '\n\n' : '';
            if (note.info.todos && note.info.todos.length > 0) {
                note.info.todos.forEach((todo, idx) => {
                    body += `${idx + 1}. [${todo.doneAt ? 'x' : ' '}] ${todo.txt}\n`;
                });
            }
            break;
            
        default:
            subject = 'Note from Keep';
            body = 'Note content';
    }
    
    return { subject, body };
}

function sendNoteToEmail(note) {
    const { subject, body } = formatNoteForEmail(note);
    
    // Encode the subject and body for URL parameters
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    
    // Create the URL with query parameters for the Mail app compose page
    const emailComposeUrl = `#/mail/compose?subject=${encodedSubject}&body=${encodedBody}`;
    
    // Navigate to the email compose page
    window.location.href = emailComposeUrl;
}

function _createDemoNotes() {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (notes.length >= 3) {
                let needsUpdate = false
                notes = notes.map(note => {
                    if (note.inTrash === undefined) {
                        note.inTrash = false
                        needsUpdate = true
                    }
                    if (note.isArchived === undefined) {
                        note.isArchived = false
                        needsUpdate = true
                    }
                    return note
                })
                
                if (needsUpdate) {
                    localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
                }
                
                return notes
            }
            
            localStorage.removeItem(NOTES_KEY)
            localStorage.setItem(NOTES_KEY, JSON.stringify(defaultNotes))
            return defaultNotes
        })
}

function _getNoteText(note) {
    switch(note.type) {
        case 'NoteTxt': 
            return `${note.info.title || ''} ${note.info.txt || ''}`
        case 'NoteTodos': 
            return `${note.info.title || ''} ${(note.info.todos || []).map(todo => todo.txt).join(' ')}`
        case 'NoteImg':
        case 'NoteVideo': 
            return note.info.title || ''
        default: 
            return ''
    }
}