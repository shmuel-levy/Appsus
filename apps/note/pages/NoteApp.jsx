const { Outlet } = ReactRouterDOM
// Fix the import path to match your actual file structure
// If you created it in the suggested location, it should be:
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