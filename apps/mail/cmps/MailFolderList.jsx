
export function MailFolderList({ onSetFolder, activeFolder }) {
    return (
        <nav className='mail-folder-list'>
            <button onClick={() => onSetFolder('inbox')} className={activeFolder === 'inbox' ? 'active' : ''}>
                <i className='fas fa-inbox'></i>Inbox</button>
            <button onClick={() => onSetFolder('starred')} className={activeFolder === 'starred' ? 'active' : ''}>
                <i className='fa-regular fa-star'></i>Starred</button>
            <button onClick={() => onSetFolder('sent')} className={activeFolder === 'sent' ? 'active' : ''}>
                <i className='fa-regular fa-paper-plane'></i>Sent</button>
            <button onClick={() => onSetFolder('draft')} className={activeFolder === 'draft' ? 'active' : ''}>
                <i className='fa-regular fa-file'></i>Drafts</button>
            <button onClick={() => onSetFolder('trash')} className={activeFolder === 'trash' ? 'active' : ''}>
                <i className='fa-regular fa-trash-can'></i>Trash</button>
        </nav>
    )
}