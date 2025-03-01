import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails, onMailClick, onToggleStar, onToggleSelect, selectedMails = [] }) {
    return (
        <section className='mail-list'>
            <ul>
                {mails.map(mail => (
                    <MailPreview 
                        key={mail.id} 
                        mail={mail} 
                        onMailClick={onMailClick} 
                        onToggleStar={onToggleStar} 
                        onToggleSelect={onToggleSelect} 
                        selectedMails={selectedMails}
                    />
                ))}
            </ul>
        </section>
    )
}
