const { useState, useEffect } = React
import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"
import { MailFolderList } from "../cmps/MailFolderList.jsx"

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState({ text: '', isRead: 'all', folder: 'inbox' })

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

    return (
        <section className="container">
            <MailFilter onSetFilter={onSetFilter} />
            <MailFolderList onSetFolder={onSetFolder} />
            <MailList mails={mails} />
        </section>
    )
}

