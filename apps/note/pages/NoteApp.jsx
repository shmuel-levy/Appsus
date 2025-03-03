const { Outlet } = ReactRouterDOM

import { NoteSidebar } from '../cmps/sidebar-components/NoteSidebar.jsx'

export function NoteApp() {
    return (
        <div className="note-app">
            <NoteSidebar />
            <main className="note-app-content">
                <Outlet />
            </main>
        </div>
    )
}