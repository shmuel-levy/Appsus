const { useState } = React

export function MailFilter({ onSetFilter }) {
    const [filterBy, setFilterBy] = useState({ text: '', from: '', subject: '', date: '', hasWords: '' })
    const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
    

    function handleChange({ target }) {
        const field = target.name
        const value = target.value
        setFilterBy(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function applyFilter() {
        onSetFilter(filterBy)
        setIsAdvancedOpen(false) 
    }

    return (

        <form className='mail-filter'>
            <div className='input-icon'>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type='text' name='text' placeholder='Search mail' className='input-field' onChange={handleChange} />
                <div className='filter-icon'><i className="fa-solid fa-list-ul" onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}></i></div>
            </div>
            {isAdvancedOpen && (
                <div className="advanced-filter">
                    <div>
                        <span className='span-label'><label>From</label></span>
                        <span className='span-input'><input type="text" name="from" value={filterBy.from} onChange={handleChange} /></span>
                    </div>

                    <div>
                        <span className='span-label'><label>Subject</label></span>
                        <span className='span-input'><input type="text" name="subject" value={filterBy.subject} onChange={handleChange} /></span>
                    </div>

                    <div>
                        <span className='span-label'><label>Date</label></span>
                        <span className='span-input'><input type="date" name="date" value={filterBy.date} onChange={handleChange} /></span>
                    </div>

                    <div>
                        <span className='span-label'><label>Has the words</label></span>
                        <span className='span-input'><input type="text" name="hasWords" value={filterBy.hasWords} onChange={handleChange} /></span>
                    </div>

                    <div>
                        <div className='search-button'><button onClick={applyFilter}>Search</button></div>
                    </div>
                </div>
            )}
        </form>
    )
}