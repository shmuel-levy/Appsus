import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails, onMailClick, onToggleStar, onToggleSelect, onDeleteMail, onEditDraft, selectedMails = [] }) {
    if (!mails.length) return <p>No mails to display</p>
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
                        onEditDraft={onEditDraft}
                    />
                ))}
            </ul>
        </section>
    )
}
