// const { useState } = React

export function MailFilter({ onSetFilter }) {

    function handleChange({ target }) {
        const { name, value } = target
        onSetFilter({ [name]: value })
    }

    return (
        
        <form className='mail-filter'>
            <div className='input-icon'>
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type='text' name='text' placeholder='Search mail' className='input-field' onChange={handleChange} />
            </div>
        </form>
    )
}