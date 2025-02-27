const { Link } = ReactRouterDOM

export function MailPreview({ mail }) {
    return (
        <Link to={`/mail/${mail.id}`} className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}>
            <h3 className={mail.isRead ? '' : 'bold'}> {mail.from.length > 50 ? mail.from.substring(0, 50) + '...' : mail.from}</h3>
            <p>{mail.body.substring(0, 100)}...</p>
        </Link>
    )
}