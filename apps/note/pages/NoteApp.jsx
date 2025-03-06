const { Outlet } = ReactRouterDOM
const { useState } = React
import { NoteSidebar } from "../cmps/sidebar-components/NoteSidebar.jsx"
import { NoteFilter } from "../cmps/sidebar-components/NoteFilter.jsx"
import { KeepLogo } from "../cmps/sidebar-components/KeepLogo.jsx"

export function NoteApp() {
  const [filterBy, setFilterBy] = useState({ txt: "", type: "" })

  function onSetFilter(newFilterBy) {
    setFilterBy((prevFilterBy) => ({ ...prevFilterBy, ...newFilterBy }))
    return { filterBy }
  }

  const toggleSidebar = () => {
    const sidebar = document.querySelector(".note-sidebar")
    const content = document.querySelector(".note-app-content")

    if (sidebar) {
      sidebar.classList.toggle("expanded")

      if (content) {
        content.classList.toggle("sidebar-expanded")
      }
    }
  }

  return (
    <div className="note-app">
      <div className="note-sub-header">
        <button
          className="menu-toggle"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path>
          </svg>
        </button>

        <KeepLogo />

        <div className="note-filter-header">
          <NoteFilter onSetFilter={onSetFilter} />
        </div>
      </div>

      <NoteSidebar />

      <main className="note-app-content">
        <Outlet context={[filterBy, onSetFilter]} />
      </main>
    </div>
  )
}
