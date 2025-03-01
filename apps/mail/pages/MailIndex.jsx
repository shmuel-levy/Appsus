
const { useState, useEffect } = React
const { Outlet, Link, useLocation, useNavigate, useSearchParams } = ReactRouterDOM
import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"

export function MailIndex() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [filterBy, setFilterBy] = useState({ text: '', filter: 'all', folder: 'inbox' })
    useEffect(() => {
        const updatedFolder = searchParams.get('folder') || 'inbox'
        setFilterBy(prev => ({ ...prev, folder: updatedFolder })) 
    }, [searchParams])
    
    const folder = filterBy.folder
    

    const [mails, setMails] = useState([])
    const [isComposing, setIsComposing] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [selectedMails, setSelectedMails] = useState([])
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        loadMails()
    }, [filterBy])

    useEffect(() => {
        updateUnreadCount()
    }, [mails])

    useEffect(() => {
        function handleMailUpdate() {
            loadMails()
        }
        window.addEventListener('mail-updated', handleMailUpdate)
        window.addEventListener('mail-reload', handleMailUpdate)

        return () => {
            window.removeEventListener('mail-updated', handleMailUpdate)
            window.removeEventListener('mail-reload', handleMailUpdate)
        }
    }, [])

    function loadMails() {
        mailService.query().then(allMails => {
            let filteredMails = allMails.filter(mail =>
                mail.subject.toLowerCase().includes(filterBy.text.toLowerCase())
            )

            if (filterBy.filter === 'read') {
                filteredMails = filteredMails.filter(mail => mail.isRead)
            } else if (filterBy.filter === 'unread') {
                filteredMails = filteredMails.filter(mail => !mail.isRead)
            } else if (filterBy.filter === 'starred') {
                filteredMails = filteredMails.filter(mail => mail.isStarred)
            }

            if (filterBy.folder === 'starred') {
                filteredMails = allMails.filter(mail => mail.isStarred)
            } else if (filterBy.folder !== 'all') {
                filteredMails = filteredMails.filter(mail => mail.folder === filterBy.folder)
            }

            setMails(filteredMails)
        })
    }

    function updateUnreadCount() {
        const count = mails.filter(mail => !mail.isRead).length
        setUnreadCount(count)
    }

    function toggleStar(mailId) {
        mailService.get(mailId).then(mail => {
            mail.isStarred = !mail.isStarred
            mailService.save(mail).then(loadMails)
        })
    }

    function toggleSelect(mailId) {
        setSelectedMails(prevSelected =>
            prevSelected.includes(mailId)
                ? prevSelected.filter(id => id !== mailId)
                : [...prevSelected, mailId]
        )
    }


    function onSetFolder(newFolder) {
        setSearchParams({ folder: newFolder }) 
        setFilterBy(prev => ({ ...prev, folder: newFolder, filter: 'all' }))
    }

    function onSetFilter(filter) {
        setFilterBy(prev => ({ ...prev, ...filter }))
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
                <MailFolderList onSetFolder={onSetFolder} activeFolder={folder} unreadCount={unreadCount} />
            </aside>
            <div className="mail-content">
                <div className="mail-filter-container">
                    <MailFilter onSetFilter={onSetFilter} />
                    <select name='filter' onChange={(ev) => setFilterBy(prev => ({ ...prev, filter: ev.target.value }))}>
                        <option value='all'>All</option>
                        <option value='read'>Read</option>
                        <option value='unread'>Unread</option>
                        <option value='starred'>Starred</option>
                    </select>
                </div>
                <div style={{ display: location.pathname.includes('/mail/') ? 'none' : 'block' }}>
                    <MailList mails={mails} onMailClick={markAsRead} onToggleStar={toggleStar} onToggleSelect={toggleSelect} selectedMails={selectedMails} />
                </div>
                {isComposing && <MailCompose onClose={() => setIsComposing(false)} onMailSent={handleMailSent} />}
                <Outlet />
            </div>
        </section>
    )
}
