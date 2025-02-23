export function MailPreview({ mail }) {
    return (
        <article className={`mail-preview ${mail.isRead ? 'read' : 'unread'}`}>
            <h3> {mail.subject.length > 50 ? mail.subject.substring(0, 50) + '...' : mail.subject}</h3>
            <p>{mail.body.substring(0, 100)}...</p>
        </article>
    )
}