// const { useState } = React

export function MailFilter({ onSetFilter }) {

    function handleChange({ target }) {
        const { name, value } = target
            onSetFilter({ [name]: value })   
    }

    return (
        <section className='mail-filter'>
         <i className="fa-solid fa-magnifying-glass"></i>
            <input
                type='text'
                name='text'
                placeholder='Search mail'
                onChange={handleChange}
            />
        </section>
    )
}