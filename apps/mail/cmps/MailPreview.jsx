const { Link, useSearchParams } = ReactRouterDOM

export function MailPreview({ mail, onMailClick, onToggleStar, onToggleSelect, onDeleteMail, selectedMails = [] }) {

    const folder = mail.folder || 'inbox'

    function formatMailDate(timestamp) {
        const date = new Date(timestamp)
        const now = new Date()
        const isToday = now.toDateString() === date.toDateString()

        if (isToday) {
            return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
        }
    }

    return (
        <div className={`mail-preview ${mail.isRead ? 'read' : 'unread'} ${selectedMails.includes(mail.id) ? 'selected' : ''} ${mail.isStarred ? 'starred' : ''}`}>
            <input
                type="checkbox"
                checked={selectedMails.includes(mail.id)}
                onChange={() => onToggleSelect(mail.id)}
            />
            <i
                className={`fa-star ${mail.isStarred ? 'fas' : 'far'}`}
                onClick={(ev) => {
                    ev.stopPropagation();
                    onToggleStar(mail.id);
                }}
            ></i>
            <Link to={`/mail/${mail.id}?folder=${folder}`} className="mail-link">
                <h3 className={mail.isRead ? '' : 'bold'}>
                    {mail.from}
                </h3>
                <div className="mail-text-wrapper">
                    <div className="mail-text">
                        <p className={mail.isRead ? '' : 'bold'}>
                            {mail.subject} <span className="mail-body"> - ... {mail.body.substring(0, 50)}</span>
                        </p>
                    </div>
                </div>
            </Link>

            <div className="mail-actions-wrapper">
                <span className="mail-date">{formatMailDate(mail.sentAt)}</span>
                <div className="mail-actions">
                    <i className={mail.isRead ? "fa-regular fa-envelope" : "fa-regular fa-envelope-open"}  
                    onClick={(ev) => {
                        ev.stopPropagation()
                        onMailClick(mail.id)
                    }}></i>
                    <i className="fa-regular fa-trash-can" onClick={(ev) => {
                        ev.stopPropagation()
                        onDeleteMail(mail.id)
                    }}></i>
                </div>
            </div>


        </div>
    )
}
