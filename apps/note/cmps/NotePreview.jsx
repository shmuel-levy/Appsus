import { NoteTxt } from './note-types/NoteTxt.jsx'
import { NoteImg } from './note-types/NoteImg.jsx'
import { NoteTodos } from './note-types/NoteTodos.jsx'

export function NotePreview({ note, onRemoveNote, onPinNote }){
    function onPin(){
        onPinNote(note.id)
    }
    function onRemove(){
        onRemoveNote(note.id)
    }
    
}