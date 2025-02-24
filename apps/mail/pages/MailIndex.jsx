const { useState, useEffect } = React
const { Outlet, Link } = ReactRouterDOM
import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState({ text: '', isRead: 'all', folder: 'inbox' })
    const [isComposing, setIsComposing] = useState(false)

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query().then(allMails => {
            var filteredMails = allMails.filter(mail =>
                mail.subject.toLowerCase().includes(filterBy.text.toLowerCase())
            )

            if (filterBy.isRead !== 'all') {
                const isRead = filterBy === 'read'
                filteredMails = filteredMails.filter(mail => mail.isRead === isRead)
            }

            if (filterBy.folder) {
                filteredMails = filteredMails.filter(mail => mail.folder === filterBy.folder)
            }
            setMails(filteredMails)
        })
    }

    function onSetFilter(filter) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filter }))
    }

    function onSetFolder(folder) {
        setFilterBy(prevFilter => ({ ...prevFilter, folder }))
    }

    function markAsRead(mailId) {
        mailService.get(mailId).then(mail => {
            if (!mail.isRead) {
                mail.isRead = true
                mailService.save(mail).then(loadMails)
            }
        })

    }

    return (
        <section className="main-index">
            <div className='mail-header'>
                <MailFilter onSetFilter={onSetFilter} />
                <button className='compose-btn' onClick={() => setIsComposing(true)}>
                    <i className='fas fa-pencil-alt'></i>Compose
                </button>
            </div>
            <MailFolderList onSetFolder={onSetFolder} />
            <MailList mails={mails} onMailClick={markAsRead} />
            {isComposing && <MailCompose onClose={() => setIsComposing(false)} />}
            <Outlet />
        </section>
    )
}

