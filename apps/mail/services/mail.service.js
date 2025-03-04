import { storageService } from '../../../services/async-storage.service.js'
import { utilService } from '../../../services/util.service.js'

const MAIL_KEY = 'mails'

export const loggedinUser = {
    email: 'user@appsus.com',
    fullname: 'Mahatma Appsus'
}

export const mailService = {
    query,
    get,
    save,
    remove,
}

function _createMails() {
    var mails = utilService.loadFromStorage(MAIL_KEY)
    if (!mails || !mails.length) {

        mails = [{
            id: 'e101',
            createdAt: Date.now() - 100000,
            subject: 'Welcome to Mail App!',
            body: 'Hope you enjoy using our mail service.',
            isRead: false,
            sentAt: Date.now() - 90000,
            removedAt: null,
            from: 'support@mailapp.com',
            to: 'user@appsus.com',
            folder: 'inbox'

        },
        {
            id: 'e102',
            createdAt: Date.now() - 500000,
            subject: 'Meeting Reminder',
            body: 'Don’t forget our meeting tomorrow at 10 AM.',
            isRead: true,
            sentAt: Date.now() - 450000,
            removedAt: null,
            from: 'boss@company.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e103',
            createdAt: Date.now() - 1500000,
            subject: 'Your Amazon Order',
            body: 'Your order #12345 has been shipped.',
            isRead: false,
            sentAt: Date.now() - 1400000,
            removedAt: null,
            from: 'orders@amazon.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e104',
            createdAt: Date.now() - 2500000,
            subject: 'Weekend Plans?',
            body: 'Hey, are we still on for the weekend trip?',
            isRead: true,
            sentAt: Date.now() - 2400000,
            removedAt: null,
            from: 'friend@mail.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e105',
            createdAt: Date.now() - 3000000,
            subject: 'Draft Email',
            body: 'This is an unfinished draft email.',
            isRead: false,
            sentAt: null,
            removedAt: null,
            from: 'user@appsus.com',
            to: '',
            folder: 'inbox'
        },
        {
            id: 'e106',
            createdAt: Date.now() - 4000000,
            subject: 'Flight Confirmation',
            body: 'Your flight booking #67890 is confirmed.',
            isRead: false,
            sentAt: Date.now() - 3900000,
            removedAt: null,
            from: 'notifications@airline.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e107',
            createdAt: Date.now() - 5000000,
            subject: 'Subscription Renewal',
            body: 'Your subscription has been renewed successfully.',
            isRead: false,
            sentAt: Date.now() - 4900000,
            removedAt: null,
            from: 'billing@streaming.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e108',
            createdAt: Date.now() - 6000000,
            subject: 'Your Invoice',
            body: 'Attached is your invoice for the last billing period.',
            isRead: true,
            sentAt: Date.now() - 5900000,
            removedAt: null,
            from: 'finance@company.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e109',
            createdAt: Date.now() - 7000000,
            subject: 'Thanks for Visiting!',
            body: 'We hope you enjoyed your stay at our hotel.',
            isRead: false,
            sentAt: Date.now() - 6900000,
            removedAt: null,
            from: 'support@hotel.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e110',
            createdAt: Date.now() - 8000000,
            subject: 'New Job Opportunity',
            body: 'We have a new job opening that matches your profile.',
            isRead: false,
            sentAt: Date.now() - 7900000,
            removedAt: null,
            from: 'jobs@company.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e111',
            createdAt: Date.now() - 9000000,
            subject: 'Happy Birthday!',
            body: 'Wishing you a fantastic birthday and a great year ahead.',
            isRead: true,
            sentAt: Date.now() - 8900000,
            removedAt: null,
            from: 'friend@mail.com',
            to: 'user@appsus.com',
            folder: 'inbox'
        },
        {
            id: 'e112',
            createdAt: Date.now() - 10000000,
            subject: 'Sent: Project Report',
            body: 'Here is the final version of the project report.',
            isRead: true,
            sentAt: Date.now() - 9900000,
            removedAt: null,
            from: 'user@appsus.com',
            to: 'manager@company.com',
            folder: 'sent'
        }
        ]
        utilService.saveToStorage(MAIL_KEY, mails)
    }
}

function query(filterBy = '') {
    _createMails()
    return storageService.query(MAIL_KEY).then(mails =>
        mails.filter(mail => mail.subject.toLowerCase().includes(filterBy.toLowerCase()))
    )
}

function get(mailId) {
    return storageService.get(MAIL_KEY, mailId)
}

function save(mail) {
    return query().then(mails => {
        let updatedMails = [...mails]

        if (!mail.id) {
            mail.id = utilService.makeId() // Generate ID if missing
        }

        if (!mail.from) {
            mail.from = "user@appsus.com" // Ensure drafts get a sender
        }

        const existingMailIdx = updatedMails.findIndex(m => m.id === mail.id)

        if (existingMailIdx !== -1) {
            updatedMails[existingMailIdx] = mail // Update draft
        } else {
            updatedMails.push(mail) // Add new mail
        }

        localStorage.setItem(MAIL_KEY, JSON.stringify(updatedMails))
        return mail
    })
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}
