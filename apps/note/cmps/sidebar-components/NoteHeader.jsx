import { NoteFilter } from './NoteFilter.jsx'

export function NoteAppHeader({ onSetFilter }) {
    const toggleSidebar = () => {
        const sidebar = document.querySelector('.note-sidebar')
        const content = document.querySelector('.note-app-content')
        
        if (sidebar) {
            sidebar.classList.toggle('expanded')
            
            if (content) {
                content.classList.toggle('sidebar-expanded')
            }
        }
    }
    
    return (
        <header className="note-app-header">
            <button className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
                </svg>
            </button>
            
            <div className="keep-logo-header">
                <img src="assets/img/keep-logo.png" alt="Keep Logo" className="keep-logo-img" />
                <span className="keep-logo-text">Keep</span>
            </div>
            
            <div className="note-filter-header">
                <NoteFilter onSetFilter={onSetFilter} />
            </div>
        </header>
    )
}