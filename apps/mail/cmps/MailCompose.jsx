const { useState } = React
import { mailService } from "../services/mail.service.js"

export function MailCompose({ onClose }) {
    const [mail, setMail] = useState({ to: '', subject: '', body: '' })

    function handleChange({ target }) {
        const { name, value } = target
        setMail(prevMail => ({ ...prevMail, [name]: value }))
    }

    function onSendMail(ev) {
        ev.preventDefualt()
        const newMail = {
            ...mail,
            id: mailService.createId(),
            from: 'user@appus.com',
            createdAt: Date.now(),
            isRead: false,
            sentAt: Date.now(),
            removedAt: null,
            folder: 'sent'
        }
        mailService.save(newMail).then(onClose)
    }

    return (
        <section className='mail-compose'>
            <div className='compose-header'>
                <h3>New Message</h3>
                <button className='close-btn' onClick={onClose}>&times;</button>
            </div>
            <form onSubmit={onSendMail}>
                <input type='email' name='to' placeholder='To' value={mail.to} onChange={handleChange} required />
                <input type='text' name='subject' placeholder='Subject' value={mail.subject} onChange={handleChange} required />
                <textarea name='body' placeholder='Message' value={mail.body} onChange={handleChange} required />
                <button type='submit'>Send</button>
            </form>
        </section>
    )
}