import { storageService } from '../services/async-storage.service.js'
import { utilService } from '../services/utile.service.js'

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
            createdAt: Date.now(),
            subject: 'Miss you!',
            body: 'Would love to catch up sometimes',
            isRead: false,
            sentAt: Date.now(),
            removedAt: null,
            from: 'momo@momo.com',
            to: 'user@appsus.com'
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
