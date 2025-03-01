const { Link } = ReactRouterDOM

export function MailPreview({ mail }) {
    console.log(mail.isRead)
    return (
        <Link to={`/mail/${mail.id}`} className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}>
            <h3 className={mail.isRead ? '' : 'bold'}> {mail.from.length > 50 ? mail.from.substring(0, 50) : mail.from}</h3>
            <span className={mail.isRead ? '' : 'bold'}>{ mail.subject.length > 20 ? mail.subject.substring(0, 20) + ' - ...' : mail.subject + ' - ...'} </span>
            <p>{mail.body.substring(0, 100)}</p>
        </Link>
    )
}