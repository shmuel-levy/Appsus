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
                mail.isRead = true
                mailService.save(mail)
            }
            setMail(mail)
        })
    }, [mailId])

    function onDeleteMail() {
        mailService.get(mailId).then(mail => {
            if (!mail) {
                console.warn('Mail not found, probably already deleted.');
                navigate('/mail'); // Redirect to mail list
                return;
            }
    
            if (mail.folder === 'trash') {
                mailService.remove(mailId).then(() => {
                    window.dispatchEvent(new Event('mail-updated')); // Notify MailIndex to refresh
                    navigate('/mail');
                }).catch(err => {
                    console.error('Failed to delete mail:', err);
                    navigate('/mail'); // Ensure navigation even if deletion fails
                });
            } else {
                mail.folder = 'trash';
                mailService.save(mail).then(() => {
                    window.dispatchEvent(new Event('mail-updated')); // Notify MailIndex to refresh
                    navigate('/mail');
                }).catch(err => {
                    console.error('Failed to move mail to trash:', err);
                });
            }
        }).catch(err => {
            console.error('Error retrieving mail:', err);
            navigate('/mail'); // Navigate back even if mail retrieval fails
        });
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
            <h2>{mail.from}</h2>
            <h3>{mail.subject}</h3>
            <p><strong>From:</strong> {mail.from}</p>
            <p><strong>To:</strong> {mail.to}</p>
            <p>{mail.body}</p>
        </section>
    )
}
