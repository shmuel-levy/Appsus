
export function MailFolderList({ onSetFolder, activeFolder, unreadCount }) {
    return (
        <nav className='mail-folder-list'>
            <button onClick={() => onSetFolder('inbox')} className={activeFolder === 'inbox' ? 'active' : ''}>
                <i className='fas fa-inbox'></i> <span>Inbox</span>
                {unreadCount > 0 && (
                    <span className="unread-count">{unreadCount}</span>
                )}
            </button>
            <button onClick={() => onSetFolder('starred')} className={activeFolder === 'starred' ? 'active' : ''}>
                <i className='fa-regular fa-star'></i><span>Starred</span></button>
            <button onClick={() => onSetFolder('sent')} className={activeFolder === 'sent' ? 'active' : ''}>
                <i className='fa-regular fa-paper-plane'></i><span>Sent</span></button>
            <button onClick={() => onSetFolder('drafts')} className={activeFolder === 'drafts' ? 'active' : ''}>
                <i className='fa-regular fa-file'></i><span>Drafts</span></button>
            <button onClick={() => onSetFolder('trash')} className={activeFolder === 'trash' ? 'active' : ''}>
                <i className='fa-regular fa-trash-can'></i><span>Trash</span></button>
        </nav>
    )
}