import { MailPreview } from '../cmps/MailPreview.jsx'

export function MailList({ mails, onMailClick, onToggleStar, onToggleSelect, onDeleteMail, onEditDraft, onSaveAsNote, selectedMails = [] }) {
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
                        onSaveAsNote={onSaveAsNote}
                        selectedMails={selectedMails}
                        onEditDraft={onEditDraft}
                    />
                ))}
            </ul>
        </section>
    )
}
