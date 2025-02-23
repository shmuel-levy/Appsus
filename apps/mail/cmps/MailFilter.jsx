const { useState } = React

export function MailFilter({ onSetFilter }) {
    const [filterBy, SetFilterBy] = useState({ text: '', isRead: 'all' })

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'checkbox' ? target.checked : target.value
        SetFilterBy(prevFilter => {
            const newFilter = { ...prevFilter, [field]: value }
            onSetFilter(newFilter)
            return newFilter
        })
    }

    return (
        <section className='mail-filter'>
            <input
                type='text'
                name='text'
                placeholder='Search mail...'
                value={filterBy.text}
                onChange={handleChange}
            />
            <select name='isRead' value={filterBy.isRead} onChange={handleChange}>
                <option value='all'>All</option>
                <option value='read'>Read</option>
                <option value='unread'>Unread</option>
            </select>
        </section>
    )
}