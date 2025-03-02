import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails, onMailClick, onToggleStar, onToggleSelect, onDeleteMail, selectedMails = [] }) {
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
                        onDeleteMail={onDeleteMail}
                        selectedMails={selectedMails}
                    />
                ))}
            </ul>
        </section>
    )
}
