const { useState, useEffect } = React
const { Outlet, Link, useLocation } = ReactRouterDOM
import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState({ text: '', isRead: 'all', folder: 'inbox' })
    const [isComposing, setIsComposing] = useState(false)
    const [activeFolder, setActiveFolder] = useState('inbox')
    const location = useLocation()

    useEffect(() => {
        loadMails()
    }, [filterBy])

    function loadMails() {
        mailService.query().then(allMails => {
            var filteredMails = allMails.filter(mail =>
                mail.subject.toLowerCase().includes(filterBy.text.toLowerCase())
            )

            if (filterBy.isRead !== 'all') {
                const isRead = filterBy.isRead === 'read'
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
        setActiveFolder(folder)
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

    function handleMailSent() {
        loadMails()
    }

    return (
        <section className="mail-index">
            <aside className="mail-sidebar">
                <button className="compose-btn" onClick={() => setIsComposing(true)}>
                    <i className="fas fa-pencil-alt"></i> Compose
                </button>
                <MailFolderList onSetFolder={onSetFolder} activeFolder={activeFolder} />
            </aside>
            <div className="mail-content">
                <MailFilter onSetFilter={onSetFilter} />
                <div className="mail-filter-container">
                    <div className='sort-container'>
                        <select name='isRead' onChange={(ev) => onSetFilter({ isRead: ev.target.value })}>
                            <option value='all'>All</option>
                            <option value='read'>Read</option>
                            <option value='unread'>Unread</option>
                        </select>
                    </div>
                    <div style={{ display: location.pathname.includes('/mail/') ? 'none' : 'block' }}>
                        <MailList mails={mails} onMailClick={markAsRead} />
                    </div>
                </div>
                {isComposing && <MailCompose onClose={() => setIsComposing(false)} onMailSent={handleMailSent} />}
                <Outlet />
            </div>
        </section>
    );
}

