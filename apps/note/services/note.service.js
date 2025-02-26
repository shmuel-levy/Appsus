import { storageService } from '../../services/async-storage.service.js'
import { utilService } from '../../services/util.service.js'

const NOTES_KEY = 'notesDB'

const defaultNotes = [
    {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: { backgroundColor: '#f8f8f8' },
        info: { txt: 'Fullstack Me Baby!' }
    },
    {
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        style: { backgroundColor: '#e6f2ff' },
        info: {
            url: 'https://picsum.photos/200/300',
            title: 'Bobi and Me'
        }
    },
    {
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
        style: { backgroundColor: '#f0fff0' },
        info: {
            title: 'Get my stuff together',
            todos: [
                { txt: 'Driving license', doneAt: null },
                { txt: 'Coding power', doneAt: 187111111 }
            ]
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
    getRandomId: utilService.makeId
}

_createDemoNotes()

function query(filterBy = {}) {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (filterBy.type) {
                notes = notes.filter(note => note.type === filterBy.type)
            }
            if (filterBy.txt) {
                notes = notes.filter(note => 
                    _getNoteText(note).toLowerCase().includes(filterBy.txt.toLowerCase())
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
    if (note.id) {
        return storageService.put(NOTES_KEY, note)
    } else {
        return storageService.post(NOTES_KEY, note)
    }
}

function createNote(type, info, style = {}) {
    const note = {
        id: utilService.makeId(),
        createdAt: Date.now(),
        type,
        isPinned: false,
        style: {
            backgroundColor: style.backgroundColor || '#ffffff'
        },
        info
    }
    return save(note)
}

function getEmptyNote(type = 'NoteTxt') {
    const emptyInfoMap = {
        'NoteTxt': { txt: '' },
        'NoteImg': { url: '', title: '' },
        'NoteVideo': { url: '', title: '' },
        'NoteTodos': { title: '', todos: [] }
    }
    
    if (!emptyInfoMap[type]) {
        throw new Error('Invalid note type')
    }
    
    return {
        type,
        info: {...emptyInfoMap[type]}
    }
}

function _createDemoNotes() {
    return storageService.query(NOTES_KEY)
        .then(notes => {
            if (notes.length >= 3) return notes
            
            localStorage.removeItem(NOTES_KEY)
            
            return storageService.post(NOTES_KEY, defaultNotes[0])
                .then(() => storageService.post(NOTES_KEY, defaultNotes[1]))
                .then(() => storageService.post(NOTES_KEY, defaultNotes[2]))
                .then(() => storageService.query(NOTES_KEY))
        })
}

function _getNoteText(note) {
    switch(note.type) {
        case 'NoteTxt': 
            return note.info.txt
        case 'NoteTodos': 
            return note.info.title + ' ' + note.info.todos.map(todo => todo.txt).join(' ')
        case 'NoteImg':
        case 'NoteVideo': 
            return note.info.title
        default: 
            return ''
    }
}