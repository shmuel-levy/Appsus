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
        }]
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
    return mail.id ? storageService.put(MAIL_KEY, mail) : storageService.post(MAIL_KEY, mail)
}

function remove(mailId) {
    return storageService.remove(MAIL_KEY, mailId)
}
