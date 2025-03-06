const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { AppHeader } from "./cmps/AppHeader.jsx"
import { UserMsg } from "./cmps/UserMsg.jsx"
import { About } from "./pages/About.jsx"
import { Home } from "./pages/Home.jsx"

import { MailIndex } from "./apps/mail/pages/MailIndex.jsx"
import { MailDetails } from "./apps/mail/pages/MailDetails.jsx"
import { MailCompose } from "./apps/mail/cmps/MailCompose.jsx"

import { NoteApp } from "./apps/note/pages/NoteApp.jsx"
import { NoteIndex } from "./apps/note/pages/NoteIndex.jsx"
import { NoteEdit } from "./apps/note/pages/NoteEdit.jsx"

export function RootCmp() {
  return (
    <Router>
      <section className="root-cmp">
        <AppHeader />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />

          <Route path="/mail" element={<MailIndex />}>
            <Route path="/mail/:mailId" element={<MailDetails />} />
          </Route>
          <Route path="/mail/compose" element={<MailCompose />} />

          <Route path="/note" element={<NoteApp />}>
            <Route index element={<NoteIndex />} />
            <Route path=":noteId" element={<NoteEdit />} />
            <Route
              path="reminders"
              element={<div className="coming-soon"> </div>}
            />
            <Route path="archive" element={<NoteIndex isArchive={true} />} />
            <Route path="trash" element={<NoteIndex isTrash={true} />} />
          </Route>
        </Routes>
        <UserMsg />
      </section>
    </Router>
  )
}
