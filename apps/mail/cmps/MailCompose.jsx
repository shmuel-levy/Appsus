const { useState, useEffect } = React
const { useNavigate, useLocation } = ReactRouterDOM
import { mailService } from "../services/mail.service.js"
import { utilService } from "../../../services/util.service.js"

export function MailCompose({ onClose, onMailSent , draft}) {

    const { search } = useLocation()
    const navigate = useNavigate()
    const searchParams = new URLSearchParams(search)
    const draftId = searchParams.get('draftId') 


    const [mail, setMail] = useState(draft || {
        id: null,
        to: '',
        subject: '',
        body: '',
        folder: 'drafts'
    })

    useEffect(() => {
        if (draft) {
            setMail(draft) 
        }
    }, [draft])

    useEffect(() => {
        if (draftId) {
            mailService.get(draftId).then(setMail) 
        }
    }, [draftId])

    
    useEffect(() => {
        const saveDraftInterval = setInterval(() => {
            if (mail.to || mail.subject || mail.body) {
                const draft = { 
                    ...mail, 
                    folder: "drafts",
                    from: "user@appsus.com", 
                    createdAt: new Date(),
                }
    
                mailService.save(draft).then(savedDraft => {
                    console.log("Draft Saved:", savedDraft) 
                    setMail(prevMail => ({ ...prevMail, id: savedDraft.id }))
                })
            }
        }, 5000)
    
        return () => clearInterval(saveDraftInterval)
    }, [mail.to, mail.subject, mail.body])

    

    function handleChange({ target }) {
        const { name, value } = target
        setMail(prevMail => ({ ...prevMail, [name]: value }))
    }

    function onSendMail(ev) {
        ev.preventDefault()

        if (!mail.id) {
            mail.id = utilService.makeId();
        }
    
        const newMail = {
            ...mail,
            id: utilService.makeId(),
            from: 'user@appus.com',
            createdAt: mail.createdAt || Date.now(),
            isRead: false,
            sentAt: Date.now(),
            removedAt: null,
            folder: 'sent'
        }


        mailService.save(newMail).then(() => {
            if (mail.folder === "drafts") {
                mailService.remove(mail.id).then(() => {
                    console.log("Draft Removed:", mail.id) 
                    if (typeof onMailSent === "function") onMailSent()
                    if (typeof onClose === "function") onClose()
                    navigate("/mail?folder=sent")
                })
            } else {
                if (typeof onMailSent === "function") onMailSent()
                if (typeof onClose === "function") onClose()
                navigate("/mail?folder=sent")
            }
        }).catch(err => {
            console.error("❌ Error Saving Sent Mail:", err)
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