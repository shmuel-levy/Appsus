
export function MailFolderList ({onSetFolder}) {
    return (
        <nav className='mail-folder-list'>
            <button onClick = {() => onSetFolder('inbox')}><i className='fas fa-inbox'></i>Inbox</button>
            <button onClick = {() => onSetFolder('starred')}><i className='fa-regular fa-star'></i>Starred</button>
            <button onClick = {() => onSetFolder('sent')}><i className='fa-regular fa-paper-plane'></i>Sent</button>
            <button onClick = {() => onSetFolder('trash')}><i className='fa-regular fa-trash-can'></i>Trash</button>
            <button onClick = {() => onSetFolder('draft')}><i className='fa-regular fa-file'></i>Drafts</button>
        </nav>
    )
}