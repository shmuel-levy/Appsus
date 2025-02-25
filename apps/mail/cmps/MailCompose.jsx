const { useState } = React
import { mailService } from "../services/mail.service.js"
import { utilService } from "../../../services/util.service.js"

export function MailCompose({ onClose, onMailSent }) {
    const [mail, setMail] = useState({ to: '', subject: '', body: '' })

    function handleChange({ target }) {
        const { name, value } = target
        setMail(prevMail => ({ ...prevMail, [name]: value }))
    }

    function onSendMail(ev) {
        ev.preventDefault()
        const newMail = {
            ...mail,
            id: utilService.makeId(),
            from: 'user@appus.com',
            createdAt: Date.now(),
            isRead: false,
            sentAt: Date.now(),
            removedAt: null,
            folder: 'sent'
        }
        

        mailService.save(newMail).then(() => {
            
            onMailSent()
            onClose()
        })
    }

    return (
        <section className='mail-compose'>
            <div className='compose-header'>
                <span>New Message</span>
                <button className='close-btn' onClick={onClose}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>
            <form onSubmit={onSendMail}>
                <input type='email' name='to' placeholder='To' value={mail.to} onChange={handleChange} required />
                <input type='text' name='subject' placeholder='Subject' value={mail.subject} onChange={handleChange} required />
                <textarea name='body' value={mail.body} onChange={handleChange} required />
                <div className='compose-footer'>
                    <button type='submit' className='send-btn'>Send</button>
                </div>
            </form>
        </section>
    )
}