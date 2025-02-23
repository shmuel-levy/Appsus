import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails }) {
    return (
        <section className='mail-list'>
            <ul>
                {mails.map(mail => (
                    <li key={mail.id}>
                        <MailPreview mail={mail} />
                    </li>
                ))}
            </ul>
        </section>
    )
}
