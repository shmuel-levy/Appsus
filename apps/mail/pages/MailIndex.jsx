const { useState, useEffect } = React
import { mailService } from "../services/mail.service.js"
import { MailList } from "../cmps/MailList.jsx"
import { MailFilter } from "../cmps/MailFilter.jsx"

export function MailIndex() {
    const [mails, setMails] = useState([])
    const [filterBy, setFilterBy] = useState({ text: '', isRead: 'all' })

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
            setMails(filteredMails)
        })
    }

    function onSetFilter(filter) {
        setFilterBy(filter)
    }

    return (
        <section className="container">
         <MailFilter onSetFilter={onSetFilter}/>
         <MailList mails={mails}/>
        </section>)
}

