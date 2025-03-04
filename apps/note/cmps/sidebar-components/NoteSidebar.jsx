const { NavLink } = ReactRouterDOM
import { KeepLogo } from './KeepLogo.jsx'

export function NoteSidebar() {
    return (
        <aside className="note-sidebar">
            <KeepLogo />
            <div className="sidebar-content">
                <NavLink to="/note" className="sidebar-item" end>
                    <div className="sidebar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6A4.997 4.997 0 0 1 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"></path>
                        </svg>
                    </div>
                    <span className="sidebar-text">Notes</span>
                </NavLink>
                
                <NavLink to="/note/reminders" className="sidebar-item">
                    <div className="sidebar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M18 17v-6c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v6H4v2h16v-2h-2zm-2 0H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></path>
                        </svg>
                    </div>
                    <span className="sidebar-text">Reminders</span>
                </NavLink>
                
                <div className="sidebar-divider"></div>
                
                <NavLink to="/note/archive" className="sidebar-item">
                    <div className="sidebar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM6.24 5h11.52l.83 1H5.42l.82-1zM5 19V8h14v11H5zm11-5.5l-4 4-4-4 1.41-1.41L11 13.67V10h2v3.67l1.59-1.59L16 13.5z"></path>
                        </svg>
                    </div>
                    <span className="sidebar-text">Archive</span>
                </NavLink>
                
                <NavLink to="/note/trash" className="sidebar-item" end>
                    <div className="sidebar-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                            <path d="M15 4V3H9v1H4v2h1v13c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V6h1V4h-5zm2 15H7V6h10v13z"></path>
                            <path d="M9 8h2v9H9zm4 0h2v9h-2z"></path>
                        </svg>
                    </div>
                    <span className="sidebar-text">Trash</span>
                </NavLink>
            </div>
        </aside>
    )
}