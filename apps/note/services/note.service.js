// note service
import { storageService } from "../../../services/async-storage.service"
import { utilService } from "../../../services/util.service"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service"
const STORAGE_KEY = 'noteDB'

const defaultNotes = [
    {
        id: 'n101',
        createdAt: 1112222,
        type: 'NoteTxt',
        isPinned: true,
        style: {
            backgroundColor: '#00d'
        },
        info: {
            txt: 'Fullstack Me Baby!'
        }
    },
    {
        id: 'n102',
        createdAt: 1112223,
        type: 'NoteImg',
        isPinned: false,
        info: {
            url: 'http://some-img/me',
            title: 'Bobi and Me'
        },
        style: {
            backgroundColor: '#00d'
        }
    },
    {
        id: 'n103',
        createdAt: 1112224,
        type: 'NoteTodos',
        isPinned: false,
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
    getById,
    save,
    remove,
    getEmptyNote
}

function query(filterBy = {}) {
    return storageService.query(STORAGE_KEY)
        .then(notes => {
            if (!notes || !notes.length) {
                notes = defaultNotes
                return storageService.post(STORAGE_KEY, notes[0])
                    .then(() => storageService.post(STORAGE_KEY, notes[1]))
                    .then(() => storageService.post(STORAGE_KEY, notes[2]))
                    .then(() => storageService.query(STORAGE_KEY))
            }
            return notes
        })
        .then(notes => {
            if (filterBy.txt) {
                const regex = new RegExp(filterBy.txt, 'i')
                notes = notes.filter(note => {
                    return regex.test(note.info.txt) || 
                           regex.test(note.info.title) || 
                           (note.type === 'NoteTodos' && note.info.todos.some(todo => regex.test(todo.txt)))
                })
            }
            
            notes.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1
                if (!a.isPinned && b.isPinned) return 1
                return b.createdAt - a.createdAt
            })
            
            return notes
        })
}