const { useEffect, useState } = React
const { useParams, useNavigate } = ReactRouter

import { mailService } from "../services/mail.service.js"

export function MailDetails() {
    const { mailId } = useParams()
    const navigate = useNavigate()
    const [mail, setMail] = useState(null)

    useEffect(() => {
        mailService.get(mailId).then(mail => {
            if (!mail.isRead) {
                mail.Read = true
                mailService.save(mail)
            }
            setMail(mail)
        })
    }, [mailId])

    function onDeleteMail() {
        mailService.get(mailId).then(mail => {
            if (mail.folder === 'trash') {
                mailService.remove(mailId).then(() => navigate('/mail'))
            } else {
                mail.folder = 'trash'
                mailService.save(mail).then(() => navigate('/mail'))
            }
        })

    }

    if (!mail) return <p>Loading...</p>

    return (
        <section className='mail-details'>
            <button className='tooltip-btn back-btn' onClick={() => navigate('/mail')} >
                <i className='fas fa-arrow-left'></i>
                <span className='tooltip-text'>Back to Inbox</span>
            </button>
            <button className='tooltip-btn delete-btn' onClick={onDeleteMail} >
                <i className='fa-regular fa-trash-can'></i>
                <span className='tooltip-text'>Delete</span>
            </button>
            <h2>{mail.subject}</h2>
            <p><strong>From:</strong> {mail.from}</p>
            <p><strong>To:</strong> {mail.to}</p>
            <p>{mail.body}</p>
        </section>
    )
}
