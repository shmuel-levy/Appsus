const { Link } = ReactRouterDOM

export function MailPreview({ mail, onMailClick, onToggleStar, onToggleSelect, selectedMails = [] }) {
    return (
        <div className={`mail-preview ${mail.isRead ? 'read' : 'unread'} ${selectedMails.includes(mail.id) ? 'selected' : ''}`}>
            <input
                type='checkbox'
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
            <Link to={`/mail/${mail.id}`} onClick={() => onMailClick(mail.id)}>
                <h3 className={mail.isRead ? '' : 'bold'}>
                    {mail.from.length > 50 ? mail.from.substring(0, 50) : mail.from}
                </h3>
                <p className={mail.isRead ? '' : 'bold'}>
                    {mail.subject.length > 20 ? mail.subject.substring(0, 20) + ' - ...' : mail.subject + ' - ...'}
                </p>
                <p>{mail.body}</p>
            </Link>
        </div>
    );
}
