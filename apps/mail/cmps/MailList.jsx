import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails, onMailClick }) {
    return (
        <section className='mail-list'>
            <ul>
                {mails.map(mail => (
                    <li key={mail.id} onClick={() => onMailClick(mail.id)}>
                        <MailPreview mail={mail} />
                    </li>
                ))}
            </ul>
        </section>
    )
}
