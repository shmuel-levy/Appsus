🗂️ APPSUS – Google Apps Suite Clone
A comprehensive clone of Google’s productivity suite, built with React, featuring core functionality from Google Keep and Gmail. This project showcases advanced front-end development, state management, modular design, and cross-app integration.

Live Demo

✨ Pixel-perfect · Component-driven · Responsive design in progress

🔧 Applications Overview
📝 Notes – Google Keep Clone
Create, manage, and organize notes in multiple formats:
Text · Todo Lists · Images · YouTube Videos · Audio · Canvas

Main Features:

🗒️ Multiple Note Types:

Text notes
Todo lists with checkbox logic
Image notes
YouTube embedded video notes
Canvas drawings (in progress)
Audio notes (in progress)
🎨 Organization:

Pin, archive, trash notes
Color-coded notes
Filter by note type and text
✍️ Rich Editing:

In-place editing
Drawing tools for canvas
Todo management UI
📧 Mail – Gmail Clone
A fully-featured email client with folder structure, filters, and note integration.

Main Features:

📬 Email Management:

Compose new emails
View inbox, sent, drafts, and trash
Star important emails
Mark as read/unread
💾 Draft Auto-Save:

Auto-save every 5 seconds
Seamless resume of incomplete drafts
🔗 Note-to-Mail Integration:

Send notes as emails directly
Compose new mail from note content
🚀 Tech Stack
Area	Technologies / Tools
Frontend	React, React Router, JSX, CSS
State Mgmt	React Hooks (useState, useEffect, useRef)
Data Handling	LocalStorage (custom services for persistence)
UI/UX	Custom modal system, animations, transitions
Forms	Controlled components, validation, auto-save drafts
Note Types	Text, Todo, YouTube embeds, Image, Audio, Canvas
Styling	Component-scoped CSS
Integration	Notes ↔ Mail linkage (send note as email)
Deployment	GitHub Pages / local browser-based storage

📸 Screenshots

<img width="1828" height="1300" alt="Appsus home" src="https://github.com/user-attachments/assets/fa487e08-d466-4e44-8f93-b0c3cf1bc03c" />
 <img width="1828" height="1292" alt="Appsus about" src="https://github.com/user-attachments/assets/6f76d193-712f-4074-b50b-86ae5a10edf2" />
<img width="1811" height="1300" alt="Appsus gmail" src="https://github.com/user-attachments/assets/37a2ed3a-651e-4c8f-b052-75f4bc7f984f" />
<img width="1816" height="1289" alt="Appsus notes" src="https://github.com/user-attachments/assets/289f662f-d42a-4e4b-81a7-93f3246eaa95" />


🧩 Key Functionality
Notes App
✅ Create/Edit/Delete notes in various formats
📌 Pin/archive/trash features
🎨 Color-coding and filtering
📝 Rich editing + canvas drawing
📹 YouTube and audio embedding
Mail App
📧 Compose and manage emails
📂 Folders: inbox, sent, drafts, starred, trash
⏳ Auto-save drafts every 5 seconds
📎 Send notes as emails
Cross-App Integration
🔁 Compose mail directly from note content
🔗 Rich link between Keep & Gmail experiences
🛠️ Components Breakdown
📧 Mail
MailIndex – Main interface
MailCompose – Editor with auto-save
MailList & MailPreview – Email list view
MailDetails – Full email view
MailFilter – Search & filter logic
MailFolderList – Navigation sidebar
📝 Notes
NoteIndex – Main layout and state
NoteAdd – Create new notes
NoteList & NotePreview – Grid view
NoteEdit – Modal editing UI
Dynamic Components – Different note types:
NoteTxt, NoteImg, NoteTodos, NoteVideo, NoteCanvas, NoteAudio
🧪 Future Enhancements
🔐 User authentication
☁️ Cloud storage integration
🧑‍🤝‍🧑 Collaborative notes
🏷️ Labels & categories
📱 Mobile support / PWA
🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to open an issue or submit a PR.

👏 Acknowledgements
Inspired by Google Keep and Gmail
Icons from Material Design & Font Awesome
Made with ❤️ by Shoham & Shmuel
