const { Link } = ReactRouterDOM

export function MailPreview({ mail }) {
    return (
        <Link to={`/mail/${mail.id}`} className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}>
            <h3 className={mail.isRead ? '' : 'bold'}> {mail.subject.length > 50 ? mail.subject.substring(0, 50) + '...' : mail.subject}</h3>
            <p>{mail.body.substring(0, 100)}...</p>
        </Link>
    )
}