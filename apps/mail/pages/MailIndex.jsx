
const { useState, useEffect } = React
const { Outlet, Link, useLocation, useNavigate, useSearchParams } = ReactRouterDOM
import { mailService } from "../services/mail.service.js"
import { noteService } from "../../note/services/note.service.js";
import { utilService } from "../../../services/util.service.js";
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"
import { MailCompose } from "../cmps/MailCompose.jsx"
import { showSuccessMsg, showErrorMsg } from "../../../services/event-bus.service.js";



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
    const [editingDraft, setEditingDraft] = useState(null)
    const [unreadCount, setUnreadCount] = useState(0)
    const [selectedMails, setSelectedMails] = useState([])
    const [sortBy, setSortBy] = useState('date')
    const navigate = useNavigate()

    const location = useLocation()

    useEffect(() => {
        loadMails()
    }, [filterBy, sortBy])

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
            let filteredMails = allMails.filter(mail => mail.folder === folder)

            if (filterBy.folder === 'drafts') {
                filteredMails = allMails.filter(mail => mail.folder === 'drafts')
            } else if (filterBy.folder === 'sent') {
                filteredMails = allMails.filter(mail => mail.folder === 'sent')
            } else if (filterBy.folder === 'starred') {
                filteredMails = allMails.filter(mail => mail.isStarred)
            }
            
            
            if (filterBy.filter === 'read') {
                filteredMails = filteredMails.filter(mail => mail.isRead)
            } else if (filterBy.filter === 'unread') {
                filteredMails = filteredMails.filter(mail => !mail.isRead)
            } else if (filterBy.filter === 'starred') {
                filteredMails = filteredMails.filter(mail => mail.isStarred)
            }

            if (filterBy.from) {
                filteredMails = filteredMails.filter(mail =>
                    mail.from.toLowerCase().includes(filterBy.from.toLowerCase())
                )
            }

            if (filterBy.subject) {
                filteredMails = filteredMails.filter(mail =>
                    mail.subject.toLowerCase().includes(filterBy.subject.toLowerCase())
                )
            }

            if (filterBy.date) {
                const selectedDate = new Date(filterBy.date).setHours(0, 0, 0, 0)
                filteredMails = filteredMails.filter(mail => {
                    const mailDate = new Date(mail.sentAt).setHours(0, 0, 0, 0)
                    return mailDate === selectedDate
                })
            }

            if (filterBy.hasWords) {
                filteredMails = filteredMails.filter(mail =>
                    mail.body.toLowerCase().includes(filterBy.hasWords.toLowerCase())
                )
            }

            setMails(filteredMails)
        })
    }

    function updateUnreadCount() {
        mailService.query().then(allMails => {
            const count = allMails.filter(mail => !mail.isRead && mail.folder === "inbox").length
            setUnreadCount(count)
        })
    }

    function toggleStar(mailId) {
        setMails(prevMails => prevMails.map(mail =>
            mail.id === mailId ? { ...mail, isStarred: !mail.isStarred } : mail
        ))

        mailService.get(mailId).then(mail => {
            mail.isStarred = !mail.isStarred
            mailService.save(mail).then(() => {
                window.dispatchEvent(new Event('mail-updated'))
            })
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
        setMails(prevMails =>
            prevMails.map(mail =>
                mail.id === mailId ? { ...mail, isRead: !mail.isRead } : mail
            )
        );
        mailService.get(mailId).then(mail => {
            mail.isRead = !mail.isRead;
            mailService.save(mail)
                .then(() => showSuccessMsg(`Conversation marked as ${mail.isRead ? "read." : "unread."}`))
                .catch(() => showErrorMsg("Failed to update mail status"));
        });
    }

    function onDeleteMail(mailId) {


        mailService.get(mailId).then(mail => {
            if (mail.folder === 'trash') {
                mailService.remove(mailId).then(() => {
                    showSuccessMsg("Conversation deleted forever.");
                    setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
                })
            } else {
                mail.folder = 'trash'
                mailService.save(mail).then(() => {
                    showSuccessMsg("Conversation moved to Trash.");
                    setMails(prevMails => prevMails.filter(mail => mail.id !== mailId))
                })
            }
        })

        console.log(mails)
    }

    function onMailSent() {
        loadMails()
    }

    function onEditDraft(draftId) {
        mailService.get(draftId).then(draft => {
            setEditingDraft(draft)
            setIsComposing(true)
        })
    }

    function onSaveAsNote(mail) {
        const newNote = {
            id: utilService.makeId(),  // ✅ Generate unique ID
            createdAt: Date.now(),
            type: "NoteTxt",
            isPinned: false,
            inTrash: false,
            style: { backgroundColor: "#fff" },
            info: {
                title: mail.subject || "New Note",
                txt: mail.body || "",
            },
        };

        noteService.save(newNote)
            .then(savedNote => {
                showSuccessMsg("Note saved successfully");
                navigate(`/note/${savedNote.id}`);  // ✅ Redirect to KeepApp
            })
            .catch(err => console.error("❌ Failed to save note:", err));
    }

    return (
        <section className="mail-index">
            <aside className="mail-sidebar">
                <div className='mail-sidebar-logo'>
                    <div>
                        <span><i className="fa-solid fa-bars"></i></span>
                    </div>
                    <img className='gmail-logo' src="./assets/img/logo-gmail.png"></img>
                </div>
                <button className="compose-btn" onClick={() => setIsComposing(true)}>
                    <img src="./assets/img/compose.png"></img> Compose
                </button>
                <MailFolderList onSetFolder={onSetFolder} activeFolder={folder} unreadCount={unreadCount} />
            </aside>
            <div className="mail-content">
                <MailFilter onSetFilter={onSetFilter} />
                <div className="mail-filter-container">
                    {/* <MailFilter onSetFilter={onSetFilter} /> */}
                    <select name='filter' onChange={(ev) => setFilterBy(prev => ({ ...prev, filter: ev.target.value }))}>
                        <option value='all'>All</option>
                        <option value='read'>Read</option>
                        <option value='unread'>Unread</option>
                        <option value='starred'>Starred</option>
                    </select>
                    <select value={sortBy} onChange={(ev) => setSortBy(ev.target.value)}>
                        <option value="date">Date</option>
                        <option value="title">Title</option>
                    </select>
                </div>
                <div className='mail-filter-inside' style={{ display: location.pathname.includes('/mail/') ? 'none' : 'block' }}>
                    <MailList mails={mails} onEditDraft={onEditDraft} onMailClick={markAsRead} onToggleStar={toggleStar} onToggleSelect={toggleSelect} onDeleteMail={onDeleteMail} onSaveAsNote={onSaveAsNote} selectedMails={selectedMails} />
                </div>
                {isComposing && <MailCompose onClose={() => setIsComposing(false)} onMailSent={onMailSent} draft={editingDraft} />}
                <Outlet />
            </div>
        </section>
    )
}
